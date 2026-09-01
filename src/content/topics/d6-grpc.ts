import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'gRPC is high-performance RPC framework using HTTP/2 and Protocol Buffers — strongly typed service definitions (.proto), bidirectional streaming, low latency binary serialization. Common for internal microservice communication; browsers need grpc-web proxy.',
  whyExists:
    'REST JSON verbose and schema-loose for service-to-service at scale. gRPC generates client/server stubs from proto, supports streaming, and multiplexes many calls on one connection — efficient for polyglot internal APIs.',
  mentalModel:
    'Typed remote procedure call. Define service OrderService { rpc GetOrder(OrderId) returns (Order); } — protoc generates Java stubs. Client calls stub like local method; framework handles wire encoding HTTP/2 frames.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Feature', 'Detail'],
      rows: [
        ['Protocol Buffers', 'Binary schema-evolvable messages'],
        ['HTTP/2', 'Multiplexing header compression'],
        ['Unary', 'Single request response'],
        ['Server streaming', 'One request many responses'],
        ['Client streaming', 'Many requests one response'],
        ['Bidirectional', 'Both stream independently'],
      ],
    },
    {
      type: 'code',
      language: 'protobuf',
      caption: 'Proto service definition',
      code: `syntax = "proto3";
service InventoryService {
  rpc GetStock (StockRequest) returns (StockResponse);
  rpc WatchStock (StockRequest) returns (stream StockResponse);
}
message StockRequest { string sku = 1; }
message StockResponse { string sku = 1; int32 qty = 2; }`,
    },
    {
      type: 'list',
      items: [
        'spring-grpc or grpc-java server @GrpcService annotated implementation.',
        'Deadline/timeout propagated per call context.',
        'Status codes rich error model trailers metadata.',
        'mTLS service mesh Istio encrypts gRPC traffic.',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'gRPC service implementation sketch',
      code: `@GrpcService
public class InventoryGrpc extends InventoryServiceImplBase {
  @Override
  public void getStock(StockRequest req, StreamObserver<StockResponse> obs) {
    int qty = inventoryRepo.getQty(req.getSku());
    obs.onNext(StockResponse.newBuilder().setSku(req.getSku()).setQty(qty).build());
    obs.onCompleted();
  }
}`,
    },
  ],
  tradeoffs: {
    advantages: ['Fast binary proto', 'Streaming native', 'Strong contracts code gen', 'HTTP/2 efficient'],
    disadvantages: ['Not human readable debug', 'Browser limited grpc-web needed', 'Load balancer L7 must support HTTP/2'],
    alternatives: ['REST JSON public APIs', 'Kafka async events', 'GraphQL BFF'],
    whenToUse: ['Internal service RPC', 'Low latency streaming', 'Polyglot microservices'],
    whenNotToUse: ['Public browser-facing API primary', 'Simple CRUD with HTTP cache needs'],
  },
  failureModes: [
    'Missing deadline — hung calls cascade',
    'Proto breaking change without field numbers reserved',
    'HTTP/2 connection idle LB timeout',
    'Large message default 4MB limit',
    'No retry idempotency on non-idempotent RPC',
  ],
  production: {
    reliability: ['Deadlines on every call', 'Retry only idempotent with backoff', 'Health grpc.health.v1'],
    performance: ['Connection pooling channels', 'Keepalive settings'],
    observability: ['OpenTelemetry grpc interceptors', 'Status code metrics'],
    security: ['mTLS between services', 'Auth metadata JWT in headers'],
  },
  interview: {
    expectations: ['Proto definition', 'HTTP/2 why faster', 'Streaming types', 'gRPC vs REST when'],
    commonQuestions: ['Internal microservice communication choice?', 'gRPC streaming use case?'],
    followUps: ['Proto evolution rules?', 'Browser clients?'],
    misconceptions: ['gRPC replaces Kafka', 'JSON REST always slower in all cases'],
    traps: ['gRPC for public mobile without grpc-web gateway'],
    strongSignals: ['Deadline propagation', 'Proto backward compat field numbers', 'mTLS mesh', 'Unary vs stream'],
  },
  keyTakeaways: [
    'gRPC = HTTP/2 + Protobuf typed RPC.',
    'Code generation from .proto service definitions.',
    'Supports unary and streaming call patterns.',
    'Best for internal service-to-service calls.',
    'Use deadlines and idempotent retry policies.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'gRPC vs REST?', answerHint: 'gRPC binary proto HTTP/2 RPC stubs; REST JSON text HTTP/1.1 resources — gRPC faster internal.' },
    { level: 'intermediate', question: 'Proto backward compatible change?', answerHint: 'Add new fields with new numbers; don\'t reuse numbers; optional defaults; never change types.' },
    { level: 'advanced', question: 'Server streaming example?', answerHint: 'Watch stock prices or log tail — one request stream of updates until complete.' },
  ],
  flashcards: [
    { front: 'Protocol Buffers', back: 'Binary serialization with schema in .proto files' },
    { front: 'HTTP/2 multiplexing', back: 'Many gRPC calls one TCP connection' },
    { front: 'Deadline', back: 'Client timeout propagated to server context' },
    { front: 'grpc-web', back: 'Browser proxy translating to gRPC backend' },
  ],
  quickRevision: ['Proto + HTTP/2', 'Generated stubs', 'Unary + streams', 'Internal RPC', 'Deadlines + mTLS'],
}
