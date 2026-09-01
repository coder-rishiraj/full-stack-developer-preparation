import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Tool calling lets LLM emit structured function requests with JSON args validated against schemas; app executes server-side and returns tool role messages.',
  whyExists: 'LLMs cannot access live systems alone. Tools bridge reasoning to APIs and databases safely.',
  mentalModel: 'Model requests intern to run function — app runs it — returns result — model answers.',
  howItWorks: [
    { type: 'list', items: [
      'Register tools with name, description, parameters schema',
      'Model returns tool_calls in response',
      'Validate args; execute handler',
      'Append tool message with result',
      'Loop until final answer',
    ] },
  ],
  example: [
    { type: 'code', language: 'typescript', code: 'if (msg.tool_calls) {\n  for (const tc of msg.tool_calls) {\n    const result = await handlers[tc.name](parse(tc.arguments));\n    messages.push({ role: \'tool\', tool_call_id: tc.id, content: JSON.stringify(result) });\n  }\n}' },
  ],
  tradeoffs: {
    advantages: [
      'Live data and actions',
      'Structured args',
    ],
    disadvantages: [
      'Security if over-permissioned',
      'Multi-turn latency',
    ],
    alternatives: [
      'ReAct string parsing',
      'RAG only',
    ],
    whenToUse: [
      'Agents with APIs',
    ],
    whenNotToUse: [
      'Static knowledge only',
    ],
  },
  failureModes: [
    'Executing untrusted args',
    'Missing description → wrong tool',
    'Infinite tool loop',
  ],
  production: {
    security: [
      'Allowlist tools',
      'Validate schema',
    ],
    reliability: [
      'Max iterations cap',
    ],
  },
  interview: {
    expectations: [
      'Tool loop flow',
      'Server executes',
    ],
    commonQuestions: [
      'Explain Tool Calling',
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
      'Model proposes tool_calls',
      'Server executes',
      'Tool role results',
    ],
  },
  keyTakeaways: [
    'Model proposes tool_calls',
    'Server executes',
    'Tool role results',
    'Schema validate',
    'Cap iterations',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Tool calling loop?', answerHint: 'Model requests → app runs → result → model answers.' },
    { level: 'intermediate', question: 'Security essentials?', answerHint: 'Allowlist, validate args, least privilege.' },
    { level: 'advanced', question: 'Tools vs RAG?', answerHint: 'RAG static chunks; tools live systems and mutations.' },
  ],
  flashcards: [
    { front: 'tool_calls', back: 'Model output requesting function invocation' },
    { front: 'Tool schema', back: 'JSON schema describing parameters' },
  ],
  quickRevision: [
    'Register tools + schema',
    'Model tool_calls',
    'Server execute',
    'Tool message back',
    'Validate args',
    'Cap loops',
  ],
}
