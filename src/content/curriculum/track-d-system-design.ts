import type { Priority } from '@/domain/types'
import type { SectionSeed, TopicSeed } from './build'

const M35 = [3, 5]
const M56 = [5, 6]
const M68 = [6, 8]

function item(
  id: string,
  title: string,
  priority: Priority = 'tier1',
  extra: Partial<TopicSeed> = {},
): TopicSeed {
  const { tags, executionPriority, months, ...rest } = extra
  return {
    id,
    title,
    priority,
    months: months ?? (priority === 'tier1' ? M35 : priority === 'tier2' ? M56 : M68),
    tags: ['system-design', ...(tags ?? [])],
    executionPriority:
      executionPriority ?? (priority === 'tier1' ? 'p0' : priority === 'tier2' ? 'p1' : 'later'),
    ...rest,
  }
}

function nest(
  parent: string,
  id: string,
  title: string,
  priority: Priority = 'tier1',
  extra: Partial<TopicSeed> = {},
): TopicSeed {
  return item(id, title, priority, {
    ...extra,
    curriculumLevel: 'nested-concept',
    parentTopicId: parent,
  })
}

function section(
  id: string,
  title: string,
  order: number,
  topics: TopicSeed[],
  kind: SectionSeed['defaultKind'] = 'theory',
): SectionSeed {
  return {
    id,
    track: 'D',
    title,
    order,
    defaultKind: kind,
    defaultDepth: 'deep',
    topics,
  }
}

/**
 * D4–D10 — comprehensive HLD and distributed-systems curriculum.
 * Existing topic IDs remain stable. New atomic concepts use generated deep
 * study scaffolds until promoted to dedicated hand-authored modules.
 *
 * Shaped from roadmap.sh, GeeksforGeeks, System Design Handbook, TakeUForward,
 * ByteByteGo's scale journey, DDIA/SRE practice, and real interview workflow.
 */
export const TRACK_D_SYSTEM_DESIGN_SECTIONS: SectionSeed[] = [
  section('D4.1', 'System Design Foundations, HLD & LLD Boundaries', 4, [
    item('d4-system-design-foundations', 'System Design Foundations'),
    nest('d4-system-design-foundations', 'd4-what-is-system-design', 'What System Design Is'),
    nest('d4-system-design-foundations', 'd4-hld-vs-lld', 'High-Level vs Low-Level Design'),
    nest('d4-system-design-foundations', 'd4-components-data-flow', 'Components, Interfaces & Data Flow'),
    nest('d4-system-design-foundations', 'd4-design-goals', 'Scalability, Reliability, Performance & Maintainability'),
    nest('d4-system-design-foundations', 'd4-design-for-requirements', 'Design for Requirements, Not Buzzwords'),
  ]),

  section('D4.2', 'Requirements, Constraints & Trade-offs', 5, [
    item('d4-design-constraints', 'Requirements & Constraints'),
    nest('d4-design-constraints', 'd4-functional-requirements', 'Functional Requirements'),
    nest('d4-design-constraints', 'd4-non-functional-requirements', 'Non-Functional Requirements & SLOs'),
    nest('d4-design-constraints', 'd4-workload-shape', 'Read/Write Mix, Access Patterns & Data Shape'),
    nest('d4-design-constraints', 'd4-latency-freshness-cost', 'Latency, Freshness, Availability & Cost Trade-offs'),
    nest('d4-design-constraints', 'd4-scope-assumptions', 'Scope, Assumptions & Explicit Non-Goals'),
  ]),

  section('D4.3', 'Scale from One Server to Millions', 6, [
    item('d4-scale-journey', 'Scale from One Server to Millions'),
    nest('d4-scale-journey', 'd4-single-server', 'Single-Server Baseline'),
    nest('d4-scale-journey', 'd4-separate-web-data-tier', 'Separate Web & Data Tiers'),
    nest('d4-scale-journey', 'd4-horizontal-vs-vertical', 'Horizontal vs Vertical Scaling'),
    nest('d4-scale-journey', 'd4-stateless-vs-stateful', 'Stateless vs Stateful Services'),
    nest('d4-scale-journey', 'd4-redundancy-every-tier', 'Redundancy at Every Tier'),
    nest('d4-scale-journey', 'd4-multi-datacenter-evolution', 'Multi-Datacenter Evolution', 'tier2'),
  ]),

  section('D4.4', 'Latency, Throughput & Performance Budgets', 7, [
    item('d4-performance-fundamentals', 'Latency & Throughput'),
    nest('d4-performance-fundamentals', 'd4-latency-percentiles', 'p50, p95, p99 & Tail Latency'),
    nest('d4-performance-fundamentals', 'd4-throughput-concurrency', 'Throughput, Concurrency & Utilization'),
    nest('d4-performance-fundamentals', 'd4-queueing-saturation', 'Queueing, Saturation & Little’s Law'),
    nest('d4-performance-fundamentals', 'd4-memory-vs-latency', 'Memory vs Latency'),
    nest('d4-performance-fundamentals', 'd4-batching-compression', 'Batching, Compression & Fewer Round Trips'),
  ]),

  section('D4.5', 'Load Balancing, Proxies & Traffic Routing', 8, [
    item('d4-load-balancing', 'Load Balancing', 'tier1', { related: ['c4-load-balancers'] }),
    nest('d4-load-balancing', 'd4-l4-vs-l7', 'Layer 4 vs Layer 7 Load Balancing'),
    nest('d4-load-balancing', 'd4-lb-algorithms', 'Round Robin, Least Connections & Weighted Routing'),
    nest('d4-load-balancing', 'd4-health-check-routing', 'Health Checks & Failure Removal'),
    nest('d4-load-balancing', 'd4-sticky-sessions', 'Sticky Sessions & Why Stateless Is Easier'),
    nest('d4-load-balancing', 'd4-forward-reverse-proxy', 'Forward vs Reverse Proxy'),
    nest('d4-load-balancing', 'd4-geo-dns-routing', 'GeoDNS, Anycast & Global Routing', 'tier2'),
  ]),

  section('D4.6', 'Availability, Reliability & Failure Models', 9, [
    item('d4-availability', 'Availability'),
    nest('d4-availability', 'd4-reliability-vs-availability', 'Reliability vs Availability'),
    nest('d4-availability', 'd4-failure-modes', 'Crash, Omission, Timing & Byzantine Failures'),
    nest('d4-availability', 'd4-partial-failure', 'Partial Failure Is the Default'),
    nest('d4-availability', 'd4-spof', 'Single Points of Failure'),
    nest('d4-availability', 'd4-fault-tolerance', 'Fault Tolerance, Redundancy & Graceful Degradation'),
    nest('d4-availability', 'd4-availability-math', 'Availability Math & Dependency Composition'),
  ]),

  section('D4.7', 'CAP, PACELC & Consistency Models', 10, [
    item('d4-cap', 'CAP Theorem'),
    nest('d4-cap', 'd4-consistency', 'Consistency'),
    nest('d4-cap', 'd4-strong-consistency', 'Strong vs Eventual Consistency'),
    nest('d4-cap', 'd4-eventual-consistency', 'Eventual Consistency', 'tier1', {
      related: ['c12-eventual-consistency'],
    }),
    nest('d4-cap', 'd4-pacelc', 'PACELC: Partition and Normal-Operation Trade-offs'),
    nest('d4-cap', 'd4-session-guarantees', 'Read-Your-Writes, Monotonic Reads & Session Guarantees'),
    nest('d4-cap', 'd4-causal-consistency', 'Causal Consistency', 'tier2'),
    nest('d4-cap', 'd4-linearizability-serializability', 'Linearizability vs Serializability', 'tier2'),
  ]),

  section('D4.8', 'Replication, Leaders & Quorums', 11, [
    item('d4-replication', 'Replication', 'tier1', { related: ['c7-replication'] }),
    nest('d4-replication', 'd4-leader-follower', 'Leader/Follower Architecture'),
    nest('d4-replication', 'd4-sync-async-replication', 'Synchronous vs Asynchronous Replication'),
    nest('d4-replication', 'd4-single-multi-leader', 'Single-Leader vs Multi-Leader'),
    nest('d4-replication', 'd4-quorums', 'Read/Write Quorums'),
    nest('d4-replication', 'd4-replication-lag', 'Replication Lag & Stale Reads'),
    nest('d4-replication', 'd4-conflict-resolution', 'Conflict Detection & Resolution', 'tier2'),
  ]),

  section('D4.9', 'Partitioning, Sharding & Consistent Hashing', 12, [
    item('d4-partitioning', 'Partitioning & Sharding'),
    nest('d4-partitioning', 'd4-range-hash-partitioning', 'Range vs Hash Partitioning'),
    nest('d4-partitioning', 'd4-shard-key-selection', 'Choosing a Shard / Partition Key'),
    nest('d4-partitioning', 'd4-hot-partitions', 'Hot Keys, Celebrity Problem & Skew'),
    nest('d4-partitioning', 'd4-resharding', 'Resharding & Online Data Movement'),
    nest('d4-partitioning', 'd4-consistent-hashing', 'Consistent Hashing'),
    nest('d4-partitioning', 'd4-virtual-nodes', 'Virtual Nodes & Bounded Loads', 'tier2'),
    nest('d4-partitioning', 'd4-cross-shard-queries', 'Cross-Shard Queries, Joins & Transactions', 'tier2'),
  ]),

  section('D4.10', 'Distributed Time, Ordering & Consensus', 13, [
    item('d4-consensus', 'Consensus Concepts'),
    nest('d4-consensus', 'd4-distributed-time', 'Distributed Clock & Time Issues'),
    nest('d4-consensus', 'd4-logical-clocks', 'Lamport & Vector Clocks', 'tier2'),
    nest('d4-consensus', 'd4-total-partial-order', 'Total vs Partial Ordering', 'tier2'),
    nest('d4-consensus', 'd4-leader-election', 'Leader Election'),
    nest('d4-consensus', 'd4-gossip', 'Gossip Protocols'),
    nest('d4-consensus', 'd4-raft', 'Raft Details', 'tier3'),
    nest('d4-consensus', 'd4-split-brain-fencing', 'Split Brain, Leases & Fencing Tokens', 'tier2'),
  ]),

  section('D4.11', 'Delivery Semantics & Idempotency', 14, [
    item('d4-idempotency', 'Idempotency in Distributed Systems', 'tier1', {
      related: ['c12-idempotency'],
    }),
    nest('d4-idempotency', 'd4-delivery-semantics', 'At-Most, At-Least & Effectively-Once Delivery'),
    nest('d4-idempotency', 'd4-deduplication', 'Deduplication Keys & Inbox Tables'),
    nest('d4-idempotency', 'd4-retries-side-effects', 'Retries and Non-Idempotent Side Effects'),
    nest('d4-idempotency', 'd4-ordering-duplicates', 'Ordering, Duplicates & Consumer Correctness'),
    nest('d4-idempotency', 'd4-exactly-once-scope', 'Why “Exactly Once” Has a Scope'),
  ]),

  section('D4.12', 'Distributed Transactions & Workflows', 15, [
    item('d4-distributed-transactions', 'Distributed Transactions', 'tier1', {
      related: ['c11-outbox', 'c11-saga'],
    }),
    nest('d4-distributed-transactions', 'd4-2pc', 'Two-Phase Commit'),
    nest('d4-distributed-transactions', 'd4-saga', 'Saga: Orchestration vs Choreography', 'tier2', {
      related: ['c11-saga'],
    }),
    nest('d4-distributed-transactions', 'd4-outbox-cdc', 'Transactional Outbox & CDC'),
    nest('d4-distributed-transactions', 'd4-compensation', 'Compensation & Semantic Rollback'),
    nest('d4-distributed-transactions', 'd4-workflow-engines', 'Durable Workflow Engines', 'tier2'),
  ]),

  section('D5.1', 'Data Modeling & Access-Pattern-First Design', 16, [
    item('d5-data-modeling', 'Data Modeling for Systems'),
    nest('d5-data-modeling', 'd5-entities-relationships', 'Entities, Relationships & Invariants'),
    nest('d5-data-modeling', 'd5-access-patterns', 'Model from Access Patterns'),
    nest('d5-data-modeling', 'd5-normalization-denormalization', 'Normalization vs Denormalization'),
    nest('d5-data-modeling', 'd5-secondary-indexes', 'Secondary Indexes & Write Amplification'),
    nest('d5-data-modeling', 'd5-data-lifecycle', 'Retention, Archival, Deletion & Compliance'),
    nest('d5-data-modeling', 'd5-retention', 'Data Retention Policies'),
  ]),

  section('D5.2', 'SQL, NoSQL & Database Selection', 17, [
    item('d5-sql-vs-nosql', 'SQL vs NoSQL'),
    nest('d5-sql-vs-nosql', 'd5-relational', 'Relational Databases', 'tier1', {
      related: ['c7-schema-design'],
    }),
    nest('d5-sql-vs-nosql', 'd5-key-value', 'Key-Value Stores', 'tier1', {
      related: ['c10-data-structures'],
    }),
    nest('d5-sql-vs-nosql', 'd5-document', 'Document Databases'),
    nest('d5-sql-vs-nosql', 'd5-wide-column', 'Wide-Column Stores'),
    nest('d5-sql-vs-nosql', 'd5-graph-databases', 'Graph Databases', 'tier2'),
    nest('d5-sql-vs-nosql', 'd5-polyglot-persistence', 'Polyglot Persistence & Its Cost', 'tier2'),
  ]),

  section('D5.3', 'Database Replication & Read Scaling', 18, [
    item('d5-db-replication', 'Database Replication', 'tier1', { related: ['d4-replication'] }),
    nest('d5-db-replication', 'd5-read-replicas', 'Read Replicas'),
    nest('d5-db-replication', 'd5-read-after-write', 'Read-After-Write Routing'),
    nest('d5-db-replication', 'd5-replica-failover', 'Failover, Promotion & Data Loss Windows'),
    nest('d5-db-replication', 'd5-multi-region-replication', 'Cross-Region Replication', 'tier2'),
  ]),

  section('D5.4', 'Database Partitioning & Sharding', 19, [
    item('d5-sharding', 'Database Sharding', 'tier1', { related: ['d4-partitioning'] }),
    nest('d5-sharding', 'd5-data-partitioning', 'Data Partitioning'),
    nest('d5-sharding', 'd5-hot-partitions', 'Hot Partitions'),
    nest('d5-sharding', 'd5-shard-router', 'Shard Routing & Metadata'),
    nest('d5-sharding', 'd5-global-secondary-index', 'Global Secondary Indexes', 'tier2'),
    nest('d5-sharding', 'd5-online-migrations', 'Online Schema & Shard Migrations', 'tier2'),
  ]),

  section('D5.5', 'Block, File & Object Storage', 20, [
    item('d5-object-storage', 'Blob & Object Storage', 'tier1', { related: ['c15-s3'] }),
    nest('d5-object-storage', 'd5-block-file-object', 'Block vs File vs Object Storage'),
    nest('d5-object-storage', 'd5-object-metadata', 'Objects, Metadata & Immutable Blobs'),
    nest('d5-object-storage', 'd5-presigned-upload', 'Pre-Signed Upload / Download Flows'),
    nest('d5-object-storage', 'd5-large-file-multipart', 'Multipart Uploads, Chunking & Checksums'),
    nest('d5-object-storage', 'd5-storage-durability', 'Durability, Replication & Erasure Coding', 'tier2'),
  ]),

  section('D5.6', 'Caching Architecture & Invalidation', 21, [
    item('d5-caching', 'Caching', 'tier1', { related: ['c10-cache-aside'] }),
    nest('d5-caching', 'd5-local-distributed-cache', 'Local vs Distributed Cache'),
    nest('d5-caching', 'd5-cache-aside-read-through', 'Cache-Aside, Read-Through & Write-Through'),
    nest('d5-caching', 'd5-write-back-cache', 'Write-Back / Write-Behind', 'tier2'),
    nest('d5-caching', 'd5-eviction-policies', 'LRU, LFU, FIFO & TTL'),
    nest('d5-caching', 'd5-cache-invalidation', 'Invalidation, Versioned Keys & Freshness'),
    nest('d5-caching', 'd5-cache-stampede', 'Stampede, Penetration & Hot Keys'),
    nest('d5-caching', 'd5-cold-warm-cache', 'Cold Starts, Warming & Precomputation'),
  ]),

  section('D5.7', 'CDN & Edge Delivery', 22, [
    item('d5-cdn', 'Content Delivery Networks'),
    nest('d5-cdn', 'd5-edge-origin', 'Edge PoPs, Origins & Cache Keys'),
    nest('d5-cdn', 'd5-cdn-ttl-invalidation', 'TTL, Invalidation & Versioned Assets'),
    nest('d5-cdn', 'd5-static-dynamic-cdn', 'Static vs Dynamic Content Caching'),
    nest('d5-cdn', 'd5-cdn-fallback', 'Origin Shielding & CDN Failure Fallback'),
    nest('d5-cdn', 'd5-edge-compute', 'Edge Compute & Personalization', 'tier2'),
  ]),

  section('D5.8', 'Queues, Pub/Sub & Async Work', 23, [
    item('d5-queues', 'Message Queues'),
    nest('d5-queues', 'd5-queue-vs-pubsub', 'Queue vs Publish/Subscribe'),
    nest('d5-queues', 'd5-producer-consumer', 'Producer, Broker & Consumer'),
    nest('d5-queues', 'd5-load-buffering', 'Load Leveling & Backpressure Buffer'),
    nest('d5-queues', 'd5-ack-visibility-dlq', 'Acknowledgements, Visibility Timeout & DLQ'),
    nest('d5-queues', 'd5-ordering-partitions', 'Ordering, Partitions & Consumer Groups'),
    nest('d5-queues', 'd5-poison-replay', 'Poison Messages, Retry & Replay'),
  ]),

  section('D5.9', 'Event Streams & Data Pipelines', 24, [
    item('d5-streams', 'Event Streams', 'tier1', { related: ['c11-eda'] }),
    nest('d5-streams', 'd5-log-vs-queue', 'Append-Only Log vs Queue'),
    nest('d5-streams', 'd5-event-streaming', 'Event Streaming & Consumer Offsets'),
    nest('d5-streams', 'd5-batch-vs-stream', 'Batch vs Stream Processing'),
    nest('d5-streams', 'd5-event-sourcing', 'Event Sourcing vs Event Streaming', 'tier2'),
    nest('d5-streams', 'd5-cdc-materialized-views', 'CDC & Materialized Views', 'tier2'),
    nest('d5-streams', 'd5-lambda-kappa', 'Lambda vs Kappa Architecture', 'tier3'),
  ]),

  section('D5.10', 'Search, Indexes & Probabilistic Structures', 25, [
    item('d5-search', 'Search Systems'),
    nest('d5-search', 'd5-inverted-index', 'Inverted Index'),
    nest('d5-search', 'd5-trie-autocomplete', 'Tries & Prefix Search'),
    nest('d5-search', 'd5-search-ranking', 'Retrieval, Ranking & Relevance'),
    nest('d5-search', 'd5-bloom-filter', 'Bloom Filters'),
    nest('d5-search', 'd5-search-indexing-pipeline', 'Indexing Pipeline & Near-Real-Time Refresh'),
    nest('d5-search', 'd5-search-sharding', 'Search Sharding & Replication', 'tier2'),
  ]),

  section('D6.1', 'API Contracts & Protocol Selection', 26, [
    item('d6-api-foundations', 'API Design Foundations'),
    nest('d6-api-foundations', 'd6-rest', 'REST', 'tier1', { related: ['c4-rest'] }),
    nest('d6-api-foundations', 'd6-grpc', 'gRPC', 'tier2', { related: ['c4-grpc'] }),
    nest('d6-api-foundations', 'd6-graphql', 'GraphQL Concepts', 'tier2'),
    nest('d6-api-foundations', 'd6-rest-vs-grpc-vs-graphql', 'REST vs gRPC vs GraphQL'),
    nest('d6-api-foundations', 'd6-sync-vs-async-api', 'Synchronous vs Asynchronous APIs'),
  ]),

  section('D6.2', 'Resource Modeling, Errors & Compatibility', 27, [
    item('d6-resource-modelling', 'Resource Modeling'),
    nest('d6-resource-modelling', 'd6-versioning', 'API Versioning & Evolution'),
    nest('d6-resource-modelling', 'd6-error-modelling', 'Error Modeling'),
    nest('d6-resource-modelling', 'd6-backward-compatibility', 'Backward & Forward Compatibility'),
    nest('d6-resource-modelling', 'd6-schema-contracts', 'Schema Contracts & Validation'),
    nest('d6-resource-modelling', 'd6-partial-failures-api', 'Partial Success & Bulk APIs', 'tier2'),
  ]),

  section('D6.3', 'Pagination, Filtering & Large Results', 28, [
    item('d6-pagination', 'Pagination'),
    nest('d6-pagination', 'd6-offset-vs-cursor', 'Offset vs Cursor / Keyset Pagination'),
    nest('d6-pagination', 'd6-filtering', 'Filtering & Sorting'),
    nest('d6-pagination', 'd6-sorting', 'Stable Sort Keys'),
    nest('d6-pagination', 'd6-pagination-consistency', 'Pagination under Concurrent Writes'),
    nest('d6-pagination', 'd6-export-jobs', 'Async Exports for Huge Result Sets', 'tier2'),
  ]),

  section('D6.4', 'Real-Time Communication', 29, [
    item('d6-websockets', 'WebSockets', 'tier2', { related: ['b3-websockets'] }),
    nest('d6-websockets', 'd6-sse', 'Server-Sent Events', 'tier2', { related: ['b3-sse'] }),
    nest('d6-websockets', 'd6-polling-long-polling', 'Polling vs Long Polling'),
    nest('d6-websockets', 'd6-websocket-scaling', 'Connection Gateways, Fan-out & Presence'),
    nest('d6-websockets', 'd6-reconnect-resume', 'Reconnect, Resume Tokens & Missed Events', 'tier2'),
  ]),

  section('D6.5', 'API Gateway, Security & Rate Limiting', 30, [
    item('d6-api-edge', 'API Gateway & Edge Controls'),
    nest('d6-api-edge', 'd6-authentication', 'Authentication & Authorization', 'tier1', {
      related: ['c9-authentication'],
    }),
    nest('d6-api-edge', 'd6-rate-limiting', 'Rate Limiting', 'tier1', {
      related: ['d10-rate-limiter'],
    }),
    nest('d6-api-edge', 'd6-idempotency', 'Idempotency Keys', 'tier1', {
      related: ['c12-idempotency'],
    }),
    nest('d6-api-edge', 'd6-gateway-vs-load-balancer', 'API Gateway vs Load Balancer'),
    nest('d6-api-edge', 'd6-request-validation-waf', 'Validation, Quotas & WAF'),
  ]),

  section('D6.6', 'Service Communication & Discovery', 31, [
    item('d6-service-communication', 'Service Communication'),
    nest('d6-service-communication', 'd6-service-discovery', 'Service Discovery & Registration'),
    nest('d6-service-communication', 'd6-client-server-discovery', 'Client-Side vs Server-Side Discovery'),
    nest('d6-service-communication', 'd6-heartbeats-leases', 'Heartbeats, Leases & Health'),
    nest('d6-service-communication', 'd6-service-mesh', 'Service Mesh & Sidecars', 'tier2'),
    nest('d6-service-communication', 'd6-contract-testing', 'Consumer-Driven Contract Testing', 'tier2'),
  ]),

  section('D7.1', 'Architecture Styles & Service Boundaries', 32, [
    item('d7-architecture-styles', 'Architecture Styles'),
    nest('d7-architecture-styles', 'd7-monolith-modular-monolith', 'Monolith & Modular Monolith'),
    nest('d7-architecture-styles', 'd7-microservices', 'Microservices'),
    nest('d7-architecture-styles', 'd7-monolith-vs-microservices', 'Monolith vs Microservices Trade-offs'),
    nest('d7-architecture-styles', 'd7-event-driven', 'Event-Driven Architecture'),
    nest('d7-architecture-styles', 'd7-serverless', 'Serverless Architecture'),
    nest('d7-architecture-styles', 'd7-boundaries-conways-law', 'Service Boundaries & Conway’s Law', 'tier2'),
    nest('d7-architecture-styles', 'd7-strangler-migration', 'Strangler Migration from Monolith', 'tier2'),
  ]),

  section('D7.2', 'Caching Strategy at System Scale', 33, [
    item('d7-caching-strategies', 'Caching Strategies', 'tier1', {
      related: ['c10-cache-aside'],
    }),
    nest('d7-caching-strategies', 'd7-cache-invalidation', 'Cache Invalidation', 'tier1', {
      related: ['c10-invalidation'],
    }),
    nest('d7-caching-strategies', 'd7-multi-layer-cache', 'Browser, CDN, Service & Database Caches'),
    nest('d7-caching-strategies', 'd7-cache-consistency', 'Cache Consistency & Write Policies'),
    nest('d7-caching-strategies', 'd7-cache-failure', 'Cache Failure, Stampede & Bypass'),
  ]),

  section('D7.3', 'Overload Protection & Backpressure', 34, [
    item('d7-overload-control', 'Overload Control'),
    nest('d7-overload-control', 'd7-rate-limiting', 'Distributed Rate Limiting', 'tier1', {
      related: ['d10-rate-limiter'],
    }),
    nest('d7-overload-control', 'd7-load-shedding', 'Load Shedding'),
    nest('d7-overload-control', 'd7-backpressure', 'Backpressure', 'tier1', {
      related: ['c12-backpressure'],
    }),
    nest('d7-overload-control', 'd7-bounded-queues', 'Bounded Queues & Admission Control'),
    nest('d7-overload-control', 'd7-priority-fairness', 'Priority, Fairness & Tenant Isolation', 'tier2'),
  ]),

  section('D7.4', 'Timeouts, Retries & Circuit Breakers', 35, [
    item('d7-failure-containment', 'Failure Containment'),
    nest('d7-failure-containment', 'd7-timeouts-deadlines', 'Timeouts & Deadline Propagation'),
    nest('d7-failure-containment', 'd7-retry-strategies', 'Retries, Backoff & Jitter', 'tier1', {
      related: ['c12-retries'],
    }),
    nest('d7-failure-containment', 'd7-circuit-breakers', 'Circuit Breakers', 'tier1', {
      related: ['c12-circuit-breakers'],
    }),
    nest('d7-failure-containment', 'd7-bulkheads', 'Bulkheads & Failure Domains'),
    nest('d7-failure-containment', 'd7-cascading-failures', 'Cascading Failure Analysis'),
    nest('d7-failure-containment', 'd7-fallbacks', 'Fallbacks & Graceful Degradation'),
  ]),

  section('D7.5', 'High Availability, Failover & Disaster Recovery', 36, [
    item('d7-high-availability', 'High Availability'),
    nest('d7-high-availability', 'd7-spof', 'Single Points of Failure'),
    nest('d7-high-availability', 'd7-redundancy', 'Redundancy'),
    nest('d7-high-availability', 'd7-failover', 'Failover'),
    nest('d7-high-availability', 'd7-disaster-recovery', 'Disaster Recovery'),
    nest('d7-high-availability', 'd7-rto-rpo', 'RTO, RPO, Backups & Restore Testing'),
    nest('d7-high-availability', 'd7-active-active-passive', 'Active/Active vs Active/Passive', 'tier2'),
  ]),

  section('D7.6', 'SLIs, SLOs & Production Readiness', 37, [
    item('d7-sli', 'SLI, SLO & SLA Concepts'),
    nest('d7-sli', 'd7-slo', 'Service-Level Objectives'),
    nest('d7-sli', 'd7-sla', 'Service-Level Agreements'),
    nest('d7-sli', 'd7-availability-calc', 'Availability Calculations'),
    nest('d7-sli', 'd7-error-budgets', 'Error Budgets & Release Policy'),
    nest('d7-sli', 'd7-golden-signals', 'Latency, Traffic, Errors & Saturation'),
    nest('d7-sli', 'd7-production-readiness', 'Production Readiness Review & Runbooks'),
  ]),

  section('D7.7', 'Multi-Region Architecture', 38, [
    item('d7-multi-region', 'Multi-Region Architecture', 'tier2'),
    nest('d7-multi-region', 'd7-global-traffic', 'Global Traffic Routing & Locality', 'tier2'),
    nest('d7-multi-region', 'd7-data-residency', 'Data Residency & Sovereignty', 'tier2'),
    nest('d7-multi-region', 'd7-cross-region-data', 'Cross-Region Replication & Conflict Handling', 'tier2'),
    nest('d7-multi-region', 'd7-region-evacuation', 'Region Evacuation & Failover Drills', 'tier2'),
    nest('d7-multi-region', 'd7-cell-architecture', 'Cell-Based Architecture', 'tier3'),
  ]),

  section('D7.8', 'Security, Privacy, Cost & Sustainability', 39, [
    item('d7-nonfunctional-architecture', 'Cross-Cutting Architecture Concerns', 'tier2'),
    nest('d7-nonfunctional-architecture', 'd7-threat-modeling', 'Threat Modeling & Trust Boundaries', 'tier2'),
    nest('d7-nonfunctional-architecture', 'd7-zero-trust', 'Zero Trust & Least Privilege', 'tier2'),
    nest('d7-nonfunctional-architecture', 'd7-encryption-key-management', 'Encryption & Key Management', 'tier2'),
    nest('d7-nonfunctional-architecture', 'd7-privacy-deletion', 'Privacy, Retention & Right to Delete', 'tier2'),
    nest('d7-nonfunctional-architecture', 'd7-cost-performance', 'Cost vs Performance Optimization', 'tier2'),
    nest('d7-nonfunctional-architecture', 'd7-sustainability', 'Sustainability & Resource Efficiency', 'tier3'),
  ]),

  section('D8.1', 'Back-of-the-Envelope Estimation Method', 40, [
    item('d8-estimation-method', 'Back-of-the-Envelope Estimation'),
    nest('d8-estimation-method', 'd8-powers-of-two', 'Powers of Two, Time & Latency Numbers'),
    nest('d8-estimation-method', 'd8-average-vs-peak', 'Average vs Peak & Safety Margins'),
    nest('d8-estimation-method', 'd8-assumption-driven-estimates', 'Assumption-Driven Estimates'),
    nest('d8-estimation-method', 'd8-order-of-magnitude', 'Order-of-Magnitude over False Precision'),
  ]),

  section('D8.2', 'Traffic, QPS & Concurrency Estimation', 41, [
    item('d8-qps', 'Requests per Second'),
    nest('d8-qps', 'd8-read-write-ratios', 'Read/Write Ratios'),
    nest('d8-qps', 'd8-dau-to-qps', 'DAU → Requests/Day → Average/Peak QPS'),
    nest('d8-qps', 'd8-concurrent-connections', 'Concurrent Connections'),
    nest('d8-qps', 'd8-fanout-amplification', 'Fan-out & Internal Request Amplification'),
  ]),

  section('D8.3', 'Storage, Bandwidth & Cache Estimation', 42, [
    item('d8-storage', 'Storage Estimation'),
    nest('d8-storage', 'd8-bandwidth', 'Bandwidth & Egress Estimation'),
    nest('d8-storage', 'd8-cache-sizing', 'Cache-Size Estimation'),
    nest('d8-storage', 'd8-db-growth', 'Database-Growth Estimation'),
    nest('d8-storage', 'd8-replication-overhead', 'Replication, Index & Metadata Overhead'),
    nest('d8-storage', 'd8-retention-tiers', 'Hot, Warm & Cold Retention Tiers'),
  ]),

  section('D8.4', 'Capacity Planning & Bottleneck Analysis', 43, [
    item('d8-server-requirements', 'Server & Capacity Requirements', 'tier2'),
    nest('d8-server-requirements', 'd8-cpu-memory-io', 'CPU, Memory, Disk I/O & Network Limits', 'tier2'),
    nest('d8-server-requirements', 'd8-utilization-headroom', 'Utilization Targets & Headroom', 'tier2'),
    nest('d8-server-requirements', 'd8-capacity-model', 'Capacity Model & Load-Test Validation', 'tier2'),
    nest('d8-server-requirements', 'd8-cost-envelope', 'Cost Envelope & Unit Economics', 'tier2'),
  ]),

  section('D9.1', 'The 45–60 Minute Interview Framework', 44, [
    item('d9-interview-framework', 'System Design Interview Framework'),
    nest('d9-interview-framework', 'd9-time-budget', 'Time Budget by Interview Phase'),
    nest('d9-interview-framework', 'd9-clarify-before-boxes', 'Clarify Before Drawing Boxes'),
    nest('d9-interview-framework', 'd9-top-down-iteration', 'Top-Down Design & Iterative Refinement'),
    nest('d9-interview-framework', 'd9-drive-collaboration', 'Drive the Interview Collaboratively'),
    nest('d9-interview-framework', 'd9-running-decisions', 'Maintain Assumptions & Decision Log'),
  ]),

  section('D9.2', 'Requirements & Scope in Interviews', 45, [
    item('d9-requirements', 'Requirements Gathering'),
    nest('d9-requirements', 'd9-functional', 'Functional Requirements'),
    nest('d9-requirements', 'd9-non-functional', 'Non-Functional Requirements'),
    nest('d9-requirements', 'd9-core-use-cases', 'Prioritize Core Use Cases'),
    nest('d9-requirements', 'd9-scale-geography', 'Scale, Geography & Tenant Model'),
    nest('d9-requirements', 'd9-consistency-latency-needs', 'Consistency, Latency & Availability Targets'),
  ]),

  section('D9.3', 'Estimation, APIs & Data Model in Interviews', 46, [
    item('d9-capacity', 'Capacity Estimation in Interviews', 'tier1', { related: ['d8-qps'] }),
    nest('d9-capacity', 'd9-api-design', 'API Design', 'tier1', { related: ['d6-rest'] }),
    nest('d9-capacity', 'd9-data-modelling', 'Data Modeling'),
    nest('d9-capacity', 'd9-estimate-only-decisions', 'Estimate What Changes the Design'),
    nest('d9-capacity', 'd9-api-idempotency-pagination', 'Idempotency, Pagination & Error Contracts'),
    nest('d9-capacity', 'd9-schema-access-patterns', 'Schema from Critical Access Patterns'),
  ]),

  section('D9.4', 'High-Level Architecture & Request Flows', 47, [
    item('d9-hla', 'High-Level Architecture'),
    nest('d9-hla', 'd9-critical-read-path', 'Critical Read Path'),
    nest('d9-hla', 'd9-critical-write-path', 'Critical Write Path'),
    nest('d9-hla', 'd9-sync-async-boundaries', 'Synchronous vs Asynchronous Boundaries'),
    nest('d9-hla', 'd9-component-responsibilities', 'Component Responsibilities & Ownership'),
    nest('d9-hla', 'd9-diagram-legibility', 'Diagram Legibility & Data-Flow Labels'),
  ]),

  section('D9.5', 'Deep Dives, Scaling & Failure Handling', 48, [
    item('d9-deep-dives', 'Component Deep Dives'),
    nest('d9-deep-dives', 'd9-scaling', 'Scaling the Bottleneck'),
    nest('d9-deep-dives', 'd9-reliability', 'Reliability & Failure Handling'),
    nest('d9-deep-dives', 'd9-failure-handling', 'What If This Node or Region Dies?'),
    nest('d9-deep-dives', 'd9-consistency', 'Consistency & Correctness'),
    nest('d9-deep-dives', 'd9-security', 'Security & Privacy'),
    nest('d9-deep-dives', 'd9-observability', 'Observability & Operations'),
  ]),

  section('D9.6', 'Trade-offs & Senior-Level Communication', 49, [
    item('d9-tradeoffs', 'Trade-off Analysis'),
    nest('d9-tradeoffs', 'd9-compare-alternatives', 'Compare Viable Alternatives'),
    nest('d9-tradeoffs', 'd9-residual-risk', 'Name Residual Risk & Revisit Triggers'),
    nest('d9-tradeoffs', 'd9-no-premature-complexity', 'Avoid Premature Microservices & Sharding'),
    nest('d9-tradeoffs', 'd9-defend-adapt', 'Defend Choices and Adapt to Pushback'),
    nest('d9-tradeoffs', 'd9-ownership-operations', 'Ownership, Migration & Operational Cost'),
  ]),

  section('D9.7', 'Mocks, Deliberate Practice & Company Calibration', 50, [
    item('d9-deliberate-practice', 'System Design Deliberate Practice', 'tier2'),
    nest('d9-deliberate-practice', 'd9-whiteboard-speed', 'Whiteboard / Excalidraw Fluency', 'tier2'),
    nest('d9-deliberate-practice', 'd9-mock-interviews', 'Timed Mock Interviews & Feedback', 'tier2'),
    nest('d9-deliberate-practice', 'd9-design-retrospective', 'Design Retrospective & Gap Log', 'tier2'),
    nest('d9-deliberate-practice', 'd9-multiple-solutions', 'Compare Multiple Solutions to One Problem', 'tier2'),
    nest('d9-deliberate-practice', 'd9-company-calibration', 'Company/Level-Specific Calibration', 'tier2'),
    nest('d9-deliberate-practice', 'd9-build-break-measure', 'Build, Scale, Measure, Break & Rebuild', 'tier2'),
  ]),

  section('D10.1', 'Design a URL Shortener', 51, [
    item('d10-url-shortener', 'URL Shortener'),
    nest('d10-url-shortener', 'd10-url-id-generation', 'ID Generation & Base62'),
    nest('d10-url-shortener', 'd10-url-read-heavy-cache', 'Read-Heavy Cache & Redirect Path'),
    nest('d10-url-shortener', 'd10-url-expiry-abuse', 'Expiry, Analytics & Abuse Prevention'),
  ], 'system-design'),

  section('D10.2', 'Design Pastebin', 52, [
    item('d10-pastebin', 'Pastebin'),
    nest('d10-pastebin', 'd10-paste-object-storage', 'Metadata DB + Object Storage'),
    nest('d10-pastebin', 'd10-paste-expiration', 'Expiration & Cleanup'),
    nest('d10-pastebin', 'd10-paste-hot-content', 'Hot Content & CDN'),
  ], 'system-design'),

  section('D10.3', 'Design a Distributed Rate Limiter', 53, [
    item('d10-rate-limiter', 'Distributed Rate Limiter', 'tier1', {
      tags: ['redis', 'reliability'],
      related: ['c10-rate-limiting', 'c12-rate-limiting', 'd3-rate-limiter-lld', 'd7-rate-limiting'],
      capstone: 'Protects booking and payment APIs from abuse; Redis token bucket for flash-sale traffic.',
    }),
    nest('d10-rate-limiter', 'd10-rate-limit-algorithms', 'Token Bucket, Leaky Bucket & Sliding Window'),
    nest('d10-rate-limiter', 'd10-rate-limit-distributed-state', 'Distributed Counters & Atomicity'),
    nest('d10-rate-limiter', 'd10-rate-limit-fail-open', 'Fail-Open vs Fail-Closed'),
  ], 'system-design'),

  section('D10.4', 'Design a Key-Value Store', 54, [
    item('d10-key-value-store', 'Distributed Key-Value Store'),
    nest('d10-key-value-store', 'd10-kv-partition-replication', 'Partitioning & Replication'),
    nest('d10-key-value-store', 'd10-kv-consistency', 'Consistency, Quorums & Conflict Resolution'),
    nest('d10-key-value-store', 'd10-kv-storage-engine', 'WAL, Memtable & SSTable Concepts', 'tier2'),
  ], 'system-design'),

  section('D10.5', 'Design a Unique ID Generator', 55, [
    item('d10-unique-id', 'Distributed Unique ID Generator'),
    nest('d10-unique-id', 'd10-id-uuid-snowflake', 'UUID vs Database Sequence vs Snowflake'),
    nest('d10-unique-id', 'd10-id-clock-node-sequence', 'Timestamp, Node & Sequence Bits'),
    nest('d10-unique-id', 'd10-id-clock-rollback', 'Clock Rollback & Worker-ID Coordination'),
  ], 'system-design'),

  section('D10.6', 'Design a Notification System', 56, [
    item('d10-notification-system', 'Notification System'),
    nest('d10-notification-system', 'd10-notification-channels', 'Email, SMS, Push & In-App Channels'),
    nest('d10-notification-system', 'd10-notification-priority-retry', 'Priority, Retry, DLQ & Deduplication'),
    nest('d10-notification-system', 'd10-notification-preferences', 'Preferences, Templates & Rate Limits'),
  ], 'system-design'),

  section('D10.7', 'Design a News Feed', 57, [
    item('d10-news-feed', 'Twitter / News Feed'),
    nest('d10-news-feed', 'd10-feed-fanout-write-read', 'Fan-out on Write vs Read'),
    nest('d10-news-feed', 'd10-feed-celebrity', 'Celebrity / Hot-Key Problem'),
    nest('d10-news-feed', 'd10-feed-ranking-pagination', 'Ranking, Cache & Cursor Pagination'),
  ], 'system-design'),

  section('D10.8', 'Design a Chat System', 58, [
    item('d10-chat', 'Chat System'),
    nest('d10-chat', 'd10-chat-websocket-gateway', 'WebSocket Gateways & Session Routing'),
    nest('d10-chat', 'd10-chat-ordering-delivery', 'Message Ordering, Delivery & Read Receipts'),
    nest('d10-chat', 'd10-chat-presence-offline', 'Presence, Offline Delivery & Multi-Device Sync'),
  ], 'system-design'),

  section('D10.9', 'Design Google Drive / Dropbox', 59, [
    item('d10-drive', 'Dropbox / Google Drive'),
    nest('d10-drive', 'd10-drive-chunking-dedup', 'Chunking, Deduplication & Multipart Upload'),
    nest('d10-drive', 'd10-drive-sync-conflicts', 'Change Sync & Conflict Resolution'),
    nest('d10-drive', 'd10-drive-metadata-blob', 'Metadata DB vs Blob Storage'),
  ], 'system-design'),

  section('D10.10', 'Design YouTube / Video Streaming', 60, [
    item('d10-youtube', 'YouTube / Video Streaming'),
    nest('d10-youtube', 'd10-video-upload-transcode', 'Upload, Transcode & Processing Pipeline'),
    nest('d10-youtube', 'd10-video-cdn-abr', 'CDN & Adaptive Bitrate Streaming'),
    nest('d10-youtube', 'd10-video-metadata-counter', 'Metadata, Views & Recommendation Boundaries'),
  ], 'system-design'),

  section('D10.11', 'Design Search Autocomplete', 61, [
    item('d10-autocomplete', 'Search Autocomplete'),
    nest('d10-autocomplete', 'd10-autocomplete-trie', 'Trie / Prefix Index & Top-K'),
    nest('d10-autocomplete', 'd10-autocomplete-ranking', 'Ranking, Freshness & Personalization'),
    nest('d10-autocomplete', 'd10-autocomplete-cache-shard', 'Caching, Sharding & Hot Prefixes'),
  ], 'system-design'),

  section('D10.12', 'Design a Ticket Booking System', 62, [
    item('d10-ticket-booking', 'Ticket Booking System', 'tier1', {
      related: ['c7-isolation-levels', 'c10-rate-limiting', 'c11-idempotent-consumers'],
      capstone: 'Core capstone domain — concurrent inventory, reservations, payments.',
    }),
    nest('d10-ticket-booking', 'd10-ticket-holds-locks', 'Seat Holds, Locks & Expiration'),
    nest('d10-ticket-booking', 'd10-ticket-oversell', 'Prevent Overselling under Concurrency'),
    nest('d10-ticket-booking', 'd10-ticket-flash-sale', 'Flash-Sale Queues, Fairness & Idempotent Payment'),
  ], 'system-design'),

  section('D10.13', 'Design Uber / Ride Hailing', 63, [
    item('d10-uber', 'Uber / Ride Hailing'),
    nest('d10-uber', 'd10-uber-location-index', 'Location Updates & Geospatial Indexing'),
    nest('d10-uber', 'd10-uber-matching', 'Driver Matching & Dispatch'),
    nest('d10-uber', 'd10-uber-trip-state', 'Trip State Machine, Pricing & Event Flow'),
  ], 'system-design'),

  section('D10.14', 'Design a Payment System', 64, [
    item('d10-payments', 'Payment System'),
    nest('d10-payments', 'd10-payment-ledger', 'Double-Entry Ledger & Immutable Events'),
    nest('d10-payments', 'd10-payment-idempotency', 'Idempotency & Exactly-Once Business Effect'),
    nest('d10-payments', 'd10-payment-reconciliation', 'PSP Workflow, Reconciliation & Refunds'),
  ], 'system-design'),

  section('D10.15', 'Design a Distributed Job Scheduler', 65, [
    item('d10-job-scheduler', 'Distributed Job Scheduler'),
    nest('d10-job-scheduler', 'd10-scheduler-timing-wheel', 'Scheduling Index / Timing Wheel'),
    nest('d10-job-scheduler', 'd10-scheduler-leases', 'Leases, Ownership & Failover'),
    nest('d10-job-scheduler', 'd10-scheduler-retry-dedup', 'Retry, Deduplication & Misfires'),
  ], 'system-design'),

  section('D10.16', 'Design a Monitoring & Alerting Platform', 66, [
    item('d10-monitoring', 'Metrics Monitoring & Alerting Platform'),
    nest('d10-monitoring', 'd10-monitoring-ingestion', 'High-Throughput Metric Ingestion'),
    nest('d10-monitoring', 'd10-monitoring-tsdb', 'Time-Series Storage & Downsampling'),
    nest('d10-monitoring', 'd10-monitoring-alert-evaluation', 'Alert Evaluation, Routing & Deduplication'),
  ], 'system-design'),

  section('D10.17', 'Design a Distributed Cache', 67, [
    item('d10-distributed-cache', 'Distributed Cache'),
    nest('d10-distributed-cache', 'd10-cache-partition-replicate', 'Partition, Replicate & Rebalance'),
    nest('d10-distributed-cache', 'd10-cache-eviction-hotkey', 'Eviction, Hot Keys & Stampede'),
    nest('d10-distributed-cache', 'd10-cache-consistency-failure', 'Consistency & Node Failure'),
  ], 'system-design'),

  section('D10.18', 'Design an Ad-Click Aggregation System', 68, [
    item('d10-ad-aggregation', 'Ad-Click Event Aggregation', 'tier2'),
    nest('d10-ad-aggregation', 'd10-ad-ingestion', 'Event Ingestion & Partitioning', 'tier2'),
    nest('d10-ad-aggregation', 'd10-ad-window-aggregation', 'Windowed Aggregation & Late Events', 'tier2'),
    nest('d10-ad-aggregation', 'd10-ad-dedup-reconcile', 'Deduplication & Batch Reconciliation', 'tier2'),
  ], 'system-design'),

  section('D10.19', 'Design a Web Crawler', 69, [
    item('d10-web-crawler', 'Web Crawler', 'tier2'),
    nest('d10-web-crawler', 'd10-crawler-frontier', 'URL Frontier, Priority & Politeness', 'tier2'),
    nest('d10-web-crawler', 'd10-crawler-dedup', 'URL/Content Deduplication & Bloom Filters', 'tier2'),
    nest('d10-web-crawler', 'd10-crawler-failure-scale', 'Distributed Fetchers, Retry & Storage', 'tier2'),
  ], 'system-design'),

  section('D10.20', 'Design a Proximity / Nearby Service', 70, [
    item('d10-proximity-service', 'Proximity / Nearby Service', 'tier2'),
    nest('d10-proximity-service', 'd10-proximity-geohash', 'Geohash, Quadtree & S2 Cells', 'tier2'),
    nest('d10-proximity-service', 'd10-proximity-radius', 'Radius Search & Boundary Expansion', 'tier2'),
    nest('d10-proximity-service', 'd10-proximity-hotspots', 'Location Updates, Hotspots & Caching', 'tier2'),
  ], 'system-design'),

  section('D10.21', 'Design Google Maps', 71, [
    item('d10-maps', 'Maps & Navigation', 'tier2'),
    nest('d10-maps', 'd10-maps-tiles', 'Map Tiles, Object Storage & CDN', 'tier2'),
    nest('d10-maps', 'd10-maps-routing-graph', 'Road Graph, Routing & Precomputation', 'tier2'),
    nest('d10-maps', 'd10-maps-live-traffic', 'Live Traffic & ETA Updates', 'tier2'),
  ], 'system-design'),

  section('D10.22', 'Design a Distributed Message Queue', 72, [
    item('d10-message-queue', 'Distributed Message Queue', 'tier2'),
    nest('d10-message-queue', 'd10-mq-partitions-replication', 'Partitions, Ordering & Replication', 'tier2'),
    nest('d10-message-queue', 'd10-mq-offsets-ack', 'Offsets, Acknowledgements & Consumer Groups', 'tier2'),
    nest('d10-message-queue', 'd10-mq-retention-rebalance', 'Retention, Replay & Rebalancing', 'tier2'),
  ], 'system-design'),

  section('D10.23', 'Design a Distributed Email Service', 73, [
    item('d10-email-service', 'Distributed Email Service', 'tier2'),
    nest('d10-email-service', 'd10-email-queue-priority', 'Queues, Priority & Provider Routing', 'tier2'),
    nest('d10-email-service', 'd10-email-reputation', 'Rate Limits, Reputation & Bounce Handling', 'tier2'),
    nest('d10-email-service', 'd10-email-template-tracking', 'Templates, Tracking & Idempotency', 'tier2'),
  ], 'system-design'),

  section('D10.24', 'Design S3-Like Object Storage', 74, [
    item('d10-object-storage', 'S3-Like Object Storage', 'tier2'),
    nest('d10-object-storage', 'd10-object-metadata-data', 'Metadata Plane vs Data Plane', 'tier2'),
    nest('d10-object-storage', 'd10-object-chunks-erasure', 'Chunk Placement, Replication & Erasure Coding', 'tier2'),
    nest('d10-object-storage', 'd10-object-consistency-repair', 'Consistency, Checksums & Repair', 'tier2'),
  ], 'system-design'),

  section('D10.25', 'Design a Real-Time Leaderboard', 75, [
    item('d10-leaderboard', 'Real-Time Gaming Leaderboard', 'tier2'),
    nest('d10-leaderboard', 'd10-leaderboard-sorted-set', 'Sorted Sets & Rank Queries', 'tier2'),
    nest('d10-leaderboard', 'd10-leaderboard-sharding', 'Sharding, Top-K & Global Merge', 'tier2'),
    nest('d10-leaderboard', 'd10-leaderboard-season', 'Seasons, Ties & Anti-Cheat', 'tier2'),
  ], 'system-design'),

  section('D10.26', 'Design a Digital Wallet', 76, [
    item('d10-digital-wallet', 'Digital Wallet', 'tier2'),
    nest('d10-digital-wallet', 'd10-wallet-ledger-balance', 'Ledger vs Derived Balance', 'tier2'),
    nest('d10-digital-wallet', 'd10-wallet-transfer-saga', 'Transfers, Idempotency & Saga', 'tier2'),
    nest('d10-digital-wallet', 'd10-wallet-audit-reconcile', 'Audit, Reconciliation & Fraud Controls', 'tier2'),
  ], 'system-design'),

  section('D10.27', 'Design a Stock Exchange', 77, [
    item('d10-stock-exchange', 'Stock Exchange', 'tier3'),
    nest('d10-stock-exchange', 'd10-exchange-order-book', 'Order Book & Price-Time Priority', 'tier3'),
    nest('d10-stock-exchange', 'd10-exchange-matching', 'Deterministic Matching & Sequencing', 'tier3'),
    nest('d10-stock-exchange', 'd10-exchange-market-data', 'Market Data Fan-out, Durability & Audit', 'tier3'),
  ], 'system-design'),

  section('D10.28', 'Design an Online Coding Judge', 78, [
    item('d10-coding-judge', 'Online Coding Judge', 'tier2'),
    nest('d10-coding-judge', 'd10-judge-sandbox', 'Secure Sandboxing & Resource Isolation', 'tier2'),
    nest('d10-coding-judge', 'd10-judge-queue-workers', 'Submission Queue & Language Workers', 'tier2'),
    nest('d10-coding-judge', 'd10-judge-tests-results', 'Test Storage, Scoring & Result Streaming', 'tier2'),
  ], 'system-design'),

  section('D10.29', 'Design Collaborative Documents', 79, [
    item('d10-collaborative-docs', 'Google Docs / Collaborative Editing', 'tier3'),
    nest('d10-collaborative-docs', 'd10-docs-ot-crdt', 'Operational Transform vs CRDT', 'tier3'),
    nest('d10-collaborative-docs', 'd10-docs-presence-sync', 'Presence, Offline Edits & Synchronization', 'tier3'),
    nest('d10-collaborative-docs', 'd10-docs-snapshots-history', 'Snapshots, History & Compaction', 'tier3'),
  ], 'system-design'),

  section('D10.30', 'Design an E-Commerce / Food Delivery Platform', 80, [
    item('d10-commerce-delivery', 'E-Commerce & Food Delivery Platform', 'tier2'),
    nest('d10-commerce-delivery', 'd10-commerce-catalog-search', 'Catalog, Search & Inventory', 'tier2'),
    nest('d10-commerce-delivery', 'd10-commerce-order-saga', 'Order Saga, Payment & Fulfillment', 'tier2'),
    nest('d10-commerce-delivery', 'd10-commerce-flash-sale', 'Flash Sales, Hot Keys & Fair Admission', 'tier2'),
    nest('d10-commerce-delivery', 'd10-commerce-tracking', 'Delivery Tracking & Event-Driven Updates', 'tier2'),
  ], 'system-design'),
]
