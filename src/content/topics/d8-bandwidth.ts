import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Bandwidth estimation calculates network data transfer volume — ingress, egress, and cross-AZ/region replication — to size links, CDN contracts, and cloud egress budgets. Typically measured in bytes per second converted to Gbps or TB/month.',
  whyExists:
    'Underestimating bandwidth causes throttling, surprise cloud bills, and poor user experience on media-heavy apps. Overestimating wastes spend on unused capacity. Back-of-envelope math during design prevents both.',
  mentalModel:
    'Water pipe flow rate. Each request carries payload in and out. Multiply requests per second × average response size × fan-out (replication, CDN miss). Peak bandwidth often exceeds average by 3–10× during viral events.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Step', 'Formula', 'Notes'],
      rows: [
        ['Outbound per request', 'response_bytes × RPS', 'Include JSON, images, headers'],
        ['Inbound per request', 'request_bytes × RPS', 'Uploads dominate for Drive/YouTube'],
        ['Peak multiplier', 'avg × 3–10', 'Flash sales, TV events'],
        ['Replication overhead', 'write_bytes × (replicas − 1)', 'Cross-AZ/region DB sync'],
        ['CDN offload', 'origin_egress × (1 − hit_ratio)', '95% hit → 5% origin'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'Bandwidth paths',
      diagram: `flowchart LR
  User -->|download| CDN[CDN edge]
  CDN -->|MISS 5%| Origin[Origin egress]
  Origin -->|replication| Replica[Cross-AZ copy]
  User -->|upload| Origin`,
    },
    {
      type: 'list',
      items: [
        'Convert: 1 GB/s ≈ 8 Gbps; 1 TB/month ≈ 3.17 Mbps average',
        'Separate static (CDN-cached) from dynamic API bandwidth',
        'Video: bitrate × concurrent streams dominates',
        'Add 20–30% headroom for protocol overhead and growth',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'News API: 50k RPS peak, 20 KB average JSON response → 50,000 × 20 KB = 1 GB/s outbound ≈ 8 Gbps. CDN 90% hit ratio → origin sees 0.8 Gbps. Cross-region replication of writes adds separate 200 MB/s. Budget 10 Gbps origin + CDN contract for 100 Gbps edge.',
    },
    {
      type: 'code',
      language: 'text',
      caption: 'Quick bandwidth calc',
      code: `Peak RPS = 50,000
Avg response = 20 KB
Peak egress = 50,000 × 20 KB = 1 GB/s = 8 Gbps
CDN hit 90% → origin 0.8 Gbps
Monthly origin ≈ 0.8 × 86400 × 30 / 1024 TB (if sustained — use peak hours)`,
    },
  ],
  tradeoffs: {
    advantages: ['Predictable infra spend', 'Right-size CDN and links', 'Identify compression wins'],
    disadvantages: ['Peak hard to forecast', 'Payload size varies widely', 'Egress pricing complex across clouds'],
    alternatives: ['Measure in prod first — late for greenfield interviews'],
    whenToUse: ['Media, API-heavy, replication-heavy designs', 'System design interviews'],
    whenNotToUse: ['Tiny internal CRUD with negligible traffic'],
  },
  failureModes: [
    'Forgot image/video payload — underestimated by 100×',
    'Ignored cross-AZ replication on every write',
    'Peak RPS without peak response size (search vs health)',
    'CDN miss storm during cache cold start',
    'Egress to internet vs internal conflated',
  ],
  production: {
    performance: ['Compression gzip/brotli on text', 'CDN for static and cacheable API'],
    scalability: ['Edge termination reduces origin bandwidth'],
    cost: ['Egress often largest cloud bill line — CDN hit ratio target'],
    observability: ['Bandwidth metrics by service and PoP', 'Top heavy endpoints'],
    reliability: ['Rate limit and shed before bandwidth-saturated NIC'],
  },
  interview: {
    expectations: ['RPS × payload math', 'CDN reduces origin egress', 'Peak vs average'],
    commonQuestions: ['Estimate bandwidth for Twitter feed?', 'YouTube streaming bandwidth?'],
    followUps: ['Cross-region replication cost?', 'Compression impact?'],
    misconceptions: ['RPS alone determines bandwidth without payload size'],
    traps: ['Skip upload path for file storage design'],
    strongSignals: ['Separate CDN vs origin', 'Peak multiplier', 'Replication overhead'],
  },
  keyTakeaways: [
    'Bandwidth = RPS × bytes per request (in + out).',
    'Peak often 3–10× average — plan for spikes.',
    'CDN hit ratio dramatically cuts origin egress.',
    'Replication and cross-AZ traffic add hidden bandwidth.',
    'Video: concurrent streams × bitrate dominates.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Estimate egress for 10k RPS, 5 KB response?', answerHint: '10,000 × 5 KB = 50 MB/s ≈ 400 Mbps.' },
    { level: 'intermediate', question: 'CDN 95% hit — origin bandwidth?', answerHint: '5% of total user-facing egress hits origin plus upload/admin paths.' },
    { level: 'advanced', question: 'Live video 1M viewers 2 Mbps stream?', answerHint: '1M × 2 Mbps = 2 Tbps aggregate edge; origin one-to-many via CDN multicast/tree.' },
  ],
  flashcards: [
    { front: 'Egress bandwidth formula', back: 'RPS × average response bytes' },
    { front: 'CDN origin reduction', back: 'Origin egress ≈ total × (1 − hit_ratio)' },
    { front: '1 GB/s in Gbps', back: 'Approximately 8 Gbps' },
    { front: 'Peak multiplier', back: 'Often 3–10× average for viral events' },
  ],
  quickRevision: [
    'RPS × bytes',
    'Peak multiplier',
    'CDN hit ratio',
    'Replication overhead',
    'Compress text',
  ],
}
