import type { TopicContent } from '@/domain/types'

export const optimisticLockingContent: TopicContent = {
  whatIsIt:
    'Optimistic locking detects concurrent updates without holding database locks during read — using a @Version column (or comparable attribute) incremented on each successful UPDATE; stale writes fail with OptimisticLockException for application retry.',
  whyExists:
    'Pessimistic locks reduce concurrency on read-heavy paths. Optimistic locking assumes conflicts are rare: read entity with version, business logic, UPDATE WHERE id=? AND version=? — if zero rows updated, another transaction won; retry or fail gracefully.',
  mentalModel:
    'User A and B load Product version=3. A saves → version=4. B saves with version=3 → conflict (0 rows or exception). No lock held while B thinks. Good for web forms, inventory with occasional contention, long business transactions.',
  howItWorks: [
    {
      type: 'list',
      items: [
        '@Version on numeric (Long/Integer) or timestamp field — Hibernate auto-increments on UPDATE.',
        'Each UPDATE adds AND version = :expected to WHERE clause.',
        'Conflict → OptimisticLockException (JPA) or StaleObjectStateException (Hibernate).',
        'Spring @Retryable or user-facing “data changed, refresh” message.',
        'Works across JPA sessions — version stored in DB row.',
        'Alternative: manual @Column compare without @Version using @PreUpdate check.',
      ],
    },
  ],
  architecture: {
    mermaid: `sequenceDiagram
  participant A as Txn A
  participant DB as Database
  participant B as Txn B
  A->>DB: SELECT version=3
  B->>DB: SELECT version=3
  A->>DB: UPDATE SET v=4 WHERE id=1 AND v=3
  DB-->>A: OK
  B->>DB: UPDATE SET v=4 WHERE id=1 AND v=3
  DB-->>B: 0 rows / OptimisticLockException`,
    caption: 'Last writer with stale version fails',
  },
  example: [
    {
      type: 'code',
      language: 'java',
      caption: '@Version entity',
      code: `@Entity
public class Seat {
    @Id @GeneratedValue private Long id;
    private String seatNumber;

    @Version
    private Long version;

    @Enumerated(EnumType.STRING)
    private SeatStatus status;
}

@Transactional
public void bookSeat(Long seatId) {
    Seat seat = seatRepo.findById(seatId).orElseThrow();
    if (seat.getStatus() != AVAILABLE) throw new AlreadyBookedException();
    seat.setStatus(BOOKED);
    // flush: UPDATE seats SET status=?, version=version+1 WHERE id=? AND version=?
}`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Handle conflict',
      code: `@Service
public class BookingService {
    @Retryable(retryFor = OptimisticLockException.class, maxAttempts = 3)
    @Transactional
    public void bookWithRetry(Long seatId) {
        try {
            bookSeat(seatId);
        } catch (OptimisticLockException e) {
            throw new ConflictException("Seat updated by another user, please retry");
        }
    }
}`,
    },
    {
      type: 'code',
      language: 'sql',
      caption: 'SQL generated on update',
      code: `-- Hibernate emits:
UPDATE seats
SET status = 'BOOKED', version = version + 1
WHERE id = 42 AND version = 7;
-- 0 rows updated → optimistic lock failure`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Version column NOT NULL; initial 0 or 1 on insert.',
        'Timestamp @Version less safe — clock skew and precision issues.',
        'Bulk @Modifying JPQL bypasses version check unless WHERE includes version manually.',
        'merge() increments version on conflicting flush if stale.',
        'JPA 2.2 @Version supports Instant, LocalDateTime types in Hibernate 5.2+.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'No read locks — high read concurrency',
      'Simple column-based conflict detection',
      'Works well with stateless HTTP and mobile clients',
    ],
    disadvantages: [
      'Retry storm under high write contention on same row',
      'User must handle conflict UX',
      'Lost update detection only at flush — business validation may rerun',
    ],
    alternatives: [
      'Pessimistic lock SELECT FOR UPDATE for hot rows',
      'Atomic SQL UPDATE ... WHERE status=AVAILABLE',
      'Serializable isolation for invariant-heavy transactions',
    ],
    whenToUse: [
      'Concurrent edits to same entity, conflicts uncommon',
      'Ticket/seat booking with retry UX',
      'Long read-modify-write without holding DB lock',
    ],
    whenNotToUse: [
      'High contention single counter row — use atomic UPDATE or pessimistic',
      'Bulk updates ignoring version',
    ],
  },
  failureModes: [
    'Missing @Version on concurrent entity — lost updates silent.',
    '@Modifying query skips version increment — stale reads after.',
    'Retry without reload — same stale version retries forever.',
    'Timestamp version with concurrent ms updates — false conflicts or misses.',
    'Exposing version to client not returned on update — client cannot send If-Match style.',
  ],
  production: {
    reliability: ['Retry with reload from DB on OptimisticLockException'],
    observability: ['Metric optimistic lock failure rate per entity type'],
  },
  interview: {
    expectations: [
      '@Version mechanism and SQL WHERE clause',
      'Optimistic vs pessimistic tradeoff',
      'Exception handling and retry',
    ],
    commonQuestions: [
      'How optimistic locking works in JPA?',
      'OptimisticLockException when?',
      'Optimistic vs pessimistic locking?',
    ],
    followUps: ['Atomic UPDATE without version', 'Capstone seat booking'],
    misconceptions: [
      'Optimistic locking prevents all concurrency bugs without retry',
      '@Version locks row during read',
      'Version optional for concurrent updates',
    ],
    traps: ['Optimistic lock on inventory without atomic status check in WHERE'],
    strongSignals: [
      'UPDATE WHERE version=',
      'Retry reload pattern',
      'Combine with status predicate in SQL',
    ],
  },
  keyTakeaways: [
    '@Version column incremented each successful UPDATE.',
    'Stale version → OptimisticLockException; retry after reload.',
    'No locks during read — good for read-heavy OLTP.',
    'High contention → pessimistic or atomic SQL better.',
    '@Modifying queries bypass automatic versioning — caution.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Purpose of @Version?',
      answerHint: 'Detect concurrent updates; UPDATE fails if version changed since read.',
    },
    {
      level: 'intermediate',
      question: 'Optimistic vs pessimistic locking?',
      answerHint: 'Optimistic check at write with version; pessimistic locks row on read (FOR UPDATE).',
    },
    {
      level: 'advanced',
      question: 'Booking seat with optimistic lock — full flow?',
      answerHint: 'Read seat+version; validate status; update; catch OptimisticLockException; retry reload; optionally combine WHERE status=AVAILABLE in SQL.',
    },
  ],
  flashcards: [
    { front: '@Version UPDATE', back: 'WHERE id=? AND version=?; increment on success' },
    { front: 'OptimisticLockException', back: 'Stale version at flush — conflict detected' },
    { front: 'Optimistic best when', back: 'Conflicts rare; reads dominate' },
  ],
  quickRevision: [
    '@Version auto increment',
    'No lock on read',
    'Conflict at flush',
    'Retry + reload',
    'vs pessimistic hot rows',
    '@Modifying bypasses version',
    'Atomic WHERE status check',
  ],
}

export const content = optimisticLockingContent
