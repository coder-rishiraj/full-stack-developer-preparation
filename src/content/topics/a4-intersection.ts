import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'List intersection finds the first node shared by two singly linked lists—often after different-length prefixes—using length alignment plus simultaneous traversal, or hash set of one list’s nodes.',
  whyExists:
    'Shared tail structure appears in forked lists and version DAGs. Aligning lengths reduces the problem to “first equal node reference” in O(n+m) without modifying lists.',
  mentalModel:
    'Two paths merging into one trail: walk the longer path’s extra steps first so both hikers cover the same total distance; first time they step on the same stone is the intersection.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Compute lengths lenA, lenB by walking each list.',
        'Advance longer list pointer by |lenA − lenB| steps.',
        'Walk both in lockstep; first node where a == b (reference) is intersection.',
        'If either reaches null with no match → no intersection.',
        'Alternative: HashSet all nodes from list A; scan B for first in set.',
        'Two-pointer swap trick: A and B switch heads when reaching null—equalizes total walk.',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Reference equality',
      text: 'Compare nodes with == not val. Intersection is same object in memory; values could duplicate without shared node.',
    },
  ],
  architecture: {
    mermaid: `flowchart LR
  LA[len A] --> Skip[advance longer by diff]
  LB[len B] --> Skip
  Skip --> Sync[both +1 while a != b]
  Sync --> Hit[intersection or null]`,
    caption: 'Length alignment then sync walk',
  },
  example: [
    {
      type: 'paragraph',
      text: 'A: 4→1→8→4→5; B: 5→6→1→8→4→5; shared tail from 8. lenA=5, lenB=6; advance B one step then sync → meet at 8.',
    },
    {
      type: 'table',
      headers: ['method', 'time', 'space'],
      rows: [
        ['length align', 'O(n+m)', 'O(1)'],
        ['HashSet', 'O(n+m)', 'O(n)'],
        ['switch pointers', 'O(n+m)', 'O(1)'],
      ],
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Length difference alignment',
      code: `ListNode getIntersectionNode(ListNode headA, ListNode headB) {
    int la = length(headA), lb = length(headB);
    ListNode a = headA, b = headB;
    while (la > lb) { a = a.next; la--; }
    while (lb > la) { b = b.next; lb--; }
    while (a != b) { a = a.next; b = b.next; }
    return a; // may be null
}
int length(ListNode n) { int c=0; while(n!=null){c++; n=n.next;} return c; }`,
    },
    {
      language: 'java',
      caption: 'Two-pointer switch trick',
      code: `ListNode a = headA, b = headB;
while (a != b) {
    a = (a == null) ? headB : a.next;
    b = (b == null) ? headA : b.next;
}
return a;`,
    },
  ],
  implementation: [
    {
      language: 'java',
      caption: 'HashSet approach',
      code: `Set<ListNode> seen = new HashSet<>();
for (ListNode n = headA; n != null; n = n.next) seen.add(n);
for (ListNode n = headB; n != null; n = n.next)
    if (seen.contains(n)) return n;
return null;`,
    },
  ],
  complexity: {
    best: 'O(n+m) full traversal',
    average: 'O(n+m)',
    worst: 'O(n+m)',
    space: 'O(1) alignment/switch; O(n) HashSet',
  },
  patternRecognition: [
    'Two lists “intersect” or “merge at node”.',
    'Return node reference not value.',
    'Lists may differ in length before join.',
    'No cycle unless stated (cycle changes problem).',
  ],
  commonMistakes: [
    'Comparing val instead of node reference.',
    'Advancing wrong list by length diff.',
    'Assuming intersection at equal val without same node.',
    'Switch trick: infinite loop if not switching at null to other head.',
    'Forgetting both can be null → no intersection return null.',
  ],
  variations: [
    'Intersection of two arrays (different—use two pointers on sorted)',
    'Y-shaped list detection',
    'Find intersection with cycle present (rare variant)',
  ],
  tradeoffs: {
    advantages: [
      'O(1) space with alignment or switch',
      'No list mutation',
      'Linear time',
    ],
    disadvantages: [
      'HashSet simpler to code under time pressure',
      'Switch trick less intuitive to explain',
    ],
    alternatives: ['HashSet O(n) space', 'Brute compare every pair O(n·m)'],
    whenToUse: ['Shared tail linked lists', 'Need first common node'],
    whenNotToUse: ['Value intersection of sets—different problem'],
  },
  failureModes: [
    'No intersection: sync walk ends at null—return null.',
    'Both heads null → null.',
  ],
  interview: {
    expectations: [
      'Emphasize reference equality',
      'O(n+m) time O(1) space solution',
      'Handle disjoint lists',
    ],
    commonQuestions: [
      'Intersection of Two Linked Lists',
    ],
    followUps: ['Explain switch trick proof?', 'What if lists have cycles?'],
    misconceptions: ['Same values imply intersection'],
    traps: ['Return val not node', 'Length diff on wrong list'],
    strongSignals: ['Switch or align without extra space', 'Mentions reference vs value'],
  },
  keyTakeaways: [
    'Intersection = same node object (==).',
    'Align lengths then walk together.',
    'Switch heads at null → equal total path.',
    'HashSet O(n) space backup.',
    'O(n+m) time all methods linear.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Why compare node references not values?',
      answerHint: 'Problem defines intersection as same node object; duplicate vals OK on different nodes.',
    },
    {
      level: 'intermediate',
      question: 'Explain pointer switch solution.',
      answerHint: 'Each pointer walks A+B length; synchronized arrival at overlap or null after at most 2 passes.',
    },
    {
      level: 'advanced',
      question: 'What changes if a cycle exists in one list?',
      answerHint: 'Standard align may loop; need cycle detection first or problem guarantees acyclic tail merge.',
    },
  ],
  flashcards: [
    { front: 'Intersection compare', back: 'Node reference ==, not val.' },
    { front: 'O(1) space trick', back: 'Length diff align OR switch at null to other head.' },
  ],
  quickRevision: [
    'Same node == intersection',
    'Len diff → skip longer',
    'Walk sync until match',
    'Switch trick O(1) space',
    'HashSet fallback O(n)',
    'Return null if disjoint',
  ],
}
