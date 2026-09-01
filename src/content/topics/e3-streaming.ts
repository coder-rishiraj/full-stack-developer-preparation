import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Streaming returns LLM output as incremental SSE/chunk events token-by-token instead of one blocking response. Improves perceived latency for chat UIs.',
  whyExists: 'Full completion may take 10–30s. Streaming shows progress immediately — better UX and early cancel if off-track.',
  mentalModel: 'Live typing indicator — words appear as generated not after full essay.',
  howItWorks: [
    { type: 'list', items: [
      'stream: true → SSE events with delta content.',
      'Client accumulates chunks until finish_reason.',
      'Tool calls may stream args incrementally.',
      'Handle disconnect — partial response state.',
    ] },
  ],
  example: [
    { type: 'paragraph', text: 'Chat UI renders each delta.content chunk; on stop user aborts fetch; server logs partial tokens for billing.' },
  ],
  tradeoffs: {
    advantages: [
      'Better UX',
      'Early cancellation',
    ],
    disadvantages: [
      'Harder error handling mid-stream',
      'Parsing incomplete JSON if not using structured stream',
    ],
    alternatives: [
      'Blocking for batch jobs',
    ],
    whenToUse: [
      'Interactive chat UIs',
    ],
    whenNotToUse: [
      'Offline batch where UX irrelevant',
    ],
  },
  failureModes: [
    'Mid-stream disconnect unhandled',
    'Assuming complete JSON before stream ends',
    'No loading state on client',
  ],
  production: {
    performance: [
      'TTFT metric — time to first token',
    ],
    reliability: [
      'AbortController on client',
      'Server flush on disconnect',
    ],
    observability: [
      'Track stream duration vs total tokens',
    ],
  },
  interview: {
    expectations: [
      'SSE/chunks',
      'UX benefit',
    ],
    commonQuestions: [
      'Why stream?',
    ],
    followUps: [
      'Structured output streaming?',
    ],
    misconceptions: [
      'Cheaper than blocking',
    ],
    traps: [
      'Parse JSON before stream done',
    ],
    strongSignals: [
      'TTFT',
      'Abort handling',
    ],
  },
  keyTakeaways: [
    'Token chunks over SSE',
    'Better perceived latency',
    'Handle partial/disconnect',
    'TTFT key metric',
    'Blocking OK for batch',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Streaming benefit?', answerHint: 'User sees tokens immediately; lower perceived latency.' },
    { level: 'intermediate', question: 'SSE handling?', answerHint: 'Accumulate deltas; finish_reason ends; abort on cancel.' },
    { level: 'advanced', question: 'Bill partial stream?', answerHint: 'Providers bill tokens generated even if client disconnects early.' },
  ],
  flashcards: [
    { front: 'TTFT', back: 'Time to first token — key streaming metric' },
    { front: 'delta.content', back: 'Incremental text chunk in stream event' },
    { front: 'AbortController', back: 'Client cancel in-flight stream' },
  ],
  quickRevision: [
    'SSE chunks',
    'TTFT UX',
    'Abort partial',
    'Accumulate deltas',
    'Batch=blocking OK',
  ],
}
