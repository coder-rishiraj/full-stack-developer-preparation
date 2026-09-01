import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'WebSockets provide full-duplex persistent TCP connection over HTTP upgrade — low-latency bidirectional frames for chat, games, collaborative editing after initial handshake.',
  whyExists: 'HTTP request/response adds overhead for frequent bidirectional messages. WebSocket single connection both directions after upgrade.',
  mentalModel: 'Phone call vs letters: upgrade HTTP to persistent socket; both sides send frames anytime.',
  howItWorks: [
    { type: 'list', items: [
      'Client HTTP Upgrade: websocket; server 101 Switching Protocols',
      'Frames: text/binary with opcode ping/pong/close',
      'No automatic reconnect — app must implement',
      'Sticky sessions or pub/sub for multi-server fan-out',
      'wss:// required in production',
    ] },
  ],
  example: [
    { type: 'code', language: 'javascript', code: 'const ws = new WebSocket(\'wss://api.example.com/ws\');\nws.onmessage = (e) => console.log(e.data);\nws.send(JSON.stringify({ type: \'ping\' }));', caption: 'Browser WebSocket client' },
  ],
  tradeoffs: {
    advantages: [
      'Low latency bidi',
      'Binary frames',
    ],
    disadvantages: [
      'Connection state on server',
      'LB sticky complexity',
    ],
    alternatives: [
      'SSE one-way',
      'HTTP/2 server push deprecated',
    ],
    whenToUse: [
      'Chat',
      'Live games',
      'Collaborative docs',
    ],
    whenNotToUse: [
      'Simple notifications — use SSE',
    ],
  },
  failureModes: [
    'No heartbeat — ghost connections',
    'Broadcast storm to all clients',
    'Missing auth on upgrade',
    'Message ordering across reconnect',
  ],
  production: {
    scalability: [
      'Redis pub/sub or dedicated WS gateway',
      'Connection limits per instance',
    ],
    reliability: [
      'App-level ping/pong heartbeat',
      'Exponential backoff reconnect',
    ],
    security: [
      'Auth token at upgrade; validate origin',
    ],
  },
  interview: {
    expectations: [
      'HTTP upgrade handshake',
      'Scaling with pub/sub',
    ],
    commonQuestions: [
      'WebSocket vs SSE?',
    ],
    followUps: [
      'Scale across servers?',
    ],
    misconceptions: [
      'Automatic reconnect built-in',
    ],
    traps: [
      'No auth on WS URL',
    ],
    strongSignals: [
      'Sticky vs shared pub/sub, heartbeats',
    ],
  },
  keyTakeaways: [
    'HTTP upgrade to persistent bidi socket',
    'App handles reconnect',
    'Scale via pub/sub gateway',
    'Heartbeats detect dead peers',
    'wss in production',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'WebSocket vs HTTP polling?', answerHint: 'Persistent connection; lower overhead per message.' },
    { level: 'intermediate', question: 'Scale WS cluster?', answerHint: 'Pub/sub backplane; route user to any node.' },
    { level: 'advanced', question: 'Backpressure on WS?', answerHint: 'bufferedAmount; pause send; drop/slow consumer policy.' },
  ],
  flashcards: [
    { front: '101 Switching Protocols', back: 'HTTP upgrade response for WS' },
    { front: 'wss://', back: 'TLS WebSocket required in prod' },
  ],
  quickRevision: [
    'HTTP upgrade',
    'Full duplex frames',
    'No auto reconnect',
    'Pub/sub scale',
    'Heartbeats',
    'Auth at handshake',
  ],
}
