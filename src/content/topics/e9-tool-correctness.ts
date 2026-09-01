import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Tool-call correctness evals whether agent picked right tool with valid args — exact match on name/params, schema validation pass rate, task success after execution.',
  whyExists: 'Wrong tool or args breaks agents silently. Need metrics beyond final answer text.',
  mentalModel: 'Grade API call log: expected search_users(name=Alice) vs actual list_orders().',
  howItWorks: [
    { type: 'list', items: [
      'Gold trace: expected tool sequence and args',
      'Score tool name accuracy, arg F1, JSON schema valid',
      'End-to-end task success after real/mock tools',
      'Mock tools for deterministic CI',
      'Category errors: wrong tool vs wrong args vs skip',
    ] },
  ],
  example: [
    { type: 'code', language: 'json', code: '{"expect":{"tool":"get_weather","args":{"city":"Paris"}},"actual":{"tool":"get_weather","args":{"city":"Paris"}},"pass":true}' },
  ],
  tradeoffs: {
    advantages: [
      'Debug agent failures',
      'CI on tool-using agents',
    ],
    disadvantages: [
      'Mock vs real tool gap',
      'Brittle exact arg match',
    ],
    alternatives: [
      'Final answer string match only',
      'Manual log reading',
    ],
    whenToUse: [
      'Function-calling agents',
    ],
    whenNotToUse: [
      'Pure chatbots',
    ],
  },
  failureModes: [
    'Correct tool wrong arg still fails task',
    'Overfit to mock handlers',
    'Ignore optional arg defaults',
  ],
  production: {
    reliability: [
      'Mock tools mirror prod schemas',
      'Validate args with same JSON schema as prod',
    ],
  },
  interview: {
    expectations: [
      'Tool name and args eval',
      'Mock for CI',
    ],
    commonQuestions: [
      'Explain Tool-Call Correctness',
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
      'Gold expected tool+args',
      'Schema validation rate',
      'Mock tools CI',
    ],
  },
  keyTakeaways: [
    'Gold expected tool+args',
    'Schema validation rate',
    'Mock tools CI',
    'Wrong tool vs wrong args',
    'End-to-end task success',
    'Trace logging',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Tool correctness?', answerHint: 'Right tool name and valid args for task.' },
    { level: 'intermediate', question: 'Eval in CI?', answerHint: 'Mock tools; gold traces; schema validate.' },
    { level: 'advanced', question: 'Arg partial match?', answerHint: 'Field-level F1; required vs optional; semantic arg match.' },
  ],
  flashcards: [
    { front: 'Gold trace', back: 'Expected tool calls and arguments for eval case' },
    { front: 'Schema pass rate', back: 'Fraction tool args validating JSON schema' },
  ],
  quickRevision: [
    'Gold tool+args',
    'Name + arg metrics',
    'Mock CI tools',
    'Schema validate',
    'E2E task success',
    'Error taxonomy',
  ],
}
