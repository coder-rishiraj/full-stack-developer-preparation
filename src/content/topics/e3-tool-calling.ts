import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Tool (function) calling lets LLMs emit structured requests to invoke external functions — search DB, call API, run code — with args validated against JSON schemas. Results return as tool messages.',
  whyExists: 'LLMs alone cannot fetch live data or take actions. Tools bridge model reasoning to systems of record safely.',
  mentalModel: 'Assistant asks intern to look up file — gets result — continues answer with facts.',
  howItWorks: [
    { type: 'list', items: [
      'Register tools[] with name, description, parameters schema.',
      'Model returns tool_calls with function name + JSON args.',
      'App executes function server-side; sends tool result message.',
      'Model produces final natural language answer.',
    ] },
  ],
  example: [
    { type: 'code', language: 'typescript', code: '// 1. Send tools in request\n// 2. if message.tool_calls → execute handler\n// 3. append { role: "tool", content: result }\n// 4. call model again for final answer', caption: 'Tool loop' },
  ],
  tradeoffs: {
    advantages: [
      'Live data',
      'Action automation',
    ],
    disadvantages: [
      'Security if over-permissioned',
      'Multi-turn latency',
    ],
    alternatives: [
      'ReAct manual parsing',
      'Pre-fetch RAG without tools',
    ],
    whenToUse: [
      'Agents, calculators, DB lookup',
    ],
    whenNotToUse: [
      'Unsandboxed arbitrary code exec',
    ],
  },
  failureModes: [
    'Executing untrusted args',
    'Missing tool description → wrong pick',
    'Infinite tool loop',
  ],
  production: {
    security: [
      'Allowlist tools',
      'Validate args',
      'Least privilege',
    ],
    reliability: [
      'Max tool iterations cap',
      'Timeout per tool',
    ],
    observability: [
      'Log tool name, latency, errors',
    ],
  },
  interview: {
    expectations: [
      'Tool loop flow',
      'Security',
    ],
    commonQuestions: [
      'Function calling flow?',
    ],
    followUps: [
      'vs RAG?',
    ],
    misconceptions: [
      'Model executes tools itself',
    ],
    traps: [
      'Shell tool without sandbox',
    ],
    strongSignals: [
      'Server executes',
      'Schema args',
      'Iteration cap',
    ],
  },
  keyTakeaways: [
    'Model proposes tool calls',
    'App executes server-side',
    'Results as tool messages',
    'Validate args',
    'Cap iterations and permissions',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Tool calling loop?', answerHint: 'Model requests tool → app runs → result → model answers.' },
    { level: 'intermediate', question: 'Security essentials?', answerHint: 'Allowlist, validate schema, least privilege, no raw shell.' },
    { level: 'advanced', question: 'Tools vs RAG?', answerHint: 'RAG retrieves static chunks; tools query live systems and act.' },
  ],
  flashcards: [
    { front: 'tool_calls', back: 'Model output requesting function invocation' },
    { front: 'Tool description', back: 'Helps model choose correct function' },
    { front: 'Iteration cap', back: 'Limit tool loops to prevent runaway agents' },
  ],
  quickRevision: [
    'Model proposes',
    'Server executes',
    'Tool message back',
    'Validate args',
    'Cap loops',
  ],
}
