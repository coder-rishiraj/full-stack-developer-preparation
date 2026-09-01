import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Messages are role-tagged conversation turns sent to chat APIs: system (behavior rules), user (human input), assistant (model prior turns), tool (function results). Order and content shape model behavior.',
  whyExists: 'Single prompt string insufficient for multi-turn tools and persistent instructions. Role separation lets providers apply safety and formatting per role.',
  mentalModel: 'Script with speaker labels. System = director notes. User/assistant = dialogue. Tool = prop results fed back.',
  howItWorks: [
    { type: 'list', items: [
      'system: high-priority instructions; often first.',
      'user: end-user or synthetic test input.',
      'assistant: previous model outputs in history.',
      'tool: JSON results after function calls.',
      'Some APIs merge system into developer role.',
    ] },
  ],
  example: [
    { type: 'paragraph', text: 'system: Answer only from provided context. user: question. assistant+tool: prior tool lookup. user: follow-up — model continues with tool context.' },
  ],
  tradeoffs: {
    advantages: [
      'Clear multi-turn + tools',
      'Provider optimizations per role',
    ],
    disadvantages: [
      'History grows token cost',
      'Role confusion if misordered',
    ],
    alternatives: [
      'Single user message with XML tags',
    ],
    whenToUse: [
      'All chat API integrations',
    ],
    whenNotToUse: [
      'Legacy completion API without roles',
    ],
  },
  failureModes: [
    'System prompt after user — weaker adherence',
    'Unbounded history blowup',
    'Tool message without matching call',
  ],
  production: {
    cost: [
      'Summarize/prune old turns',
      'Stable system prefix for caching',
    ],
    reliability: [
      'Validate message array shape pre-send',
    ],
  },
  interview: {
    expectations: [
      'Four roles',
      'History management',
    ],
    commonQuestions: [
      'system vs user?',
    ],
    followUps: [
      'Tool message flow?',
    ],
    misconceptions: [
      'Model remembers without resending',
    ],
    traps: [
      'Huge chat log every call',
    ],
    strongSignals: [
      'System first',
      'Prune history',
    ],
  },
  keyTakeaways: [
    'Roles: system/user/assistant/tool',
    'System sets behavior',
    'Resend history each call',
    'Tool messages follow calls',
    'Prune to save tokens',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Message roles?', answerHint: 'system instructions, user input, assistant output, tool results.' },
    { level: 'intermediate', question: 'Why system separate?', answerHint: 'Higher priority behavior rules; provider may treat differently.' },
    { level: 'advanced', question: 'Multi-turn token control?', answerHint: 'Summarize old turns, sliding window, store facts externally.' },
  ],
  flashcards: [
    { front: 'system message', back: 'Persistent behavior and policy instructions' },
    { front: 'tool message', back: 'Function result fed back to model' },
    { front: 'Message history', back: 'Resent each request in stateless APIs' },
  ],
  quickRevision: [
    'Four roles',
    'System first',
    'Resend history',
    'Prune tokens',
    'Tool after call',
  ],
}
