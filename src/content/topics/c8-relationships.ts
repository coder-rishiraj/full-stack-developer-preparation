import type { TopicContent } from '@/domain/types'

export const relationshipsContent: TopicContent = {
  whatIsIt:
    'JPA relationship mappings (@OneToOne, @OneToMany, @ManyToOne, @ManyToMany) model associations between entities using foreign keys and join tables — with ownership (mappedBy), cascade, fetch type, and orphanRemoval controlling persistence behavior.',
  whyExists:
    'Domain models are graphs: Order has User, OrderItems. Relationships express FK integrity in Java types instead of manual JOIN SQL — enabling navigation, cascade persist, and typed queries while the ORM manages join columns and collection tables.',
  mentalModel:
    'Many-to-one = FK on child side (owning side). One-to-many inverse uses mappedBy pointing to child FK field. Many-to-many uses join table unless replaced by two one-to-manys. Owning side has @JoinColumn; inverse side mappedBy.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Mapping', 'FK location', 'Notes'],
      rows: [
        ['@ManyToOne', 'Child table', 'Most common; owning side'],
        ['@OneToMany mappedBy', 'Child table (inverse)', 'Collection on parent; lazy default'],
        ['@OneToOne', 'Either side @JoinColumn', 'Choose owning side explicitly'],
        ['@ManyToMany', 'Join table', 'Prefer two @ManyToOne + entity over pure M:N'],
      ],
    },
    {
      type: 'list',
      items: [
        'mappedBy on inverse — no duplicate FK column mapping.',
        'CascadeType: PERSIST, MERGE, REMOVE, ALL — child lifecycle tied to parent.',
        'orphanRemoval=true: remove child from collection → DELETE child row.',
        'FetchType LAZY default on collections; EAGER on @ManyToOne (JPA spec — override to LAZY).',
        '@JoinColumn(name, nullable, foreignKey) controls FK column and constraints.',
      ],
    },
  ],
  architecture: {
    mermaid: `erDiagram
  USER ||--o{ ORDER : "OneToMany/ManyToOne"
  ORDER ||--|{ ORDER_ITEM : contains
  ORDER_ITEM }o--|| PRODUCT : ManyToOne
  USER {
    Long id
  }
  ORDER {
    Long id
    Long user_id FK
  }`,
    caption: 'Bidirectional associations with FK on many side',
  },
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Bidirectional OneToMany / ManyToOne',
      code: `@Entity
public class Order {
    @Id @GeneratedValue private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();

    public void addItem(OrderItem item) {
        items.add(item);
        item.setOrder(this);
    }
}

@Entity
public class OrderItem {
    @Id @GeneratedValue private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "order_id")
    private Order order;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;
}`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Many-to-many (prefer link entity in production)',
      code: `@Entity
public class Student {
    @ManyToMany
    @JoinTable(name = "student_course",
        joinColumns = @JoinColumn(name = "student_id"),
        inverseJoinColumns = @JoinColumn(name = "course_id"))
    private Set<Course> courses = new HashSet<>();
}

// Better for extra columns (enrolled_at, grade):
@Entity
public class Enrollment {
    @EmbeddedId private EnrollmentId id;
    @ManyToOne @MapsId("studentId") private Student student;
    @ManyToOne @MapsId("courseId") private Course course;
    private Instant enrolledAt;
}`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Unidirectional ManyToOne (common, simple)',
      code: `@Entity
public class Comment {
    @Id @GeneratedValue private Long id;
    private String body;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id")
    private Post post;
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Hibernate collection wrappers (PersistentBag/List) track add/remove for dirty checking.',
        'Bidirectional sync: set both sides or helper method — FK column follows owning side.',
        'Join fetch in query overrides LAZY for that association in one query.',
        'FK constraint created by schema export or Flyway; JPA metadata must match DB.',
        '@OrderColumn deprecated pattern — use @OrderBy or explicit order field.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Navigate object graph in code',
      'Cascade persist simplifies aggregate creation',
      'Type-safe associations in JPQL',
    ],
    disadvantages: [
      'Bidirectional sync bugs if both sides not updated',
      'EAGER or wrong fetch → N+1 or huge joins',
      'Cascade REMOVE dangerous on shared entities',
    ],
    alternatives: [
      'Unidirectional @ManyToOne only — query parent from child id',
      'DTO assembly without loading full graph',
      'ID reference instead of entity association for loose coupling',
    ],
    whenToUse: [
      'True aggregate (Order + items) with cascade ALL + orphanRemoval',
      'Lazy @ManyToOne from child to parent',
    ],
    whenNotToUse: [
      'EAGER on collections by default',
      'Cascade ALL on @ManyToOne to shared User',
      'ManyToMany when link entity needed',
    ],
  },
  failureModes: [
    'Only set parent.items.add without item.setOrder — FK null on flush.',
    'Cascade REMOVE on User → deletes all orders unintentionally.',
    'EAGER OneToMany on User.orders → loads all orders always.',
    'HashSet with mutable entities without stable equals/hashCode.',
    'orphanRemoval on @ManyToMany invalid — only OneToOne/OneToMany.',
  ],
  production: {
    performance: ['Default LAZY; explicit fetch join in use case queries'],
    maintainability: ['Prefer unidirectional or single owning side'],
  },
  interview: {
    expectations: [
      'Owning vs inverse side; mappedBy',
      'Cascade and orphanRemoval semantics',
      'ManyToOne LAZY recommendation',
    ],
    commonQuestions: [
      'Difference OneToMany and ManyToOne?',
      'What is mappedBy?',
      'CascadeType.REMOVE risk?',
    ],
    followUps: ['ManyToMany join table vs entity', 'N+1 on collections'],
    misconceptions: [
      'Bidirectional required always',
      'Cascade persists shared references safely',
      'Fetch EAGER fixes N+1 cheaply',
    ],
    traps: ['orphanRemoval=true with shared child entities'],
    strongSignals: [
      'Helper method syncs both sides',
      'Link entity for M:N with attributes',
      'LAZY ManyToOne explicit',
    ],
  },
  keyTakeaways: [
    'FK on @ManyToOne owning side; @OneToMany mappedBy inverse.',
    'Cascade/orphanRemoval only within aggregate boundaries.',
    'Default LAZY collections; avoid EAGER except deliberate.',
    'Sync bidirectional associations in one place.',
    'Replace @ManyToMany with link entity when relationship has data.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Which side owns @OneToMany / @ManyToOne?',
      answerHint: '@ManyToOne owning side has FK; @OneToMany mappedBy references it.',
    },
    {
      level: 'intermediate',
      question: 'orphanRemoval vs CascadeType.REMOVE?',
      answerHint: 'orphanRemoval deletes child removed from collection; REMOVE deletes children when parent deleted.',
    },
    {
      level: 'advanced',
      question: 'Why avoid @ManyToMany in production?',
      answerHint: 'No place for relationship attributes; harder queries; link entity models enrollment/metadata cleanly.',
    },
  ],
  flashcards: [
    { front: 'mappedBy', back: 'Inverse side — FK on other entity' },
    { front: 'orphanRemoval', back: 'Delete child when removed from parent collection' },
    { front: 'Owning side', back: '@ManyToOne / @JoinColumn side controls FK' },
  ],
  quickRevision: [
    'ManyToOne = FK owner',
    'OneToMany mappedBy inverse',
    'LAZY collections default',
    'Cascade within aggregate only',
    'Sync bidirectional in helper',
    'Link entity > ManyToMany',
    'orphanRemoval OneToMany only',
  ],
}

export const content = relationshipsContent
