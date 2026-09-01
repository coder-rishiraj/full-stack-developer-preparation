import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'gRPC is a high-performance RPC framework using Protocol Buffers for schema and binary serialization over HTTP/2—supports unary, server streaming, client streaming, and bidirectional streaming. Code generated from .proto files for typed stubs in Java, Go, and other languages.',
  whyExists:
    'REST/JSON over HTTP/1.1 adds latency and lacks strong typing for internal microservice calls. gRPC gives contract-first APIs, efficient binary payloads, multiplexed connections, and flow-controlled streaming for service-to-service communication.',
  mentalModel:
    'Define service in .proto → protoc generates stubs → client calls look like local methods over single HTTP/2 connection with many concurrent RPCs on streams.',
  howItWorks: [
    {
      type: 'list',
      items: [
        '.proto defines messages and service rpc methods with types.',
        'protoc + grpc-java plugin generates Message classes and ServiceGrpc stubs.',
        'Transport: HTTP/2 over TCP (default port 50051); optional TLS/mTLS.',
        'Unary: single request-response on one stream.',
        'Server streaming: one request, many responses; client streaming opposite; bidi both ways.',
        'Status codes + metadata trailers on stream end; deadlines propagate cancellation.',
        'Load balancing: client-side or L7 proxy (Envoy, grpc-java pick_first/round_robin).',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Minimal proto and Java client/server sketch',
      code: `// user.proto
// service UserService { rpc GetUser(GetUserRequest) returns (User); }

ManagedChannel channel = ManagedChannelBuilder
    .forAddress("localhost", 50051)
    .usePlaintext()
    .build();
UserServiceGrpc.UserServiceBlockingStub stub =
    UserServiceGrpc.newBlockingStub(channel);
User user = stub.withDeadlineAfter(2, SECONDS)
    .getUser(GetUserRequest.newBuilder().setId("42").build());`,
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Server streaming RPC',
      code: `@Override
public void listUsers(Empty req, StreamObserver<User> responseObserver) {
    for (User u : repository.all()) {
        responseObserver.onNext(u);
    }
    responseObserver.onCompleted();
}`,
    },
  ],
  tradeoffs: {
    advantages: [
      'Strong contracts via protobuf',
      'HTTP/2 multiplexing low latency',
      'Streaming first-class',
      'Cross-language codegen',
    ],
    disadvantages: [
      'Not browser-friendly without grpc-web proxy',
      'Binary payloads harder to debug than JSON',
      'Load balancer needs HTTP/2 aware routing',
      'Breaking proto changes need careful field numbering',
    ],
    alternatives: ['REST + OpenAPI for public APIs', 'Kafka for async event bus', 'GraphQL for flexible client queries'],
    whenToUse: ['Internal microservice RPC', 'Low-latency typed APIs', 'Streaming telemetry/logs'],
    whenNotToUse: ['Public browser clients direct', 'Simple CRUD with human debugging priority'],
  },
  failureModes: [
    'DEADLINE_EXCEEDED without propagated deadline.',
    'Message size default 4MB limit—raise MAX_MESSAGE_SIZE if needed.',
    'Proto breaking change (reuse field numbers) corrupts data silently.',
    'Plaintext in production—must TLS/mTLS.',
  ],
  interview: {
    expectations: [
      'Protobuf + HTTP/2 transport',
      'Four RPC types unary/streaming',
      'Deadlines and status codes',
    ],
    commonQuestions: ['gRPC vs REST?', 'How versioning proto?', 'Streaming use cases?'],
    followUps: ['Load balancing sticky?', 'grpc-web?', 'Backpressure flow control?'],
    misconceptions: ['gRPC replaces Kafka always', 'REST faster for small payloads always', 'HTTP/3 default for gRPC yet everywhere'],
    traps: ['Breaking proto without reserved fields', 'Blocking stub on event loop thread in Netty server'],
    strongSignals: ['HTTP/2 multiplex on one channel', 'Deadline propagation', 'mTLS internal zero-trust'],
  },
  keyTakeaways: [
    'Contract-first .proto → generated stubs.',
    'HTTP/2 binary framing, multiplexed streams.',
    'Unary + three streaming modes.',
    'Deadlines cancel work; STATUS in trailers.',
    'Internal services; grpc-web for browsers.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'gRPC serialization format?', answerHint: 'Protocol Buffers binary by default—not JSON unless grpc-gateway transcoding.' },
    { level: 'intermediate', question: 'gRPC over HTTP/2 benefit?', answerHint: 'Multiplex many RPCs on one connection; header compression HPACK; flow control per stream.' },
    { level: 'advanced', question: 'Safe proto evolution?', answerHint: 'Add optional fields with new numbers; never reuse numbers; reserve deprecated; clients/servers ignore unknown fields.' },
  ],
  flashcards: [
    { front: 'gRPC transport', back: 'HTTP/2 over TCP (typically port 50051)' },
    { front: 'Four RPC types', back: 'Unary, server stream, client stream, bidi stream' },
    { front: 'Default serialization', back: 'Protocol Buffers' },
  ],
  quickRevision: [
    '.proto contract',
    'HTTP/2 multiplex',
    'Protobuf binary',
    '4 streaming modes',
    'Deadlines/cancel',
    'mTLS production',
    'grpc-web for browsers',
  ],
  production: {
    performance: [
      'Reuse ManagedChannel across requests—connection setup expensive.',
      'Set sensible max inbound message size and keepalive to detect dead peers.',
    ],
    scalability: [
      'Client-side load balancing or service mesh (Envoy) for K8s headless services.',
    ],
    security: [
      'TLS/mTLS between services; never usePlaintext outside dev.',
    ],
    observability: [
      'OpenTelemetry grpc instrumentation for per-method latency and status codes.',
    ],
    reliability: [
      'Propagate deadlines from gateway; retry only idempotent unary with backoff policy.',
    ],
    maintainability: [
      'Buf breaking change detection or proto lint in CI before deploy.',
    ],
  },
}
