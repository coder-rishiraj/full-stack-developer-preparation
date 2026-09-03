import type { TopicContent } from '@/domain/types'

type SystemDesignTopicInput = {
  title: string
  sectionTitle: string
  parentTitle?: string
}

const FOCUS: Record<string, string> = {
  'System Design Foundations, HLD & LLD Boundaries':
    'requirements into architecture, HLD vs LLD boundaries, component responsibilities, and explicit trade-offs',
  'Requirements, Constraints & Trade-offs':
    'functional scope, SLOs, workload shape, non-goals, and the constraints that actually change architecture',
  'Scale from One Server to Millions':
    'single-server baseline → separated tiers → stateless horizontal scale → cache/CDN/queues → multi-region',
  'Latency, Throughput & Performance Budgets':
    'tail latency, throughput, concurrency, saturation, queueing, batching, and end-to-end budgets',
  'Load Balancing, Proxies & Traffic Routing':
    'L4/L7 routing, health removal, algorithms, statelessness, proxies, GeoDNS, and global traffic',
  'Availability, Reliability & Failure Models':
    'partial failures, SPOFs, redundancy, graceful degradation, failure domains, and availability math',
  'CAP, PACELC & Consistency Models':
    'partition-time CP/AP choice, normal-operation latency trade-offs, session guarantees, and stale-read UX',
  'Replication, Leaders & Quorums':
    'leader/follower, sync/async replicas, lag, quorum math, failover, and conflict resolution',
  'Partitioning, Sharding & Consistent Hashing':
    'partition keys, skew/hotspots, rebalancing, virtual nodes, and cross-shard operation costs',
  'Distributed Time, Ordering & Consensus':
    'logical time, ordering, leader election, gossip, consensus, leases, fencing, and split brain',
  'Delivery Semantics & Idempotency':
    'duplicates, retries, ordering, deduplication, inboxes, and the real scope of exactly-once claims',
  'Distributed Transactions & Workflows':
    '2PC vs saga, transactional outbox/CDC, compensation, and durable workflow orchestration',
  'Data Modeling & Access-Pattern-First Design':
    'invariants, query paths, normalization, indexes, denormalization, lifecycle, and compliance deletion',
  'SQL, NoSQL & Database Selection':
    'workload-driven SQL/NoSQL choice, data models, transaction needs, scale shape, and polyglot complexity',
  'Database Replication & Read Scaling':
    'read replicas, consistency routing, lag, failover, promotion, and cross-region data-loss windows',
  'Database Partitioning & Sharding':
    'shard routing, hot partitions, online migration, global indexes, and resharding under load',
  'Block, File & Object Storage':
    'storage semantics, blob metadata, multipart transfer, checksums, durability, and erasure coding',
  'Caching Architecture & Invalidation':
    'cache placement, read/write policies, TTL, invalidation, stampede prevention, and freshness contracts',
  'CDN & Edge Delivery':
    'edge/origin flow, cache keys, TTL/invalidation, origin shielding, fallback, and edge execution',
  'Queues, Pub/Sub & Async Work':
    'decoupling, load leveling, acknowledgements, visibility, DLQs, ordering, retry, and replay',
  'Event Streams & Data Pipelines':
    'append-only logs, offsets, batch vs stream, event sourcing, CDC, and materialized views',
  'Search, Indexes & Probabilistic Structures':
    'inverted indexes, tries, ranking, Bloom filters, indexing pipelines, sharding, and refresh trade-offs',
  'API Contracts & Protocol Selection':
    'REST/gRPC/GraphQL choice, sync vs async APIs, schemas, coupling, and compatibility',
  'Resource Modeling, Errors & Compatibility':
    'resource boundaries, error contracts, schema evolution, partial success, and backward compatibility',
  'Pagination, Filtering & Large Results':
    'offset vs cursor, stable ordering, concurrent writes, filtering, and async export jobs',
  'Real-Time Communication':
    'polling/SSE/WebSockets, connection state, fan-out, reconnect, resume, and missed-event recovery',
  'API Gateway, Security & Rate Limiting':
    'edge authentication, quotas, rate limits, idempotency, validation, routing, and WAF controls',
  'Service Communication & Discovery':
    'service registration, discovery, heartbeats, meshes, health, and contract testing',
  'Architecture Styles & Service Boundaries':
    'modular monolith vs microservices/event-driven/serverless, boundaries, Conway’s Law, and migration cost',
  'Caching Strategy at System Scale':
    'multi-layer caches, consistency, invalidation, bypass, failure behavior, and blast radius',
  'Overload Protection & Backpressure':
    'admission control, bounded queues, load shedding, fairness, rate limits, and backpressure propagation',
  'Timeouts, Retries & Circuit Breakers':
    'deadlines, safe retries with jitter, breakers, bulkheads, fallbacks, and cascading-failure prevention',
  'High Availability, Failover & Disaster Recovery':
    'redundancy, failover, active/active vs passive, RTO/RPO, backups, and restore drills',
  'SLIs, SLOs & Production Readiness':
    'user-centric indicators, objectives, error budgets, golden signals, runbooks, and readiness reviews',
  'Multi-Region Architecture':
    'global routing, locality, residency, cross-region data, conflict handling, and region evacuation',
  'Security, Privacy, Cost & Sustainability':
    'trust boundaries, least privilege, encryption, privacy lifecycle, unit economics, and efficient capacity',
  'Back-of-the-Envelope Estimation Method':
    'orders of magnitude, peak factors, assumptions, safety margins, and estimates that influence decisions',
  'Traffic, QPS & Concurrency Estimation':
    'DAU-to-QPS math, read/write split, peak traffic, live connections, and internal fan-out',
  'Storage, Bandwidth & Cache Estimation':
    'record/blob size, retention, replication/index overhead, bandwidth, egress, and working-set cache size',
  'Capacity Planning & Bottleneck Analysis':
    'CPU/memory/I/O/network limits, utilization headroom, load tests, capacity models, and unit cost',
  'The 45–60 Minute Interview Framework':
    'time-boxed requirements, estimates, APIs/data, HLD, deep dive, failure analysis, and summary',
  'Requirements & Scope in Interviews':
    'core use cases, non-goals, scale, geography, tenancy, consistency, availability, and latency',
  'Estimation, APIs & Data Model in Interviews':
    'decision-driving estimates, API contracts, idempotency, pagination, schemas, and critical access patterns',
  'High-Level Architecture & Request Flows':
    'legible read/write paths, component ownership, sync/async boundaries, and end-to-end data flow',
  'Deep Dives, Scaling & Failure Handling':
    'identify the bottleneck, zoom in, break nodes/dependencies, preserve correctness, and expose signals',
  'Trade-offs & Senior-Level Communication':
    'compare alternatives, justify constraints, name residual risk, avoid overengineering, and adapt to pushback',
  'Mocks, Deliberate Practice & Company Calibration':
    'timed whiteboarding, feedback loops, design retrospectives, company expectations, and hands-on experiments',
}

function isPractice(sectionTitle: string): boolean {
  return sectionTitle.startsWith('Design ')
}

export function createSystemDesignTopicContent({
  title,
  sectionTitle,
  parentTitle,
}: SystemDesignTopicInput): TopicContent {
  const practice = isPractice(sectionTitle)
  const focus = FOCUS[sectionTitle] ??
    (practice
      ? 'requirements, scale estimates, APIs/data model, critical paths, bottlenecks, failures, and explicit trade-offs'
      : 'architecture mechanics, production failure modes, and workload-driven trade-offs')
  const parent = parentTitle ? ` It is an atomic part of ${parentTitle}.` : ''

  return {
    whatIsIt:
      `${title} is ${practice ? 'a system-design exercise' : 'a system-design concept'} in ${sectionTitle}.${parent} ` +
      'A strong senior answer connects requirements to mechanisms, quantifies scale, and states what fails—not merely which boxes to draw.',
    whyExists:
      `${title} exists because architecture is contextual: the same component can improve one workload and damage another. ` +
      `Master this through ${focus}.`,
    mentalModel:
      'Requirements → numbers → API/data → read/write paths → bottleneck → failure mode → mitigation → residual trade-off. ' +
      'For every box ask: why is it here, what state does it own, how does it scale, and what happens when it is slow or unavailable?',
    howItWorks: [
      {
        type: 'list',
        ordered: true,
        items: [
          `Define ${title} precisely and connect it to a concrete requirement in ${sectionTitle}.`,
          'Trace the critical read and write path, including state ownership and synchronous dependencies.',
          'Estimate the relevant load: peak QPS, concurrent connections, data growth, bandwidth, or hot-key skew.',
          'Break the design: node loss, dependency timeout, duplicate delivery, stale read, overload, or region failure.',
          'Compare at least one alternative and state the trigger that would justify extra complexity.',
        ],
      },
      {
        type: 'callout',
        variant: 'note',
        title: 'Senior-level bar',
        text:
          'Do not cargo-cult microservices, Kafka, Redis, or sharding. Start with the simplest design that meets stated constraints, ' +
          'then evolve it when a measured bottleneck or reliability requirement demands change.',
      },
    ],
    internals: [
      {
        type: 'list',
        items: [
          'Scalability and reliability are different: more nodes add capacity, but redundancy, failover, and state recovery create availability.',
          'Tail latency compounds across fan-out; one slow dependency can dominate an otherwise fast request.',
          'Replication improves read scale and durability but introduces lag, failover ambiguity, and conflict/consistency choices.',
          'Queues decouple rate and availability but introduce backlog, duplicates, ordering constraints, replay, and poison messages.',
          'Caches trade freshness and invalidation complexity for latency/capacity; the primary store remains the source of truth.',
        ],
      },
    ],
    failureModes: [
      `Using ${title} as a memorized label without tying it to requirements, numbers, or a failure mode.`,
      'Scaling every tier before identifying the actual bottleneck or dominant access pattern.',
      'Claiming exactly-once, zero downtime, or strong consistency without defining scope and cost.',
      'Ignoring overload: unbounded queues, synchronized retries, cache stampedes, or hot partitions.',
      'Drawing a happy path with no degraded mode, observability, migration, or rollback story.',
    ],
    production: {
      performance: [
        'Measure p95/p99, saturation, queue depth, hit ratio, and dependency fan-out before optimizing.',
        'Use realistic peak and skew—not only average QPS—to size critical paths.',
      ],
      reliability: [
        'Set deadlines, make retries safe with idempotency, isolate failure domains, and test failover.',
        'Define degraded behavior and data-correctness guarantees explicitly.',
      ],
      maintainability: [
        'Prefer clear ownership and evolvable contracts over fashionable component count.',
        'Record the decision, rejected alternatives, assumptions, and conditions for revisiting it.',
      ],
      observability: [
        'Instrument critical read/write paths with metrics, structured logs, traces, and business correctness signals.',
        'Alert on user symptoms and SLO burn rather than raw infrastructure alone.',
      ],
      security: [
        'Draw trust boundaries; apply authentication, authorization, encryption, rate limits, and audit at the correct layer.',
      ],
      cost: [
        'Estimate unit cost per request/user/GB and include replicas, egress, indexes, cache headroom, and idle capacity.',
      ],
    },
    systemDesign: {
      problem: practice
        ? `${sectionTitle}: scope the product, quantify its dominant workload, design the critical paths, and defend the architecture under failure.`
        : `Explain and apply ${title} inside a scalable production system, including when not to use it.`,
      requirements: {
        functional: [
          `Support the core behavior represented by ${title}.`,
          'Define the critical read and write operations.',
          'Keep state ownership and component responsibilities explicit.',
        ],
        nonFunctional: [
          'Meet an explicit p99 latency and peak-throughput target.',
          'Tolerate node and dependency failures without silent corruption.',
          'Scale incrementally with observable cost and operational complexity.',
        ],
      },
      scaleAssumptions: [
        'State DAU/MAU, peak QPS, read/write ratio, geography, and workload skew.',
        'Use a 5–10× peak factor unless the product has known burst behavior.',
        'Call out hot keys, large objects, long-lived connections, or fan-out where relevant.',
      ],
      capacityEstimates: [
        'Estimate peak QPS and concurrent work from traffic assumptions.',
        'Estimate one-year data growth including replicas and indexes.',
        'Estimate bandwidth/egress and the hot working set for cache sizing.',
      ],
      api: [
        {
          type: 'list',
          items: [
            'Define only APIs needed by the scoped use cases.',
            'Include idempotency, cursor pagination, errors, and async status where relevant.',
          ],
        },
      ],
      dataModel: [
        {
          type: 'list',
          items: [
            'Model invariants and critical access patterns before selecting a database.',
            'Name primary keys, partition keys, indexes, retention, and ownership.',
          ],
        },
      ],
      highLevelArchitecture: [
        {
          type: 'paragraph',
          text:
            'Clients → edge/gateway → stateless application tier → cache and source-of-truth storage; ' +
            'queues/streams isolate asynchronous work; telemetry covers every critical boundary.',
        },
      ],
      diagram: {
        caption: `${title} reference request path`,
        mermaid: `flowchart LR
  C[Clients] --> E[Edge / Gateway]
  E --> S[Stateless Service]
  S --> K[(Cache)]
  S --> D[(Source of Truth)]
  S --> Q[Queue / Stream]
  Q --> W[Workers]
  S --> O[Metrics / Logs / Traces]`,
      },
      dataFlow: [
        'Read: route → authorize → cache lookup → source on miss → respond.',
        'Write: validate → enforce idempotency → commit source of truth → publish/refresh derived state.',
        'Failure: respect deadline → retry only safe work → degrade or reject explicitly.',
      ],
      storage: [
        'Choose SQL/NoSQL/object/search storage from invariants and access patterns.',
        'Separate source-of-truth data from caches, indexes, and other rebuildable projections.',
      ],
      caching: [
        'Cache only a measured hot path and define TTL, invalidation, stampede, and outage behavior.',
      ],
      asyncProcessing: [
        'Use queues/streams when producer and consumer rate or availability should be decoupled.',
        'Define ordering, retry, DLQ, deduplication, replay, and backlog limits.',
      ],
      scaling: [
        'Keep compute stateless where possible and scale the measured bottleneck.',
        'Partition state with a stable, well-distributed key only when vertical/read scaling is insufficient.',
      ],
      consistency: [
        'Name which operations require strong consistency and which tolerate stale or eventual reads.',
        'Define user-visible session guarantees and conflict behavior.',
      ],
      reliability: [
        'Remove SPOFs with redundancy across failure domains and tested failover.',
        'Use deadlines, bounded retries, idempotency, bulkheads, and graceful degradation.',
      ],
      failureScenarios: [
        'Cache unavailable or cold; protect the source from stampede.',
        'Primary/leader fails with lagging replicas; define promotion and data-loss window.',
        'Queue backlog or poison message; bound growth and isolate/replay safely.',
        'Hot key or partition; detect skew and split/replicate/admit fairly.',
      ],
      security: [
        'Authenticate callers, authorize resources, validate inputs, encrypt transport/storage, and audit sensitive actions.',
        'Apply rate limits and least privilege at trust boundaries.',
      ],
      observability: [
        'Track p50/p95/p99, traffic, errors, saturation, queue lag, cache hit ratio, and business correctness.',
        'Propagate correlation context and define symptom-based alerts/SLOs.',
      ],
      bottlenecks: [
        'Source-of-truth write capacity or a serialized coordinator.',
        'Fan-out, hot partitions, synchronous dependency chains, and network egress.',
      ],
      alternatives: [
        'Start with a modular monolith and one relational database when scale permits.',
        'Prefer managed services when undifferentiated operations exceed their lock-in/cost trade-off.',
      ],
      tradeoffs: [
        'Latency vs freshness; consistency vs availability; cost vs headroom.',
        'Simplicity vs independent scaling; synchronous clarity vs asynchronous resilience.',
      ],
      interviewFollowUps: [
        'What changes at 10× traffic or in a second region?',
        'How do we recover from a bad deploy, corrupt event, or lost leader?',
        'How would we migrate to the next architecture without downtime?',
      ],
      evolution: [
        {
          stage: '1 — Simple',
          description: 'One deployable service and source-of-truth database with backups and basic telemetry.',
          bottleneck: 'Single-node capacity and availability.',
        },
        {
          stage: '2 — Scale reads and compute',
          description: 'Load balancer, stateless replicas, cache/CDN, read replicas, and async workers.',
          bottleneck: 'Write path, hot keys, cache/database coordination.',
        },
        {
          stage: '3 — Partition and isolate',
          description: 'Shard state, isolate failure domains, add stream processing, and automate failover.',
          bottleneck: 'Cross-shard operations and operational complexity.',
        },
        {
          stage: '4 — Global',
          description: 'Multi-region routing, replicated data, residency policy, and region-evacuation drills.',
          bottleneck: 'Conflict resolution, global consistency, egress, and cost.',
        },
      ],
    },
    interview: {
      expectations: [
        `Place ${title} correctly in ${sectionTitle} and explain why the requirement needs it.`,
        'Quantify scale and identify the first likely bottleneck.',
        'Discuss failure, correctness, observability, and one viable alternative.',
      ],
      commonQuestions: [
        `How does ${title} work and when would you use it?`,
        'What breaks first at 10× scale?',
        'How does the design behave when this component is unavailable?',
      ],
      followUps: [
        'Which guarantee can be relaxed to improve availability or latency?',
        'How would you migrate from the simple design without a flag day?',
      ],
      misconceptions: [
        'There is one universally correct architecture for a product name.',
        'Horizontal scaling automatically solves state, consistency, and reliability.',
        'Adding a queue or cache removes failure; it changes the failure modes.',
      ],
      traps: [
        'Jumping into technology choices before scoping requirements.',
        'Spending the interview on one deep detail before presenting an end-to-end design.',
      ],
      strongSignals: [
        'Uses numbers and workload shape to justify architecture.',
        'Proactively names trade-offs, residual risk, operations, and an evolution path.',
      ],
    },
    keyTakeaways: [
      `${title} belongs to ${sectionTitle}.`,
      `Focus: ${focus}.`,
      'Requirements → numbers → paths → failures → trade-offs → evolution.',
    ],
    interviewQuestions: [
      {
        level: 'basic',
        question: `What is ${title}, and which problem does it solve?`,
        answerHint: `Define it in ${sectionTitle} and tie it to a concrete workload or requirement.`,
      },
      {
        level: 'intermediate',
        question: `How would ${title} behave under 10× load and partial failure?`,
        answerHint: 'Trace state, bottlenecks, replication/queueing, degraded behavior, and observability.',
      },
      {
        level: 'advanced',
        question: `Which alternative to ${title} would you reject, and what future evidence would change that decision?`,
        answerHint: `Use ${focus}; compare complexity, consistency, latency, reliability, and cost.`,
      },
    ],
    flashcards: [
      { front: title, back: `${sectionTitle}: ${focus}.` },
      {
        front: `${title} review loop`,
        back: 'Requirement → estimate → critical path → failure → mitigation → residual risk.',
      },
    ],
    quickRevision: [
      `${title} — ${sectionTitle}`,
      `Focus: ${focus}`,
      'Design for workload and failure, not buzzwords',
      'Explain alternatives and evolution path',
    ],
  }
}
