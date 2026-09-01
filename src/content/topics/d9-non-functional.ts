import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Non-functional requirements (NFRs) in system design interviews specify quality attributes — latency (p99), throughput (QPS), availability (99.9%), durability, consistency, scalability growth, security, cost — that constrain how functional features are built.',
  whyExists:
    'Building Twitter functional features on a Pastebin scale wastes time; building Pastebin with five-nines day one wastes too. NFRs set the bar for caching, replication, and async choices. Interviewers expect you to elicit or propose NFRs explicitly.',
  mentalModel:
    'SLA for the homework assignment. Not "make a chat app" but "chat with p99 < 200ms, 10M concurrent, 99.9% uptime, E2E encrypted." NFRs turn generic designs into sized architectures.',
  howItWorks: [
    {
      type: 'table',
      headers: ['NFR type', 'Example target', 'Design impact'],
      rows: [
        ['Latency', 'p99 read < 100ms', 'CDN cache Redis'],
        ['Throughput', '50k read RPS peak', 'Replicas horizontal scale'],
        ['Availability', '99.9% monthly', 'Multi-AZ failover'],
        ['Durability', '11 nines objects', 'S3 replication'],
        ['Consistency', 'Strong checkout', 'Primary DB transaction'],
        ['Security', 'Auth E2E TLS', 'OAuth rate limit'],
        ['Growth', '10× in 2 years', 'Sharding plan'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'NFR drives architecture',
      diagram: `flowchart LR
  NFR[99.9% availability] --> MultiAZ[Multi-AZ + replicas]
  Latency[p99 100ms] --> Cache[CDN + Redis]
  Scale[50k RPS] --> Shard[Horizontal scale]`,
    },
    {
      type: 'list',
      items: [
        'Ask interviewer if not stated: scale, latency, availability',
        'Propose reasonable defaults and confirm',
        '3–5 NFR bullets sufficient',
        'Tie each NFR to concrete design choice later',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Ticket booking NFRs: peak 10k booking RPS; p99 search < 500ms browse < 200ms; no double-book (strong consistency on inventory); 99.95% availability during on-sale; PCI for payments. Drives: inventory shard with locks, Redis cache for browse, queue for waitlist, multi-AZ Postgres.',
    },
  ],
  tradeoffs: {
    advantages: ['Sizes design correctly', 'Shows senior product thinking', 'Explains tradeoffs later'],
    disadvantages: ['Conflicting NFRs need explicit tradeoff', 'Over-specifying wastes time'],
    alternatives: ['Assume unlimited scale — unrealistic'],
    whenToUse: ['Immediately after functional requirements'],
    whenNotToUse: ['Never conflate with functional bullets'],
  },
  failureModes: [
    'No latency/scale asked — wrong architecture',
    'Five-nines for hobby scope',
    'Strong consistency everywhere — over-build',
    'Security omitted on user data design',
    'NFRs never referenced in HLD justification',
  ],
  production: {
    reliability: ['NFRs become SLOs in production'],
    performance: ['Latency budgets per hop'],
    security: ['Compliance NFRs drive encryption audit'],
    cost: ['NFR tiering — not all features need same bar'],
  },
  interview: {
    expectations: ['Elicit scale latency availability', '3–5 NFRs stated', 'Link to design'],
    commonQuestions: ['What NFRs would you ask?', 'Trade latency vs consistency?'],
    followUps: ['99.99% cost implication?', 'Relaxed NFR for MVP?'],
    misconceptions: ['NFR = functional "must support search"'],
    traps: ['No availability target for payment system'],
    strongSignals: ['Proposed defaults confirmed', 'NFR mapped to cache/multi-AZ', 'Tiered NFR by feature'],
  },
  keyTakeaways: [
    'NFRs = how well — latency, scale, availability, security.',
    'Ask or propose; confirm with interviewer.',
    'Each major NFR should justify a design element.',
    'Conflicting NFRs → explicit tradeoff section.',
    'Do not mix with functional feature list.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Example non-functional requirements?', answerHint: 'p99 latency 200ms, 10k RPS, 99.9% availability, data encrypted at rest.' },
    { level: 'intermediate', question: 'NFRs for global video streaming?', answerHint: 'High bandwidth, CDN latency, durability 11 nines storage, eventual metadata OK, DRM security.' },
    { level: 'advanced', question: 'Conflicting: strong consistency + global p99 50ms?', answerHint: 'Impossible broadly — regional strong, async cross-region, CRDT for some data, or scope consistency per feature.' },
  ],
  flashcards: [
    { front: 'Non-functional requirement', back: 'Quality attribute — performance availability security scale' },
    { front: 'p99 latency', back: '99% of requests faster than threshold — tail focus' },
    { front: 'Availability 99.9%', back: '~43 min downtime/month budget' },
    { front: 'NFR interview habit', back: 'Ask scale latency availability if not given' },
  ],
  quickRevision: [
    'How well not what',
    'Latency scale uptime',
    'Ask or propose',
    'Map to design',
    'Tier by feature',
  ],
}
