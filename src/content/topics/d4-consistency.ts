import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Consistency in distributed systems describes what guarantees readers observe relative to writers — from strong linearizability (reads see latest write globally) to eventual consistency (replicas converge over time). Pick the level per operation, not one label for the whole product.',
  whyExists:
    'Replication and caching introduce lag. Without explicit consistency models, engineers assume “strong” while users see stale inventory or double charges. Naming guarantees (read-your-writes, monotonic reads, causal) aligns API behavior with business invariants.',
  mentalModel:
    'Picture multiple copies of data updating at different speeds. Strong consistency means one logical copy — reads wait for agreement. Eventual means copies may disagree briefly but merge. Most production systems mix levels on different paths.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Model', 'Guarantee', 'Typical mechanism'],
      rows: [
        ['Linearizable (strong)', 'All ops appear in single global order', 'Sync replication, quorum R+W>N, single leader'],
        ['Sequential consistency', 'Global order per process, not real-time', 'Weaker than linearizable'],
        ['Causal', 'Causally related ops seen in order', 'Version vectors, logical clocks'],
        ['Eventual', 'Replicas converge if no new writes', 'Async replication, anti-entropy'],
        ['Read-your-writes', 'User sees own updates', 'Sticky routing to primary or session token'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'Quorum read/write overlap (N=3, W=2, R=2)',
      diagram: `sequenceDiagram
  participant C as Client
  participant L as Leader
  participant F1 as Follower1
  participant F2 as Follower2
  C->>L: write W=2 ack
  L->>F1: replicate
  L->>F2: replicate
  F1-->>L: ack
  Note over L,F2: W=2 achieved
  C->>F1: read R=2
  F1->>F2: read repair / quorum
  F2-->>C: latest value`,
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'Isolation vs replication consistency',
      text: 'DB transaction isolation (ACID) is about concurrent txs on one node. Replication consistency is about copies across nodes — both matter in interviews.',
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Social feed post: write goes to leader; followers read from nearby replica with 200ms lag — eventual. User expects read-your-writes on their profile edit — route that read to leader or attach session version.',
    },
    {
      type: 'code',
      language: 'http',
      caption: 'Expose consistency choice to clients',
      code: `GET /products/42
Prefer: return=minimal          // cache OK, eventual

GET /account/balance
Consistency-Required: true      // linearizable / primary read

PUT /cart/items
Response: { version: 17 }     // client sends If-Match: 17 on next PUT`,
    },
  ],
  tradeoffs: {
    advantages: [
      'Right-sized guarantees save latency and availability',
      'Clear SLAs reduce support surprises',
      'Tunable per endpoint in Dynamo/Cassandra',
    ],
    disadvantages: [
      'Strong consistency costs latency (cross-region RTT)',
      'Mixed models confuse client developers',
      'Testing eventual paths needs chaos/lag injection',
    ],
    alternatives: [
      'CRDTs for merge-friendly data structures',
      'Single leader + sync replica for strong subset only',
      'Version vectors for causal ordering',
    ],
    whenToUse: [
      'Inventory, balances, idempotency keys → strong',
      'Feeds, view counts, recommendations → eventual',
    ],
    whenNotToUse: [
      'Strong everywhere on global active-active without accepting latency',
    ],
  },
  failureModes: [
    'Stale read causes oversell or wrong balance display',
    'Lost update without compare-and-swap / version check',
    'Non-monotonic reads confuse users (time goes backward)',
    'Clock skew breaks last-writer-wins',
  ],
  production: {
    reliability: ['Idempotent retries with version tokens', 'Fencing tokens on leader failover'],
    performance: ['Local quorum in single region; cross-region async for DR'],
    observability: ['Replication lag histogram per replica', 'Stale read alarms on critical paths'],
    scalability: ['Read replicas with lag budget; cache with TTL + invalidation'],
  },
  interview: {
    expectations: [
      'Define linearizable vs eventual with example',
      'Explain quorum R/W/N',
      'List client session guarantees (read-your-writes, monotonic)',
    ],
    commonQuestions: ['How ensure read-your-writes?', 'What is eventual consistency?'],
    followUps: ['CRDT vs LWW?', 'How test consistency under partition?'],
    misconceptions: ['Strong = ACID always', 'Eventual = never consistent'],
    traps: ['Claiming strong consistency with async cross-region replication'],
    strongSignals: ['Per-operation tuning', 'Version/ETags on HTTP', 'Mentions Jepsen or formal levels'],
  },
  keyTakeaways: [
    'Consistency is a spectrum — name the level per read/write.',
    'Quorum: W+R>N gives strong-ish reads after write.',
    'Session guarantees: read-your-writes, monotonic reads.',
    'Use versions/ETags to detect stale writes.',
    'Match model to invariant: money strong, metrics eventual.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Eventual consistency meaning?',
      answerHint: 'Replicas may diverge temporarily; converge without new writes.',
    },
    {
      level: 'intermediate',
      question: 'How implement read-your-writes?',
      answerHint: 'Sticky to primary, session token, or read version >= write version.',
    },
    {
      level: 'advanced',
      question: 'N=5, W=3, R=3 — what fails if one node down?',
      answerHint: 'Still quorum for both; analyze min live nodes for W and R separately.',
    },
  ],
  flashcards: [
    { front: 'Linearizability', back: 'Ops appear in real-time global order; strongest common guarantee' },
    { front: 'Read-your-writes', back: 'Client always sees its own prior writes' },
    { front: 'Quorum condition', back: 'W + R > N ensures read sees latest write' },
    { front: 'LWW', back: 'Last-Writer-Wins merge using timestamp — clock skew risk' },
  ],
  quickRevision: [
    'Strong vs eventual vs causal',
    'Quorum W,R,N math',
    'Session: RYW, monotonic reads',
    'Versions / If-Match / ETags',
    'Per-endpoint policy not global',
  ],
  systemDesign: {
    problem: 'Design a product catalog service where product details can be eventually consistent but inventory count for checkout must be strongly consistent (no oversell).',
    requirements: {
      functional: ['Browse catalog', 'Checkout decrements inventory', 'Admin updates product'],
      nonFunctional: ['No oversell on inventory', 'Browse p99 < 100ms globally', 'Tolerate replica lag for descriptions'],
    },
    scaleAssumptions: ['1M SKUs', '10k checkout/s peak', 'Global users'],
    capacityEstimates: ['Catalog reads 100k RPS — CDN + cache; inventory writes 10k/s — shard by sku_id'],
    api: [
      {
        type: 'code',
        language: 'http',
        code: `GET  /products/{id}           // eventual OK
POST /checkout                  // strong inventory check
PATCH /admin/products/{id}      // strong metadata if needed`,
      },
    ],
    dataModel: [
      {
        type: 'list',
        items: [
          'product_metadata (sku, title, desc) — replicated async',
          'inventory (sku, available) — leader/partition with conditional UPDATE',
        ],
      },
    ],
    highLevelArchitecture: [
      {
        type: 'paragraph',
        text: 'Split read models: CDN/cache for metadata. Inventory service on strongly consistent store (Postgres row lock or Dynamo conditional write). Checkout calls inventory atomically before payment.',
      },
    ],
    diagram: {
      mermaid: `flowchart LR
  Browse[Browse API] --> Cache[(CDN/Redis)]
  Cache --> MetaDB[(Metadata replicas)]
  Checkout[Checkout API] --> Inv[Inventory Service]
  Inv --> InvDB[(Strong inventory store)]`,
      caption: 'Dual consistency tiers in one product domain',
    },
    dataFlow: [
      'Browse: cache → replica OK with TTL',
      'Checkout: BEGIN; UPDATE inventory WHERE available>=qty; commit; else fail',
      'Admin metadata: write leader; async replicate',
    ],
    storage: ['Postgres/Cockroach for inventory', 'Elasticsearch or replicas for search metadata'],
    caching: ['Aggressive cache metadata; never cache inventory for purchase without version check'],
    asyncProcessing: ['CDC metadata to search index'],
    scaling: ['Shard inventory by sku_id hash', 'CDN for static product pages'],
    consistency: ['Strong linearizable decrement on inventory row', 'Eventual for description/search index lag OK'],
    reliability: ['Idempotent checkout id', 'Retry conditional update on conflict'],
    failureScenarios: ['Stale price on browse — acceptable short window; stale inventory — not acceptable'],
    security: ['Admin writes authenticated; inventory API internal only'],
    observability: ['Lag metadata vs inventory', 'Oversell guard metric (should be 0)'],
    bottlenecks: ['Hot SKU row serialization', 'Cache stampede on launch'],
    alternatives: ['Reserve inventory in Redis with Lua atomic dec'],
    tradeoffs: ['Separate services vs one DB with two consistency paths'],
    interviewFollowUps: ['Show oversell under eventual inventory', 'How display “only 2 left” accurately?'],
    evolution: [
      { stage: '1. Simple design', description: 'One DB, all strong.', bottleneck: 'Global read latency.' },
      { stage: '2. Improve', description: 'Read replicas for catalog; primary for inventory.', bottleneck: 'Replica lag confusion.' },
      { stage: '3. Improve', description: 'Split inventory microservice + conditional writes + cache metadata.', bottleneck: 'Hot SKU.' },
      { stage: '4. Scale further', description: 'Shard inventory; reservation TTL; queue checkout.', bottleneck: 'Cross-shard cart rare case.' },
    ],
  },
}
