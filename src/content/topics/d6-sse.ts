import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Server-Sent Events (SSE) is HTTP standard for server-to-client push — client opens long-lived GET; server streams text/event-stream formatted messages (data: lines) over single connection. Native EventSource API in browsers; one-way server → client only.',
  whyExists:
    'Polling wastes bandwidth and adds latency. WebSockets bidirectional but heavier for simple feeds (stock ticks, notifications, build logs). SSE reuses HTTP, auto-reconnects, works through most proxies, simpler for read-only push streams.',
  mentalModel:
    'Radio broadcast one direction. Browser tunes EventSource URL; server keeps connection open sending event frames when news arrives. Browser handles Last-Event-ID reconnect after disconnect.',
  howItWorks: [
    {
      type: 'mermaid',
      caption: 'SSE one-way stream',
      diagram: `sequenceDiagram
  participant B as Browser EventSource
  participant S as Spring SseEmitter
  B->>S: GET /events Accept text/event-stream
  S-->>B: data: {"price":101}
  S-->>B: data: {"price":102}
  Note over B,S: connection drops
  B->>S: GET Last-Event-ID: 42
  S-->>B: resume events`,
    },
    {
      type: 'list',
      items: [
        'Content-Type: text/event-stream; charset=utf-8.',
        'Fields: data, event (type), id, retry.',
        'Spring SseEmitter or Flux<ServerSentEvent> WebFlux.',
        'HTTP/1.1 connection limit — HTTP/2 multiplex helps.',
        'Not for binary — base64 or use WebSocket.',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Spring MVC SseEmitter endpoint',
      code: `@GetMapping(value = "/orders/{id}/events", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
public SseEmitter orderEvents(@PathVariable UUID id) {
  SseEmitter emitter = new SseEmitter(0L);
  orderEventBus.register(id, emitter);
  emitter.onCompletion(() -> orderEventBus.unregister(id, emitter));
  return emitter;
}

// publish: emitter.send(SseEmitter.event().name("status").data(payload));`,
    },
    {
      type: 'code',
      language: 'javascript',
      caption: 'Browser EventSource client',
      code: `const es = new EventSource("/orders/123/events");
es.addEventListener("status", (e) => console.log(JSON.parse(e.data)));
es.onerror = () => console.log("reconnecting...");`,
    },
  ],
  tradeoffs: {
    advantages: ['Simple HTTP one-way push', 'Auto reconnect Last-Event-ID', 'EventSource browser native', 'Works with HTTP/2'],
    disadvantages: ['Server→client only', 'Text based not binary ideal', 'Connection per tab limits', 'Some proxies buffer break SSE'],
    alternatives: ['WebSocket bidirectional', 'Long polling fallback', 'MQTT IoT'],
    whenToUse: ['Live feeds dashboards', 'Order status updates', 'CI log streaming to browser'],
    whenNotToUse: ['Chat bidirectional', 'Binary gaming protocol', 'Millions concurrent ultra-low latency'],
  },
  failureModes: [
    'Proxy nginx buffering without X-Accel-Buffering no',
    'Memory leak unclosed SseEmitter on server',
    'No heartbeat — idle connection dropped by LB',
    'Exceed browser 6 connection limit HTTP/1.1',
    'Missing CORS for cross-origin EventSource',
  ],
  production: {
    reliability: ['Comment heartbeat every 15-30s', 'Last-Event-ID replay buffer on reconnect'],
    scalability: ['Redis pub/sub fan-out SSE instances', 'Limit connections per user'],
    observability: ['Active emitter count metric', 'Disconnect rate'],
    security: ['Auth cookie or token query param carefully', 'Same user stream authorization'],
  },
  interview: {
    expectations: ['One-way HTTP push', 'EventSource API', 'vs WebSocket', 'Reconnect id header'],
    commonQuestions: ['Push order updates to browser?', 'SSE vs WebSocket?'],
    followUps: ['Scale SSE many users?', 'Proxy buffering fix?'],
    misconceptions: ['SSE bidirectional', 'SSE works for binary video'],
    traps: ['SSE for chat without client POST path'],
    strongSignals: ['text/event-stream', 'Last-Event-ID', 'Heartbeat comment lines', 'Redis fan-out scale'],
  },
  keyTakeaways: [
    'SSE = server push over HTTP text/event-stream.',
    'Browser EventSource handles reconnect.',
    'One-way only — client sends via separate REST.',
    'Heartbeats keep connection alive through LBs.',
    'Simpler than WebSocket for notification feeds.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'SSE vs polling?', answerHint: 'SSE long-lived HTTP stream server pushes; polling repeated requests wasteful higher latency.' },
    { level: 'intermediate', question: 'SSE vs WebSocket?', answerHint: 'SSE one-way HTTP simpler auto-reconnect; WebSocket bidirectional binary full duplex.' },
    { level: 'advanced', question: 'Scale SSE to many clients?', answerHint: 'Redis pub/sub fan-out; sticky not required if shared bus; heartbeat; connection limits per instance.' },
  ],
  flashcards: [
    { front: 'text/event-stream', back: 'SSE MIME type for event stream responses' },
    { front: 'EventSource', back: 'Browser API consuming SSE with auto reconnect' },
    { front: 'Last-Event-ID', back: 'Client header resuming stream after disconnect' },
    { front: 'One-way', back: 'Server to client only — client uses REST separately' },
  ],
  quickRevision: ['HTTP push stream', 'EventSource client', 'One-way only', 'Heartbeat + reconnect', 'vs WebSocket duplex'],
}
