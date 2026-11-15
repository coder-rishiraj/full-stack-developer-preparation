/**
 * Firebase bootstrap (free Spark plan: Auth + Firestore).
 *
 * The SDK is loaded lazily with dynamic imports so guests — and builds without
 * Firebase configured — never download it. When the `VITE_FIREBASE_*` env vars
 * are missing, `isCloudConfigured` is false and the app runs exactly as before:
 * progress stays in this browser's IndexedDB only.
 */
import type { FirebaseApp } from 'firebase/app'
import type { Auth } from 'firebase/auth'
import type { Firestore } from 'firebase/firestore'

const env = import.meta.env

const config = {
  apiKey: env.VITE_FIREBASE_API_KEY as string | undefined,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
  projectId: env.VITE_FIREBASE_PROJECT_ID as string | undefined,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET as string | undefined,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID as string | undefined,
  appId: env.VITE_FIREBASE_APP_ID as string | undefined,
}

export const isCloudConfigured = Boolean(
  config.apiKey && config.authDomain && config.projectId && config.appId,
)

export type FirebaseHandles = {
  app: FirebaseApp
  auth: Auth
  db: Firestore
}

let handlesPromise: Promise<FirebaseHandles> | null = null

export function getFirebase(): Promise<FirebaseHandles> {
  if (!isCloudConfigured) {
    return Promise.reject(new Error('Firebase is not configured'))
  }
  if (!handlesPromise) {
    handlesPromise = (async () => {
      const [{ initializeApp }, authMod, { getFirestore }] = await Promise.all([
        import('firebase/app'),
        import('firebase/auth'),
        import('firebase/firestore'),
      ])
      const app = initializeApp(config)
      const auth = authMod.initializeAuth(app, {
        persistence: [authMod.indexedDBLocalPersistence, authMod.browserLocalPersistence],
        popupRedirectResolver: authMod.browserPopupRedirectResolver,
      })
      return { app, auth, db: getFirestore(app) }
    })()
  }
  return handlesPromise
}

const LAST_UID_KEY = 'se-prep:last-uid'

/**
 * Remembers which account was signed in on this device so the first render can
 * load that account's cached progress instantly, without waiting for the
 * Firebase SDK to download and restore the session.
 */
export function rememberSignedInUid(uid: string | null): void {
  try {
    if (uid) localStorage.setItem(LAST_UID_KEY, uid)
    else localStorage.removeItem(LAST_UID_KEY)
  } catch {
    /* storage unavailable — first render just shows guest data briefly */
  }
}

export function getRememberedUid(): string | null {
  if (!isCloudConfigured) return null
  try {
    return localStorage.getItem(LAST_UID_KEY)
  } catch {
    return null
  }
}
