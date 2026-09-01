import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Golden datasets are curated fixed eval sets with input, expected output, metadata — regression suite run on every prompt/model/deploy change.',
  whyExists: 'Ad hoc eval not reproducible. Golden set is ground truth benchmark versioned with product.',
  mentalModel: 'Unit test fixtures for LLM: 200 representative queries with expected behavior locked.',
  howItWorks: [
    { type: 'list', items: [
      'Curate from prod logs stratified by intent',
      'Annotate expected answer or rubric',
      'Store in git with semver',
      'CI runs full golden on PR',
      'Block deploy on regression threshold',
    ] },
  ],
  example: [
    { type: 'code', language: 'json', code: '[{"id":"refund-1","input":"How refund?","expect_contains":["30 days"],"tags":["policy"]}]' },
  ],
  tradeoffs: {
    advantages: [
      'Reproducible benchmarks',
      'CI gate',
    ],
    disadvantages: [
      'Maintenance cost',
      'Overfit to golden set',
    ],
    alternatives: [
      'Live prod-only eval',
      'Random manual spot checks',
    ],
    whenToUse: [
      'All production LLM teams',
    ],
    whenNotToUse: [
      'Throwaway prototypes',
    ],
  },
  failureModes: [
    'Golden stale vs product',
    'Too small false confidence',
    'Leaking PII in git',
  ],
  production: {
    maintainability: [
      'Quarterly refresh from prod failures',
      'PII scrub pipeline',
    ],
  },
  interview: {
    expectations: [
      'Curate golden set',
      'CI regression',
    ],
    commonQuestions: [
      'Explain Golden Datasets',
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
      'Fixed curated eval set',
      'Version in git',
      'CI every change',
    ],
  },
  keyTakeaways: [
    'Fixed curated eval set',
    'Version in git',
    'CI every change',
    'Stratify by intent',
    'Refresh periodically',
    'Scrub PII',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Golden dataset purpose?', answerHint: 'Fixed benchmark detect regressions on changes.' },
    { level: 'intermediate', question: 'Build from where?', answerHint: 'Prod failures, support tickets, stratified sampling.' },
    { level: 'advanced', question: 'Avoid overfit?', answerHint: 'Holdout set; rotate; monitor prod drift.' },
  ],
  flashcards: [
    { front: 'Golden set', back: 'Versioned canonical eval examples' },
    { front: 'Regression gate', back: 'Block release if golden metrics drop' },
  ],
  quickRevision: [
    'Curated fixed cases',
    'Git versioned',
    'CI on PR',
    'Tags by intent',
    'Refresh quarterly',
    'PII scrub',
  ],
}
