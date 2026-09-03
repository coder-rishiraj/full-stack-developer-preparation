import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Virtual threads (Project Loom, Java 21+) are lightweight JVM-managed threads scheduled on small pool of carrier platform threads. Millions of blocking virtual threads cheaply map I/O wait to carriers without OS thread explosion—use Thread.startVirtualThread or Executors.newVirtualThreadPerTaskExecutor().',
  whyExists:
    'Platform thread pools cap concurrent blocking I/O (one thread per request model). Virtual threads keep synchronous code style while scaling to huge concurrency—carriers reuse during blocking socket/DB waits instead of hoarding OS threads.',
  mentalModel:
    'Virtual thread = cheap task; carrier = platform/OS thread. Blocking I/O normally unmounts the virtual thread so its carrier runs another. JDK 24 removed nearly all synchronized-monitor pinning; native/foreign calls can still pin.',
  howItWorks: [
    {
      type: 'list',
      items: [
        'Thread.ofVirtual().start(r) or Executors.newVirtualThreadPerTaskExecutor().',
        'Blocking I/O (java.net, NIO.2, JDBC drivers that block) yields carrier.',
        'On JDK 21–23, blocking while holding a monitor can pin; JDK 24 (JEP 491) removed this synchronized pinning in nearly all cases.',
        'Do not replace synchronized with ReentrantLock only for Loom on JDK 24+; choose a lock for its semantics.',
        'Structured concurrency bounds child-task lifetimes; it remains a preview API in JDK 26.',
        'Do not pool virtual threads—create per task; cheap to create.',
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Pinning is JDK-version dependent',
      text: 'JDK 21–23 synchronized I/O could pin a carrier. JEP 491 changed monitor implementation in JDK 24, so that migration advice is obsolete on current JDKs. Native/foreign calls can still pin.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Virtual thread per request (Spring Boot 3.2+ option)',
      code: `try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    List<Future<String>> futures = new ArrayList<>();
    for (int i = 0; i < 10_000; i++) {
        futures.add(executor.submit(() -> {
            HttpClient client = HttpClient.newHttpClient();
            var req = HttpRequest.newBuilder(URI.create("https://api.example/x")).build();
            return client.send(req, HttpResponse.BodyHandlers.ofString()).body();
        }));
    }
    for (Future<String> f : futures) f.get();
}`,
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'StructuredTaskScope (JDK 25+ preview API shape)',
      code: `try (var scope = StructuredTaskScope.open()) {
    Subtask<String> a = scope.fork(() -> fetchA());
    Subtask<Integer> b = scope.fork(() -> fetchB());
    scope.join();
    return combine(a.get(), b.get());
}`,
    },
  ],
  tradeoffs: {
    advantages: [
      'Massive concurrency for blocking I/O',
      'Simple synchronous code vs reactive callbacks',
      'Lower memory than platform thread per request',
    ],
    disadvantages: [
      'Native/foreign calls can still pin carrier threads',
      'CPU-bound work still needs platform pools',
      'ThreadLocal semantics costly at millions scale',
      'Legacy libraries may pin or assume platform threads',
    ],
    alternatives: ['Reactive WebFlux stack', 'Async servlet + platform pool', 'Record-style callbacks'],
    whenToUse: ['I/O-bound services (HTTP client, JDBC)', 'Many concurrent blocking calls', 'Migrating thread-per-request servlets'],
    whenNotToUse: ['CPU-heavy parallel compute', 'Downstream service cannot sustain the offered concurrency', 'Libraries that pin carriers'],
  },
  failureModes: [
    'ThreadLocal abuse memory with millions virtual threads.',
    'On old JDKs, monitor pinning can collapse carrier scalability; on JDK 24+, investigate native pinning or downstream limits instead.',
    'Pool of platform threads + virtual confusion—do not wrap virtual in fixed pool unnecessarily.',
    'Missing structured scope shutdown leaks subtasks on failure.',
  ],
  interview: {
    expectations: [
      'Virtual vs platform thread cost model',
      'Version-aware pinning: monitors before JDK 24; native boundaries remain',
      'newVirtualThreadPerTaskExecutor',
    ],
    commonQuestions: ['Virtual threads vs reactive?', 'What is pinning?', 'When not to use virtual threads?'],
    followUps: ['Structured concurrency purpose?', 'ScopedValue vs ThreadLocal?', 'JDBC blocking OK?'],
    misconceptions: ['Virtual threads make CPU work faster', 'Replace all ExecutorService always', 'Same as goroutines in every detail'],
    traps: ['CPU work on virtual threads', 'Huge ThreadLocal maps per virtual thread'],
    strongSignals: ['Mount/unmount on block', 'Knows JEP 491 changed monitor pinning', 'StructuredTaskScope lifecycle'],
  },
  keyTakeaways: [
    'Virtual threads cheap; scheduled on carrier platform threads.',
    'Blocking I/O unmounts virtual thread from carrier.',
    'JDK 24+ synchronized no longer pins in nearly all cases; native calls can.',
    'One virtual thread per task, no pooling.',
    'Structured concurrency for parent-child task lifetimes.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Virtual thread vs platform thread?', answerHint: 'Virtual: JVM-scheduled, cheap millions; platform: OS thread, expensive. Virtual mount on carrier for execution.' },
    { level: 'intermediate', question: 'How did JDK 24 change carrier pinning?', answerHint: 'JEP 491 lets virtual threads unmount while holding monitors; native/foreign calls can still pin.' },
    { level: 'advanced', question: 'Structured concurrency benefit?', answerHint: 'Subtasks lifetime bounded by scope—failure/cancel propagates; no orphan background threads.' },
  ],
  flashcards: [
    { front: 'Create virtual thread', back: 'Thread.startVirtualThread(r) or newVirtualThreadPerTaskExecutor' },
    { front: 'Pinning after JDK 24', back: 'Monitor pinning largely removed; native/foreign calls can still pin' },
    { front: 'Virtual thread sweet spot', back: 'Many concurrent blocking I/O operations' },
  ],
  quickRevision: [
    'Cheap virtual, few carriers',
    'Block I/O unmounts',
    'JDK 21–23: monitor pinning',
    'JDK 24+: JEP 491 fix',
    'No thread pooling',
    'StructuredTaskScope',
    'Not for CPU-bound',
  ],
  production: {
    performance: [
      'For JDK 21–23, trace pinned threads before migration; on JDK 24+ focus on native pinning and resource saturation.',
      'Do not migrate synchronized to ReentrantLock solely for virtual-thread scalability on JDK 24+.',
    ],
    scalability: [
      'Replace platform thread pool sizing with virtual per-task—throughput limited by I/O and carriers not thread count.',
    ],
    observability: [
      'Monitor carrier pool utilization and pinned thread events in JFR.',
      'Thread dumps show virtual threads with carrier assignment in JDK 21+.',
    ],
    reliability: [
      'Use StructuredTaskScope or clear shutdown hooks so virtual subtasks do not outlive request scope.',
    ],
  },
}
