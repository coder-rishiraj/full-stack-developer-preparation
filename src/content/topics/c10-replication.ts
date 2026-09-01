import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Redis replication copies data from master to one or more replicas asynchronously. Replicas serve read scaling and provide failover candidates. Sentinel monitors health and promotes replica on master failure. Redis Cluster shards data across masters each with replicas for HA at scale.',
  whyExists:
    'Single Redis node is memory-bound and SPOF. Replicas offload read traffic and hold hot standby copy. Sentinel automates failover without manual DNS changes — essential for production Redis beyond pure cache dev setups.',
  mentalModel:
    'Master accepts writes; replicas pull stream of commands (partial sync or full RDB resync). Reads from replica may lag milliseconds behind. On master death, Sentinel votes replica to master — clients must handle brief unavailability and topology change.',
  howItWorks: [
    {
      type: 'mermaid',
      caption: 'Master-replica with Sentinel failover',
      diagram: `flowchart TB
  AppW[Writes] --> Master
  Master -->|replication stream| Replica1
  Master -->|replication stream| Replica2
  AppR[Reads] --> Replica1
  Sentinel1 & Sentinel2 & Sentinel3 -->|monitor| Master
  Sentinel1 -.->|failover| Replica1`,
    },
    {
      type: 'table',
      headers: ['Component', 'Role'],
      rows: [
        ['Master', 'All writes; propagates to replicas'],
        ['Replica', 'Read scaling; hot standby; read-only by default'],
        ['Sentinel', 'Health check, quorum failover, config publish'],
        ['Cluster', '16384 hash slots across masters + replica each'],
        ['PSYNC', 'Partial resync after reconnect vs full RDB'],
      ],
    },
    {
      type: 'list',
      items: [
        'replica-read-only yes — prevent accidental writes to stale replica.',
        'min-replicas-to-write: master rejects writes if too few replicas synced — data safety.',
        'Spring Lettuce supports Sentinel and Cluster topology refresh.',
        'Read-your-writes: route session reads to master or tolerate lag.',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'yaml',
      caption: 'Spring Boot Redis Sentinel config',
      code: `spring:
  data:
    redis:
      sentinel:
        master: mymaster
        nodes:
          - sentinel1:26379
          - sentinel2:26379
          - sentinel3:26379`,
    },
    {
      type: 'paragraph',
      text: 'Session cache: writes to master; read-heavy session validation from replicas with 50ms lag acceptable. Inventory counter writes must read from master after decrement — replica lag could show wrong stock.',
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Replication backlog ring buffer enables partial resync if replica disconnect brief.',
        'FULL RESYNC: RDB snapshot over network — expensive on large datasets.',
        'Sentinel quorum (typically majority) agrees on subjective down and failover.',
        'Cluster failover: replica promoted per master shard independently.',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Read scale', 'Automated HA with Sentinel', 'PSYNC reduces full resync cost'],
    disadvantages: ['Async lag — stale reads', 'Failover brief write unavailability', 'Split-brain risk if misconfigured'],
    alternatives: ['Single master + app cache only', 'Redis Enterprise active-active', 'Elasticache Multi-AZ managed'],
    whenToUse: ['Production HA', 'Read-heavy Redis workloads', 'Memory scale via cluster sharding'],
    whenNotToUse: ['Dev single node acceptable', 'Strong consistency reads from replica immediately after write'],
  },
  failureModes: [
    'Replica lag during heavy write burst — stale reads',
    'Full resync saturates network — latency spike',
    'Split-brain two masters if Sentinel misconfigured',
    'App not Sentinel-aware — connects to dead master IP',
    'Writing to replica when replica-read-only disabled by mistake',
  ],
  production: {
    reliability: ['3+ Sentinels odd quorum', 'min-replicas-to-write for critical data', 'Managed Elasticache failover'],
    scalability: ['Read routing to replicas via Lettuce ReadFrom.REPLICA_PREFERRED'],
    observability: ['master_repl_offset lag metrics', 'Sentinel failover alert runbooks'],
    security: ['AUTH on replication link', 'TLS for cross-AZ replication'],
  },
  interview: {
    expectations: ['Async replication lag', 'Sentinel failover', 'Read scaling caveats', 'Cluster vs Sentinel'],
    commonQuestions: ['Redis HA setup?', 'Stale read from replica?'],
    followUps: ['PSYNC vs full sync?', 'When Redis Cluster over Sentinel?'],
    misconceptions: ['Replicas are synchronous', 'Failover is instant zero loss'],
    traps: ['Counter decrement read from lagging replica'],
    strongSignals: ['Read-your-writes routing', 'Sentinel quorum', 'min-replicas-to-write'],
  },
  keyTakeaways: [
    'Redis replication is asynchronous — replicas lag master.',
    'Sentinel automates master failover with quorum.',
    'Route consistent reads to master after writes.',
    'PSYNC avoids full RDB when backlog covers gap.',
    'Cluster shards for memory scale + per-shard replication.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Why Redis replica?', answerHint: 'Read scaling and standby for promotion when master fails.' },
    { level: 'intermediate', question: 'How Sentinel detects master down?', answerHint: 'Sentinels ping master; subjective down when enough agree; quorum elects replica promote.' },
    { level: 'advanced', question: 'Decremented stock still shows available on replica?', answerHint: 'Replication lag — read inventory from master or use synchronous wait (WAIT command) sparingly.' },
  ],
  flashcards: [
    { front: 'Sentinel', back: 'Monitors Redis nodes; automates failover promotion' },
    { front: 'PSYNC', back: 'Partial resync using replication backlog offset' },
    { front: 'replica-read-only', back: 'Default prevents writes to replica copy' },
    { front: 'Read-your-writes', back: 'After write, read from master not lagging replica' },
  ],
  quickRevision: ['Async replication', 'Sentinel failover', 'Stale replica reads', 'PSYNC partial', 'Cluster sharding'],
}
