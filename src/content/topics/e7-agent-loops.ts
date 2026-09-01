import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Agent loop repeatedly calls LLM → optionally executes tools → appends results → until stop condition (final answer, max iterations, tool budget).',
  whyExists: 'Single-shot LLM cannot multi-step reason with tools. Loop orchestrates plan-act-observe cycles.',
  mentalModel: 'while not done: model thinks → tool call → observe result → repeat.',
  howItWorks: [
    { type: 'list', items: [
      'Set max_iterations hard cap',
      'Parse tool_calls from assistant message',
      'Execute tools server-side; append tool role messages',
      'Stop on final natural language or no tool_calls',
      'Log each turn for debug',
    ] },
  ],
  example: [
    { type: 'code', language: 'typescript', code: 'for (let i = 0; i < MAX; i++) {\n  const msg = await llm(messages, tools);\n  if (!msg.tool_calls) return msg.content;\n  messages.push(...runTools(msg.tool_calls));\n}' },
  ],
  tradeoffs: {
    advantages: [
      'Multi-step tasks',
      'Composable with any tools',
    ],
    disadvantages: [
      'Runaway loops',
      'Latency multiplies per turn',
    ],
    alternatives: [
      'Single prompt chain',
      'Workflow engines',
    ],
    whenToUse: [
      'Research agents',
      'Support bots with APIs',
    ],
    whenNotToUse: [
      'Simple FAQ one-shot',
    ],
  },
  failureModes: [
    'Infinite loop without cap',
    'Tool error not surfaced to model',
    'Context overflow long loops',
  ],
  production: {
    reliability: [
      'MAX_ITERATIONS=5-10',
      'Timeout per iteration',
    ],
    observability: [
      'Trace each loop step with span',
    ],
  },
  interview: {
    expectations: [
      'Iteration cap mandatory',
      'Tool result fed back',
    ],
    commonQuestions: [
      'Explain Agent Loops',
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
      'Cap iterations',
      'Server executes tools',
      'Append tool messages',
    ],
  },
  keyTakeaways: [
    'Cap iterations',
    'Server executes tools',
    'Append tool messages',
    'Stop conditions clear',
    'Trace each step',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Agent loop steps?', answerHint: 'LLM → tool calls → results → LLM until done.' },
    { level: 'intermediate', question: 'Prevent runaway?', answerHint: 'Max iterations, budget, timeout.' },
    { level: 'advanced', question: 'Context grows each turn?', answerHint: 'Summarize, trim tool outputs, sliding window.' },
  ],
  flashcards: [
    { front: 'Max iterations', back: 'Hard cap preventing infinite tool loops' },
    { front: 'Tool message', back: 'Role tool carrying function result to model' },
  ],
  quickRevision: [
    'LLM → tools → repeat',
    'Cap iterations',
    'Server-side execution',
    'Tool role messages',
    'Stop on no tools',
    'Trace spans',
  ],
}
