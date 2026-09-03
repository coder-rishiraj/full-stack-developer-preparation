import type { Priority } from '@/domain/types'
import type { SectionSeed, TopicSeed } from './build'

const CONCURRENCY = ['java', 'concurrency'] as const
const M12 = [1, 2]
const M45 = [4, 5]

function item(
  id: string,
  title: string,
  priority: Priority = 'tier1',
  extra: Partial<TopicSeed> = {},
): TopicSeed {
  const { tags, executionPriority, ...rest } = extra
  return {
    id,
    title,
    priority,
    months: extra.months ?? (priority === 'tier1' ? M12 : M45),
    tags: [...CONCURRENCY, ...(tags ?? [])],
    executionPriority:
      executionPriority ?? (priority === 'tier1' ? 'p0' : priority === 'tier2' ? 'p1' : 'later'),
    ...rest,
  }
}

function nest(
  parent: string,
  id: string,
  title: string,
  priority: Priority = 'tier1',
  extra: Partial<TopicSeed> = {},
): TopicSeed {
  return item(id, title, priority, {
    ...extra,
    curriculumLevel: 'nested-concept',
    parentTopicId: parent,
  })
}

function section(id: string, title: string, order: number, topics: TopicSeed[]): SectionSeed {
  return {
    id,
    track: 'C',
    title,
    order,
    defaultKind: 'theory',
    defaultDepth: 'deep',
    topics,
  }
}

/**
 * C3.1–C3.16 — Java concurrency from thread fundamentals through Loom.
 * JVM runtime/GC stays in C2; language collections stay in C1.
 */
export const TRACK_C_CONCURRENCY_SECTIONS: SectionSeed[] = [
  section('C3.1', 'Concurrency Foundations', 29, [
    item('c3-processes-vs-threads', 'Processes vs Threads'),
    nest('c3-processes-vs-threads', 'c3-concurrency-vs-parallelism', 'Concurrency vs Parallelism'),
    nest('c3-processes-vs-threads', 'c3-platform-vs-virtual-overview', 'Platform vs Virtual Threads'),
    item('c3-thread-safety', 'Thread Safety'),
    nest('c3-thread-safety', 'c3-shared-mutable-state', 'Shared Mutable State'),
    nest('c3-thread-safety', 'c3-thread-confinement', 'Thread Confinement & Immutability'),
  ]),

  section('C3.2', 'Thread API & Lifecycle', 30, [
    item('c3-thread-lifecycle', 'Thread Lifecycle'),
    nest('c3-thread-lifecycle', 'c3-thread-states', 'NEW, RUNNABLE, BLOCKED, WAITING & TERMINATED'),
    nest('c3-thread-lifecycle', 'c3-thread-vs-runnable', 'Thread, Runnable & Callable'),
    nest('c3-thread-lifecycle', 'c3-start-vs-run', 'start() vs run()'),
    nest('c3-thread-lifecycle', 'c3-sleep-yield-join', 'sleep(), yield() & join()'),
    nest('c3-thread-lifecycle', 'c3-interruption', 'Interruption & Cooperative Cancellation'),
    nest('c3-thread-lifecycle', 'c3-daemon-threads', 'Daemon Threads'),
    nest('c3-thread-lifecycle', 'c3-uncaught-handler', 'UncaughtExceptionHandler'),
    nest('c3-thread-lifecycle', 'c3-threadlocal', 'ThreadLocal & Cleanup'),
  ]),

  section('C3.3', 'Race Conditions & Safe State', 31, [
    item('c3-race-conditions', 'Race Conditions'),
    nest('c3-race-conditions', 'c3-atomicity-visibility-ordering', 'Atomicity, Visibility & Ordering'),
    nest('c3-race-conditions', 'c3-check-then-act', 'Check-Then-Act & Read-Modify-Write'),
    nest('c3-race-conditions', 'c3-critical-section', 'Critical Sections & Invariants'),
    nest('c3-race-conditions', 'c3-safe-publication', 'Safe Publication'),
    nest('c3-race-conditions', 'c3-immutable-state', 'Immutable Snapshots'),
  ]),

  section('C3.4', 'Java Memory Model', 32, [
    item('c3-jmm', 'Java Memory Model'),
    nest('c3-jmm', 'c3-happens-before', 'Happens-Before Rules'),
    nest('c3-jmm', 'c3-reordering', 'Compiler & CPU Reordering'),
    nest('c3-jmm', 'c3-sequential-consistency', 'Sequential Consistency for Data-Race-Free Programs'),
    nest('c3-jmm', 'c3-final-field-semantics', 'Final-Field Semantics'),
    nest('c3-jmm', 'c3-double-checked-locking', 'Double-Checked Locking'),
    nest('c3-jmm', 'c3-causality', 'JMM Causality & Data-Race Outcomes', 'tier2'),
    item('c3-volatile', 'volatile'),
    nest('c3-volatile', 'c3-volatile-visibility', 'Visibility & Release/Acquire Ordering'),
    nest('c3-volatile', 'c3-volatile-not-atomic', 'Why volatile Does Not Make ++ Atomic'),
    nest('c3-volatile', 'c3-volatile-use-cases', 'Flags, Publication & Single-Writer State'),
    nest('c3-volatile', 'c3-varhandle', 'VarHandle Memory Modes', 'tier2'),
  ]),

  section('C3.5', 'Intrinsic Monitors', 33, [
    item('c3-synchronization', 'Synchronization'),
    nest('c3-synchronization', 'c3-synchronized', 'synchronized'),
    nest('c3-synchronization', 'c3-monitor-lock', 'Object Monitor & Mutual Exclusion'),
    nest('c3-synchronization', 'c3-instance-vs-class-lock', 'Instance vs Class Lock'),
    nest('c3-synchronization', 'c3-monitor-reentrancy', 'Monitor Reentrancy'),
    nest('c3-synchronization', 'c3-wait-notify', 'wait(), notify() & notifyAll()'),
    nest('c3-synchronization', 'c3-spurious-wakeup', 'Guarded Blocks & Spurious Wakeups'),
  ]),

  section('C3.6', 'Explicit Locks & AQS', 34, [
    item('c3-locks', 'Locks'),
    nest('c3-locks', 'c3-reentrantlock', 'ReentrantLock'),
    nest('c3-locks', 'c3-lock-condition', 'Condition'),
    nest('c3-locks', 'c3-readwritelock', 'ReadWriteLock'),
    nest('c3-locks', 'c3-stampedlock', 'StampedLock', 'tier2'),
    nest('c3-locks', 'c3-fairness', 'Fair vs Non-Fair Locks'),
    nest('c3-locks', 'c3-locksupport', 'LockSupport park/unpark', 'tier2'),
    nest('c3-locks', 'c3-aqs', 'AbstractQueuedSynchronizer', 'tier2'),
  ]),

  section('C3.7', 'Atomics & Lock-Free Programming', 35, [
    item('c3-atomics', 'Atomic Classes'),
    nest('c3-atomics', 'c3-cas', 'Compare-And-Set (CAS)'),
    nest('c3-atomics', 'c3-atomicreference', 'AtomicReference & AtomicStampedReference'),
    nest('c3-atomics', 'c3-aba-problem', 'ABA Problem', 'tier2'),
    nest('c3-atomics', 'c3-longadder', 'LongAdder vs AtomicLong'),
    nest('c3-atomics', 'c3-field-updaters', 'Atomic Field Updaters', 'tier2'),
    nest('c3-atomics', 'c3-lock-free-progress', 'Blocking, Lock-Free & Wait-Free', 'tier2'),
  ]),

  section('C3.8', 'Coordination Utilities', 36, [
    item('c3-synchronizers', 'Concurrency Synchronizers'),
    nest('c3-synchronizers', 'c3-countdownlatch', 'CountDownLatch'),
    nest('c3-synchronizers', 'c3-cyclicbarrier', 'CyclicBarrier'),
    nest('c3-synchronizers', 'c3-phaser', 'Phaser', 'tier2'),
    nest('c3-synchronizers', 'c3-semaphore', 'Semaphore'),
    nest('c3-synchronizers', 'c3-exchanger', 'Exchanger', 'tier2'),
  ]),

  section('C3.9', 'Concurrent Collections', 37, [
    item('c3-concurrent-collections', 'Concurrent Collections'),
    nest('c3-concurrent-collections', 'c3-concurrenthashmap', 'ConcurrentHashMap'),
    nest('c3-concurrent-collections', 'c3-chm-atomic-operations', 'compute, merge & putIfAbsent'),
    nest('c3-concurrent-collections', 'c3-copyonwritearraylist', 'CopyOnWriteArrayList'),
    nest('c3-concurrent-collections', 'c3-concurrent-queues', 'ConcurrentLinkedQueue / Deque'),
    nest('c3-concurrent-collections', 'c3-concurrent-skip-list', 'ConcurrentSkipListMap / Set', 'tier2'),
    nest('c3-concurrent-collections', 'c3-weakly-consistent', 'Weakly Consistent Iterators'),
    nest('c3-concurrent-collections', 'c3-synchronized-wrappers', 'Synchronized Wrappers vs Concurrent Types'),
  ]),

  section('C3.10', 'Producer–Consumer & Backpressure', 38, [
    item('c3-producer-consumer', 'Producer-Consumer'),
    nest('c3-producer-consumer', 'c3-blockingqueue', 'BlockingQueue'),
    nest('c3-producer-consumer', 'c3-array-vs-linked-blocking', 'ArrayBlockingQueue vs LinkedBlockingQueue'),
    nest('c3-producer-consumer', 'c3-offer-put-poll-take', 'offer/put & poll/take'),
    nest('c3-producer-consumer', 'c3-poison-pill', 'Poison Pill & Shutdown'),
    nest('c3-producer-consumer', 'c3-bounded-backpressure', 'Bounded Queues & Backpressure'),
  ]),

  section('C3.11', 'Executors & Thread Pools', 39, [
    item('c3-thread-pools', 'Thread Pools'),
    nest('c3-thread-pools', 'c3-pool-sizing', 'CPU-Bound vs I/O-Bound Sizing'),
    nest('c3-thread-pools', 'c3-pool-isolation', 'Bulkheads & Pool Isolation'),
    nest('c3-thread-pools', 'c3-threadfactory', 'ThreadFactory, Naming & Context'),
    nest('c3-thread-pools', 'c3-pool-metrics', 'Pool Saturation Metrics'),
    nest('c3-thread-pools', 'c3-thread-pool-starvation', 'Thread-Pool Starvation Deadlock'),
    item('c3-executors', 'Executors'),
    nest('c3-executors', 'c3-threadpoolexecutor', 'ThreadPoolExecutor'),
    nest('c3-executors', 'c3-work-queues', 'Work Queues: Direct, Bounded & Unbounded'),
    nest('c3-executors', 'c3-rejection-policies', 'Rejection Policies & CallerRuns'),
    nest('c3-executors', 'c3-scheduled-executor', 'ScheduledExecutorService'),
    nest('c3-executors', 'c3-graceful-shutdown', 'Graceful Executor Shutdown'),
  ]),

  section('C3.12', 'Future & CompletableFuture', 40, [
    item('c3-futures', 'Future'),
    nest('c3-futures', 'c3-callable-futuretask', 'Callable & FutureTask'),
    nest('c3-futures', 'c3-future-get-timeout', 'get(), Timeout & Exception Wrapping'),
    nest('c3-futures', 'c3-future-cancellation', 'Cancellation & Interruption'),
    nest('c3-futures', 'c3-completionservice', 'ExecutorCompletionService', 'tier2'),
    item('c3-completablefuture', 'CompletableFuture'),
    nest('c3-completablefuture', 'c3-cf-apply-compose', 'thenApply vs thenCompose'),
    nest('c3-completablefuture', 'c3-cf-combine', 'thenCombine, allOf & anyOf'),
    nest('c3-completablefuture', 'c3-cf-error-handling', 'handle, exceptionally & whenComplete'),
    nest('c3-completablefuture', 'c3-cf-timeouts', 'orTimeout & completeOnTimeout'),
    nest('c3-completablefuture', 'c3-cf-executors', 'Common Pool vs Explicit Executor'),
    nest('c3-completablefuture', 'c3-cf-context', 'ThreadLocal / Trace Context Propagation'),
    nest('c3-completablefuture', 'c3-cf-cancellation', 'Cancellation Does Not Automatically Stop Work'),
  ]),

  section('C3.13', 'Fork/Join & Data Parallelism', 41, [
    item('c3-forkjoin', 'ForkJoinPool', 'tier2'),
    nest('c3-forkjoin', 'c3-work-stealing', 'Work Stealing', 'tier2'),
    nest('c3-forkjoin', 'c3-recursive-task-action', 'RecursiveTask & RecursiveAction', 'tier2'),
    nest('c3-forkjoin', 'c3-common-pool', 'ForkJoin Common Pool', 'tier2'),
    nest('c3-forkjoin', 'c3-parallel-streams', 'Parallel Streams', 'tier2'),
    nest('c3-forkjoin', 'c3-managed-blocker', 'ManagedBlocker & Blocking Hazards', 'tier2'),
  ]),

  section('C3.14', 'Liveness & Failure Analysis', 42, [
    item('c3-deadlocks', 'Deadlocks'),
    nest('c3-deadlocks', 'c3-coffman-conditions', 'Four Coffman Conditions'),
    nest('c3-deadlocks', 'c3-lock-ordering', 'Lock Ordering & Prevention'),
    nest('c3-deadlocks', 'c3-deadlock-detection', 'Thread Dumps & Deadlock Detection'),
    nest('c3-deadlocks', 'c3-dining-philosophers', 'Dining Philosophers'),
    nest('c3-deadlocks', 'c3-timeouts-deadlocks', 'Timed Acquisition & Recovery'),
    item('c3-starvation', 'Starvation'),
    nest('c3-starvation', 'c3-livelock', 'Livelock'),
    nest('c3-starvation', 'c3-priority-inversion', 'Priority Inversion', 'tier2'),
    nest('c3-starvation', 'c3-fairness-throughput', 'Fairness vs Throughput'),
  ]),

  section('C3.15', 'Virtual Threads', 43, [
    item('c3-virtual-threads', 'Virtual Threads'),
    nest('c3-virtual-threads', 'c3-vt-carriers', 'Mounting, Unmounting & Carrier Threads'),
    nest('c3-virtual-threads', 'c3-vt-per-task', 'One Virtual Thread per Task — Do Not Pool'),
    nest('c3-virtual-threads', 'c3-vt-blocking-io', 'Blocking I/O with Synchronous Code'),
    nest('c3-virtual-threads', 'c3-vt-semaphore', 'Semaphore for Resource Concurrency Limits'),
    nest('c3-virtual-threads', 'c3-vt-cpu-bound', 'Why Virtual Threads Do Not Speed CPU Work'),
    nest('c3-virtual-threads', 'c3-vt-threadlocal', 'ThreadLocal Cost & Context'),
    nest('c3-virtual-threads', 'c3-vt-pinning', 'Pinning: JDK 21–23 vs JDK 24+'),
    nest('c3-virtual-threads', 'c3-vt-observability', 'JFR & Thread-Dump Observability'),
  ]),

  section('C3.16', 'Structured Concurrency & Scoped Values', 44, [
    item('c3-structured-concurrency', 'Structured Concurrency (Preview)', 'tier2'),
    nest('c3-structured-concurrency', 'c3-task-scope', 'StructuredTaskScope', 'tier2'),
    nest('c3-structured-concurrency', 'c3-task-tree', 'Parent–Child Task Trees', 'tier2'),
    nest('c3-structured-concurrency', 'c3-failure-cancellation', 'Failure, Cancellation & Join Policies', 'tier2'),
    nest('c3-structured-concurrency', 'c3-joiners', 'Joiners & Fan-Out/Fan-In', 'tier2'),
    nest('c3-structured-concurrency', 'c3-preview-api', 'JDK 26 Preview Status & API Evolution', 'tier2'),
    nest('c3-structured-concurrency', 'c3-structured-observability', 'Structured Thread Dumps', 'tier2'),
    item('c3-scoped-values', 'Scoped Values', 'tier2'),
    nest('c3-scoped-values', 'c3-scoped-vs-threadlocal', 'ScopedValue vs ThreadLocal', 'tier2'),
    nest('c3-scoped-values', 'c3-scoped-inheritance', 'Inheritance into Structured Subtasks', 'tier2'),
    nest('c3-scoped-values', 'c3-scoped-immutability', 'Immutable Request Context', 'tier2'),
  ]),

  section('C3.17', 'Concurrency Testing', 45, [
    item('c3-concurrency-testing', 'Testing Concurrent Code', 'tier2'),
    nest('c3-concurrency-testing', 'c3-test-with-coordinators', 'Deterministic Tests with Latches & Barriers', 'tier2'),
    nest('c3-concurrency-testing', 'c3-no-sleep-tests', 'Why Tests Must Not Coordinate with sleep()', 'tier2'),
    nest('c3-concurrency-testing', 'c3-jcstress', 'JCStress & JMM Litmus Tests', 'tier2'),
    nest('c3-concurrency-testing', 'c3-lincheck', 'Lincheck for Concurrent Data Structures', 'tier2'),
    nest('c3-concurrency-testing', 'c3-stress-failure-capture', 'Stress Loops, Timeouts & Failure Capture', 'tier2'),
  ]),
]
