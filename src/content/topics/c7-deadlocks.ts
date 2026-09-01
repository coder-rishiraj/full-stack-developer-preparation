import type { TopicContent } from '@/domain/types'

export const deadlocksContent: TopicContent = {
  whatIsIt:
    'A database deadlock is a cycle where two or more transactions each hold a lock the other waits for — PostgreSQL detects cycles via wait-for graph and aborts one transaction with SQLSTATE 40P01 (deadlock_detected), requiring client retry.',
  whyExists:
    'Concurrent transactions locking rows in inconsistent order (T1: A then B; T2: B then A) create circular waits neither can progress. Detection and victim rollback breaks the cycle; apps must retry idempotently.',
  mentalModel:
    'Transactions acquire row locks on UPDATE/DELETE/SELECT FOR UPDATE. Waiting forms directed graph: T1→T2 if T1 waits for T2 lock. Cycle → deadlock. PostgreSQL checks periodically (deadlock_timeout default 1s). One txn rolls back — others proceed.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Txn A locks row 1, txn B locks row 2.',
        'Txn A tries lock row 2 — waits on B.',
        'Txn B tries lock row 1 — waits on A — cycle detected.',
        'PostgreSQL picks victim (cost-based), ERROR deadlock_detected.',
        'Survivor continues; victim must ROLLBACK and retry whole transaction.',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Prevention',
      text: 'Lock rows in consistent global order (always lower id first). Keep transactions short. Use advisory locks for app-level ordering.',
    },
  ],
  architecture: {
    mermaid: `flowchart LR
  T1[Txn A locks row 1] --> Wait1[A waits row 2]
  T2[Txn B locks row 2] --> Wait2[B waits row 1]
  Wait1 --> Cycle[Deadlock cycle]
  Wait2 --> Cycle
  Cycle --> Victim[Abort one txn]`,
    caption: 'Circular lock wait → detector aborts victim',
  },
  example: [
    {
      type: 'code',
      language: 'sql',
      caption: 'Classic deadlock scenario',
      code: `-- Session 1                    -- Session 2
BEGIN;                            BEGIN;
UPDATE accounts SET balance = balance WHERE id = 1;
                                  UPDATE accounts SET balance = balance WHERE id = 2;
UPDATE accounts SET balance = balance WHERE id = 2;  -- waits
                                  UPDATE accounts SET balance = balance WHERE id = 1;  -- deadlock
-- Session 2: ERROR: deadlock detected`,
    },
    {
      type: 'code',
      language: 'sql',
      caption: 'Prevent — consistent lock order',
      code: `-- Always lock accounts in ascending id order
BEGIN;
SELECT * FROM accounts WHERE id IN (1, 2) ORDER BY id FOR UPDATE;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Spring retry on deadlock',
      code: `@Retryable(retryFor = PSQLException.class,
           exceptionExpression = "#{message.contains('deadlock detected')}")
@Transactional
public void transfer(long from, long to, BigDecimal amount) {
  accountRepo.debit(from, amount);
  accountRepo.credit(to, amount);
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'deadlock_timeout (1s): how often detector runs while waiting on lock.',
        'Row-level exclusive locks on UPDATE; ShareLock on SELECT FOR UPDATE.',
        'Gap/next-key locks in higher isolation (RR) increase deadlock surface — PostgreSQL uses SI.',
        'pg_locks view shows blocked/blocking pids; log_lock_waits logs long waits.',
        'Advisory locks pg_advisory_xact_lock(int) serialize app-defined resources.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Automatic detection — no infinite wait',
      'Retry pattern recovers transparently',
    ],
    disadvantages: [
      'Victim txn wasted work — latency jitter',
      'High contention hot rows — frequent deadlocks',
    ],
    alternatives: [
      'Consistent lock ordering — prevention',
      'Queue single-threaded processor for hot resource',
      'Optimistic locking (version column) — no row lock until UPDATE',
    ],
    whenToUse: [
      'Retry with backoff on 40P01 in application',
      'FOR UPDATE with ORDER BY for multi-row locks',
    ],
    whenNotToUse: [
      'Ignoring deadlock errors without retry',
      'Long transactions increasing overlap',
    ],
  },
  failureModes: [
    'No retry — user sees intermittent failure.',
    'Non-idempotent retry — double charge on duplicate POST.',
    'Lock tables in random order across code paths.',
    'Foreign key checks lock parent rows in surprising order.',
    'Deadlock mixed with connection pool — leaked connection if not rolled back.',
  ],
  production: {
    reliability: ['Retry 3x exponential backoff on deadlock; idempotent keys'],
    observability: ['Metric deadlock count; pg_stat_database deadlocks counter'],
    performance: ['Short transactions; index rows locked in consistent order'],
  },
  interview: {
    expectations: [
      'Define deadlock and detection',
      'Prevention via lock ordering',
      'Client retry responsibility',
    ],
    commonQuestions: [
      'What is a database deadlock?',
      'How prevent deadlocks?',
      'What should app do on deadlock?',
    ],
    followUps: [
      'Deadlock vs lock wait timeout?',
      'Advisory locks use case?',
    ],
    misconceptions: [
      'Database picks random victim without rollback',
      'Deadlocks only happen on same row',
      'Serializable isolation eliminates deadlocks',
    ],
    traps: ['Saying deadlocks mean design is always wrong — some retry is normal'],
    strongSignals: [
      'Consistent lock order pattern',
      '40P01 retry with idempotency',
      'SELECT FOR UPDATE ORDER BY id',
    ],
  },
  keyTakeaways: [
    'Deadlock = circular lock wait; PG aborts one txn.',
    'Retry whole transaction on deadlock_detected.',
    'Lock resources in consistent global order.',
    'Keep transactions short; hot rows contend.',
    'Idempotent retries avoid duplicate side effects.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What happens when PostgreSQL detects deadlock?',
      answerHint: 'Aborts one transaction with 40P01; other continues after victim releases locks.',
    },
    {
      level: 'intermediate',
      question: 'How prevent deadlocks on two accounts transfer?',
      answerHint: 'Always lock lower account id first; or single ordered FOR UPDATE.',
    },
    {
      level: 'advanced',
      question: 'Deadlock vs blocking lock wait?',
      answerHint: 'Blocking is one-way wait; deadlock is cycle — detector required to break.',
    },
  ],
  flashcards: [
    { front: 'PostgreSQL deadlock SQLSTATE', back: '40P01 deadlock_detected' },
    { front: 'Prevention pattern', back: 'Acquire locks in consistent global order' },
    { front: 'App response', back: 'ROLLBACK and retry entire transaction' },
  ],
  quickRevision: [
    'Cycle of lock waits',
    'PG picks victim rollback',
    'Retry with backoff',
    'Lock order ascending id',
    'Short transactions',
    'FOR UPDATE ORDER BY',
    'Idempotent retries',
  ],
}

export const content = deadlocksContent
