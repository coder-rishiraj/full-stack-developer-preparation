import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'WebSockets provide full-duplex persistent TCP connection after HTTP upgrade handshake — both client and server send frames anytime. Used for chat, collaborative editing, gaming, live trading where low-latency bidirectional messaging beats request-response.',
  whyExists:
    'HTTP request-response overhead and latency unacceptable for real-time chat or multiplayer. WebSocket single connection multiplexes messages both directions with minimal framing — efficient versus HTTP long polling loops.',
  mentalModel:
    'Open phone call vs exchanging letters. After ws:// handshake, either side talks anytime. Server not limited to response after request — can push unprompted. STOMP or custom JSON protocol often layered on top.',
  howItWorks: [
    {
      type: 'mermaid',
      caption: 'WebSocket upgrade and messaging',
      diagram: `sequenceDiagram
  participant C as Client
  participant S as Server
  C->>S: HTTP Upgrade websocket
  S-->>C: 101 Switching Protocols
  C->>S: text frame hello
  S-->>C: text frame welcome
  S-->>C: push notification frame`,
    },
    {
      type: 'table',
      headers: ['Topic', 'Detail'],
      rows: [
        ['Handshake', 'GET Upgrade: websocket Sec-WebSocket-Key'],
        ['Frames', 'Text binary ping pong close'],
        ['Spring', '@MessageMapping STOMP over SockJS optional fallback'],
        ['Scaling', 'Sticky sessions or Redis pub/sub bridge'],
        ['Auth', 'Cookie on handshake or token query/subprotocol'],
      ],
    },
    {
      type: 'list',
      items: [
        'Ping/pong heartbeats detect dead connections.',
        'SockJS emulates WebSocket fallback transports.',
        'Binary frames for protobuf efficient payloads.',
        'Rate limit messages per connection anti-abuse.',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Spring WebSocket STOMP chat',
      code: `@Configuration
@EnableWebSocketMessageBroker
public class WsConfig implements WebSocketMessageBrokerConfigurer {
  public void registerStompEndpoints(StompEndpointRegistry reg) {
    reg.addEndpoint("/ws").setAllowedOriginPatterns("*").withSockJS();
  }
  public void configureMessageBroker(MessageBrokerRegistry reg) {
    reg.enableSimpleBroker("/topic");
    reg.setApplicationDestinationPrefixes("/app");
  }
}

@MessageMapping("/chat.send")
@SendTo("/topic/room.{roomId}")
public ChatMessage send(ChatMessage msg) { return msg; }`,
    },
  ],
  tradeoffs: {
    advantages: ['True bidirectional low latency', 'Binary support', 'Single persistent connection'],
    disadvantages: ['Stateful connections scale complexity', 'LB sticky or shared backplane needed', 'Firewalls older proxies issues'],
    alternatives: ['SSE server push only', 'gRPC streaming internal', 'HTTP/2 server push limited'],
    whenToUse: ['Chat collaborative live games', 'Real-time dashboards interactive'],
    whenNotToUse: ['Simple notifications one-way — SSE', 'Internal microservices — gRPC'],
  },
  failureModes: [
    'No heartbeat — zombie connections exhaust memory',
    'Broadcast all users O(n) on single node — need pub/sub cluster',
    'Missing auth on subscribe — join wrong room',
    'Message size DoS — max frame limit',
    'Reconnect without state sync — missed messages',
  ],
  production: {
    reliability: ['Heartbeat ping interval', 'Graceful reconnect client backoff', 'Message ack for critical delivery'],
    scalability: ['Redis/Rabbit bridge cross-node broadcast', 'Connection count limits per instance'],
    observability: ['Active sessions gauge', 'Message rate and error close codes'],
    security: ['Validate STOMP subscribe destination', 'WSS TLS mandatory prod'],
  },
  interview: {
    expectations: ['Upgrade handshake', 'vs SSE polling', 'Scaling sticky vs pub/sub', 'STOMP optional'],
    commonQuestions: ['Design chat WebSocket?', 'Scale WebSocket servers?'],
    followUps: ['Authentication on WS?', 'Missed messages on reconnect?'],
    misconceptions: ['WebSocket replaces REST entirely', 'Stateless like HTTP'],
    traps: ['No cross-server message routing plan'],
    strongSignals: ['Redis pub/sub backplane', 'Heartbeats', 'STOMP destinations', 'WSS + auth handshake'],
  },
  keyTakeaways: [
    'WebSocket full-duplex persistent after HTTP upgrade.',
    'Both sides push frames anytime low overhead.',
    'Scale with shared pub/sub backplane or sticky sessions.',
    'Heartbeats and auth on handshake essential.',
    'Use SSE if only server→client needed simpler.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'WebSocket vs HTTP REST?', answerHint: 'WebSocket persistent duplex low latency push both ways; REST request-response stateless.' },
    { level: 'intermediate', question: 'Scale chat across 4 servers?', answerHint: 'Redis pub/sub or message broker; user session registry; or sticky sessions limited.' },
    { level: 'advanced', question: 'WebSocket vs SSE for live scores?', answerHint: 'Scores one-way SSE simpler; chat needs bidirectional WebSocket.' },
  ],
  flashcards: [
    { front: '101 Switching Protocols', back: 'HTTP response upgrading connection to WebSocket' },
    { front: 'STOMP', back: 'Messaging subprotocol over WebSocket with destinations' },
    { front: 'SockJS', back: 'Fallback transports when WebSocket blocked' },
    { front: 'Pub/sub backplane', back: 'Redis bridge broadcasting WS messages across nodes' },
  ],
  quickRevision: ['Duplex persistent', 'HTTP upgrade', 'Heartbeats', 'Redis scale bridge', 'SSE if one-way'],
}
