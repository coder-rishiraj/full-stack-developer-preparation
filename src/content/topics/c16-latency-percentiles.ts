import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Latency percentiles (p50, p90, p95, p99) describe request duration distribution better than average. p99 = 99% of requests faster than this value. Tail latency (high percentiles) drives user perception and SLOs for interactive APIs.',
  whyExists:
    'Average 50ms hides p99 3s — 1 in 100 users miserable. GC pauses, slow DB queries, and queueing inflate tails. Percentiles from histograms guide optimization where it matters and set realistic SLO targets.',
  mentalModel:
    'Line at amusement park. p50 is typical wait; p99 is unlucky storm day wait. Optimize the long line (tail), not average when most already fast.',
  howItWorks: [
    {
      type: 'list',
      items: [
        'Histogram buckets: le=0.1, 0.5, 1, 2, 5 seconds — compute quantile.',
        'Micrometer Timer publishes percentiles or histogram for Prometheus.',
        'SLO example: p99 latency < 300ms for checkout.',
        'Compare canary p99 vs stable during deploy.',
        'Apdex score maps latency to satisfaction threshold.',
      ],
    },
    {
      type: 'table',
      headers: ['Percentile', 'Meaning'],
      rows: [
        ['p50 (median)', 'Typical user experience'],
        ['p95', 'Most users except slow tail'],
        ['p99', 'Worst 1% — dependency and GC issues show here'],
        ['p999', 'Extreme tail — often ignored unless strict SLO'],
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Search API avg 40ms looks healthy. p99 2.1s reveals cold cache misses and one slow shard. Add warming and p99 drops to 180ms while avg stays 42ms — average would not show improvement need.',
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Prometheus histogram_quantile() from cumulative buckets — approximate.',
        'T-Digest or HdrHistogram for accurate streaming percentiles.',
        'Coordinated omission: missed timeouts skew latency down — record timeout as max bucket.',
        'Merge histograms across pods for global percentile.',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Captures tail pain', 'SLO alignment', 'Compare deploy canaries'],
    disadvantages: ['Approximation error with coarse buckets', 'More expensive than avg', 'Misleading if sampling biased'],
    alternatives: ['Average — misleading', 'Max — too noisy'],
    whenToUse: ['User-facing latency SLOs', 'Performance regression detection'],
    whenNotToUse: ['Batch job runtime — use duration gauge per job'],
  },
  failureModes: [
    'Alert on average only — miss tail regression',
    'Too few histogram buckets — bad p99 estimate',
    'Timeout not recorded — p99 artificially low',
    'Single pod percentile — need aggregate',
    'Compare percentiles across different traffic mix unfairly',
  ],
  production: {
    observability: ['p50/p99 dashboard per route', 'SLO on p99 not mean'],
    performance: ['Optimize tail: timeouts, circuit breakers, cache warming'],
    reliability: ['Alert p99 regression after deploy'],
  },
  interview: {
    expectations: ['p99 meaning', 'Avg vs p99', 'Histogram role'],
    commonQuestions: ['Why p99 not average?', 'Set latency SLO?'],
    followUps: ['Coordinated omission?', 'Histogram_quantile accuracy?'],
    misconceptions: ['p99 = max/100', 'Average enough for SLO'],
    traps: ['Optimize avg when p99 is SLO'],
    strongSignals: ['Tail latency story', 'Histogram buckets', 'Canary p99 compare'],
  },
  keyTakeaways: [
    'p99: 99% requests faster — tail latency metric.',
    'Average hides slow outliers — use percentiles for SLOs.',
    'Histograms enable percentile from time-series metrics.',
    'Record timeouts as high latency not drop from sample.',
    'Optimize and alert on p95/p99 for user-facing paths.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'What is p99 latency?', answerHint: '99% of requests complete faster; 1% slower — tail metric.' },
    { level: 'intermediate', question: 'Average 100ms, p99 5s — problem?', answerHint: 'Yes — small fraction very slow; avg misleading; fix tail.' },
    { level: 'advanced', question: 'Coordinated omission in latency?', answerHint: 'Client stops measuring when timeout — missed slow requests bias percentile down.' },
  ],
  flashcards: [
    { front: 'p99', back: '99th percentile — 1% of requests slower' },
    { front: 'Tail latency', back: 'High percentiles p95/p99 — worst user experiences' },
    { front: 'histogram_quantile', back: 'Prometheus function estimating percentile from buckets' },
  ],
  quickRevision: [
    'p99 tail matters',
    'Avg misleading',
    'Histogram buckets',
    'SLO on p99',
    'Record timeouts',
  ],
}
