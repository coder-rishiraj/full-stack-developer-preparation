import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Object (blob) storage stores unstructured binary objects (images, videos, backups, logs) as keys in flat namespaces with metadata — optimized for durability, scale, and cost per GB, not low-latency random updates. Examples: AWS S3, GCS, Azure Blob, MinIO.',
  whyExists:
    'File systems and databases are poor at storing petabytes of media with 11-nines durability cheaply. Object storage offers HTTP REST API, versioning, lifecycle policies, and erasure coding across AZs/regions.',
  mentalModel:
    'Infinite hashmap of key → bytes + metadata. PUT once, GET many; no partial update in place (replace whole object). Prefixes (users/42/avatar.jpg) are logical not true folders.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Feature', 'Use', 'Detail'],
      rows: [
        ['Durability', '11 nines via replication/EC', 'Not same as availability — API can throttle'],
        ['Versioning', 'Recover overwritten objects', 'Lifecycle delete old versions'],
        ['Lifecycle', 'Transition to Glacier / expire', 'Cost vs access time'],
        ['Presigned URL', 'Direct client upload/download', 'Offload bandwidth from app'],
        ['Strong read-after-write', 'New object immediately readable', 'S3 standard; overwrite eventual in some cases'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'Direct upload via presigned URL',
      diagram: `sequenceDiagram
  participant App
  participant Client
  participant S3
  Client->>App: request upload slot
  App->>App: generate presigned PUT URL
  App-->>Client: url + key
  Client->>S3: PUT object (direct)
  S3-->>Client: 200
  Client->>App: confirm key
  App->>App: store metadata in DB`,
    },
    {
      type: 'list',
      items: [
        'Store pointer (s3://bucket/key) in relational DB — not blob in Postgres',
        'Multipart upload for large files >100MB',
        'Event notifications (S3 → SQS/Lambda) on upload',
        'Cross-region replication for DR compliance',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'User avatar: client gets presigned PUT to users/{uuid}/avatar.jpg; after upload, API saves URL in users table. CDN fronting bucket for public reads. Virus scan Lambda triggered by S3 event.',
    },
  ],
  tradeoffs: {
    advantages: ['Cheap durable storage', 'Massive scale', 'Simple HTTP API', 'Lifecycle cost tiers'],
    disadvantages: ['Higher latency than block storage', 'No random write in middle of object', 'List operations can be slow/expensive'],
    alternatives: ['EBS/NFS for mutable file workloads', 'DB BLOB for tiny files only'],
    whenToUse: ['Media, backups, data lake, static site hosting', 'Write-once read-many'],
    whenNotToUse: ['Database files needing POSIX', 'Frequent small random updates'],
  },
  failureModes: [
    'Public bucket misconfiguration data leak',
    'Missing virus scan on user uploads',
    'Listing huge prefixes without pagination',
    'Hot prefix throttling (old S3 limitation improved but still design keys)',
    'Relying on object store as sole metadata — orphan objects without DB record',
  ],
  production: {
    performance: ['CloudFront + S3 for reads', 'Parallel multipart upload', 'Transfer acceleration for distant uploads'],
    scalability: ['Virtually unlimited; shard key prefixes randomly for extreme parallelism'],
    reliability: ['Versioning + cross-region replication', 'MFA delete on production buckets'],
    security: ['Block public access default', 'IAM least privilege', 'SSE-S3/KMS encryption', 'Presigned short TTL'],
    observability: ['Storage metrics, 4xx/5xx, lifecycle transitions'],
    cost: ['Intelligent tiering; expire incomplete multipart uploads', 'Glacier for archives'],
  },
  interview: {
    expectations: ['Presigned URL flow', 'Metadata in DB pointer pattern', 'Durability vs availability'],
    commonQuestions: ['S3 vs EBS?', 'Design file upload?'],
    followUps: ['Lifecycle policy?', 'Consistent listing?'],
    misconceptions: ['S3 is a filesystem', 'Unlimited request rate without design'],
    traps: ['Storing only in S3 without DB record of ownership'],
    strongSignals: ['Presigned multipart', 'Event-driven processing', 'CDN integration'],
  },
  keyTakeaways: [
    'Flat key-value for large blobs — durable and cheap.',
    'DB holds metadata; object store holds bytes.',
    'Presigned URLs for direct client transfer.',
    'Lifecycle rules manage cost and retention.',
    'Secure defaults: private buckets, encryption, scan uploads.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Object vs block storage?', answerHint: 'Object REST key/blob whole-object; block low-latency disk sectors.' },
    { level: 'intermediate', question: 'Presigned URL purpose?', answerHint: 'Time-limited direct S3 access without sharing credentials.' },
    { level: 'advanced', question: 'Design resumable large video upload.', answerHint: 'Multipart upload, track uploadId in DB, complete when all parts done, CDN for delivery.' },
  ],
  flashcards: [
    { front: 'Object storage model', back: 'Key → bytes + metadata; whole object PUT/GET' },
    { front: 'Presigned URL', back: 'Temporary signed HTTP access to private object' },
    { front: 'Durability vs availability S3', back: 'Durability data safe; availability API uptime separate' },
    { front: 'Multipart upload', back: 'Parallel parts for large files; complete to assemble' },
  ],
  quickRevision: [
    'S3 key blob store',
    'DB pointer pattern',
    'Presigned upload',
    'Lifecycle tiers',
    'Private + encrypt',
  ],
  systemDesign: {
    problem: 'Design photo storage for social app with 500M photos, direct mobile upload, and global viewing.',
    requirements: {
      functional: ['Upload', 'View feed thumbnails', 'Delete account GDPR'],
      nonFunctional: ['Durable', 'Cheap storage', 'Upload without app server proxy bytes'],
    },
    scaleAssumptions: ['500M objects', '50k uploads/s peak', '500k views/s'],
    capacityEstimates: ['Avg 2MB photo → ~1PB; S3 + CloudFront'],
    api: [{ type: 'code', language: 'http', code: `POST /photos/upload-url → {presigned_url, photo_id}\nPOST /photos/{id}/complete\nGET feed → CDN URLs` }],
    dataModel: [{ type: 'list', items: ['photos table: id, user_id, s3_key, status, created_at', 'S3 bucket photos/{uuid}'] }],
    highLevelArchitecture: [{ type: 'paragraph', text: 'Presigned multipart upload; Lambda resize thumbnails on S3 event; CloudFront CDN; delete marks DB + lifecycle purge S3.' }],
    diagram: {
      mermaid: `flowchart LR
  Mobile -->|presigned PUT| S3
  S3 --> Lambda[Thumbnail Lambda]
  Lambda --> S3
  Feed --> CDN --> S3
  API --> PG[(Metadata DB)]`,
      caption: 'Bytes in S3; metadata in Postgres',
    },
    dataFlow: ['Request URL → upload S3 → complete → async thumb → feed serves CDN URLs'],
    storage: ['S3 standard + IA for old; Glacier optional'],
    caching: ['CDN for public photos'],
    asyncProcessing: ['Thumbnail + moderation queue on upload event'],
    scaling: ['S3 scales; random UUID keys', 'CDN for reads'],
    consistency: ['Metadata complete after S3 success callback'],
    reliability: ['Versioning optional; cross-region replication for DR'],
    failureScenarios: ['Orphan upload if never complete — lifecycle abort incomplete multipart'],
    security: ['Private bucket; signed CDN URLs for non-public', 'Scan malware'],
    observability: ['Upload success rate, Lambda errors, storage cost'],
    bottlenecks: ['Viral photo CDN — automatic'],
    alternatives: ['Self-hosted MinIO — more ops'],
    tradeoffs: ['Immediate public vs private default'],
    interviewFollowUps: ['GDPR delete propagation?', 'EXIF privacy strip?'],
    evolution: [
      { stage: '1. Simple design', description: 'Upload through API server.', bottleneck: 'Bandwidth + scale.' },
      { stage: '2. Improve', description: 'Presigned S3 upload.', bottleneck: 'Processing pipeline.' },
      { stage: '3. Improve', description: 'Event Lambda + CDN.', bottleneck: 'Storage cost.' },
      { stage: '4. Scale further', description: 'Tiering + moderation ML pipeline.', bottleneck: 'Compliance regions.' },
    ],
  },
}
