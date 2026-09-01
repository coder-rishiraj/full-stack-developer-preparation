import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Production streaming delivers LLM tokens incrementally via SSE/WebSocket — improving perceived latency, enabling cancel, and requiring careful billing, logging, and error handling mid-flight.',
  whyExists: '30s blocking responses hurt chat UX. Streaming shows progress; prod must handle disconnects, partial usage, and tool call streams.',
  mentalModel: 'Live typing — charge for words already spoken if user hangs up; save partial state if line drops.',
  howItWorks: [
    { type: 'list', items: [
      'SSE chunks with delta content until finish_reason.',
      'Client AbortController cancels upstream.',
      'Log usage on stream end event.',
      'Tool call args may stream incrementally.',
      'Gateway timeout slightly above client cancel.',
    ] },
  ],
  example: [
    { type: 'paragraph', text: 'Chat UI renders SSE deltas; user stops → abort fetch → server cancels provider stream; usage logged for partial completion_tokens.' },
  ],
  tradeoffs: {
    advantages: [
      'Better UX',
      'Early cancel saves tokens',
    ],
    disadvantages: [
      'Harder mid-stream errors',
      'Partial JSON parse risk',
    ],
    alternatives: [
      'Blocking for batch jobs',
    ],
    whenToUse: [
      'Interactive chat UIs',
    ],
    whenNotToUse: [
      'Offline batch generation',
    ],
  },
  failureModes: [
    'No usage log on disconnect',
    'Client assumes complete JSON mid-stream',
    'Proxy buffers SSE breaking UX',
  ],
  production: {
    performance: [
      'TTFT metric',
      'Disable buffering on nginx',
    ],
    observability: [
      'Stream duration vs token count',
    ],
    reliability: [
      'Cancel propagates to provider',
    ],
  },
  interview: {
    expectations: [
      'SSE + TTFT',
      'Partial billing',
    ],
    commonQuestions: [
      'Stream in prod concerns?',
    ],
    followUps: [
      'Cancel handling?',
    ],
    misconceptions: [
      'Streaming cheaper always',
    ],
    traps: [
      'Parse JSON before done',
    ],
    strongSignals: [
      'Abort + finish usage + no buffer',
    ],
  },
  keyTakeaways: [
    'SSE for chat UX',
    'TTFT key metric',
    'Bill partial on disconnect',
    'Cancel propagates upstream',
    'Usage on stream finish',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Production streaming why?', answerHint: 'Lower perceived latency; cancel saves tokens.' },
    { level: 'intermediate', question: 'Partial stream billing?', answerHint: 'Providers bill tokens generated even if client disconnects.' },
    { level: 'advanced', question: 'Stream through API gateway?', answerHint: 'Disable response buffering; long timeout; heartbeats.' },
  ],
  flashcards: [
    { front: 'TTFT', back: 'Time to first token — streaming UX metric' },
    { front: 'AbortController', back: 'Client cancels in-flight stream' },
    { front: 'X-Accel-Buffering no', back: 'Disable proxy buffering for SSE' },
  ],
  quickRevision: [
    'SSE deltas',
    'TTFT',
    'Abort cancel',
    'Usage on finish',
    'No proxy buffer',
  ],
}
