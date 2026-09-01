import type { TopicContent } from '@/domain/types'

export const streamsContent: TopicContent = {
  whatIsIt:
    'The Java Stream API (java.util.stream, Java 8+) processes sequences of elements declaratively: map/filter/reduce pipelines over collections, arrays, I/O, or generators, with optional parallel execution.',
  whyExists:
    'Imperative loops scatter logic and parallelization is error-prone. Streams express data transformations as composable operations, enable lazy evaluation, and delegate parallelism to the fork/join pool with clearer intent.',
  mentalModel:
    'Source → intermediate ops (lazy, fuse into pipeline) → terminal op (eager, triggers execution). Each stage may be sequential or parallel; no mutation of source by convention.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Create stream from Collection.stream(), Arrays.stream(), Stream.of(), IntStream.range, Files.lines.',
        'Chain intermediate ops: filter, map, flatMap, distinct, sorted, peek, limit, skip.',
        'Terminal op consumes stream once: collect, reduce, forEach, count, findFirst, anyMatch.',
        'parallelStream() splits spliterator; combine results must be associative for reduce/collect.',
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Single-use',
      text: 'After a terminal operation, the stream is consumed. Calling another terminal op throws IllegalStateException.',
    },
  ],
  architecture: {
    mermaid: `flowchart LR
  Source[Source spliterator] --> Inter[Intermediate ops lazy]
  Inter --> Term[Terminal op eager]
  Term --> Result[Result or side effect]`,
    caption: 'Lazy pipeline until terminal operation runs',
  },
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Typical pipeline',
      code: `List<String> emails = users.stream()
    .filter(u -> u.isActive())
    .map(User::getEmail)
    .map(String::toLowerCase)
    .distinct()
    .sorted()
    .toList(); // Java 16+ immutable list`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'groupBy with Collectors',
      code: `Map<Department, Long> headcount = employees.stream()
    .collect(Collectors.groupingBy(
        Employee::getDept,
        Collectors.counting()));`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'flatMap — one-to-many',
      code: `List<OrderLine> lines = orders.stream()
    .flatMap(o -> o.getLines().stream())
    .toList();`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Spliterator splits source for parallel traversal; characteristics (ORDERED, SIZED, NONNULL) affect optimizations.',
        'Pipeline fuses operations — not one full pass per intermediate op in optimized paths.',
        'Primitive streams (IntStream, LongStream, DoubleStream) avoid boxing overhead.',
        'collect uses Collector: supplier, accumulator, combiner, finisher; combiner must be safe for parallel.',
        'Optional return types for findFirst/reduce avoid null; never Optional.get() without isPresent in production code — use orElse/orElseThrow.',
      ],
    },
  ],
  complexity: {
    average: 'O(n) per pipeline pass over n elements',
    worst: 'O(n log n) if sorted; parallel overhead may hurt small n',
    space: 'O(n) for collect to list; O(1) for reduce if associative fold',
    notes: 'Short-circuit ops (findFirst, anyMatch) may not traverse entire stream.',
  },
  implementation: [
    {
      language: 'java',
      caption: 'Imperative vs stream — readability trade-off',
      code: `// Stream — good for transforms
long active = users.stream().filter(User::isActive).count();

// Loop — fine for simple indexed access or early complex break
for (User u : users) { if (u.isActive()) { /* ... */ break; } }`,
    },
    {
      language: 'java',
      caption: 'Parallel — only when work per element is substantial',
      code: `long sum = hugeList.parallelStream()
    .mapToLong(this::expensiveCompute)
    .sum(); // combiner must be associative`,
    },
  ],
  tradeoffs: {
    advantages: [
      'Declarative, composable data processing',
      'Built-in collectors, grouping, partitioning',
      'Optional parallelism without manual threads',
    ],
    disadvantages: [
      'Debugging stack traces are deep/opaque',
      'Overhead for tiny collections',
      'Easy to misuse parallelStream on shared mutable state',
    ],
    alternatives: [
      'Enhanced for-loop for simple iteration',
      'Reactive streams (Project Reactor) for async backpressure',
      'SQL for set-oriented aggregation at database',
    ],
    whenToUse: [
      'Multi-step transforms, filters, aggregations on in-memory collections',
      'Grouping/counting with Collectors',
    ],
    whenNotToUse: [
      'Mutating external state from parallel streams without synchronization',
      'Very small lists (overhead > benefit)',
      'IO-bound pipelines without dedicated async model',
    ],
  },
  failureModes: [
    'Modifying source collection during stream iteration → ConcurrentModificationException.',
    'parallelStream + non-thread-safe shared accumulators → races.',
    'Collecting unbounded stream without limit → OOM.',
    'Using peek for side effects instead of forEach at end — confusing and optimized away assumptions.',
    'Boxing in map instead of mapToInt for numeric hot paths.',
  ],
  production: {
    performance: [
      'Use primitive streams for numeric workloads',
      'Avoid parallelStream unless profiling shows CPU-bound gain',
    ],
    scalability: [
      'Parallel uses common ForkJoinPool — can starve other parallel streams',
    ],
    maintainability: [
      'Keep pipelines short; extract named methods for complex map/filter logic',
    ],
  },
  interview: {
    expectations: [
      'Distinguish intermediate vs terminal ops',
      'Explain lazy evaluation and short-circuit',
      'Know common Collectors and flatMap use case',
    ],
    commonQuestions: [
      'Difference between map and flatMap?',
      'When is a stream executed?',
      'map vs peek?',
      'Parallel stream pitfalls?',
    ],
    followUps: [
      'Implement custom Collector?',
      'Stream vs reactive streams?',
    ],
    misconceptions: [
      'Each intermediate op always runs a separate pass',
      'parallelStream is always faster',
      'Streams replace all loops',
    ],
    traps: ['Using parallelStream with synchronized block inside — serializes anyway'],
    strongSignals: [
      'Mentions spliterator and single consumption',
      'Warns about shared mutable state in parallel',
      'Chooses primitive streams for performance',
    ],
  },
  keyTakeaways: [
    'Lazy until terminal; one terminal per stream.',
    'Intermediate: filter/map/flatMap; terminal: collect/reduce/forEach.',
    'flatMap flattens nested streams (one-to-many).',
    'Collectors for grouping, partitioning, joining.',
    'parallelStream only for CPU-heavy, thread-safe pipelines.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What triggers stream pipeline execution?',
      answerHint: 'A terminal operation (collect, count, forEach, etc.).',
    },
    {
      level: 'intermediate',
      question: 'map vs flatMap?',
      answerHint: 'map 1:1 transform; flatMap maps to stream then flattens.',
    },
    {
      level: 'advanced',
      question: 'Why can parallelStream be slower or unsafe?',
      answerHint: 'Split/merge overhead; requires associative ops; shared mutable state races.',
    },
  ],
  flashcards: [
    { front: 'Lazy vs eager in streams', back: 'Intermediate lazy; terminal eager' },
    { front: 'flatMap purpose', back: 'Map to stream then flatten one level' },
    { front: 'parallelStream requirement', back: 'Thread-safe, associative combiners, enough work per element' },
  ],
  quickRevision: [
    'Source → intermediate* → terminal',
    'Lazy until terminal; single use',
    'flatMap for nested collections',
    'Collectors.groupingBy, counting',
    'Primitive streams avoid boxing',
    'No mutate source during stream',
    'parallelStream: profile first',
  ],
}

export const content = streamsContent
