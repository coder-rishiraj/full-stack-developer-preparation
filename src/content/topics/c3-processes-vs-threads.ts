import type { TopicContent } from '@/domain/types'

export const processesVsThreadsContent: TopicContent = {
  whatIsIt:
    'An OS process is an isolated program instance with its own virtual address space and resources. A thread is a lightweight unit of execution within a process sharing that address space and heap. Java threads are typically 1:1 mapped to OS threads (platform threads); virtual threads (Java 21+) are JVM-managed and mount on a small pool of carrier threads.',
  whyExists:
    'Processes isolate failures and security boundaries (separate JVMs). Threads enable concurrent work inside one JVM sharing heap and statics — essential for server request handling, parallel streams, and async pipelines without spawning a process per task.',
  mentalModel:
    'Process = apartment building with separate keys. Thread = resident sharing the building’s utilities (heap). Java code uses java.lang.Thread or executors; the OS scheduler time-slices threads on CPU cores. Too many platform threads → context switch overhead and memory for stacks.',
  howItWorks: [
    {
      type: 'paragraph',
      text: 'Each Java application runs in one OS process (usually). Main starts one thread; you create more via Thread, ExecutorService, or ForkJoinPool. Shared mutable heap requires synchronization; stacks and program counters are per-thread.',
    },
    {
      type: 'table',
      headers: ['Aspect', 'Process', 'Thread (Java)'],
      rows: [
        ['Memory', 'Separate address space', 'Shared heap, per-thread stack'],
        ['Creation cost', 'High (fork/exec, JVM boot)', 'Lower (platform thread ~1MB stack)'],
        ['Communication', 'IPC, sockets, files', 'Shared memory + sync primitives'],
        ['Failure isolation', 'Strong', 'Weak — uncaught error in thread may kill process depending on handler'],
        ['Java API', 'ProcessBuilder (external)', 'Thread, Executor, virtual threads'],
      ],
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'Virtual threads (Java 21+)',
      text: 'Millions of virtual threads block cheaply on I/O; carrier platform threads run them. Do not pin carriers with synchronized on hot paths or native blocking — use ReentrantLock or refactor.',
    },
  ],
  architecture: {
    mermaid: `flowchart TB
  subgraph Proc [OS Process - one JVM]
    Heap[Shared Heap]
    Statics[Static fields]
    subgraph T1 [Platform Thread 1]
      S1[Stack]
    end
    subgraph T2 [Platform Thread 2]
      S2[Stack]
    end
    subgraph VT [Virtual Threads]
      V1[vthread]
      V2[vthread]
    end
    Carrier[Carrier pool] --> VT
    T1 --> Heap
    T2 --> Heap
    V1 --> Heap
  end
  Proc2[Other JVM Process] -.->|IPC| Proc`,
    caption: 'Threads share heap inside one JVM process',
  },
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Platform thread vs virtual thread',
      code: `// Platform thread — 1:1 OS thread
Thread t = Thread.ofPlatform().start(() -> task());

// Virtual thread — cheap, mounts on carrier
Thread vt = Thread.ofVirtual().start(() -> blockingIo());`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Shared heap requires sync',
      code: `class Counter {
  int count; // on heap, shared
  synchronized void inc() { count++; }
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Thread states: NEW, RUNNABLE, BLOCKED, WAITING, TIMED_WAITING, TERMINATED.',
        'OS scheduler preempts RUNNABLE threads; BLOCKED/WAITING release CPU.',
        'JVM attaches thread locals, stack for JNI, and safepoint state per thread.',
        'ProcessBuilder starts external processes — separate JVM or binary, not Java threads.',
        'Container awareness: CPU quotas affect effective parallelism for thread pools.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Threads cheaper than processes for concurrent I/O-bound work',
      'Shared heap simplifies data sharing vs IPC serialization',
      'Virtual threads scale to huge concurrency counts',
    ],
    disadvantages: [
      'Shared memory → race conditions without coordination',
      'Platform thread count limited by OS and stack memory',
      'One rogue thread can corrupt shared state',
    ],
    alternatives: [
      'Multiple JVMs / microservices for isolation',
      'Reactive async (event loop) fewer threads',
      'Multiprocessing via external workers',
    ],
    whenToUse: [
      'Server handling concurrent requests in one service',
      'CPU-bound parallel tasks sized to cores',
      'I/O-bound with virtual threads or bounded pools',
    ],
    whenNotToUse: [
      'Need hard fault isolation — separate processes',
      'CPU-bound work with threads >> cores ( wasted context switching)',
    ],
  },
  failureModes: [
    'Thread explosion — unbounded new Thread() per request.',
    'Memory pressure from default stack size × thread count.',
    'Forgotten shared mutable state → races.',
    'Virtual thread pinning on synchronized/native block stalling carriers.',
  ],
  interview: {
    expectations: [
      'Contrast process isolation vs thread shared heap',
      'Explain Java thread mapping to OS threads',
      'Awareness of virtual threads at high level',
    ],
    commonQuestions: [
      'Process vs thread?',
      'Do Java threads share memory?',
      'Platform vs virtual threads?',
    ],
    followUps: [
      'What is thread-safe?',
      'Optimal thread pool size?',
    ],
    misconceptions: [
      'Each Java thread has its own heap (shared heap, private stack)',
      'More threads always means faster CPU work',
    ],
    traps: ['Creating unbounded platform threads for HTTP servers'],
    strongSignals: [
      'Mentions stack vs shared heap',
      'References executors over raw Thread',
      'Knows virtual thread pinning issue',
    ],
  },
  keyTakeaways: [
    'Process: isolated memory; thread: shared heap, private stack.',
    'Java concurrency is in-process — sync required for shared mutable state.',
    'Platform threads costly; prefer pools or virtual threads for I/O.',
    'Virtual threads: many lightweight; carriers run on CPU.',
    'External isolation → separate processes/JVMs, not more threads alone.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What do threads in the same Java process share?',
      answerHint: 'Heap, metaspace/class data, static fields; not stacks or local vars.',
    },
    {
      level: 'intermediate',
      question: 'Why are virtual threads useful?',
      answerHint: 'Cheap blocking I/O concurrency without one OS thread per task.',
    },
    {
      level: 'advanced',
      question: 'What is virtual thread pinning?',
      answerHint: 'Blocked on synchronized/native code holds carrier thread, limiting scalability.',
    },
  ],
  flashcards: [
    { front: 'Thread shares', back: 'Heap and statics; own stack and PC' },
    { front: 'Platform thread stack', back: '~1 MB default (-Xss)' },
    { front: 'Virtual thread carrier', back: 'Platform thread pool executing mounted virtual threads' },
  ],
  quickRevision: [
    'Process = isolated address space',
    'Java threads share heap',
    'Each thread: own stack',
    'Platform 1:1 OS thread',
    'Virtual threads on carrier pool',
    'Use executors, not unbounded Thread',
    'Sync shared mutable state',
  ],
}

export const content = processesVsThreadsContent
