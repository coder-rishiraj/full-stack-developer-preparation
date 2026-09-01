import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Structured outputs force LLMs to emit JSON matching a schema via constrained decoding or response_format — reliable fields for downstream parsers and tools.',
  whyExists: 'Regex on prose is fragile. Apps need typed objects — extraction, classification enums, API integration.',
  mentalModel: 'Fill-in-the-blanks with type checking at generation time not just after.',
  howItWorks: [
    { type: 'list', items: [
      'response_format: json_schema or json_object mode.',
      'Provider masks invalid tokens during decode.',
      'Combine with JSON Schema for field constraints.',
      'Still validate with Zod/jsonschema post-hoc.',
    ] },
  ],
  example: [
    { type: 'paragraph', text: 'Extract {category, urgency, summary} from ticket — structured mode returns parseable object every call.' },
  ],
  tradeoffs: {
    advantages: [
      'Fewer parse errors',
      'Direct TypeScript mapping',
    ],
    disadvantages: [
      'Not all models support',
      'Complex schemas struggle',
    ],
    alternatives: [
      'Tool calling typed args',
      'Repair loop on invalid JSON',
    ],
    whenToUse: [
      'Machine consumption outputs',
    ],
    whenNotToUse: [
      'Creative prose to humans',
    ],
  },
  failureModes: [
    'Schema too nested',
    'Skipping post-validation',
    'json_object without schema — any shape',
  ],
  production: {
    reliability: [
      'Schema + validate + retry',
      'Fallback to tool calling',
    ],
    maintainability: [
      'Codegen types from schema',
    ],
  },
  interview: {
    expectations: [
      'vs free text',
      'Validate anyway',
    ],
    commonQuestions: [
      'Structured outputs?',
    ],
    followUps: [
      'vs function calling?',
    ],
    misconceptions: [
      '100% without validate',
    ],
    traps: [
      'Huge schema one shot',
    ],
    strongSignals: [
      'Constrained decode + Zod',
    ],
  },
  keyTakeaways: [
    'Schema-constrained JSON',
    'Constrained decoding',
    'Post-validate always',
    'Prefer smaller schemas',
    'Tool calling alternative',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Structured output?', answerHint: 'Model emits JSON matching defined schema.' },
    { level: 'intermediate', question: 'Still need validator?', answerHint: 'Yes — defense in depth.' },
    { level: 'advanced', question: 'vs tool calling?', answerHint: 'Structured = final answer shape; tools = external actions mid-turn.' },
  ],
  flashcards: [
    { front: 'Constrained decoding', back: 'Only valid JSON tokens allowed during generation' },
    { front: 'json_schema mode', back: 'Provider enforces schema at decode time' },
    { front: 'Post-validate', back: 'Zod/jsonschema check after response received' },
  ],
  quickRevision: [
    'Schema JSON',
    'Constrained decode',
    'Zod validate',
    'Small schemas',
    'Tools for actions',
  ],
}
