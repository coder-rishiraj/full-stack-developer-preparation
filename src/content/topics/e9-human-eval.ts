import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Human evaluation uses trained raters or domain experts scoring outputs on rubrics — helpfulness, safety, accuracy — gold standard when automation insufficient.',
  whyExists: 'Automated metrics miss nuance, tone, safety. Humans calibrate judges and catch edge cases pre-release.',
  mentalModel: 'Focus group scoring each response 1-5 on rubric dimensions with guidelines.',
  howItWorks: [
    { type: 'list', items: [
      'Write rater guideline with examples',
      'Sample stratified outputs blind A/B',
      'Inter-rater agreement Cohen kappa',
      'Use results to calibrate LLM judge',
      'Continuous eval pipeline weekly batch',
    ] },
  ],
  example: [
    { type: 'code', language: 'text', code: 'Rubric: Accuracy 1-5, Tone 1-5, Safety pass/fail\nBlind compare Model A vs B on same prompts' },
  ],
  tradeoffs: {
    advantages: [
      'Captures nuance',
      'Calibrates automation',
    ],
    disadvantages: [
      'Expensive slow',
      'Rater drift inconsistency',
    ],
    alternatives: [
      'LLM judge only',
      'User thumbs aggregate',
    ],
    whenToUse: [
      'Launch gates',
      'Safety policy eval',
    ],
    whenNotToUse: [
      'High volume regression CI only',
    ],
  },
  failureModes: [
    'Rater guideline ambiguous',
    'Small sample wrong conclusion',
    'Rater sees model name bias',
  ],
  production: {
    cost: [
      'Sample size power analysis',
      'Offshore vs expert mix',
    ],
  },
  interview: {
    expectations: [
      'When need humans',
      'Inter-rater agreement',
    ],
    commonQuestions: [
      'Explain Human Evaluation',
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
      'Rubric + guidelines',
      'Blind A/B',
      'Inter-rater kappa',
    ],
  },
  keyTakeaways: [
    'Rubric + guidelines',
    'Blind A/B',
    'Inter-rater kappa',
    'Calibrate LLM judge',
    'Stratified sampling',
    'Periodic batches',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Why human eval?', answerHint: 'Nuanced quality automation misses; gold standard.' },
    { level: 'intermediate', question: 'Inter-rater agreement?', answerHint: 'Cohen kappa; resolve guideline gaps.' },
    { level: 'advanced', question: 'Humans + LLM judge?', answerHint: 'Humans label subset; train/calibrate judge; scale.' },
  ],
  flashcards: [
    { front: 'Rater rubric', back: 'Scoring criteria with anchored examples' },
    { front: 'Cohen kappa', back: 'Inter-rater agreement statistic' },
  ],
  quickRevision: [
    'Expert rubrics',
    'Blind scoring',
    'Kappa agreement',
    'Calibrate judges',
    'Stratified sample',
    'Launch gate',
  ],
}
