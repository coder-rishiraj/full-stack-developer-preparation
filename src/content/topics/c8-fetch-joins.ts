import type { TopicContent } from '@/domain/types'

export const fetchJoinsContent: TopicContent = {
  whatIsIt:
    'Fetch joins (JOIN FETCH in JPQL or fetch attribute in Criteria API) eagerly load associated entities or collections in the same query as the root entity — initializing lazy associations without separate SELECTs and solving N+1 when used deliberately.',
  whyExists:
    'Lazy loading causes N+1; blind EAGER causes over-fetch always. Fetch join is opt-in per query: load exactly the graph slice needed for this use case in one (or few) SQL JOINs with explicit control.',
  mentalModel:
    'SELECT u FROM User u JOIN FETCH u.orders — Hibernate generates SQL JOIN orders, hydrates users and orders in one round-trip. DISTINCT dedupes users when collection join multiplies rows. Cannot fetch two bag collections in one query easily.',
  howItWorks: [
    {
      type: 'list',
      items: [
        'JPQL: JOIN FETCH alias.association — inner or left join fetch.',
        'Path expressions: JOIN FETCH u.orders o JOIN FETCH o.product',
        'Spring @EntityGraph(attributePaths={"orders", "orders.product"}) equivalent declarative.',
        'Hibernate query hint: @QueryHints @QueryHint(name=HibernateHints.H_FETCH_SIZE, value="50")',
        'Fetch join overrides LAZY for that query only.',
        'SELECT DISTINCT required when fetching collections to unique root entities.',
      ],
    },
  ],
  architecture: {
    mermaid: `flowchart LR
  JPQL[JOIN FETCH u.orders] --> SQL[SQL JOIN users orders]
  SQL --> PC[Single ResultSet]
  PC --> Hydrate[Hydrate User + Order graph]`,
    caption: 'One SQL join initializes lazy associations for query scope',
  },
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'JOIN FETCH in repository',
      code: `public interface OrderRepository extends JpaRepository<Order, Long> {

    @Query("""
        SELECT DISTINCT o FROM Order o
        JOIN FETCH o.user
        JOIN FETCH o.items i
        JOIN FETCH i.product
        WHERE o.id = :id
        """)
    Optional<Order> findDetailedById(@Param("id") Long id);

    @EntityGraph(attributePaths = {"user", "items", "items.product"})
    Optional<Order> findWithDetailsById(Long id);
}`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'LEFT JOIN FETCH for optional association',
      code: `@Query("""
    SELECT DISTINCT p FROM Post p
    LEFT JOIN FETCH p.comments
    WHERE p.published = true
    """)
List<Post> findPublishedWithComments();`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Criteria API fetch join',
      code: `CriteriaBuilder cb = em.getCriteriaBuilder();
CriteriaQuery<Order> cq = cb.createQuery(Order.class);
Root<Order> root = cq.from(Order.class);
root.fetch("items", JoinType.LEFT);
root.fetch("user", JoinType.INNER);
cq.select(root).distinct(true).where(cb.equal(root.get("id"), orderId));
Order order = em.createQuery(cq).getSingleResult();`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Generated SQL may use inner join for required associations; left for optional.',
        'Collection fetch join multiplies SQL rows — Hibernate dedupes in memory with DISTINCT.',
        'Pageable + fetch join: Spring Data may warn; use @Query without count or separate id query.',
        'MultipleBagFetchException: two List fetch joins — fetch sequentially or @BatchSize.',
        'Fetch join on paginated query without DISTINCT count breaks total elements accuracy.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Eliminates N+1 for fetched paths',
      'Per-query control vs global EAGER',
      'Single round-trip for known graph',
    ],
    disadvantages: [
      'Over-fetch if wide join graph',
      'Cartesian risk with multiple collections',
      'Pagination complexity',
    ],
    alternatives: [
      '@BatchSize lazy batching',
      'DTO constructor projection',
      'Multiple queries: ids then WHERE IN fetch',
    ],
    whenToUse: [
      'Service method needs entity graph for mapping',
      'Known association depth per endpoint',
    ],
    whenNotToUse: [
      'Two List collections same query',
      'Page through users with all orders join fetched',
      'Only need aggregate COUNT — use GROUP BY DTO',
    ],
  },
  failureModes: [
    'Forgot DISTINCT → duplicate User instances in list.',
    'JOIN FETCH items + payments → MultipleBagFetchException.',
    'Pageable on fetch join returns wrong page size in memory.',
    'Fetch join in default findAll used everywhere → huge joins always.',
    'Inner join fetch hides parents without children unintentionally.',
  ],
  production: {
    performance: ['Dedicated repository methods per fetch shape — not global findAll fetch'],
    observability: ['Log SQL length and row counts for fetch join endpoints'],
  },
  interview: {
    expectations: [
      'JOIN FETCH syntax and SQL effect',
      'DISTINCT necessity',
      'EntityGraph equivalent',
    ],
    commonQuestions: [
      'What is JOIN FETCH?',
      'Why DISTINCT with collection fetch?',
      'Fetch join vs EAGER mapping?',
    ],
    followUps: ['MultipleBagFetchException', 'Pagination strategies'],
    misconceptions: [
      'Fetch join always one SQL (may be multiple for some graphs)',
      'Can fetch unlimited collections in one query',
      'EntityGraph and JOIN FETCH unrelated',
    ],
    traps: ['Pageable + JOIN FETCH collection without two-query pattern'],
    strongSignals: [
      'LEFT vs INNER fetch join semantics',
      'Separate methods per use case',
      'DTO when graph large',
    ],
  },
  keyTakeaways: [
    'JOIN FETCH loads associations in same query — fixes N+1 for that path.',
    'Use DISTINCT with collection fetch joins.',
    'Cannot easily dual-fetch two List collections — batch or two queries.',
    '@EntityGraph declarative alternative to JPQL JOIN FETCH.',
    'Fetch join per use case — not on generic findAll.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Purpose of JOIN FETCH?',
      answerHint: 'Eagerly load lazy association in same query; avoid N+1.',
    },
    {
      level: 'intermediate',
      question: 'Why SELECT DISTINCT with JOIN FETCH collection?',
      answerHint: 'Join multiplies rows; DISTINCT dedupes root entities in result list.',
    },
    {
      level: 'advanced',
      question: 'Paginate users with orders fetch join?',
      answerHint: 'Two-step: page user ids first, then fetch join WHERE id IN (:ids); or avoid collection fetch on paged query.',
    },
  ],
  flashcards: [
    { front: 'JOIN FETCH', back: 'JPQL eager load association in one query' },
    { front: 'DISTINCT with fetch join', back: 'Dedupe root entities when collection joins multiply rows' },
    { front: 'MultipleBagFetchException', back: 'Cannot JOIN FETCH two List collections at once' },
  ],
  quickRevision: [
    'JOIN FETCH in JPQL',
    'Overrides LAZY per query',
    'DISTINCT for collections',
    '@EntityGraph equivalent',
    'No dual List fetch',
    'Pagination two-step',
    'LEFT vs INNER fetch',
  ],
}

export const content = fetchJoinsContent
