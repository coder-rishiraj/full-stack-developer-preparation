import type { TopicContent } from '@/domain/types'

export const nplus1Content: TopicContent = {
  whatIsIt:
    'The N+1 problem occurs when ORM code executes 1 query to load N parent entities, then N additional queries (one per parent) to load a lazy association — turning O(1) expected queries into O(N+1), crushing latency under load.',
  whyExists:
    'Lazy loading loads associations on access. A loop calling getOrders() on each User triggers one SELECT per user. Without fetch joins, batch fetching, or DTO projections, innocent-looking service code generates hundreds of SQL round-trips per HTTP request.',
  mentalModel:
    'SELECT users → 100 rows. For each user, touch orders → 100 more SELECTs. Total 101 queries. Fix: fetch join in original query, @BatchSize, entity graph, or query DTO directly — load all needed data in 1–2 queries.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Root query returns N entities (users, orders, posts).',
        'Business logic accesses lazy association per entity in loop.',
        'Each access → separate SELECT WHERE parent_id = ?.',
        'OSIV may defer problem to view layer JSON serialization.',
        'Detection: Hibernate stats, datasource-proxy, p6spy, APM SQL count.',
      ],
    },
    {
      type: 'table',
      headers: ['Fix', 'Mechanism'],
      rows: [
        ['JOIN FETCH', 'Single JPQL with JOIN FETCH association'],
        ['@EntityGraph', 'Declarative fetch plan on repository method'],
        ['@BatchSize', 'Batch lazy loads: WHERE id IN (?,?,?)'],
        ['DTO projection', 'SELECT new Dto(u.email, o.total) JOIN ...'],
        ['Subselect fetch', '@Fetch(SUBSELECT) Hibernate-specific'],
      ],
    },
  ],
  architecture: {
    mermaid: `flowchart TB
  Q1[1 query: SELECT users] --> Loop[For each user]
  Loop --> QN[N queries: SELECT orders WHERE user_id=?]
  Fix[JOIN FETCH users + orders] --> QOne[1 query with JOIN]`,
    caption: 'N+1 vs single fetch join',
  },
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'N+1 anti-pattern',
      code: `@Transactional(readOnly = true)
public List<UserSummary> summarize() {
    List<User> users = userRepo.findAll(); // 1 query
    return users.stream()
        .map(u -> new UserSummary(
            u.getEmail(),
            u.getOrders().size()))  // N queries — lazy load each orders list
        .toList();
}`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Fix — JOIN FETCH',
      code: `@Query("""
    SELECT DISTINCT u FROM User u
    LEFT JOIN FETCH u.orders
    WHERE u.status = 'ACTIVE'
    """)
List<User> findActiveWithOrders();

// Or batch size on entity
@Entity
@BatchSize(size = 25)
public class User { ... }
// Hibernate: SELECT orders WHERE user_id IN (?,?,...25 ids)`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Fix — DTO projection (best for read APIs)',
      code: `@Query("""
    SELECT new com.app.dto.UserOrderCount(u.email, COUNT(o))
    FROM User u LEFT JOIN u.orders o
    WHERE u.status = 'ACTIVE'
    GROUP BY u.id, u.email
    """)
List<UserOrderCount> countOrdersByUser();`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'DISTINCT needed with JOIN FETCH collections to dedupe parent entities in result.',
        'Pagination + fetch join: use @EntityGraph on query without count or two-step query.',
        'Multiple associations: fetch one per query or @BatchSize on both — avoid dual join fetch bags.',
        'Spring Data @EntityGraph(type=LOAD) merges with entity fetch type.',
        'Statistics: hibernate.generate_statistics=true → sessionFactory.getStatistics().getQueryExecutionCount().',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Fixing N+1 often 10–100× latency improvement',
      'Forces explicit data requirements per use case',
    ],
    disadvantages: [
      'JOIN FETCH over-fetches if only count needed',
      'BatchSize still multiple queries but bounded',
    ],
    alternatives: [
      'Cache assembled DTOs',
      'Read model / materialized query table',
      'GraphQL DataLoader batching pattern',
    ],
    whenToUse: [
      'Any loop touching lazy association',
      'API returning lists with nested data',
    ],
    whenNotToUse: [
      'JOIN FETCH when only need parent id list',
      'Fetching entire graph when DTO needs two fields',
    ],
  },
  failureModes: [
    'OSIV hides N+1 until production traffic.',
    'JOIN FETCH two lists → Cartesian product or exception.',
    'DISTINCT omitted → duplicate parents in list.',
    'findAll() + lazy in JSON serializer → N+1 in controller.',
    '@Transactional on repo only — service loop outside txn still N+1 if batching off.',
  ],
  production: {
    performance: ['SQL query count assertion in integration tests (<5 per endpoint)'],
    observability: ['Micrometer + JDBC metrics; log queries > threshold'],
  },
  interview: {
    expectations: [
      'Define N+1 with example query count',
      'JOIN FETCH, EntityGraph, BatchSize fixes',
      'OSIV masking',
    ],
    commonQuestions: [
      'What is N+1 in Hibernate?',
      'How detect and fix?',
      'JOIN FETCH vs @BatchSize?',
    ],
    followUps: ['Pagination with fetch join', 'DTO projection benefits'],
    misconceptions: [
      'EAGER always fixes N+1',
      'N+1 only in loops (also JSON serialization)',
      'One query always best (over-fetch cost)',
    ],
    traps: ['JOIN FETCH two collections in one query without DISTINCT/subselect'],
    strongSignals: [
      'DTO projection for read models',
      'Disable OSIV',
      'DISTINCT with collection fetch join',
    ],
  },
  keyTakeaways: [
    'N+1 = 1 + N queries from lazy access in loop.',
    'Fix with JOIN FETCH, @EntityGraph, @BatchSize, or DTO query.',
    'Detect via SQL logging and integration test query budgets.',
    'OSIV defers pain — fix at service/repository layer.',
    'JOIN FETCH collections needs DISTINCT; mind pagination.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Explain N+1 problem.',
      answerHint: 'One query for list plus one per row for lazy association — 1+N total.',
    },
    {
      level: 'intermediate',
      question: 'Fix N+1 for users and orders list?',
      answerHint: 'JOIN FETCH u.orders in JPQL; EntityGraph; @BatchSize; or aggregate DTO query.',
    },
    {
      level: 'advanced',
      question: 'JOIN FETCH vs @BatchSize tradeoff?',
      answerHint: 'Join single query may over-fetch wide rows; BatchSize fewer round-trips than N but multiple IN queries — tune by data width.',
    },
  ],
  flashcards: [
    { front: 'N+1 formula', back: '1 query parents + N lazy child queries' },
    { front: 'JOIN FETCH caveat', back: 'Use DISTINCT; careful with Pageable' },
    { front: '@BatchSize', back: 'Groups lazy loads into IN (?) batches' },
  ],
  quickRevision: [
    '1 + N lazy queries',
    'Loop or JSON triggers',
    'JOIN FETCH / EntityGraph',
    '@BatchSize alternative',
    'DTO projection best read',
    'DISTINCT with collections',
    'Disable OSIV detect',
  ],
}

export const content = nplus1Content
