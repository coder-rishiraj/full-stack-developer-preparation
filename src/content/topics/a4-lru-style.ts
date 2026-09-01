import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'LRU-style linked-list manipulation maintains recency order with a doubly linked list plus HashMap: get/put move a node to the MRU side; eviction removes the LRU node before the tail sentinel in O(1) average time.',
  whyExists:
    'Caches, session stores, and “most recently used” buffers need fast lookup and fast promotion/eviction. Array lists fail O(n) moves; HashMap alone loses order—combining both is the standard design pattern.',
  mentalModel:
    'Stack of plates from MRU (top) to LRU (bottom): touching a plate pulls it to top; when full, discard the bottom plate. HashMap remembers which stack slot holds each key.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Structure: HashMap<K, Node> + doubly linked list between head and tail sentinels.',
        'Head.next = MRU; tail.prev = LRU candidate for eviction.',
        'get(key): if missing return -1; else unlink node, insert after head (promote).',
        'put(key,val): if exists update val and promote; else create node at MRU; if size>capacity evict tail.prev.',
        'All unlink/insert operations are four-pointer updates O(1).',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Java shortcut',
      text: 'LinkedHashMap(accessOrder=true) implements LRU with removeEldestEntry override—know it, but interviews expect explicit DLL + map.',
    },
  ],
  architecture: {
    mermaid: `flowchart LR
  Map[key to node] --> Get[get key]
  Get --> Promote[move to MRU after head]
  Put[put key] --> Full{size > cap?}
  Full -->|yes| Evict[remove tail.prev]`,
    caption: 'LRU get/put flow',
  },
  example: [
    {
      type: 'paragraph',
      text: 'Capacity 2: put(1,1), put(2,2), get(1) promotes 1; put(3,3) evicts 2; get(2) returns -1.',
    },
    {
      type: 'table',
      headers: ['op', 'order MRU→LRU', 'map'],
      rows: [
        ['put 1', '1', '{1}'],
        ['put 2', '2,1', '{1,2}'],
        ['get 1', '1,2', '{1,2}'],
        ['put 3 evict 2', '3,1', '{1,3}'],
      ],
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'LRU cache skeleton',
      code: `class LRUCache {
    class Node { int k, v; Node prev, next; }
    final int cap;
    Map<Integer, Node> map = new HashMap<>();
    Node head = new Node(0,0), tail = new Node(0,0);
    LRUCache(int capacity) {
        cap = capacity;
        head.next = tail; tail.prev = head;
    }
    void insertAfterHead(Node n) { /* link after head */ }
    void remove(Node n) { /* unlink */ }
    public int get(int key) { /* map, promote, return v or -1 */ }
    public void put(int key, int value) { /* update or insert; evict */ }
}`,
    },
    {
      language: 'java',
      caption: 'Insert after head + unlink',
      code: `void insertAfterHead(Node node) {
    node.prev = head;
    node.next = head.next;
    head.next.prev = node;
    head.next = node;
}
void remove(Node node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
}`,
    },
  ],
  implementation: [
    {
      language: 'java',
      caption: 'LRU get and put',
      code: `public int get(int key) {
    if (!map.containsKey(key)) return -1;
    Node node = map.get(key);
    remove(node);
    insertAfterHead(node);
    return node.v;
}
public void put(int key, int value) {
    if (map.containsKey(key)) {
        Node node = map.get(key);
        node.v = value;
        remove(node);
        insertAfterHead(node);
        return;
    }
    Node node = new Node(key, value);
    map.put(key, node);
    insertAfterHead(node);
    if (map.size() > cap) {
        Node lru = tail.prev;
        remove(lru);
        map.remove(lru.k);
    }
}`,
    },
  ],
  complexity: {
    best: 'O(1) get/put average HashMap',
    average: 'O(1) get/put',
    worst: 'O(1) per op; HashMap worst-case O(n) rare',
    space: 'O(capacity) nodes + map entries',
  },
  patternRecognition: [
    'Design LRU cache / least recently used eviction.',
    'Move-to-front on access with capacity limit.',
    'Ordered map with O(1) delete arbitrary node.',
    'Similar: LFU needs frequency buckets + DLL per freq.',
    'Browser back/forward with DLL (variant).',
  ],
  commonMistakes: [
    'Evicting from wrong end (MRU instead of LRU).',
    'put existing key without promoting to MRU.',
    'Forgetting map.remove on eviction.',
    'Not updating map when re-linking nodes.',
    'Off-by-one capacity check (size > cap vs >=).',
  ],
  variations: [
    'LFU cache (multiple DLL lists by frequency)',
    'LinkedHashMap one-liner in Java',
    'Time-based expiry with TreeMap + DLL',
    'All O(1) LFU with min freq tracking',
  ],
  tradeoffs: {
    advantages: [
      'True O(1) get/put amortized',
      'Exact LRU semantics',
      'Classic system design + DSA crossover',
    ],
    disadvantages: [
      'More code than LinkedHashMap',
      'Not thread-safe without locks',
      'Pointer-heavy to implement under pressure',
    ],
    alternatives: ['LinkedHashMap accessOrder', 'Approximate LRU with TTL only', 'LFU when frequency matters more'],
    whenToUse: ['Bounded cache with recency bias', 'Interview “design LRU”'],
    whenNotToUse: ['Simple FIFO queue suffices', 'Distributed cache—need sharding not local DLL'],
  },
  failureModes: [
    'Broken DLL invariant → infinite loop on traverse.',
    'Stale map entry after eviction → ghost keys.',
  ],
  interview: {
    expectations: [
      'Draw map + DLL with sentinels',
      'Implement get/put with promote and evict',
      'State O(1) and O(capacity) space',
    ],
    commonQuestions: [
      'LRU Cache',
      'Design In-Memory Cache',
    ],
    followUps: ['Thread safety?', 'LFU differences?', 'Distributed LRU?'],
    misconceptions: ['PriorityQueue alone gives LRU'],
    traps: ['Update without move-to-front', 'Evict head.next instead of tail.prev'],
    strongSignals: ['Sentinel nodes', 'Separate unlink/insert helpers', 'Mentions LinkedHashMap tradeoff'],
  },
  keyTakeaways: [
    'HashMap + doubly linked list = O(1) LRU.',
    'MRU after head; evict tail.prev.',
    'get and put both promote existing keys.',
    'unlink + insertAfterHead helpers reduce bugs.',
    'LinkedHashMap(accessOrder) for production Java.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Why doubly linked list for LRU?',
      answerHint: 'O(1) remove arbitrary node when promoted or evicted; singly needs O(n) find prev.',
    },
    {
      level: 'intermediate',
      question: 'What happens on get for existing key?',
      answerHint: 'Remove node from current position, insert after head (MRU), return value.',
    },
    {
      level: 'advanced',
      question: 'How does LFU differ structurally from LRU?',
      answerHint: 'LFU tracks frequencies—often map key→node plus freq→DLL of keys; evict min freq LRU among them.',
    },
  ],
  flashcards: [
    { front: 'LRU eviction node', back: 'tail.prev (before tail sentinel).' },
    { front: 'LRU promote position', back: 'Insert immediately after head sentinel.' },
  ],
  quickRevision: [
    'Map + DLL + sentinels',
    'get/put → promote MRU',
    'Evict tail.prev',
    'unlink helpers O(1)',
    'Update map on evict',
    'LinkedHashMap accessOrder',
  ],
}
