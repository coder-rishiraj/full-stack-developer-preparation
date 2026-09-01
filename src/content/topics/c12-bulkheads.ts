import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Bulkhead pattern isolates resources into pools so failure in one area does not exhaust entire system — named after ship watertight compartments. Implementations: separate thread pools per dependency, connection pool limits per downstream, Hystrix/Resilience4j bulkhead, Kubernetes CPU/memory limits per pod, database pool split read vs write.',
  whyExists:
    'One slow payment gateway can block all Tomcat threads if shared pool — entire site down. Bulkheads cap resource usage per dependency or feature — search slow but checkout still has threads.',
  mentalModel:
    'Do not share one big pool for everything. Checkout gets 50 threads; reports get 10. Payment client max 20 concurrent calls. When bulkhead full — fail fast that feature only.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Bulkhead type', 'Example'],
      rows: [
        ['Thread pool isolation', 'Resilience4j bulkhead per external service'],
        ['Connection pool', 'Max 10 connections to legacy ERP'],
        ['Semaphore', 'Max 5 concurrent expensive report jobs'],
        ['Process isolation', 'Separate microservice for risky batch'],
        ['K8s limits', 'CPU/memory quota per deployment'],
      ],
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Resilience4j bulkhead',
      code: `Bulkhead bulkhead = Bulkhead.of("paymentGateway",
    BulkheadConfig.custom().maxConcurrentCalls(20).maxWaitDuration(Duration.ZERO).build());

Bulkhead.decorateSupplier(bulkhead, () -> paymentClient.charge(order));`,
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'E-commerce: catalog API bulkhead 100 threads; admin export bulkhead 5 threads. Export spike fills its bulkhead — exports fail fast; shoppers unaffected.',
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Bulkhead full → CallNotPermittedException — handle gracefully',
        'maxWaitDuration > 0 queues — may still block; zero wait fails fast',
        'Combine with circuit breaker on same dependency',
        'Sizing requires load test per compartment',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Blast radius containment', 'Predictable degradation per feature', 'Easier reasoning under partial failure'],
    disadvantages: ['Complex tuning', 'Underutilized reserved capacity', 'More thread pools = more threads total'],
    alternatives: ['Single pool + circuit breaker only — less isolation', 'Separate microservices physical bulkhead'],
    whenToUse: ['Mixed criticality workloads on same service', 'Noisy neighbor dependencies'],
    whenNotToUse: ['Tiny app where overhead exceeds benefit'],
  },
  failureModes: [
    'Bulkhead too small — false rejects under normal peak',
    'Bulkhead too large — no isolation benefit',
    'Shared pool anyway for "just this one call"',
    'Blocking bulkhead queue negates isolation',
  ],
  production: {
    reliability: ['Per-dependency bulkheads on all external IO', 'Fail fast when saturated'],
    observability: ['Bulkhead available concurrent metrics', 'Reject count by compartment'],
    performance: ['Load test to size pools', 'Avoid oversubscribing total threads'],
  },
  interview: {
    expectations: ['Bulkhead metaphor', 'Thread pool isolation', 'vs circuit breaker'],
    commonQuestions: ['Bulkhead pattern?', 'Prevent one dependency killing service?', 'Size bulkheads?'],
    followUps: ['Bulkhead + circuit breaker together?', 'K8s as bulkhead?'],
    misconceptions: ['Circuit breaker same as bulkhead', 'More threads always helps'],
    traps: ['Single shared executor for all integrations'],
    strongSignals: ['Separate pools per dependency, max concurrent limits, fail fast, metrics'],
  },
  keyTakeaways: [
    'Isolate resources so one failure domain cannot drain all.',
    'Separate thread pools or semaphores per dependency/feature.',
    'Fail fast when compartment full.',
    'Combine with circuit breakers for open circuit protection.',
    'Size via load testing — not guesswork.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'What is bulkhead pattern?', answerHint: 'Resource pools isolated — failure in one compartment does not sink entire ship/system.' },
    { level: 'intermediate', question: 'Bulkhead vs circuit breaker?', answerHint: 'Bulkhead limits concurrent usage always; breaker stops calls after failure threshold — complementary.' },
    { level: 'advanced', question: 'Design bulkheads for monolith with 5 external APIs?', answerHint: 'Dedicated executor/semaphore per API with tuned limits; critical path gets larger pool; monitor rejections.' },
  ],
  flashcards: [
    { front: 'Bulkhead', back: 'Isolated resource pool limiting blast radius' },
    { front: 'maxConcurrentCalls', back: 'Resilience4j bulkhead concurrency cap' },
    { front: 'Fail fast', back: 'Reject when bulkhead full — do not block all threads' },
    { front: 'vs circuit breaker', back: 'Bulkhead limits load; breaker stops after errors' },
  ],
  quickRevision: ['Isolate pools', 'Per dependency limits', 'Fail fast full', 'Size by load test', 'Pair with breaker'],
}
