import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Two-Phase Commit (2PC) is distributed transaction protocol — coordinator runs Phase 1 prepare (all participants vote ready) then Phase 2 commit or abort. Ensures atomicity across databases/services at cost of blocking, coordinator SPOF, and poor availability under partitions.',
  whyExists:
    'Business wants "transfer money AND update inventory atomically" across two DBs. 2PC provides all-commit or all-abort semantics — foundation of XA transactions JTA, though largely avoided in modern microservices favoring sagas.',
  mentalModel:
    'Meeting consensus. Coordinator asks everyone "Can you commit?" (prepare). If all yes, coordinator says "Commit now." If anyone no, all abort. Participants hold locks during prepare until decision — blocking risk.',
  howItWorks: [
    {
      type: 'mermaid',
      caption: '2PC success and abort paths',
      diagram: `sequenceDiagram
  participant C as Coordinator
  participant A as Participant A
  participant B as Participant B
  C->>A: prepare
  C->>B: prepare
  A-->>C: YES
  B-->>C: YES
  C->>A: commit
  C->>B: commit
  Note over C,B: If B votes NO
  C->>A: abort
  C->>B: abort`,
    },
    {
      type: 'list',
      items: [
        'Phase 1 prepare: write undo/redo log, acquire locks, vote YES/NO.',
        'Phase 2 commit: apply redo log; abort: rollback using undo.',
        'Blocking: if coordinator dies after prepare, participants hold locks until timeout/recovery.',
        'XA datasource @Transactional JTA rare in cloud microservices today.',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Legacy bank transfer between two Oracle instances: JTA coordinates 2PC — debit account A and credit account B both commit or neither. Coordinator log on separate node enables recovery after crash deciding commit/abort for in-doubt transactions.',
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Heuristic rollback: participant unilaterally aborts after YES vote — inconsistency risk.',
        'Three-phase commit reduces blocking slightly — rarely used.',
        'Percolator model Google Spanner variant with prewrite.',
        'Modern alternative: saga + outbox, not 2PC across HTTP services.',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Strong atomicity across resources', 'Well understood XA tooling', 'All-or-nothing guarantee'],
    disadvantages: ['Blocking locks', 'Coordinator SPOF', 'Poor under network partition', 'Latency multiple RTTs'],
    alternatives: ['Saga pattern compensations', 'Single database local transaction', 'Eventual consistency + idempotency'],
    whenToUse: ['Tight coupling acceptable monolith split DB', 'Legacy enterprise XA', 'Short transactions low contention'],
    whenNotToUse: ['Microservices over HTTP', 'Long-running workflows', 'High availability during partitions'],
  },
  failureModes: [
    'Coordinator crash — participants blocked in prepared state',
    'Heuristic hazard mixed commit/abort',
    'Lock contention throughput collapse',
    'One slow participant stalls entire transaction',
    'Network partition — availability vs consistency conflict',
  ],
  production: {
    reliability: ['Coordinator HA with durable log', 'Timeout abort in-doubt transactions'],
    performance: ['Keep 2PC scope minimal duration', 'Avoid cross-region 2PC'],
    maintainability: ['Prefer saga for new microservice designs', 'Document XA datasources if legacy'],
  },
  interview: {
    expectations: ['Prepare and commit phases', 'Blocking problem', 'vs Saga', 'Why microservices avoid 2PC'],
    commonQuestions: ['Distributed transaction across 2 DBs?', '2PC failure modes?'],
    followUps: ['Coordinator dies after prepare?', 'XA in Spring?'],
    misconceptions: ['2PC works well over REST microservices', 'No blocking issues'],
    traps: ['Proposing 2PC for order saga across 5 services'],
    strongSignals: ['Blocking prepared state', 'Saga alternative', 'CAP partition tradeoff'],
  },
  keyTakeaways: [
    '2PC: prepare vote then commit/abort all participants.',
    'Blocking if coordinator fails after prepare.',
    'Rare in modern microservices — use sagas instead.',
    'XA/JTA implements 2PC for compatible databases.',
    'Trade availability for atomicity under failure.',
  ],
  interviewQuestions: [
    { level: 'basic', question: '2PC two phases?', answerHint: 'Prepare: participants vote ready; Commit: coordinator tells all commit or abort.' },
    { level: 'intermediate', question: 'Why microservices avoid 2PC?', answerHint: 'Blocking locks, coordinator SPOF, latency, poor partition tolerance — sagas preferred.' },
    { level: 'advanced', question: 'Coordinator crash after all YES votes?', answerHint: 'Participants blocked holding locks until coordinator recovers from log and completes commit/abort decision.' },
  ],
  flashcards: [
    { front: 'Prepare phase', back: 'Participants vote YES/NO and hold resources' },
    { front: 'Blocking', back: 'Prepared participants wait if coordinator unavailable' },
    { front: 'Coordinator', back: 'Orchestrates vote and final commit/abort decision' },
    { front: 'Saga alternative', back: 'Local TX + compensate instead of global 2PC' },
  ],
  quickRevision: ['Prepare then commit', 'All YES or abort', 'Blocking risk', 'Coordinator SPOF', 'Prefer saga today'],
}
