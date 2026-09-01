import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Not every read benefits from caching. Skip cache when: data must be strongly consistent (ledger balance without versioning), highly volatile (live auction bid), personalized secrets, low reuse (unique search queries), write-heavy with constant invalidation, or dataset larger than memory with no hot subset.',
  whyExists:
    'Caching adds complexity, staleness bugs, and Redis cost. Wrong cache layer wastes memory and increases latency (serialize + network for cold keys). Knowing when to skip cache is as important as cache-aside patterns in interviews.',
  mentalModel:
    'Cache if read:write ratio high, staleness tolerable, key reuse high, object fits memory. If every read unique or must be fresh, go to DB with proper indexes instead. Sometimes read replica beats cache for moderate staleness.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Scenario', 'Why skip cache', 'Alternative'],
      rows: [
        ['Bank balance (strong)', 'Stale balance unacceptable', 'DB with row lock or serializable txn'],
        ['Real-time inventory flash sale', 'Invalidation cannot keep pace', 'DB pessimistic lock + queue'],
        ['Audit log append', 'Write-heavy, no reuse', 'Direct write optimized store'],
        ['Random long-tail search', 'Zero hit rate', 'Search index (Elasticsearch)'],
        ['PII per request unique', 'Risk + no benefit', 'Do not cache or encrypt isolated keys'],
        ['Already fast indexed PK lookup', 'Cache overhead > DB', 'Tune DB connection pool'],
      ],
    },
    {
      type: 'list',
      items: [
        'Measure hit rate — disable cache below threshold (e.g., <80% for hot path)',
        'Negative cache only when repeated misses prove key absent',
        'CDN for static assets; do not double-cache huge blobs in Redis',
        'Transactional reads after own write — bypass cache read-your-writes',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Order status right after checkout: user expects PAID immediately — bypass cache on GET /orders/{id} for 30s after create or use version check. Product catalog static fields still cached with 10m TTL.',
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Cache pollution: one-off keys fill Redis evicting hot keys',
        'Consistency tax: invalidation fan-out may exceed DB read cost for cold data',
        'ORM lazy load + cache graph — over-caching entity graphs bloats memory',
        'Multi-tenant noisy neighbor — unbounded per-tenant keys',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Simpler correctness', 'Lower Redis cost', 'Avoid false confidence from low hit rate'],
    disadvantages: ['Higher DB load if decision wrong', 'Miss optimization opportunity on hot paths'],
    alternatives: ['Read replica', 'Materialized view', 'Edge CDN for public static'],
    whenToUse: ['Skip decision during design review per endpoint', 'Re-evaluate with metrics'],
    whenNotToUse: ['Skipping cache on obviously hot catalog reads without measurement'],
  },
  failureModes: [
    'Cached financial data with TTL only — regulatory issue',
    'Caching security-sensitive per-user data under wrong key',
    'Low hit rate cache still maintained — ops burden',
    'Double caching L1+L2+CDN without coherence story',
  ],
  production: {
    performance: ['A/B hit rate monitoring per endpoint', 'Remove cache layer if miss > threshold'],
    cost: ['Redis memory saved by not caching cold keys'],
    maintainability: ['Document no-cache endpoints and rationale'],
    observability: ['Hit rate dashboards drive cache on/off decisions'],
  },
  interview: {
    expectations: ['List anti-patterns', 'Strong consistency cases', 'Hit rate reasoning'],
    commonQuestions: ['When not use cache?', 'Cache inventory during sale?', 'Personalized feed cache?'],
    followUps: ['Read replica vs cache?', 'Cache financial data ever?'],
    misconceptions: ['Always cache everything for scale', 'Cache fixes slow queries without indexes'],
    traps: ['Caching account balance with 5m TTL'],
    strongSignals: ['Hit rate, consistency requirements, read-your-writes bypass, cost awareness'],
  },
  keyTakeaways: [
    'Skip cache for strong consistency, volatile, or unique low-reuse reads.',
    'Measure hit rate — remove cache that does not pay off.',
    'Do not cache secrets or highly personalized data without strict keys.',
    'Read replicas or indexes may beat cache for moderate freshness needs.',
    'Bypass cache for read-your-writes after mutation.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'When should you avoid caching?', answerHint: 'Low reuse, strong consistency needs, volatile data, write-heavy with constant invalidation.' },
    { level: 'intermediate', question: 'Cache flash sale inventory?', answerHint: 'Risky — stale oversell; prefer DB locks, reservation queue, short-lived holds not long TTL cache.' },
    { level: 'advanced', question: 'How decide cache vs read replica?', answerHint: 'Replica: moderate staleness acceptable, simpler; cache: extreme read QPS hot keys with TTL+invalidation and hit rate proof.' },
  ],
  flashcards: [
    { front: 'Low hit rate', back: 'Signal cache may not be worth complexity and memory' },
    { front: 'Strong consistency', back: 'Usually skip cache or use versioning/read-your-writes bypass' },
    { front: 'Cache pollution', back: 'One-off keys evict hot data — hurts overall hit rate' },
    { front: 'Read-your-writes', back: 'After write, bypass cache or use version check on read' },
  ],
  quickRevision: ['Not always cache', 'Check hit rate', 'Strong consistency skip', 'Volatile data skip', 'Fix indexes first'],
}
