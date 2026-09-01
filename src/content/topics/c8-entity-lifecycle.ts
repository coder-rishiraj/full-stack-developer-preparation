import type { TopicContent } from '@/domain/types'

export const entityLifecycleContent: TopicContent = {
  whatIsIt:
    'The JPA entity lifecycle describes states — transient, managed, detached, removed — and transitions via persist, find, merge, remove, flush, clear, and transaction commit/close, determining when SQL runs and when changes are tracked.',
  whyExists:
    'Understanding lifecycle prevents lost updates, LazyInitializationException, and duplicate INSERTs. Operations mean different things depending on state — save() on transient inserts, merge() on detached copies, remove() schedules DELETE.',
  mentalModel:
    'New object → transient. persist/save in txn → managed (INSERT on flush). Context closes → detached. merge(detached) → managed copy. remove(managed) → removed (DELETE on flush). clear/detach → stops tracking.',
  howItWorks: [
    {
      type: 'list',
      items: [
        'Transient: new Entity(); not in DB, not in context.',
        'persist(entity): makes managed; INSERT at flush (PK assigned per strategy).',
        'find/load: managed from DB or cache.',
        'remove(entity): managed → removed; DELETE at flush.',
        'merge(entity): detached → new managed instance with copied state; returns managed.',
        'detach/clear/close: managed → detached or evicted.',
        'Callbacks: @PrePersist, @PostLoad, @PreUpdate, @PostRemove, etc.',
      ],
    },
  ],
  architecture: {
    mermaid: `stateDiagram-v2
  [*] --> Transient: new Entity()
  Transient --> Managed: persist/save
  Managed --> Managed: find/mutate
  Managed --> Removed: remove
  Removed --> [*]: flush DELETE
  Managed --> Detached: txn end / detach / clear
  Detached --> Managed: merge
  Managed --> [*]: commit flush`,
    caption: 'Entity state transitions in JPA',
  },
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Lifecycle in service',
      code: `@Transactional
public Order createOrder(CreateOrderCommand cmd) {
    Order order = new Order();           // transient
    order.setUser(userRepo.getReferenceById(cmd.userId()));
    orderRepository.save(order);         // persist → managed; INSERT on flush
    order.addItem(new OrderItem(...));   // cascade persist items if configured
    return order;                        // still managed until txn ends
}
// commit → flush INSERT order + items`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'merge detached update',
      code: `@Transactional
public User update(UserDto dto) {
    User detached = mapToEntity(dto);    // detached
    User managed = userRepository.save(detached); // merge in Spring Data
    return managed;                      // use managed instance
}`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Lifecycle callbacks',
      code: `@Entity
public class AuditEntity {
    @PrePersist
    void onCreate() { createdAt = Instant.now(); }

    @PreUpdate
    void onUpdate() { updatedAt = Instant.now(); }

    @PostLoad
    void afterLoad() { /* decrypt field, derived init */ }
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Spring Data save(): INSERT if id null/unassigned, else merge (SELECT + UPDATE or INSERT).',
        'getReferenceById(): lazy proxy managed without SELECT until access.',
        'CascadeType.PERSIST propagates persist to associated transient children.',
        'orphanRemoval on collection remove → child becomes removed state.',
        'EntityListeners and auditing (JpaAuditingEntityListener) hook lifecycle events.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Clear rules for when SQL executes',
      'Callbacks centralize audit and validation',
      'Cascade simplifies aggregate persistence',
    ],
    disadvantages: [
      'merge easy to misuse — extra SELECT',
      'Detached state confusing for beginners',
      'remove vs deleteById semantics differ slightly',
    ],
    alternatives: [
      'Explicit insert/update JDBC for clarity in batch',
      'Spring Data JDBC simpler stateless model',
    ],
    whenToUse: [
      'Standard CRUD with @Transactional services',
      'Aggregate root cascade persist/remove',
    ],
    whenNotToUse: [
      'Passing entities across layer boundaries without DTO',
      'Long conversation with detached entities without merge strategy',
    ],
  },
  failureModes: [
    'persist() on entity with assigned id expecting INSERT — may merge instead via save().',
    'Modify detached without merge — silent data loss.',
    'remove() without managed entity — IllegalArgumentException or no-op.',
    'Cascade persist to detached parent with transient child — FK errors.',
    'Return transient entity from @Transactional — detached immediately, lazy fails.',
  ],
  production: {
    maintainability: ['Document save vs saveAndFlush for id generation timing'],
    reliability: ['Use @Version on entities subject to concurrent merge'],
  },
  interview: {
    expectations: [
      'Four lifecycle states and transitions',
      'persist vs merge vs save',
      'When INSERT vs UPDATE happens',
    ],
    commonQuestions: [
      'Entity lifecycle states in JPA?',
      'Difference persist and merge?',
      'What happens on transaction commit?',
    ],
    followUps: ['getReferenceById vs findById', 'Cascade PERSIST behavior'],
    misconceptions: [
      'save always INSERT',
      'Detached entity auto reattaches on field change',
      'remove deletes immediately from DB without flush',
    ],
    traps: ['Using detached entity from REST body directly without merge'],
    strongSignals: [
      'merge return value',
      'flush timing for IDENTITY keys',
      'Callback use for audit',
    ],
  },
  keyTakeaways: [
    'States: transient, managed, detached, removed.',
    'persist/save inserts transient; merge reattaches detached.',
    'Changes tracked only when managed; flush on commit.',
    'remove schedules DELETE; cascade/orphanRemoval affect children.',
    'Use lifecycle callbacks for audit fields.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'JPA entity lifecycle states?',
      answerHint: 'Transient, managed, detached, removed.',
    },
    {
      level: 'intermediate',
      question: 'persist vs merge?',
      answerHint: 'persist new entity in context INSERT; merge copies detached state to managed instance.',
    },
    {
      level: 'advanced',
      question: 'Spring save() on entity with id?',
      answerHint: 'Typically merge — may SELECT existing; UPDATE on flush if found else INSERT depending on state.',
    },
  ],
  flashcards: [
    { front: 'Transient', back: 'New object; not in DB or context' },
    { front: 'merge', back: 'Detached → managed copy; returns managed' },
    { front: 'remove', back: 'Managed → removed; DELETE on flush' },
  ],
  quickRevision: [
    'Transient/managed/detached/removed',
    'persist INSERT on flush',
    'merge for detached',
    'remove → DELETE flush',
    'Callbacks @PrePersist',
    'save() Spring semantics',
    'Txn end → detached',
  ],
}

export const content = entityLifecycleContent
