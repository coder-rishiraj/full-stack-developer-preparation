import type { TopicContent } from '@/domain/types'

type ConcurrencyTopicInput = {
  title: string
  sectionTitle: string
  parentTitle?: string
}

const SECTION_FOCUS: Record<string, string> = {
  'Concurrency Foundations':
    'concurrent progress, parallel execution, thread safety, and minimizing shared mutable state',
  'Thread API & Lifecycle':
    'states, start/join, interruption, daemon behavior, and ThreadLocal cleanup',
  'Race Conditions & Safe State':
    'atomicity, visibility, ordering, invariants, and safe publication',
  'Java Memory Model':
    'happens-before edges and the outcomes permitted when code has a data race',
  'Intrinsic Monitors':
    'mutual exclusion, visibility, wait sets, guarded blocks, and monitor identity',
  'Explicit Locks & AQS':
    'timed and interruptible acquisition, Conditions, fairness, and queued synchronizers',
  'Atomics & Lock-Free Programming':
    'CAS retry loops, contention behavior, ABA, and progress guarantees',
  'Coordination Utilities':
    'one-shot gates, reusable barriers, permits, and phased coordination',
  'Concurrent Collections':
    'atomic per-key operations, weakly consistent traversal, and workload-shaped structures',
  'Producer–Consumer & Backpressure':
    'bounded queues, blocking handoff, overload control, and clean shutdown',
  'Executors & Thread Pools':
    'task execution policy, pool sizing, queues, rejection, lifecycle, and saturation metrics',
  'Future & CompletableFuture':
    'result ownership, cancellation, composition, errors, timeouts, and executor selection',
  'Fork/Join & Data Parallelism':
    'work stealing for CPU-bound divide-and-conquer without blocking the common pool',
  'Liveness & Failure Analysis':
    'deadlock, starvation, livelock, prevention, and diagnosis from thread dumps',
  'Virtual Threads':
    'cheap thread-per-task blocking I/O, carrier scheduling, resource limits, and JDK-version pinning',
  'Structured Concurrency & Scoped Values':
    'bounded parent-child task lifetimes and immutable request context across subtasks',
  'Concurrency Testing':
    'repeatable orchestration, JMM outcome testing, progress assertions, and capturing rare failures',
}

export function createConcurrencyTopicContent({
  title,
  sectionTitle,
  parentTitle,
}: ConcurrencyTopicInput): TopicContent {
  const focus =
    SECTION_FOCUS[sectionTitle] ??
    'correct concurrent behavior under contention, cancellation, and failure'
  const parentContext = parentTitle ? ` It is a focused part of ${parentTitle}.` : ''

  return {
    whatIsIt:
      `${title} is a Java concurrency topic in ${sectionTitle}.${parentContext} ` +
      `Study it through ${focus}, not as a list of Thread methods.`,
    whyExists:
      `${title} matters because code can pass tests yet fail under a legal interleaving. ` +
      'The interview standard is a happens-before argument, an invariant, and a shutdown path.',
    mentalModel:
      `For ${title}, write the shared state and invariant first. Mark reads/writes, identify the ` +
      'happens-before edge, then test cancellation, saturation, and task failure.',
    howItWorks: [
      {
        type: 'list',
        ordered: true,
        items: [
          `Define ${title} within ${sectionTitle}.`,
          'Name the threads/tasks and all mutable state they share.',
          'State the synchronization or handoff edge that makes writes visible.',
          'Explain overload and shutdown: interruption, queue capacity, timeout, or scope exit.',
        ],
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Interview standard',
        text:
          `Do not call ${title} “thread-safe” without naming the invariant and atomic operation. ` +
          'Visibility, atomicity, ordering, and liveness are separate claims.',
      },
    ],
    internals: [
      {
        type: 'list',
        items: [
          'Monitor unlock, volatile write, thread start/join, and concurrent utilities establish documented happens-before edges.',
          'CAS can avoid blocking but still retries under contention and may require ABA protection.',
          'Interruption is cooperative; catching InterruptedException normally requires propagation or restoring the flag.',
          'Virtual threads improve blocking-I/O scalability, not CPU parallelism or downstream capacity.',
        ],
      },
    ],
    failureModes: [
      `Using ${title} without a defined ownership or shutdown rule.`,
      'Assuming volatile turns a compound read-modify-write into one atomic operation.',
      'Using an unbounded queue that hides overload until latency or memory collapses.',
      'Swallowing interruption or losing exceptions in asynchronous stages.',
    ],
    production: {
      reliability: [
        'Bound queues, concurrency, deadlines, and resource permits.',
        'Name platform threads and use structured task ownership where available.',
        'Record pool saturation, queue wait, task latency, rejection, and cancellation.',
      ],
      maintainability: [
        'Capture multiple thread dumps to distinguish waiting from no progress.',
        'Use JFR events for locks, park, allocation, virtual threads, and executor behavior.',
        'Reduce a race to a deterministic test with barriers/latches; do not rely on sleep.',
      ],
      observability: [
        'Active threads, queue depth, wait time, rejection count, and task completion rate.',
        'Blocked/parked durations, deadlock detection, carrier utilization, and downstream permits.',
      ],
    },
    interview: {
      expectations: [
        `Define ${title} precisely within ${sectionTitle}.`,
        'Separate safety (nothing bad happens) from liveness (something good eventually happens).',
        'Walk one legal interleaving and its happens-before edges.',
      ],
      commonQuestions: [
        `What problem does ${title} solve?`,
        `When is ${title} insufficient or harmful?`,
        'How do you cancel and shut it down?',
      ],
      followUps: [
        'What happens under contention or queue saturation?',
        'Would virtual threads change this choice?',
      ],
      misconceptions: [
        `${title} automatically makes a whole workflow atomic.`,
        'More threads always increase throughput.',
      ],
      traps: [
        'Using sleep to coordinate correctness.',
        'Giving pre-JDK-24 synchronized-pinning advice without a version qualifier.',
      ],
      strongSignals: [
        'Uses happens-before and invariant vocabulary correctly.',
        'Includes interruption, backpressure, and observability.',
      ],
    },
    keyTakeaways: [
      `${title} belongs to ${sectionTitle}.`,
      `Reason about ${title} via ${focus}.`,
      'State → invariant → happens-before → liveness → shutdown.',
    ],
    interviewQuestions: [
      {
        level: 'basic',
        question: `What is ${title}, and what concurrency problem does it solve?`,
        answerHint: `Place it within ${sectionTitle}, then name the shared-state or task-lifecycle problem.`,
      },
      {
        level: 'intermediate',
        question: `Show a race or liveness failure that ${title} prevents.`,
        answerHint: 'Walk an interleaving and identify the exact happens-before or atomic operation.',
      },
      {
        level: 'advanced',
        question: `How does ${title} behave under saturation, cancellation, or virtual threads?`,
        answerHint: `Discuss ${focus}, then the metrics and shutdown behavior.`,
      },
    ],
    flashcards: [
      {
        front: title,
        back: `${sectionTitle}: state → invariant → HB edge → shutdown.`,
      },
      {
        front: `${title} production check`,
        back: 'Bound it, cancel it, observe it, and test a failure interleaving.',
      },
    ],
    quickRevision: [
      `${title} — ${sectionTitle}`,
      `Focus: ${focus}`,
      'Atomicity ≠ visibility ≠ ordering',
      'Safety + liveness + cancellation',
    ],
  }
}
