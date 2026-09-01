import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Embedding models for RAG — selecting bi-encoders (OpenAI, Cohere, BGE, E5) by quality, dimension, latency, cost, multilingual, and domain fit for indexing and query.',
  whyExists: 'Wrong model hurts recall; oversized dims waste storage. Must match index/query and re-embed on change.',
  mentalModel: 'Choose lens quality for camera — sharper costs more; must same lens for catalog and lookup.',
  howItWorks: [
    { type: 'list', items: [
      'Evaluate recall@k on golden queries.',
      'Compare small vs large dims — quality/storage.',
      'Multilingual models if needed.',
      'Open vs API: ops vs quality tradeoff.',
      'Version and dimension in index metadata.',
    ] },
  ],
  example: [
    { type: 'paragraph', text: 'English support KB: text-embedding-3-small 1536d; eval shows 94% recall@5 vs large at 96% — small wins on cost.' },
  ],
  tradeoffs: {
    advantages: [
      'Task-tuned selection improves RAG',
    ],
    disadvantages: [
      'Eval effort',
      'Vendor lock-in for API embeds',
    ],
    alternatives: [
      'Open source self-host',
      'LLM last-layer embed — slower',
    ],
    whenToUse: [
      'Before production RAG launch',
    ],
    whenNotToUse: [
      'Switch weekly without re-embed plan',
    ],
  },
  failureModes: [
    'No eval between models',
    'Mismatch query/index model',
    'English model on multilingual docs',
  ],
  production: {
    cost: [
      'Batch embed; cache queries',
      'Right-size dim',
    ],
    reliability: [
      'Model name in index config',
      'Re-embed runbook',
    ],
  },
  interview: {
    expectations: [
      'Eval-driven pick',
      'Re-embed on change',
    ],
    commonQuestions: [
      'Pick embedding model?',
      'Small vs large?',
    ],
    followUps: [
      'Open source vs API?',
    ],
    misconceptions: [
      'Largest always best ROI',
    ],
    traps: [
      'Change model no re-index',
    ],
    strongSignals: [
      'Golden set recall',
      'Version metadata',
    ],
  },
  keyTakeaways: [
    'Eval on your queries',
    'Same model index/query',
    'Dim vs quality tradeoff',
    'Version indexes',
    'Re-embed migration plan',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Bi-encoder for RAG?', answerHint: 'Separate encode query and docs — fast ANN retrieval.' },
    { level: 'intermediate', question: 'Small vs large embed model?', answerHint: 'Eval recall@k and cost; large if margin matters and budget allows.' },
    { level: 'advanced', question: 'Model change migration?', answerHint: 'Dual index, background re-embed, cutover flag, rollback.' },
  ],
  flashcards: [
    { front: 'text-embedding-3-small', back: 'Cost-effective OpenAI embed option — eval quality' },
    { front: 'Matryoshka dims', back: 'Some models support truncating dims with graceful degradation' },
    { front: 'Re-embed', back: 'Required when changing embedding model version' },
  ],
  quickRevision: [
    'Eval recall@k',
    'Match index/query',
    'Dim cost trade',
    'Version stamp',
    'Re-embed plan',
  ],
}
