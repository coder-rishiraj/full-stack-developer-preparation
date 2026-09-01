import type { TopicContent } from '@/domain/types'

export const threadLifecycleContent: TopicContent = {
  whatIsIt:
    'Thread lifecycle describes the states a Java thread passes through from creation to termination: NEW → RUNNABLE → (BLOCKED | WAITING | TIMED_WAITING) → TERMINATED. Thread class and Thread.State enum expose this; JVM scheduler maps RUNNABLE to OS thread execution.',
  whyExists:
    'Understanding lifecycle is essential for debugging deadlocks, thread dumps, and shutdown. Interviewers probe whether you know why threads block, how join/interrupt work, and how daemon vs user threads affect JVM exit.',
  mentalModel:
    'A thread is a worker with a call stack. start() schedules it; run() executes on a CPU core when scheduled. Blocking I/O or lock contention moves it off CPU into waiting states. interrupt() sets a flag — does not forcibly kill; cooperative cancellation required.',
  howItWorks: [
    {
      type: 'table',
      headers: ['State', 'Meaning'],
      rows: [
        ['NEW', 'Created but start() not called'],
        ['RUNNABLE', 'Eligible to run (includes running and ready on multi-core)'],
        ['BLOCKED', 'Waiting to enter synchronized block/monitor'],
        ['WAITING', 'wait(), join() with no timeout, LockSupport.park()'],
        ['TIMED_WAITING', 'sleep(), wait(timeout), join(timeout)'],
        ['TERMINATED', 'run() completed or uncaught exception'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'Typical state transitions',
      diagram: `stateDiagram-v2
  [*] --> NEW
  NEW --> RUNNABLE: start()
  RUNNABLE --> BLOCKED: waiting for monitor
  BLOCKED --> RUNNABLE: acquired monitor
  RUNNABLE --> WAITING: wait/join/park
  WAITING --> RUNNABLE: notify/unpark/join completes
  RUNNABLE --> TIMED_WAITING: sleep/timed wait
  TIMED_WAITING --> RUNNABLE: timeout/interrupt
  RUNNABLE --> TERMINATED: run() ends`,
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Never call run() directly',
      text: 'thread.run() executes in caller thread — no new thread. Always thread.start() once; second start() throws IllegalThreadStateException.',
    },
  ],
  architecture: {
    mermaid: `flowchart TB
  App[Application] -->|new Thread| NEW
  NEW -->|start| JVM[JVM Thread Scheduler]
  JVM --> OS[OS Thread / Carrier]
  OS --> CPU[CPU core execution]
  JVM -->|blocked on I/O or lock| Wait[Waiting states]`,
    caption: 'Java thread maps to OS thread (platform) or carrier (virtual threads)',
  },
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Lifecycle with join and interrupt',
      code: `Thread worker = new Thread(() -> {
  try {
    while (!Thread.currentThread().isInterrupted()) {
      doWork();
    }
  } catch (InterruptedException e) {
    Thread.currentThread().interrupt(); // restore flag
  }
});
worker.start();
worker.join(5, TimeUnit.SECONDS);
if (worker.isAlive()) worker.interrupt();`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Daemon vs user thread',
      code: `Thread daemon = new Thread(() -> { /* background */ });
daemon.setDaemon(true); // JVM exits when only daemons remain
daemon.start();`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Platform threads: 1:1 with OS thread; stack ~1MB default; expensive to create.',
        'Virtual threads (Java 21): JVM-managed; mount on carrier thread pool; cheap millions.',
        'Thread interrupt: sets interrupted status; blocking methods throw InterruptedException if policy checks.',
        'UncaughtExceptionHandler on Thread/ThreadGroup for logging crashes.',
        'ThreadLocal: per-thread variable copy; must remove in pools to avoid leaks.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Explicit lifecycle aids debugging and jstack analysis',
      'join() coordinates completion without polling',
      'Daemon threads for housekeeping without blocking shutdown',
    ],
    disadvantages: [
      'Raw Thread API lacks pool reuse and backpressure',
      'Interrupt protocol easy to mishandle (swallow flag)',
      'Platform thread count limited by OS',
    ],
    alternatives: [
      'ExecutorService for managed pools',
      'Virtual threads for massive concurrency',
      'CompletableFuture for async composition',
    ],
    whenToUse: [
      'Simple one-off background tasks (rare in modern code)',
      'Understanding jstack and concurrency fundamentals',
    ],
    whenNotToUse: [
      'Server request handling — use thread pools or virtual threads',
      'Fire-and-forget without lifecycle management',
    ],
  },
  failureModes: [
    'Calling start() twice → IllegalThreadStateException.',
    'Ignoring interrupt flag after catching InterruptedException.',
    'Non-daemon threads prevent JVM exit on main completion.',
    'ThreadLocal in pooled threads without remove() → memory leak.',
    'Blocking in synchronized without timeout → stuck in BLOCKED forever.',
  ],
  interview: {
    expectations: [
      'List Thread.State values and transitions',
      'Explain start vs run, join vs sleep',
      'Describe interrupt semantics cooperatively',
    ],
    commonQuestions: [
      'What are thread states in Java?',
      'Difference between sleep and wait?',
      'What does thread interrupt do?',
      'Daemon vs user thread?',
    ],
    followUps: [
      'How do virtual threads differ in lifecycle?',
      'What shows in jstack for BLOCKED vs WAITING?',
    ],
    misconceptions: [
      'RUNNABLE means currently executing on CPU',
      'interrupt() stops thread immediately',
      'sleep releases locks (it does not)',
    ],
    traps: ['Saying wait() without mentioning must hold monitor'],
    strongSignals: [
      'Distinguishes BLOCKED (monitor) from WAITING (wait/join)',
      'Mentions cooperative interrupt handling',
      'Knows daemon thread JVM exit rule',
    ],
  },
  keyTakeaways: [
    'NEW → RUNNABLE → waiting substates → TERMINATED.',
    'start() once; run() in caller if called directly.',
    'sleep holds locks; wait releases monitor.',
    'interrupt is a flag — check isInterrupted or handle InterruptedException.',
    'Daemon threads don’t block JVM shutdown.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What happens when you call start() on a thread?',
      answerHint: 'Transitions NEW→RUNNABLE; JVM schedules run() on separate thread.',
    },
    {
      level: 'intermediate',
      question: 'BLOCKED vs WAITING vs TIMED_WAITING?',
      answerHint: 'BLOCKED for monitor lock; WAITING indefinite (wait/join); TIMED_WAITING with timeout.',
    },
    {
      level: 'advanced',
      question: 'Correct pattern after catching InterruptedException?',
      answerHint: 'Restore interrupt status or exit; don’t swallow silently in loops.',
    },
  ],
  flashcards: [
    { front: 'start() vs run()', back: 'start() new thread; run() executes in current thread' },
    { front: 'sleep vs wait', back: 'sleep: TIMED_WAITING, keeps lock; wait: releases monitor, needs sync' },
    { front: 'Daemon thread', back: 'JVM exits when only daemons left; set before start()' },
  ],
  quickRevision: [
    '6 Thread.State values',
    'start() once only',
    'RUNNABLE = ready or running',
    'BLOCKED = monitor queue',
    'interrupt = cooperative flag',
    'join waits TERMINATED',
    'Virtual threads cheap lifecycle',
  ],
}

export const content = threadLifecycleContent
