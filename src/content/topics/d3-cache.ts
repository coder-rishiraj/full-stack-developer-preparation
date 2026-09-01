import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Cache LLD designs a key-value store with eviction policy (LRU, LFU, TTL), capacity bounds, thread-safe get/put, and optional statistics — the in-memory library layer before distributed cache HLD.',
  whyExists:
    'Caching appears in every system design; LLD interview validates data structures (HashMap + doubly linked list for LRU), concurrency, and API design (`get`, `put`, `invalidate`) without jumping to Memcached cluster ops.',
  mentalModel:
    'Cache interface: get(key) returns Optional value or miss; put(key, value) may evict. EvictionPolicy decides victim when at capacity. LRU = move accessed node to head; evict tail. TTL wrapper decorates entries with expiry time.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Clarify: max size, TTL per entry?, thread safety, statistics (hit rate)?',
        'Classes: Cache (interface), LRUCache, LFUCache, EvictionPolicy, Node, CacheStats, TTLCache (decorator)',
        'LRU: HashMap key→Node + doubly linked list order',
        'get: miss → empty; hit → move to MRU, return value',
        'put: update or insert; evict LRU if size > capacity',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Interview walkthrough',
      text: '10 min LRU with HashMap + DLL diagram. 5 min concurrent version (ReentrantLock or synchronized). 5 min TTL decorator. Mention distributed: consistent hashing — d10-distributed-cache.',
    },
  ],
  architecture: {
    mermaid: `classDiagram
  class Cache {
    <<interface>>
    +get(K key): Optional~V~
    +put(K key, V value)
    +size(): int
  }
  class LRUCache {
    -map: HashMap
    -head: Node
    -tail: Node
    -capacity: int
    +get(K)
    +put(K,V)
  }
  class EvictionPolicy {
    <<interface>>
    +onAccess(Node)
    +evictCandidate(): Node
  }
  class TTLCache {
    -delegate: Cache
    -expiry: Map
  }
  Cache <|.. LRUCache
  TTLCache --> Cache`,
    caption: 'LRU core; TTL as decorator',
  },
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'LRU get/put O(1)',
      code: `public Optional<V> get(K key) {
  Node n = map.get(key);
  if (n == null) { stats.miss(); return Optional.empty(); }
  moveToHead(n);
  stats.hit();
  return Optional.of(n.value);
}

public void put(K key, V value) {
  if (map.containsKey(key)) {
    Node n = map.get(key);
    n.value = value;
    moveToHead(n);
    return;
  }
  Node n = new Node(key, value);
  map.put(key, n);
  addToHead(n);
  if (map.size() > capacity) {
    Node lru = removeTail();
    map.remove(lru.key);
  }
}`,
    },
  ],
  implementation: [
    {
      language: 'java',
      caption: 'Thread-safe wrapper',
      code: `public class ConcurrentLRUCache<K,V> implements Cache<K,V> {
  private final LRUCache<K,V> inner = new LRUCache<>(capacity);
  private final ReentrantLock lock = new ReentrantLock();

  public Optional<V> get(K key) {
    lock.lock();
    try { return inner.get(key); }
    finally { lock.unlock(); }
  }
}`,
    },
    {
      language: 'java',
      caption: 'TTL decorator',
      code: `public Optional<V> get(K key) {
  if (isExpired(key)) { delegate.invalidate(key); return Optional.empty(); }
  return delegate.get(key);
}`,
    },
  ],
  tradeoffs: {
    advantages: ['LRU fits temporal locality', 'Decorator adds TTL without changing LRU', 'Testable pure in-memory'],
    disadvantages: ['LRU not optimal for scan workloads', 'Single-node cache — no coherence across JVMs'],
    alternatives: ['Caffeine production cache', 'LFU for frequency skew', 'Distributed Redis (HLD)'],
    whenToUse: ['LLD interviews', 'Embedded library cache'],
    whenNotToUse: ['Shared cache across fleet without distributed layer'],
  },
  failureModes: [
    'LRU list corruption if DLL pointers wrong',
    'Thundering herd on mass TTL expiry',
    'Unbounded cache if capacity not enforced',
    'Stale data if no invalidation strategy with source of truth',
  ],
  interview: {
    expectations: ['O(1) LRU structure explained', 'Thread safety', 'TTL extension'],
    commonQuestions: ['Design LRU cache', 'Concurrent cache?'],
    followUps: ['LFU vs LRU?', 'Cache aside pattern?'],
    misconceptions: ['PriorityQueue gives LRU — it does not'],
    traps: ['O(n) eviction scan'],
    strongSignals: ['HashMap + doubly linked list diagram', 'CacheStats hit/miss'],
  },
  keyTakeaways: [
    'LRU = HashMap + doubly linked list.',
    'get/put both O(1) with head/tail pointers.',
    'EvictionPolicy enables LFU swap.',
    'TTL decorator wraps any Cache.',
    'Distributed caching is separate HLD topic.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'LRU data structures?', answerHint: 'HashMap for lookup + DLL for usage order.' },
    { level: 'intermediate', question: 'Why doubly linked list?', answerHint: 'Remove arbitrary node in O(1) when moving or evicting.' },
    { level: 'advanced', question: 'LFU vs LRU?', answerHint: 'LFU keeps frequently used; LRU keeps recently used; scan hurts LRU.' },
  ],
  flashcards: [
    { front: 'LRU evict', back: 'Remove tail (least recently used) when over capacity' },
    { front: 'get on hit', back: 'Move node to head (MRU)' },
    { front: 'TTL decorator', back: 'Wrap cache; check expiry on get' },
    { front: 'O(1) LRU', back: 'HashMap + DLL with head/tail' },
  ],
  quickRevision: [
    'Map + DLL',
    'moveToHead on access',
    'Evict tail on overflow',
    'Lock for thread safety',
    'TTL decorator pattern',
  ],
}
