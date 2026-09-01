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

export async function loadUserState(): Promise<UserState | null> {
  try {
    const db = await getDb()
    return (await db.get(STORE, 'state')) ?? null
  } catch {
    return null
  }
}

export async function saveUserState(state: UserState): Promise<void> {
  const db = await getDb()
  await db.put(STORE, state, 'state')
}

export async function clearUserState(): Promise<void> {
  const db = await getDb()
  await db.delete(STORE, 'state')
}
