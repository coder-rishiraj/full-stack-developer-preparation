import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Cycle detection determines whether a linked list’s next pointers form a loop. Floyd’s tortoise-and-hare (slow +1, fast +2) finds a meeting point in O(n) time and O(1) space; phase two locates the cycle entrance.',
  whyExists:
    'Corrupted pointers, circular buffers, and infinite loop bugs appear in practice. Hash-set detection uses O(n) space; fast/slow is the interview-standard optimal approach.',
  mentalModel:
    'Two runners on a circular track: if there’s a loop, the faster runner laps the slower. Reset one to start, both jog at same speed—they meet at the loop’s entry gate.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Phase 1: slow=fast=head; while fast and fast.next: slow=slow.next; fast=fast.next.next; if slow==fast → cycle.',
        'No cycle: fast reaches null.',
        'Phase 2 (entrance): reset slow=head; move both one step until slow==fast → entrance node.',
        'Cycle length: count steps from meeting point until loop closes.',
        'Alternative: HashSet of visited nodes—simpler but O(n) space.',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Proof sketch',
      text: 'Let L = distance to cycle, C = cycle length. When they meet, slow traveled L+x, fast 2(L+x). Arithmetic mod C shows head to entrance equals meeting point to entrance walking forward.',
    },
  ],
  architecture: {
    mermaid: `flowchart LR
  P1[phase1 fast slow] --> Meet{meet?}
  Meet -->|no| Null[no cycle]
  Meet -->|yes| P2[reset slow=head]
  P2 --> Entry[both +1 until equal]`,
    caption: 'Floyd cycle detection and entrance',
  },
  example: [
    {
      type: 'paragraph',
      text: '3→2→0→-4→2 (cycle at 2): slow/fast meet inside cycle; reset slow to 3, advance both → meet at 2 (start).',
    },
    {
      type: 'table',
      headers: ['method', 'time', 'space'],
      rows: [
        ['Floyd', 'O(n)', 'O(1)'],
        ['HashSet', 'O(n)', 'O(n)'],
      ],
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Has cycle (Floyd phase 1)',
      code: `boolean hasCycle(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow == fast) return true;
    }
    return false;
}`,
    },
    {
      language: 'java',
      caption: 'Cycle entrance (phase 2',
      code: `ListNode detectCycle(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
        if (slow == fast) break;
    }
    if (fast == null || fast.next == null) return null;
    slow = head;
    while (slow != fast) { slow = slow.next; fast = fast.next; }
    return slow;
}`,
    },
  ],
  implementation: [
    {
      language: 'java',
      caption: 'Happy Number (cycle on sequence',
      code: `int next(int n) {
    int sum = 0;
    while (n > 0) { int d = n % 10; sum += d*d; n /= 10; }
    return sum;
}
// Floyd on implicit linked sequence: slow/fast on next(n)`,
    },
  ],
  complexity: {
    best: 'O(n) pointers advance at most n steps',
    average: 'O(n)',
    worst: 'O(n)',
    space: 'O(1) Floyd; O(n) HashSet',
  },
  patternRecognition: [
    'Linked list may have cycle wording or “infinite loop”.',
    'Find duplicate in array as implicit cycle (index as next).',
    'Happy number / sequence repetition.',
    'Need cycle start or length.',
    'Fast/slow speed ratio 1:2 (other ratios work with care).',
  ],
  commonMistakes: [
    'Starting fast at head.next while slow at head (usually both at head).',
    'Forgetting null check on fast.next before fast.next.next.',
    'Phase 2 without confirming cycle existed.',
    'Using == on values instead of node reference equality.',
    'HashSet storing values not nodes when duplicates allowed.',
  ],
  variations: [
    'Find cycle length after detection',
    'Implicit graph: array as linked list (duplicate number)',
    'Brent’s algorithm alternative to Floyd',
    'Remove cycle (break link) after finding entrance',
  ],
  tradeoffs: {
    advantages: [
      'O(1) space optimal for linked structure',
      'Same pattern for implicit sequences',
      'Entrance detection without extra memory',
    ],
    disadvantages: [
      'Phase 2 math is harder to explain under pressure',
      'HashSet easier to implement quickly',
    ],
    alternatives: ['HashSet visited', 'Mark nodes (mutates, often disallowed)'],
    whenToUse: ['Cycle yes/no', 'Cycle start', 'Repeated state in iteration'],
    whenNotToUse: ['Need full cycle node list—collect after entrance known'],
  },
  failureModes: [
    'Null head → no cycle.',
    'Self-loop single node: fast.next null? single node fast.next null → no cycle unless points to self (fast.next exists).',
  ],
  interview: {
    expectations: [
      'Implement Floyd phase 1',
      'Optional: phase 2 entrance',
      'Compare to HashSet tradeoff',
    ],
    commonQuestions: [
      'Linked List Cycle',
      'Linked List Cycle II',
      'Find the Duplicate Number',
      'Happy Number',
    ],
    followUps: ['Prove entrance phase 2?', 'Cycle length?'],
    misconceptions: ['Fast must meet slow at entrance (they meet inside cycle)'],
    traps: ['Duplicate number: treat index as next', 'Phase 2 while fast still at meeting point'],
    strongSignals: ['Both pointers start at head', 'Explains O(1) space advantage'],
  },
  keyTakeaways: [
    'Slow +1, fast +2; meet ⇒ cycle.',
    'Phase 2: reset slow to head, both +1 → entrance.',
    'HashSet O(n) space simpler; Floyd O(1) optimal.',
    'Implicit cycles: array indices or iterated function.',
    'Always check fast and fast.next null.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Why does fast/slow meeting imply a cycle?',
      answerHint: 'In acyclic list fast hits null; in cycle relative speed 1 inside loop guarantees rendezvous.',
    },
    {
      level: 'intermediate',
      question: 'Find cycle entrance after detection?',
      answerHint: 'Reset one pointer to head; advance both 1 step; meeting node is start.',
    },
    {
      level: 'advanced',
      question: 'Find duplicate in [1,n] array O(1) space?',
      answerHint: 'Treat i -> nums[i] as next pointer; Floyd finds cycle entrance = duplicate value.',
    },
  ],
  flashcards: [
    { front: 'Floyd cycle space', back: 'O(1).' },
    { front: 'After cycle detected, find start', back: 'slow=head, both move 1 until equal.' },
  ],
  quickRevision: [
    'slow+1 fast+2 same head',
    'Meet → cycle exists',
    'Reset slow → entrance',
    'Check fast & fast.next',
    'HashSet alternative O(n)',
    'Implicit cycle in arrays',
  ],
}
