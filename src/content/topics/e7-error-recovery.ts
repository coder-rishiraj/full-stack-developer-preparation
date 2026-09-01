import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Error recovery in agents handles tool failures, invalid JSON args, timeouts — retry with backoff, alternate tools, graceful degradation, user-visible error messages.',
  whyExists: 'Tools fail in production. Agents must not crash loop or hallucinate success when API 500.',
  mentalModel: 'Try tool → on failure append error to context → model retries or explains to user.',
  howItWorks: [
    { type: 'list', items: [
      'Classify transient vs permanent errors',
      'Retry idempotent tools with exponential backoff',
      'Feed structured error string in tool message',
      'Circuit breaker after repeated failures',
      'Fallback tool or human handoff',
    ] },
  ],
  example: [
    { type: 'code', language: 'typescript', code: 'try { result = await tool(args); } catch (e) {\n  messages.push({ role: \'tool\', content: JSON.stringify({ error: e.message }) });\n}' },
  ],
  tradeoffs: {
    advantages: [
      'Resilient agents',
      'Model can self-correct args',
    ],
    disadvantages: [
      'Extra tokens on errors',
      'Retry storms if not capped',
    ],
    alternatives: [
      'Fail fast no retry',
      'Preflight validate args',
    ],
    whenToUse: [
      'Production agents with external APIs',
    ],
    whenNotToUse: [
      'Demo prototypes',
    ],
  },
  failureModes: [
    'Retry non-idempotent writes twice',
    'Hide error from model → hallucination',
    'Infinite retry loop',
  ],
  production: {
    reliability: [
      'Idempotency keys on mutating tools',
      'Circuit breaker per dependency',
    ],
  },
  interview: {
    expectations: [
      'Structured tool errors to model',
      'Retry transient only',
    ],
    commonQuestions: [
      'Explain Error Recovery',
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
      'Feed errors to model',
      'Retry transient idempotent',
      'Circuit breaker',
    ],
  },
  keyTakeaways: [
    'Feed errors to model',
    'Retry transient idempotent',
    'Circuit breaker',
    'Validate args preflight',
    'User-visible fallback',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Tool 500 in agent?', answerHint: 'Return error in tool message; model decides retry/explain.' },
    { level: 'intermediate', question: 'Retry policy?', answerHint: 'Backoff on transient; no retry on 400 validation.' },
    { level: 'advanced', question: 'Circuit breaker?', answerHint: 'Stop calling failing dependency; fallback path.' },
  ],
  flashcards: [
    { front: 'Tool error message', back: 'Structured failure returned to LLM context' },
    { front: 'Circuit breaker', back: 'Halt calls after repeated dependency failures' },
  ],
  quickRevision: [
    'Errors in tool messages',
    'Retry transient',
    'No double mutate',
    'Circuit breaker',
    'Preflight validate',
    'User fallback',
  ],
}
