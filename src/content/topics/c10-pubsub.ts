import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Redis Pub/Sub is a fire-and-forget messaging pattern: publishers send messages to channels; all currently subscribed clients receive them instantly. No persistence, no acknowledgment, no consumer groups — pure ephemeral broadcast within Redis cluster limitations (not durable like Kafka).',
  whyExists:
    'Low-latency in-process event fan-out between services sharing Redis — cache invalidation broadcasts, live dashboard updates, WebSocket gateway notifications. Simpler than Kafka when durability and replay are not required.',
  mentalModel:
    'Radio station: tune in (SUBSCRIBE) to hear live broadcast; miss it if offline. PUBLISH shouts to room; only listeners present hear. Pattern subscribe PSUBSCRIBE order:* matches multiple channels.',
  howItWorks: [
    {
      type: 'mermaid',
      caption: 'Pub/Sub fan-out (no persistence)',
      diagram: `flowchart TB
  Pub[Publisher PUBLISH news] --> Redis
  Redis --> Sub1[Subscriber A]
  Redis --> Sub2[Subscriber B]
  Sub3[Offline subscriber C] -.->|missed| Redis`,
    },
    {
      type: 'list',
      items: [
        'SUBSCRIBE channel — blocking read loop receives messages.',
        'PUBLISH channel payload — returns count of subscribers that received.',
        'Pattern: PSUBSCRIBE user:* for wildcard channels.',
        'Spring RedisMessageListenerContainer wires MessageListener to channels.',
        'Cluster: publish routed to all nodes; sharded pub/sub improved in Redis 7.',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Cache invalidation via pub/sub',
      code: `// Publisher after DB update
redis.convertAndSend("cache:invalidate", "product:42");

// Listener on all app instances
@Component
public class CacheInvalidationListener implements MessageListener {
  @Override
  public void onMessage(Message message, byte[] pattern) {
    String key = new String(message.getBody());
    localCache.invalidate(key);
  }
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Subscriber connection enters subscriber mode — only pub/sub commands allowed on that connection.',
        'No message stored — if zero subscribers, message vanishes.',
        'Redis Streams (XADD/XREADGROUP) alternative when persistence and consumer groups needed.',
        'Sentinel/Cluster failover — subscribers must reconnect and resubscribe.',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Sub-millisecond fan-out', 'Simple API', 'Good for cache invalidation signals'],
    disadvantages: ['No durability or replay', 'No ack — message loss if subscriber down', 'Subscriber connection dedicated'],
    alternatives: ['Redis Streams', 'Kafka', 'SNS/SQS for cross-region durable events'],
    whenToUse: ['Ephemeral notifications', 'Cross-pod cache bust', 'Live metrics push'],
    whenNotToUse: ['Order events', 'Payment processing', 'Anything requiring at-least-once delivery'],
  },
  failureModes: [
    'Subscriber offline — misses invalidation — stale cache until TTL',
    'Slow subscriber blocks its connection — not others but that client stalls',
    'Cluster channel routing confusion — publish to wrong node pattern',
    'Using pub/sub as job queue — messages lost under load',
    'No backpressure — publisher overwhelms slow consumers memory',
  ],
  production: {
    reliability: ['Pair invalidation pub/sub with TTL safety net', 'Use Streams or Kafka for business events'],
    observability: ['Log publish counts; alert zero subscribers on critical channels'],
    performance: ['Keep payloads small — channel per event type not per entity when possible'],
    maintainability: ['Document ephemeral semantics — on-call knows messages are not replayable'],
  },
  interview: {
    expectations: ['Fire-and-forget semantics', 'vs Redis Streams/Kafka', 'Cache invalidation use case'],
    commonQuestions: ['Redis pub/sub vs Kafka?', 'Design cache invalidation across pods?'],
    followUps: ['What if subscriber down?', 'Pattern subscribe use?'],
    misconceptions: ['Pub/sub guarantees delivery', 'Messages persisted in Redis'],
    traps: ['Building order pipeline on pub/sub alone'],
    strongSignals: ['TTL backup', 'Streams for durability', 'Spring MessageListenerContainer'],
  },
  keyTakeaways: [
    'Pub/Sub is ephemeral broadcast — no persistence.',
    'Only connected subscribers receive messages.',
    'Ideal for cache invalidation and live notifications.',
    'Use Kafka/Streams when durability or replay required.',
    'Combine with TTL to bound staleness if signal missed.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Redis pub/sub delivery guarantee?', answerHint: 'None — fire-and-forget to current subscribers only; offline clients miss messages.' },
    { level: 'intermediate', question: 'Invalidate local cache on all pods after update?', answerHint: 'PUBLISH cache:invalidate key; each pod SUBSCRIBE and evict local entry + TTL fallback.' },
    { level: 'advanced', question: 'Pub/sub vs Redis Streams?', answerHint: 'Streams persist, consumer groups, ack; pub/sub is volatile low-latency fan-out.' },
  ],
  flashcards: [
    { front: 'PUBLISH', back: 'Send message to channel — returns subscriber count' },
    { front: 'No persistence', back: 'Messages not stored — missed if no subscriber' },
    { front: 'PSUBSCRIBE', back: 'Pattern-based channel subscription order:*' },
    { front: 'Streams alternative', back: 'XADD/XREADGROUP for durable consumer groups' },
  ],
  quickRevision: ['Ephemeral fan-out', 'SUBSCRIBE/PUBLISH', 'No replay', 'Cache invalidation use', 'Streams if durable'],
}
