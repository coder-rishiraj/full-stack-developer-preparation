import type { TopicContent } from '@/domain/types'

export const pessimisticLockingContent: TopicContent = {
  whatIsIt:
    'Pessimistic locking acquires database row locks during read (via JPA LockModeType.PESSIMISTIC_READ/WRITE or SELECT FOR UPDATE) — blocking other transactions from conflicting writes until the lock holder commits, guaranteeing exclusive access for critical sections.',
  whyExists:
    'When write contention is high or invariants must hold across read-modify-write (inventory decrement, balance transfer), optimistic retries waste resources. Pessimistic locking serializes access to hot rows at the database — predictable correctness at concurrency cost.',
  mentalModel:
    'SELECT ... FOR UPDATE in same @Transactional — row locked until commit. Other txn UPDATE/ FOR UPDATE waits (or fails lock_timeout). Use for short transactions only; long hold blocks pool and throughput.',
  howItWorks: [
    {
      type: 'list',
      items: [
        'LockModeType.PESSIMISTIC_WRITE → SELECT FOR UPDATE (exclusive row lock).',
        'LockModeType.PESSIMISTIC_READ → SELECT FOR SHARE (PostgreSQL) — shared row lock.',
        'entityManager.find(Class, id, LockModeType.PESSIMISTIC_WRITE) or @Lock on repository query.',
        'Lock held until transaction ends — commit or rollback releases.',
        'PostgreSQL: FOR UPDATE SKIP LOCKED for queue workers (Hibernate 6+ support).',
        'LockModeType.PESSIMISTIC_FORCE_INCREMENT: lock + version increment (Hibernate).',
      ],
    },
  ],
  architecture: {
    mermaid: `sequenceDiagram
  participant A as Txn A
  participant DB as PostgreSQL
  participant B as Txn B
  A->>DB: SELECT FOR UPDATE row 1
  DB-->>A: row + lock
  B->>DB: SELECT FOR UPDATE row 1
  Note over B,DB: blocks until A commits
  A->>DB: UPDATE + COMMIT
  DB-->>B: lock granted`,
    caption: 'Second transaction waits on row lock',
  },
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Repository pessimistic lock',
      code: `public interface AccountRepository extends JpaRepository<Account, Long> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT a FROM Account a WHERE a.id = :id")
    Optional<Account> findByIdForUpdate(@Param("id") Long id);
}

@Transactional
public void transfer(Long fromId, Long toId, BigDecimal amount) {
    Account from = accountRepo.findByIdForUpdate(fromId).orElseThrow();
    Account to = accountRepo.findByIdForUpdate(toId).orElseThrow();
    from.debit(amount);
    to.credit(amount);
}`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'EntityManager lock',
      code: `@Transactional
public void decrementStock(Long productId, int qty) {
    Product p = em.find(Product.class, productId, LockModeType.PESSIMISTIC_WRITE);
    if (p.getStock() < qty) throw new InsufficientStockException();
    p.setStock(p.getStock() - qty);
}`,
    },
    {
      type: 'code',
      language: 'sql',
      caption: 'Generated SQL (PostgreSQL)',
      code: `SELECT id, stock, version
FROM products
WHERE id = 42
FOR UPDATE;

-- SKIP LOCKED variant for job queue:
SELECT id FROM jobs WHERE status = 'PENDING'
FOR UPDATE SKIP LOCKED LIMIT 1;`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'PostgreSQL row-level exclusive lock blocks other FOR UPDATE and conflicting UPDATE.',
        'Lock ordering across tables important — deadlock risk like raw SQL.',
        'javax.persistence.lock.timeout / Hibernate jakarta.persistence.lock.timeout hints (ms).',
        'Upgrade lock: PESSIMISTIC_READ then write may upgrade to exclusive.',
        'Outer join in @Lock query may fail or lock unpredictably — lock root entity by id.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Guaranteed exclusive access to row during transaction',
      'No lost update without retry loops',
      'Natural for financial/inventory hot rows',
    ],
    disadvantages: [
      'Blocks concurrent access — latency and deadlock risk',
      'Must keep transaction short',
      'Does not prevent application bugs outside locked rows',
    ],
    alternatives: [
      'Optimistic @Version with retry',
      'Single atomic UPDATE stock = stock - ? WHERE id=? AND stock >= ?',
      'Serializable isolation + SSI',
    ],
    whenToUse: [
      'High contention on single row (seat, SKU stock)',
      'Transfer between two accounts in one txn',
      'Short critical section',
    ],
    whenNotToUse: [
      'Long-running business process holding lock',
      'Read-mostly data',
      'When atomic UPDATE sufficient without read',
    ],
  },
  failureModes: [
    'Lock held across external API call — pool exhaustion.',
    'Deadlock two accounts transfer opposite order — need ordering convention.',
    'FOR UPDATE on query with LEFT JOIN — locks wrong rows or error.',
    'No lock_timeout — indefinite wait under failure.',
    'Pessimistic lock outside @Transactional — no lock acquired or immediate release.',
  ],
  production: {
    performance: ['Consistent lock acquisition order on multi-row updates'],
    reliability: ['Set lock_timeout; retry deadlock 40P01'],
    observability: ['pg_stat_activity wait_event Lock monitoring'],
  },
  interview: {
    expectations: [
      'PESSIMISTIC_WRITE → FOR UPDATE',
      'Lock scope tied to transaction duration',
      'Compare optimistic vs pessimistic',
    ],
    commonQuestions: [
      'When use pessimistic locking in JPA?',
      'How @Lock annotation works?',
      'Risk of pessimistic locks?',
    ],
    followUps: ['SKIP LOCKED pattern', 'Deadlock prevention'],
    misconceptions: [
      'Pessimistic lock locks entire table always',
      'Works without active transaction',
      'Always better than optimistic',
    ],
    traps: ['Pessimistic lock then call slow external service in same txn'],
    strongSignals: [
      'Short transaction emphasis',
      'Atomic UPDATE alternative mentioned',
      'lock_timeout and deadlock ordering',
    ],
  },
  keyTakeaways: [
    'Pessimistic lock = SELECT FOR UPDATE until commit.',
    '@Lock on repository or find(..., PESSIMISTIC_WRITE).',
    'Blocks other writers — use short transactions only.',
    'Prefer atomic SQL or optimistic when contention low.',
    'Deadlock risk — consistent lock ordering.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What does PESSIMISTIC_WRITE do?',
      answerHint: 'SELECT FOR UPDATE — exclusive row lock until transaction ends.',
    },
    {
      level: 'intermediate',
      question: 'Pessimistic vs optimistic when?',
      answerHint: 'Pessimistic for high contention hot rows short txn; optimistic when conflicts rare.',
    },
    {
      level: 'advanced',
      question: 'Decrement stock without explicit read lock?',
      answerHint: 'UPDATE products SET stock=stock-? WHERE id=? AND stock>=? ; check rows affected = 1.',
    },
  ],
  flashcards: [
    { front: '@Lock PESSIMISTIC_WRITE', back: 'SELECT FOR UPDATE row lock' },
    { front: 'Lock duration', back: 'Until transaction commit/rollback' },
    { front: 'Pessimistic risk', back: 'Blocking, deadlocks, long txn pool drain' },
  ],
  quickRevision: [
    'FOR UPDATE row lock',
    '@Lock on query/find',
    'Txn-scoped hold',
    'Short transactions only',
    'vs optimistic retry',
    'Atomic UPDATE alternative',
    'Deadlock ordering',
  ],
}

export const content = pessimisticLockingContent
