import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Heap + greedy combines a priority queue with repeated extraction/insertion to always process the best current candidate—top K elements, merge K sorted lists, task schedulers, meeting rooms, and median from stream. Min-heap for "smallest best"; max-heap for "largest best".',
  whyExists:
    'When the best next choice changes dynamically (not fixed sort order), heaps give O(log n) updates vs resorting O(n log n). Greedy repeatedly picks heap top, updates state, pushes successors.',
  mentalModel:
    'Always serve the most urgent item on top of a pile; after serving, add the next related item back into the pile.',
  howItWorks: [
    {
      type: 'list',
      items: [
        'Top K frequent: count map + min-heap size K (evict smallest freq).',
        'Merge K lists: init heap with head of each list; pop min, push next from same list.',
        'Task scheduler: max-heap counts; each round pick up to n tasks with cooldown.',
        'Find median: two heaps—max-heap lower half, min-heap upper half, balance sizes.',
        'Meeting rooms: min-heap of end times while scanning starts sorted.',
      ],
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Merge K sorted lists',
      code: `ListNode mergeKLists(ListNode[] lists) {
    PriorityQueue<ListNode> pq = new PriorityQueue<>((a, b) -> a.val - b.val);
    for (ListNode n : lists) if (n != null) pq.offer(n);
    ListNode dummy = new ListNode(0), cur = dummy;
    while (!pq.isEmpty()) {
        ListNode node = pq.poll();
        cur.next = node;
        cur = cur.next;
        if (node.next != null) pq.offer(node.next);
    }
    return dummy.next;
}`,
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Merge lists [1,4], [2,3]: heap holds heads 1 and 2; pop 1, push 4; result 1,2,3,4 in O(n log k) time.',
    },
  ],
  complexity: {
    average: 'O(n log k) for K-way merge; O(n log K) top K',
    worst: 'Depends on heap size k and operations count',
    space: 'O(k) heap size',
  },
  tradeoffs: {
    advantages: ['Dynamic best choice O(log k)', 'Clean for streaming/K-way', 'Two-heap trick for median'],
    disadvantages: ['More code than sort for static arrays', 'Comparator bugs', 'Not always needed if full sort OK'],
    alternatives: ['Quickselect O(n) average for top K once', 'Full sort O(n log n) simpler if k ≈ n'],
    whenToUse: ['K sorted streams', 'Top K dynamic', 'Scheduling with changing urgency'],
    whenNotToUse: ['Single static array top K once → quickselect', 'Small n brute force'],
  },
  failureModes: [
    'Wrong heap type (min vs max) inverts answer.',
    'Comparator overflow on Integer subtraction.',
    'Forgetting to push successor after pop in K-merge.',
  ],
  interview: {
    expectations: ['Know min vs max heap choice', 'O(n log k) merge K lists', 'Two-heap median balance'],
    commonQuestions: ['Merge K Sorted Lists', 'Top K Frequent Elements', 'Find Median from Data Stream'],
    followUps: ['Quickselect vs heap for top K?', 'Size K min-heap for top K largest?'],
    misconceptions: ['Must sort entire array', 'Max heap for top K largest directly without size-K trick'],
    traps: ['Empty lists in merge', 'Median heap balance invariant'],
    strongSignals: ['States heap size and complexity', 'Uses size-K min-heap for top K largest'],
  },
  patternRecognition: [
    'You repeatedly need the smallest or largest candidate while the candidate set changes.',
    'The input consists of K sorted streams whose current heads must be merged.',
    'The problem asks for top K values but does not require a full sorted result.',
    'A schedule must repeatedly select the next available task by priority or end time.',
  ],
  commonMistakes: [
    'Using a max-heap where a size-K min-heap is needed to retain the K largest values.',
    'Writing a comparator as a subtraction that can overflow instead of using Integer.compare.',
    'Forgetting to push a popped list node’s successor during K-way merge.',
    'Failing to rebalance the two heaps after inserting into a running-median structure.',
  ],
  keyTakeaways: [
    'Heap gives dynamic min/max in O(log n).',
    'K-way merge: heap size k, O(n log k).',
    'Top K largest: size K min-heap evicts smallest.',
    'Two heaps maintain running median.',
    'Quickselect alternative for one-shot top K.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Top K largest with heap?', answerHint: 'Size K min-heap; if size>K poll min; remaining are top K.' },
    { level: 'intermediate', question: 'Merge K lists complexity?', answerHint: 'O(n log k) where n total nodes, k lists; heap holds k heads.' },
    { level: 'advanced', question: 'Median two-heap invariant?', answerHint: 'Max-heap lower half, min-heap upper; sizes differ by at most 1; median from tops.' },
  ],
  flashcards: [
    { front: 'Top K largest heap type', back: 'Size K min-heap (root is eviction candidate).' },
    { front: 'Merge K sorted lists heap size', back: 'k elements, O(n log k) time.' },
  ],
  quickRevision: [
    'Min-heap for smallest best',
    'Max-heap for largest best',
    'K-merge O(n log k)',
    'Top K size-K min-heap',
    'Two heaps for median',
    'Comparator: Integer.compare',
    'Quickselect one-shot alternative',
  ],
}
