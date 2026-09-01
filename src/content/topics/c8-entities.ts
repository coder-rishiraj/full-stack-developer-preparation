import type { TopicContent } from '@/domain/types'

export const entitiesContent: TopicContent = {
  whatIsIt:
    'A JPA entity is a Java class mapped to a relational table (or view) — annotated with @Entity, identified by @Id, managed by the persistence provider (Hibernate) within a persistence context for CRUD and lifecycle operations.',
  whyExists:
    'Manual JDBC row mapping is repetitive and error-prone. Entities bridge object-oriented domain models and SQL tables — letting repositories work with typed objects while the ORM generates SQL, tracks changes, and applies caching and lazy loading policies.',
  mentalModel:
    'Entity class ↔ table row. Field ↔ column. @Entity marks persistence; @Id is primary key. Entity instance is managed when attached to open persistence context — changes flush as UPDATE on commit. Detached instances need merge to reattach.',
  howItWorks: [
    {
      type: 'list',
      items: [
        '@Entity on class; no-arg constructor required (can be protected).',
        '@Table(name, schema, indexes) optional table mapping.',
        '@Id + @GeneratedValue(strategy, generator) for surrogate keys.',
        '@Column(nullable, unique, length, name) per field; embeddable @Embeddable types.',
        'equals/hashCode: business key or id-only when persisted; avoid collections in hashCode.',
        '@Entity listeners / @PrePersist @PreUpdate for audit timestamps.',
      ],
    },
    {
      type: 'table',
      headers: ['Annotation', 'Purpose'],
      rows: [
        ['@Entity', 'Marks JPA-managed class'],
        ['@Id', 'Primary key field'],
        ['@GeneratedValue', 'IDENTITY, SEQUENCE, TABLE, AUTO'],
        ['@Column', 'Column mapping and constraints'],
        ['@Enumerated', 'ORDINAL (avoid) or STRING for enums'],
        ['@Version', 'Optimistic lock column'],
      ],
    },
  ],
  architecture: {
    mermaid: `flowchart TB
  EntityClass[@Entity User] --> Table[users table]
  PC[Persistence Context] --> Managed[Managed entity instances]
  Repo[Repository] --> PC
  PC --> SQL[Hibernate SQL generation]`,
    caption: 'Entity class mapped to table via metadata',
  },
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Basic entity mapping',
      code: `@Entity
@Table(name = "users", indexes = @Index(columnList = "email"))
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Enumerated(EnumType.STRING)
    private UserStatus status = UserStatus.ACTIVE;

    @Version
    private Long version;

    @PrePersist
    void onCreate() {
        createdAt = Instant.now();
    }

    protected User() {} // JPA

    // getters/setters
}`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Embeddable value object',
      code: `@Embeddable
public record Address(String line1, String city, String postalCode) {}

@Entity
public class Customer {
    @Id @GeneratedValue private Long id;
    private String name;
    @Embedded
    @AttributeOverrides({
        @AttributeOverride(name = "city", column = @Column(name = "ship_city"))
    })
    private Address shippingAddress;
}`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Repository usage',
      code: `public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}

// Service
User user = new User();
user.setEmail("a@b.com");
userRepository.save(user); // INSERT when transient → managed`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Hibernate metadata model built at startup from annotations + orm.xml.',
        'Bytecode enhancement optional for lazy loading of basic fields (rare).',
        'Dynamic update (@DynamicUpdate): UPDATE only changed columns.',
        'Immutable entity: @Immutable (Hibernate) — no updates/deletes expected.',
        'Naming strategy: spring.jpa.hibernate.naming.physical-strategy → snake_case.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Type-safe domain model',
      'Declarative mapping and validation integration',
      'Lifecycle callbacks and auditing hooks',
    ],
    disadvantages: [
      'Annotation-heavy mapping for complex schemas',
      'Misconfigured fetch/cascade causes performance bugs',
      'Entity != DTO — leaking entities to API layer risky',
    ],
    alternatives: [
      'JdbcTemplate / jOOQ for SQL-centric access',
      'Spring Data JDBC lighter ORM',
      'Record + manual mapping for read-only projections',
    ],
    whenToUse: [
      'Standard CRUD domain model in Spring Boot',
      'Object graph with relationships and lifecycle',
    ],
    whenNotToUse: [
      'Bulk ETL — use COPY or batch JDBC',
      'Read-only reporting — projections/DTOs or SQL',
    ],
  },
  failureModes: [
    'Entity as API response → lazy load outside session (LazyInitializationException).',
    'Public mutable collections without defensive copy.',
    'equals/hashCode on generated id before persist (transient identity).',
    'ORDINAL enum mapping breaks on reorder.',
    'Missing @Column length on String → default 255 truncation surprise.',
  ],
  production: {
    maintainability: ['Separate entity from API DTO (MapStruct)'],
    performance: ['Avoid eager fetch all associations by default'],
  },
  interview: {
    expectations: [
      '@Entity requirements and @Id generation strategies',
      'Managed vs detached vs transient',
      'equals/hashCode guidance',
    ],
    commonQuestions: [
      'What makes a JPA entity?',
      'GenerationType IDENTITY vs SEQUENCE?',
      'Entity vs DTO?',
    ],
    followUps: ['@Embeddable use case', 'Why protected no-arg constructor'],
    misconceptions: [
      'Entity must extend class',
      'All fields persisted by default (transient unless annotated in some configs)',
      'save always INSERT',
    ],
    traps: ['Using entity in REST without fetch plan'],
    strongSignals: [
      'IDENTITY vs SEQUENCE PostgreSQL batch insert story',
      'Version column for optimistic lock',
      'DTO boundary',
    ],
  },
  keyTakeaways: [
    '@Entity maps class to table; @Id marks primary key.',
    'Managed entities tracked in persistence context; changes auto-flush.',
    'Use DTOs at API boundary; don’t expose entity graphs.',
    'IDENTITY common on PostgreSQL; SEQUENCE for batch inserts.',
    'equals/hashCode carefully; @Version for concurrent updates.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Required conditions for JPA entity?',
      answerHint: '@Entity, @Id, no-arg constructor, not final class (provider-dependent).',
    },
    {
      level: 'intermediate',
      question: 'IDENTITY vs SEQUENCE in PostgreSQL?',
      answerHint: 'IDENTITY uses serial/identity per row; SEQUENCE allows pre-allocate batch inserts with allocationSize.',
    },
    {
      level: 'advanced',
      question: 'Entity equals/hashCode best practice?',
      answerHint: 'Stable business key or id only when assigned; never include collections or lazy fields.',
    },
  ],
  flashcards: [
    { front: '@Entity requirements', back: 'No-arg ctor, @Id, not final (typical)' },
    { front: 'Transient vs managed', back: 'New object vs attached to persistence context' },
    { front: '@Version column', back: 'Optimistic locking increment on update' },
  ],
  quickRevision: [
    '@Entity + @Table mapping',
    '@Id GenerationType',
    'Managed lifecycle',
    'Embeddable value types',
    'DTO not entity at API',
    '@PrePersist audit',
    'equals/hashCode caution',
  ],
}

export const content = entitiesContent
