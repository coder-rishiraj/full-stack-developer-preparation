import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type { UserState } from '@/domain/types'

const DB_NAME = 'se-prep'
const DB_VERSION = 1
const STORE = 'user'

interface SePrepDB extends DBSchema {
  user: {
    key: string
    value: UserState
  }
}

let dbPromise: Promise<IDBPDatabase<SePrepDB>> | null = null

function getDb() {
  if (!dbPromise) {
    dbPromise = openDB<SePrepDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE)) {
          db.createObjectStore(STORE)
        }
      },
    })
  }
  return dbPromise
}

/** IndexedDB key for logged-out progress on this device. */
export const GUEST_KEY = 'state'

/** Local cache key for a signed-in account (instant load + offline use). */
export function accountKey(uid: string): string {
  return `state:${uid}`
}

export async function loadUserState(key: string = GUEST_KEY): Promise<UserState | null> {
  try {
    const db = await getDb()
    return (await db.get(STORE, key)) ?? null
  } catch {
    return null
  }
}

export async function saveUserState(state: UserState, key: string = GUEST_KEY): Promise<void> {
  const db = await getDb()
  await db.put(STORE, state, key)
}

export async function clearUserState(key: string = GUEST_KEY): Promise<void> {
  const db = await getDb()
  await db.delete(STORE, key)
}
