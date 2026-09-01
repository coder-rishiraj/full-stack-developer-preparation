import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Raft is a consensus algorithm for replicated logs — elect leader, append entries with majority ack, commit when index replicated on quorum — simpler to teach than Paxos.',
  whyExists: 'Distributed systems need agreed order of writes. Raft provides understandable leader-based replication for etcd, Consul, and education.',
  mentalModel: 'Class captain (leader) collects homework entries; deputies (followers) copy when majority acked; new election if captain absent.',
  howItWorks: [
    { type: 'list', items: [
      'Leader election: randomized timeout, vote, single leader per term.',
      'Log replication: client writes go to leader; AppendEntries RPC.',
      'Commit when entry on majority; apply to state machine.',
      'Safety: leader completeness, election restriction on votes.',
      'Followers catch up via nextIndex/backtrack on mismatch.',
    ] },
  ],
  example: [
    { type: 'paragraph', text: '3-node Raft: leader appends SET x=1; 2/3 ack → commit index 5; followers apply; leader crash → election → new leader continues from committed log.' },
  ],
  tradeoffs: {
    advantages: [
      'Understandable',
      'Proven in etcd',
    ],
    disadvantages: [
      'Write latency needs quorum',
      'Leader bottleneck',
    ],
    alternatives: [
      'Multi-Paxos',
      'ZAB in ZooKeeper',
    ],
    whenToUse: [
      'Strong consistency metadata',
      'Teaching consensus',
    ],
    whenNotToUse: [
      'Eventually consistent high write throughput alone',
    ],
  },
  failureModes: [
    'Split brain without proper quorum',
    'Uncommitted entries lost on leader change if misimplemented',
    'Clock not used but election timeout tuning matters',
  ],
  production: {
    reliability: [
      'Odd number nodes 3 or 5',
      'Persistent log on disk',
    ],
    performance: [
      'Batch AppendEntries',
    ],
    observability: [
      'Leader term and commit index metrics',
    ],
  },
  interview: {
    expectations: [
      'Leader election + log replication',
      'Quorum commit',
    ],
    commonQuestions: [
      'Raft vs Paxos?',
    ],
    followUps: [
      'What if leader partition?',
    ],
    misconceptions: [
      'Any node serves writes',
    ],
    traps: [
      'Even number nodes no tie break',
    ],
    strongSignals: [
      'Term, commit index, majority ack explained',
    ],
  },
  keyTakeaways: [
    'Leader handles writes',
    'Majority quorum commit',
    'Election on timeout',
    'Log matching property',
    'etcd uses Raft',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Raft purpose?', answerHint: 'Replicated consensus log with leader election.' },
    { level: 'intermediate', question: 'When entry committed?', answerHint: 'Replicated on majority of servers; then applied.' },
    { level: 'advanced', question: 'Leader partition minority?', answerHint: 'Minority leader cannot commit; majority side elects; minority steps down.' },
  ],
  flashcards: [
    { front: 'Term', back: 'Raft logical clock incrementing each election' },
    { front: 'Commit index', back: 'Highest log entry known replicated on majority' },
    { front: 'Quorum', back: 'Majority of nodes required for election and commit' },
  ],
  quickRevision: [
    'Leader log',
    'Majority commit',
    'Election timeout',
    'AppendEntries',
    '3/5 nodes',
  ],
}
