import type { TopicContent } from '@/domain/types'

export const jsonContent: TopicContent = {
  whatIsIt:
    'JSON (JavaScript Object Notation) is a text format for structured data: objects {}, arrays [], strings, numbers, booleans, null. RFC 8259 standard. Dominant wire format for REST APIs; Java maps via Jackson, Gson, or json-b with POJOs/records.',
  whyExists:
    'XML was verbose and heavy for web APIs. JSON is human-readable, easy to parse in browsers and backends, and maps naturally to object graphs — standard interchange between Java services and JavaScript clients.',
  mentalModel:
    'Text serialization of trees: keys are strings in objects; arrays ordered; no comments in standard JSON; numbers are IEEE doubles (watch precision for long IDs — use strings). Parse to Map/List or bind to typed classes.',
  howItWorks: [
    {
      type: 'code',
      language: 'json',
      caption: 'JSON structure',
      code: `{
  "id": "9918374650123",
  "name": "Ada Lovelace",
  "active": true,
  "roles": ["admin", "user"],
  "address": { "city": "London", "zip": null },
  "tags": []
}`,
    },
    {
      type: 'table',
      headers: ['Type', 'JSON', 'Java (Jackson)'],
      rows: [
        ['Object', '{"a":1}', 'Map or POJO'],
        ['Array', '[1,2,3]', 'List<T> or array'],
        ['String', '"hi"', 'String'],
        ['Number', '42, 3.14', 'int, long, BigDecimal'],
        ['Boolean', 'true', 'boolean'],
        ['Null', 'null', 'null reference'],
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Long IDs as strings',
      text: 'JavaScript Number loses precision above 2^53-1. Serialize snowflake IDs as JSON strings.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Jackson serialization',
      code: `ObjectMapper mapper = new ObjectMapper();
mapper.registerModule(new JavaTimeModule());
mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

String json = mapper.writeValueAsString(user);
User user = mapper.readValue(json, User.class);`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Spring @RequestBody / @ResponseBody',
      code: `@PostMapping("/users")
public User create(@RequestBody @Valid CreateUserRequest req) {
  return service.create(req);
}

// Content-Type: application/json handled by HttpMessageConverter`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Content-Type: application/json; charset=utf-8 standard header.',
        'Jackson default typing dangerous — RCE history; avoid polymorphic default typing.',
        'Unknown properties: FAIL_ON_UNKNOWN_PROPERTIES vs ignore for API evolution.',
        'JsonProperty for name mapping; @JsonIgnore for secrets.',
        'Streaming API (JsonGenerator/JsonParser) for large payloads without full tree in memory.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Universal support, readable, compact vs XML',
      'Direct browser JSON.parse',
      'Schema tools: JSON Schema, OpenAPI',
    ],
    disadvantages: [
      'No binary efficiency vs Protobuf/Avro',
      'No native date type — ISO-8601 strings convention',
      'Schema-less flexibility causes breaking changes if unmanaged',
    ],
    alternatives: [
      'Protocol Buffers / Avro for internal high-throughput',
      'XML for legacy enterprise',
      'MessagePack binary JSON-like',
    ],
    whenToUse: [
      'Public REST APIs and web frontends',
      'Config files and logs (structured)',
    ],
    whenNotToUse: [
      'High-performance internal RPC (consider protobuf)',
      'Very large numeric precision requirements without string ids',
    ],
  },
  failureModes: [
    'Deserializing untrusted JSON to generic Object → gadget chains (historical).',
    'Long id as number → frontend rounding bugs.',
    'Timezone-less date strings parsed inconsistently.',
    'Circular references in object graph → StackOverflow on serialize.',
    'Unicode/encoding issues without UTF-8.',
  ],
  interview: {
    expectations: [
      'JSON types and syntax rules',
      'Java binding with Jackson basics',
      'Long ID as string rationale',
    ],
    commonQuestions: [
      'JSON vs XML?',
      'How serialize Java object to JSON?',
      'JSON number precision issue?',
    ],
    followUps: [
      'Jackson vs Gson?',
      'Handle unknown JSON fields on API evolution?',
    ],
    misconceptions: [
      'JSON allows trailing commas (standard JSON does not)',
      'JSON keys must be quoted (yes, double quotes only)',
      'Any JSON deserializes safely without type control',
    ],
    traps: ['Using float for money in JSON'],
    strongSignals: [
      'Mentions ISO-8601 dates and string long ids',
      'Validation on deserialize (@Valid)',
      'Streaming for large documents',
    ],
  },
  keyTakeaways: [
    'JSON: object, array, string, number, bool, null.',
    'application/json Content-Type for APIs.',
    'Jackson ObjectMapper in Java/Spring.',
    'String IDs for >53-bit integers.',
    'Validate and control deserialization types.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Valid JSON value types?',
      answerHint: 'Object, array, string, number, true/false, null.',
    },
    {
      level: 'intermediate',
      question: 'Why return large IDs as JSON strings?',
      answerHint: 'JavaScript number precision limit 2^53-1; string preserves exact id.',
    },
    {
      level: 'advanced',
      question: 'Risks deserializing untrusted JSON in Java?',
      answerHint: 'Polymorphic typing/gadget chains; use strict types, disable default typing, validate.',
    },
  ],
  flashcards: [
    { front: 'JSON key quotes', back: 'Double quotes required on keys' },
    { front: 'JavaScript safe integer', back: '±(2^53-1) — beyond use string ids' },
    { front: 'Spring JSON', back: 'Jackson HttpMessageConverter with @RequestBody/@ResponseBody' },
  ],
  quickRevision: [
    'RFC 8259 text format',
    'Double-quoted keys',
    'No comments in JSON',
    'Jackson ObjectMapper',
    'ISO-8601 dates',
    'String snowflake ids',
    'application/json charset utf-8',
  ],
}

export const content = jsonContent
