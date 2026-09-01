import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Redundancy duplicates critical components — servers, AZs, regions, network paths, power — so failure of one unit does not halt the system. Forms include N+1 spare capacity, active-active pairs, multi-AZ deployment, and geo-replicated data.',
  whyExists:
    'Every component has a non-zero failure rate. At scale, "rare" events happen daily somewhere. Redundancy converts single failures into degraded-but-operational states and enables failover without emergency heroics.',
  mentalModel:
    'Parallel lanes on a highway: one lane closed (failed node) and traffic flows on others. More lanes (replicas) improve availability but add merge complexity (consistency, cost, operational overhead).',
  howItWorks: [
    {
      type: 'table',
      headers: ['Pattern', 'Description', 'Availability gain'],
      rows: [
        ['N+1', 'N needed + 1 spare', 'Survive single unit loss'],
        ['Active-passive', 'Hot standby takes over', 'Fast failover one component'],
        ['Active-active', 'All nodes serve traffic', 'No idle capacity; harder consistency'],
        ['Multi-AZ', 'Replicas across availability zones', 'Survive AZ failure'],
        ['Multi-region', 'Geo-redundant stacks', 'Survive regional disaster'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'Multi-AZ redundancy',
      diagram: `flowchart TB
  LB[Load balancer] --> AZ1[AZ-a instances]
  LB --> AZ2[AZ-b instances]
  AZ1 --> DB[(Primary DB AZ-a)]
  AZ2 --> DB
  DB --> Replica[(Sync replica AZ-b)]`,
    },
    {
      type: 'list',
      items: [
        'Redundancy without diversity can share fate — same bug, same deploy, same vendor',
        'Quorum replication: majority survives (3 nodes tolerate 1 loss)',
        'Eliminate hidden SPOFs: single NAT, one Redis, one admin account',
        'Cost scales with redundancy level — match to SLA tier',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'API tier: minimum 3 instances across 2 AZs behind LB (N+1). Postgres primary + sync replica in different AZs. Redis Cluster with 3 masters + replicas. No single host runs unique cron — leader election via etcd. Result: survive single instance and single AZ loss.',
    },
  ],
  tradeoffs: {
    advantages: ['Higher availability', 'Rolling deploys without downtime', 'Fault isolation'],
    disadvantages: ['2×+ infra cost', 'Replication lag and consistency complexity', 'More moving parts to operate'],
    alternatives: ['Accept downtime for non-critical tiers', 'Backup-only without hot standby'],
    whenToUse: ['Production SLAs', 'Stateful services with replication', 'Multi-tenant platforms'],
    whenNotToUse: ['Throwaway dev sandboxes'],
  },
  failureModes: [
    'Correlated failure — all replicas same bad deploy',
    'Redundant components share SPOF (one LB config file)',
    'Async replica promoted with stale data',
    'Over-redundancy without monitoring — silent replica lag',
    'Split brain with active-active writes',
  ],
  production: {
    reliability: ['Multi-AZ minimum for tier-1', 'Automated failover with fencing', 'Diverse failure domains'],
    scalability: ['Horizontal replicas with consistent hashing or LB'],
    observability: ['Replica lag, AZ traffic balance, health per node'],
    security: ['Redundant secrets stores', 'No single admin key'],
    maintainability: ['IaC ensures symmetric redundant stacks'],
    cost: ['Right-size redundancy to SLA — not everything needs multi-region'],
  },
  interview: {
    expectations: ['N+1 vs active-active', 'Multi-AZ', 'Quorum math'],
    commonQuestions: ['How improve availability from 99.9%?', 'Redundancy vs DR?'],
    followUps: ['Correlated failures?', 'When is active-active worth it?'],
    misconceptions: ['More copies always linearly improve availability', 'Multi-AZ equals multi-region'],
    traps: ['Redundant app servers but single DB'],
    strongSignals: ['Quorum 2f+1', 'Diverse AZ/region', 'Eliminate SPOF audit'],
  },
  keyTakeaways: [
    'Redundancy = duplicate critical paths so one failure is survivable.',
    'N+1, active-passive, active-active, multi-AZ, multi-region — escalating cost/complexity.',
    'Shared fate: same deploy, vendor, or config defeats redundancy.',
    'Pair redundancy with health checks, failover, and quorum.',
    'Match redundancy level to SLA — not everything needs geo-redundancy.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'N+1 redundancy?', answerHint: 'N units needed for load plus one spare to survive single failure.' },
    { level: 'intermediate', question: 'Active-active vs active-passive?', answerHint: 'Active-active all serve traffic — harder writes; passive standby idle until failover — simpler consistency.' },
    { level: 'advanced', question: 'Redundancy failed during deploy — why?', answerHint: 'Correlated failure — bad binary on all replicas; use canary, staggered rollout, feature flags.' },
  ],
  flashcards: [
    { front: 'N+1', back: 'Required capacity plus one spare unit' },
    { front: 'Active-active', back: 'All nodes serve traffic simultaneously' },
    { front: 'Quorum 2f+1', back: 'Tolerate f failures with majority consensus' },
    { front: 'Correlated failure', back: 'Multiple redundant units fail together — shared cause' },
  ],
  quickRevision: [
    'N+1 spare',
    'Multi-AZ min',
    'Quorum replicas',
    'No hidden SPOF',
    'Match SLA tier',
  ],
}
