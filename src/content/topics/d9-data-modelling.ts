import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Data modelling in system design interviews chooses entities, relationships, access patterns, and storage types (relational, document, wide-column, graph) — schema shaped by queries not ER diagrams alone. You justify primary keys, indexes, sharding keys, and denormalization for hot paths.',
  whyExists:
    'Wrong model makes scale impossible — scanning full user table for feed, hot partition on celebrity user_id, or JOIN-heavy path at 100k RPS. Interview data section proves you design for read/write patterns stated in requirements.',
  mentalModel:
    'Queries drive shelves in a warehouse. Know what you fetch before labeling boxes. List top 3 queries → pick keys and indexes → denormalize duplicate data if read hot → shard by key with even distribution.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Pattern', 'Model choice', 'Interview signal'],
      rows: [
        ['User + posts feed', 'user_id partition, post by id', 'Avoid hot partition on celebrity'],
        ['Many-to-many followers', 'Graph or adjacency list + fan-out table', 'Push vs pull feed table'],
        ['Time-series metrics', 'Wide-column or TSDB partition by time', 'TTL on buckets'],
        ['Search', 'Inverted index Elasticsearch', 'Denormalized doc from CDC'],
        ['URL lookup', 'KV code → url', 'O(1) get by key'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'Feed data model options',
      diagram: `flowchart TB
  Post[posts table] --> Fanout[fanout_feed user_id post_id]
  Fanout --> Read[GET feed by user_id range scan]
  Post --> Pull[pull model query followees at read time]`,
    },
    {
      type: 'list',
      items: [
        'Write 3–5 core tables/collections with primary keys',
        'State sharding key: user_id hash, not auto-increment alone',
        'Denormalize counts, usernames on hot read path cautiously',
        'Separate OLTP from analytics warehouse',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Twitter-like: users(user_id), posts(post_id, user_id, ts), follows(follower, followee), fanout_feed(user_id, post_id, ts) for normal users push model; celebrities pull-only at read. Shard by user_id hash. Secondary index post_id for direct lookup.',
    },
  ],
  tradeoffs: {
    advantages: ['Access-pattern optimized', 'Clear shard path', 'Interview credibility'],
    disadvantages: ['Denormalization sync cost', 'Multiple stores operational burden'],
    alternatives: ['Single normalized Postgres until proven need — state migration path'],
    whenToUse: ['After requirements and capacity sketch', 'Before HLD diagram detail'],
    whenNotToUse: ['Never skip — even simple designs need users + events tables'],
  },
  failureModes: [
    'Normalized JOIN feed at scale',
    'Shard key monotonic — hot last shard',
    'Celebrity partition hot spot',
    'Storing blobs in row — use object storage + pointer',
    'No index on query filter column',
  ],
  production: {
    scalability: ['Shard by high-cardinality key', 'Avoid hot partitions'],
    performance: ['Covering indexes for hot queries', 'Denormalize read models'],
    maintainability: ['Migration strategy for schema changes', 'CDC to search index'],
    cost: ['Right store per access pattern — not one DB for all'],
  },
  interview: {
    expectations: ['Tables + keys', 'Access pattern first', 'Shard key rationale'],
    commonQuestions: ['Schema for news feed?', 'Shard key for payments?'],
    followUps: ['Denormalize when?', 'Celebrity problem?'],
    misconceptions: ['Full ER diagram needed', 'NoSQL means no schema'],
    traps: ['Auto-increment PK as shard key only'],
    strongSignals: ['Query-driven schema', 'Push/pull hybrid feed', 'Hot partition mitigation'],
  },
  keyTakeaways: [
    'List access patterns before tables.',
    'Primary key and shard key match hottest query filter.',
    'Denormalize for read-heavy; accept sync via events.',
    'Avoid hot partitions — hash high-cardinality keys.',
    'Blob → object storage; DB stores metadata pointer.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'KV store vs relational for URL shortener?', answerHint: 'KV code→url O(1) lookup; relational OK at small scale with index on code.' },
    { level: 'intermediate', question: 'Shard payments table how?', answerHint: 'By user_id or account_id hash — even spread; not by time alone.' },
    { level: 'advanced', question: 'Celebrity 50M followers feed model?', answerHint: 'Pull model at read for celebrity posts; push fan-out for normal users; hybrid threshold.' },
  ],
  flashcards: [
    { front: 'Access-pattern-first modelling', back: 'Design schema from queries not abstract ER only' },
    { front: 'Hot partition', back: 'Skewed shard key — celebrity user_id overloads one shard' },
    { front: 'Denormalization', back: 'Duplicate data to avoid JOIN on hot read path' },
    { front: 'Push vs pull feed', back: 'Precompute fan-out table vs query followees at read' },
  ],
  quickRevision: [
    'Queries first',
    'PK = shard key',
    'Denorm reads',
    'Hash shard',
    'Blobs to S3',
  ],
}
