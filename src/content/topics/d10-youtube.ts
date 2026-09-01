import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'YouTube stores, transcodes, and delivers video globally — upload pipeline, adaptive bitrate streaming (DASH/HLS), CDN edge cache, metadata/search, and engagement (views, likes, comments).',
  whyExists: 'Raw video files are huge and device/network heterogeneous. YouTube needs durable storage, multi-resolution transcoding, CDN delivery, and recommendation at exabyte scale.',
  mentalModel: 'Upload → blob store → transcode farm produces 144p–4K renditions → manifest (DASH) → CDN caches segments. Metadata in DB; view counts async. Search index separate from video bytes.',
  howItWorks: [
    { type: 'paragraph', text: 'Resumable upload to object storage. Transcoding queue (priority by channel size). Each rendition chunked (2–10s segments). Player requests manifest then adaptive segments based on bandwidth. Popular videos fully CDN-cached; long tail origin fetch.' },
    { type: 'mermaid', caption: 'Upload to playback', diagram: "flowchart LR\n  Up[Upload] --> S3[(Raw)]\n  S3 --> TC[Transcode]\n  TC --> Seg[Segments]\n  Seg --> CDN[CDN]\n  Play[Player] --> CDN" },
  ],
  example: [
    { type: 'code', language: 'http', code: "POST /upload/init → upload_url\nPUT  chunks to storage\nPOST /upload/complete → video_id\n\nGET /v1/videos/{id}/manifest.mpd" },
  ],
  keyTakeaways: [
    'Separate metadata DB from video blobs',
    'Transcoding async — upload != watchable immediately',
    'Adaptive bitrate via segment manifests',
    'View counts eventual (Kafka aggregate)',
    'Evolve: single server → object store + CDN + transcode farm',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Where store video bytes vs title/tags?', answerHint: 'Object storage/CDN for bytes; SQL/NoSQL for metadata.' },
    { level: 'intermediate', question: 'How adaptive streaming works?', answerHint: 'Manifest lists renditions; player switches segment quality by bandwidth.' },
    { level: 'advanced', question: 'Design view counter at 1B views/day?', answerHint: 'Increment in Redis/local aggregate; flush to DB; approximate OK.' },
  ],
  flashcards: [
    { front: 'Transcode pipeline', back: 'Raw upload → queue → multi-bitrate segments' },
    { front: 'DASH/HLS', back: 'Manifest + chunked segments for ABR' },
    { front: 'View counts', back: 'Async aggregate; eventual consistency' },
  ],
  quickRevision: [
    'Resumable upload',
    'Async transcode',
    'CDN segment cache',
    'Metadata vs blob split',
    'Search index async',
    'ABR manifest',
  ],
  systemDesign: {
    problem: 'Design YouTube: 500M hours uploaded/day equivalent scale discussion, 1B DAU, global playback p99 startup < 2s on CDN hit.',
    requirements: {
      functional: [
        'Upload video',
        'Transcode multi quality',
        'Stream playback',
        'Search and recommendations',
        'Comments and likes',
      ],
      nonFunctional: [
        'Playback startup < 2s cached',
        'Durability 11 nines for originals',
        'Upload resume on failure',
        'Copyright detection async',
      ],
    },
    scaleAssumptions: [
    '500 hours video/min upload (illustrative)',
    '80% views on top 20% videos',
    'Avg 5 Mbps playback',
    ],
    capacityEstimates: [
    'Storage exabytes — tiered hot/warm/cold',
    'Transcode CPU bound — elastic worker pool',
    'CDN egress dominates cost',
    ],
    api: [
    { type: 'code', language: 'http', code: 'GET /health → 200' },
    ],
    dataModel: [
    { type: 'list', items: [
      'Video: id, owner, title, status processing|ready, manifest_urls',
      'Segment: video_id, resolution, s3_key pattern',
      'ViewAggregate: video_id, count, window',
    ] },
    ],
    highLevelArchitecture: [
    { type: 'paragraph', text: 'Clients → CDN/LB → stateless services → data stores.' },
    ],
    diagram: {
      mermaid: "flowchart TB\n  U[Uploader] --> Ingest[Ingest API]\n  Ingest --> Raw[(Object Store)]\n  Raw --> WF[Transcode Workers]\n  WF --> Seg[(Segments)]\n  Seg --> CDN[CDN]\n  P[Player] --> CDN",
      caption: 'High-level request path',
    },
    dataFlow: [
    'Upload chunks → assemble raw → enqueue transcode',
    'Workers produce renditions + manifest',
    'Publish metadata when ready',
    'Play: manifest → segment requests from CDN',
    'View event → Kafka → counter service',
    ],
    storage: [
    'Object store for raw and segments',
    'Cassandra/Spanner for metadata at scale',
    ],
    caching: [
    'CDN edge for segments; origin shield',
    ],
    asyncProcessing: [
    'Transcoding',
    'Content ID scan',
    'Search index update',
    'Thumbnail generation',
    ],
    scaling: [
    'Horizontal stateless tier; shard data by key',
    ],
    consistency: [
    'Strong for money/auth; eventual for analytics',
    ],
    reliability: [
    'Retries with backoff; idempotent writes',
    ],
    failureScenarios: [
    'Hot keys; dependency timeout; partial outage',
    ],
    security: [
    'AuthN/Z, rate limits, input validation',
    ],
    observability: [
    'RED/USE metrics, tracing, SLO dashboards',
    ],
    bottlenecks: [
    'Transcode backlog for new uploads',
    'CDN miss on long tail',
    'Hot video single key — mitigated by CDN',
    ],
    alternatives: [
    'Managed SaaS for non-differentiating parts',
    ],
    tradeoffs: [
    'Complexity vs time-to-market',
    ],
    interviewFollowUps: [
    'Live streaming vs VOD?',
    'Copyright Content ID?',
    ],
    evolution: [
      { stage: '1. Simple design', description: 'Monolith + single DB.', bottleneck: 'Vertical scale limit.', },
      { stage: '2. Improve', description: 'Cache + read replicas.', bottleneck: 'Write bottleneck remains.', },
      { stage: '3. Improve', description: 'Async pipeline + sharding.', bottleneck: 'Ops complexity.', },
      { stage: '4. Scale further', description: 'Geo partition + dedicated services.', bottleneck: 'Consistency across regions.', },
    ],
  },
  tradeoffs: {
    advantages: [
    'CDN scales reads',
    'ABR fits networks',
    ],
    disadvantages: [
    'Transcode cost and delay',
    'View count complexity',
    ],
    alternatives: [
    'Single MP4 progressive download (no ABR)',
    ],
    whenToUse: [
    'User-generated video platforms',
    ],
    whenNotToUse: [
    'Tiny static hosting',
    ],
  },
  failureModes: [
    'Upload without transcode stuck processing',
    'CDN cache poison wrong segment',
    'View counter double count without idempotent events',
  ],
  production: {
    performance: [
      'CDN-first playback; prefetch manifest',
    ],
    scalability: [
      'Elastic transcode workers',
    ],
    reliability: [
      'Resumable uploads',
    ],
    security: [
      'Signed URLs for private video',
    ],
    observability: [
      'Transcode queue depth, CDN hit ratio',
    ],
    cost: [
      'Storage tiering; transcode only needed renditions',
    ],
  },
  interview: {
    expectations: [
      'Blob vs metadata, transcode, CDN, ABR',
    ],
    commonQuestions: [
      'Design YouTube',
    ],
    followUps: [
      'Live vs VOD?',
    ],
    misconceptions: [
      'Store video in SQL BLOB',
    ],
    traps: [
      'Synchronous transcode on upload API',
    ],
    strongSignals: [
      'Segment CDN, async transcode, Kafka views',
    ],
  },
}
