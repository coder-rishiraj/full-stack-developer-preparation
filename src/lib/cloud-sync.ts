/**
 * Firestore persistence for one user's progress.
 *
 * Each account owns a single document `users/{uid}`:
 *   { stateJson: string, updatedAt: Timestamp, clientId: string, schema: 1 }
 *
 * The whole `UserState` is stored as a JSON string. That keeps arbitrary note /
 * capstone keys (which may contain characters Firestore field names dislike)
 * safe, and one read loads everything — well within the free tier.
 * Security rules (see `firestore.rules`) only let a user touch their own doc.
 */
import type { UserState } from '@/domain/types'
import { getFirebase } from '@/lib/firebase'

/** Identifies this browser tab so we can ignore our own snapshot echoes. */
export const CLIENT_ID =
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `c-${Math.random().toString(36).slice(2)}-${Date.now()}`

export type CloudSnapshot = {
  state: UserState
  updatedAt: number
  clientId?: string
}

/** Firestore documents are capped at 1 MiB; leave headroom for metadata. */
export const MAX_STATE_BYTES = 900_000

function parse(data: Record<string, unknown> | undefined): CloudSnapshot | null {
  if (!data || typeof data.stateJson !== 'string') return null
  try {
    const state = JSON.parse(data.stateJson) as UserState
    const ts = data.updatedAt as { toMillis?: () => number } | undefined
    return {
      state,
      updatedAt: typeof ts?.toMillis === 'function' ? ts.toMillis() : 0,
      clientId: typeof data.clientId === 'string' ? data.clientId : undefined,
    }
  } catch {
    return null
  }
}

export async function fetchCloudState(uid: string): Promise<CloudSnapshot | null> {
  const [{ db }, { doc, getDoc }] = await Promise.all([getFirebase(), import('firebase/firestore')])
  const snap = await getDoc(doc(db, 'users', uid))
  return snap.exists() ? parse(snap.data()) : null
}

export async function pushCloudState(uid: string, state: UserState): Promise<void> {
  const stateJson = JSON.stringify(state)
  if (stateJson.length > MAX_STATE_BYTES) {
    throw new Error(
      'Your saved progress is too large to sync (over ~900 KB). Trim long notes or export a backup from Settings.',
    )
  }
  const [{ db }, { doc, setDoc, serverTimestamp }] = await Promise.all([
    getFirebase(),
    import('firebase/firestore'),
  ])
  await setDoc(doc(db, 'users', uid), {
    stateJson,
    updatedAt: serverTimestamp(),
    clientId: CLIENT_ID,
    schema: 1,
  })
}

/**
 * Live updates from other devices/tabs. Our own writes (same CLIENT_ID or still
 * pending locally) are filtered out so they never bounce back into the store.
 */
export async function subscribeCloudState(
  uid: string,
  onRemote: (snapshot: CloudSnapshot) => void,
  onError: (error: Error) => void,
): Promise<() => void> {
  const [{ db }, { doc, onSnapshot }] = await Promise.all([getFirebase(), import('firebase/firestore')])
  return onSnapshot(
    doc(db, 'users', uid),
    (snap) => {
      if (snap.metadata.hasPendingWrites || !snap.exists()) return
      const parsed = parse(snap.data())
      if (!parsed || parsed.clientId === CLIENT_ID) return
      onRemote(parsed)
    },
    onError,
  )
}
