import type { TopicContent } from '@/domain/types'

export const threadPoolsContent: TopicContent = {
  whatIsIt:
    'Thread pools reuse a fixed or bounded set of worker threads to execute many tasks from a queue. In Java: ExecutorService, ThreadPoolExecutor, ForkJoinPool, and virtual-thread executors. Pools amortize thread creation cost and cap concurrency.',
  whyExists:
    'Unbounded thread-per-request models exhaust memory (each ~1MB stack) and thrash CPU with context switches. Pools provide predictable resource usage, queuing under load, rejection policies, and graceful shutdown for servers.',
  mentalModel:
    'Workers pull tasks from a queue. Submit when workers idle → immediate execution. All busy → enqueue. Queue full → grow to max threads or reject. Think “limited checkout lanes + waiting line + overflow policy.”',
  howItWorks: [
    {
      type: 'table',
      headers: ['Factory method', 'Behavior', 'Production?'],
      rows: [
        ['newFixedThreadPool(n)', 'n threads, unbounded LinkedBlockingQueue', 'Avoid — OOM on queue'],
        ['newCachedThreadPool()', 'Unbounded threads, SynchronousQueue', 'Avoid — thread explosion'],
        ['newSingleThreadExecutor()', 'One thread, unbounded queue', 'Serial tasks only'],
        ['newScheduledThreadPool(n)', 'Delayed/periodic tasks', 'OK with bounds'],
        ['newVirtualThreadPerTaskExecutor()', 'Virtual thread per task', 'I/O-bound workloads'],
      ],
    },
    {
      type: 'paragraph',
      text: 'ThreadPoolExecutor submission order: if active < corePoolSize → new worker; else try queue.offer; else if active < maximumPoolSize → new worker; else RejectedExecutionHandler.',
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Sizing heuristic',
      text: 'CPU-bound: ~cores or cores+1. I/O-bound: cores × (1 + wait/compute). Measure; don’t guess cached pool for HTTP servers.',
    },
  ],
  architecture: {
    mermaid: `flowchart LR
  Submit[submit task] --> Q{Queue space?}
  Q -->|yes| Queue[Work queue]
  Q -->|full| Max{active < max?}
  Max -->|yes| Worker[New worker]
  Max -->|no| Reject[Rejection policy]
  Queue --> Pool[Worker threads]
  Pool --> Done[Task complete]`,
    caption: 'ThreadPoolExecutor task flow',
  },
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Explicit pool — production pattern',
      code: `ExecutorService pool = new ThreadPoolExecutor(
    16, 64,
    60L, TimeUnit.SECONDS,
    new ArrayBlockingQueue<>(2000),
    r -> { Thread t = new Thread(r); t.setName("worker-" + t.getId()); return t; },
    new ThreadPoolExecutor.AbortPolicy()
);
try {
  pool.submit(() -> processOrder(order));
} finally {
  pool.shutdown();
  pool.awaitTermination(30, TimeUnit.SECONDS);
}`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Separate pools for CPU vs I/O',
      code: `ExecutorService cpuPool = Executors.newFixedThreadPool(
    Runtime.getRuntime().availableProcessors());
ExecutorService ioPool = Executors.newVirtualThreadPerTaskExecutor();`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Worker inner class extends AQS; loop: getTask() from queue, runTask().',
        'keepAliveTime: idle threads above core count terminate.',
        'CallerRunsPolicy: rejected task runs on submitter — implicit backpressure.',
        'ForkJoinPool: work-stealing deques; common pool backs parallelStream().',
        'Virtual thread executor: no traditional pool queue; scheduler multiplexes on carriers.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Thread reuse — lower latency than per-task creation',
      'Bounded concurrency protects downstream systems',
      'Rejection policies express overload behavior',
    ],
    disadvantages: [
      'Misconfiguration hides overload until OOM or timeout',
      'Shared pool causes cross-feature interference',
      'Blocking tasks in small pool → starvation',
    ],
    alternatives: [
      'Reactive event loops (Netty, WebFlux)',
      'Virtual threads without fixed pool sizing',
      'Process isolation per tenant',
    ],
    whenToUse: [
      'HTTP servers, batch processors, async callbacks',
      'Any recurring task submission pattern',
    ],
    whenNotToUse: [
      'Single-threaded sequential guarantee without executor',
      'Tasks that block on same pool they submit to (deadlock risk)',
    ],
  },
  failureModes: [
    'Unbounded queue growth → OutOfMemoryError.',
    'Pool too small → request timeouts under load.',
    'Forgotten shutdown → JVM hang on deploy.',
    'Nested submit to same fixed pool → deadlock.',
    'ThreadLocal without remove in pooled workers → leak.',
  ],
  interview: {
    expectations: [
      'Explain ThreadPoolExecutor parameters',
      'Why avoid Executors factories in production',
      'Graceful shutdown sequence',
      'Pool sizing for I/O vs CPU',
    ],
    commonQuestions: [
      'How does a thread pool work?',
      'Fixed vs cached pool?',
      'What when queue is full?',
      'Virtual thread executor vs platform pool?',
    ],
    followUps: [
      'CallerRunsPolicy trade-offs?',
      'ForkJoinPool vs ThreadPoolExecutor?',
    ],
    misconceptions: [
      'newFixedThreadPool grows beyond core threads automatically',
      'More threads always improve throughput',
      'shutdown() kills running tasks immediately',
    ],
    traps: ['Recommending cached thread pool for all server workloads'],
    strongSignals: [
      'Bounded queue + named threads + rejection',
      'Separate pools by workload type',
      'awaitTermination on shutdown',
    ],
  },
  keyTakeaways: [
    'Prefer explicit ThreadPoolExecutor over factory shortcuts.',
    'Bounded queue + rejection = backpressure.',
    'core < max only helps with bounded queue.',
    'shutdown → awaitTermination → shutdownNow.',
    'Virtual threads for I/O; sized platform pool for CPU.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Why use a thread pool instead of new Thread per task?',
      answerHint: 'Reuse threads, bound concurrency, queue overload, lower overhead.',
    },
    {
      level: 'intermediate',
      question: 'What is wrong with Executors.newFixedThreadPool in production?',
      answerHint: 'Unbounded LinkedBlockingQueue — tasks pile up, OOM, no max thread scaling.',
    },
    {
      level: 'advanced',
      question: 'Explain task flow when pool at max and queue full.',
      answerHint: 'RejectedExecutionHandler invoked; AbortPolicy throws RejectedExecutionException.',
    },
  ],
  flashcards: [
    { front: 'corePoolSize vs maximumPoolSize', back: 'Core always kept; extras up to max when queue full' },
    { front: 'CallerRunsPolicy', back: 'Rejected task runs on submitter thread' },
    { front: 'shutdown vs shutdownNow', back: 'shutdown: no new tasks; shutdownNow: interrupt workers' },
  ],
  quickRevision: [
    'Avoid unbounded fixed/cached factories',
    'ArrayBlockingQueue + AbortPolicy',
    'Name threads for dumps',
    'Separate CPU and I/O pools',
    'Graceful shutdown pattern',
    'Virtual threads for blocking I/O',
    'Don’t block pool with nested submit',
  ],
}

export const content = threadPoolsContent
