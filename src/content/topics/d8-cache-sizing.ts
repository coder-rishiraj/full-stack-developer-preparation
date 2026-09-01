import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Cache-size estimation determines how much memory (Redis, in-process, CDN) is needed to achieve target hit ratio — based on working set size, object footprint, TTL, and eviction policy. Goal: fit hot data in cache without wasting RAM or suffering chronic misses.',
  whyExists:
    'Too small cache → low hit ratio, DB overload. Too large → expensive RAM with diminishing returns. Estimation links access patterns (Zipf/power law) to concrete GB and node counts before provisioning.',
  mentalModel:
    'Bookshelf for frequently read books. Working set = books read daily. If shelf fits top 20% of titles covering 80% of reads (Pareto), hit ratio ~80%. Size shelf to cover target percentile of key space or traffic.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Input', 'How to estimate', 'Output'],
      rows: [
        ['Working set keys', 'Unique keys accessed in TTL window', 'Key count for target hit ratio'],
        ['Avg value size', 'Sample serialized object + overhead', 'Bytes per entry'],
        ['Total cache RAM', 'keys × (value + key overhead ~100B)', 'GB per shard'],
        ['Hit ratio target', 'Often 90–99% for hot paths', 'Iterate size vs simulated trace'],
        ['Eviction policy', 'LRU approximates hot set', 'TTL bounds staleness'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'Working set vs cache size',
      diagram: `flowchart LR
  AllKeys[Total key space 100M] --> Hot[Hot 1M keys 80% traffic]
  Hot --> Cache[Cache sized for 1M]
  Cache -->|HIT 80%| DB[(DB 20% load)]`,
    },
    {
      type: 'list',
      items: [
        'Power law: top 1% keys may serve 50%+ reads — size for hot tail',
        'Add Redis overhead ~1.5–2× raw payload for metadata',
        'Shard when single node RAM exceeded — consistent hash',
        'Simulate with production access logs if available',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Product cache: 10M SKUs, 80% reads on top 500k SKUs (weekly). Avg JSON 2 KB + 100 B key overhead ≈ 2.1 KB. Working set RAM = 500k × 2.1 KB ≈ 1.05 GB. Target 95% hit → size 1.5 GB Redis with LRU + 5m TTL; 3 shards for HA not size.',
    },
  ],
  tradeoffs: {
    advantages: ['Right-size spend', 'Predict DB load from miss rate', 'Interview credibility'],
    disadvantages: ['Access patterns shift — seasonal skew', 'Overhead underestimated', 'Long-tail cold keys still miss'],
    alternatives: ['Start small and scale cache from metrics'],
    whenToUse: ['Redis/CDN sizing', 'System design capacity section'],
    whenNotToUse: ['Tiny app where full dataset fits trivially'],
  },
  failureModes: [
    'Sized for key count not bytes — large values OOM',
    'Ignored replication factor (3 replicas × RAM)',
    'TTL shorter than access window — chronic miss',
    'Hot key on one shard — uneven memory useless',
    'CDN cache sized without hit ratio measurement',
  ],
  production: {
    performance: ['Monitor hit ratio and evicted keys rate', 'Singleflight on miss stampede'],
    scalability: ['Horizontal shard by key hash', 'Hot key replication'],
    cost: ['RAM expensive — balance hit ratio vs DB cost'],
    observability: ['Cache memory usage, hit/miss, evictions', 'Top missed keys'],
    reliability: ['Memory maxmemory-policy allkeys-lru documented'],
  },
  interview: {
    expectations: ['Working set concept', 'keys × size math', 'Pareto/hot set'],
    commonQuestions: ['Size Redis for 100M users session cache?', 'Hit ratio vs cache size curve?'],
    followUps: ['Hot key problem?', 'CDN cache sizing different?'],
    misconceptions: ['Cache entire dataset always', 'Hit ratio linear with size'],
    traps: ['Forget overhead and replication'],
    strongSignals: ['Zipf working set', 'Simulate from logs', 'Miss rate → DB load link'],
  },
  keyTakeaways: [
    'Cache RAM ≈ hot working set keys × avg value size + overhead.',
    'Traffic often Pareto — size for hot keys not full keyspace.',
    'Hit ratio vs size has diminishing returns — pick target (e.g. 95%).',
    'Account Redis metadata and replication multiplier.',
    'Validate with hit ratio metrics after launch.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Cache size formula sketch?', answerHint: 'Working set key count × average object bytes + key overhead.' },
    { level: 'intermediate', question: '100M keys but only 1M hot per day — size how?', answerHint: 'Cache ~1M hot keys covering 80–90% reads; LRU evicts cold; monitor miss rate.' },
    { level: 'advanced', question: 'Hit ratio stuck at 70% after doubling cache?', answerHint: 'Working set larger than TTL window; access pattern long-tail; wrong keys cached; hot key shard imbalance.' },
  ],
  flashcards: [
    { front: 'Working set', back: 'Keys actively accessed within cache TTL window' },
    { front: 'Cache sizing formula', back: 'hot_keys × (value_size + overhead)' },
    { front: 'Pareto in caching', back: 'Small fraction of keys serve majority of reads' },
    { front: 'Eviction LRU', back: 'Drop least recently used when memory full' },
  ],
  quickRevision: [
    'Hot key set',
    'keys × bytes',
    'Overhead 1.5×',
    'Target hit ratio',
    'Shard if huge',
  ],
}
