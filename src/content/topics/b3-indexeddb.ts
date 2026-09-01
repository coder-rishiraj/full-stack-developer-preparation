import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'IndexedDB is the browser’s asynchronous, transactional, origin-scoped database for structured data — stores objects, arrays, blobs, and files with indexes and cursors, designed for offline apps and large client-side caches far beyond localStorage limits.',
  whyExists:
    'localStorage is sync, string-only, and ~5MB. Apps need offline-first UX, draft sync, and cached API payloads at MB–GB scale. IndexedDB provides durable structured storage without blocking the main thread on every operation.',
  mentalModel:
    'Mini NoSQL in the browser: databases → object stores (tables) → records keyed by keyPath or out-of-line key. Transactions are the unit of work — all reads/writes happen inside tx. Version upgrades via onupgradeneeded migrate schema.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'open(name, version) returns IDBOpenDBRequest; onupgradeneeded creates/changes stores.',
        'Object stores hold records; createIndex for secondary lookups.',
        'Transactions: readonly or readwrite; auto-commit when idle.',
        'Requests (get, put, delete, cursor) are async — success/error events.',
        'Structured clone algorithm serializes values (no functions, mostly).',
      ],
    },
    {
      type: 'mermaid',
      caption: 'IndexedDB hierarchy',
      diagram: `flowchart TB
  DB[(Database)]
  DB --> S1[Object store: users]
  DB --> S2[Object store: cache]
  S1 --> I1[Index: email]
  S2 --> R[Records / blobs]`,
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'Use a wrapper in production',
      text: 'Raw IDB API is verbose. Libraries like idb, Dexie, or TanStack Query persist layer reduce boilerplate and version migration pain.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'javascript',
      caption: 'Minimal open, upgrade, put, get',
      code: `function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('app-db', 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains('notes')) {
        db.createObjectStore('notes', { keyPath: 'id' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function saveNote(note) {
  const db = await openDB();
  await new Promise((res, rej) => {
    const tx = db.transaction('notes', 'readwrite');
    tx.objectStore('notes').put(note);
    tx.oncomplete = res;
    tx.onerror = () => rej(tx.error);
  });
}`,
    },
    {
      type: 'code',
      language: 'javascript',
      caption: 'Offline cache pattern with React Query',
      code: `// persistQueryClient({ queryClient, persister: createAsyncStoragePersister({
//   storage: { getItem, setItem, removeItem backed by IndexedDB }
// })})`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Quota shared with other origin storage; prompt or eviction under pressure.',
        'Version change blocks until onupgradeneeded completes — plan migrations.',
        'Cannot run two readwrite txs on same store concurrently.',
        'Blobs and File objects stored efficiently — good for media offline.',
        'Service Workers commonly use IndexedDB for cache metadata.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Large async structured storage',
      'Indexes and cursors for query patterns',
      'Works in Workers for off-main-thread access',
    ],
    disadvantages: [
      'Verbose low-level API',
      'Schema migrations require careful versioning',
      'Still origin-scoped and XSS-readable',
      'Safari/private mode quota quirks',
    ],
    alternatives: [
      'Cache API for HTTP response pairs',
      'localStorage for tiny prefs',
      'OPFS (Origin Private File System) for file-like workloads',
    ],
    whenToUse: [
      'Offline-first apps, PWA data layer',
      'Large client caches (messages, catalog)',
      'Persisting React Query / Redux offline',
    ],
    whenNotToUse: [
      'Simple theme flag — localStorage enough',
      'Secrets — still readable by JS',
      'Relational joins — use server DB or WASM SQLite',
    ],
  },
  failureModes: [
    'Missing onupgradeneeded migration — silent missing stores.',
    'Transaction auto-closes if await without keeping tx alive (classic bug).',
    'QuotaExceededError — need eviction strategy.',
    'Safari tab discard loses in-memory handles; reopen DB.',
    'Storing non-cloneable types (DOM nodes, functions) throws.',
  ],
  production: {
    performance: ['Batch writes in single transaction; use cursors for large scans'],
    reliability: ['Versioned schema migrations; export/import for backup'],
    maintainability: ['Wrap with idb/Dexie; centralize store names'],
    security: ['No auth tokens; encrypt sensitive fields if threat model requires'],
  },
  interview: {
    expectations: [
      'Async transactional object store DB',
      'vs localStorage size and sync model',
      'onupgradeneeded for schema',
    ],
    commonQuestions: [
      'What is IndexedDB?',
      'IndexedDB vs localStorage?',
      'How do transactions work?',
    ],
    followUps: [
      'PWA offline architecture?',
      'How persist React Query cache?',
    ],
    misconceptions: [
      'IndexedDB is SQL (it is object store NoSQL)',
      'Synchronous like localStorage',
      'Unlimited storage',
    ],
    traps: ['Forgetting transaction lifetime when using async/await'],
    strongSignals: [
      'Transactions required for all ops',
      'Version upgrade hook',
      'Structured clone limits',
      'Wrapper libraries in production',
    ],
  },
  keyTakeaways: [
    'Async origin-scoped structured database in browser.',
    'Object stores + indexes; transactional access.',
    'Large data vs localStorage; non-blocking requests.',
    'onupgradeneeded for schema migrations.',
    'Use wrappers (idb/Dexie) in real apps.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'IndexedDB vs localStorage?',
      answerHint: 'IDB: async, structured, large; localStorage: sync strings ~5MB.',
    },
    {
      level: 'intermediate',
      question: 'What is onupgradeneeded?',
      answerHint: 'Fires on version bump to create/alter object stores and indexes.',
    },
    {
      level: 'advanced',
      question: 'Common async/await pitfall with IDB transactions?',
      answerHint: 'Transaction commits when sync code finishes — await inside may close tx early; use library or tx lifetime patterns.',
    },
  ],
  flashcards: [
    { front: 'IndexedDB model', back: 'DB → object stores → records + indexes' },
    { front: 'Transactions', back: 'All reads/writes in readonly or readwrite tx' },
    { front: 'onupgradeneeded', back: 'Schema migration on version increase' },
  ],
  quickRevision: [
    'Async structured origin DB',
    'Object stores not SQL tables',
    'Transactions mandatory',
    'Version + onupgradeneeded',
    'Large offline/PWA cache',
    'Use idb/Dexie wrappers',
  ],
}
