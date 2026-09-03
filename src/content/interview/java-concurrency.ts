import type { ReactInterviewItem } from './types'

export const JAVA_INTERVIEW_CONCURRENCY: ReactInterviewItem[] = [
  {
    id: 'concurrency-parallelism',
    question: 'Concurrency vs parallelism?',
    relatedTopicIds: ['c3-concurrency-vs-parallelism', 'c3-processes-vs-threads'],
    answer: [
      {
        type: 'paragraph',
        text: 'Concurrency means multiple tasks make progress during overlapping time; one core can interleave them. Parallelism means tasks execute simultaneously on multiple cores. Virtual threads increase practical I/O concurrency; they do not add CPU parallelism.',
      },
    ],
  },
  {
    id: 'thread-start-run',
    question: 'What is the difference between start() and run()?',
    relatedTopicIds: ['c3-start-vs-run', 'c3-thread-lifecycle'],
    answer: [
      {
        type: 'paragraph',
        text: '`start()` asks the JVM to schedule a new thread and eventually invoke run; it also creates a happens-before edge into the new thread. Calling `run()` is an ordinary method call on the current thread. A Thread instance can be started only once.',
      },
    ],
  },
  {
    id: 'happens-before',
    question: 'What does happens-before guarantee?',
    relatedTopicIds: ['c3-happens-before', 'c3-jmm'],
    answer: [
      {
        type: 'paragraph',
        text: 'If A happens-before B, A’s memory effects are visible to B and ordered before it. Core edges: program order, monitor unlock→later lock, volatile write→later read, start→thread actions, thread actions→successful join, and documented handoffs in concurrent collections and executors.',
      },
    ],
  },
  {
    id: 'java-data-race',
    question: 'Is a Java data race “undefined behavior”?',
    relatedTopicIds: ['c3-causality', 'c3-race-conditions'],
    answer: [
      {
        type: 'paragraph',
        text: 'Do not use the C/C++ phrase. The JMM still constrains executions and preserves type/memory safety, but a racy program loses sequential-consistency reasoning and can produce counterintuitive results. Fix the missing happens-before edge rather than guessing what one CPU will do.',
      },
    ],
  },
  {
    id: 'volatile-synchronized-atomic',
    question: 'volatile vs synchronized vs AtomicInteger?',
    relatedTopicIds: ['c3-volatile', 'c3-synchronization', 'c3-atomics'],
    answer: [
      {
        type: 'paragraph',
        text: 'volatile gives visibility and ordering for reads/writes of one variable, not atomic compound operations. synchronized gives mutual exclusion plus visibility and can protect multi-field invariants. AtomicInteger uses CAS for atomic single-variable operations such as increment; contention can cause retries.',
      },
    ],
  },
  {
    id: 'wait-sleep',
    question: 'wait() vs sleep()?',
    relatedTopicIds: ['c3-wait-notify', 'c3-sleep-yield-join'],
    answer: [
      {
        type: 'paragraph',
        text: '`wait` must be called while owning the object monitor, releases that monitor, and waits for notification/interruption/timeout. `sleep` pauses the current thread without releasing monitors. Always call wait in a while loop because conditions can change and wakeups can be spurious.',
      },
    ],
  },
  {
    id: 'lock-vs-synchronized',
    question: 'When would you choose ReentrantLock over synchronized?',
    relatedTopicIds: ['c3-reentrantlock', 'c3-synchronized', 'c3-lock-condition'],
    answer: [
      {
        type: 'paragraph',
        text: 'Choose ReentrantLock for timed/interruptible acquisition, optional fairness, or multiple Condition queues. Use synchronized for simple lexical critical sections and automatic release. On JDK 24+, avoiding virtual-thread monitor pinning is not a valid reason by itself to migrate.',
      },
    ],
  },
  {
    id: 'cas-aba',
    question: 'How does CAS work, and what is the ABA problem?',
    relatedTopicIds: ['c3-cas', 'c3-aba-problem', 'c3-atomicreference'],
    answer: [
      {
        type: 'paragraph',
        text: 'CAS atomically changes a value only if it still equals the expected value; failures retry. ABA means a reference changed A→B→A, so equality hides the intervening mutation. Version the value with AtomicStampedReference when that history matters.',
      },
    ],
  },
  {
    id: 'latch-barrier-semaphore',
    question: 'CountDownLatch vs CyclicBarrier vs Semaphore?',
    relatedTopicIds: ['c3-countdownlatch', 'c3-cyclicbarrier', 'c3-semaphore'],
    answer: [
      {
        type: 'paragraph',
        text: 'Latch is a one-shot gate: N events count down while waiters await zero. Barrier is reusable: N peer threads meet at phases. Semaphore controls permits for concurrent access to a scarce resource; it does not make the resource’s internals thread-safe.',
      },
    ],
  },
  {
    id: 'chm-compound',
    question: 'Why is containsKey()+put() racy even on ConcurrentHashMap?',
    relatedTopicIds: ['c3-concurrenthashmap', 'c3-chm-atomic-operations'],
    answer: [
      {
        type: 'paragraph',
        text: 'Each method is safe, but another thread can interleave between them. Use `putIfAbsent`, `compute`, `computeIfAbsent`, or `merge` for one atomic per-key operation. Multi-key invariants still require a higher-level design or lock.',
      },
    ],
  },
  {
    id: 'threadpool-overload',
    question: 'Walk ThreadPoolExecutor task admission under overload.',
    relatedTopicIds: ['c3-threadpoolexecutor', 'c3-work-queues', 'c3-rejection-policies'],
    answer: [
      {
        type: 'paragraph',
        text: 'Create workers up to core; then offer to the queue; if a bounded queue is full, grow to maximum; at max plus full queue, invoke rejection policy. An unbounded queue means maximumPoolSize usually never matters and overload becomes latency/memory growth.',
      },
    ],
  },
  {
    id: 'interrupt-cancel',
    question: 'How should cooperative cancellation handle InterruptedException?',
    relatedTopicIds: ['c3-interruption', 'c3-future-cancellation'],
    answer: [
      {
        type: 'paragraph',
        text: 'Stop work promptly, clean up, then either propagate InterruptedException or restore status with `Thread.currentThread().interrupt()`. Do not swallow it. `Future.cancel(true)` only requests interruption; the task must reach an interruptible operation or check the flag.',
      },
    ],
  },
  {
    id: 'cf-compose',
    question: 'thenApply vs thenCompose, and which thread runs them?',
    relatedTopicIds: ['c3-cf-apply-compose', 'c3-cf-executors'],
    answer: [
      {
        type: 'paragraph',
        text: 'thenApply maps T→U; thenCompose flattens T→CompletionStage<U>. Non-Async stages can run on the thread that completes the prior stage or the caller if already complete. Async variants use ForkJoinPool.commonPool unless you provide an Executor. Supply an explicit executor for blocking I/O.',
      },
    ],
  },
  {
    id: 'deadlock',
    question: 'How do you prevent and diagnose deadlock?',
    relatedTopicIds: ['c3-deadlocks', 'c3-lock-ordering', 'c3-deadlock-detection'],
    answer: [
      {
        type: 'paragraph',
        text: 'Prevent circular wait with a global lock order, reduce nested locking, or use timed acquisition where recovery is valid. Diagnose with `jcmd Thread.print`/`jstack`: find threads BLOCKED on monitors held by each other and compare multiple dumps.',
      },
    ],
  },
  {
    id: 'virtual-threads',
    question: 'When do virtual threads help, and should you pool them?',
    relatedTopicIds: ['c3-virtual-threads', 'c3-vt-per-task', 'c3-vt-semaphore'],
    answer: [
      {
        type: 'paragraph',
        text: 'They help high-concurrency blocking I/O by unmounting from carrier threads while blocked. Create one per task; do not pool them. Limit scarce downstream resources with a Semaphore or connection pool. CPU-bound throughput remains limited by cores.',
      },
    ],
  },
  {
    id: 'virtual-pinning-version',
    question: 'Does synchronized pin virtual threads?',
    relatedTopicIds: ['c3-vt-pinning', 'c3-synchronized'],
    answer: [
      {
        type: 'paragraph',
        text: 'JDK 21–23 could pin a virtual thread when blocking while holding a monitor. JEP 491 in JDK 24 changed monitor implementation and removed nearly all synchronized pinning. Native/foreign calls can still pin. Always qualify this answer by JDK version.',
      },
    ],
  },
  {
    id: 'structured-concurrency',
    question: 'What problem does structured concurrency solve?',
    relatedTopicIds: ['c3-structured-concurrency', 'c3-task-tree', 'c3-failure-cancellation'],
    answer: [
      {
        type: 'paragraph',
        text: 'It makes concurrent subtasks a lexical parent-child tree: the parent joins them before leaving the scope, and failure/cancellation policies can stop siblings. This improves lifetime, error, and observability reasoning. StructuredTaskScope remains a preview API in JDK 26, so do not hard-code an old constructor shape.',
      },
    ],
  },
  {
    id: 'scoped-values',
    question: 'ScopedValue vs ThreadLocal?',
    relatedTopicIds: ['c3-scoped-values', 'c3-scoped-vs-threadlocal', 'c3-threadlocal'],
    answer: [
      {
        type: 'paragraph',
        text: 'ThreadLocal is mutable per-thread state and is easy to leak in pools unless removed. ScopedValue provides an immutable, dynamically bounded binding that callees — and structured child tasks — can read. Scoped Values were finalized in JDK 25 and fit request context on virtual threads.',
      },
    ],
  },
  {
    id: 'test-concurrent-code',
    question: 'How do you test concurrent code without flaky sleep() calls?',
    relatedTopicIds: ['c3-concurrency-testing', 'c3-test-with-coordinators', 'c3-jcstress'],
    answer: [
      {
        type: 'paragraph',
        text: 'Use latches or barriers to force the interleaving, bounded timeouts to prove progress, and retain every worker failure. Repeat stress scenarios under varied scheduling. For JMM and atomicity claims, use JCStress, which enumerates and classifies observable outcomes; use Lincheck for concurrent data-structure histories.',
      },
    ],
  },
]
