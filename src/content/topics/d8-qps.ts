import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Requests per second (QPS/RPS) is the primary throughput metric for capacity planning — counting successful and failed requests handled per second at each tier (edge, API, DB). Peak QPS drives server count, connection pools, and autoscale limits.',
  whyExists:
    'Architects need a single number to translate user scale (DAU, sessions) into infrastructure. QPS links usage patterns to CPU cores, DB IOPS, and network bandwidth. Interview designs start here: "10M DAU → how many RPS?"',
  mentalModel:
    'Checkout lane throughput. Not every shopper checks out simultaneously — peak hour concentration matters. QPS = users × requests/user/second, but peak QPS = average × peak factor (often 2–10×).',
  howItWorks: [
    {
      type: 'table',
      headers: ['Step', 'Formula', 'Typical assumption'],
      rows: [
        ['DAU to daily requests', 'DAU × requests/user/day', '20 page views/user'],
        ['Average QPS', 'daily_requests / 86400', 'Spread evenly (wrong for peak)'],
        ['Peak QPS', 'avg_QPS × peak_factor', 'Peak factor 3–5× for consumer'],
        ['Write QPS', 'peak_QPS × write_ratio', '1:10 write:read common'],
        ['Server count', 'peak_QPS / RPS_per_core', '500–2000 RPS/core varies'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'QPS funnel by tier',
      diagram: `flowchart TB
  Users[10M DAU] --> Peak[Peak 50k RPS edge]
  Peak --> API[API tier 50k]
  API --> Cache[Cache absorbs 80%]
  Cache --> DB[DB 10k read RPS]`,
    },
    {
      type: 'list',
      items: [
        'Separate read vs write QPS — writes often bottleneck first',
        'Batch/cron adds background QPS not in user-facing average',
        'Internal microservice QPS > external — fan-out multiplier',
        'State  assumptions explicitly in interviews',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'URL shortener: 100M links/month created → ~40 writes/s average. 10:1 read:write → 400 reads/s average. Peak 5× → 2k write RPS, 20k read RPS. Cache 90% read hit → DB ~2k read RPS. Redis handles most reads; 4 API servers at 5k RPS each with headroom.',
    },
    {
      type: 'code',
      language: 'text',
      caption: 'QPS back-of-envelope',
      code: `DAU = 10,000,000
Requests/user/day = 30
Daily = 300,000,000
Avg QPS = 300M / 86400 ≈ 3,500
Peak factor 5× → ~17,500 RPS peak
Write ratio 10% → ~1,750 write RPS peak`,
    },
  ],
  tradeoffs: {
    advantages: ['Simple scalable math', 'Compare tiers consistently', 'Interview structure'],
    disadvantages: ['Peak factor guesswork', 'Endpoint cost varies 1000×', 'Geographic uneven load'],
    alternatives: ['Events/sec for streaming', 'Transactions/sec for DB'],
    whenToUse: ['Every system design capacity section', 'Autoscale policy design'],
    whenNotToUse: ['Batch-only nightly jobs — use jobs/hour instead'],
  },
  failureModes: [
    'Used average QPS for capacity — peak outage',
    'Ignored fan-out: 1 API call → 5 internal calls',
    'Same QPS budget for search and ping endpoints',
    'Forgot cron/backfill spike',
    'Read QPS to DB without cache hit ratio',
  ],
  production: {
    scalability: ['Autoscale on RPS/CPU with max cap protecting DB'],
    performance: ['Cache to reduce effective DB QPS'],
    observability: ['RPS dashboards per endpoint', 'Peak vs avg tracking'],
    reliability: ['Load test to validated peak QPS', 'Rate limit below theoretical max'],
    cost: ['Right-size instances to peak + headroom not 10× over'],
  },
  interview: {
    expectations: ['DAU → QPS derivation', 'Peak factor', 'Read/write split'],
    commonQuestions: ['QPS for Instagram scale?', 'How many servers for 10k RPS?'],
    followUps: ['Fan-out multiplier?', 'Cache impact on DB QPS?'],
    misconceptions: ['DAU equals concurrent QPS without math'],
    traps: ['No peak factor applied'],
    strongSignals: ['State assumptions', 'Separate read/write', 'Cache adjusted DB load'],
  },
  keyTakeaways: [
    'Avg QPS = daily requests / 86400; peak QPS = avg × peak factor.',
    'Derive daily requests from DAU × actions per user.',
    'Split read vs write QPS — different scaling paths.',
    'Cache hit ratio reduces DB QPS dramatically.',
    'State assumptions clearly in interviews.',
  ],
  interviewQuestions: [
    { level: 'basic', question: '10M requests/day average QPS?', answerHint: '10M / 86400 ≈ 116 RPS average.' },
    { level: 'intermediate', question: 'Peak factor purpose?', answerHint: 'Real traffic spikes above daily average — multiply avg QPS by 3–10× for capacity.' },
    { level: 'advanced', question: '1 external RPS fans to 5 internal — plan how?', answerHint: 'Internal capacity 5×; mesh limits; bulkhead per dependency; cache at fan-out root.' },
  ],
  flashcards: [
    { front: 'Average QPS', back: 'Total daily requests divided by 86400 seconds' },
    { front: 'Peak factor', back: 'Multiplier on avg QPS for spike capacity — often 3–10×' },
    { front: 'Read/write QPS split', back: 'Separate ratios — writes usually harder to scale' },
    { front: 'Cache effect on DB QPS', back: 'DB QPS ≈ read QPS × (1 − hit_ratio)' },
  ],
  quickRevision: [
    'DAU × actions/day',
    'Divide 86400',
    'Peak 3–10×',
    'Read vs write',
    'Cache cuts DB QPS',
  ],
}
