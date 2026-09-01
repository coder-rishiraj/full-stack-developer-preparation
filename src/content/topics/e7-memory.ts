import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Agent memory spans short-term conversation context, long-term user facts in vector/store, and episodic summaries — retrieval augments prompt beyond fixed window.',
  whyExists: 'Context windows finite. Agents need remember preferences and past sessions across turns and days.',
  mentalModel: 'Notebook: recent messages in RAM; important facts filed in drawer; retrieve relevant notes each turn.',
  howItWorks: [
    { type: 'list', items: [
      'Short-term: sliding window + summarization',
      'Long-term: embed facts user_id keyed store',
      'Retrieve top-k memories per query',
      'Write memory tool after explicit consent',
      'TTL and delete for GDPR',
    ] },
  ],
  example: [
    { type: 'code', language: 'python', code: '# Retrieve\nmemories = store.search(user_id, query_emb, k=5)\n# Inject into system prompt block' },
  ],
  tradeoffs: {
    advantages: [
      'Personalization',
      'Cross-session continuity',
    ],
    disadvantages: [
      'Stale wrong memories',
      'Privacy sensitivity',
    ],
    alternatives: [
      'Stateless each request',
      'Full transcript forever',
    ],
    whenToUse: [
      'Assistants',
      'Support with history',
    ],
    whenNotToUse: [
      'Anonymous one-shot',
    ],
  },
  failureModes: [
    'Memory injection prompt injection vector',
    'Never expiring PII memories',
    'Retrieve irrelevant memories noise',
  ],
  production: {
    security: [
      'User consent for long-term memory',
      'Delete API',
    ],
    performance: [
      'Cap memories injected per turn',
    ],
  },
  interview: {
    expectations: [
      'Short vs long-term',
      'Retrieval each turn',
    ],
    commonQuestions: [
      'Explain Memory Concepts',
    ],
    followUps: [
      'Production concerns?',
    ],
    misconceptions: [
      'Works in demo equals prod ready',
    ],
    traps: [
      'Missing security cap',
    ],
    strongSignals: [
      'Window + summarize short-term',
      'Vector store long-term',
      'Retrieve per query',
    ],
  },
  keyTakeaways: [
    'Window + summarize short-term',
    'Vector store long-term',
    'Retrieve per query',
    'Consent + delete',
    'Avoid memory poisoning',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Short vs long memory?', answerHint: 'Short: current chat; long: persisted facts across sessions.' },
    { level: 'intermediate', question: 'When write memory?', answerHint: 'Explicit facts user asked to remember; not every message.' },
    { level: 'advanced', question: 'Memory poisoning?', answerHint: 'Validate writes; separate user vs system memory.' },
  ],
  flashcards: [
    { front: 'Episodic summary', back: 'Compressed past conversation stored for retrieval' },
    { front: 'Memory retrieval', back: 'Top-k relevant facts injected each turn' },
  ],
  quickRevision: [
    'Short window + summary',
    'Long-term vector store',
    'Retrieve each turn',
    'Consent GDPR',
    'TTL delete',
    'Poisoning risk',
  ],
}
