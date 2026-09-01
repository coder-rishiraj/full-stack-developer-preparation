import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Trade-off analysis in system design interviews explicitly compares architectural alternatives — SQL vs NoSQL, push vs pull feed, strong vs eventual consistency, cache vs fresh, cost vs latency, complexity vs time-to-market — with decision rationale tied to stated requirements.',
  whyExists:
    'Senior engineers do not present one perfect diagram — they show judgment. Interviewers reward "I chose X over Y because at our read ratio and latency NFR, X wins; if writes 10× we revisit." Tradeoffs section separates staff-level thinking from checklist architecture.',
  mentalModel:
    'Decision ledger with pros, cons, and when to flip. Every major box on your diagram should have a rejected alternative and a reason. Requirements change the winner — no universal best database.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Decision point', 'Option A', 'Option B', 'Choose when'],
      rows: [
        ['Primary store', 'Postgres', 'DynamoDB', 'Complex joins vs massive scale KV'],
        ['Feed model', 'Push fan-out', 'Pull on read', 'Normal users vs celebrities'],
        ['Consistency', 'Strong primary', 'Eventual replicas', 'Money vs social counts'],
        ['Sync path', 'REST sync', 'Queue async', 'User waits vs fire-and-forget'],
        ['Cache', 'Redis cluster', 'CDN only', 'Dynamic vs static heavy'],
        ['Multi-region', 'Active-active', 'Single region DR', 'Global latency vs complexity'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'Trade-off decision flow',
      diagram: `flowchart TB
  Req[Requirements + NFRs] --> Options[List 2–3 options]
  Options --> Compare[Pros cons per option]
  Compare --> Pick[Pick with explicit reason]
  Pick --> Revisit[When requirements change revisit]`,
    },
    {
      type: 'list',
      items: [
        '2–3 major tradeoffs sufficient — not every minor choice',
        'Format: "Chose A over B because … under assumption …"',
        'Acknowledge cost and operational burden',
        'Offer evolution: start B migrate to A at scale threshold',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Pastebin: chose Postgres over S3-primary because metadata queries (list by user, expiry) need indexes; blobs still on S3. Chose cursor pagination over offset for deep user history at scale. Accepted eventual search index lag 30s vs blocking write on Elasticsearch sync — search NFR allows.',
    },
  ],
  tradeoffs: {
    advantages: ['Demonstrates senior judgment', 'Opens good interviewer dialogue'],
    disadvantages: ['Analysis paralysis if overdone'],
    alternatives: ['Single solution without comparison — weaker signal'],
    whenToUse: ['Throughout interview when choosing', 'Dedicated 3 min summary before end'],
    whenNotToUse: ['Do not tradeoff every trivial choice'],
  },
  failureModes: [
    'Fanboy one technology no alternatives',
    'Tradeoff generic without requirements link',
    'Ignore operational cost of choice',
    'Cannot defend decision under "what if 10× writes"',
    'Conflicting decisions without acknowledging',
  ],
  production: {
    maintainability: ['ADRs document tradeoffs in real teams'],
    cost: ['Explicit cost vs performance trade in decisions'],
  },
  interview: {
    expectations: ['2–3 explicit A vs B with reason', 'Tied to reqs', 'Evolution path'],
    commonQuestions: ['SQL vs NoSQL here?', 'Why Kafka not RPC?'],
    followUps: ['When would you switch?', 'Downside of your choice?'],
    misconceptions: ['One correct architecture exists', 'Tradeoffs show weakness'],
    traps: ['No alternative considered'],
    strongSignals: ['Requirements-linked rationale', 'Acknowledged downsides', 'Scale revisit threshold'],
  },
  keyTakeaways: [
    'State alternatives rejected and why for major decisions.',
    'Link tradeoffs to functional and non-functional reqs.',
    'Acknowledge downsides and ops cost of your choice.',
    'Offer evolution when scale or reqs change.',
    '2–3 deep tradeoffs beat ten shallow ones.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Why mention tradeoffs in interview?', answerHint: 'Shows judgment — no perfect design; choices depend on requirements constraints.' },
    { level: 'intermediate', question: 'Push vs pull feed tradeoff?', answerHint: 'Push fast read costly write for followers; pull cheap write slow read; hybrid for celebrities.' },
    { level: 'advanced', question: 'Chose strong consistency — when regret at scale?', answerHint: 'Global latency write bottleneck; revisit per-feature eventual CRDT regional strong.' },
  ],
  flashcards: [
    { front: 'Trade-off analysis format', back: 'Chose A over B because reqs X — downside Y acceptable' },
    { front: 'Evolution tradeoff', back: 'Start simple B migrate to A at scale threshold T' },
    { front: 'CAP in interviews', back: 'Partition scenario pick CP or AP per feature not lecture only' },
    { front: 'Operational tradeoff', back: 'Include ops complexity and cost not just performance' },
  ],
  quickRevision: [
    'A vs B + why',
    'Tie to NFR',
    'Ack downside',
    'Evolution path',
    '2–3 deep ones',
  ],
}
