import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'JSON Schema defines expected shape and types of model output objects — field names, types, enums, required fields. Used with structured outputs to constrain LLM generation to valid JSON.',
  whyExists: 'Free-form JSON from LLMs breaks parsers — trailing commas, wrong types, missing fields. Schema gives machine-verifiable contracts for downstream code.',
  mentalModel: 'Form with labeled boxes and types. Model must fill every required box correctly or API rejects/regenerates.',
  howItWorks: [
    { type: 'list', items: [
      'Define type object with properties and required[].',
      'Providers map schema to constrained decoding (grammar).',
      'Validate response with jsonschema/Zod after receive.',
      'Strict mode disallows extra properties when needed.',
    ] },
  ],
  example: [
    { type: 'code', language: 'json', code: '{\n  "type": "object",\n  "properties": {\n    "sentiment": { "type": "string", "enum": ["positive", "negative", "neutral"] },\n    "score": { "type": "number" }\n  },\n  "required": ["sentiment", "score"],\n  "additionalProperties": false\n}', caption: 'Extract schema' },
  ],
  tradeoffs: {
    advantages: [
      'Reliable parsing',
      'Type safety downstream',
    ],
    disadvantages: [
      'Complex nested schemas harder for model',
      'Provider support varies',
    ],
    alternatives: [
      'Tool calling with typed args',
      'Regex extract + repair loop',
    ],
    whenToUse: [
      'APIs consuming LLM JSON',
    ],
    whenNotToUse: [
      'Free prose answers',
    ],
  },
  failureModes: [
    'Schema too large for context',
    'Optional vs required confusion',
    'No post-validate even with structured mode',
  ],
  production: {
    reliability: [
      'Zod validate after response',
      'Retry on schema fail with error hint',
    ],
    maintainability: [
      'Version schemas in repo',
    ],
  },
  interview: {
    expectations: [
      'Schema + structured output link',
      'Validation',
    ],
    commonQuestions: [
      'Why JSON Schema?',
    ],
    followUps: [
      'Schema vs tool calling?',
    ],
    misconceptions: [
      'Structured mode 100% reliable without validate',
    ],
    traps: [
      'Huge nested schema first try',
    ],
    strongSignals: [
      'Schema + Zod + retry',
    ],
  },
  keyTakeaways: [
    'Defines output contract',
    'Pairs with structured outputs',
    'Validate after receive',
    'Keep schemas focused',
    'additionalProperties false for strict APIs',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'JSON Schema for LLM?', answerHint: 'Constrain generated JSON shape and types.' },
    { level: 'intermediate', question: 'Still validate after structured output?', answerHint: 'Yes — defense in depth; provider may edge-case fail.' },
    { level: 'advanced', question: 'Schema too complex?', answerHint: 'Split steps; tool calls; smaller objects chained.' },
  ],
  flashcards: [
    { front: 'required[]', back: 'Fields that must appear in output object' },
    { front: 'additionalProperties: false', back: 'Reject extra undeclared fields' },
    { front: 'Constrained decoding', back: 'Grammar masks invalid tokens during generation' },
  ],
  quickRevision: [
    'Shape contract',
    'Structured output',
    'Post-validate Zod',
    'Small schemas',
    'Retry on fail',
  ],
}
