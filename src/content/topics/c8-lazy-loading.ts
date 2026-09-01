import type { TopicContent } from '@/domain/types'

export const lazyLoadingContent: TopicContent = {
  whatIsIt:
    'Lazy loading (FetchType.LAZY) defers loading of an entity association until the field is accessed — Hibernate proxies the reference or leaves collections uninitialized until iterated, avoiding unnecessary JOINs or extra SELECTs in the initial query.',
  whyExists:
    'Eagerly loading entire object graphs wastes memory and I/O when most use cases need only the root entity. Lazy loading loads associations on demand within an open persistence context (session).',
  mentalModel:
    'Load User → only users row. Access user.getOrders() → Hibernate fires SELECT orders WHERE user_id=?. If session closed before access → LazyInitializationException. Proxy object stands in for unloaded @ManyToOne until accessed.',
  howItWorks: [
    {
      type: 'list',
      items: [
        'Default: @OneToMany, @ManyToMany LAZY; @ManyToOne EAGER in JPA spec — set LAZY explicitly in Spring Boot apps.',
        'Lazy proxy: subclass or bytebuddy proxy implements association getter trigger load.',
        'PersistentCollection wrapper for lists — size()/get() triggers load.',
        'Lazy load requires active EntityManager session (Open Session In View extends this to HTTP request).',
        'Hibernate.enableFetchProfile or @EntityGraph for eager load when needed per query.',
      ],
    },
  ],
  architecture: {
    mermaid: `flowchart TB
  Load[findById User] --> SQL1[SELECT user]
  Access[user.getOrders()] --> Check{Session open?}
  Check -->|yes| SQL2[SELECT orders WHERE user_id]
  Check -->|no| LIE[LazyInitializationException]`,
    caption: 'Association load triggered on first access with open session',
  },
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Lazy association default pattern',
      code: `@Entity
public class User {
    @Id @GeneratedValue private Long id;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<Order> orders = new ArrayList<>();
}

// Service — must access inside @Transactional
@Transactional(readOnly = true)
public List<OrderDto> getOrders(Long userId) {
    User user = userRepo.findById(userId).orElseThrow();
    return user.getOrders().stream()  // triggers lazy SELECT here
        .map(OrderDto::from)
        .toList();
}`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'LazyInitializationException outside transaction',
      code: `@Transactional(readOnly = true)
public User loadUser(Long id) {
    return userRepo.findById(id).orElseThrow();
}

// Controller — NO session
User u = service.loadUser(1L);
u.getOrders().size(); // LazyInitializationException`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Explicit fetch when needed — avoid N+1',
      code: `@Query("SELECT u FROM User u JOIN FETCH u.orders WHERE u.id = :id")
Optional<User> findWithOrders(@Param("id") Long id);

// Or @EntityGraph(attributePaths = "orders")
@EntityGraph(attributePaths = {"orders"})
Optional<User> findById(Long id);`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Bytecode enhancement enables lazy loading of @Basic fields with @Basic(fetch=LAZY) — uncommon.',
        'Hibernate.isInitialized(orders) checks collection state.',
        'Batch fetching (@BatchSize on entity) batches lazy loads: IN (?,?,?) instead of N queries.',
        'Subselect fetch: one query for all collections of type in session — rare tuning.',
        'OSIV (spring.jpa.open-in-view=true default) keeps session through view render — masks LIE, hides N+1.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Minimal initial query cost',
      'Load only what use case needs',
      'Default for collections prevents accidental huge joins',
    ],
    disadvantages: [
      'LazyInitializationException if session boundary wrong',
      'N+1 if lazy accessed in loop without batch/fetch join',
      'OSIV hides problems until production load',
    ],
    alternatives: [
      'JOIN FETCH / EntityGraph per use case',
      'DTO projection query — no entity graph',
      'Eager fetch for tiny always-needed associations only',
    ],
    whenToUse: [
      'Default for all collections and most associations',
      'Service layer @Transactional loads what DTO needs',
    ],
    whenNotToUse: [
      'Access association after transaction closed without DTO copy',
      'Known always-needed association in hot path without fetch plan',
    ],
  },
  failureModes: [
    'LazyInitializationException in controller with OSIV disabled.',
    'N+1: 100 users each triggers orders SELECT.',
    'Serializing entity to JSON triggers lazy load of entire graph.',
    'Calling lazy getter in equals/hashCode → unexpected query or exception.',
    'OSIV masks N+1 — database melts under load.',
  ],
  production: {
    performance: [
      'Disable OSIV; fetch explicitly in service',
      '@BatchSize(size=25) on collections',
    ],
    observability: ['Hibernate statistics or datasource-proxy count queries per request'],
  },
  interview: {
    expectations: [
      'When lazy load fires',
      'LazyInitializationException cause and fixes',
      'N+1 relation to lazy loading',
    ],
    commonQuestions: [
      'What is lazy loading in Hibernate?',
      'LazyInitializationException — why?',
      'Open Session In View pros/cons?',
    ],
    followUps: ['JOIN FETCH vs @EntityGraph', '@BatchSize'],
    misconceptions: [
      'Lazy means never loaded',
      'EAGER prevents all N+1',
      'OSIV is best practice always',
    ],
    traps: ['Returning entity from service to REST without fetch plan'],
    strongSignals: [
      'Fetch join in same transaction as access',
      'DTO boundary',
      'Disable OSIV recommendation for prod',
    ],
  },
  keyTakeaways: [
    'LAZY loads association on first access inside open session.',
    'Collections default LAZY — good; set @ManyToOne LAZY too.',
    'LazyInitializationException = access outside persistence context.',
    'N+1 from repeated lazy loads — fetch join or batch size.',
    'Prefer explicit fetch in service over OSIV band-aid.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'When does Hibernate load LAZY association?',
      answerHint: 'First access to getter/collection inside active persistence context.',
    },
    {
      level: 'intermediate',
      question: 'Fix LazyInitializationException?',
      answerHint: 'Access inside @Transactional; JOIN FETCH; DTO copy in txn; or OSIV (discouraged long-term).',
    },
    {
      level: 'advanced',
      question: 'Open Session In View tradeoff?',
      answerHint: 'Extends session through web layer — avoids LIE but encourages N+1 and long transactions.',
    },
  ],
  flashcards: [
    { front: 'Lazy load trigger', back: 'First getter/collection access with open EM' },
    { front: 'LazyInitializationException', back: 'Lazy access after session closed' },
    { front: 'Default fetch collections', back: 'LAZY in JPA' },
  ],
  quickRevision: [
    'LAZY on demand load',
    'Needs open session',
    'LIE outside txn',
    'N+1 in loops',
    'JOIN FETCH fix',
    '@BatchSize batches lazy',
    'Disable OSIV prod',
  ],
}

export const content = lazyLoadingContent
