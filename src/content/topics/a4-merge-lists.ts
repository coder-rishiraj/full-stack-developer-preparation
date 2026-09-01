import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Merge lists combines two or more sorted linked lists (or arrays) into one sorted sequence by comparing heads and appending the smaller node—classic two-pointer merge in O(n+m) time.',
  whyExists:
    'Merge sort’s combine step, merge k sorted streams, and add-two-numbers all reuse the same pointer discipline: always attach the smaller front node, advance that list’s pointer, preserve sorted order without resorting.',
  mentalModel:
    'Two sorted lines of people by height: repeatedly take the shorter person at the front of either line and append to the output queue—never need to look back.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Dummy tail node simplifies first attachment; tail pointer tracks end of result.',
        'While both lists non-null: compare heads; tail.next = smaller; that list advances; tail advances.',
        'Attach remaining non-null list to tail.next.',
        'Merge k lists: min-heap of heads O(N log k) or divide-and-conquer pairwise O(N log k).',
        'In-place array merge uses temp buffer or two-pointer write index.',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Dummy + tail',
      text: 'ListNode dummy = new ListNode(0); ListNode tail = dummy; avoids null checks for first node on each append.',
    },
  ],
  architecture: {
    mermaid: `flowchart LR
  L1[h1] --> Cmp{compare}
  L2[h2] --> Cmp
  Cmp --> Tail[tail.next = min]
  Tail --> Adv[advance that list]`,
    caption: 'Two-list merge loop',
  },
  example: [
    {
      type: 'paragraph',
      text: '1→3→5 and 2→4→6: compare 1 vs 2 → 1; 3 vs 2 → 2; 3 vs 4 → 3; … → 1→2→3→4→5→6.',
    },
    {
      type: 'table',
      headers: ['variant', 'time', 'space'],
      rows: [
        ['two lists', 'O(n+m)', 'O(1)'],
        ['k lists heap', 'O(N log k)', 'O(k) heap'],
        ['k lists divide', 'O(N log k)', 'O(1) extra if iterative'],
      ],
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Merge two sorted lists',
      code: `ListNode mergeTwoLists(ListNode a, ListNode b) {
    ListNode dummy = new ListNode(0), tail = dummy;
    while (a != null && b != null) {
        if (a.val <= b.val) { tail.next = a; a = a.next; }
        else { tail.next = b; b = b.next; }
        tail = tail.next;
    }
    tail.next = (a != null) ? a : b;
    return dummy.next;
}`,
    },
    {
      language: 'java',
      caption: 'Merge k lists (min-heap',
      code: `PriorityQueue<ListNode> pq = new PriorityQueue<>((x,y)->x.val-y.val);
for (ListNode node : lists) if (node != null) pq.offer(node);
ListNode dummy = new ListNode(0), tail = dummy;
while (!pq.isEmpty()) {
    ListNode n = pq.poll();
    tail.next = n; tail = tail.next;
    if (n.next != null) pq.offer(n.next);
}
return dummy.next;`,
    },
  ],
  implementation: [
    {
      language: 'java',
      caption: 'Merge two sorted arrays (in-place helper',
      code: `void merge(int[] nums1, int m, int[] nums2, int n) {
    int i = m - 1, j = n - 1, k = m + n - 1;
    while (j >= 0) {
        if (i >= 0 && nums1[i] > nums2[j]) nums1[k--] = nums1[i--];
        else nums1[k--] = nums2[j--];
    }
}`,
    },
  ],
  complexity: {
    best: 'O(n+m) two lists',
    average: 'O(n+m) or O(N log k) for k lists',
    worst: 'O(N log k) heap merge k lists',
    space: 'O(1) two-list pointer merge; O(k) heap',
  },
  patternRecognition: [
    'Two sorted linked lists → one sorted list.',
    'Merge step in merge sort on linked list.',
    'Merge intervals after sorting (array variant).',
    'Combine sorted streams with heap when k > 2.',
    'Backward merge into nums1 with extra space at end.',
  ],
  commonMistakes: [
    'Forgetting tail.next = remaining list after loop.',
    'Not advancing tail after attaching node (creates self-loop).',
    'Using <= vs < wrong for stability requirement.',
    'k-merge: re-offer next node to heap after poll.',
    'Array merge forward overwriting unread elements in nums1.',
  ],
  variations: [
    'Recursive merge two lists',
    'Divide and conquer merge k lists',
    'Merge with sentinel on both inputs',
    'Merge sorted arrays from end to avoid overwrite',
  ],
  tradeoffs: {
    advantages: [
      'Linear time for two lists',
      'O(1) space pointer merge',
      'Same pattern as merge sort combine',
    ],
    disadvantages: [
      'k lists naive sequential merge O(kN)',
      'Heap merge needs O(k) memory',
    ],
    alternatives: ['Concatenate then sort O(N log N)', 'Divide-conquer merge k lists'],
    whenToUse: ['Two sorted lists', 'Merge sort on linked list', 'k sorted with small k heap'],
    whenNotToUse: ['Unsorted inputs without sort first'],
  },
  failureModes: [
    'Tail not moved → infinite loop or cycle on self.',
    'Empty lists: return other head directly.',
  ],
  interview: {
    expectations: [
      'Dummy tail pattern',
      'O(n+m) complexity',
      'Extend to k with heap or divide',
    ],
    commonQuestions: [
      'Merge Two Sorted Lists',
      'Merge k Sorted Lists',
      'Merge Sorted Array',
    ],
    followUps: ['Stable merge?', 'Merge in place on linked list?'],
    misconceptions: ['Must create new nodes (reuse existing nodes)'],
    traps: ['k lists: forget to push n.next', 'nums1 merge from front not back'],
    strongSignals: ['Tail pointer discipline', 'Compares heap vs divide merge costs'],
  },
  keyTakeaways: [
    'Dummy + tail; attach smaller head; advance.',
    'Attach leftover list once one exhausts.',
    'Two lists O(n+m) O(1) space.',
    'k lists: heap O(N log k) or pairwise merge.',
    'Array merge from end when in-place.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Merge two sorted lists time and space?',
      answerHint: 'O(n+m) time; O(1) extra—reuse nodes via pointer rewiring.',
    },
    {
      level: 'intermediate',
      question: 'Merge k sorted lists efficiently?',
      answerHint: 'Min-heap size k poll smallest push its next; or divide merge pairs O(N log k).',
    },
    {
      level: 'advanced',
      question: 'Why merge nums1 and nums2 from the back?',
      answerHint: 'Largest elements placed at end without overwriting unread nums1 prefix.',
    },
  ],
  flashcards: [
    { front: 'After merge loop ends', back: 'tail.next = non-null remaining list.' },
    { front: 'k-way merge heap size', back: 'O(k); total O(N log k).' },
  ],
  quickRevision: [
    'dummy + tail pattern',
    'Compare heads attach min',
    'O(n+m) two lists',
    'Heap for k lists',
    'Backward merge nums1',
    'Advance tail always',
  ],
}
