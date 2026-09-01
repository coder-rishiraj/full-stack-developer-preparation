import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Stateless services do not store client session data in memory between requests — each request carries enough context (tokens, IDs) to be handled by any instance. Stateful services bind user or partition state to specific nodes (sticky sessions, primary DB connections, in-memory caches tied to a shard owner).',
  whyExists:
    'Load balancers need to route freely for failover and elastic scale-out. In-memory session on one pod breaks when that pod dies or when traffic shifts. Externalizing state (Redis, DB) trades latency for resilience and horizontal growth.',
  mentalModel:
    'Stateless = interchangeable workers reading/writing shared stores. Stateful = this request must land on node 7 because only node 7 holds the websocket room or shard slice. Minimize stateful surface area; make state durable and relocatable.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Aspect', 'Stateless', 'Stateful'],
      rows: [
        ['Session', 'JWT or server session in Redis', 'In-memory session on node'],
        ['Scaling', 'Add/remove instances freely', 'Rebalance/shard migration needed'],
        ['Failover', 'Retry any healthy instance', 'Reconnect, state recovery, split brain risk'],
        ['Examples', 'REST API + external DB', 'Game server room, Kafka partition leader, DB primary'],
        ['LB', 'Round-robin / least connections', 'Consistent hash / sticky sessions'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'Stateless API vs sticky stateful',
      diagram: `flowchart TB
  subgraph stateless [Stateless API]
    C1[Client] --> LB1[LB]
    LB1 --> P1[Pod A]
    LB1 --> P2[Pod B]
    P1 --> Redis[(Shared Redis)]
    P2 --> Redis
  end
  subgraph stateful [Stateful shard]
    C2[Client] --> LB2[Consistent hash]
    LB2 --> S1[Shard owner]
    S1 --> Mem[In-memory state]
  end`,
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Pragmatic hybrid',
      text: 'WebSocket chat: stateful connection on one node, but room state persisted to Redis/DB so reconnect can land elsewhere after hydration.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'http',
      caption: 'Stateless auth — every request self-contained',
      code: `GET /v1/orders
Authorization: Bearer eyJ...   # JWT with user_id, exp
# Any API pod validates signature + loads orders from DB
# No affinity required`,
    },
    {
      type: 'paragraph',
      text: 'Shopping cart stored only in Tomcat session on server 3: user gets empty cart when load balancer sends next request to server 4. Fix: store cart in Redis keyed by user_id or use signed client token + DB.',
    },
  ],
  tradeoffs: {
    advantages: [
      'Stateless: simple failover, elastic scale, rolling deploys',
      'Stateful: low-latency local memory, natural for streaming/real-time partitions',
    ],
    disadvantages: [
      'Stateless: extra round-trip to shared store; token size limits',
      'Stateful: hard ops (resharding), uneven load, complex recovery',
    ],
    alternatives: ['Sticky sessions + external session store (middle ground)', 'CRDT/sync for movable state'],
    whenToUse: [
      'Stateless: default for REST/microservices',
      'Stateful: partition-owned workloads (stream processing, game rooms, Raft leader)',
    ],
    whenNotToUse: [
      'In-memory session on web tier at scale',
      'Forced statelessness for latency-critical local aggregation without plan',
    ],
  },
  failureModes: [
    'Session loss on pod restart without external store',
    'Sticky session overload on one node (hot user)',
    'Shard migration downtime during rebalance',
    'Assuming JWT stateless but storing revocation only in one pod\'s memory',
  ],
  production: {
    reliability: ['Externalize sessions; graceful drain on deploy', 'Health checks remove bad instances from LB pool'],
    scalability: ['Stateless HPA; stateful use partition count + rebalance tooling'],
    security: ['Short-lived tokens; refresh rotation; server-side session invalidation list in Redis'],
    observability: ['Affinity skew metrics; session store latency', 'Shard balance dashboards'],
    maintainability: ['Document which components are stateful and recovery steps'],
  },
  interview: {
    expectations: ['Define stateless REST', 'Explain sticky sessions problem', 'When stateful is OK'],
    commonQuestions: ['JWT vs server session?', 'Design WebSocket at scale?'],
    followUps: ['How drain connections on deploy?', 'Consistent hashing for stateful shards?'],
    misconceptions: ['JWT means fully stateless auth always', 'All microservices must be stateless including databases'],
    traps: ['Scaling pods without moving in-memory cart state'],
    strongSignals: ['Shared Redis session', 'Partition assignment + persistence', 'Graceful shutdown hooks'],
  },
  keyTakeaways: [
    'Stateless servers: any instance, context in request + shared store.',
    'Stateful: data bound to node/partition — plan failover and rebalance.',
    'Default web/API tier stateless; externalize sessions.',
    'Sticky sessions are a crutch — prefer centralized session store.',
    'Stream/DB leaders are intentionally stateful with consensus.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'What makes a REST API stateless?', answerHint: 'Server does not rely on local memory of prior requests; auth/context in each call.' },
    { level: 'intermediate', question: 'Problems with sticky sessions?', answerHint: 'Uneven load, lost session on node failure, harder scale-in.' },
    { level: 'advanced', question: 'Scale real-time game rooms?', answerHint: 'Shard by room_id, consistent hash, persist state, migrate on node loss.' },
  ],
  flashcards: [
    { front: 'Stateless service', back: 'Any instance can serve request; state in external store or token' },
    { front: 'Sticky session risk', back: 'Load imbalance and session loss on node failure' },
    { front: 'Stateful example', back: 'Kafka partition leader, WebSocket room host, DB primary' },
    { front: 'Session fix', back: 'Redis/DB session store or JWT + short TTL' },
  ],
  quickRevision: [
    'Stateless = interchangeable pods',
    'Externalize session/cart',
    'JWT not magic — revocation needs store',
    'Stateful needs shard + recovery',
    'Drain on deploy',
  ],
  systemDesign: {
    problem: 'Design a multi-region checkout API that scales horizontally without losing cart state on deploy or failover.',
    requirements: {
      functional: ['Add/view cart', 'Checkout', 'Login optional guest cart merge'],
      nonFunctional: ['Stateless API tier', 'Survive AZ loss', 'Sub-100ms cart read p99'],
    },
    scaleAssumptions: ['50k RPS reads', '2k RPS writes', '10M active carts'],
    capacityEstimates: ['~1KB/cart × 10M ≈ 10 GB Redis working set with TTL'],
    api: [{ type: 'code', language: 'http', code: `GET /v1/carts/{cart_id}\nPUT /v1/carts/{cart_id}/items\nHeader: Authorization or X-Guest-Token` }],
    dataModel: [{ type: 'list', items: ['Redis: cart:{id} → items JSON + version', 'Postgres orders on checkout only'] }],
    highLevelArchitecture: [
      { type: 'paragraph', text: 'Stateless API pods behind LB; all cart state in Redis cluster; checkout writes to Postgres with idempotency key.' },
    ],
    diagram: {
      mermaid: `flowchart LR
  Client --> LB
  LB --> API1[API pod]
  LB --> API2[API pod]
  API1 --> Redis[(Redis cluster)]
  API2 --> Redis
  API1 --> PG[(Postgres orders)]`,
      caption: 'Stateless compute; durable cart in shared store',
    },
    dataFlow: ['Read/write cart via Redis', 'Checkout: read cart, transactional order insert, delete cart key'],
    storage: ['Redis primary cart; Postgres orders of record'],
    caching: ['Cart is hot data in Redis with 7d TTL sliding'],
    asyncProcessing: ['Abandoned cart emails via queue'],
    scaling: ['HPA API pods; Redis cluster shards by cart_id hash'],
    consistency: ['Cart eventual OK; checkout strong on Postgres'],
    reliability: ['Redis replication; API any-AZ', 'Idempotent checkout'],
    failureScenarios: ['Pod kill — no data loss; Redis failover — brief retry'],
    security: ['Cart_id unguessable UUID; auth merge on login'],
    observability: ['Redis latency, cart op RPS, checkout errors'],
    bottlenecks: ['Hot promotional SKU updates — version field on cart'],
    alternatives: ['Client-side cart + sync on login (more complex conflict)'],
    tradeoffs: ['Redis cost vs in-memory on app (not stateless)'],
    interviewFollowUps: ['Guest to logged-in merge?', 'Redis down behavior?'],
    evolution: [
      { stage: '1. Simple design', description: 'In-memory cart on single server.', bottleneck: 'Cannot scale or deploy.' },
      { stage: '2. Improve', description: 'Sticky sessions to same server.', bottleneck: 'Hot nodes, failover loss.' },
      { stage: '3. Improve', description: 'Redis + stateless API.', bottleneck: 'Redis memory.' },
      { stage: '4. Scale further', description: 'Redis cluster, regional caches with merge on checkout.', bottleneck: 'Cross-region cart if needed.' },
    ],
  },
}
