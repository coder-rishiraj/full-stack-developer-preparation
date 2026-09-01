import type { TopicContent } from '@/domain/types'

export const joinsContent: TopicContent = {
  whatIsIt:
    'A SQL JOIN combines rows from two or more tables (or subqueries) based on a related condition — typically equality on keys — producing a wider result set for queries that span normalized entities.',
  whyExists:
    'Normalized schemas store facts in separate tables to avoid duplication. Applications need assembled views (user + orders + products). JOINs express relational composition declaratively; the optimizer picks nested loop, hash, or merge algorithms.',
  mentalModel:
    'For each row on the left, find matching rows on the right where join predicate holds. INNER keeps matches only; OUTER preserves non-matching side with NULL padding; CROSS is Cartesian product. Index foreign keys to keep joins fast.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Join type', 'Result', 'Typical use'],
      rows: [
        ['INNER JOIN', 'Matching rows only', 'Default composition'],
        ['LEFT OUTER JOIN', 'All left + matched right or NULL', 'Optional related data'],
        ['RIGHT OUTER JOIN', 'Mirror of LEFT', 'Rare — swap tables instead'],
        ['FULL OUTER JOIN', 'All from both sides', 'Reconciliation, diffs'],
        ['CROSS JOIN', 'Every pair', 'Explicit Cartesian; usually accidental bug'],
      ],
    },
    {
      type: 'list',
      items: [
        'ON clause: join condition (equi-join: a.id = b.a_id).',
        'WHERE filters after join; moving predicates between ON and WHERE changes OUTER semantics.',
        'PostgreSQL algorithms: Nested Loop (index on inner), Hash Join (build hash on smaller side), Merge Join (sorted inputs).',
        'Semi-join (EXISTS, IN): existence check without duplicating left rows.',
        'Anti-join (NOT EXISTS): left rows with no match — prefer NOT EXISTS over NOT IN with NULLs.',
      ],
    },
  ],
  architecture: {
    mermaid: `flowchart LR
  T1[Table A] --> Join[Join operator]
  T2[Table B] --> Join
  Join --> NL[Nested Loop]
  Join --> HJ[Hash Join]
  Join --> MJ[Merge Join]
  NL --> Out[Result rows]`,
    caption: 'Planner picks join algorithm by size, indexes, stats',
  },
  example: [
    {
      type: 'code',
      language: 'sql',
      caption: 'INNER and LEFT JOIN',
      code: `SELECT u.id, u.email, o.id AS order_id, o.total
FROM users u
INNER JOIN orders o ON o.user_id = u.id
WHERE o.created_at >= '2026-01-01';

SELECT u.id, u.email, o.id AS order_id
FROM users u
LEFT JOIN orders o ON o.user_id = u.id AND o.status = 'open';
-- users without open orders still appear (order_id NULL)`,
    },
    {
      type: 'code',
      language: 'sql',
      caption: 'EXISTS semi-join vs IN',
      code: `SELECT u.*
FROM users u
WHERE EXISTS (
  SELECT 1 FROM orders o
  WHERE o.user_id = u.id AND o.total > 1000
);`,
    },
    {
      type: 'code',
      language: 'sql',
      caption: 'Anti-join — NOT EXISTS (NULL-safe)',
      code: `SELECT u.*
FROM users u
WHERE NOT EXISTS (
  SELECT 1 FROM orders o WHERE o.user_id = u.id
);`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Nested Loop: for each outer row, seek inner via index — good small outer + indexed inner.',
        'Hash Join: build in-memory hash table on join key of smaller relation; probe other — large equi-joins without sort.',
        'Merge Join: both inputs sorted on join key — efficient for pre-sorted or index scans.',
        'Join order matters: optimizer permutes tables; bad stats → disastrous nested loop on big sets.',
        'NULL in join keys: NULL = NULL is UNKNOWN — rows do not join; affects OUTER and NOT IN behavior.',
      ],
    },
  ],
  complexity: {
    average: 'Hash/Merge O(n+m); Nested Loop O(n×m) worst without index',
    worst: 'Cartesian product O(n×m) if join condition missing',
    notes: 'Indexes on FK columns critical for nested loop performance.',
  },
  tradeoffs: {
    advantages: [
      'Declarative multi-table queries',
      'Optimizer can choose best algorithm',
      'Avoids application-side nested queries N+1 when done in one SQL',
    ],
    disadvantages: [
      'Wide joins expensive — many columns, large intermediates',
      'ORM lazy loading tempts N+1 instead of join/fetch join',
      'Outer join predicate placement bugs',
    ],
    alternatives: [
      'Denormalized read models / materialized views',
      'Application batching with IN (…) for small sets',
      'GraphQL DataLoader pattern (batched queries, not one giant join)',
    ],
    whenToUse: [
      'Reporting and API queries needing related entities',
      'Integrity checks across tables in one statement',
    ],
    whenNotToUse: [
      'Fetching unbounded cross product',
      'Microservice DB-per-service without local FK (no join across DBs)',
    ],
  },
  failureModes: [
    'Missing ON condition → CROSS JOIN explosion.',
    'Filter in WHERE instead of ON on LEFT JOIN — unintentionally turns into INNER behavior for null-rejecting predicates.',
    'NOT IN (subquery) when subquery column nullable → empty result surprise; use NOT EXISTS.',
    'N+1: ORM loads parent then one query per child instead of JOIN/fetch join.',
    'Joining on non-indexed columns on huge tables — hash spill to disk, slow.',
  ],
  production: {
    performance: [
      'Index join keys (FK columns)',
      'EXPLAIN ANALYZE; watch nested loops with high row counts',
    ],
    scalability: [
      'Limit selected columns; avoid SELECT * in hot joins',
      'Partition large tables so joins prune partitions',
    ],
    observability: ['Log slow queries; pg_stat_statements for join-heavy SQL'],
    maintainability: ['Explicit JOIN syntax over implicit comma-FROM'],
  },
  interview: {
    expectations: [
      'Explain INNER vs LEFT OUTER',
      'ON vs WHERE for outer joins',
      'Name join algorithms and when used',
      'NOT EXISTS vs NOT IN with NULLs',
    ],
    commonQuestions: [
      'Difference between INNER and LEFT JOIN?',
      'What is a Cartesian product?',
      'How does hash join work?',
      'N+1 problem and fix?',
    ],
    followUps: [
      'Semi-join vs inner join?',
      'How would you optimize a slow 5-table join?',
    ],
    misconceptions: [
      'JOIN always uses indexes',
      'More JOINs always slower than multiple queries (often opposite for N+1)',
      'RIGHT JOIN is required often (LEFT with swapped tables suffices)',
    ],
    traps: ['Using SELECT DISTINCT to fix accidental cross join instead of fixing ON'],
    strongSignals: [
      'Explains NULL join behavior and NOT EXISTS',
      'Mentions hash vs nested loop choice',
      'Indexes FK columns proactively',
    ],
  },
  keyTakeaways: [
    'INNER = matches; LEFT = preserve left + NULL pad.',
    'ON is join condition; WHERE filters — placement matters for OUTER.',
    'Algorithms: nested loop (indexed), hash (equi large), merge (sorted).',
    'Index foreign keys; avoid accidental CROSS JOIN.',
    'NOT EXISTS over NOT IN when NULLs possible; beware N+1.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'INNER vs LEFT JOIN?',
      answerHint: 'INNER drops non-matches; LEFT keeps all left rows with NULLs for unmatched right.',
    },
    {
      level: 'intermediate',
      question: 'Why can NOT IN return no rows unexpectedly?',
      answerHint: 'NULL in subquery — compare unknown; use NOT EXISTS.',
    },
    {
      level: 'advanced',
      question: 'When does PostgreSQL choose hash join vs nested loop?',
      answerHint: 'Hash for larger equi-joins; nested loop when outer small and inner indexed.',
    },
  ],
  flashcards: [
    { front: 'LEFT JOIN unmatched right', back: 'NULL columns from right side' },
    { front: 'NOT IN NULL trap', back: 'Use NOT EXISTS instead' },
    { front: 'Hash join', back: 'Build hash on smaller side; probe other for matches' },
  ],
  quickRevision: [
    'INNER / LEFT / FULL / CROSS',
    'ON vs WHERE on OUTER',
    'Index FK columns',
    'Nested loop / hash / merge',
    'NOT EXISTS > NOT IN with NULLs',
    'Avoid missing ON → cross join',
    'Fight ORM N+1 with join/fetch',
  ],
}

export const content = joinsContent
