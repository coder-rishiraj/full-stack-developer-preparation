import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Caching in production LLM systems stores repeated prompt prefixes, embeddings, retrieval results, and final responses to cut latency and token cost.',
  whyExists: 'Same system prompt, FAQ queries, and doc chunks repeat. Re-embedding and re-calling frontier models on every hit wastes money and slows UX.',
  mentalModel: 'Memoize expensive function calls — same question + same KB version → serve cached answer if policy allows.',
  howItWorks: [
    { type: 'list', items: [
      'Provider prompt caching: stable system prefix discounted.',
      'Embedding cache: hash(text) → vector in Redis.',
      'Semantic cache: embed query, nearest neighbor in cache index.',
      'Retrieval cache: query hash + index version → chunk ids.',
      'TTL and invalidation on doc/model version change.',
    ] },
  ],
  example: [
    { type: 'paragraph', text: 'FAQ bot: Redis semantic cache on normalized question embedding; hit rate 40% cuts cost 35%. Miss → full RAG path; store on success with 24h TTL.' },
  ],
  tradeoffs: {
    advantages: [
      'Lower latency and cost',
      'Reduced provider load',
    ],
    disadvantages: [
      'Stale answers if TTL wrong',
      'Cache key design errors',
    ],
    alternatives: [
      'No cache — simpler',
      'CDN for static completions only',
    ],
    whenToUse: [
      'Repeated queries, stable KB',
    ],
    whenNotToUse: [
      'Personalized real-time data always fresh',
    ],
  },
  failureModes: [
    'Serve stale policy after KB update',
    'Cache PII in shared key',
    'No version in cache key',
  ],
  production: {
    cost: [
      'Track cache hit rate and $ saved',
    ],
    performance: [
      'Redis cluster for embed cache',
    ],
    reliability: [
      'Include index_version in keys',
    ],
  },
  interview: {
    expectations: [
      'Prompt vs semantic cache',
      'Invalidation',
    ],
    commonQuestions: [
      'Cache LLM responses safely?',
    ],
    followUps: [
      'Semantic cache design?',
    ],
    misconceptions: [
      'Cache forever',
    ],
    traps: [
      'Key without tenant id',
    ],
    strongSignals: [
      'Versioned keys + TTL + hit metrics',
    ],
  },
  keyTakeaways: [
    'Cache prefix, embeds, retrieval, responses',
    'Version in cache key',
    'Semantic cache for FAQs',
    'Invalidate on KB change',
    'Never cache cross-tenant',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'What to cache in LLM stack?', answerHint: 'Prompt prefix, embeddings, retrieval sets, idempotent FAQ answers.' },
    { level: 'intermediate', question: 'Semantic cache?', answerHint: 'Embed query; if similar cached Q above threshold return stored answer.' },
    { level: 'advanced', question: 'Invalidation strategy?', answerHint: 'index_version + model_id in key; purge on ingest; short TTL for volatile data.' },
  ],
  flashcards: [
    { front: 'Prompt caching', back: 'Provider discount on repeated identical prefix tokens' },
    { front: 'Semantic cache', back: 'Similar questions map to prior answers via embedding NN' },
    { front: 'Cache key versioning', back: 'Include KB/model version to avoid stale answers' },
  ],
  quickRevision: [
    'Prefix+embed cache',
    'Semantic FAQ',
    'Version keys',
    'TTL invalidate',
    'Per-tenant keys',
  ],
}
