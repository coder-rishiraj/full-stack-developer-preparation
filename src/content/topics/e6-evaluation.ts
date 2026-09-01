import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Retrieval evaluation measures RAG search quality — recall@k, MRR, nDCG — on labeled query-document pairs before and after pipeline changes.',
  whyExists: 'Without metrics, chunking and embed tweaks are guesswork. Regressions ship silently to users.',
  mentalModel: 'Practice exam with answer key. Did retrieval bring the right textbook page before student writes essay?',
  howItWorks: [
    { type: 'list', items: [
      'Golden set: query → relevant chunk ids.',
      'Recall@k: relevant in top k?',
      'MRR: rank of first relevant hit.',
      'Run eval in CI on index config changes.',
      'Separate retrieval eval from generation eval.',
    ] },
  ],
  example: [
    { type: 'paragraph', text: '50 labeled support queries — baseline recall@5=0.78; new chunking 0.85 — ship. Drop to 0.71 — rollback.' },
  ],
  tradeoffs: {
    advantages: [
      'Objective pipeline tuning',
    ],
    disadvantages: [
      'Labeling golden set labor',
    ],
    alternatives: [
      'LLM-as-judge — noisier',
    ],
    whenToUse: [
      'Any RAG iteration',
    ],
    whenNotToUse: [
      'Skip only for throwaway prototype',
    ],
  },
  failureModes: [
    'Eval set not representative',
    'Only end-to-end LLM score confounds retrieval',
    'No CI regression gate',
  ],
  production: {
    observability: [
      'Dashboard recall trends',
      'Slice by product area',
    ],
    maintainability: [
      'Version golden sets in repo',
    ],
  },
  interview: {
    expectations: [
      'Recall@k MRR',
      'Retrieval vs gen eval',
    ],
    commonQuestions: [
      'Evaluate RAG retrieval?',
    ],
    followUps: [
      'Build golden set?',
    ],
    misconceptions: [
      'One good answer enough',
    ],
    traps: [
      'Only human vibe check',
    ],
    strongSignals: [
      'Labeled set + recall@k + CI',
    ],
  },
  keyTakeaways: [
    'Golden query-chunk labels',
    'Recall@k and MRR',
    'Eval retrieval separately',
    'CI regression on changes',
    'Representative test set',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Recall@k?', answerHint: 'Fraction of queries with relevant doc in top k results.' },
    { level: 'intermediate', question: 'Retrieval vs generation eval?', answerHint: 'Retrieval: right chunks fetched; generation: answer quality given chunks.' },
    { level: 'advanced', question: 'Golden set creation?', answerHint: 'Sample prod queries; annotators mark relevant chunks; iterate disagreements.' },
  ],
  flashcards: [
    { front: 'Recall@k', back: 'Hit rate — relevant in top k' },
    { front: 'MRR', back: 'Mean reciprocal rank of first relevant result' },
    { front: 'Golden set', back: 'Labeled queries with known relevant documents' },
  ],
  quickRevision: [
    'Recall@k',
    'MRR',
    'Golden labels',
    'Retrieval≠gen eval',
    'CI regression',
  ],
}
