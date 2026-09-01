import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Schema evolution manages changing event payload structure over time without breaking consumers. Confluent Schema Registry stores Avro/Protobuf/JSON Schema with version history. Compatibility modes: BACKWARD (new schema reads old data), FORWARD, FULL. Producers register schema; serializers embed schema id in message.',
  whyExists:
    'Events are long-lived in Kafka log — consumers deploy at different times. Adding field, renaming, changing type breaks deserializers without rules. Registry enforces compatibility checks before registration — safe producer deploys.',
  mentalModel:
    'Schema is contract. Backward compatible change: add optional field with default — old consumers ignore new field, new consumers read old events. Breaking change needs new topic or consumer upgrade coordination.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Compatibility', 'Rule', 'Example allowed'],
      rows: [
        ['BACKWARD', 'New schema can read old data', 'Add optional field'],
        ['FORWARD', 'Old schema can read new data', 'Remove optional field'],
        ['FULL', 'Both directions', 'Add/remove optional only'],
        ['NONE', 'No checks', 'Breaking changes allowed — dangerous prod'],
      ],
    },
    {
      type: 'list',
      items: [
        'Wire format: magic byte + schema id + serialized payload',
        'Consumer deserializer fetches schema from registry by id',
        'Avro generic vs specific generated classes',
        'Topic subject naming: topic-value, topic-key strategies',
        'DLQ for records failing deserialization during evolution mistakes',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'json',
      caption: 'Backward compatible Avro evolution',
      code: `// v1
{ "type": "record", "name": "Order", "fields": [
  {"name": "orderId", "type": "string"},
  {"name": "amount", "type": "double"}
]}
// v2 — add optional field with default (BACKWARD compatible)
{"name": "currency", "type": "string", "default": "USD"}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Schema id stored in each message — compact vs embedding full schema',
        'Registry HA — caching on serializers reduces dependency',
        'Confluent BACKWARD default fits consumer-first deploy pattern',
        'Protobuf field numbers never reuse — reserved keyword',
        'JSON Schema less common in Kafka vs Avro/Protobuf',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Safe rolling upgrades', 'Central schema catalog', 'Validation before publish'],
    disadvantages: ['Registry operational dependency', 'Avro learning curve', 'Wrong compatibility mode allows breaks'],
    alternatives: ['Protobuf in repo + manual compatibility', 'JSON without registry — risky'],
    whenToUse: ['All multi-team Kafka event contracts'],
    whenNotToUse: ['Internal ephemeral topics with single producer/consumer synced deploy'],
  },
  failureModes: [
    'Breaking change registered — old consumers crash loop',
    'Registry down — producer cannot serialize',
    'Same field type change int→string — rejected or corrupt',
    'Removing required field without compatibility plan',
  ],
  production: {
    reliability: ['Registry cluster HA', 'Serializer cache schema locally'],
    maintainability: ['CI compatibility check on schema PR', 'Document evolution guidelines'],
    observability: ['Deserialization error rate by topic'],
  },
  interview: {
    expectations: ['Backward compatibility', 'Schema registry role', 'Safe vs breaking changes'],
    commonQuestions: ['Add field to event safely?', 'Schema registry purpose?', 'Avro vs JSON?'],
    followUps: ['FULL vs BACKWARD?', 'Breaking change strategy?'],
    misconceptions: ['Consumers auto-adapt to any JSON', 'Removing field always safe'],
    traps: ['Change field type in place in prod'],
    strongSignals: ['BACKWARD default, optional fields with defaults, new topic for breaking v2'],
  },
  keyTakeaways: [
    'Use Schema Registry for Kafka event contracts.',
    'Prefer BACKWARD compatibility — add optional fields with defaults.',
    'Breaking changes → new topic or coordinated flag day.',
    'Schema id embedded in each serialized message.',
    'CI validate compatibility before deploy.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Why schema registry?', answerHint: 'Central schema versions + compatibility enforcement for evolving event payloads.' },
    { level: 'intermediate', question: 'Backward compatible change example?', answerHint: 'Add new optional field with default — old consumers still deserialize.' },
    { level: 'advanced', question: 'Breaking schema change rollout?', answerHint: 'New topic orders-v2, dual publish, migrate consumers, deprecate v1; or stop-the-world deploy.' },
  ],
  flashcards: [
    { front: 'BACKWARD compatibility', back: 'New schema reads old serialized data' },
    { front: 'Schema Registry', back: 'Stores versions; serializers fetch by id' },
    { front: 'Safe evolution', back: 'Add optional field with default' },
    { front: 'Breaking change', back: 'New topic or coordinated consumer upgrade' },
  ],
  quickRevision: ['Registry + compatibility', 'BACKWARD default', 'Optional + default', 'Schema id in message', 'CI check schemas'],
}
