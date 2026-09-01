import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'A doubly linked list adds a prev pointer to each node, enabling O(1) deletion and insertion when you already hold the node reference, and O(1) backward traversal from tail.',
  whyExists:
    'LRU caches, browser history, and undo stacks need removing arbitrary nodes and moving them to front/back without scanning from head. Doubly links make prev accessible for unlink in constant time.',
  mentalModel:
    'Two-way train couplings: from any car you can walk forward or backward. Unhooking a car updates both neighbors’ pointers—never leave a dangling prev or next.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Node fields: val, next, prev.',
        'Unlink node x: x.prev.next = x.next; if (x.next != null) x.next.prev = x.prev.',
        'Insert after node a: node.prev = a; node.next = a.next; wire a.next and node.next.prev.',
        'Sentinel head/tail dummy nodes simplify edge cases (empty list, remove at ends).',
        'HashMap from key → node for O(1) lookup in LRU-style problems.',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Four-pointer unlink',
      text: 'Always update both sides: prev’s next AND next’s prev. Order matters when next or prev is null—branch explicitly.',
    },
  ],
  architecture: {
    mermaid: `flowchart LR
  S[head sentinel] <--> N1 <--> N2 <--> T[tail sentinel]`,
    caption: 'Doubly linked list with sentinels',
  },
  example: [
    {
      type: 'paragraph',
      text: 'Remove node B from A↔B↔C: A.next = C; C.prev = A. B’s pointers cleared optionally.',
    },
    {
      type: 'table',
      headers: ['operation', 'singly', 'doubly (have node)'],
      rows: [
        ['delete known node', 'O(n) find', 'O(1) unlink'],
        ['insert after known', 'O(1)', 'O(1)'],
        ['traverse backward', 'O(n) from tail only if stored', 'O(1) step with prev'],
      ],
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Doubly linked node',
      code: `class Node {
    int val;
    Node prev, next;
    Node(int v) { val = v; }
}
void unlink(Node x) {
    if (x.prev != null) x.prev.next = x.next;
    if (x.next != null) x.next.prev = x.prev;
}`,
    },
    {
      language: 'java',
      caption: 'Insert after node (doubly)',
      code: `void insertAfter(Node anchor, Node node) {
    node.prev = anchor;
    node.next = anchor.next;
    if (anchor.next != null) anchor.next.prev = node;
    anchor.next = node;
}`,
    },
  ],
  implementation: [
    {
      language: 'java',
      caption: 'LRU cache node structure (concept',
      code: `class LRUCache {
    class DNode { int k, v; DNode prev, next; }
    Map<Integer, DNode> map = new HashMap<>();
    DNode head, tail; // sentinels
    void moveToFront(DNode node) {
        unlink(node);
        insertAfter(head, node);
    }
}`,
    },
  ],
  complexity: {
    best: 'O(1) unlink/insert with node ref',
    average: 'O(n) search without map',
    worst: 'O(n) find by key without HashMap',
    space: 'O(n) extra prev pointer per node',
  },
  patternRecognition: [
    'LRU / LFU cache design (HashMap + DLL).',
    'Remove arbitrary node in O(1) given reference.',
    'Browser history forward/back.',
    'Need bidirectional traversal without storing array copy.',
  ],
  commonMistakes: [
    'Updating only next or only prev when unlinking.',
    'Insert before/after confusion on sentinel boundaries.',
    'Forgetting to update tail sentinel when removing last real node.',
    'Memory leaks in interviews (not clearing pointers—optional but good practice).',
    'Using singly linked delete pattern on doubly linked node.',
  ],
  variations: [
    'Circular doubly linked list',
    'Sentinel head/tail only (no data)',
    'LinkedHashMap as built-in LRU in Java',
    'Skip list alternative for ordered map',
  ],
  tradeoffs: {
    advantages: [
      'O(1) delete/move with node pointer',
      'Backward traversal',
      'Clean LRU implementation',
    ],
    disadvantages: [
      'Extra memory per node',
      'More pointer bugs in interviews',
      'Worse cache locality than singly',
    ],
    alternatives: ['Singly + prev map only if delete rare', 'LinkedHashMap for LRU in production Java'],
    whenToUse: ['LRU cache', 'O(1) arbitrary removal', 'Bidirectional iteration'],
    whenNotToUse: ['Memory-tight singly suffices', 'Only forward traversal needed'],
  },
  failureModes: [
    'Broken invariant: prev.next != node or next.prev != node.',
    'Off-by-one at sentinel: inserting at “tail” means before tail sentinel.',
  ],
  interview: {
    expectations: [
      'Draw unlink with four assignments',
      'Combine HashMap + DLL for LRU',
      'Handle capacity eviction from tail',
    ],
    commonQuestions: [
      'LRU Cache',
      'Design browser history',
      'Flatten a multilevel doubly linked list',
    ],
    followUps: ['Thread-safe LRU?', 'LFU vs LRU structure?'],
    misconceptions: ['LinkedHashMap is magic—still DLL + map'],
    traps: ['Move-to-front without unlink first', 'Evict wrong end (LRU at tail)'],
    strongSignals: ['Sentinel nodes', 'O(1) get/put narrative with map'],
  },
  keyTakeaways: [
    'prev + next → O(1) unlink with node ref.',
    'Update both neighbors on delete.',
    'Sentinels simplify head/tail edges.',
    'LRU = HashMap + doubly linked order.',
    'More pointers → draw before code.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Advantage of doubly over singly linked list?',
      answerHint: 'O(1) delete/insert given node; backward traversal via prev.',
    },
    {
      level: 'intermediate',
      question: 'Steps to unlink node x in doubly linked list?',
      answerHint: 'x.prev.next = x.next; if x.next != null x.next.prev = x.prev.',
    },
    {
      level: 'advanced',
      question: 'Why LRU cache uses doubly linked list + HashMap?',
      answerHint: 'Map O(1) find node; DLL O(1) move to MRU or evict LRU tail.',
    },
  ],
  flashcards: [
    { front: 'Doubly linked unlink', back: 'Fix prev.next and next.prev both.' },
    { front: 'LRU eviction end', back: 'Remove node before tail sentinel (LRU side).' },
  ],
  quickRevision: [
    'Node: val, prev, next',
    'Unlink updates both sides',
    'Sentinels for head/tail',
    'LRU = map + DLL',
    'O(1) move with node ref',
    'Draw pointers first',
  ],
}
