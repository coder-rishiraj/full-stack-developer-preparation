import type { TopicContent } from '@/domain/types'

export const dirtyCheckingContent: TopicContent = {
  whatIsIt:
    'Dirty checking is Hibernate\'s automatic detection of changes to managed entity fields by comparing current state to a snapshot taken at load time — generating UPDATE statements only for changed columns (or entity) on flush without explicit save() calls.',
  whyExists:
    'Manual ORM update APIs are tedious and error-prone. Dirty checking lets developers mutate managed objects in transactional code; the ORM persists changes at flush/commit — aligning with domain-driven in-place mutation style.',
  mentalModel:
    'Load entity → Hibernate stores field snapshot in persistence context. You setEmail(...). At flush, dirty fields compared → UPDATE users SET email=? WHERE id=?. No save() needed if entity still managed. Detached changes invisible until merge.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Entity becomes managed via find, persist, or merge.',
        'Hibernate records loaded state snapshot (per entity entry).',
        'Field mutations on managed entity mark entity dirty.',
        'Flush triggers dirty check for all managed entities in context.',
        'SQL UPDATE generated — @DynamicUpdate limits to changed columns only.',
        'Commit flushes if not already flushed (FlushMode.AUTO also flushes before queries).',
      ],
    },
  ],
  architecture: {
    mermaid: `flowchart TB
  Load[find User] --> Snap[Snapshot state]
  Mutate[setEmail new value] --> Dirty[Entity marked dirty]
  Flush[flush / commit] --> Compare[Compare snapshot vs current]
  Compare --> SQL[UPDATE changed columns]`,
    caption: 'Snapshot comparison drives UPDATE generation',
  },
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Implicit update via dirty checking',
      code: `@Transactional
public void changeEmail(Long userId, String newEmail) {
    User user = userRepository.findById(userId).orElseThrow();
    user.setEmail(newEmail);
    // no save() — managed entity dirty checked on commit
}

// Generates: UPDATE users SET email=? WHERE id=?`,
    },
    {
      type: 'code',
      language: 'java',
      caption: '@DynamicUpdate — column-level diff',
      code: `@Entity
@DynamicUpdate
public class Product {
    @Id @GeneratedValue private Long id;
    private String name;
    private BigDecimal price;
    private int stock;
}

// Only price changed → UPDATE products SET price=? WHERE id=?
// Without @DynamicUpdate: all columns in UPDATE`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Detached entity — no dirty check',
      code: `User user = userRepo.findById(1L).orElseThrow();
// transaction ends — detached

user.setEmail("x@y.com"); // NOT persisted
userRepository.save(user); // merge + dirty check in new txn`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Default dirty check at flush traverses all managed entities — O(n) in context size.',
        'Collection mutations tracked via PersistentCollection wrapper dirty flag.',
        'Bytecode enhancement can avoid full field reflection for dirty tracking.',
        'FlushMode.MANUAL — application calls flush explicitly; no auto before queries.',
        'Read-only @Transactional: Hibernate may skip dirty checking optimization.',
        'Immutable @Immutable entities skip dirty check entirely.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Natural in-place domain mutation',
      'No explicit UPDATE in repository for simple changes',
      '@DynamicUpdate reduces write amplification',
    ],
    disadvantages: [
      'Surprise writes if unintended field mutation',
      'Large persistence context → expensive flush dirty scan',
      'Detached confusion — changes silently not saved',
    ],
    alternatives: [
      'Explicit @Modifying @Query UPDATE for bulk',
      'Spring Data save() explicit semantics',
      'DTO in / entity out — only set intended fields',
    ],
    whenToUse: [
      'Standard transactional service updating few fields',
      'Domain model method mutates internal state',
    ],
    whenNotToUse: [
      'Bulk update millions rows — use batch SQL',
      'Partial update API where null means “no change” on detached DTO mapped wrong',
    ],
  },
  failureModes: [
    'Mutate shared detached entity reference — not persisted.',
    'Accidental setter in mapper changes unintended fields → DB overwrite.',
    'Large session many dirty entities → slow flush.',
    'Assuming save() required always — inconsistent patterns confuse team.',
    'Collection replace instead of mutate — orphan issues with orphanRemoval.',
  ],
  production: {
    performance: ['@DynamicUpdate on wide tables with sparse updates', 'Short transactions limit dirty set size'],
    maintainability: ['Explicit save() in some codebases for clarity — team convention'],
  },
  interview: {
    expectations: [
      'Dirty checking mechanism snapshot comparison',
      'Managed entity mutation without save',
      'DynamicUpdate role',
    ],
    commonQuestions: [
      'How Hibernate knows entity changed?',
      'Need save() after setEmail on managed entity?',
      'What is @DynamicUpdate?',
    ],
    followUps: ['FlushMode effects', 'Detached entity changes'],
    misconceptions: [
      'save() always required for UPDATE',
      'Dirty check runs on every setter immediately',
      'All ORM changes need explicit merge in same txn',
    ],
    traps: ['Modify entity returned from completed transaction'],
    strongSignals: [
      'Snapshot at load time',
      'Flush at commit',
      'merge for detached',
    ],
  },
  keyTakeaways: [
    'Managed entity field changes auto-detected at flush.',
    'No save() needed within same @Transactional for managed entities.',
    '@DynamicUpdate emits UPDATE only changed columns.',
    'Detached mutations ignored until merge/save.',
    'Bulk changes → @Modifying query not dirty checking.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What is dirty checking?',
      answerHint: 'ORM compares entity to load snapshot; generates UPDATE for changes on flush.',
    },
    {
      level: 'intermediate',
      question: 'Is repository.save() required after mutating managed User?',
      answerHint: 'No within same transaction — dirty checking persists on flush/commit.',
    },
    {
      level: 'advanced',
      question: '@DynamicUpdate benefit?',
      answerHint: 'Generates SQL updating only changed columns — less write amplification on wide rows.',
    },
  ],
  flashcards: [
    { front: 'Dirty checking when', back: 'At flush — compare snapshot vs current fields' },
    { front: 'Managed mutation', back: 'No save() needed in same transaction' },
    { front: '@DynamicUpdate', back: 'UPDATE only dirty columns in SQL' },
  ],
  quickRevision: [
    'Snapshot on load',
    'Managed setter → dirty',
    'Flush generates UPDATE',
    'No save in same txn',
    'Detached needs merge',
    '@DynamicUpdate sparse cols',
    'Bulk use @Modifying',
  ],
}

export const content = dirtyCheckingContent
