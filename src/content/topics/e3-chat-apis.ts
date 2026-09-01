import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Chat/completion APIs expose LLMs via HTTP: messages array in, assistant text or structured response out. OpenAI chat/completions, Anthropic messages, etc. — primary integration surface for apps.',
  whyExists: 'Raw model weights impractical for most teams. APIs handle scaling, safety filters, billing, and model updates.',
  mentalModel: 'POST conversation history → get next assistant turn. Stateless unless you send full history each call.',
  howItWorks: [
    { type: 'list', items: [
      'POST with model, messages[], temperature, max_tokens.',
      'Roles: system, user, assistant, tool.',
      'Response: choices[].message.content or tool_calls.',
      'Streaming: SSE chunks for token-by-token UX.',
      'Auth via API key; rate limits per tier.',
    ] },
  ],
  example: [
    { type: 'code', language: 'typescript', code: 'const res = await openai.chat.completions.create({\n  model: "gpt-4o-mini",\n  messages: [\n    { role: "system", content: "You are a helpful assistant." },\n    { role: "user", content: "Summarize RAG in one sentence." },\n  ],\n});\nconsole.log(res.choices[0].message.content);', caption: 'Minimal chat call' },
  ],
  tradeoffs: {
    advantages: [
      'No GPU ops',
      'Fast integration',
      'Provider scaling',
    ],
    disadvantages: [
      'Vendor lock-in',
      'Data residency concerns',
      'Latency network hop',
    ],
    alternatives: [
      'Self-host open weights',
      'Azure/private endpoints',
    ],
    whenToUse: [
      'Most prod LLM features',
    ],
    whenNotToUse: [
      'Strict air-gap without approved endpoint',
    ],
  },
  failureModes: [
    'No timeout/retry',
    'Leaking API keys client-side',
    'Oversized message payload',
    'Ignoring rate limit headers',
  ],
  production: {
    reliability: [
      'Server-side proxy only',
      'Timeouts + retries with backoff',
    ],
    security: [
      'Keys in secrets manager never frontend',
    ],
    observability: [
      'Log request_id, tokens, latency',
    ],
  },
  interview: {
    expectations: [
      'Messages roles',
      'Stateless pattern',
    ],
    commonQuestions: [
      'How integrate LLM?',
    ],
    followUps: [
      'Streaming vs batch?',
    ],
    misconceptions: [
      'API remembers server-side session free',
    ],
    traps: [
      'API key in browser',
    ],
    strongSignals: [
      'Backend proxy',
      'Idempotency keys',
    ],
  },
  keyTakeaways: [
    'HTTP messages in/out',
    'Roles: system/user/assistant/tool',
    'Stateless — send history',
    'Backend holds API key',
    'Handle limits and retries',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Chat API basics?', answerHint: 'Messages array with roles; model returns assistant message.' },
    { level: 'intermediate', question: 'Where store API key?', answerHint: 'Server-side secrets; never client bundle.' },
    { level: 'advanced', question: 'Design LLM gateway?', answerHint: 'Auth, rate limit, retry, token budget, logging, model routing.' },
  ],
  flashcards: [
    { front: 'messages[]', back: 'Conversation turns with role and content' },
    { front: 'Stateless API', back: 'Client resends history each request unless using threads/assistants API' },
    { front: 'Backend proxy', back: 'Hide keys; enforce policy and budgets' },
  ],
  quickRevision: [
    'HTTP chat endpoint',
    'Role messages',
    'Backend proxy',
    'Retries/timeouts',
    'Log tokens',
  ],
}
