import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'LLM-as-judge uses a strong model to score or compare outputs — relevance, groundedness, toxicity, pairwise preference — automating eval at scale with known biases.',
  whyExists: 'Human labeling expensive. Judge model scales eval pipelines but must be calibrated against human gold and not used alone for security.',
  mentalModel: 'Senior editor grades junior drafts — fast but has taste biases; calibrate against human committee periodically.',
  howItWorks: [
    { type: 'list', items: [
      'Rubric prompt: score 1-5 on criteria with justification.',
      'Pairwise: compare answer A vs B blind.',
      'Provide reference answer or gold chunks for groundedness.',
      'Aggregate scores; track judge-model version.',
      'Calibrate vs human labels on sample.',
    ] },
  ],
  example: [
    { type: 'paragraph', text: 'GPT-4o judges support answers on groundedness 1-5 using retrieved chunks; weekly 100-sample human agreement check; swap judge if correlation drops.' },
  ],
  tradeoffs: {
    advantages: [
      'Scalable eval',
      'Fast iteration signal',
    ],
    disadvantages: [
      'Position bias',
      'Self-preference',
      'Cost',
    ],
    alternatives: [
      'Human eval only',
      'Rule-based metrics',
    ],
    whenToUse: [
      'RAG quality monitoring',
      'Prompt iteration',
    ],
    whenNotToUse: [
      'Sole security gate',
    ],
  },
  failureModes: [
    'Judge same model as generator — bias',
    'No blind pairwise order swap',
    'Judge without retrieval context',
  ],
  production: {
    reliability: [
      'Separate judge model',
      'Human calibration loop',
    ],
    cost: [
      'Sample not 100% traffic',
    ],
    observability: [
      'Judge score distributions',
    ],
  },
  interview: {
    expectations: [
      'Biases known',
      'Calibration',
    ],
    commonQuestions: [
      'LLM-as-judge pitfalls?',
    ],
    followUps: [
      'Pairwise design?',
    ],
    misconceptions: [
      'Judge replaces humans entirely',
    ],
    traps: [
      'Judge without context for groundedness',
    ],
    strongSignals: [
      'Blind pairwise + human cal + separate model',
    ],
  },
  keyTakeaways: [
    'Automated scoring at scale',
    'Separate judge model',
    'Pairwise reduces scale bias',
    'Calibrate vs humans',
    'Not for security alone',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'LLM-as-judge?', answerHint: 'Use LLM to score/compare outputs on rubric.' },
    { level: 'intermediate', question: 'Common biases?', answerHint: 'Position bias, verbosity preference, self-enhancement.' },
    { level: 'advanced', question: 'Groundedness judge setup?', answerHint: 'Provide gold chunks; ask cite-supported; binary fail if unsupported claim.' },
  ],
  flashcards: [
    { front: 'Position bias', back: 'Judge favors first or second answer in pairwise' },
    { front: 'Pairwise eval', back: 'Compare two outputs blind order swapped' },
    { front: 'Human calibration', back: 'Measure judge-human agreement on sample' },
  ],
  quickRevision: [
    'Separate judge',
    'Rubric prompt',
    'Pairwise blind',
    'Human calibrate',
    'Not security only',
  ],
}
