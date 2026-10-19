import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'A **Stream** is a pipeline over a source of elements. **Intermediate** operations such as **filter**, **map**, **sorted**, and **flatMap** describe steps. A **terminal** operation such as **collect**, **reduce**, **count**, or **forEach** runs the pipeline and produces a result.',
  whyExists:
    'A loop mixes “what I am keeping” with “how the index moves.” A short pipeline says filter, then map, then collect. Interviewers use that to ask about **groupingBy**, **flatMap**, collectors, and why **parallelStream** is not the default.',
  mentalModel:
    'Nothing flows until you open the tap. **filter** and **map** only record a plan. **collect** opens the tap, pulls each element through the plan, and builds the result. After that pull, the stream is spent.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Source, intermediate steps, one terminal step.',
        'Why the steps wait.',
        '**map** versus **flatMap**.',
        '**groupingBy**, **counting**, and **toMap**.',
        'What not to do: reuse, **peek**, and **parallelStream** by habit.',
      ],
    },
    {
      type: 'heading',
      text: 'Step 1 — Three stages',
    },
    {
      type: 'list',
      items: [
        'The **source** is **list.stream()**, **Arrays.stream(a)**, **Stream.of(...)**, or **IntStream.range(0, n)**.',
        '**Intermediate** operations return another stream: **filter**, **map**, **flatMap**, **sorted**, **distinct**, **limit**, **skip**. You can chain them.',
        'The **terminal** operation ends the chain and produces a value: **collect**, **toList**, **reduce**, **count**, **findFirst**, **min**, **max**, **anyMatch**, **forEach**.',
        'No terminal, no work. A chain that you never collect does not filter anything. That surprises people who expect **filter** to run immediately.',
      ],
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Drop blanks, trim, then count by length',
      code: `List<String> words = list.stream()
    .filter(s -> s != null && !s.isBlank())
    .map(String::trim)
    .toList();

Map<Integer, Long> byLength = words.stream()
    .collect(Collectors.groupingBy(String::length, Collectors.counting()));`,
    },
    {
      type: 'heading',
      text: 'Step 2 — Intermediate is lazy, terminal is eager',
    },
    {
      type: 'list',
      items: [
        'Each intermediate call returns a new stream object that remembers the operation. It does not walk the list yet.',
        'The terminal call pulls. For each element the source yields, the element passes through **filter**, then **map**, and then into the collector. Streams prefer this fused walk over building a full list at every step.',
        '**findFirst** and **anyMatch** can stop early. Later elements are never pulled. That only helps if you did not put an unbounded **sorted** in front, which needs every element before it can emit the first.',
        'A stream is consumed once. A second terminal on the same stream throws **IllegalStateException**. Build a new **list.stream()** if you need a second pass.',
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'One terminal, then the stream is finished',
      text: 'Save the **List** from **toList()** if you will need the elements again. Do not keep the **Stream** and call **collect** twice.',
    },
    {
      type: 'heading',
      text: 'Step 3 — map changes an element, flatMap removes a layer',
    },
    {
      type: 'list',
      items: [
        '**map** turns each element into exactly one new element. A **String** becomes its length. The stream stays the same length, aside from a **filter**.',
        '**flatMap** turns each element into a stream of its own, then splices those streams into one. A **List<List<Integer>>** becomes a **Stream<Integer>** of every inner integer. **map** would have left you with a stream of lists.',
        'It flattens **one** level. A list of lists of lists needs two **flatMap** calls to reach the innermost values.',
        '**Optional** uses the same idea. **flatMap** on an empty **Optional** skips it. **map** would wrap another **Optional** and you would be holding **Optional<Optional<T>>**.',
        '**String::trim** and **String::length** are method references. They are the same as **s -> s.trim()** and **s -> s.length()**, and they read more clearly when the lambda would only forward one call.',
      ],
    },
    {
      type: 'heading',
      text: 'Step 4 — groupingBy builds the map for you',
    },
    {
      type: 'list',
      items: [
        '**Collectors.groupingBy(String::length)** produces a **Map<Integer, List<String>>**: each length points at the words of that length.',
        'The two-argument form adds a downstream collector. **groupingBy(String::length, Collectors.counting())** produces a **Map<Integer, Long>** of how many words have each length. That is the frequency map.',
        '**toMap(keyFn, valueFn)** also builds a map, but a duplicate key throws unless you pass a merge function, such as **Integer::sum** or **(a, b) -> a**. **groupingBy** is the one that expects many elements per key.',
        '**max** and **min** return an **Optional**, because the stream might be empty. **orElse** or **orElseThrow** handles that. Calling **get** on an empty **Optional** throws.',
      ],
    },
    {
      type: 'heading',
      text: 'Step 5 — Side effects, primitives, and parallel',
    },
    {
      type: 'list',
      items: [
        'Lambdas in **map** and **filter** should compute a value, not edit an outside list. A pipeline that mutates a shared **ArrayList** from **forEach** is a loop with worse debugging, and it breaks under parallel execution.',
        '**peek** is a look-through window for a temporary log. It is not how you transform. If the element should change, use **map**.',
        '**Stream<Integer>** boxes every **int**. For a large numeric array, **Arrays.stream(intArray)** gives an **IntStream**, and **mapToInt** does arithmetic without an **Integer** per element. **IntStream** and **LongStream** exist for this.',
        '**parallelStream** splits the source across threads. It pays off for a large, CPU-heavy, pure computation already in memory. It is a bad default for small **n**, for I/O, and for anything that touches a shared mutable list. Measure before you keep it.',
        '**filter** out **null** before you call a method on the element. A null in the middle of **map(String::trim)** throws **NullPointerException**.',
      ],
    },
    {
      type: 'table',
      headers: ['Operation', 'When it runs', 'What it is for'],
      rows: [
        ['**filter**, **map**, **flatMap**, **sorted**', 'Lazy, when a terminal pulls', 'Describe the plan'],
        ['**collect**, **reduce**, **count**, **forEach**', 'Eager, and they consume the stream', 'Produce the result'],
        ['**groupingBy**', 'Inside **collect**', 'Many values per key'],
        ['**toMap**', 'Inside **collect**', 'One value per key, plus a merge if keys repeat'],
        ['**peek**', 'Lazy', 'A temporary look, not a transformation'],
      ],
    },
    {
      type: 'quiz',
      title: 'Check your understanding — streams',
      questions: [
        {
          prompt: 'You call filter and map and never call a terminal operation. What ran?',
          options: [
            'Both steps, immediately',
            'Nothing on the elements. Intermediate steps wait for a terminal.',
            'Only filter',
            'The stream sorts itself',
          ],
          answer: 1,
          explanation: '**filter** and **map** record the plan. **collect**, **count**, **forEach**, and the other terminals are what pull elements through that plan.',
        },
        {
          prompt: 'You have a List<List<Integer>> and want one stream of every integer. Which call?',
          options: [
            'map',
            'flatMap',
            'peek',
            'distinct',
          ],
          answer: 1,
          explanation: '**map** would turn each inner list into one element, leaving a stream of lists. **flatMap** splices each inner list into the outer stream, one level down.',
        },
        {
          prompt: 'A stream already had collect called on it. You call count on the same stream. What happens?',
          options: [
            'count returns 0',
            'IllegalStateException. A stream allows one terminal operation.',
            'count reruns the pipeline',
            'collect is undone',
          ],
          answer: 1,
          explanation: 'The stream is consumed. Start again from the source, or keep the **List** that **collect** already built.',
        },
        {
          prompt: 'Several words can share a length, and you want a map from length to the list of those words. Which collector?',
          options: [
            'toMap without a merge function',
            'groupingBy',
            'joining',
            'counting, alone',
          ],
          answer: 1,
          explanation: '**groupingBy** expects many elements per key and collects them into lists. **toMap** needs a merge function as soon as two keys collide, and even then it keeps one value, not a list, unless you write that yourself.',
        },
        {
          prompt: 'When is parallelStream a reasonable choice?',
          options: [
            'Always. Streams are multithreaded by default.',
            'A large, CPU-bound, pure computation on data already in memory, after you measure',
            'Any I/O loop, so the waits overlap',
            'Whenever the lambda mutates a shared ArrayList',
          ],
          answer: 1,
          explanation: 'An ordinary **stream()** is single-threaded. Parallelism has overhead, hates shared mutation, and is the wrong tool for I/O. Use it for heavy in-memory work and check that it is actually faster.',
        },
      ],
    },
  ],
  example: [
    {
      type: 'heading',
      text: 'The longest length, and the words of that length',
    },
    {
      type: 'list',
      items: [
        'Trim and drop blanks, as in the pipeline above, and **collect** once into **words**.',
        '**groupingBy(String::length)** builds **Map<Integer, List<String>>**.',
        'The largest key in that map is the longest length. **keySet().stream().max(Integer::compareTo)** returns an **Optional<Integer>**, empty only if **words** was empty.',
        'Look that key up to get the bucket. Two passes, two streams, because the first stream was already consumed by **collect**.',
      ],
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'A filter-map pipeline, and a frequency map',
      code: `List<String> words = list.stream()
    .filter(s -> s != null && !s.isBlank())
    .map(String::trim)
    .toList();
Map<Integer, Long> freq = words.stream()
    .collect(Collectors.groupingBy(String::length, Collectors.counting()));`,
    },
  ],
  complexity: {
    notes: 'A single terminal is one pass, O(n), unless you sorted, which is O(n log n), or you built a map of n distinct keys. parallelStream does not change the Big-O. It changes the constant, sometimes for the worse.',
  },
  patternRecognition: [
    'Count or group by a key → groupingBy and counting.',
    'A list of lists to flatten → flatMap.',
    'Top-k is usually clearer with a heap than with a sort of the whole stream.',
  ],
  commonMistakes: [
    'Using peek to transform, instead of map.',
    'Boxing a large numeric pipeline as Stream of Integer.',
    'A second terminal on a spent stream.',
    'Mutating an outside list from forEach.',
  ],
  tradeoffs: {
    advantages: ['The pipeline says filter, map, collect in that order', 'Collectors cover grouping, counting, and joining'],
    disadvantages: ['A breakpoint in the middle of a chain is harder than a loop variable', 'Stream of Integer boxes every value'],
    alternatives: ['An enhanced for-loop when the body is a state machine', 'A record and a few named steps when the chain gets long'],
    whenToUse: ['Filter, map, and an aggregate that really is one pass'],
    whenNotToUse: ['A tight numeric loop you have not profiled', 'Anything that needs to update an index and a few locals in a fiddly way'],
  },
  failureModes: [
    'IllegalStateException from reusing a stream after its terminal operation.',
    'parallelStream on a small list, on I/O, or on a lambda that mutates shared state.',
    'NullPointerException from a null element that was never filtered.',
  ],
  production: {
    performance: [
      'Use IntStream or LongStream for bulk numeric work.',
      'Do not keep parallelStream unless a profile shows the work is CPU-bound and large.',
    ],
    maintainability: [
      'Keep a pipeline short enough to read. Extract a named method when a lambda grows a body.',
    ],
    reliability: [
      'findFirst, min, and max return Optional. Handle the empty case before you call get.',
    ],
  },
  interview: {
    expectations: ['Lazy versus terminal', 'groupingBy and counting', 'flatMap versus map'],
    commonQuestions: ['Most frequent element with a stream?', 'What is the difference between map and flatMap?'],
    followUps: ['What is a custom collector?', 'When does parallelStream hurt?'],
    misconceptions: ['Streams are multithreaded. stream() is not. parallelStream() is.'],
    traps: ['Editing an external list inside forEach'],
    strongSignals: ['Names groupingBy and counting', 'Refuses parallelStream as a default'],
  },
  keyTakeaways: [
    'A terminal operation runs the pipeline. Intermediate operations wait.',
    'A stream accepts one terminal operation.',
    'groupingBy collects many elements per key. toMap needs a merge when keys collide.',
    'flatMap flattens one level. map does not.',
    'parallelStream is for large, pure, in-memory, CPU-bound work, after you measure.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What is lazy, and what is eager, in a stream?',
      answerHint: 'filter, map, flatMap, and sorted are lazy. collect, reduce, count, and forEach are eager and are what actually pull the elements.',
    },
    {
      level: 'intermediate',
      question: 'groupingBy versus toMap?',
      answerHint: 'groupingBy puts every element with the same key into a list, or into a downstream collector such as counting. toMap wants one value per key and throws on a duplicate unless you pass a merge function.',
    },
    {
      level: 'advanced',
      question: 'When would you call parallelStream?',
      answerHint: 'A large CPU-bound computation on data already in memory, with no shared mutation and no I/O. Measure it. Small n and I/O are slower or unsafe in parallel.',
    },
  ],
  flashcards: [
    { front: 'Terminal operation', back: 'Eager. It runs the pipeline. collect, reduce, count, forEach, toList.' },
    { front: 'flatMap', back: 'Turn each element into a stream, then splice those streams into one. One level.' },
  ],
  quickRevision: [
    'Source, then intermediate, then one terminal',
    'Lazy until the terminal',
    'groupingBy and counting',
    'flatMap flattens one level',
    'Do not reuse a stream',
    'parallelStream only after measuring',
    'Method references for a single call',
  ],
}
