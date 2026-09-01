import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Amazon S3 (Simple Storage Service) is object storage: buckets, keys (paths), objects with metadata, versioning, lifecycle rules, encryption, and presigned URLs. Durability 11 nines; use for static assets, backups, logs, data lake, and event-driven processing via S3 notifications.',
  whyExists:
    'EBS attaches to one instance; S3 stores unlimited objects accessible via HTTP API globally (with CloudFront). Cheap durable storage for images, exports, audit logs, and Terraform state. Decouples storage from compute lifecycle.',
  mentalModel:
    'Infinite filesystem in the cloud accessed by key name. Bucket is top folder (globally unique name); key is full path user-uploads/abc.jpg. No true directories — prefix listing simulates folders.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Feature', 'Purpose'],
      rows: [
        ['Storage classes', 'Standard, IA, Glacier for cost vs access frequency'],
        ['Versioning', 'Keep history; protect overwrite deletes'],
        ['Lifecycle', 'Transition to IA/Glacier; expire old logs'],
        ['SSE-SSE-KMS', 'Encryption at rest'],
        ['Presigned URL', 'Time-limited upload/download without public bucket'],
        ['Event notification', 'S3 → SQS/SNS/Lambda on PUT'],
      ],
    },
    {
      type: 'list',
      items: [
        'Block Public Access on by default — explicit opt-in for static sites.',
        'Strong read-after-write for new objects; list eventually consistent historically (now strong).',
        'Multipart upload for large files; abort incomplete to avoid charges.',
        'S3 Transfer Acceleration via CloudFront edge for global uploads.',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'User uploads avatar: API generates presigned PUT URL; browser uploads direct to S3; S3 event triggers Lambda to resize thumbnail. CloudFront CDN serves public avatars from bucket with OAC.',
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Object metadata and tags separate from body — searchable with Inventory.',
        'Consistency: overwrite DELETE/PUT strong; LIST was eventual (improved).',
        'Request rate prefix scaling — random prefix for very hot keys.',
        'S3 Express One Zone — low latency single-AZ bucket class.',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Durability', 'Scale', 'Cheap', 'Integrates with entire AWS ecosystem'],
    disadvantages: ['Not filesystem — no partial update in place', 'Listing large buckets slow', 'Egress costs'],
    alternatives: ['EBS for block attach', 'EFS for POSIX shared FS', 'Glacier for archive only'],
    whenToUse: ['Static assets', 'Backups', 'Log archive', 'Data lake', 'User uploads'],
    whenNotToUse: ['Database primary store', 'Low-latency random read/write file system'],
  },
  failureModes: [
    'Public bucket ACL misconfiguration — data leak',
    'No versioning — accidental delete permanent',
    'Hot prefix throttling on sequential keys',
    'Presigned URL too long TTL — unauthorized access window',
    'Lifecycle deletes prod data without MFA delete protection',
  ],
  production: {
    security: ['Block public access', 'SSE-KMS', 'Bucket policy least privilege', 'MFA delete on versioning'],
    reliability: ['Cross-region replication for critical data', 'Versioning enabled'],
    cost: ['Lifecycle to IA/Glacier', 'CloudFront reduce egress', 'Abort incomplete multipart'],
    observability: ['Server access logging', 'CloudTrail data events for audit'],
  },
  interview: {
    expectations: ['Object vs block storage', 'Presigned URL', 'Versioning and lifecycle'],
    commonQuestions: ['S3 vs EBS?', 'Secure user upload design?'],
    followUps: ['Event-driven resize pipeline?', '11 nines meaning?'],
    misconceptions: ['S3 is a disk you mount', 'Folders are real'],
    traps: ['Public read on PII bucket'],
    strongSignals: ['Presigned upload', 'CloudFront OAC', 'Event notification Lambda'],
  },
  keyTakeaways: [
    'S3 = object storage bucket + key; not a POSIX filesystem.',
    'Block public access; use presigned URLs for temp access.',
    'Versioning + lifecycle manage retention and cost.',
    'Events trigger downstream processing on upload.',
    'CloudFront caches S3 origin for global static delivery.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'S3 vs EBS?', answerHint: 'S3 object HTTP API unlimited; EBS block volume attached to one EC2.' },
    { level: 'intermediate', question: 'Direct browser upload to S3?', answerHint: 'Presigned PUT URL from API; client uploads without proxying through server.' },
    { level: 'advanced', question: 'Prevent accidental bucket delete?', answerHint: 'Versioning + MFA delete; bucket policy Deny s3:DeleteBucket without MFA.' },
  ],
  flashcards: [
    { front: 'Presigned URL', back: 'Temporary signed HTTP access to private object' },
    { front: 'S3 versioning', back: 'Keeps object history on overwrite/delete marker' },
    { front: 'Storage class IA', back: 'Infrequent access — lower storage higher retrieval' },
  ],
  quickRevision: [
    'Bucket + key objects',
    'Presigned URLs',
    'Versioning lifecycle',
    'Block public access',
    'CloudFront CDN',
  ],
}
