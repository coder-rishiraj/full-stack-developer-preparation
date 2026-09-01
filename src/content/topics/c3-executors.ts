import type { TopicContent } from '@/domain/types'

export const executorsContent: TopicContent = {
  whatIsIt:
    'Executors (java.util.concurrent) decouple task submission from thread lifecycle management. ExecutorService extends Executor with lifecycle (shutdown), Future returns, and bulk invoke. ThreadPoolExecutor is the workhorse: core/max pool size, bounded queue, rejection policy.',
  whyExists:
    'Creating unbounded threads per task exhausts memory and context-switches CPU to death. Pools reuse threads, bound concurrency, queue overload, and provide hooks for monitoring and graceful shutdown in servers.',
  mentalModel:
    'Task queue + worker threads. Submit runnable → if workers busy, queue; queue full → create thread up to max; max reached → rejection handler. shutdown() stops accepting; awaitTermination drains queue.',
  howItWorks: [
    {
      type: 'paragraph',
      text: 'Executors.newFixedThreadPool uses unbounded LinkedBlockingQueue (foot-gun under overload). newCachedThreadPool unbounded threads. Production: explicit ThreadPoolExecutor with bounded queue and named threads.',
    },
    {
      type: 'table',
      headers: ['Parameter', 'Role'],
      rows: [
        ['corePoolSize', 'Baseline worker threads'],
        ['maximumPoolSize', 'Extra threads when queue full'],
        ['workQueue', 'Buffers tasks (ArrayBlockingQueue, LinkedBlockingQueue)'],
        ['RejectedExecutionHandler', 'Abort, CallerRuns, Discard, DiscardOldest'],
        ['keepAliveTime', 'Idle non-core thread TTL'],
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Never use Executors.newFixedThreadPool blindly',
      text: 'Unbounded queue can grow until OOM while pool size stays at core — backpressure never triggers max threads. Prefer bounded queue + defined rejection.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Production ThreadPoolExecutor',
      code: `ThreadPoolExecutor pool = new ThreadPoolExecutor(
    8, 32,
    60, TimeUnit.SECONDS,
    new ArrayBlockingQueue<>(1000),
    new ThreadFactoryBuilder().setNameFormat("api-%d").build(),
    new ThreadPoolExecutor.CallerRunsPolicy()
);
pool.submit(() -> handleRequest(req));`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Graceful shutdown',
      code: `pool.shutdown();
if (!pool.awaitTermination(30, TimeUnit.SECONDS)) {
  pool.shutdownNow();
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Worker extends AQS; run loop: get task from queue or poll keepAlive.',
        'Submit path: if workers < core, create; else offer queue; else if < max create; else reject.',
        'ScheduledThreadPoolExecutor: delayed tasks in priority queue.',
        'ForkJoinPool: work-stealing deque for divide-and-conquer.',
        'Virtual thread per task executor (Java 21): Executors.newVirtualThreadPerTaskExecutor().',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Reuse threads; predictable resource caps',
      'Pluggable rejection for backpressure',
      'Integration with Future and CompletableFuture',
    ],
    disadvantages: [
      'Misconfigured pool hides overload until OOM',
      'Shared pool cross-talk between subsystems',
      'CallerRunsPolicy can block submitter thread unexpectedly',
    ],
    alternatives: [
      'Virtual threads for I/O-bound massive concurrency',
      'ForkJoinPool for parallel streams / recursive tasks',
      'Reactive event loop (Netty) fewer threads',
    ],
    whenToUse: [
      'Server request handling with bounded latency',
      'Background batch with limited parallelism',
    ],
    whenNotToUse: [
      'CPU-bound work with pool size >> cores without reason',
      'Blocking nested submits on same small pool',
    ],
  },
  failureModes: [
    'Queue unbounded growth → memory exhaustion.',
    'Pool too small → latency timeout cascade.',
    'shutdown forgotten → JVM hang on exit.',
    'ThreadFactory without names → unreadable dumps.',
  ],
  interview: {
    expectations: [
      'Explain core/max/queue/rejection',
      'Why avoid cached/unbounded fixed factories in prod',
      'Graceful shutdown sequence',
    ],
    commonQuestions: [
      'How does ThreadPoolExecutor work?',
      'Difference fixed vs cached pool?',
      'What happens when queue is full?',
    ],
    followUps: [
      'CallerRunsPolicy effect?',
      'Virtual thread executor vs platform pool?',
    ],
    misconceptions: [
      'newFixedThreadPool grows threads under load (only core unless custom TPE)',
      'shutdown() stops running tasks immediately (waits unless shutdownNow)',
    ],
    traps: ['Recommending cached thread pool for all server workloads'],
    strongSignals: [
      'Bounded queue + named threads + rejection policy',
      'Separates pools for CPU vs I/O',
      'awaitTermination on deploy',
    ],
  },
  keyTakeaways: [
    'Use ThreadPoolExecutor explicitly in production.',
    'Bounded queue + rejection = backpressure.',
    'core < max + bounded queue enables burst scaling.',
    'shutdown → awaitTermination → shutdownNow.',
    'Virtual thread executor for I/O; sized pool for CPU-bound.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Why use a thread pool?',
      answerHint: 'Reuse threads, bound concurrency, manage queue and lifecycle.',
    },
    {
      level: 'intermediate',
      question: 'Task submission when pool at max and queue full?',
      answerHint: 'RejectedExecutionHandler invoked — AbortPolicy throws.',
    },
    {
      level: 'advanced',
      question: 'Problem with Executors.newFixedThreadPool?',
      answerHint: 'Unbounded LinkedBlockingQueue — tasks pile up, core threads only, OOM risk.',
    },
  ],
  flashcards: [
    { front: 'corePoolSize vs maximumPoolSize', back: 'Core always kept; extra threads up to max when queue full' },
    { front: 'CallerRunsPolicy', back: 'Rejected task runs on submitting thread — backpressure' },
    { front: 'shutdown vs shutdownNow', back: 'shutdown: no new tasks, finish queued; shutdownNow: interrupt workers' },
  ],
  quickRevision: [
    'ThreadPoolExecutor 5 params',
    'Bounded queue + reject',
    'Avoid unbounded fixed pool',
    'Named ThreadFactory',
    'Graceful shutdown pattern',
    'ForkJoin = work stealing',
    'Virtual thread per task executor',
  ],
}

export const content = executorsContent
