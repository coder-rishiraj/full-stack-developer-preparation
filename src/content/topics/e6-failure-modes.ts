import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'RAG failure modes: retrieval misses, wrong chunks, stale index, injection in docs, context overflow, and ungrounded generation despite RAG — systematic prod pitfalls.',
  whyExists: 'RAG demos work; prod fails quietly. Engineers must recognize failure patterns and monitoring signals.',
  mentalModel: 'Broken supply chain — wrong parts delivered, expired inventory, or assembler ignores parts and improvises.',
  howItWorks: [
    { type: 'list', items: [
      'Retrieval miss: relevant doc not in top-k.',
      'Wrong chunk: similar but incorrect passage.',
      'Stale index: outdated policy retrieved.',
      'Context overflow: key chunk truncated out.',
      'Ungrounded gen: model ignores retrieved context.',
      'Injection: malicious doc instructions.',
    ] },
  ],
  example: [
    { type: 'paragraph', text: 'User asks new 2025 policy; index has 2023 chunk only — confident wrong answer. Fix: freshness metadata + version filter + abstain if low score.' },
  ],
  tradeoffs: {
    advantages: [
      'Failure taxonomy guides monitoring',
    ],
    disadvantages: [
      'Many modes need layered fixes',
    ],
    alternatives: [
      'Human escalation path always',
    ],
    whenToUse: [
      'Design and ops review',
    ],
    whenNotToUse: [
      'Ignore because RAG demo worked',
    ],
  },
  failureModes: [
    'Single metric blind spot',
    'No abstain on low retrieval score',
    'No freshness in index',
  ],
  production: {
    reliability: [
      'Score threshold abstain',
      'Freshness TTL re-ingest',
    ],
    observability: [
      'Log retrieval ids and scores',
      'Track ungrounded answer rate',
    ],
    security: [
      'Treat docs as untrusted',
    ],
  },
  interview: {
    expectations: [
      'Name 5+ modes',
      'Mitigations each',
    ],
    commonQuestions: [
      'RAG fails how?',
    ],
    followUps: [
      'Detect miss?',
      'Stale data?',
    ],
    misconceptions: [
      'RAG eliminates hallucination',
    ],
    traps: [
      'Only tune prompt not retrieval',
    ],
    strongSignals: [
      'Abstain + eval + hybrid + freshness',
    ],
  },
  keyTakeaways: [
    'Miss vs wrong chunk vs stale',
    'Low score → abstain',
    'Monitor retrieval logged',
    'Hybrid improves recall',
    'Validate grounding',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Common RAG failures?', answerHint: 'Retrieval miss, wrong chunk, stale data, ungrounded answer.' },
    { level: 'intermediate', question: 'Mitigate retrieval miss?', answerHint: 'Hybrid search, rerank, query expansion, chunk tuning, eval recall.' },
    { level: 'advanced', question: 'Detect ungrounded answer?', answerHint: 'Citation check, NLI vs chunks, LLM judge, user feedback, abstain low similarity.' },
  ],
  flashcards: [
    { front: 'Retrieval miss', back: 'Relevant document not in top-k results' },
    { front: 'Stale index', back: 'Outdated content retrieved as current truth' },
    { front: 'Abstain', back: 'Refuse answer when retrieval confidence too low' },
  ],
  quickRevision: [
    'Miss/wrong/stale',
    'Abstain low score',
    'Log retrieval',
    'Hybrid+rerank',
    'Grounding check',
  ],
}
