import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'K-way merge combines K sorted sequences into one sorted output by repeatedly picking the smallest (or largest) head element—implemented with a min heap of size K holding one cursor per list in O(N log K) time where N is total elements.',
  whyExists:
    'Merge sort merge step generalizes to K lists, K sorted linked lists, K sorted arrays, and external merge of file chunks. Heap avoids O(K) scan each step when K is large.',
  mentalModel:
    'K fingers each pointing at the current element of one list. Put all K finger values in a min heap; extract min, advance that list’s finger, push next value—like merging K streams at a faucet manifold.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Seed heap with first element of each of K lists (with list id / node ref).',
        'While heap not empty: poll smallest, append to result, push next from same list if exists.',
        'Linked lists: store (node.val, listIndex); arrays: (value, listIdx, nextIdx).',
        'Smallest range covering K lists: max heap + sliding min (hard variant).',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Entry shape',
      text: 'Always carry enough metadata to advance the correct list: ListNode node reference or (arr, index) pair—Comparator only compares values.',
    },
  ],
  architecture: {
    mermaid: `flowchart LR
  L1[List 1 head] --> PQ[Min heap size K]
  L2[List 2 head] --> PQ
  LK[List K head] --> PQ
  PQ --> Poll[Poll min]
  Poll --> Out[Output]
  Poll --> Adv[Advance that list]
  Adv --> PQ`,
    caption: 'K-way merge loop',
  },
  example: [
    {
      type: 'paragraph',
      text: 'Lists [1,4,5], [1,3,4], [2,6]: heap initially (1,L0),(1,L1),(2,L2). Poll 1 from L0, push 4 → output 1,1,2,... final sorted [1,1,2,3,4,4,5,6].',
    },
    {
      type: 'table',
      headers: ['variant', 'heap entry', 'complexity'],
      rows: [
        ['K linked lists', 'ListNode', 'O(N log K)'],
        ['K arrays', 'val, idx, arrId', 'O(N log K)'],
        ['2-way merge', 'two pointers', 'O(N) no heap needed'],
        ['merge K sorted files', 'buffer per file', 'external sort'],
      ],
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Merge K sorted lists',
      code: `public ListNode mergeKLists(ListNode[] lists) {
    PriorityQueue<ListNode> pq = new PriorityQueue<>((a,b)->a.val-b.val);
    for (ListNode head : lists) if (head != null) pq.offer(head);
    ListNode dummy = new ListNode(0), tail = dummy;
    while (!pq.isEmpty()) {
        ListNode cur = pq.poll();
        tail.next = cur;
        tail = cur;
        if (cur.next != null) pq.offer(cur.next);
    }
    return dummy.next;
}`,
    },
    {
      language: 'java',
      caption: 'K arrays with index metadata',
      code: `PriorityQueue<int[]> pq = new PriorityQueue<>((a,b)->a[0]-b[0]);
for (int i = 0; i < k; i++) if (idx[i] < len[i]) pq.offer(new int[]{arr[i][idx[i]], i});
while (!pq.isEmpty()) {
    int[] top = pq.poll();
    out.add(top[0]);
    int li = top[1];
    if (++idx[li] < len[li]) pq.offer(new int[]{arr[li][idx[li]], li});
}`,
    },
  ],
  implementation: [
    {
      language: 'java',
      caption: 'Find K pairs with smallest sums (heap expansion)',
      code: `public List<List<Integer>> kSmallestPairs(int[] nums1, int[] nums2, int k) {
    List<List<Integer>> res = new ArrayList<>();
    if (nums1.length == 0 || nums2.length == 0) return res;
    PriorityQueue<int[]> pq = new PriorityQueue<>((a,b)->
        (nums1[a[0]]+nums2[a[1]]) - (nums1[b[0]]+nums2[b[1]]));
    for (int j = 0; j < Math.min(nums2.length, k); j++) pq.offer(new int[]{0, j});
    while (!pq.isEmpty() && res.size() < k) {
        int[] cur = pq.poll();
        int i = cur[0], j = cur[1];
        res.add(List.of(nums1[i], nums2[j]));
        if (i + 1 < nums1.length) pq.offer(new int[]{i + 1, j});
    }
    return res;
}`,
    },
  ],
  complexity: {
    best: 'O(N log K) each of N elements heap ops',
    average: 'O(N log K) time',
    worst: 'O(N log K); O(K) heap space',
    space: 'O(K) heap; O(1) extra besides output if streaming',
  },
  patternRecognition: [
    'Merge k Sorted Lists / Merge k Sorted Arrays.',
    'Smallest range covering elements from K lists.',
    'K pairs with smallest sums.',
    'External merge sort phase.',
    'Unified with Dijkstra as K-way merge on distance fronts (conceptual).',
  ],
  commonMistakes: [
    'Forgetting to skip empty lists on init.',
    'Comparator overflow on pair sums—use Integer.compare on sum.',
    'K pairs: duplicate pairs from offering (i+1,j) and (i,j+1) without visited set (harder variants).',
    'Using O(K) linear scan instead of heap when K large.',
  ],
  tradeoffs: {
    advantages: [
      'O(N log K) scales when K << N',
      'Single template for lists and arrays',
      'Natural extension of 2-way merge',
    ],
    disadvantages: [
      'Heap overhead constant factors',
      'For K=2, two-pointer O(N) simpler',
    ],
    alternatives: ['Divide and conquer merge pairs O(N log K)', 'Brute combine sort O(N log N)'],
    whenToUse: ['K sorted inputs merged', 'Smallest among K heads repeatedly', 'Streaming multi-source ordered pull'],
    whenNotToUse: ['K=2 only → two pointers', 'Unsorted inputs → sort first or different problem'],
  },
  failureModes: [
    'Null nodes in list array—filter on seed.',
    'Integer overflow in sum comparators for pair problems.',
  ],
  interview: {
    expectations: [
      'O(N log K) complexity stated',
      'Seed K heap entries',
      'Advance correct list after poll',
    ],
    commonQuestions: [
      'Merge k Sorted Lists',
      'Find K Pairs with Smallest Sums',
      'Smallest Range Covering Elements from K Lists',
    ],
    followUps: ['Divide-conquer merge vs heap?', 'Smallest range two-pointer + heap?'],
    misconceptions: ['Must concatenate then sort O(N log N)—heap beats when K lists'],
    traps: ['K pairs: only expand (i+1,j) once per j seed to limit duplicates'],
    strongSignals: ['Carries list identity in heap entry for advancement'],
  },
  keyTakeaways: [
    'Min heap size K holds current head of each list.',
    'Poll min, output, push next from same source.',
    'O(N log K) time, O(K) space.',
    'K=2: two pointers without heap.',
    'Entry includes pointer/index to advance correct list.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Merge K sorted lists complexity with heap?',
      answerHint: 'O(N log K) N total nodes, heap size K.',
    },
    {
      level: 'intermediate',
      question: 'What goes in heap entry for linked lists?',
      answerHint: 'ListNode reference; compare val; on poll offer node.next.',
    },
    {
      level: 'advanced',
      question: 'Smallest range from K lists approach?',
      answerHint: 'Track min/max among K current heads; move list with minimum head forward.',
    },
  ],
  flashcards: [
    {
      front: 'K-way merge time complexity',
      back: 'O(N log K) with min heap of size K.',
    },
    {
      front: 'After polling heap in merge',
      back: 'Append value; advance that list; offer next if any.',
    },
  ],
  quickRevision: [
    'Seed heap with K heads',
    'Poll min → advance → push next',
    'O(N log K) time O(K) space',
    'Entry: value + list id/node',
    'K=2 → two pointers',
    'Filter empty lists init',
    'Integer.compare for sums',
  ],
}
