import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'LLM regression testing detects metric drops when prompts, models, or retrieval change — compare candidate vs baseline on golden set with statistical thresholds.',
  whyExists: 'Silent quality decay on upgrade. Regression suite blocks bad releases like unit tests.',
  mentalModel: 'Before/after screenshot diff but for answers: same inputs must not get worse beyond tolerance.',
  howItWorks: [
    { type: 'list', items: [
      'Automate eval on every PR touching prompts/models',
      'Define fail thresholds per metric',
      'Track trend over time not single point',
      'Bisect which change caused drop',
      'Include edge cases from incident postmortems',
    ] },
  ],
  example: [
    { type: 'code', language: 'yaml', code: 'regression:\n  accuracy: { min: 0.92, delta_from_baseline: -0.01 }\n  groundedness: { min: 0.88 }' },
  ],
  tradeoffs: {
    advantages: [
      'Release confidence',
      'Catch prompt typos',
    ],
    disadvantages: [
      'Flaky LLM nondeterminism',
      'Threshold tuning fatigue',
    ],
    alternatives: [
      'Manual QA before ship',
      'Manual smoke test',
    ],
    whenToUse: [
      'Production LLM CI',
    ],
    whenNotToUse: [
      'Experimental notebooks',
    ],
  },
  failureModes: [
    'Temperature>0 flaky CI',
    'Threshold too tight blocks good changes',
    'Only happy path golden',
  ],
  production: {
    reliability: [
      'temperature=0 for regression runs',
      'Multiple seeds if needed',
    ],
  },
  interview: {
    expectations: [
      'Regression gate CI',
      'Threshold design',
    ],
    commonQuestions: [
      'Explain Regression Testing',
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
      'Golden set every PR',
      'Fail thresholds',
      'temperature=0 stable',
    ],
  },
  keyTakeaways: [
    'Golden set every PR',
    'Fail thresholds',
    'temperature=0 stable',
    'Trend dashboards',
    'Add cases from incidents',
    'Bisect changes',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'LLM regression test?', answerHint: 'Compare new vs baseline on fixed set; fail if worse.' },
    { level: 'intermediate', question: 'Flaky scores?', answerHint: 'temperature=0; multiple runs; median score.' },
    { level: 'advanced', question: 'Set thresholds?', answerHint: 'Business tolerance; stat sig; separate critical cases hard fail.' },
  ],
  flashcards: [
    { front: 'Regression threshold', back: 'Min acceptable metric vs baseline' },
    { front: 'temperature=0', back: 'Deterministic runs for stable CI' },
  ],
  quickRevision: [
    'CI golden run',
    'Baseline delta',
    'Hard fail thresholds',
    'temp=0',
    'Incident cases added',
    'Trend monitor',
  ],
}
