import type { TopicContent } from '@/domain/types'

export const persistenceContextContent: TopicContent = {
  whatIsIt:
    'The persistence context (JPA EntityManager session) is a first-level cache and identity map of managed entities within a transaction — tracking entity state, ensuring one Java instance per DB row, and queuing INSERT/UPDATE/DELETE on flush.',
  whyExists:
    'Without a context, repeated findById(1) could return different object instances and duplicate work. The persistence context guarantees consistent in-memory view, automatic dirty checking, and write-behind SQL batching until flush/commit.',
  mentalModel:
    'EntityManager holds Map<Id, Entity>. find(id) hits cache first. Changes to managed entity mark dirty — flush syncs to DB. clear() evicts all. detach() removes one entity from management. One persistence context per transaction typically in Spring.',
  howItWorks: [
    {
      type: 'list',
      items: [
        'Managed: associated with open persistence context; changes tracked.',
        'Detached: was managed, context closed — changes not auto persisted.',
        'Transient: new object, never persisted — save() makes managed.',
        'Removed: scheduled DELETE on flush after remove() call.',
        'flush(): synchronizes persistence context to database without commit.',
        'clear(): detaches all entities — use after bulk processing to limit memory.',
      ],
    },
    {
      type: 'table',
      headers: ['State', 'In context?', 'Persist on commit?'],
      rows: [
        ['Transient', 'No', 'Need persist/save'],
        ['Managed', 'Yes', 'Auto flush changes'],
        ['Detached', 'No', 'Need merge'],
        ['Removed', 'Yes until flush', 'DELETE issued'],
      ],
    },
  ],
  architecture: {
    mermaid: `flowchart TB
  EM[EntityManager / Session] --> PC[Persistence Context]
  PC --> Identity[Identity map id to entity]
  PC --> Dirty[Dirty checking snapshot]
  PC --> Queue[Action queue INSERT UPDATE DELETE]
  Txn[@Transactional] --> EM
  Commit[commit] --> Flush[flush SQL] --> DB[(Database)]`,
    caption: 'One persistence context scoped to transaction',
  },
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Identity map — same instance',
      code: `@Transactional
public void demo() {
    User u1 = em.find(User.class, 1L);
    User u2 = em.find(User.class, 1L);
    assert u1 == u2; // same managed instance

    u1.setEmail("new@email.com");
    // u2 sees change — same object; flush UPDATE on commit
}`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Transient, merge detached',
      code: `@Transactional
public User updateEmail(User detached) {
    // detached from previous session
    return em.merge(detached); // copies state to managed instance
}

// Spring Data save on detached entity also merges`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'clear() after batch processing',
      code: `@Transactional
public void processBatch(List<Long> ids) {
    for (Long id : ids) {
        Order o = em.find(Order.class, id);
        o.setStatus(Status.PROCESSED);
        if (++count % 50 == 0) {
            em.flush();
            em.clear(); // prevent persistence context growth
        }
    }
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'First-level cache: persistence context only — not shared across transactions.',
        'Second-level cache (Hibernate): optional shared session factory cache — entity regions.',
        'Auto flush before query execution by default (FlushMode.AUTO) — ensures query sees pending changes.',
        'FlushMode.COMMIT delays flush until commit — stale query risk within txn.',
        'Spring @PersistenceContext EntityManager proxy delegates to txn-scoped real EM.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Identity map consistency',
      'Automatic dirty checking — no manual UPDATE',
      'Write-behind batching opportunity',
    ],
    disadvantages: [
      'Memory grows if loading many entities without clear()',
      'Stale read if long transaction holds old snapshot',
      'Confusing without lifecycle state knowledge',
    ],
    alternatives: [
      'StatelessSession for bulk ETL (Hibernate)',
      'JdbcTemplate bypassing context',
      'Read-only @Transactional avoids flush overhead',
    ],
    whenToUse: [
      'Default Spring @Transactional service methods',
      'Unit of work pattern per business transaction',
    ],
    whenNotToUse: [
      'Long-running batch without periodic clear/flush',
      'Cross-request entity caching in singleton (detached stale data)',
    ],
  },
  failureModes: [
    'Entity passed between threads — not thread safe.',
    'Long @Transactional loading huge dataset — OOM in persistence context.',
    'merge() without using returned managed instance — changes lost on detached copy.',
    'clear() then access lazy collection — LazyInitializationException.',
    'Assuming find() always hits DB — cache returns without SELECT.',
  ],
  production: {
    performance: ['@Transactional(readOnly=true) for queries; periodic em.clear() in bulk'],
    reliability: ['Keep transactions short — small persistence context scope'],
  },
  interview: {
    expectations: [
      'Managed vs detached vs transient',
      'Identity map behavior',
      'flush vs commit',
    ],
    commonQuestions: [
      'What is persistence context?',
      'Why u1 == u2 after two finds?',
      'Difference flush and commit?',
    ],
    followUps: ['First vs second level cache', 'merge semantics'],
    misconceptions: [
      'EntityManager is application singleton with shared entities',
      'find always queries database',
      'Detached entity auto saves on field change',
    ],
    traps: ['Modify detached entity without merge'],
    strongSignals: [
      'Transaction-scoped context in Spring',
      'clear/flush batch pattern',
      'merge return value used',
    ],
  },
  keyTakeaways: [
    'Persistence context = first-level cache + dirty checking per transaction.',
    'One managed instance per PK within context.',
    'Transient needs save; detached needs merge; managed auto-flushes.',
    'flush() writes SQL; commit() ends transaction.',
    'clear() evicts all — use in long batch jobs.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What does persistence context store?',
      answerHint: 'Managed entities identity map; tracks changes for flush; action queue.',
    },
    {
      level: 'intermediate',
      question: 'Managed vs detached entity?',
      answerHint: 'Managed tracked by open EM; detached not — changes not auto persisted until merge.',
    },
    {
      level: 'advanced',
      question: 'When call EntityManager.clear()?',
      answerHint: 'Long batch processing to evict entities from memory; after flush of processed batch.',
    },
  ],
  flashcards: [
    { front: 'Identity map', back: 'Same id → same Java instance in context' },
    { front: 'flush vs commit', back: 'flush syncs SQL; commit ends txn + flush if needed' },
    { front: 'merge purpose', back: 'Reattach detached state to managed entity' },
  ],
  quickRevision: [
    'Txn-scoped EntityManager',
    'Managed/detached/transient',
    'Identity map u1==u2',
    'Dirty checking auto UPDATE',
    'flush before commit',
    'clear() batch memory',
    'merge returns managed',
  ],
}

export const content = persistenceContextContent
