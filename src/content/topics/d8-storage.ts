import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Storage estimation calculates total bytes needed for objects, files, media, and metadata over time — photos × size, video minutes × bitrate, row storage, replication factor, and backup copies. Output: TB/PB plan for object stores, block volumes, and archival tiers.',
  whyExists:
    'Storage is often the largest long-term cost after egress. Underestimating photo/video footprint bankrupts budgets; overestimating wastes spend. Structured estimation from user behavior and object sizes is essential for Drive, YouTube, and logging systems.',
  mentalModel:
    'Warehouse pallet math. Each user brings boxes (photos, docs) of known average weight (MB). Multiply users × boxes/user × size, stack replication and backup pallets, plan when to open a second warehouse (shard/region).',
  howItWorks: [
    {
      type: 'table',
      headers: ['Data type', 'Size assumption', 'Growth driver'],
      rows: [
        ['Text/metadata', '1–10 KB', 'Row count × fields'],
        ['Photo', '2–5 MB compressed', 'Uploads/user/year'],
        ['Video', 'bitrate × duration', 'Minutes uploaded × MB/min'],
        ['Log/event', '0.5–2 KB/line', 'QPS × retention days'],
        ['Replication', '× replica count', '3 copies = 3× raw'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'Storage tiers',
      diagram: `flowchart TB
  Hot[Hot SSD recent data] --> Warm[Warm object storage]
  Warm --> Cold[Glacier archive]
  Hot --> Backup[Backup copies 2×]`,
    },
    {
      type: 'list',
      items: [
        'Total = users × objects/user × avg_bytes × replication × (1 + backup overhead)',
        'Video dominates: 1080p ~3–6 Mbps → ~225 MB/min',
        'Compression and dedup reduce effective storage',
        'Retention policy: delete or tier down after N days',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Photo app: 50M users, 20% upload 500 photos/year avg 3 MB → 50M × 0.2 × 500 × 3 MB = 15 EB? No — active uploaders only: 10M × 500 × 3 MB = 15 PB/year new. 3× replication → 45 PB/year gross; dedup/thumbnails add 20%. Tier photos >2 years to cold storage.',
    },
    {
      type: 'code',
      language: 'text',
      caption: 'Storage calc template',
      code: `Active users = 10,000,000
Objects/user/year = 100
Avg size = 2 MB
Annual new = 10M × 100 × 2 MB = 2 PB
Replication 3× = 6 PB
5-year without delete = compound or ×5 if linear`,
    },
  ],
  tradeoffs: {
    advantages: ['Budget and shard planning', 'Tiered storage design', 'Interview completeness'],
    disadvantages: ['Heavy tail users skew average', 'Compression ratio uncertain'],
    alternatives: ['Pay-as-you-go until metrics exist'],
    whenToUse: ['Drive, YouTube, logging, backup systems'],
    whenNotToUse: ['Tiny static config store'],
  },
  failureModes: [
    'Used average photo size ignoring 4K outliers',
    'No replication factor in total',
    'Forgot thumbnail/preview derivative storage',
    'Infinite retention without archival tier',
    'Backup copies not counted',
  ],
  production: {
    cost: ['Lifecycle policies to S3 IA/Glacier', 'Deduplication for enterprise drive'],
    scalability: ['Shard object keys by user hash prefix', 'Erasure coding vs 3× replication'],
    reliability: ['Cross-region replication for durability SLA'],
    observability: ['Storage growth rate alerts', 'Per-tenant quota'],
    maintainability: ['Automated lifecycle transitions'],
  },
  interview: {
    expectations: ['users × objects × size', 'Video bitrate math', 'Replication multiplier'],
    commonQuestions: ['Storage for Google Drive scale?', 'YouTube 5-year estimate?'],
    followUps: ['Hot vs cold tier?', 'Dedup savings?'],
    misconceptions: ['Metadata negligible for media systems — ops matter but bytes dominate'],
    traps: ['Apply all DAU not active uploaders only'],
    strongSignals: ['Tiered lifecycle', 'Replication 3×', 'Retention policy stated'],
  },
  keyTakeaways: [
    'Storage = users × objects × avg_size × time × replication.',
    'Video and images dominate — use bitrate/duration math.',
    'Add replication (3×) and backup overhead explicitly.',
    'Tier hot/warm/cold for cost after retention window.',
    'State active user fraction vs total DAU.',
  ],
  interviewQuestions: [
    { level: 'basic', question: '1M users 10 photos 2 MB each — total?', answerHint: '1M × 10 × 2 MB = 20 TB raw before replication.' },
    { level: 'intermediate', question: '1 hour 1080p video storage at 4 Mbps?', answerHint: '4 Mbps × 3600 s = 1.8 GB approximately.' },
    { level: 'advanced', question: 'Design storage tiers for 7-year log retention?', answerHint: 'Hot 30d SSD, warm 1y object IA, cold 7y Glacier; compress; partition by date; delete or legal hold exceptions.' },
  ],
  flashcards: [
    { front: 'Storage estimation formula', back: 'users × objects/user × bytes × replication' },
    { front: 'Video size estimate', back: 'bitrate × duration in seconds / 8' },
    { front: 'Replication factor', back: 'Often 3× for cloud durability' },
    { front: 'Lifecycle tiering', back: 'Move old data to cheaper cold storage automatically' },
  ],
  quickRevision: [
    'users × objects × MB',
    'Video bitrate×time',
    '×3 replication',
    'Tier cold archive',
    'Active user fraction',
  ],
}
