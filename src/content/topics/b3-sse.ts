import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Server-Sent Events (SSE) is HTTP one-way push — client opens long-lived GET; server streams text/event-stream messages. Native EventSource API; auto-reconnect with Last-Event-ID.',
  whyExists: 'Polling wastes bandwidth. WebSockets heavy for simple server→client feeds. SSE reuses HTTP, works through proxies, simpler for dashboards and notifications.',
  mentalModel: 'Radio broadcast one direction: browser tunes EventSource URL; server sends event frames when data arrives.',
  howItWorks: [
    { type: 'list', items: [
      'Content-Type: text/event-stream',
      'Fields: data, event, id, retry',
      'EventSource auto-reconnects with Last-Event-ID',
      'HTTP/1.1 connection limits — HTTP/2 multiplex helps',
      'Text only — binary needs base64 or WebSocket',
    ] },
  ],
  example: [
    { type: 'code', language: 'javascript', code: 'const es = new EventSource(\'/events\');\nes.onmessage = (e) => console.log(JSON.parse(e.data));', caption: 'Client EventSource' },
  ],
  tradeoffs: {
    advantages: [
      'Simple HTTP push',
      'Auto reconnect',
      'Native browser API',
    ],
    disadvantages: [
      'Server→client only',
      'Proxy buffering issues',
    ],
    alternatives: [
      'WebSocket',
      'Long polling',
    ],
    whenToUse: [
      'Live feeds',
      'Build logs',
      'Stock ticks',
    ],
    whenNotToUse: [
      'Bidirectional chat',
      'Binary protocols',
    ],
  },
  failureModes: [
    'Proxy/nginx buffering without X-Accel-Buffering no',
    'No heartbeat — LB drops idle connection',
    'Exceed browser connection limit HTTP/1.1',
  ],
  production: {
    reliability: [
      'Heartbeat comment every 15-30s',
      'Replay buffer for Last-Event-ID',
    ],
    scalability: [
      'Redis pub/sub fan-out across SSE instances',
    ],
    security: [
      'Authorize stream per user',
    ],
  },
  interview: {
    expectations: [
      'One-way HTTP push',
      'EventSource vs WebSocket',
    ],
    commonQuestions: [
      'When SSE over WebSocket?',
    ],
    followUps: [
      'Reconnect behavior?',
    ],
    misconceptions: [
      'Bidirectional',
    ],
    traps: [
      'Missing heartbeat',
    ],
    strongSignals: [
      'Last-Event-ID, text/event-stream',
    ],
  },
  keyTakeaways: [
    'HTTP one-way push stream',
    'EventSource native client',
    'Auto reconnect Last-Event-ID',
    'Heartbeats for LB',
    'Not for binary/bidi',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'SSE direction?', answerHint: 'Server to client only.' },
    { level: 'intermediate', question: 'Reconnect mechanism?', answerHint: 'EventSource resends with Last-Event-ID header.' },
    { level: 'advanced', question: 'Scale SSE horizontally?', answerHint: 'Pub/sub bus; sticky or shared replay buffer.' },
  ],
  flashcards: [
    { front: 'text/event-stream', back: 'SSE MIME type' },
    { front: 'Last-Event-ID', back: 'Client header to resume after disconnect' },
  ],
  quickRevision: [
    'GET long-lived',
    'EventSource client',
    'data: lines',
    'Heartbeats',
    'One-way only',
    'Reconnect id',
  ],
}
