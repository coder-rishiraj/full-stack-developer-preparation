import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'ArrayList is a resizable array implementation of List: dynamic backing Object[] (or E[] with generics erasure), amortized O(1) append, O(1) indexed get/set, O(n) insert/remove in middle or search by value.',
  whyExists:
    'Fixed arrays cannot grow. ArrayList provides contiguous memory layout for cache-friendly random access — the default List implementation when indexed access and iteration dominate over frequent middle inserts.',
  mentalModel:
    'Array + size counter. When full, allocate bigger array (typically 1.5×), copy elements, discard old. size() ≤ capacity; capacity grows automatically.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Default capacity 10 on first add (empty ctor starts at 0, grows on first add).',
        'add(e) appends at size; ensureCapacityInternal may grow.',
        'add(i, e) shifts elements right — O(n).',
        'remove(i) shifts left — O(n).',
        'trimToSize() releases excess capacity.',
      ],
    },
    {
      type: 'table',
      headers: ['Operation', 'Time', 'Notes'],
      rows: [
        ['get(i) / set(i)', 'O(1)', 'Direct array index'],
        ['add(end)', 'O(1) amortized', 'Resize O(n) occasionally'],
        ['add(0) / remove(0)', 'O(n)', 'Shift all elements'],
        ['contains / indexOf', 'O(n)', 'Linear scan equals'],
        ['iterator remove', 'O(n) worst', 'May shift'],
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Pre-sizing and bulk operations',
      code: `List<String> items = new ArrayList<>(10_000);
items.addAll(otherList);

// Java 21+: getFirst/getLast on List interface
String first = items.getFirst();

// Sort in place
items.sort(Comparator.naturalOrder());`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'SubList view — structural sharing',
      code: `List<Integer> list = new ArrayList<>(List.of(1, 2, 3, 4, 5));
List<Integer> view = list.subList(1, 4); // [2, 3, 4]
view.clear(); // mutates backing list → [1, 5]
// subList invalid after parent structurally modified (fail-fast)`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'elementData array; size field separate from length.',
        'Growth: newCapacity = old + (old >> 1) — approximately 50% growth.',
        'modCount incremented on structural change — iterators track fail-fast.',
        'remove(Object) uses equals scan; remove(int) uses index — overload ambiguity with Integer.',
        'toArray(T[]) uses reflection copy; toArray() returns Object[].',
      ],
    },
  ],
  complexity: {
    average: 'O(1) get/set/add-end; O(n) search/shift',
    worst: 'O(n) add-end when resize; O(n) middle insert/remove',
    space: 'O(n) elements + unused capacity slack',
    notes: 'Amortized O(1) append; pre-size avoids repeated resize copies.',
  },
  tradeoffs: {
    advantages: [
      'Fast random access',
      'Cache-friendly contiguous storage',
      'Simple, low overhead vs LinkedList for most workloads',
      'Efficient iteration',
    ],
    disadvantages: [
      'Slow middle insert/remove',
      'Resize copy cost if under-sized initially',
      'Not thread-safe',
      'Boxing for primitives',
    ],
    alternatives: [
      'LinkedList — frequent head/tail insert (rarely faster in practice)',
      'ArrayDeque for queue/stack',
      'CopyOnWriteArrayList — read-heavy concurrent',
    ],
    whenToUse: [
      'Default List — random access, iteration, append-heavy',
      'Known size — constructor with initialCapacity',
    ],
    whenNotToUse: [
      'Frequent insert/remove at front or middle — consider LinkedList or tree structure',
      'Shared mutable list across threads without sync',
    ],
  },
  failureModes: [
    'ConcurrentModificationException modifying during foreach.',
    'IndexOutOfBoundsException — check size before get(size).',
    'list.remove(1) with List<Integer> — removes index 1 not value 1 (autoboxing trap).',
    'subList held after parent modified — undefined behavior / CME.',
    'Huge ArrayList without initial capacity — many resize copies.',
  ],
  interview: {
    expectations: [
      'Internal array + growth strategy',
      'Complexity of operations',
      'ArrayList vs LinkedList trade-offs',
    ],
    commonQuestions: [
      'How does ArrayList grow?',
      'ArrayList vs LinkedList?',
      'What is fail-fast in ArrayList?',
      'Time complexity of add at index 0?',
    ],
    followUps: [
      'Default initial capacity?',
      'subList behavior?',
    ],
    misconceptions: [
      'LinkedList always faster for insert (ArrayList often wins due to cache and overhead)',
      'ArrayList capacity equals size always',
    ],
    traps: ['remove(Integer.valueOf(1)) vs remove(1) ambiguity'],
    strongSignals: [
      'Growth factor ~1.5x explanation',
      'Pre-sizing with initialCapacity',
      'modCount fail-fast mechanism',
    ],
  },
  keyTakeaways: [
    'Resizable array backing; O(1) indexed access.',
    'Amortized O(1) append; O(n) middle shift.',
    'Default List choice for most cases.',
    'Pre-size when count known; trimToSize to save memory.',
    'Not thread-safe; fail-fast iterators.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What is the internal structure of ArrayList?',
      answerHint: 'Dynamic Object array + size; grows by copying to larger array.',
    },
    {
      level: 'intermediate',
      question: 'What is the time complexity of inserting at the beginning?',
      answerHint: 'O(n) — must shift all existing elements.',
    },
    {
      level: 'advanced',
      question: 'Why might ArrayList outperform LinkedList for inserts?',
      answerHint: 'Cache locality, lower per-node overhead, LinkedList traversal to index is O(n).',
    },
  ],
  flashcards: [
    { front: 'ArrayList get(i)', back: 'O(1) random access' },
    { front: 'Growth strategy', back: '~1.5× new array + copy on capacity exceeded' },
    { front: 'Default impl for List', back: 'ArrayList unless frequent middle insert' },
  ],
  quickRevision: [
    'Backing array + size',
    'O(1) get/set/add-end amortized',
    'O(n) middle insert/remove',
    'Grow ~50% on full',
    'Initial capacity hint helps',
    'fail-fast modCount',
    'subList is view',
  ],
}
