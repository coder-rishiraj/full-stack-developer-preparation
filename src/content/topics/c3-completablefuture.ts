import type { TopicContent } from '@/domain/types'

export const completableFutureContent: TopicContent = {
  whatIsIt:
    'CompletableFuture<T> implements Future and CompletionStage — a promise that can be explicitly completed and composed with non-blocking callbacks (thenApply, thenCompose, handle, allOf, anyOf). It enables async pipelines without blocking threads on each stage.',
  whyExists:
    'Raw Future forces get() blocking and manual thread hopping for chains. CompletableFuture models functional async composition (map/flatMap) with default ForkJoinPool.commonPool() or custom executor for stage execution.',
  mentalModel:
    'DAG of stages: supplyAsync starts chain; thenApply transforms; thenCompose flattens nested CF; exceptionally recovers errors. Completion triggers dependent stages on executor thread — avoid blocking inside callbacks.',
  howItWorks: [
    {
      type: 'paragraph',
      text: 'Factory methods: supplyAsync, runAsync, completedFuture. CompletionStage methods return new dependent CF. allOf waits all; anyOf first success. join() like get but unchecked CompletionException.',
    },
    {
      type: 'table',
      headers: ['API', 'Role'],
      rows: [
        ['thenApply(fn)', 'Sync transform T → U on completion thread'],
        ['thenApplyAsync(fn, exec)', 'Async transform on executor'],
        ['thenCompose(fn)', 'FlatMap CF<U> — avoid CF<CF<U>>'],
        ['handle (result, ex)', 'Unified success/failure handler'],
        ['exceptionally(fn)', 'Recover from failure'],
        ['allOf / anyOf', 'Combine multiple CFs'],
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Common pool saturation',
      text: 'Default async stages use ForkJoinPool.commonPool() — CPU-heavy callbacks starve parallelStream and other CF users. Pass explicit Executor for blocking I/O stages.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Async pipeline',
      code: `CompletableFuture<Order> cf = CompletableFuture
    .supplyAsync(() -> fetchOrder(id), ioPool)
    .thenCompose(o -> validateAsync(o))
    .thenApply(o -> enrich(o))
    .exceptionally(ex -> Order.failed(ex));

Order order = cf.join();`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Combine two services',
      code: `CompletableFuture<User> userCf = fetchUserAsync(id);
CompletableFuture<Profile> profCf = fetchProfileAsync(id);

CompletableFuture<Dashboard> dash = userCf.thenCombine(
    profCf, (u, p) -> new Dashboard(u, p));`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Treiber stack of Completion nodes; CAS to complete and pop dependent actions.',
        'Async execution via executor.execute; sync stages run on completing thread.',
        'minimalCompletionStage view for API segregation.',
        'cancel propagates; obtrude forces value (rare, breaks contracts).',
        'ThreadLocal context (MDC) not propagated — wrap executor or use contextual wrappers.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Fluent non-blocking composition',
      'Explicit error paths (handle, exceptionally)',
      'Combine many async calls (allOf, thenCombine)',
    ],
    disadvantages: [
      'Easy to capture common pool with default async',
      'Debugging stack traces across stages harder',
      'Blocking in callbacks defeats purpose',
    ],
    alternatives: [
      'Reactive streams (Project Reactor, RxJava) for backpressure',
      'Virtual threads + structured concurrency (Java 21+)',
      'Plain Future for single-shot tasks',
    ],
    whenToUse: [
      'Orchestrate multiple async HTTP/DB calls',
      'Parallel fan-out fan-in with timeouts',
    ],
    whenNotToUse: [
      'Simple single background task — Future enough',
      'High-volume stream processing needing backpressure',
    ],
  },
  failureModes: [
    'Exception swallowed if no handle/exceptionally and never join/get.',
    'thenApply vs thenCompose confusion — nested CompletableFuture.',
    'Blocking get inside thenApply blocks completion thread.',
    'Lost MDC/trace context across async boundaries.',
  ],
  interview: {
    expectations: [
      'thenApply vs thenCompose',
      'handle vs exceptionally',
      'Pass custom executor for I/O',
    ],
    commonQuestions: [
      'CompletableFuture vs Future?',
      'Difference thenApply and thenCompose?',
      'How combine two async results?',
    ],
    followUps: [
      'allOf behavior on one failure?',
      'join vs get?',
    ],
    misconceptions: [
      'supplyAsync creates a dedicated thread (it submits to the common pool or the supplied Executor)',
      'thenApplyAsync always better (overhead if trivial work)',
    ],
    traps: ['CPU work on commonPool blocking parallel streams'],
    strongSignals: [
      'Separate ioExecutor vs cpuExecutor',
      'handle for unified logging/metrics',
      'orTimeout / completeOnTimeout (Java 9+)',
    ],
  },
  keyTakeaways: [
    'CompletionStage composition: apply, compose, combine.',
    'thenCompose flatMaps async steps; thenApply maps values.',
    'Always specify Executor for blocking I/O stages.',
    'handle/exceptionally for errors; don’t ignore failed CF.',
    'join() unchecked; get() checked ExecutionException.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What does supplyAsync do?',
      answerHint: 'Runs Supplier asynchronously; returns CompletableFuture of result.',
    },
    {
      level: 'intermediate',
      question: 'thenApply vs thenCompose?',
      answerHint: 'Apply maps T→U; compose flatMaps T→CF<U> avoiding nested futures.',
    },
    {
      level: 'advanced',
      question: 'Why avoid blocking I/O in thenApply on commonPool?',
      answerHint: 'Starves shared ForkJoinPool used by parallel streams and other CF stages.',
    },
  ],
  flashcards: [
    { front: 'thenCompose purpose', back: 'FlatMap async CF<U> — chain dependent async calls' },
    { front: 'thenCombine', back: 'Combine two CFs when both complete' },
    { front: 'Default async executor', back: 'ForkJoinPool.commonPool()' },
  ],
  quickRevision: [
    'supplyAsync / runAsync',
    'thenApply map, thenCompose flatMap',
    'thenCombine / allOf / anyOf',
    'handle errors',
    'Custom executor for I/O',
    'join vs get',
    'MDC context manual propagate',
  ],
}

export const content = completableFutureContent
