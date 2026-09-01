import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'High-level architecture (HLA) in system design interviews is the end-to-end box diagram — clients, CDN, LB, API tier, caches, queues, databases, object storage, search, third parties — with labeled data flows showing how functional requirements are satisfied at scale.',
  whyExists:
    'HLA is the visual spine of the interview. It forces you to place components, show sync vs async paths, and expose bottlenecks before deep dives. A clear HLA lets interviewer steer; a missing one loses the room.',
  mentalModel:
    'City map not building blueprint. Show districts: frontend, API city, data harbor, async factory. Arrows are roads (HTTP, queue, replication). One diagram, talk through read and write paths separately.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Layer', 'Typical boxes', 'Mention'],
      rows: [
        ['Edge', 'CDN, WAF, DNS', 'Static + TLS termination'],
        ['Ingress', 'Load balancer, API gateway', 'Rate limit auth'],
        ['App', 'Stateless services', 'Horizontal scale'],
        ['Cache', 'Redis/Memcached', 'Hit ratio assumption'],
        ['Data', 'Primary DB, replicas, object store', 'Shard note'],
        ['Async', 'Kafka/SQS, workers', 'Fan-out indexing notify'],
        ['Search', 'Elasticsearch', 'CDC from primary'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'Generic HLD read path',
      diagram: `flowchart TB
  Client --> CDN[CDN]
  CDN --> LB[Load Balancer]
  LB --> API[API Services]
  API --> Cache[Redis]
  Cache -->|miss| DB[(Primary DB)]
  DB --> Replica[(Read Replicas)]`,
    },
    {
      type: 'list',
      items: [
        'Draw while talking — 5–8 boxes not 30 microservices',
        'Separate write path if different (queue, primary DB)',
        'Label sync vs async arrows',
        'Reference earlier capacity bottleneck on diagram',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'YouTube-like upload HLA: client → CDN for playback; upload → API → object storage (S3) + metadata DB; transcode queue → worker fleet → update metadata + CDN prefetch. Search index via CDC. Read: CDN HIT for video; API for metadata cache-aside Redis.',
    },
  ],
  tradeoffs: {
    advantages: ['Shared visual for interview', 'Exposes missing components', 'Structures deep dives'],
    disadvantages: ['Over-detailed HLA wastes time', 'Under-labeled boxes confuse'],
    alternatives: ['List components only — weaker without diagram'],
    whenToUse: ['After requirements + capacity', 'Before deep dives'],
    whenNotToUse: ['Before clarifying scope — premature'],
  },
  failureModes: [
    'Diagram with no data flow narration',
    'Missing cache or async when needed at scale',
    'Single box "database" without read/write split',
    '30 microservices unnamed',
    'No connection to functional requirements',
  ],
  production: {
    scalability: ['Stateless app tier called out in HLA maps to K8s HPA'],
    reliability: ['Multi-AZ on diagram for tier-1'],
    observability: ['Note metrics per box in narrative'],
  },
  interview: {
    expectations: ['Clear diagram', 'Read + write paths', '5–8 components'],
    commonQuestions: ['Draw architecture for X?', 'Where is cache?'],
    followUps: ['Bottleneck on diagram?', 'Async where?'],
    misconceptions: ['Must name exact AWS products', 'More boxes = better'],
    traps: ['Skip diagram entirely'],
    strongSignals: ['Labeled flows', 'Capacity tie-in', 'Separate hot paths'],
  },
  keyTakeaways: [
    'HLA = main box diagram after requirements and capacity.',
    'Layers: edge → LB → app → cache → DB → async → search.',
    'Narrate read path and write path separately.',
    '5–8 boxes; avoid premature microservice explosion.',
    'Point to bottleneck from capacity math on diagram.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Minimum HLA components web app?', answerHint: 'Client, LB, app servers, database; add cache CDN as scale requires.' },
    { level: 'intermediate', question: 'When add message queue in HLA?', answerHint: 'Async work decouple — notifications indexing transcoding spike absorption.' },
    { level: 'advanced', question: 'Draw and explain news feed HLA?', answerHint: 'Post API → DB + fan-out queue → feed cache; read API → Redis timeline; search CDC side path.' },
  ],
  flashcards: [
    { front: 'HLA timing', back: 'After requirements and capacity before deep dives' },
    { front: 'Read vs write path', back: 'Narrate separately — often different components' },
    { front: 'Stateless app tier', back: 'Horizontally scaled behind LB — session in cache or JWT' },
    { front: 'Async box purpose', back: 'Decouple slow work — notify index transcode' },
  ],
  quickRevision: [
    'Edge LB app cache DB',
    'Read + write paths',
    '5–8 boxes',
    'Label async',
    'Tie bottleneck',
  ],
}
