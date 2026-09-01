import type { TopicContent } from '@/domain/types'

export const connectionPoolingContent: TopicContent = {
  whatIsIt:
    'Connection pooling reuses open database TCP connections across requests instead of opening/closing per query — HikariCP is Spring Boot default DataSource pool, maintaining minimum idle and maximum active connections with fast checkout and leak detection.',
  whyExists:
    'PostgreSQL connection establishment is expensive (auth, memory ~10MB per backend). Thousands of concurrent HTTP threads cannot each hold a dedicated connection. Pool amortizes connect cost and caps DB load to maxPoolSize.',
  mentalModel:
    'App threads borrow Connection from pool → execute SQL → return (close() returns to pool, not destroy). Pool keeps warm connections ready. If all busy, thread waits up to connectionTimeout. Size pool ~ concurrent DB users, not HTTP thread count — often tens not thousands.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'HikariCP: FastList pool, minimumIdle, maximumPoolSize, connectionTimeout.',
        'spring.datasource.hikari.* in application.yml configures pool.',
        'JdbcTemplate / JpaRepository obtains connection from pooled DataSource.',
        '@Transactional binds connection to thread for txn duration — held until commit.',
        'Pool metrics: active, idle, pending threads via Micrometer / HikariPool MXBean.',
      ],
    },
    {
      type: 'table',
      headers: ['Setting', 'Typical prod', 'Meaning'],
      rows: [
        ['maximumPoolSize', '10–50 per instance', 'Max concurrent DB connections'],
        ['minimumIdle', 'same or lower', 'Warm idle connections'],
        ['connectionTimeout', '30s', 'Wait for free connection max'],
        ['maxLifetime', '30m', 'Recycle before DB/firewall timeout'],
        ['idleTimeout', '10m', 'Retire excess idle connections'],
      ],
    },
  ],
  architecture: {
    mermaid: `flowchart TB
  T1[Thread 1] --> Pool[HikariCP Pool]
  T2[Thread 2] --> Pool
  T3[Thread N] --> Pool
  Pool --> C1[Conn 1]
  Pool --> C2[Conn 2]
  Pool --> Ck[Conn k max]
  C1 --> PG[(PostgreSQL)]
  C2 --> PG
  Ck --> PG`,
    caption: 'Many threads share bounded pool of physical connections',
  },
  example: [
    {
      type: 'code',
      language: 'yaml',
      caption: 'HikariCP configuration',
      code: `spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/orders
    username: app
    password: \${DB_PASSWORD}
    hikari:
      maximum-pool-size: 20
      minimum-idle: 5
      connection-timeout: 30000
      max-lifetime: 1800000
      pool-name: orders-pool
      leak-detection-threshold: 60000`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Connection lifecycle with JPA',
      code: `@Transactional
public Order placeOrder(CreateOrderRequest req) {
  // Connection checked out at txn begin
  var order = orderRepository.save(map(req));
  inventoryRepository.decrement(req.productId(), req.qty());
  return order;
  // Connection returned to pool after commit
}`,
    },
    {
      type: 'code',
      language: 'sql',
      caption: 'Monitor connections on PostgreSQL side',
      code: `SELECT count(*) AS backends,
       state,
       application_name
FROM pg_stat_activity
WHERE datname = 'orders'
GROUP BY state, application_name;`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'HikariCP housekeeper thread retires idle/expired connections.',
        'Connection test query validationTimeout on checkout if stale.',
        'PostgreSQL max_connections global limit — sum(pool sizes × app instances) must fit.',
        'PgBouncer external pooler: transaction pooling mode incompatible with prepared statements/session state.',
        'Thread-local Spring transaction synchronization holds connection — long @Transactional holds pool slot.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Low latency connection reuse',
      'Bounds DB connection storm',
      'Built-in leak detection',
    ],
    disadvantages: [
      'Pool too small — threads block; too large — DB overload',
      'Held connections during slow external I/O in @Transactional',
    ],
    alternatives: [
      'PgBouncer at DB tier for many microservices',
      'R2DBC reactive pooling for WebFlux',
    ],
    whenToUse: [
      'Every JDBC/JPA Spring Boot application',
      'Size per instance × replicas < PostgreSQL max_connections',
    ],
    whenNotToUse: [
      'Serverless one-shot functions — maybe direct connect (still often pool locally briefly)',
    ],
  },
  failureModes: [
    'Pool exhausted — connectionTimeout SQLException; often long @Transactional or leak.',
    'Connection leak — forgot close in manual JDBC without try-with-resources.',
    'max_connections exceeded on PostgreSQL — sum of all service pools too high.',
    'External call inside @Transactional holds connection minutes.',
    'PgBouncer transaction mode breaks session-level SET and advisory locks.',
  ],
  production: {
    performance: [
      'Pool size ≈ (cores × 2) + spindle rule of thumb starting point — tune with metrics',
      'Keep transactions short to release connections',
    ],
    scalability: [
      'PgBouncer for connection multiplexing at DB',
      'Formula: instances × maximumPoolSize < max_connections − admin headroom',
    ],
    observability: [
      'hikaricp.connections.active/pending metrics',
      'Alert on pool pending > 0 sustained',
    ],
  },
  interview: {
    expectations: [
      'Why pool connections',
      'HikariCP default in Boot',
      'Pool sizing and exhaustion causes',
    ],
    commonQuestions: [
      'What is connection pooling?',
      'Why not connection per request?',
      'Connection pool exhausted — causes?',
    ],
    followUps: [
      'HikariCP vs Tomcat pool?',
      'PgBouncer vs app-side pool?',
    ],
    misconceptions: [
      'Pool size should equal max HTTP threads',
      'close() destroys physical connection always',
      'One global pool entry per application cluster automatically',
    ],
    traps: ['HTTP call inside @Transactional causing pool starvation'],
    strongSignals: [
      'HikariCP settings by name',
      'Short transactions release connections',
      'max_connections math across replicas',
    ],
  },
  keyTakeaways: [
    'Pool reuses DB connections — HikariCP default.',
    'Size pool to concurrent DB work, not thread count.',
    'Long @Transactional holds connection — pool exhaustion.',
    'instances × poolSize < PostgreSQL max_connections.',
    'leak-detection-threshold finds unclosed connections.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Why connection pooling?',
      answerHint: 'Avoid expensive connect/auth per request; cap concurrent DB connections.',
    },
    {
      level: 'intermediate',
      question: 'Pool exhausted symptoms and fixes?',
      answerHint: 'Threads wait/timeout; shorten txns, fix leaks, increase pool cautiously, reduce instances.',
    },
    {
      level: 'advanced',
      question: 'App pool vs PgBouncer?',
      answerHint: 'App pool per service instance; PgBouncer multiplexes many clients to fewer PG backends at DB tier.',
    },
  ],
  flashcards: [
    { front: 'Boot default pool', back: 'HikariCP' },
    { front: 'close() on pooled connection', back: 'Returns to pool — does not destroy TCP' },
    { front: 'Pool exhaustion common cause', back: 'Long @Transactional or connection leak' },
  ],
  quickRevision: [
    'HikariCP default',
    'maximumPoolSize bounds',
    'Short transactions',
    'No external I/O in txn',
    'leak-detection-threshold',
    'Sum pools < max_connections',
    'PgBouncer optional at DB',
  ],
}

export const content = connectionPoolingContent
