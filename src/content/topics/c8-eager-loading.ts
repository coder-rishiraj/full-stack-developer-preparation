import type { TopicContent } from '@/domain/types'

export const eagerLoadingContent: TopicContent = {
  whatIsIt:
    'Eager loading (FetchType.EAGER) loads an association immediately whenever the owning entity is loaded — via JOIN in same query or follow-up SELECT — so the associated data is available without further lazy triggers.',
  whyExists:
    'Some associations are always required together (Order always needs User reference for display). Eager fetch guarantees data present — but misapplied EAGER on collections causes Cartesian product joins and performance disasters at scale.',
  mentalModel:
    'Load Order → Hibernate also loads User in same or immediate additional query. EAGER on List → often SELECT or JOIN fetching all children every time Order loads — rarely what you want. Prefer LAZY + explicit fetch for controlled loading.',
  howItWorks: [
    {
      type: 'list',
      items: [
        'JPA default: @ManyToOne EAGER, @OneToMany LAZY — override ManyToOne to LAZY in practice.',
        'EAGER @ManyToOne: typically secondary SELECT or join depending on fetch plan.',
        'EAGER @OneToMany: join fetch can multiply parent rows (Cartesian) or separate SELECT IN.',
        'Multiple EAGER collections → MultipleBagFetchException with join fetch (Hibernate).',
        'FetchMode.SUBSELECT / BATCH on Hibernate @OneToMany alters eager batch behavior.',
      ],
    },
  ],
  architecture: {
    mermaid: `flowchart TB
  LoadOrder[Load Order EAGER items+user] --> Strategy{Fetch strategy}
  Strategy --> Join[JOIN all — row multiplication]
  Strategy --> SelectN[Multiple SELECT IN]
  Join --> Risk[Cartesian explosion risk]`,
    caption: 'EAGER may JOIN or issue extra SELECTs automatically',
  },
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'EAGER ManyToOne — usually acceptable for single ref',
      code: `@Entity
public class Order {
    @ManyToOne(fetch = FetchType.EAGER) // JPA default — prefer LAZY
    @JoinColumn(name = "user_id")
    private User user;
}

// Loading order always pulls user row too
Order order = orderRepo.findById(1L).orElseThrow();
// user already initialized`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'EAGER OneToMany — problematic default anti-pattern',
      code: `@Entity
public class User {
    @OneToMany(mappedBy = "user", fetch = FetchType.EAGER)
    private List<Order> orders = new ArrayList<>();
}

// Every findById(user) loads ALL orders — heavy
// Worse: JSON serialization loads entire graph`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Better: LAZY + explicit fetch per use case',
      code: `@Entity
public class User {
    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<Order> orders = new ArrayList<>();
}

@Query("SELECT u FROM User u JOIN FETCH u.orders WHERE u.id = :id")
Optional<User> findWithOrders(@Param("id") Long id);`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Hibernate @Fetch(FetchMode.JOIN) forces join for EAGER — watch duplicate parent rows.',
        'Cartesian product: Order EAGER items + EAGER payments → duplicated data in ResultSet.',
        'Pagination with EAGER join fetch breaks LIMIT semantics (fetch join in memory).',
        'Query hint or fetch graph overrides EAGER to lazy for specific query (Hibernate).',
        'Spring Boot best practice: spring.jpa.open-in-view=false + no global EAGER collections.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'No LazyInitializationException for that association',
      'Simple mental model when association always needed',
    ],
    disadvantages: [
      'Over-fetch when association unused',
      'Cartesian products with multiple EAGER collections',
      'Harder to optimize per endpoint',
    ],
    alternatives: [
      'LAZY default + JOIN FETCH / EntityGraph per query',
      'DTO projection with explicit JOIN in JPQL',
      '@BatchSize for batched lazy loading',
    ],
    whenToUse: [
      'Small always-needed @ManyToOne (still prefer explicit fetch)',
      'Temporary prototype — migrate to lazy + fetch',
    ],
    whenNotToUse: [
      'EAGER on large collections',
      'Multiple EAGER bags on same entity',
      'Global EAGER to “fix” lazy exceptions',
    ],
  },
  failureModes: [
    'User.orders EAGER → every user load pulls thousands of orders.',
    'Multiple EAGER collections → MultipleBagFetchException or huge joins.',
    'EAGER + Pageable → wrong count and page contents.',
    'JSON serialization eagerly loads entire database subgraph.',
    'Switching EAGER to LAZY breaks code relying on silent load — need fetch plan.',
  ],
  production: {
    performance: ['Audit entities for FetchType.EAGER; set LAZY on associations'],
    observability: ['Log SQL count per API endpoint after removing OSIV'],
  },
  interview: {
    expectations: [
      'JPA fetch defaults',
      'Why EAGER OneToMany is dangerous',
      'EAGER vs explicit JOIN FETCH',
    ],
    commonQuestions: [
      'Difference LAZY vs EAGER?',
      'Why not EAGER everywhere?',
      'Cartesian product with eager joins?',
    ],
    followUps: ['MultipleBagFetchException', 'EntityGraph override'],
    misconceptions: [
      'EAGER is faster because one query always',
      'EAGER eliminates N+1 always',
      'ManyToOne should stay EAGER always',
    ],
    traps: ['Recommend EAGER to fix LazyInitializationException globally'],
    strongSignals: [
      'LAZY + fetch join per use case',
      'Cartesian product awareness',
      'DTO not entity to JSON',
    ],
  },
  keyTakeaways: [
    'EAGER loads association with parent — no lazy trigger needed.',
    'JPA defaults ManyToOne EAGER — override to LAZY; keep collections LAZY.',
    'EAGER collections often over-fetch and cause join explosion.',
    'Explicit JOIN FETCH gives control EAGER lacks.',
    'Never use EAGER to paper over session boundary bugs.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'LAZY vs EAGER fetch?',
      answerHint: 'LAZY on access; EAGER with parent load — immediate extra data.',
    },
    {
      level: 'intermediate',
      question: 'Why avoid EAGER OneToMany?',
      answerHint: 'Loads entire collection every parent load; join multiplication; memory and N+1 variants.',
    },
    {
      level: 'advanced',
      question: 'MultipleBagFetchException cause?',
      answerHint: 'Hibernate cannot JOIN FETCH two List collections simultaneously — use batch, subselect, or two queries.',
    },
  ],
  flashcards: [
    { front: 'JPA @ManyToOne default fetch', back: 'EAGER — override to LAZY in Spring apps' },
    { front: 'EAGER collection risk', back: 'Loads all children every parent load' },
    { front: 'Cartesian product', back: 'JOIN two collections multiplies rows' },
  ],
  quickRevision: [
    'EAGER = load with parent',
    'ManyToOne default EAGER',
    'Avoid EAGER collections',
    'Cartesian join risk',
    'Use JOIN FETCH instead',
    'EntityGraph per query',
    'DTO at API boundary',
  ],
}

export const content = eagerLoadingContent
