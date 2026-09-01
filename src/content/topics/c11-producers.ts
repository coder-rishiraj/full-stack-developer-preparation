import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Kafka producers send records to topics — partition chosen by key hash or round-robin. Config: acks (0/1/all), retries, enable.idempotence, compression, batch.size, linger.ms. acks=all with min.insync.replicas ensures committed records survive broker failure. Spring: KafkaTemplate send with ListenableFuture.',
  whyExists:
    'Services publish domain events and commands to log. Producer API handles batching, partitioning, retries, and metadata refresh. Correct producer settings prevent silent message loss and duplicate bursts under failure.',
  mentalModel:
    'Producer batches records for efficiency, sends to partition leader, waits for ack per acks setting. Idempotent producer collapses retry duplicates. Key determines partition for ordering. Async send — handle failures in callback.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Setting', 'Behavior', 'Trade-off'],
      rows: [
        ['acks=0', 'Fire and forget', 'Fastest; may lose'],
        ['acks=1', 'Leader ack only', 'Lose if leader dies before replicate'],
        ['acks=all', 'All ISR ack', 'Safest with min.insync.replicas≥2'],
        ['enable.idempotence=true', 'PID + sequence dedup', 'Slight overhead; enables max.in.flight=5 safe'],
        ['retries', 'Retry transient errors', 'Without idempotence → duplicates'],
        ['compression=lz4/zstd', 'Smaller network', 'CPU cost'],
      ],
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Reliable Spring producer',
      code: `@Bean
ProducerFactory<String, OrderEvent> pf() {
  Map<String, Object> props = new HashMap<>();
  props.put(ProducerConfig.ACKS_CONFIG, "all");
  props.put(ProducerConfig.ENABLE_IDEMPOTENCE_CONFIG, true);
  props.put(ProducerConfig.RETRIES_CONFIG, Integer.MAX_VALUE);
  return new DefaultKafkaProducerFactory<>(props);
}

kafkaTemplate.send("orders", orderId, event); // key = orderId`,
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Order service publishes OrderCreated with key orderId, acks=all. Broker leader replicates to ISR before ack. Producer callback logs failure to retry queue if all retries exhausted.',
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Record batch sent to partition leader broker',
        'Metadata refresh on partition leader change',
        'max.in.flight.requests.per.connection ordering vs throughput',
        'Transactional producer for exactly-once pipeline',
        'Headers for trace id, schema id, content-type',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['High throughput batching', 'Idempotent retries safe', 'Compression saves bandwidth'],
    disadvantages: ['acks=all higher latency', 'Misconfig causes loss or duplicates', 'Batching adds linger latency'],
    alternatives: ['Outbox relay producer separate from request path', 'HTTP for sync low-volume'],
    whenToUse: ['All event publishing from services'],
    whenNotToUse: ['When synchronous confirmation to user required without outbox — still async publish after commit'],
  },
  failureModes: [
    'acks=1 only — lose on leader crash before replicate',
    'No idempotence + retries — duplicate records',
    'Missing key — order events disordered',
    'Producer buffer full block request thread — configure max.block.ms',
    'Serialization error after partial send',
  ],
  production: {
    reliability: ['acks=all, idempotence, min.insync.replicas=2', 'Monitor failed send rate'],
    performance: ['Tune batch.size and linger.ms', 'Compression for large payloads'],
    observability: ['Producer metrics: record-error-rate, request-latency'],
  },
  interview: {
    expectations: ['acks levels', 'Idempotent producer', 'Partition key', 'Batching'],
    commonQuestions: ['Prevent message loss?', 'acks=all meaning?', 'Duplicate on retry?'],
    followUps: ['min.insync.replicas?', 'Transactional producer?'],
    misconceptions: ['send() sync by default always safe', 'More retries always good without idempotence'],
    traps: ['acks=0 for order events'],
    strongSignals: ['acks=all + idempotence + key for order + callback error handling'],
  },
  keyTakeaways: [
    'Use acks=all and enable.idempotence for critical events.',
    'Partition key preserves order per entity.',
    'Retries without idempotence duplicate — enable idempotence.',
    'Batching via linger.ms improves throughput.',
    'Handle send failures in callback — do not fire-and-forget silently.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Kafka producer acks=all?', answerHint: 'Wait for all in-sync replicas to ack — strongest durability with min.insync.replicas.' },
    { level: 'intermediate', question: 'Idempotent producer benefit?', answerHint: 'Broker dedupes retry sends — same record not duplicated on network retry.' },
    { level: 'advanced', question: 'Producer slow — block user request?', answerHint: 'Use outbox pattern — write DB + outbox async relay; or async send with backpressure monitoring.' },
  ],
  flashcards: [
    { front: 'acks=all', back: 'Leader waits for ISR replicas before ack' },
    { front: 'enable.idempotence', back: 'Producer PID sequence prevents duplicate broker records on retry' },
    { front: 'Partition key', back: 'Routes record to partition — ordering per key' },
    { front: 'linger.ms', back: 'Wait to batch records — throughput vs latency' },
  ],
  quickRevision: ['acks=all', 'Idempotent producer', 'Key for order', 'Handle send errors', 'Batch tuning'],
}
