import type { TopicContent } from '@/domain/types'

export const ormAbuseContent: TopicContent = {
  whatIsIt:
    'ORM abuse is anti-pattern use of JPA/Hibernate — treating the ORM as a magic database wrapper without understanding SQL, fetch plans, transactions, and boundaries — leading to N+1 queries, memory bloat, incorrect locking, and unmaintainable object graphs.',
  whyExists:
    'ORMs lower the barrier to persistence but hide costs. Teams skip schema design, return entities from APIs, enable OSIV, use EAGER everywhere, or run reports through entity graphs — production pain that ORM reputation suffers from unfairly when used without discipline.',
  mentalModel:
    'ORM is a tool for mapping well-designed aggregates to SQL — not a replacement for query design. Use entities inside transactions for writes; DTOs/projections for reads; SQL/JDBC for bulk; explicit fetch plans; know what SQL fires.',
  howItWorks: [
    {
      type: 'list',
      items: [
        'Anti-pattern catalog: entity as API model, OSIV everywhere, EAGER collections, missing pagination.',
        'God entity with 20 associations and cascade ALL.',
        'findAll() in production list endpoints.',
        'JPQL without understanding generated SQL.',
        'Using ORM for CSV import of 10M rows.',
        'Ignoring @Version on concurrent fields.',
        'MultipleBagFetchException “fixes” with EAGER.',
      ],
    },
    {
      type: 'table',
      headers: ['Abuse', 'Fix'],
      rows: [
        ['Entity in REST JSON', 'DTO + MapStruct; fetch only needed fields'],
        ['OSIV=true default', 'spring.jpa.open-in-view=false; fetch in service'],
        ['N+1 in loops', 'JOIN FETCH / @BatchSize / projection query'],
        ['Report via entity graph', 'Native SQL, jOOQ, or materialized view'],
        ['Bulk insert loop save()', 'jdbcTemplate batchUpdate or COPY'],
        ['Logic in @Formula everywhere', 'Computed in SQL view or app layer clearly'],
      ],
    },
  ],
  architecture: {
    mermaid: `flowchart TB
  Good[Healthy ORM use] --> Agg[Small aggregates]
  Good --> DTO[DTO read models]
  Good --> Explicit[Explicit fetch per use case]
  Bad[ORM abuse] --> Graph[Huge entity graphs]
  Bad --> OSIV[OSIV hides N+1]
  Bad --> Magic[No SQL visibility]`,
    caption: 'Disciplined boundaries vs abuse patterns',
  },
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Abuse — entity returned from controller',
      code: `@RestController
class BadOrderController {
    @GetMapping("/orders/{id}")
    Order get(@PathVariable Long id) {
        return orderRepo.findById(id).orElseThrow();
        // JSON serializer triggers lazy loads → N+1, exposes schema
    }
}

// Fix:
record OrderResponse(Long id, String userEmail, List<ItemDto> items) {}

@GetMapping("/orders/{id}")
OrderResponse get(@PathVariable Long id) {
    return orderService.getOrderResponse(id); // JOIN FETCH or projection inside @Transactional
}`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Abuse — save in loop vs batch',
      code: `// BAD: 10_000 INSERTs
for (Row row : rows) {
    repo.save(map(row));
}

// GOOD: JDBC batch
jdbcTemplate.batchUpdate(
    "INSERT INTO staging (a,b) VALUES (?,?)",
    rows, 500,
    (ps, row) -> { ps.setString(1, row.a()); ps.setInt(2, row.b()); });`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Healthy aggregate boundary',
      code: `@Entity
public class Order { // aggregate root
    @OneToMany(mappedBy = "order", cascade = ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();

    @ManyToOne(fetch = LAZY) @JoinColumn(name = "user_id")
    private User user; // no cascade REMOVE on User
}

// User loaded by id reference only:
order.setUser(em.getReference(User.class, userId));`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Hibernate filters, @Where soft delete — magic conditions complicate reporting SQL.',
        'Second-level cache misuse — stale reads across instances.',
        'Polymorphic JOINED inheritance — join overhead on every query.',
        'Lombok @Data on entities — equals/hashCode on collections breaks sets.',
        'ddl-auto=update in production — schema drift disaster.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Knowing abuse patterns prevents costly rewrites',
      'Hybrid ORM + SQL uses right tool per job',
      'Team conventions (DTO mandatory) scale maintainability',
    ],
    disadvantages: [
      'More layers (DTO mapping) than “quick” entity CRUD prototype',
      'Requires SQL literacy anyway',
    ],
    alternatives: [
      'Spring Data JDBC for simpler mental model',
      'jOOQ for SQL-first type safety',
      'MyBatis explicit SQL mapping',
    ],
    whenToUse: [
      'ORM for aggregate CRUD and typed domain model',
      'SQL/JDBC for bulk, reporting, complex analytics',
    ],
    whenNotToUse: [
      'ORM as only data access with zero EXPLAIN skill',
      'Entity graphs for every read endpoint',
    ],
  },
  failureModes: [
    'Production meltdown: OSIV + lazy JSON serialization.',
    'Memory OOM: findAll() million rows to List<Entity>.',
    'Lost updates: no @Version on shared editable entity.',
    'Cascade REMOVE deleted shared Category with all Products.',
    'ddl-auto update dropped column in prod.',
    'Native query DTO mapping wrong — silent null columns.',
  ],
  production: {
    performance: ['Query count budget per endpoint in tests', 'Disable OSIV'],
    maintainability: ['ADR: entity never leaves service layer', 'Flyway not ddl-auto'],
    observability: ['Datasource proxy log SQL count > 20 per request alert'],
  },
  interview: {
    expectations: [
      'Name common ORM anti-patterns and fixes',
      'When not to use JPA',
      'DTO boundary rationale',
    ],
    commonQuestions: [
      'ORM pitfalls you have seen?',
      'When use JDBC instead of JPA?',
      'Open Session In View — good or bad?',
    ],
    followUps: ['Aggregate design DDD', 'Hybrid repository pattern'],
    misconceptions: [
      'ORM means never write SQL',
      'Hibernate always slower than JDBC for single row',
      'More annotations = better mapping',
    ],
    traps: ['Recommend ORM for high-throughput bulk ETL'],
    strongSignals: [
      'DTO + explicit fetch',
      'OSIV disabled',
      'SQL visibility p6spy/datasource-proxy',
      'Right tool: ORM write, SQL read report',
    ],
  },
  keyTakeaways: [
    'Entities for transactional writes inside aggregates — not API models.',
    'DTOs/projections for reads; know generated SQL.',
    'Disable OSIV; fix N+1 explicitly.',
    'Bulk/batch/reporting → JDBC or native SQL.',
    'Schema migrations via Flyway; never ddl-auto in prod.',
    'ORM + SQL hybrid is professional use — not failure.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Why not return JPA entity from REST API?',
      answerHint: 'Lazy load/N+1 on serialize; exposes schema; coupling; use DTO with fetched fields.',
    },
    {
      level: 'intermediate',
      question: 'Open Session In View — recommend?',
      answerHint: 'Generally disable in prod; masks N+1; extends session through view; fetch in service instead.',
    },
    {
      level: 'advanced',
      question: 'When choose JDBC over JPA in Spring app?',
      answerHint: 'Bulk insert/update millions rows; complex reporting; need full SQL control; streaming ResultSet.',
    },
  ],
  flashcards: [
    { front: 'OSIV abuse', back: 'Hides N+1; long session; disable in prod' },
    { front: 'Entity as API', back: 'Anti-pattern — use DTO' },
    { front: 'Bulk insert', back: 'JDBC batch/COPY not loop save()' },
  ],
  quickRevision: [
    'DTO at API boundary',
    'OSIV off prod',
    'Explicit fetch plans',
    'No findAll huge tables',
    'ORM writes SQL reads',
    'Flyway not ddl-auto',
    'Small aggregates cascade',
  ],
}

export const content = ormAbuseContent
