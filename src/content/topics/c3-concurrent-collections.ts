import type { TopicContent } from '@/domain/types'

export const concurrentCollectionsContent: TopicContent = {
  whatIsIt:
    'Concurrent collections in java.util.concurrent provide thread-safe shared data structures without external synchronization on every operation: ConcurrentHashMap, ConcurrentLinkedQueue, CopyOnWriteArrayList, BlockingQueue implementations, ConcurrentSkipListMap, and others — each tuned for specific access patterns.',
  whyExists:
    'Wrapping HashMap with synchronized or Collections.synchronizedMap serializes all operations. Concurrent structures use fine-grained locking, CAS, or copy-on-write to allow parallel reads/writes where safe, scaling server caches and work queues.',
  mentalModel:
    'Pick structure matching workload: CHM for concurrent map compute; BlockingQueue for producer-consumer; CopyOnWrite for read-rare write-rare listeners; avoid synchronized wrapper compound ops (iterate + put).',
  howItWorks: [
    {
      type: 'paragraph',
      text: 'ConcurrentHashMap (Java 8+): bin array with synchronized heads or tree bins; CAS for empty bin insert; computeIfAbsent atomic per key. BlockingQueue: put blocks when full, take blocks when empty — internal ReentrantLock + Conditions.',
    },
    {
      type: 'table',
      headers: ['Class', 'Pattern', 'Notes'],
      rows: [
        ['ConcurrentHashMap', 'Concurrent map', 'No lock on entire map; weakly consistent iterators'],
        ['ConcurrentLinkedQueue', 'Lock-free MPMC queue', 'Unbounded; size() approximate'],
        ['ArrayBlockingQueue', 'Bounded blocking', 'Fixed capacity, one lock'],
        ['LinkedBlockingQueue', 'Optional bounded', 'Two-lock design often'],
        ['CopyOnWriteArrayList', 'Copy on write', 'Read-heavy, snapshot iterators'],
        ['ConcurrentSkipListMap', 'Sorted concurrent', 'Navigable, log n'],
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Compound operations still need care',
      text: 'if (!map.containsKey(k)) map.put(k,v) is racy even on CHM — use putIfAbsent or computeIfAbsent. Iterators are weakly consistent — may or may not see concurrent adds.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'ConcurrentHashMap atomic compute',
      code: `ConcurrentHashMap<String, CacheEntry> cache = new ConcurrentHashMap<>();
cache.computeIfAbsent(key, k -> loadExpensive(k));
cache.merge(key, 1, Integer::sum);`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'CopyOnWrite for listeners',
      code: `CopyOnWriteArrayList<EventListener> listeners = new CopyOnWriteArrayList<>();
void onEvent(E e) {
  for (var l : listeners) l.handle(e); // snapshot iterator
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'CHM: sizeCtl controls initialization/resizing; forwarding nodes during transfer.',
        'Segmented design pre-Java 8 replaced by bin synchronized + tree bins.',
        'BlockingQueue: notFull/notEmpty conditions; priority variants use heaps.',
        'CopyOnWrite: array copy on mutating op — O(n) write, fast lock-free read.',
        'Weakly consistent iterators: no ConcurrentModificationException; reflect state at some point.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Better scalability than single lock wrappers',
      'Purpose-built APIs (putIfAbsent, offer/poll timeouts)',
      'Blocking queues integrate with executor pipelines',
    ],
    disadvantages: [
      'Higher memory/overhead than non-concurrent counterparts',
      'CopyOnWrite write expensive',
      'size() often approximate or O(n)',
    ],
    alternatives: [
      'Immutable persistent structures',
      'Partition data per thread then merge',
      'External store (Redis) for cross-process sharing',
    ],
    whenToUse: [
      'Shared cache maps in web servers',
      'Work queues between threads',
      'Listener lists read often, mutate rarely',
    ],
    whenNotToUse: [
      'Single-threaded access — use HashMap/ArrayList',
      'Heavy write CopyOnWrite lists',
    ],
  },
  failureModes: [
    'Assuming CHM iterator snapshot is point-in-time exact.',
    'Unbounded LinkedBlockingQueue OOM under slow consumers.',
    'CopyOnWrite under frequent writes — CPU/GC meltdown.',
    'Null keys/values in CHM (not permitted).',
  ],
  interview: {
    expectations: [
      'CHM vs synchronized HashMap internals',
      'BlockingQueue put/take semantics',
      'putIfAbsent / computeIfAbsent',
    ],
    commonQuestions: [
      'ConcurrentHashMap vs HashMap synchronized?',
      'When CopyOnWriteArrayList?',
      'Difference offer vs put on BlockingQueue?',
    ],
    followUps: [
      'CHM Java 8 structure?',
      'Weakly consistent iterator meaning?',
    ],
    misconceptions: [
      'Concurrent collections make all multi-key operations atomic',
      'CHM locks entire table (only bin/synchronized head)',
    ],
    traps: ['Using Collections.synchronizedMap for high concurrency cache'],
    strongSignals: [
      'Names bin/CAS/treeify for CHM',
      'offer vs put backpressure story',
      'computeIfAbsent for cache load',
    ],
  },
  keyTakeaways: [
    'Match collection to read/write/blocking pattern.',
    'CHM: fine-grained locking + CAS; atomic per-key ops.',
    'BlockingQueue for producer-consumer backpressure.',
    'CopyOnWrite: read-fast, write copies whole array.',
    'Use atomic map methods — not check-then-act externally.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Why not Collections.synchronizedMap for concurrent cache?',
      answerHint: 'Single lock serializes all ops; CHM allows parallel access to different bins.',
    },
    {
      level: 'intermediate',
      question: 'offer vs put on BlockingQueue?',
      answerHint: 'put blocks when full; offer returns false immediately (or timed).',
    },
    {
      level: 'advanced',
      question: 'How does ConcurrentHashMap computeIfAbsent help caching?',
      answerHint: 'Atomically loads once per key; avoids duplicate expensive load under races.',
    },
  ],
  flashcards: [
    { front: 'CHM null keys?', back: 'Not allowed — NullPointerException' },
    { front: 'CopyOnWrite trade-off', back: 'Fast reads, expensive writes copy array' },
    { front: 'Weakly consistent iterator', back: 'May reflect partial concurrent updates; no CME' },
  ],
  quickRevision: [
    'CHM bin locks + CAS',
    'computeIfAbsent / merge',
    'BlockingQueue put/take',
    'offer = non-blocking fail',
    'CopyOnWrite read-heavy',
    'No compound check-then-act',
    'Pick structure for pattern',
  ],
}

export const content = concurrentCollectionsContent
