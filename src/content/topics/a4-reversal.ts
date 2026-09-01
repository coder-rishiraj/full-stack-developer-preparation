import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Linked list reversal rewires next pointers so the list order flips—iteratively with three pointers (prev, cur, next) or recursively by stacking calls—returning the new head in O(n) time and O(1) space (iterative).',
  whyExists:
    'Reversal is the canonical pointer drill and sub-routine for k-group reverse, palindrome linked list, and reorder list. It tests in-place mutation without losing the tail.',
  mentalModel:
    'Flip each arrow one at a time: before moving forward, point current node back to previous. Like reversing direction on a one-way street segment by segment.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Iterative: prev=null; while cur: save next=cur.next; cur.next=prev; prev=cur; cur=next.',
        'Return prev as new head when cur becomes null.',
        'Recursive: reverse(cur.next) returns newHead; cur.next.next=cur; cur.next=null; return newHead.',
        'Partial reverse: stop at tail of segment; reconnect segment head/tail to rest.',
        'Reverse k-group: advance k nodes, reverse block, connect previous block tail to new head.',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Save next first',
      text: 'Always store cur.next before setting cur.next=prev—otherwise you lose the rest of the list.',
    },
  ],
  architecture: {
    mermaid: `flowchart LR
  P[prev null] --> C[cur]
  C --> N[next save]
  N --> Flip[cur.next = prev]
  Flip --> Advance[prev=cur cur=next]`,
    caption: 'Iterative reversal loop',
  },
  example: [
    {
      type: 'paragraph',
      text: '1→2→3→null: step1 null←1 2→3; step2 null←1←2 3; step3 null←1←2←3; head=3.',
    },
    {
      type: 'table',
      headers: ['step', 'prev', 'cur', 'list front'],
      rows: [
        ['0', 'null', '1', '1→2→3'],
        ['1', '1', '2', '2→3 (1 reversed)'],
        ['3', '3', 'null', '3→2→1'],
      ],
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Iterative reverse full list',
      code: `ListNode reverse(ListNode head) {
    ListNode prev = null, cur = head;
    while (cur != null) {
        ListNode next = cur.next;
        cur.next = prev;
        prev = cur;
        cur = next;
    }
    return prev;
}`,
    },
    {
      language: 'java',
      caption: 'Reverse [left, right] inclusive (1-indexed',
      code: `// dummy, walk to node before left; reverse sublist length (right-left+1);
// reconnect: pre.next = newHead; subTail.next = after`,
    },
  ],
  implementation: [
    {
      language: 'java',
      caption: 'Reverse linked list II (sublist',
      code: `public ListNode reverseBetween(ListNode head, int left, int right) {
    ListNode dummy = new ListNode(0, head);
    ListNode pre = dummy;
    for (int i = 1; i < left; i++) pre = pre.next;
    ListNode cur = pre.next;
    for (int i = 0; i < right - left; i++) {
        ListNode nxt = cur.next;
        cur.next = nxt.next;
        nxt.next = pre.next;
        pre.next = nxt;
    }
    return dummy.next;
}`,
    },
  ],
  complexity: {
    best: 'O(n) visit each node once',
    average: 'O(n)',
    worst: 'O(n)',
    space: 'O(1) iterative; O(n) recursion stack',
  },
  patternRecognition: [
    'Explicit “reverse linked list” or palindrome via half reverse.',
    'Reorder list: find mid, reverse second half, merge.',
    'Reverse nodes in k-group.',
    'Add two numbers stored in reverse order (already reversed digit order).',
  ],
  commonMistakes: [
    'Not saving next → lose list tail.',
    'Returning cur instead of prev after loop.',
    'Sublist reverse: wrong reconnection of tail to remainder.',
    'k-group: off-by-one on counting k nodes before reverse.',
    'Recursive reverse on very long list → stack overflow.',
  ],
  variations: [
    'Full reverse vs reverse between m and n',
    'Recursive vs iterative',
    'Reverse second half only (palindrome check)',
    'Iterative k-block with group pointer',
  ],
  tradeoffs: {
    advantages: [
      'O(n) time O(1) space iterative',
      'Core building block for harder list problems',
      'In-place',
    ],
    disadvantages: [
      'Easy to lose pointers if rushed',
      'Partial reverse reconnection is error-prone',
    ],
    alternatives: ['Copy to array, reverse array, rebuild (O(n) space)'],
    whenToUse: ['Reverse entire or partial list', 'Palindrome/reorder preprocessing'],
    whenNotToUse: ['Need stable order elsewhere—mutates input'],
  },
  failureModes: [
    'Cycle introduced if next not cleared in partial ops.',
    'Single node: should return unchanged.',
  ],
  interview: {
    expectations: [
      'Write iterative reverse cold',
      'Explain three-pointer invariant',
      'Handle empty and single node',
    ],
    commonQuestions: [
      'Reverse Linked List',
      'Reverse Linked List II',
      'Reverse Nodes in k-Group',
      'Palindrome Linked List',
    ],
    followUps: ['Recursive version?', 'Reverse k-group without extra space?'],
    misconceptions: ['Must allocate new nodes'],
    traps: ['Reverse II: moving nodes one-by-one head-insert pattern', 'k-group: < k nodes at end stay as-is'],
    strongSignals: ['Says “save next” before flip', 'Draws sublist reconnect'],
  },
  keyTakeaways: [
    'prev/cur/next loop; return prev.',
    'Save next before cur.next = prev.',
    'Sublist: dummy + head-insert trick or full block reverse.',
    'Palindrome: reverse second half, compare, optional restore.',
    'O(n) time, O(1) space iterative.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Iterative reverse linked list invariant?',
      answerHint: 'Reversed prefix ending at prev; cur is first unreversed; next saved before flip.',
    },
    {
      level: 'intermediate',
      question: 'Reverse between left and right in one pass trick?',
      answerHint: 'Head-insert each node after pre: pull cur.next to front of sublist repeatedly.',
    },
    {
      level: 'advanced',
      question: 'Reverse k-group outline?',
      answerHint: 'Count k nodes; if k remain, reverse block; connect prev tail to new head; advance.',
    },
  ],
  flashcards: [
    { front: 'Reverse list return value', back: 'prev when cur becomes null.' },
    { front: 'First line in reverse loop', back: 'ListNode next = cur.next;' },
  ],
  quickRevision: [
    'prev=null, cur=head',
    'Save next → flip → advance',
    'Return prev',
    'Dummy for sublist reverse',
    'Head-insert for reverse II',
    'O(n) O(1) iterative',
  ],
}
