import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'A chat system delivers real-time one-to-one and group messages with delivery guarantees, presence, read receipts, and history — combining WebSockets (or similar) for live delivery with durable message storage.',
  whyExists:
    'Polling HTTP is wasteful and high-latency for conversational UX. Chat requires persistent connections, ordered delivery per conversation, offline catch-up, and fan-out to many group members.',
  mentalModel:
    'Clients maintain long-lived connections to chat servers. Send path: accept message → persist → fan-out to online recipients via connection registry. Offline users pull history on reconnect. Sequence numbers per channel provide ordering.',
  howItWorks: [
    {
      type: 'paragraph',
      text: 'Connection layer (WebSocket gateway) maps user_id → socket. Message service writes to DB (partitioned by conversation_id), publishes to pub/sub or queue for fan-out. Presence service tracks online/offline via heartbeats. Media uses object storage + CDN.',
    },
    {
      type: 'mermaid',
      caption: 'Send and fan-out',
      diagram: `sequenceDiagram
  participant A as User A
  participant GW as Chat Gateway
  participant MS as Message Service
  participant DB as Message Store
  participant B as User B
  A->>GW: send(msg)
  GW->>MS: persist
  MS->>DB: append
  MS->>GW: fan-out
  GW->>B: push msg`,
    },
  ],
  example: [
    {
      type: 'code',
      language: 'http',
      caption: 'REST for history; WebSocket for live',
      code: `WS /v1/ws?token=...
→ { "type": "message", "conv_id": "c1", "body": "hi", "seq": 42 }

GET /v1/conversations/{id}/messages?after_seq=40&limit=50`,
    },
  ],
  keyTakeaways: [
    'WebSocket gateway + stateless message API is the common split.',
    'Order per conversation via monotonic seq or server timestamp.',
    'Fan-out: small groups sync; large channels use pull/hybrid.',
    'Store messages durably before acknowledging sender.',
    'Evolve: polling → single server → sharded gateways + Cassandra.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'WebSocket vs long polling?',
      answerHint: 'WebSocket: full duplex, lower overhead; polling simpler but costly at scale.',
    },
    {
      level: 'intermediate',
      question: 'How ensure message ordering in a group?',
      answerHint: 'Per-conversation sequence from single writer or consensus; client sorts by seq.',
    },
    {
      level: 'advanced',
      question: 'Design WhatsApp-scale group with 256 members?',
      answerHint: 'Write once, fan-out via queue to connection shards; cap group size or use lazy delivery.',
    },
  ],
  flashcards: [
    { front: 'Connection registry', back: 'Maps user_id → gateway node for push routing' },
    { front: 'Delivery ack pattern', back: 'Persist then ack sender; at-least-once with client dedupe' },
    { front: 'Large group strategy', back: 'Hybrid fan-out + pull on reconnect for megachannels' },
  ],
  quickRevision: [
    'WS gateway + message service',
    'Persist before ack',
    'Seq per conversation',
    'Presence via heartbeat',
    'History paginated by seq/cursor',
    'Media to object storage',
  ],
  systemDesign: {
    problem:
      'Design a real-time chat platform (Messenger-scale) supporting 1:1 and group chats, 500M MAU, message history, and read receipts.',
    requirements: {
      functional: [
        'Send/receive text and media in 1:1 and group chats',
        'Message history with pagination',
        'Online presence and typing indicators',
        'Read receipts and delivery status',
      ],
      nonFunctional: [
        'Delivery latency p99 < 200ms for online users',
        'Durability: no acknowledged message loss',
        'Support 256-member groups; optional channels with 100k+ subscribers',
        'Multi-device sync per user',
      ],
    },
    scaleAssumptions: [
      '500M MAU, 50M concurrent connections peak',
      '10B messages/day (~115k msg/s average, 500k peak)',
      'Avg text message 200 bytes; 10% with media',
    ],
    capacityEstimates: [
      '10B × 200 B ≈ 2 TB/day text; 5-year retention → petabyte tier with tiered storage',
      '50M connections × 4 KB state ≈ 200 GB connection registry (sharded Redis)',
      '500k msg/s write → partition message store by conversation_id hash',
    ],
    api: [
      {
        type: 'code',
        language: 'http',
        code: `POST /v1/conversations/{id}/messages
GET /v1/conversations/{id}/messages?cursor=...
WS events: message, presence, typing, ack`,
      },
    ],
    dataModel: [
      {
        type: 'list',
        items: [
          'Conversation: id, type (1:1|group), members[], created_at',
          'Message: conv_id, seq, sender_id, body, media_ref, created_at, deleted',
          'UserPresence: user_id, status, last_seen, gateway_node',
          'ReadReceipt: conv_id, user_id, last_read_seq',
        ],
      },
    ],
    highLevelArchitecture: [
      {
        type: 'paragraph',
        text: 'Clients connect to regional WebSocket gateways. Message service appends to Cassandra (partition conv_id). Fan-out service publishes to recipient gateway shards via Kafka or internal pub/sub. Presence in Redis. Media upload via presigned S3 URLs.',
      },
    ],
    diagram: {
      mermaid: `flowchart TB
  C1[Client A] --> GW1[WS Gateway US]
  C2[Client B] --> GW2[WS Gateway EU]
  GW1 --> MS[Message Service]
  MS --> Cass[(Cassandra Messages)]
  MS --> Kafka[Kafka Fan-out]
  Kafka --> GW1
  Kafka --> GW2
  GW1 --> Redis[(Presence Registry)]`,
      caption: 'Regional gateways with async cross-region fan-out',
    },
    dataFlow: [
      'Sender POST/WS → gateway → message service',
      'Allocate seq, persist row, ack sender',
      'Publish fan-out event with recipient list',
      'Each gateway pushes to local connected devices',
      'Offline recipients fetch history on reconnect',
    ],
    storage: [
      'Cassandra: messages by (conv_id, seq)',
      'Postgres: conversation metadata and membership',
      'S3: media blobs',
      'Redis: presence and gateway routing',
    ],
    caching: [
      'Recent message window cached per conv on gateway',
      'Conversation member list cached with invalidation on join/leave',
    ],
    asyncProcessing: [
      'Push notification for offline users (APNs/FCM)',
      'Search index build for message history search',
      'Media transcoding pipeline',
    ],
    scaling: [
      'Horizontally scale gateway pods; sticky sessions or token routing',
      'Shard Cassandra by conv_id',
      'Separate fan-out workers for large groups',
    ],
    consistency: [
      'Per-conversation total order via single seq generator (DB or per-partition counter)',
      'Presence is eventually consistent',
      'Read receipts monotonic per user',
    ],
    reliability: [
      'Idempotent send with client message_id',
      'At-least-once fan-out; client dedupes by message_id',
      'Gateway reconnect with exponential backoff',
    ],
    failureScenarios: [
      'Gateway crash → client reconnects to another; undelivered from Kafka retry',
      'Hot group (live event) → fan-out queue backlog → throttle typing, batch push',
      'Split brain seq — use DB conditional write or single leader per conv',
    ],
    security: [
      'E2E encryption optional (Signal model) — server sees ciphertext only',
      'Auth on WS upgrade; rate limit sends',
      'Validate membership before deliver',
    ],
    observability: [
      'End-to-end delivery latency trace',
      'Fan-out lag, connection count per gateway',
      'Message persist error rate',
    ],
    bottlenecks: [
      'Fan-out to large groups',
      'Connection registry hot keys for celebrities',
      'Cross-region latency for global 1:1',
    ],
    alternatives: [
      'MQTT broker cluster',
      'Firebase / Stream hosted chat',
      'CRDT for offline-first (less common at mega scale)',
    ],
    tradeoffs: [
      'Strong ordering vs multi-region write latency',
      'Sync fan-out vs async with slight delay',
      'E2E encryption vs server-side search/moderation',
    ],
    interviewFollowUps: [
      'How design last-seen without leaking privacy?',
      'Message sync across phone + laptop?',
      'Moderation in E2E chats?',
    ],
    evolution: [
      {
        stage: '1. Simple design',
        description: 'Single Node WebSocket server + MySQL messages.',
        bottleneck: 'Connection limit; DB write ceiling.',
      },
      {
        stage: '2. Improve',
        description: 'Separate gateway and message API; Redis presence.',
        bottleneck: 'MySQL does not scale writes; fan-out blocks thread.',
      },
      {
        stage: '3. Improve',
        description: 'Cassandra + Kafka fan-out; regional gateways.',
        bottleneck: 'Large group fan-out storm; cross-region delay.',
      },
      {
        stage: '4. Scale further',
        description: 'Hybrid delivery for megachannels; multi-device sync service; push pipeline.',
        bottleneck: 'Operational complexity; moderation at scale.',
      },
    ],
  },
  tradeoffs: {
    advantages: ['Real-time UX', 'Durable history', 'Rich presence features'],
    disadvantages: ['Stateful gateways', 'Fan-out cost for large groups', 'Complex multi-device sync'],
    alternatives: ['Async messaging (email model)', 'Hosted realtime SDK'],
    whenToUse: ['Messaging apps', 'Support chat', 'Collaboration'],
    whenNotToUse: ['Fire-and-forget notifications only'],
  },
  failureModes: [
    'Ack before persist → message loss',
    'Duplicate delivery without client dedupe',
    'Presence false negatives causing missed pushes',
  ],
  production: {
    performance: ['Binary WS frames; batch small events'],
    scalability: ['Shard by conversation; async fan-out'],
    reliability: ['Client idempotency keys; Kafka replay'],
    security: ['TLS everywhere; optional E2E'],
    observability: ['Delivery SLO dashboards'],
    cost: ['Connection fleet + long-term message storage'],
  },
  interview: {
    expectations: [
      'Draw gateway + persist + fan-out',
      'Discuss ordering and offline catch-up',
      'Scale connection and write paths separately',
    ],
    commonQuestions: ['Design WhatsApp', 'WebSocket scaling'],
    followUps: ['Group of 1000?', 'Multi-region chat?'],
    misconceptions: ['One giant WebSocket server handles billions'],
    traps: ['Acknowledging before durable write'],
    strongSignals: ['Seq numbers, Kafka fan-out, presence registry, idempotent client ids'],
  },
}
