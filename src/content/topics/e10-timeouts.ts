import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Timeouts bound wait time for LLM API calls, tool executions, retrieval, and end-to-end user requests — preventing hung connections and enabling fallback paths.',
  whyExists: 'Unbounded waits tie up workers and frustrate users. Layered timeouts isolate slow dependencies and trigger retries or fallbacks.',
  mentalModel: 'Egg timer per step — when it rings, move on or serve alternative; total meal time capped too.',
  howItWorks: [
    { type: 'list', items: [
      'Connect vs read timeout on HTTP client.',
      'Per-tool timeout shorter than total request budget.',
      'End-to-end gateway timeout < client timeout.',
      'Cancel upstream on overall deadline exceeded.',
      'Log timeout reason for tuning.',
    ] },
  ],
  example: [
    { type: 'paragraph', text: 'Total 45s budget: retrieve 3s, rerank 2s, LLM 35s, tools 5s each max 2 parallel; exceed → fallback mini model or cached response.' },
  ],
  tradeoffs: {
    advantages: [
      'Predictable p99',
      'Resource release',
    ],
    disadvantages: [
      'Too aggressive cuts valid long answers',
    ],
    alternatives: [
      'Async for long jobs',
    ],
    whenToUse: [
      'Every sync LLM path',
    ],
    whenNotToUse: [
      'Batch jobs with queue SLA instead',
    ],
  },
  failureModes: [
    'Single global timeout too short for RAG+LLM',
    'No cancel on timeout — leak connections',
    'Tool timeout missing — hung agent',
  ],
  production: {
    reliability: [
      'Context deadline propagation',
    ],
    performance: [
      'Tune from p99 latency data',
    ],
    observability: [
      'timeout_by_stage metric',
    ],
  },
  interview: {
    expectations: [
      'Layered budgets',
      'Cancel upstream',
    ],
    commonQuestions: [
      'LLM timeout values?',
    ],
    followUps: [
      'Agent total budget?',
    ],
    misconceptions: [
      'One timeout enough',
    ],
    traps: [
      'Infinite tool wait',
    ],
    strongSignals: [
      'Budget per stage + cancel + metrics',
    ],
  },
  keyTakeaways: [
    'Layer connect/read/total timeouts',
    'Tool timeouts per call',
    'Cancel upstream on deadline',
    'Async if exceeds sync budget',
    'Metric timeouts by stage',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Why LLM timeouts?', answerHint: 'Prevent hung requests; free workers; trigger fallback.' },
    { level: 'intermediate', question: 'Timeout layers?', answerHint: 'Retrieve, LLM, tool, gateway total — nested budgets.' },
    { level: 'advanced', question: 'Context deadline in Go/node?', answerHint: 'Propagate cancellation to all subcalls; abort provider stream.' },
  ],
  flashcards: [
    { front: 'Read timeout', back: 'Max wait for response bytes after connect' },
    { front: 'Deadline propagation', back: 'Child calls inherit remaining parent budget' },
    { front: 'Tool timeout', back: 'Per-tool cap preventing agent hang' },
  ],
  quickRevision: [
    'Layer timeouts',
    'Tool caps',
    'Cancel upstream',
    'Async long jobs',
    'Stage metrics',
  ],
}
