import type { TopicContent } from '@/domain/types'

export const producerConsumerContent: TopicContent = {
  whatIsIt:
    'The producer-consumer pattern decouples threads that produce work/items from threads that consume them via a shared bounded or unbounded buffer. Producers enqueue; consumers dequeue — coordination ensures consumers wait when empty and producers wait (or fail) when full.',
  whyExists:
    'Direct handoff couples rates: fast producers overwhelm slow consumers without buffering. A queue absorbs bursts, enables parallel workers, and provides natural backpressure when bounded — foundational for thread pools, logging pipelines, and event processing.',
  mentalModel:
    'Assembly line bin: producers drop widgets, consumers pick up. Bounded bin full → producer waits or drops. Empty bin → consumer waits. BlockingQueue encodes this; wait/notify on shared queue is the manual version.',
  howItWorks: [
    {
      type: 'paragraph',
      text: 'Preferred: ArrayBlockingQueue or LinkedBlockingQueue with thread pool consumers. put()/take() block; offer()/poll() with timeout for degradation. Poison pill sentinel object signals consumers to exit after draining.',
    },
    {
      type: 'table',
      headers: ['Approach', 'Pros', 'Cons'],
      rows: [
        ['BlockingQueue', 'Simple, j.u.c optimized', 'Choose capacity carefully'],
        ['wait/notify + queue', 'Interview classic', 'Easy to get wrong (while loop, notifyAll)'],
        ['Disruptor (LMAX)', 'Ultra-low latency ring buffer', 'Complex API'],
        ['Reactive stream', 'Backpressure protocol', 'Heavier framework'],
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Graceful shutdown',
      text: 'Use poison pill or shutdown flag + interrupt; consumers exit take loop; awaitTermination on executor.',
    },
  ],
  architecture: {
    mermaid: `flowchart LR
  P1[Producer 1] --> Q[BlockingQueue buffer]
  P2[Producer 2] --> Q
  Q --> C1[Consumer 1]
  Q --> C2[Consumer 2]
  Q -->|full| P1
  Q -->|empty| C1`,
    caption: 'Bounded queue mediates producers and consumers',
  },
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'BlockingQueue producer-consumer',
      code: `BlockingQueue<Task> queue = new ArrayBlockingQueue<>(1000);

// producers
executor.submit(() -> {
  while (running) queue.put(task); // blocks if full
});

// consumers
executor.submit(() -> {
  while (true) {
    Task t = queue.take(); // blocks if empty
    if (t == POISON) break;
    process(t);
  }
});`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Manual wait/notify (interview)',
      code: `synchronized (queue) {
  while (queue.isEmpty()) queue.wait();
  item = queue.remove();
}
// producer after add:
synchronized (queue) {
  queue.add(item);
  queue.notifyAll();
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'ArrayBlockingQueue: single lock, circular array; fair optional constructor.',
        'LinkedBlockingQueue: often separate put/take locks for throughput.',
        'Happens-before: actions in producer before put happen-before take actions in consumer (BlockingQueue spec).',
        'ExecutorService worker queue is itself producer-consumer between submitter and workers.',
        'Backpressure: bounded queue + CallerRunsPolicy propagates slowness to producer thread.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Smooths bursty load',
      'Scales consumers independently',
      'Clear backpressure with bounded queues',
    ],
    disadvantages: [
      'Queue depth hides consumer lag until full',
      'Unbounded queue → OOM under sustained overload',
      'Poison pill requires one per consumer if multiple take',
    ],
    alternatives: [
      'Direct handoff SynchronousQueue (zero buffer)',
      'Kafka/Rabbit for cross-process',
      'Reactive pull with demand',
    ],
    whenToUse: [
      'Worker pools processing async tasks',
      'Log/metrics aggregation pipelines',
      'Download parsers feeding processors',
    ],
    whenNotToUse: [
      'Strict synchronous RPC with no buffering need',
      'When lossless overload handling requires external broker',
    ],
  },
  failureModes: [
    'Lost wakeup: notify without holding lock or if without while.',
    'Unbounded queue memory blowup.',
    'Consumers stuck on take after shutdown without poison/interrupt.',
    'Single consumer bottleneck despite many producers.',
  ],
  interview: {
    expectations: [
      'Implement or explain wait/notify with while loop',
      'Prefer BlockingQueue in production answer',
      'Discuss bounded capacity and backpressure',
    ],
    commonQuestions: [
      'Implement producer-consumer in Java?',
      'Why while not if with wait?',
      'BlockingQueue vs wait/notify?',
    ],
    followUps: [
      'Poison pill shutdown?',
      'What queue for thread pool?',
    ],
    misconceptions: [
      'notify is enough with multiple conditions (use notifyAll)',
      'poll without timeout is same as take (poll returns null immediately if empty)',
    ],
    traps: ['Unbounded queue as “simple” without OOM discussion'],
    strongSignals: [
      'ArrayBlockingQueue capacity tied to SLA',
      'offer with timeout for degradation path',
      'Happens-before via queue ops',
    ],
  },
  keyTakeaways: [
    'Queue decouples production and consumption rates.',
    'BlockingQueue is production-ready default.',
    'Bounded queue + full put = backpressure.',
    'wait/notify: always while loop, notifyAll multiple conditions.',
    'Plan shutdown: poison pill, interrupt, or offer sentinel.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Role of buffer in producer-consumer?',
      answerHint: 'Absorb bursts; decouple rates; block when full/empty.',
    },
    {
      level: 'intermediate',
      question: 'Why while (queue.isEmpty()) wait()?',
      answerHint: 'Spurious wakeup; another consumer may drain between wakeup and run.',
    },
    {
      level: 'advanced',
      question: 'How does bounded queue provide backpressure?',
      answerHint: 'put blocks or offer fails when full — slows producers to consumer rate.',
    },
  ],
  flashcards: [
    { front: 'take vs poll', back: 'take blocks if empty; poll returns null (or timed wait)' },
    { front: 'notifyAll when', back: 'Multiple waiters or multiple wait conditions on same monitor' },
    { front: 'Poison pill', back: 'Sentinel task telling consumer to exit after drain' },
  ],
  quickRevision: [
    'Queue between producers/consumers',
    'BlockingQueue put/take',
    'Bounded = backpressure',
    'while + wait/notifyAll',
    'Poison pill shutdown',
    'Unbounded queue OOM risk',
    'Executor queue is same pattern',
  ],
}

export const content = producerConsumerContent
