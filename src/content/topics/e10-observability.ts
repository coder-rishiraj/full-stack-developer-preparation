import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Observability for LLM apps combines traces, structured logs, metrics, and eval signals — token usage, latency, retrieval quality, tool calls, safety events — for debug and SLOs.',
  whyExists: 'Black-box LLM calls fail silently — wrong retrieval, tool loops, cost spikes. You need request-level visibility like any microservice.',
  mentalModel: 'Flight recorder for each chat: what model, what chunks, what tools, how long, how many tokens, pass/fail validation.',
  howItWorks: [
    { type: 'list', items: [
      'OpenTelemetry trace: gateway → retrieve → LLM → tools.',
      'Log prompt hash (not raw PII), chunk ids, model, tokens.',
      'Metrics: latency p50/p99, error rate, $/req, cache hit.',
      'Eval samples logged for offline review.',
      'Dashboards and alerts on SLO breach.',
    ] },
  ],
  example: [
    { type: 'paragraph', text: 'Span attributes: tenant_id, model, retrieval_ids[], tool_names[], validation_pass. Alert if p99 > 8s or ungrounded_rate > 5%.' },
  ],
  tradeoffs: {
    advantages: [
      'Fast incident response',
      'Cost and quality trends',
    ],
    disadvantages: [
      'Log volume and PII risk',
      'Instrumentation effort',
    ],
    alternatives: [
      'Provider dashboard only — insufficient',
    ],
    whenToUse: [
      'All production LLM',
    ],
    whenNotToUse: [
      'Local dev without PII',
    ],
  },
  failureModes: [
    'Logging full prompts with secrets',
    'No trace across async workers',
    'Metrics without retrieval context',
  ],
  production: {
    observability: [
      'RED metrics + trace retention policy',
    ],
    security: [
      'Redact PII in logs',
      'Hash prompts',
    ],
    reliability: [
      'Correlation id end-to-end',
    ],
  },
  interview: {
    expectations: [
      'Trace spans for RAG',
      'What to log',
    ],
    commonQuestions: [
      'Observe LLM app how?',
    ],
    followUps: [
      'PII in logs?',
    ],
    misconceptions: [
      'Provider logs enough',
    ],
    traps: [
      'Log raw user health data',
    ],
    strongSignals: [
      'OTel + chunk ids + token metrics + redaction',
    ],
  },
  keyTakeaways: [
    'Trace full RAG/agent path',
    'Log chunk ids not full prompts',
    'Token and $ metrics',
    'Eval sample logging',
    'Alert on SLOs',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'LLM observability essentials?', answerHint: 'Traces, token/latency metrics, retrieval ids, error and validation rates.' },
    { level: 'intermediate', question: 'What not to log?', answerHint: 'Raw PII, secrets, full prompts in prod — hash/redact.' },
    { level: 'advanced', question: 'Debug bad RAG answer?', answerHint: 'Trace retrieval scores, injected chunk ids, model route, validation result.' },
  ],
  flashcards: [
    { front: 'Span attributes', back: 'tenant, model, chunk_ids, tokens on trace spans' },
    { front: 'Prompt hashing', back: 'Log digest not raw prompt for privacy' },
    { front: 'Ungrounded rate', back: 'Metric for answers failing citation check' },
  ],
  quickRevision: [
    'OTel traces',
    'Chunk id logs',
    'Token metrics',
    'PII redact',
    'SLO alerts',
  ],
}
