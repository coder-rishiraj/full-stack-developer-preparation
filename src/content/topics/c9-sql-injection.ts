import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'SQL injection occurs when untrusted input is concatenated into SQL and executed as code. Attackers alter queries to bypass auth, read all rows, modify data, or execute stacked commands. Prevention: parameterized queries (PreparedStatement), ORM bound parameters, input validation, least-privilege DB users, and never dynamic SQL from raw user strings.',
  whyExists:
    "Early apps built SQL with string concatenation. One crafted input like admin' OR '1'='1 turns login check into always-true. Still common in legacy code, ORM native queries, and report builders that forget binding.",
  mentalModel:
    'SQL interpreter cannot distinguish data from code if you splice strings. Parameters separate them — database treats input as literal values only. Any user-influenced fragment in SQL string is suspect.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Attack', 'Payload idea', 'Defense'],
      rows: [
        ['Auth bypass', "admin' OR '1'='1' --", 'Parameterized login query'],
        ['Union exfiltration', "' UNION SELECT credit_card FROM cards --", 'PreparedStatement; column allowlists'],
        ['Blind boolean', 'AND 1=1 vs AND 1=2 timing', 'ORM; WAF secondary only'],
        ['Second-order', 'Stored payload executed later', 'Bind on read and write paths'],
      ],
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Unsafe vs safe JDBC',
      code: `// UNSAFE — never do this
String sql = "SELECT * FROM users WHERE email = '" + email + "'";

// SAFE — PreparedStatement
PreparedStatement ps = conn.prepareStatement(
    "SELECT * FROM users WHERE email = ?");
ps.setString(1, email);

// JPA — named parameter
@Query("SELECT u FROM User u WHERE u.email = :email")
User findByEmail(@Param("email") String email);`,
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Native queries',
      text: 'JPA @Query(nativeQuery=true) with string concat is still vulnerable. Use ? or :named parameters always.',
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Search endpoint ?sort=price — if sort column concatenated into ORDER BY, attacker injects , (SELECT password FROM users). Fix: enum allowlist Map<String, Column> not raw string.',
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Prepared statements send query plan with placeholders — DB binds values separately',
        'Stored procedures can still be vulnerable if built with dynamic SQL inside',
        'ORM generates parameterized SQL for standard queries — risk at native SQL and criteria edge cases',
        'DB user should not have DROP or FILE privileges for app role',
        'WAF/rules detect patterns but do not replace parameterization',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Parameterization eliminates classic injection', 'ORM reduces raw SQL volume', 'Least privilege limits blast radius'],
    disadvantages: ['Dynamic identifiers (table/column names) need allowlists not params', 'Legacy refactor cost'],
    alternatives: ['Query builders with typed API', 'Read-only replicas for reporting with strict views'],
    whenToUse: ['Always for any user-influenced SQL fragment'],
    whenNotToUse: ['Never concatenate user input into SQL strings'],
  },
  failureModes: [
    'Native query + String.format',
    'Dynamic ORDER BY / column names unvalidated',
    'Logging full SQL with unsanitized input echoed',
    'Admin report tool with raw SQL box',
    'Second-order via stored username executed in batch job',
  ],
  production: {
    security: ['SAST rules for SQL concat', 'Code review checklist for native queries', 'App DB role read/write scoped to tables needed'],
    observability: ['Alert on SQL syntax errors spike — possible probing'],
    maintainability: ['Central repository layer — no ad hoc JDBC in controllers'],
  },
  interview: {
    expectations: ['Explain injection mechanism', 'PreparedStatement vs concat', 'ORDER BY allowlist pattern'],
    commonQuestions: ['Prevent SQL injection in Java?', 'ORM safe automatically?', 'Second-order injection?'],
    followUps: ['NoSQL injection analogy?', 'Dynamic table names?'],
    misconceptions: ['ORM makes injection impossible', 'Escaping quotes is sufficient alone'],
    traps: ['Only mentioning WAF not parameterization'],
    strongSignals: ['PreparedStatement, JPA params, allowlist dynamic identifiers, least privilege DB user'],
  },
  keyTakeaways: [
    'Never concatenate user input into SQL.',
    'Use PreparedStatement / JPA named parameters.',
    'Dynamic column/table names need allowlists not escaping.',
    'Native queries are high-risk — audit carefully.',
    'Least-privilege DB credentials limit damage.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'What is SQL injection?', answerHint: 'User input interpreted as SQL code via string concatenation — alters query semantics.' },
    { level: 'intermediate', question: 'Why PreparedStatement prevents injection?', answerHint: 'Query structure sent separately from bound values — input treated as data only.' },
    { level: 'advanced', question: 'Safe dynamic ORDER BY?', answerHint: 'Map user token to enum/allowlisted column names in code — never embed raw sort string.' },
  ],
  flashcards: [
    { front: 'SQL injection', back: 'Untrusted input becomes SQL code — use parameters' },
    { front: 'PreparedStatement', back: 'Placeholders ? — values bound separately' },
    { front: 'Second-order injection', back: 'Malicious data stored then used unsafely in later query' },
    { front: 'Dynamic identifiers', back: 'Columns/tables cannot be parameterized — use allowlist' },
  ],
  quickRevision: ['No string concat SQL', 'Use ? params', 'Allowlist ORDER BY', 'Audit native queries', 'Least privilege DB'],
}
