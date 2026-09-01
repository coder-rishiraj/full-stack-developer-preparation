import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'A singly linked list is a chain of nodes where each node holds a value and a single next pointer; traversal is sequential from head, with O(1) insert/delete at known position but O(n) random access.',
  whyExists:
    'Linked lists model dynamic sequences without contiguous memory—useful for O(1) head insert, merge patterns, and pointer manipulation drills that test careful null handling and reference rewiring.',
  mentalModel:
    'A train of cars linked by couplings: you only know the engine (head). To reach car k, walk k steps. Rewiring means updating next pointers—draw arrows before coding.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Define ListNode { int val; ListNode next; }.',
        'Traverse with for (ListNode cur = head; cur != null; cur = cur.next).',
        'Insert after node: newNode.next = node.next; node.next = newNode.',
        'Delete by copying next.val / next.next (skip node) when only head given.',
        'Use dummy head when head itself may change (delete head, merge).',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Dummy node',
      text: 'ListNode dummy = new ListNode(0, head); return dummy.next; avoids special-casing empty list or deleting head.',
    },
  ],
  architecture: {
    mermaid: `flowchart LR
  H[head] --> N1[val next]
  N1 --> N2[val next]
  N2 --> Null[null]`,
    caption: 'Singly linked list structure',
  },
  example: [
    {
      type: 'paragraph',
      text: 'Insert 5 after node with val 2 in 1→2→3: create node 5; 5.next = 3; 2.next = 5 → 1→2→5→3.',
    },
    {
      type: 'table',
      headers: ['operation', 'time', 'notes'],
      rows: [
        ['access i-th', 'O(n)', 'no index'],
        ['insert at head', 'O(1)', 'update head'],
        ['search', 'O(n)', 'linear scan'],
      ],
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'ListNode and traversal',
      code: `class ListNode {
    int val;
    ListNode next;
    ListNode(int v) { val = v; }
}
ListNode cur = head;
while (cur != null) {
    // use cur.val
    cur = cur.next;
}`,
    },
    {
      language: 'java',
      caption: 'Dummy head pattern',
      code: `ListNode dummy = new ListNode(0, head);
ListNode prev = dummy;
while (prev.next != null) {
    // inspect prev.next
    prev = prev.next;
}
return dummy.next;`,
    },
  ],
  implementation: [
    {
      language: 'java',
      caption: 'Remove nth node from end',
      code: `public ListNode removeNthFromEnd(ListNode head, int n) {
    ListNode dummy = new ListNode(0, head);
    ListNode fast = dummy, slow = dummy;
    for (int i = 0; i <= n; i++) fast = fast.next;
    while (fast != null) { fast = fast.next; slow = slow.next; }
    slow.next = slow.next.next;
    return dummy.next;
}`,
    },
  ],
  complexity: {
    best: 'O(1) for head insert/delete',
    average: 'O(n) for search/length',
    worst: 'O(n) access by index',
    space: 'O(1) extra for pointer tricks; O(n) nodes stored',
  },
  patternRecognition: [
    'Problem gives ListNode head, not array.',
    'Need O(1) space beyond list—no array copy.',
    'Delete/insert at position relative to head or tail.',
    'Two-pass or fast/slow for nth from end.',
    'Build new list while traversing old.',
  ],
  commonMistakes: [
    'NullPointerException: forget cur.next when cur is last node.',
    'Losing rest of list by assigning head before saving next.',
    'Not using dummy when head can be removed.',
    'Off-by-one on nth from end (move fast n+1 steps from dummy).',
    'Creating cycles accidentally when rewiring.',
  ],
  variations: [
    'Sentinel/dummy head',
    'Fast/slow for midpoint',
    'Recursive traversal (stack O(n))',
    'Copy list with random pointer (hash map)',
  ],
  tradeoffs: {
    advantages: [
      'O(1) insert/delete at known node',
      'No reallocation like dynamic arrays',
      'Great for pointer interview practice',
    ],
    disadvantages: [
      'No O(1) random access',
      'Extra pointer memory per element',
      'Cache-unfriendly vs arrays',
    ],
    alternatives: ['ArrayList for random access', 'Doubly linked for O(1) delete with prev'],
    whenToUse: ['Interview pointer problems', 'Merge/split sequences', 'Unknown size streaming insert at head'],
    whenNotToUse: ['Binary search needed on sequence', 'Cache-sensitive numeric crunching'],
  },
  failureModes: [
    'Cycle created → infinite loop (use fast/slow or visited set).',
    'Single-node list edge cases for delete/remove.',
  ],
  interview: {
    expectations: [
      'Draw pointers before coding',
      'Use dummy for head mutation',
      'State O(n) time, O(1) space',
    ],
    commonQuestions: [
      'Reverse Linked List',
      'Remove Nth Node From End',
      'Middle of the Linked List',
      'Merge Two Sorted Lists',
    ],
    followUps: ['Iterative vs recursive?', 'What if doubly linked?'],
    misconceptions: ['Can binary search a linked list'],
    traps: ['Delete node without head: copy next', 'Remove nth: one pointer short on gap'],
    strongSignals: ['Dummy node habit', 'Checks null before .next'],
  },
  keyTakeaways: [
    'Always consider dummy head for head changes.',
    'Save next before rewiring.',
    'Traversal: cur = cur.next until null.',
    'Nth from end = fast/slow gap n.',
    'No random access—O(n) scans.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Why use a dummy head node?',
      answerHint: 'Uniformizes insert/delete at head; return dummy.next as new head.',
    },
    {
      level: 'intermediate',
      question: 'Delete node when only given that node (no head)?',
      answerHint: 'Copy next.val and next.next into node; skip next ( fails if tail ).',
    },
    {
      level: 'advanced',
      question: 'Find middle in one pass?',
      answerHint: 'Slow +1, fast +2; when fast ends, slow at mid (even length: second mid).',
    },
  ],
  flashcards: [
    { front: 'Singly linked access time', back: 'O(n) to reach index i.' },
    { front: 'Before cur.next = x', back: 'Save cur.next if still needed.' },
  ],
  quickRevision: [
    'ListNode val + next',
    'Dummy head for head edits',
    'Save next before rewire',
    'Fast/slow for mid & nth end',
    'O(n) scan, O(1) extra space',
    'Null-check every step',
  ],
}
