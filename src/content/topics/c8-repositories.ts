import type { TopicContent } from '@/domain/types'

export const repositoriesContent: TopicContent = {
  whatIsIt:
    'Spring Data JPA repositories are interfaces extending JpaRepository (or PagingAndSortingRepository) — Spring generates implementations at runtime for CRUD, derived query methods, @Query JPQL/native SQL, and projections without boilerplate EntityManager code.',
  whyExists:
    'Repeated find/persist/delete patterns clutter services. Repositories centralize data access, enable testing with @DataJpaTest, and express queries declaratively — method names, annotations, or Specifications — while staying type-safe.',
  mentalModel:
    'Define interface UserRepository extends JpaRepository<User, Long>. Spring proxy implements save, findById, deleteById, plus derived findByEmailOrderByCreatedAtDesc. Custom @Query for complex fetches. Service injects interface only.',
  howItWorks: [
    {
      type: 'list',
      items: [
        'JpaRepository<T, ID>: save, saveAll, findById, findAll, delete, flush, etc.',
        'Derived queries: findByStatusAndCreatedAtAfter(Status, Instant) → WHERE parsing.',
        ' @Query JPQL or native SQL; @Param for named binds.',
        '@Modifying for UPDATE/DELETE; requires @Transactional on service or method.',
        'Pageable + Sort for pagination; returns Page<T> with total count query.',
        'Specifications / Querydsl for dynamic predicates (optional).',
      ],
    },
    {
      type: 'table',
      headers: ['Feature', 'Example'],
      rows: [
        ['Derived', 'List<Order> findByUserIdAndStatus(Long userId, Status s)'],
        ['JPQL', '@Query("SELECT u FROM User u WHERE u.email = :email")'],
        ['Native', '@Query(value = "SELECT * FROM users WHERE ...", nativeQuery=true)'],
        ['Projection', 'List<UserEmail> findByStatus(Status s) — interface/record DTO'],
        ['EntityGraph', '@EntityGraph(attributePaths="orders") Optional<User> findById(Long id)'],
      ],
    },
  ],
  architecture: {
    mermaid: `flowchart TB
  Service[Service layer] --> Repo[UserRepository interface]
  Repo --> Proxy[Spring Data proxy]
  Proxy --> EM[EntityManager]
  EM --> DB[(PostgreSQL)]`,
    caption: 'Repository abstraction over EntityManager',
  },
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Repository interface',
      code: `public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUserIdAndStatusOrderByCreatedAtDesc(
        Long userId, OrderStatus status);

    @Query("""
        SELECT o FROM Order o JOIN FETCH o.items
        WHERE o.id = :id
        """)
    Optional<Order> findWithItemsById(@Param("id") Long id);

    @Modifying
    @Query("UPDATE Order o SET o.status = :status WHERE o.id = :id")
    int updateStatus(@Param("id") Long id, @Param("status") OrderStatus status);

    Page<Order> findByStatus(OrderStatus status, Pageable pageable);

    boolean existsByUserIdAndStatus(Long userId, OrderStatus status);
}`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Interface projection — read-only DTO',
      code: `public interface OrderSummary {
    Long getId();
    Instant getCreatedAt();
    BigDecimal getTotal();
}

List<OrderSummary> findByUserId(Long userId, Pageable pageable);
// Spring generates SELECT id, created_at, total ... — no full entity`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Service usage',
      code: `@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;

    @Transactional(readOnly = true)
    public Page<OrderSummary> listForUser(Long userId, Pageable page) {
        return orderRepository.findByUserId(userId, page);
    }

    @Transactional
    public Order create(Order order) {
        return orderRepository.save(order);
    }
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'SimpleJpaRepository default implementation delegates to EntityManager.',
        'PartTreeJpaQuery parses method name into Query objects — property path limitations.',
        'save() uses EntityInformation.isNew() — id null or version null heuristics.',
        'Default transaction: read-only for find*, transactional for save/delete at repository layer (Spring Data JPA 2.x+).',
        'Auditing: extends JpaRepository + @EnableJpaAuditing for createdDate/modifiedDate.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Minimal boilerplate CRUD',
      'Type-safe derived queries for simple cases',
      'Easy @DataJpaTest slice tests',
    ],
    disadvantages: [
      'Long derived method names unreadable',
      'Derived queries hard for complex joins — use @Query',
      'Leaking entity return types to API layer temptation',
    ],
    alternatives: [
      'EntityManager directly for complex dynamic SQL',
      'JdbcClient / jOOQ for SQL-first',
      'Spring Data JDBC simpler stack',
    ],
    whenToUse: [
      'Standard Spring Boot persistence layer',
      'CRUD + moderate query complexity',
    ],
    whenNotToUse: [
      'Heavy dynamic reporting — SQL builder or native',
      'Bulk ETL — JDBC batch',
    ],
  },
  failureModes: [
    'Derived query typo in property name — startup failure (good) or wrong field.',
    '@Modifying without @Transactional — TransactionRequiredException or no effect.',
    '@Modifying clear persistence context — stale entities in same txn unless @Modifying(clearAutomatically=false).',
    'Pageable on @Query with JOIN FETCH — incorrect count or duplicate roots.',
    'Native query without sqlResultSetMapping — mapping errors for entities.',
  ],
  production: {
    performance: ['Projections for list endpoints — avoid full entity + lazy'],
    maintainability: ['@Query for anything beyond 2 predicate parts'],
  },
  interview: {
    expectations: [
      'JpaRepository capabilities',
      'Derived query naming convention',
      '@Modifying requirements',
    ],
    commonQuestions: [
      'What is Spring Data JPA repository?',
      'Derived query method naming?',
      'JPQL vs native @Query?',
    ],
    followUps: ['save vs saveAndFlush', 'Interface projection'],
    misconceptions: [
      'Repository replaces @Transactional in service always',
      'Derived queries work for any SQL complexity',
      'save always INSERT',
    ],
    traps: ['@Modifying UPDATE without WHERE — mass update accident'],
    strongSignals: [
      'Interface projection for reads',
      'JOIN FETCH on dedicated methods',
      '@Transactional on modifying service method',
    ],
  },
  keyTakeaways: [
    'JpaRepository interface → Spring-generated CRUD + queries.',
    'Derived methods parse findBy...And... property paths.',
    '@Query for JPQL/native; @Modifying needs @Transactional.',
    'Projections return DTO fields without full entity load.',
    'Keep complex fetch plans in explicit repository methods.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What does JpaRepository provide?',
      answerHint: 'CRUD: save, findById, findAll, delete, plus paging and batch variants.',
    },
    {
      level: 'intermediate',
      question: 'findByStatusAndUserIdOrderByCreatedAtDesc — how works?',
      answerHint: 'Spring Data parses method name into WHERE status AND userId ORDER BY createdAt DESC query.',
    },
    {
      level: 'advanced',
      question: '@Modifying query precautions?',
      answerHint: '@Transactional required; may clear persistence context; bypasses dirty checking and @Version unless included.',
    },
  ],
  flashcards: [
    { front: 'Derived query prefix', back: 'findBy, countBy, existsBy, deleteBy + properties' },
    { front: '@Modifying', back: 'UPDATE/DELETE JPQL; needs @Transactional' },
    { front: 'Interface projection', back: 'Closed interface getters → SELECT partial columns' },
  ],
  quickRevision: [
    'JpaRepository CRUD',
    'Derived findBy naming',
    '@Query JPQL/native',
    '@Modifying + @Transactional',
    'Pageable Page return',
    'EntityGraph fetch',
    'Projections for reads',
  ],
}

export const content = repositoriesContent
