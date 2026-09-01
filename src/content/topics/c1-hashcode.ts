import type { TopicContent } from '@/domain/types'

export const hashCodeContent: TopicContent = {
  whatIsIt:
    'hashCode() returns a 32-bit int hash for an object. Hash-based structures (HashMap, HashSet, Hashtable) use it to choose a bucket; equals() resolves collisions within the bucket.',
  whyExists:
    'Without hashing, map lookup devolves to scanning all entries. A stable, well-distributed hashCode spreads keys across buckets for average O(1) access while tolerating collisions via equals.',
  mentalModel:
    'hashCode is a cheap fingerprint — collisions are normal. equals is the judge of true equality. Contract: if a.equals(b), then a.hashCode() == b.hashCode(). The converse is not required.',
  howItWorks: [
    {
      type: 'paragraph',
      text: 'HashMap applies an internal spread function on hashCode before modulo bucket length. Poor distribution (e.g., always 1) creates long chains and defeats the hash table.',
    },
    {
      type: 'list',
      items: [
        'Include all fields used in equals (or record components).',
        'Use Objects.hash(field1, field2, …) or 31× polynomial (Effective Java).',
        'Cache hash if object is immutable and hashing is hot (e.g., String caches hash).',
        'Do not use hashCode for security (tokens) — use secure random or MessageDigest.',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Manual hashCode consistent with equals',
      code: `@Override
public int hashCode() {
  return Objects.hash(amount, currency);
}

@Override
public boolean equals(Object o) {
  if (this == o) return true;
  if (!(o instanceof Money that)) return false;
  return amount == that.amount && currency.equals(that.currency);
}`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Collision illustration — unequal objects may share hash',
      code: `System.out.println("Aa".hashCode()); // 2112
System.out.println("BB".hashCode()); // 2112 — different strings, same hash
// HashMap still works: equals disambiguates in bucket`,
    },
  ],
  internals: [
    {
      type: 'table',
      headers: ['Type', 'hashCode behavior'],
      rows: [
        ['String', 'Cached polynomial on char values'],
        ['Integer/Long', 'Value itself (Long mixes high/low bits)'],
        ['Array', 'System.identityHashCode — NOT content-based unless Arrays.hashCode'],
        ['Enum', 'ordinal (stable per constant)'],
        ['Record', 'Auto from components via Objects.hash'],
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Arrays as keys',
      text: 'int[] uses identity hashCode by default. Two arrays with same contents are unequal keys unless you wrap with Arrays.hashCode-based key or use content-based structure.',
    },
  ],
  complexity: {
    average: 'O(1) bucket lookup with good spread',
    worst: 'O(n) if every key collides in one bucket',
    notes: 'hashCode quality directly affects HashMap performance, not correctness.',
  },
  tradeoffs: {
    advantages: [
      'Enables fast hash-based collections',
      'Cheap to compute for immutable values',
    ],
    disadvantages: [
      '32-bit space → birthday collisions inevitable at scale',
      'Must evolve with equals fields — versioning risk',
      'Not cryptographic',
    ],
    alternatives: [
      'Identity hash (System.identityHashCode) for object identity maps',
      'External perfect hashing for static key sets',
      'TreeMap when ordering matters more than O(1)',
    ],
    whenToUse: [
      'Any type used as HashMap/HashSet key',
      'Dedup and frequency counting',
    ],
    whenNotToUse: [
      'Security-sensitive equality (passwords, tokens)',
      'When only identity matters (use IdentityHashMap)',
    ],
  },
  failureModes: [
    'equals overridden without hashCode → duplicates in HashSet, “lost” HashMap gets.',
    'Including mutable fields → hash bucket drift after insert.',
    'Using hashCode % n manually without spread — poor distribution with power-of-two tables.',
    'Assuming hashCode uniqueness → logic bugs on collision.',
    'Arrays as keys without content hashing.',
  ],
  interview: {
    expectations: [
      'Recite equals/hashCode contract',
      'Explain collision handling in HashMap',
      'Implement or describe Objects.hash approach',
    ],
    commonQuestions: [
      'What is the contract between equals and hashCode?',
      'Can two unequal objects have the same hashCode?',
      'Why do we use 31 in hashCode formulas?',
    ],
    followUps: [
      'How does String hashCode work?',
      'Impact of bad hashCode on performance?',
    ],
    misconceptions: [
      'hashCode must be unique',
      'hashCode replaces equals for lookup',
      'Changing hashCode fields is safe if equals unchanged',
    ],
    traps: ['Returning constant hashCode from laziness — turns HashMap into linked list'],
    strongSignals: [
      'Says collisions OK, equals disambiguates',
      'Mentions all equals fields in hashCode',
      'Warns about mutable keys',
    ],
  },
  keyTakeaways: [
    'equal objects ⇒ equal hash codes (required).',
    'Unequal objects may share hash codes (collisions OK).',
    'hashCode picks bucket; equals confirms match.',
    'Include same fields as equals; prefer Objects.hash or records.',
    'Never use hashCode for security; arrays need special care.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'If a.equals(b) is true, what must hold for hashCode?',
      answerHint: 'a.hashCode() == b.hashCode().',
    },
    {
      level: 'intermediate',
      question: 'What happens if you override equals but not hashCode?',
      answerHint: 'HashMap/HashSet break — duplicates, failed lookups.',
    },
    {
      level: 'advanced',
      question: 'Why multiply by 31 in classic hashCode?',
      answerHint: 'Odd prime reduces collisions; shift-add compiles efficiently (i * 31 = (i<<5)-i).',
    },
  ],
  flashcards: [
    { front: 'equals/hashCode contract direction', back: 'equals ⇒ same hashCode; converse false' },
    { front: 'HashMap uses hashCode for', back: 'Bucket index; equals for chain match' },
    { front: 'Arrays as HashMap keys', back: 'Identity hash by default — use wrapper or Arrays.hashCode' },
  ],
  quickRevision: [
    'hashCode → bucket; equals → match in chain',
    'Equal ⇒ same hash; collisions OK',
    'Override both together',
    'Objects.hash or record',
    'Immutable keys only in hash maps',
    '31× polynomial classic pattern',
    'Not for crypto/security',
  ],
}

export const content = hashCodeContent
