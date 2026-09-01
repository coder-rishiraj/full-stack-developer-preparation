import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Offline evals run fixed datasets through pipeline without live traffic — measure quality/latency/cost before deploy; complement online A/B.',
  whyExists: 'Ship breaking changes safely. Offline catches regressions cheaply before users hit them.',
  mentalModel: 'Staging dress rehearsal: run golden set against candidate model/prompt; compare metrics to baseline.',
  howItWorks: [
    { type: 'list', items: [
      'Pin baseline scores in dashboard',
      'Eval harness calls full RAG+agent stack',
      'Report latency tokens cost per case',
      'Statistical significance on metric deltas',
      'Run in CI and nightly',
    ] },
  ],
  example: [
    { type: 'code', language: 'python', code: 'scores = run_eval(dataset=golden, pipeline=candidate)\nassert scores.accuracy >= baseline - 0.02' },
  ],
  tradeoffs: {
    advantages: [
      'Pre-deploy safety',
      'Cheap iteration',
    ],
    disadvantages: [
      'Sim-to-real gap',
      'Offline set not prod distribution',
    ],
    alternatives: [
      'Online only eval',
      'Manual smoke test',
    ],
    whenToUse: [
      'Every LLM release',
    ],
    whenNotToUse: [
      'Realtime-only systems',
    ],
  },
  failureModes: [
    'Eval mock tools not real APIs skew',
    'Ignore latency in offline',
    'Overfit hyperparams to golden',
  ],
  production: {
    reliability: [
      'Same infra as prod where possible',
      'Track eval env version',
    ],
  },
  interview: {
    expectations: [
      'Offline vs online',
      'CI eval harness',
    ],
    commonQuestions: [
      'Explain Offline Evaluations',
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
      'Fixed dataset pre-deploy',
      'Full stack harness',
      'Baseline comparison',
    ],
  },
  keyTakeaways: [
    'Fixed dataset pre-deploy',
    'Full stack harness',
    'Baseline comparison',
    'CI + nightly',
    'Metrics quality+cost+latency',
    'Sim-to-real aware',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Offline eval?', answerHint: 'Run benchmark pipeline without live users before ship.' },
    { level: 'intermediate', question: 'What to measure?', answerHint: 'Correctness, groundedness, latency, token cost.' },
    { level: 'advanced', question: 'Offline-online gap?', answerHint: 'Prod traffic distribution differs; monitor online too.' },
  ],
  flashcards: [
    { front: 'Offline eval', back: 'Benchmark run before production deploy' },
    { front: 'Baseline', back: 'Reference scores current prod must beat or match' },
  ],
  quickRevision: [
    'Golden set harness',
    'Pre-deploy gate',
    'Quality+cost+latency',
    'CI nightly',
    'Vs baseline',
    'Sim-to-real gap',
  ],
}
