import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Throughput measures work completed per unit time: HTTP requests per second (RPS), messages consumed per second, orders processed per minute. Capacity planning compares peak throughput to system limits; saturation occurs when throughput plateaus while latency rises.',
  whyExists:
    'Latency alone insufficient — system handles 100 RPS at 50ms but collapses at 500 RPS. Throughput defines scale headroom, load test targets, and autoscaling triggers (ALBRequestCountPerTarget).',
  mentalModel:
    'Highway cars per hour. More cars until jam — throughput maxes, latency explodes. Measure sustainable throughput before queue backup.',
  howItWorks: [
    {
      type: 'list',
      items: [
        'RPS = rate(http_requests_total[1m]) in Prometheus.',
        'Little Law: concurrency = throughput × average latency.',
        'Load test ramp RPS until p99 SLO breaks — find knee capacity.',
        'Autoscale on request count per target not just CPU.',
        'Batch throughput: records/sec ingested, separate from online RPS.',
      ],
    },
    {
      type: 'mermaid',
      caption: 'Throughput vs latency under load',
      diagram: `flowchart LR
  Low[Low load — high throughput low latency]
  Knee[Knee — max sustainable RPS]
  Sat[Saturation — RPS flat latency up]`,
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Load test ramps 100→2000 RPS. Throughput linear to 1200 RPS then flat; p99 jumps 80ms→2s at knee. ASG target tracking set to 800 RPS per instance — headroom before saturation.',
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Bottleneck shifts: CPU → thread pool → DB connections → disk IO.',
        'Coordinated load test from multiple workers avoids single client limit.',
        'Warm JVM before measuring Java throughput — CJIT effects.',
        'Queueing theory: utilization near 100% latency grows unbounded.',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Capacity planning', 'Scaling signals', 'Load test acceptance criteria'],
    disadvantages: ['Peak RPS varies by payload size', 'Aggregate hides hot endpoints', 'Synthetic != real traffic mix'],
    alternatives: ['Concurrent users metric — needs think time conversion'],
    whenToUse: ['Load testing', 'Autoscaling policies', 'Capacity reviews'],
    whenNotToUse: ['Single user debug — use trace latency'],
  },
  failureModes: [
    'Celebrate RPS without latency SLO — degraded service',
    'Load test wrong endpoint mix',
    'Single client CPU limits measured throughput',
    'Ignore cold start in serverless throughput',
    'Autoscale lag — throughput demand exceeds capacity briefly',
  ],
  production: {
    scalability: ['ASG on ALBRequestCountPerTarget', 'Load test before peak events'],
    observability: ['RPS dashboard by route', 'Knee capacity documented'],
    performance: ['Find bottleneck before Black Friday', 'Connection pool sized for peak RPS'],
  },
  interview: {
    expectations: ['RPS definition', 'Throughput vs latency tradeoff', 'Little Law intuition'],
    commonQuestions: ['How find max throughput?', 'Autoscale metric choice?'],
    followUps: ['Knee of curve?', 'Little Law application?'],
    misconceptions: ['Max RPS always goal regardless of latency', 'CPU 100% only saturation signal'],
    traps: ['Load test only happy path tiny payload'],
    strongSignals: ['Knee capacity', 'Request count scaling', 'Latency SLO at target RPS'],
  },
  keyTakeaways: [
    'Throughput = work per time (RPS, msgs/sec).',
    'Sustainable throughput is before latency knee.',
    'Little Law links concurrency, throughput, latency.',
    'Scale on request rate per instance for web tiers.',
    'Load test ramp finds capacity limit.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Throughput vs latency?', answerHint: 'Throughput: how much work/sec; latency: time per unit — both needed; saturation raises latency.' },
    { level: 'intermediate', question: 'Little Law?', answerHint: 'L = λ × W — concurrency = arrival rate × average time in system.' },
    { level: 'advanced', question: 'Autoscale on CPU vs RPS?', answerHint: 'RPS per target better for I/O web; CPU for compute-bound; combine signals.' },
  ],
  flashcards: [
    { front: 'RPS', back: 'Requests per second — HTTP throughput metric' },
    { front: 'Knee of curve', back: 'Load point where throughput stops growing and latency spikes' },
    { front: 'Little Law', back: 'Concurrency = throughput × average latency' },
  ],
  quickRevision: [
    'RPS throughput',
    'Knee capacity',
    'Little Law',
    'Scale on RPS',
    'Load test ramp',
  ],
}
