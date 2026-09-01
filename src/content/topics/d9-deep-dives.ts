import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Component deep dives in system design interviews zoom into one critical piece — feed fan-out, consistent hashing, write path, notification pipeline — with algorithms, data structures, failure handling, and bottlenecks after the high-level diagram is agreed.',
  whyExists:
    'HLD alone can be vague boxes. Interviewers probe whether you can implement-level reason about the hardest 20% — celebrity problem, idempotent consumers, cache stampede. Deep dive separates senior candidates who own production details.',
  mentalModel:
    'Telescope after map. Map shows continents (HLD); deep dive examines one mountain — trail (algorithm), weather (failures), supplies (capacity). Interviewer picks or you propose: "hardest part is feed fan-out — let me dive there."',
  howItWorks: [
    {
      type: 'table',
      headers: ['Component', 'Deep dive topics', 'Watch for'],
      rows: [
        ['Feed fan-out', 'Push vs pull, hybrid, batch write', 'Celebrity hot spot'],
        ['Rate limiter', 'Token bucket Redis Lua', 'Distributed accuracy'],
        ['Cache', 'Aside pattern, stampede lock', 'Invalidation'],
        ['Search index', 'CDC, inverted index rebuild', 'Lag vs freshness'],
        ['Shard routing', 'Consistent hash, rebalancing', 'Virtual nodes'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'Deep dive flow in interview',
      diagram: `flowchart TB
  HLD[High-level diagram done] --> Pick[Pick critical component]
  Pick --> Algo[Algorithm + data structures]
  Algo --> Fail[Failure modes + fixes]
  Fail --> Scale[Bottleneck at stated QPS]`,
    },
    {
      type: 'list',
      items: [
        'Proactively offer: "I can deep dive on X or Y"',
        '5–10 minutes: algorithm sketch, not code line-by-line',
        'Tie back to stated QPS and consistency requirements',
        'Mention observability and ops for that component',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Interviewer: dive into notification delivery. Answer: event bus → partition by user_id → worker pool → provider adapters (APNs/FCM/email). Dedup via notification_id in Redis SET NX. Retry with backoff; dead letter for permanent failures. Rate limit per provider. At 1M notifications/min, 50 workers × batch 100, horizontal scale partitions.',
    },
  ],
  tradeoffs: {
    advantages: ['Demonstrates depth', 'Shows production awareness', 'Flexible interview pacing'],
    disadvantages: ['Wrong component choice wastes time', 'Too shallow if unprepared'],
    alternatives: ['Stay HLD only if interviewer never asks — rare at senior'],
    whenToUse: ['Second half of 45-min interview', 'After capacity + HLD'],
    whenNotToUse: ['First 10 minutes — requirements first'],
  },
  failureModes: [
    'Cannot go below HLD abstractions',
    'Deep dive unrelated to problem',
    'Ignore failure modes in dive',
    'No numbers when scaling component',
    'Hand-wave "use Kafka" without partition strategy',
  ],
  production: {
    observability: ['Metrics for component under dive — lag, error rate'],
    reliability: ['Idempotency, DLQ, retries in dive narrative'],
    scalability: ['Horizontal partition key stated'],
  },
  interview: {
    expectations: ['Pick hard component', 'Algorithm + failures + scale'],
    commonQuestions: ['How does fan-out work?', 'Design shard rebalancing?'],
    followUps: ['What breaks at 10×?', 'Monitor this how?'],
    misconceptions: ['Deep dive means code on whiteboard', 'Any component equally fine — pick critical path'],
    traps: ['Generic Kafka mention without keys'],
    strongSignals: ['Celebrity hybrid solution', 'Idempotent consumer', 'Quantified worker count'],
  },
  keyTakeaways: [
    'After HLD, deep dive one critical component proactively.',
    'Cover algorithm, data structures, failures, scale numbers.',
    'Pick hardest/most interesting path — feed, payment, search.',
    '5–10 min bounded — not entire interview.',
    'Link dive to earlier requirements and capacity.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'When to offer deep dive?', answerHint: 'After HLD diagram — ask interviewer or propose hardest component.' },
    { level: 'intermediate', question: 'Deep dive consistent hashing?', answerHint: 'Virtual nodes on ring, minimal key movement on add/remove node, O(log n) lookup.' },
    { level: 'advanced', question: 'Deep dive idempotent payment consumer?', answerHint: 'Idempotency key store, exactly-once effect via DB unique constraint, outbox pattern, DLQ poison messages.' },
  ],
  flashcards: [
    { front: 'Deep dive purpose', back: 'Prove implementation-level understanding of critical component' },
    { front: 'Good deep dive pick', back: 'Hardest bottleneck — fan-out, sharding, consistency hot path' },
    { front: 'Deep dive structure', back: 'Algorithm → failures → scale to stated QPS' },
    { front: 'Proactive offer', back: 'I can dive into X or Y — guides interviewer' },
  ],
  quickRevision: [
    'After HLD',
    'Pick hard part',
    'Algo + failures',
    'Scale numbers',
    '5–10 min',
  ],
}
