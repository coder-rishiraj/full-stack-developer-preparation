import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Answer correctness measures whether LLM output is factually and logically right vs reference — exact match, LLM-as-judge, human rubric, task-specific validators.',
  whyExists: 'Accuracy is core product metric. Need automated checks beyond vibes for regressions on prompt/model changes.',
  mentalModel: 'Grade exam: compare answer to gold key or rubric criteria; partial credit via semantic similarity.',
  howItWorks: [
    { type: 'list', items: [
      'Define gold answer or rubric per test case',
      'Automated: EM, BLEU, ROUGE, semantic embedding sim',
      'LLM judge with structured score + rationale',
      'Human spot-check sample',
      'Track correctness by category',
    ] },
  ],
  example: [
    { type: 'code', language: 'json', code: '{"query":"2+2?","gold":"4","model":"4","correct":true}' },
  ],
  tradeoffs: {
    advantages: [
      'Objective regression signal',
      'Category breakdown',
    ],
    disadvantages: [
      'LLM judge bias',
      'Gold answer maintenance',
    ],
    alternatives: [
      'Manual review only',
      'User thumbs only',
    ],
    whenToUse: [
      'QA bots',
      'Math/code tasks with verifier',
    ],
    whenNotToUse: [
      'Subjective creative writing',
    ],
  },
  failureModes: [
    'Exact match on paraphrase false negative',
    'Judge prefers verbose wrong answer',
    'Stale gold after product change',
  ],
  production: {
    reliability: [
      'Version gold with prompt',
      'Calibrate judge vs human',
    ],
  },
  interview: {
    expectations: [
      'Metrics for correctness',
      'Gold dataset link',
    ],
    commonQuestions: [
      'Explain Answer Correctness',
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
      'Gold or rubric per case',
      'Automate where possible',
      'LLM judge cautiously',
    ],
  },
  keyTakeaways: [
    'Gold or rubric per case',
    'Automate where possible',
    'LLM judge cautiously',
    'Category metrics',
    'Version with prompt',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Measure answer correctness?', answerHint: 'Compare to reference or rubric; task validators.' },
    { level: 'intermediate', question: 'LLM-as-judge risks?', answerHint: 'Bias, position bias; calibrate vs humans.' },
    { level: 'advanced', question: 'Partial credit?', answerHint: 'Semantic sim, rubric scores, structured JSON field match.' },
  ],
  flashcards: [
    { front: 'Gold answer', back: 'Reference correct output for eval case' },
    { front: 'LLM judge', back: 'Model scores another model output vs criteria' },
  ],
  quickRevision: [
    'Gold/rubric',
    'EM vs semantic',
    'LLM judge calibrate',
    'By category',
    'Version gold',
    'Validators code/math',
  ],
}
