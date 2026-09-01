import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Virtual threads (Project Loom, Java 21+) are lightweight JVM-managed threads scheduled on small pool of carrier platform threads. Millions of blocking virtual threads cheaply map I/O wait to carriers without OS thread explosion—use Thread.startVirtualThread or Executors.newVirtualThreadPerTaskExecutor().',
  whyExists:
    'Platform thread pools cap concurrent blocking I/O (one thread per request model). Virtual threads keep synchronous code style while scaling to huge concurrency—carriers reuse during blocking socket/DB waits instead of hoarding OS threads.',
  mentalModel:
    'Virtual thread = cheap task; carrier = real OS thread. Block on I/O → virtual thread unmounts, carrier runs another virtual thread. Pinning happens when synchronized/native blocks carrier.',
  howItWorks: [
    {
      type: 'list',
      items: [
        'Thread.ofVirtual().start(r) or Executors.newVirtualThreadPerTaskExecutor().',
        'Blocking I/O (java.net, NIO.2, JDBC drivers that block) yields carrier.',
        'Carrier pinning: synchronized method/block or native code on carrier prevents unmount—limits scalability.',
        'ReentrantLock preferred over synchronized in hot paths under virtual threads.',
        'Structured concurrency: StructuredTaskScope groups subtasks with definite join/shutdown (Java 21 preview/incubator evolution).',
        'Do not pool virtual threads—create per task; cheap to create.',
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Carrier pinning',
      text: 'synchronized inside request handler on JDK 21 can pin carrier during block—use ReentrantLock or reduce synchronized in I/O paths; monitor jdk.tracePinnedThreads.',
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
      caption: 'StructuredTaskScope (Java 21+)',
      code: `try (var scope = new StructuredTaskScope.ShutdownOnFailure()) {
    Subtask<String> a = scope.fork(() -> fetchA());
    Subtask<Integer> b = scope.fork(() -> fetchB());
    scope.join();
    scope.throwIfFailed();
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
      'Carrier pinning with synchronized/native',
      'CPU-bound work still needs platform pools',
      'ThreadLocal semantics costly at millions scale',
      'Legacy libraries may pin or assume platform threads',
    ],
    alternatives: ['Reactive WebFlux stack', 'Async servlet + platform pool', 'Record-style callbacks'],
    whenToUse: ['I/O-bound services (HTTP client, JDBC)', 'Many concurrent blocking calls', 'Migrating thread-per-request servlets'],
    whenNotToUse: ['CPU-heavy parallel compute', 'Code heavy synchronized without refactor', 'Libraries that pin carriers'],
  },
  failureModes: [
    'ThreadLocal abuse memory with millions virtual threads.',
    'Pinning collapses to few carriers—throughput like small platform pool.',
    'Pool of platform threads + virtual confusion—do not wrap virtual in fixed pool unnecessarily.',
    'Missing structured scope shutdown leaks subtasks on failure.',
  ],
  interview: {
    expectations: [
      'Virtual vs platform thread cost model',
      'Carrier pinning with synchronized',
      'newVirtualThreadPerTaskExecutor',
    ],
    commonQuestions: ['Virtual threads vs reactive?', 'What is pinning?', 'When not to use virtual threads?'],
    followUps: ['Structured concurrency purpose?', 'ThreadLocal with virtual threads?', 'JDBC blocking OK?'],
    misconceptions: ['Virtual threads make CPU work faster', 'Replace all ExecutorService always', 'Same as goroutines in every detail'],
    traps: ['CPU work on virtual threads', 'Huge ThreadLocal maps per virtual thread'],
    strongSignals: ['Mount/unmount on block', 'ReentrantLock over synchronized', 'StructuredTaskScope lifecycle'],
  },
  keyTakeaways: [
    'Virtual threads cheap; scheduled on carrier platform threads.',
    'Blocking I/O unmounts virtual thread from carrier.',
    'Avoid synchronized in I/O paths—pinning risk.',
    'One virtual thread per task, no pooling.',
    'Structured concurrency for parent-child task lifetimes.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Virtual thread vs platform thread?', answerHint: 'Virtual: JVM-scheduled, cheap millions; platform: OS thread, expensive. Virtual mount on carrier for execution.' },
    { level: 'intermediate', question: 'Carrier pinning?', answerHint: 'synchronized or native code blocks carrier while virtual thread blocked—carrier cannot run other virtual threads.' },
    { level: 'advanced', question: 'Structured concurrency benefit?', answerHint: 'Subtasks lifetime bounded by scope—failure/cancel propagates; no orphan background threads.' },
  ],
  flashcards: [
    { front: 'Create virtual thread', back: 'Thread.startVirtualThread(r) or newVirtualThreadPerTaskExecutor' },
    { front: 'Pinning cause', back: 'synchronized block or native JNI during blocking operation on carrier' },
    { front: 'Virtual thread sweet spot', back: 'Many concurrent blocking I/O operations' },
  ],
  quickRevision: [
    'Cheap virtual, few carriers',
    'Block I/O unmounts',
    'Pinning: synchronized',
    'Use ReentrantLock',
    'No thread pooling',
    'StructuredTaskScope',
    'Not for CPU-bound',
  ],
  production: {
    performance: [
      'Enable -Djdk.tracePinnedThreads=full in staging to find pinning before prod.',
      'Prefer ReentrantLock and non-pinning JDBC drivers for virtual thread servlet containers.',
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
