import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Agent state tracks conversation messages, plan progress, tool results, and session variables across loop iterations — persisted in DB/Redis for multi-request sessions.',
  whyExists: 'HTTP stateless; agents need durable thread state for resume, HITL pause, and audit.',
  mentalModel: 'Scratchpad dict: messages[], plan_step, user_id — load at start, save after each turn.',
  howItWorks: [
    { type: 'list', items: [
      'Message array is core state for LLM API',
      'Persist session_id → state blob',
      'Version state for optimistic concurrency',
      'Trim/summarize old turns in state',
      'Separate ephemeral vs durable fields',
    ] },
  ],
  example: [
    { type: 'code', language: 'typescript', code: 'interface SessionState {\n  messages: Message[];\n  plan?: string[];\n  step: number;\n}' },
  ],
  tradeoffs: {
    advantages: [
      'Resume sessions',
      'Debug replay',
    ],
    disadvantages: [
      'State bloat OOM context',
      'Concurrency conflicts',
    ],
    alternatives: [
      'Stateless single shot',
    ],
    whenToUse: [
      'Multi-turn assistants',
    ],
    whenNotToUse: [
      'One-shot queries',
    ],
  },
  failureModes: [
    'Lost state on crash mid-loop',
    'Race on parallel requests same session',
    'Storing secrets in client state',
  ],
  production: {
    reliability: [
      'Persist after each tool execution',
      'Session locking',
    ],
    security: [
      'Server-side state only',
    ],
  },
  interview: {
    expectations: [
      'What persists across turns',
      'Session storage',
    ],
    commonQuestions: [
      'Explain State',
    ],
    followUps: [
      'Production concerns?',
    ],
    misconceptions: [
      'Works in demo equals prod ready',
    ],
    traps: [
      'Missing security cap',
    ],
    strongSignals: [
      'Messages core state',
      'Persist session server-side',
      'Trim old turns',
    ],
  },
  keyTakeaways: [
    'Messages core state',
    'Persist session server-side',
    'Trim old turns',
    'Lock concurrent updates',
    'No secrets client-side',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Agent state contains?', answerHint: 'Messages, plan progress, session metadata.' },
    { level: 'intermediate', question: 'Where persist?', answerHint: 'Redis/DB keyed by session_id.' },
    { level: 'advanced', question: 'Parallel same session?', answerHint: 'Optimistic lock or queue requests per session.' },
  ],
  flashcards: [
    { front: 'Session state', back: 'Durable agent context across requests' },
    { front: 'State trim', back: 'Summarize/remove old messages to fit window' },
  ],
  quickRevision: [
    'messages[] core',
    'Server persist',
    'session_id key',
    'Trim/summarize',
    'Concurrency lock',
    'Replay debug',
  ],
}
