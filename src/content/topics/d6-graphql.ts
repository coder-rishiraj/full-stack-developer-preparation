import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'GraphQL is query language and runtime for APIs — clients request exact shape of nested data in single round trip via typed schema (Query, Mutation, Subscription). Server resolves fields through resolvers fetching from databases and services; contrasts with fixed REST endpoints.',
  whyExists:
    'Mobile clients suffer over-fetching (whole user object for name) and under-fetching (N+1 REST calls for posts+authors). GraphQL lets client specify `{ user(id:1) { name posts { title } } }` — one HTTP request, server joins data.',
  mentalModel:
    'Restaurant menu where you compose plate from any listed fields. Schema is contract; resolvers are kitchen stations fetching each field. Graph traverses query tree depth-first calling resolvers per field.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Concept', 'Role'],
      rows: [
        ['Schema SDL', 'Types Query Mutation Subscription definitions'],
        ['Resolver', 'Function fetching field value for parent object'],
        ['DataLoader', 'Batch + cache N+1 resolver calls'],
        ['Introspection', 'Client discovers schema — disable in prod often'],
        ['Fragments', 'Reusable field selections'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'Query resolution tree',
      diagram: `flowchart TB
  Q[Query user] --> R1[UserResolver]
  R1 --> F1[name field]
  R1 --> F2[posts field]
  F2 --> R2[PostsResolver batch]
  R2 --> DB[(Database)]`,
    },
    {
      type: 'list',
      items: [
        'POST /graphql with JSON { query, variables }.',
        'Mutations for writes; subscriptions WebSocket for push.',
        'Depth/complexity limits prevent malicious expensive queries.',
        'Apollo Server / Spring GraphQL common Java stacks.',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'graphql',
      caption: 'Client query with variables',
      code: `query GetOrder($id: ID!) {
  order(id: $id) {
    id
    status
    customer { name email }
    items { sku quantity price }
  }
}`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Spring GraphQL controller resolver',
      code: `@QueryMapping
public Order order(@Argument String id) {
  return orderService.findById(id);
}

@SchemaMapping(typeName = "Order", field = "items")
public List<OrderItem> items(Order order) {
  return orderItemService.findByOrderId(order.getId());
}`,
    },
  ],
  tradeoffs: {
    advantages: ['Flexible client queries', 'Strong typing schema', 'Single round trip nested data', 'Evolve fields without versioning URLs'],
    disadvantages: ['N+1 without DataLoader', 'Caching harder than REST HTTP cache', 'Complexity server-side', 'File upload awkward'],
    alternatives: ['REST + BFF aggregation', 'gRPC for internal', 'OData'],
    whenToUse: ['Mobile/ web varied data needs', 'Public API many clients', 'Rapid frontend iteration'],
    whenNotToUse: ['Simple CRUD file upload CDN', 'HTTP cache critical public read'],
  },
  failureModes: [
    'Unbounded query depth DoS',
    'N+1 resolver DB explosion',
    'Introspection exposes internal schema',
    'Authorization missed on nested field',
    'Breaking schema change without deprecation',
  ],
  production: {
    performance: ['DataLoader batching', 'Query complexity cost analysis', 'Persisted queries allowlist'],
    security: ['Field-level auth', 'Disable introspection prod', 'Rate limit by cost'],
    observability: ['Trace resolver timings', 'Log slow queries'],
    maintainability: ['Schema deprecation @deprecated directive', 'Federation for microservices graphs'],
  },
  interview: {
    expectations: ['Schema vs REST resources', 'Resolver N+1 DataLoader', 'When GraphQL vs REST', 'Mutation/subscription'],
    commonQuestions: ['GraphQL advantages?', 'Prevent expensive query?'],
    followUps: ['Federation?', 'Caching strategy?'],
    misconceptions: ['GraphQL replaces database', 'Always faster than REST'],
    traps: ['No batching on list field resolver'],
    strongSignals: ['DataLoader', 'Complexity limits', 'BFF comparison', 'Field auth'],
  },
  keyTakeaways: [
    'Client selects nested fields in one query.',
    'Schema + resolvers serve graph of data.',
    'DataLoader fixes N+1 resolver problem.',
    'Apply depth/complexity limits in production.',
    'Strong for flexible clients; REST simpler for cacheable resources.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'GraphQL vs REST main difference?', answerHint: 'Client specifies exact nested shape one request; REST fixed resource endpoints multiple round trips.' },
    { level: 'intermediate', question: 'N+1 problem in GraphQL?', answerHint: 'List resolver calls child resolver per item — batch with DataLoader single query.' },
    { level: 'advanced', question: 'Secure nested field access?', answerHint: 'Field-level authorization in resolvers; don\'t rely on parent auth only; schema directives @auth.' },
  ],
  flashcards: [
    { front: 'Resolver', back: 'Function providing value for schema field' },
    { front: 'DataLoader', back: 'Batches and caches loads per request' },
    { front: 'Mutation', back: 'GraphQL write operation' },
    { front: 'Query complexity', back: 'Cost limit preventing abusive deep queries' },
  ],
  quickRevision: ['Client shapes query', 'Schema + resolvers', 'DataLoader N+1', 'Complexity limits', 'vs REST cache'],
}
