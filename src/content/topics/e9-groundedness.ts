import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Groundedness checks if LLM answer supported by retrieved context — no unsupported claims, citations match sources, faithfulness to provided documents.',
  whyExists: 'RAG fails when model hallucinates beyond context. Groundedness metrics catch unfaithful generation.',
  mentalModel: 'Open-book exam: every claim must cite passage; grader flags invented facts.',
  howItWorks: [
    { type: 'list', items: [
      'Retrieve context → generate → check claims ⊆ context',
      'NLI entailment models detect unsupported sentences',
      'Citation link validation',
      'Human rubric faithful/partial/unfaithful',
      'Track groundedness vs retrieval recall jointly',
    ] },
  ],
  example: [
    { type: 'code', language: 'text', code: 'Context: Refund within 30 days.\nAnswer: Refund within 30 days. ✓\nAnswer: Refund within 90 days. ✗ ungrounded' },
  ],
  tradeoffs: {
    advantages: [
      'Reduces hallucination in RAG',
      'User trust via citations',
    ],
    disadvantages: [
      'NLI false positives',
      'Chunking misses support',
    ],
    alternatives: [
      'Hope prompt says cite sources',
      'User manual review only',
    ],
    whenToUse: [
      'Enterprise RAG',
      'Legal/medical assist',
    ],
    whenNotToUse: [
      'Creative writing no sources',
    ],
  },
  failureModes: [
    'Citation to wrong chunk',
    'Partial grounding mixed facts',
    'Empty retrieval still answers',
  ],
  production: {
    reliability: [
      'Refuse if no context support',
      'Show citations UI',
    ],
  },
  interview: {
    expectations: [
      'Faithfulness to context',
      'Citation validation',
    ],
    commonQuestions: [
      'Explain Groundedness',
    ],
    followUps: [
      'How in CI?',
    ],
    misconceptions: [
      'One metric enough',
    ],
    traps: [
      'Eval only happy path',
    ],
    strongSignals: [
      'Claims supported by context',
      'NLI faithfulness scores',
      'Validate citations',
    ],
  },
  keyTakeaways: [
    'Claims supported by context',
    'NLI faithfulness scores',
    'Validate citations',
    'Joint with retrieval recall',
    'Refuse if ungrounded',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Groundedness meaning?', answerHint: 'Answer faithful to retrieved/provided context.' },
    { level: 'intermediate', question: 'Measure how?', answerHint: 'NLI entailment, claim decomposition, citation check.' },
    { level: 'advanced', question: 'Good retrieval bad groundedness?', answerHint: 'Model ignores context; tune prompt; smaller creative temperature.' },
  ],
  flashcards: [
    { front: 'Faithfulness', back: 'Generation only uses provided context claims' },
    { front: 'NLI check', back: 'Entailment model verifies claim supported by chunk' },
  ],
  quickRevision: [
    'Claims ⊆ context',
    'NLI faithfulness',
    'Citation verify',
    'With retrieval metrics',
    'Refuse empty context',
    'Decompose claims',
  ],
}
