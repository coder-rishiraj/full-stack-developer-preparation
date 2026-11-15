import { create } from 'zustand'
import type { User } from 'firebase/auth'
import { getFirebase, isCloudConfigured, rememberSignedInUid } from '@/lib/firebase'
import { fetchCloudState, pushCloudState, subscribeCloudState } from '@/lib/cloud-sync'
import { GUEST_KEY, accountKey, clearUserState, loadUserState } from '@/lib/idb'
import { hasMeaningfulProgress, mergeUserStates } from '@/domain/merge-user-state'
import {
  currentStorageKey,
  flushPersist,
  normalizeUserState,
  setUserStateChangeListener,
  snapshotUserState,
  useUserStore,
} from '@/stores/user-store'
import type { UserState } from '@/domain/types'

export type AuthStatus = 'disabled' | 'loading' | 'signed_out' | 'signed_in'
export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'offline' | 'error'

export type AccountUser = {
  uid: string
  email: string | null
  displayName: string | null
  photoURL: string | null
  emailVerified: boolean
  /** 'password' | 'google.com' | … */
  provider: string
}

type AuthStore = {
  status: AuthStatus
  user: AccountUser | null
  syncStatus: SyncStatus
  syncError: string | null
  lastSyncedAt: number | null
  /** Email a confirmation link was sent to during this session (shown in the verify banner). */
  verificationSentTo: string | null
  /** Epoch ms of the last confirmation email, for the resend cooldown. */
  verificationSentAt: number | null
  init: () => void
  signInWithGoogle: () => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<void>
  signUpWithEmail: (name: string, email: string, password: string) => Promise<void>
  sendPasswordReset: (email: string) => Promise<void>
  resendVerification: () => Promise<void>
  /** Re-reads the account from Firebase (e.g. after the user clicks the email link). */
  refreshUser: () => Promise<void>
  signOut: () => Promise<void>
  syncNow: () => Promise<void>
}

const PUSH_DEBOUNCE_MS = 1500
const pendingFlagKey = (uid: string) => `se-prep:pending-sync:${uid}`

function setPendingFlag(uid: string, pending: boolean) {
  try {
    if (pending) localStorage.setItem(pendingFlagKey(uid), '1')
    else localStorage.removeItem(pendingFlagKey(uid))
  } catch {
    /* storage unavailable — only affects offline recovery */
  }
}

function hasPendingFlag(uid: string): boolean {
  try {
    return localStorage.getItem(pendingFlagKey(uid)) === '1'
  } catch {
    return false
  }
}

function toAccountUser(u: User): AccountUser {
  return {
    uid: u.uid,
    email: u.email,
    displayName: u.displayName,
    photoURL: u.photoURL,
    emailVerified: u.emailVerified,
    provider: u.providerData[0]?.providerId ?? 'password',
  }
}

/** Turns Firebase error codes into messages a learner can act on. */
/** Seconds a user must wait between confirmation emails (Firebase also rate-limits). */
export const VERIFY_RESEND_COOLDOWN_S = 60

/** Where the confirmation link sends people back to once verified. */
function verificationContinueUrl(): string | undefined {
  if (typeof window === 'undefined') return undefined
  return `${window.location.origin}/?verified=1`
}

export function authErrorMessage(error: unknown): string {
  const code = (error as { code?: string })?.code ?? ''
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Incorrect email or password.'
    case 'auth/invalid-email':
      return 'That email address doesn’t look right.'
    case 'auth/email-already-in-use':
      return 'An account already exists for this email. Sign in instead.'
    case 'auth/weak-password':
      return 'Choose a stronger password (at least 8 characters).'
    case 'auth/too-many-requests':
      return 'Too many attempts. Wait a minute and try again, or reset your password.'
    case 'auth/network-request-failed':
      return 'Network error — check your connection and try again.'
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return 'Sign-in window was closed before finishing.'
    case 'auth/account-exists-with-different-credential':
      return 'This email is already registered with a different sign-in method.'
    case 'auth/unauthorized-domain':
      return 'This site’s domain isn’t authorised in Firebase (Authentication → Settings → Authorized domains).'
    case 'auth/operation-not-allowed':
      return 'This sign-in method isn’t enabled in the Firebase console yet.'
    default:
      return error instanceof Error ? error.message : 'Something went wrong. Please try again.'
  }
}

// ---- sync controller (module state; one active account per tab) ----------

let initialized = false
let activeUid: string | null = null
let syncGeneration = 0
let unsubscribeRemote: (() => void) | null = null
let pushTimer: ReturnType<typeof setTimeout> | null = null
let pendingState: UserState | null = null
let pushInFlight: Promise<void> | null = null

export const useAuthStore = create<AuthStore>((set, get) => {
  async function pushNow(): Promise<void> {
    if (pushTimer) {
      clearTimeout(pushTimer)
      pushTimer = null
    }
    const uid = activeUid
    const state = pendingState
    if (!uid || !state) return pushInFlight ?? undefined
    pendingState = null
    set({ syncStatus: 'syncing' })
    const run = (async () => {
      try {
        await pushCloudState(uid, state)
        if (uid !== activeUid) return
        if (!pendingState) setPendingFlag(uid, false)
        set({ syncStatus: 'synced', syncError: null, lastSyncedAt: Date.now() })
      } catch (error) {
        if (uid !== activeUid) return
        // Keep the newest unsent state so the next attempt sends it.
        pendingState ??= state
        const offline = typeof navigator !== 'undefined' && navigator.onLine === false
        set({
          syncStatus: offline ? 'offline' : 'error',
          syncError: offline ? null : authErrorMessage(error),
        })
      }
    })()
    pushInFlight = run
    await run
    if (pushInFlight === run) pushInFlight = null
  }

  function queuePush(state: UserState, immediate = false) {
    if (!activeUid) return
    pendingState = state
    setPendingFlag(activeUid, true)
    if (pushTimer) clearTimeout(pushTimer)
    if (immediate) {
      void pushNow()
      return
    }
    set({ syncStatus: 'syncing' })
    pushTimer = setTimeout(() => void pushNow(), PUSH_DEBOUNCE_MS)
  }

  function teardownSync() {
    syncGeneration++
    setUserStateChangeListener(null)
    unsubscribeRemote?.()
    unsubscribeRemote = null
    if (pushTimer) clearTimeout(pushTimer)
    pushTimer = null
    pendingState = null
  }

  async function startSync(uid: string) {
    const gen = ++syncGeneration
    set({ syncStatus: 'syncing', syncError: null })

    let cloudFailed = false
    const [cloud, cached, guestRaw] = await Promise.all([
      fetchCloudState(uid).catch(() => {
        cloudFailed = true
        return null
      }),
      loadUserState(accountKey(uid)),
      loadUserState(GUEST_KEY),
    ])
    if (gen !== syncGeneration) return

    const guest = normalizeUserState(guestRaw)
    const unsentLocal = hasPendingFlag(uid) && cached
    // Edits made offline that never reached the cloud win over the cloud copy.
    let base: UserState | null = unsentLocal
      ? normalizeUserState(cached)
      : cloud
        ? normalizeUserState(cloud.state)
        : cached
          ? normalizeUserState(cached)
          : null
    let needPush = Boolean(unsentLocal) || (!cloud && !cloudFailed)

    if (hasMeaningfulProgress(guest)) {
      // First sign-in on this device: carry guest progress into the account.
      base = base ? mergeUserStates(base, guest) : guest
      needPush = true
      await clearUserState(GUEST_KEY)
      if (gen !== syncGeneration) return
    }

    useUserStore.getState().loadAccount(accountKey(uid), base)
    setUserStateChangeListener((state) => queuePush(state))

    if (cloudFailed) {
      set({ syncStatus: 'offline' })
      if (needPush) pendingState = snapshotUserState()
    } else if (needPush) {
      queuePush(snapshotUserState(), true)
    } else {
      set({ syncStatus: 'synced', lastSyncedAt: cloud?.updatedAt || Date.now() })
    }

    try {
      const unsubscribe = await subscribeCloudState(
        uid,
        (snapshot) => {
          if (gen !== syncGeneration || pendingState || pushTimer) return
          useUserStore.getState().applyRemoteState(snapshot.state)
          set({ syncStatus: 'synced', syncError: null, lastSyncedAt: snapshot.updatedAt || Date.now() })
        },
        () => {
          if (gen === syncGeneration) set({ syncStatus: 'offline' })
        },
      )
      if (gen !== syncGeneration) unsubscribe()
      else unsubscribeRemote = unsubscribe
    } catch {
      /* live updates are a bonus; pushes still work */
    }
  }

  async function handleUser(u: User | null) {
    if (!u) {
      activeUid = null
      rememberSignedInUid(null)
      teardownSync()
      set({ status: 'signed_out', user: null, syncStatus: 'idle', syncError: null, lastSyncedAt: null })
      // Signed out now, or a remembered session expired: leave the account's data.
      if (currentStorageKey() !== GUEST_KEY) {
        // Signed out: show this device's guest progress (empty after a merge).
        const guest = await loadUserState(GUEST_KEY)
        useUserStore.getState().loadAccount(GUEST_KEY, guest)
      }
      return
    }
    set({ status: 'signed_in', user: toAccountUser(u) })
    if (activeUid === u.uid) return
    if (activeUid) teardownSync()
    flushPersist()
    activeUid = u.uid
    rememberSignedInUid(u.uid)
    await startSync(u.uid)
  }

  return {
    status: isCloudConfigured ? 'loading' : 'disabled',
    user: null,
    syncStatus: 'idle',
    syncError: null,
    lastSyncedAt: null,
    verificationSentTo: null,
    verificationSentAt: null,

    init: () => {
      if (initialized || !isCloudConfigured) return
      initialized = true
      void (async () => {
        try {
          const [{ auth }, { onAuthStateChanged, getRedirectResult }] = await Promise.all([
            getFirebase(),
            import('firebase/auth'),
          ])
          void getRedirectResult(auth).catch(() => undefined)
          onAuthStateChanged(auth, (u) => void handleUser(u))
        } catch {
          set({ status: 'signed_out' })
        }
        if (typeof window !== 'undefined') {
          window.addEventListener('online', () => {
            if (pendingState) void pushNow()
          })
          const flushOnHide = () => {
            flushPersist()
            if (pendingState) void pushNow()
          }
          window.addEventListener('pagehide', flushOnHide)
          document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') flushOnHide()
            // Coming back from the inbox: pick up a just-confirmed email.
            else if (get().user && !get().user!.emailVerified) void get().refreshUser()
          })
          if (new URLSearchParams(window.location.search).has('verified')) {
            setTimeout(() => void get().refreshUser(), 1500)
          }
        }
      })()
    },

    signInWithGoogle: async () => {
      const [{ auth }, mod] = await Promise.all([getFirebase(), import('firebase/auth')])
      const provider = new mod.GoogleAuthProvider()
      provider.setCustomParameters({ prompt: 'select_account' })
      try {
        await mod.signInWithPopup(auth, provider)
      } catch (error) {
        const code = (error as { code?: string }).code
        if (code === 'auth/popup-blocked' || code === 'auth/operation-not-supported-in-this-environment') {
          await mod.signInWithRedirect(auth, provider)
          return
        }
        throw error
      }
    },

    signInWithEmail: async (email, password) => {
      const [{ auth }, { signInWithEmailAndPassword }] = await Promise.all([
        getFirebase(),
        import('firebase/auth'),
      ])
      await signInWithEmailAndPassword(auth, email.trim(), password)
    },

    signUpWithEmail: async (name, email, password) => {
      const [{ auth }, mod] = await Promise.all([getFirebase(), import('firebase/auth')])
      const cred = await mod.createUserWithEmailAndPassword(auth, email.trim(), password)
      if (name.trim()) await mod.updateProfile(cred.user, { displayName: name.trim() })
      set({ user: toAccountUser(cred.user) })
      // Signup confirmation email (Firebase sends it for free). The account already
      // exists at this point, so a failure here shouldn't fail the signup — the
      // verify banner lets the user resend.
      try {
        const url = verificationContinueUrl()
        await mod.sendEmailVerification(cred.user, url ? { url } : undefined)
        set({ verificationSentTo: cred.user.email, verificationSentAt: Date.now() })
      } catch {
        set({ verificationSentTo: null, verificationSentAt: null })
      }
    },

    sendPasswordReset: async (email) => {
      const [{ auth }, { sendPasswordResetEmail }] = await Promise.all([
        getFirebase(),
        import('firebase/auth'),
      ])
      await sendPasswordResetEmail(auth, email.trim())
    },

    resendVerification: async () => {
      const [{ auth }, { sendEmailVerification }] = await Promise.all([
        getFirebase(),
        import('firebase/auth'),
      ])
      const user = auth.currentUser
      if (!user) return
      const url = verificationContinueUrl()
      await sendEmailVerification(user, url ? { url } : undefined)
      set({ verificationSentTo: user.email, verificationSentAt: Date.now() })
    },

    refreshUser: async () => {
      const { auth } = await getFirebase()
      const user = auth.currentUser
      if (!user) return
      try {
        await user.reload()
        set({ user: toAccountUser(user) })
      } catch {
        /* offline — try again next time */
      }
    },

    signOut: async () => {
      // Make sure the last edits reach the cloud before leaving the account.
      flushPersist()
      if (pendingState || pushInFlight) {
        await Promise.race([pushNow(), new Promise((r) => setTimeout(r, 4000))])
      }
      const [{ auth }, { signOut }] = await Promise.all([getFirebase(), import('firebase/auth')])
      await signOut(auth)
    },

    syncNow: async () => {
      if (!activeUid || get().status !== 'signed_in') return
      flushPersist()
      queuePush(snapshotUserState(), true)
      await pushInFlight
    },
  }
})
