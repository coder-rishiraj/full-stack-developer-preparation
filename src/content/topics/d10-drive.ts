import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Cloud file storage (Dropbox/Google Drive) lets users upload, sync, share, and version files across devices — combining metadata service, blob storage, delta sync, and conflict resolution.',
  whyExists:
    'Email attachments and USB drives do not scale for multi-device collaboration. Users expect automatic sync, offline access, sharing links, and deduplication to save space and bandwidth.',
  mentalModel:
    'Metadata graph (user → folders → files → versions) lives in SQL. File bytes in object storage, chunked and content-addressed for dedup. Client syncs via block-level deltas using hashes; server resolves conflicts with versioning or last-writer-wins policies.',
  howItWorks: [
    {
      type: 'paragraph',
      text: 'Upload: split file into 4 MB blocks → hash each → upload missing blocks only → commit version metadata. Download/sync: compare block lists, fetch diffs. Sharing generates ACL on namespace. Notification bus tells other clients to pull changes.',
    },
    {
      type: 'mermaid',
      caption: 'Block-level deduplicated storage',
      diagram: `flowchart TB
  Client -->|block hashes| API[Sync API]
  API --> Meta[(Metadata DB)]
  API --> Blob[(Block Store S3)]
  Meta -->|maps file→block_ids| Blob`,
    },
  ],
  example: [
    {
      type: 'code',
      language: 'http',
      caption: 'Upload commit flow',
      code: `POST /v1/blocks/{hash}  (presigned PUT if missing)
POST /v1/files/{id}/versions
{ "blocks": ["sha1:a...", "sha1:b..."], "size": 8388608 }
→ 201 { "version": 7 }`,
    },
  ],
  keyTakeaways: [
    'Separate metadata from content blocks (content-addressable).',
    'Delta sync saves bandwidth — only upload changed blocks.',
    'Dedup by block hash reduces storage for identical chunks.',
    'Conflicts: versioning + client merge or LWW with user prompt.',
    'Evolve: monolithic upload → block store → global CDN + sync notifications.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Why chunk files into blocks?',
      answerHint: 'Delta sync, dedup, resumable uploads, parallel transfer.',
    },
    {
      level: 'intermediate',
      question: 'Two users edit same file offline — how resolve?',
      answerHint: 'Version branches; conflict copies; operational transform for docs.',
    },
    {
      level: 'advanced',
      question: 'Design dedup across users securely?',
      answerHint: 'Content-hash addressing; encrypt per-user keys so dedup only for same tenant or use convergent encryption tradeoffs.',
    },
  ],
  flashcards: [
    { front: 'Content-addressable block', back: 'Store by hash; same bytes → one physical copy' },
    { front: 'Sync notification', back: 'Long poll / WebSocket / FCM tells clients to pull new cursor' },
    { front: 'Presigned upload', back: 'Client PUTs large blocks direct to S3, bypass API bandwidth' },
  ],
  quickRevision: [
    'Metadata DB + block blob store',
    '4 MB blocks with hashes',
    'Upload missing blocks only',
    'Version graph per file',
    'ACL sharing links',
    'Notification for sync',
  ],
  systemDesign: {
    problem:
      'Design Dropbox-like cloud storage for 500M users, avg 100 GB/account logical, efficient sync and sharing, multi-device.',
    requirements: {
      functional: [
        'Upload/download files and folders',
        'Auto sync across devices',
        'Share links with read/write permissions',
        'File versioning and trash',
      ],
      nonFunctional: [
        'Sync latency seconds after change on LAN/WAN',
        'Durability 11 nines for blocks',
        'Bandwidth-efficient delta sync',
        'Support files up to 50 GB',
      ],
    },
    scaleAssumptions: [
      '500M users; 50 PB logical; 30% dedup savings → ~35 PB physical',
      'Peak upload 2M concurrent; download 10M concurrent',
      'Avg block 4 MB; metadata ops 100k/s',
    ],
    capacityEstimates: [
      '35 PB object storage (S3 IA/Glacier tiers for cold)',
      'Metadata: billions of file rows — sharded Postgres or Dynamo',
      'Notification fan-out: millions of WebSocket/long-poll connections',
    ],
    api: [
      {
        type: 'code',
        language: 'http',
        code: `GET  /v1/files/{id}
POST /v1/files/{id}/versions
GET  /v1/sync/cursor → delta since cursor
POST /v1/shares`,
      },
    ],
    dataModel: [
      {
        type: 'list',
        items: [
          'Namespace: user_id or team_id',
          'Inode: path, file_id, parent_folder_id',
          'FileVersion: file_id, version, block_hash_list[], size, created_at',
          'Block: hash (PK), storage_key, ref_count',
          'Share: token, resource_id, permission, expiry',
        ],
      },
    ],
    highLevelArchitecture: [
      {
        type: 'paragraph',
        text: 'Metadata service (sharded SQL), block service fronting S3 with dedup ref counts, sync notification service (WebSocket + mobile push), CDN for popular shared downloads.',
      },
    ],
    diagram: {
      mermaid: `flowchart LR
  Desktop --> Sync[Sync API]
  Mobile --> Sync
  Sync --> Meta[(Metadata)]
  Sync --> Block[Block Service]
  Block --> S3[(S3)]
  Sync --> Notify[Notification]
  Notify --> Desktop
  CDN --> S3`,
      caption: 'Clients sync metadata; blocks via presigned S3',
    },
    dataFlow: [
      'Client computes block hashes locally',
      'Check which blocks missing → presigned upload',
      'Commit version transaction in metadata DB',
      'Publish change event → notify other devices',
      'Peers pull delta via sync cursor API',
    ],
    storage: [
      'S3 for blocks; ref_count in DB for GC',
      'Sharded Postgres for namespace tree',
      'Trash: soft delete + async purge',
    ],
    caching: [
      'CDN for public share downloads',
      'Edge cache not for private blocks without auth',
      'Client local cache on disk',
    ],
    asyncProcessing: [
      'Garbage collect unreferenced blocks',
      'Virus scan on upload complete',
      'Thumbnail/preview generation',
      'Cross-region replication for DR',
    ],
    scaling: [
      'Shard metadata by user_id hash',
      'S3 scales horizontally',
      'Notification service horizontal with user_id routing',
    ],
    consistency: [
      'Metadata transactions for namespace moves',
      'Eventual sync across devices (seconds)',
      'Block immutability simplifies consistency',
    ],
    reliability: [
      'Multipart upload resume',
      'Version rollback on failed commit',
      'Cross-region block replication',
    ],
    failureScenarios: [
      'Partial upload → uncommitted version invisible',
      'Conflict on simultaneous edit → branch versions',
      'Ref_count bug → premature block delete (use mark-sweep GC)',
    ],
    security: [
      'Encryption at rest (SSE-S3 or client-side E2E for premium)',
      'Share link tokens high entropy',
      'AuthZ on every metadata and block fetch',
    ],
    observability: [
      'Upload success rate, bytes synced/user',
      'Dedup ratio, GC backlog',
      'Sync notification delivery latency',
    ],
    bottlenecks: [
      'Hot shared file download — CDN',
      'Metadata DB for deep directory listings',
      'Initial sync of large libraries',
    ],
    alternatives: [
      'Full-file upload without dedup (simpler, costlier)',
      'Git-like object store (for dev-focused products)',
    ],
    tradeoffs: [
      'Client-side encryption vs server-side dedup',
      'LWW vs branching on conflict',
      'Block size vs dedup granularity',
    ],
    interviewFollowUps: [
      'Design selective sync (only some folders)?',
      'Team shared drives ACL model?',
      'Bandwidth limit fairness across users?',
    ],
    evolution: [
      {
        stage: '1. Simple design',
        description: 'Whole file upload/download to single NAS + MySQL paths.',
        bottleneck: 'No delta sync; storage explodes.',
      },
      {
        stage: '2. Improve',
        description: 'Block hashing + S3; metadata service; basic sync cursor.',
        bottleneck: 'Conflict handling naive; notification polling heavy.',
      },
      {
        stage: '3. Improve',
        description: 'Dedup ref counts; WebSocket notify; presigned uploads; versioning.',
        bottleneck: 'Global metadata shard hotspots; large folder list slow.',
      },
      {
        stage: '4. Scale further',
        description: 'Multi-region metadata; CDN shares; client E2E option; GC pipeline.',
        bottleneck: 'Cross-region sync cost; E2E breaks global dedup.',
      },
    ],
  },
  tradeoffs: {
    advantages: ['Bandwidth-efficient sync', 'Dedup saves cost', 'Familiar folder UX'],
    disadvantages: ['Complex conflict model', 'Metadata scale challenge', 'Client complexity'],
    alternatives: ['Git LFS', 'Pure object storage browser (S3 console)'],
    whenToUse: ['Consumer/team file sync', 'Backup products'],
    whenNotToUse: ['Real-time co-editing docs (use CRDT editor)'],
  },
  failureModes: [
    'Lost block reference corrupts file',
    'Sync loop on conflict mis-detection',
    'Share link leak via guessable tokens',
  ],
  production: {
    performance: ['Presigned parallel block upload'],
    scalability: ['Shard metadata; S3 for bytes'],
    reliability: ['Immutable blocks; versioned metadata'],
    security: ['Encryption, ACL audit logs'],
    observability: ['Sync lag metrics per platform'],
    cost: ['Dedup + tiered storage + egress CDN'],
  },
  interview: {
    expectations: [
      'Block-level sync and dedup story',
      'Metadata vs blob separation',
      'Conflict and notification design',
    ],
    commonQuestions: ['Design Dropbox', 'How delta sync works?'],
    followUps: ['E2E encryption impact?', 'Share permissions?'],
    misconceptions: ['Upload whole file every save'],
    traps: ['Storing file bytes in SQL BLOB'],
    strongSignals: ['Content hash blocks, presigned S3, sync cursor, ref_count GC'],
  },
}
