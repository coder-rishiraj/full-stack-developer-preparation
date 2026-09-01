import type { TopicContent } from '@/domain/types'

export const transactionsContent: TopicContent = {
  whatIsIt:
    'JPA transactions (Spring @Transactional) demarcate units of work bound to a persistence context — ensuring atomic commit/rollback of entity changes and SQL operations, with propagation and isolation controlling nested behavior and concurrent visibility.',
  whyExists:
    'Business operations span multiple entity updates and queries that must succeed or fail together. Transactions coordinate flush timing, connection acquisition, and rollback on unchecked exceptions — bridging JPA persistence context lifecycle with database ACID semantics.',
  mentalModel:
    '@Transactional method opens EntityManager-bound transaction. All managed changes flush on commit. RuntimeException rolls back by default. readOnly=true optimizes flush skip. propagation REQUIRED joins existing txn; REQUIRES_NEW suspends and starts fresh.',
  howItWorks: [
    {
      type: 'list',
      items: [
        'Spring AOP proxy intercepts @Transactional — begin/commit/rollback around method.',
        'Default propagation REQUIRED: join caller txn or create new.',
        'rollbackFor / noRollbackFor customize exception behavior.',
        'readOnly=true: Hibernate skip dirty flush; DB may optimize read replica routing.',
        'Isolation: @Transactional(isolation = Isolation.REPEATABLE_READ) — rare override; DB default usually READ COMMITTED (PostgreSQL).',
        'EntityManager flush before commit; lazy loads work until method returns (unless OSIV extends).',
      ],
    },
    {
      type: 'table',
      headers: ['Propagation', 'Behavior'],
      rows: [
        ['REQUIRED (default)', 'Join existing or create new'],
        ['REQUIRES_NEW', 'Always new txn; suspend current'],
        ['NESTED', 'Savepoint nested rollback (JDBC savepoints)'],
        ['MANDATORY', 'Must run in existing txn else exception'],
        ['NOT_SUPPORTED', 'Run non-transactional; suspend txn'],
      ],
    },
  ],
  architecture: {
    mermaid: `flowchart TB
  Controller --> Service[@Transactional Service]
  Service --> Repo[Repository]
  Repo --> EM[EntityManager]
  EM --> Txn[DB Transaction]
  Txn -->|success| Commit[commit flush]
  Txn -->|RuntimeException| Rollback[rollback]`,
    caption: 'Transaction boundary typically at service layer',
  },
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Service transaction boundary',
      code: `@Service
@RequiredArgsConstructor
public class TransferService {
    private final AccountRepository accounts;
    private final TransferLogRepository logs;

    @Transactional
    public void transfer(Long from, Long to, BigDecimal amount) {
        Account a = accounts.findByIdForUpdate(from).orElseThrow();
        Account b = accounts.findByIdForUpdate(to).orElseThrow();
        a.debit(amount);
        b.credit(amount);
        logs.save(new TransferLog(from, to, amount));
        // all commit or all rollback on exception
    }
}`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'readOnly and propagation',
      code: `@Transactional(readOnly = true)
public OrderDto getOrder(Long id) {
    return orderRepo.findWithItemsById(id)
        .map(OrderDto::from)
        .orElseThrow();
}

@Transactional(propagation = Propagation.REQUIRES_NEW)
public void writeAuditInSeparateTxn(AuditEntry entry) {
    auditRepo.save(entry); // commits even if outer txn rolls back
}`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Programmatic TransactionTemplate',
      code: `transactionTemplate.executeWithoutResult(status -> {
    try {
        doWork();
    } catch (BusinessException e) {
        status.setRollbackOnly();
    }
});`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'JpaTransactionManager binds EntityManager to thread per transaction.',
        'Self-invocation bypasses proxy — @Transactional ineffective on this.method() internal call.',
        'Checked exceptions do not rollback by default — must rollbackFor.',
        'Connection obtained from pool at txn begin; held until commit — keep short.',
        'Chained @Transactional REQUIRES_NEW: two persistence contexts, two connections.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Declarative ACID unit of work',
      'Consistent rollback on failure',
      'readOnly optimization for queries',
    ],
    disadvantages: [
      'Long transactions hold connections and locks',
      'Misplaced boundary (controller) causes LIE or partial commits',
      'Propagation misuse → unexpected partial commit',
    ],
    alternatives: [
      'Programmatic TransactionTemplate for fine control',
      'Outbox pattern for cross-service eventual consistency',
      'Declarative @TransactionalEventListener AFTER_COMMIT',
    ],
    whenToUse: [
      'Service layer multi-entity business operations',
      'readOnly for query-only service methods',
    ],
    whenNotToUse: [
      'Whole HTTP request @Transactional (except deliberate short service calls)',
      'REQUIRES_NEW for every log line — connection churn',
    ],
  },
  failureModes: [
    ' @Transactional on private method — ignored by Spring AOP.',
    'Self-invocation — no transaction started.',
    'Checked exception swallowed — partial commit when business failed.',
    'Long @Transactional with remote HTTP inside — pool and lock exhaustion.',
    'Lazy load after service method returns — LazyInitializationException (no OSIV).',
    'REQUIRES_NEW audit commits while business txn rolls back — intentional but surprising.',
  ],
  production: {
    reliability: ['Default rollback on RuntimeException; explicit rollbackFor checked business exceptions'],
    performance: ['Short transactions; readOnly for list endpoints', 'Monitor connection pool wait time'],
    observability: ['Trace transaction boundaries in APM; log rollback events'],
  },
  interview: {
    expectations: [
      '@Transactional default rollback behavior',
      'Propagation REQUIRED vs REQUIRES_NEW',
      'Service vs repository transaction placement',
    ],
    commonQuestions: [
      'Where put @Transactional in Spring?',
      'Default rollback rules?',
      'readOnly=true effect?',
    ],
    followUps: ['Self-invocation problem', 'JPA vs DB transaction relationship'],
    misconceptions: [
      'Repository save auto-starts transaction always sufficient for multi-step',
      'All exceptions rollback by default',
      '@Transactional on controller is fine',
    ],
    traps: ['REQUIRES_NEW without understanding partial commit audit trail'],
    strongSignals: [
      'Service layer boundary',
      'Connection held duration awareness',
      'Link to PostgreSQL isolation from c7-transactions',
    ],
  },
  keyTakeaways: [
    '@Transactional demarcates persistence context + DB transaction.',
    'Place on service methods; REQUIRED joins existing txn.',
    'RuntimeException rolls back; checked exceptions need rollbackFor.',
    'readOnly=true for queries; keep transactions short.',
    'Self-invocation bypasses proxy — structure calls through Spring bean.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What does @Transactional do in Spring JPA?',
      answerHint: 'Starts/commits/rolls back DB transaction; binds EntityManager; flush on commit.',
    },
    {
      level: 'intermediate',
      question: 'REQUIRED vs REQUIRES_NEW propagation?',
      answerHint: 'REQUIRED joins current; REQUIRES_NEW suspends and creates independent commit/rollback.',
    },
    {
      level: 'advanced',
      question: 'Why @Transactional fails on self-invocation?',
      answerHint: 'Spring AOP proxy bypassed when calling this.method() internally — no interceptor applied.',
    },
  ],
  flashcards: [
    { front: 'Default rollback', back: 'RuntimeException and Error; not checked exceptions' },
    { front: 'readOnly=true', back: 'Skip dirty flush; hint for read optimization' },
    { front: 'Transaction boundary', back: 'Service layer typical — not controller' },
  ],
  quickRevision: [
    '@Transactional service layer',
    'REQUIRED default propagation',
    'RuntimeException rollback',
    'readOnly queries',
    'Short txn — pool + locks',
    'Self-invocation bypass',
    'EM bound per txn',
  ],
}

export const content = transactionsContent
