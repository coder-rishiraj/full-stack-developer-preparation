import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Fast/slow pointers (Floyd’s cycle detection) move two pointers through a linked structure at different speeds—typically slow +=1, fast +=2—to detect cycles, find midpoints, or locate cycle entrances in O(n) time and O(1) space.',
  whyExists:
    'Cycle detection with a hash set costs O(n) space. Two speeds guarantee that inside a cycle, fast laps slow; the meeting point encodes structural information without extra memory.',
  mentalModel:
    'Two runners on a circular track: one jogs, one sprints. If the track loops, the sprinter eventually catches the jogger from behind. Reset one runner to the start and both move at jog speed—the meeting point is the loop entrance.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Initialize slow = fast = head (or dummy per problem).',
        'Advance slow one step, fast two steps per iteration.',
        'If fast reaches null (no cycle), stop.',
        'If slow == fast, cycle exists; optional phase 2 finds entrance.',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Phase 2 entrance',
      text: 'After meeting inside cycle: reset slow to head, move both one step until they meet—that node is cycle start. Proof uses distance arithmetic mod cycle length.',
    },
  ],
  architecture: {
    mermaid: `flowchart LR
  H[head] --> S[slow +1]
  H --> F[fast +2]
  S --> Meet{slow == fast?}
  F --> Meet
  Meet -->|no cycle| Null[fast null]
  Meet -->|cycle| P2[reset slow=head, both +1]
  P2 --> Entry[cycle entrance]`,
    caption: 'Floyd cycle detection and entrance',
  },
  example: [
    {
      type: 'paragraph',
      text: 'List 1→2→3→4→2 (cycle at 2): slow/fast meet at 4 or equivalent inside cycle. Reset slow to 1, advance both by 1: meet at 2 (entrance).',
    },
    {
      type: 'table',
      headers: ['step', 'slow', 'fast', 'note'],
      rows: [
        ['0', '1', '1', 'start'],
        ['1', '2', '3', 'advance'],
        ['2', '3', '2', 'inside cycle'],
        ['3', '4', '4', 'meet'],
      ],
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Cycle detection',
      code: `ListNode slow = head, fast = head;
while (fast != null && fast.next != null) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow == fast) return true;
}
return false;`,
    },
    {
      language: 'java',
      caption: 'Cycle entrance',
      code: `ListNode slow = head, fast = head;
while (fast != null && fast.next != null) {
    slow = slow.next;
    fast = fast.next.next;
    if (slow == fast) break;
}
if (fast == null || fast.next == null) return null;
slow = head;
while (slow != fast) {
    slow = slow.next;
    fast = fast.next;
}
return slow;`,
    },
  ],
  implementation: [
    {
      language: 'java',
      caption: 'Middle of linked list',
      code: `public ListNode middleNode(ListNode head) {
    ListNode slow = head, fast = head;
    while (fast != null && fast.next != null) {
        slow = slow.next;
        fast = fast.next.next;
    }
    return slow; // second middle if even length
}`,
    },
  ],
  complexity: {
    best: 'O(1) if no cycle and fast hits null quickly',
    average: 'O(n) steps',
    worst: 'O(n) time, O(1) space',
    space: 'O(1) — key advantage over hash set',
  },
  patternRecognition: [
    'Linked list cycle detection or entrance.',
    'Find middle node (even/odd length nuance).',
    'Happy number (cycle in function iteration on integers).',
    'Duplicate number in array with [1,n] and index-as-next-pointer.',
    'Palindrome linked list (find mid then reverse second half).',
  ],
  commonMistakes: [
    'Not checking fast != null && fast.next != null before advancing fast twice.',
    'Confusing meeting point with cycle start (need phase 2).',
    'Off-by-one on middle: first vs second middle for even length.',
    'Using fast/slow on arrays without index-as-pointer model.',
  ],
  variations: [
    'Different speed ratios (1 and 3) still detect cycles',
    'Brent’s algorithm (alternative cycle detection)',
    'Tortoise on implicit graph (next permutation cycle length)',
  ],
  tradeoffs: {
    advantages: [
      'O(1) space cycle detection',
      'Elegant two-phase math for entrance',
      'Same pattern for middle finding',
    ],
    disadvantages: [
      'Primarily linked list / functional iteration',
      'Does not identify cycle length without extra walk',
    ],
    alternatives: ['HashSet of visited nodes O(n) space', 'Mark nodes destructively (not interview-safe)'],
    whenToUse: ['Linked list cycle/middle', 'Implicit pointer graph in array', 'Iteration until repeat'],
    whenNotToUse: ['Need full cycle path', 'Multiple pointers on arbitrary trees without structure'],
  },
  failureModes: [
    'Null pointer if fast.next accessed when fast.next is null.',
    'Wrong entrance if phase 2 skipped after false meeting.',
  ],
  interview: {
    expectations: [
      'O(n) time O(1) space cycle detection',
      'Optional: prove entrance algorithm',
      'Handle null head, single node self-loop',
    ],
    commonQuestions: [
      'Linked List Cycle',
      'Linked List Cycle II',
      'Middle of the Linked List',
      'Find the Duplicate Number',
    ],
    followUps: ['Prove why entrance algorithm works', 'Cycle length?'],
    misconceptions: ['Meeting point is always cycle start'],
    traps: ['Duplicate number: treat array as linked list via index'],
    strongSignals: ['Explains phase 2 reset without memorizing only'],
  },
  keyTakeaways: [
    'slow +=1, fast +=2 detects cycle when they meet.',
    'Phase 2: slow=head, both +=1 → cycle entrance.',
    'Middle: stop when fast cannot advance two steps.',
    'O(n) time, O(1) space vs hash set.',
    'Array-as-linked-list: i → nums[i].',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Why does fast/slow detect a cycle?',
      answerHint: 'Inside cycle, relative speed 1 step/iter; fast catches slow.',
    },
    {
      level: 'intermediate',
      question: 'Find duplicate in [1,n] with O(1) space?',
      answerHint: 'Index as next pointer; Floyd on array like linked list.',
    },
    {
      level: 'advanced',
      question: 'Sketch why resetting slow to head finds cycle entrance.',
      answerHint: 'Distances from head to entrance equal entrance to meeting mod cycle length.',
    },
  ],
  flashcards: [
    {
      front: 'Fast/slow cycle loop guard',
      back: 'while (fast != null && fast.next != null).',
    },
    {
      front: 'Middle of linked list rule',
      back: 'slow+1, fast+2 until fast.next null; slow at middle.',
    },
  ],
  quickRevision: [
    'slow+1 fast+2 for cycles',
    'Meet inside cycle ≠ entrance',
    'Reset slow=head for entrance',
    'O(n) time O(1) space',
    'Middle when fast ends',
    'Happy number / duplicate # = same pattern',
    'Guard fast.next before double step',
  ],
}
