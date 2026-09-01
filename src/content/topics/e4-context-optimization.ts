import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Context-window optimization minimizes tokens while preserving task-critical information — compression, ranking, dedup, and prompt caching to cut cost and latency.',
  whyExists: 'Every token costs money and attention. Bloated context hurts quality and speed; optimization is mandatory at scale.',
  mentalModel: 'Edit essay to word limit — keep thesis and evidence, cut fluff, merge duplicates.',
  howItWorks: [
    { type: 'list', items: [
      'Rank chunks by relevance; top-k only.',
      'Remove duplicate/near-duplicate passages.',
      'Abbreviate tool JSON to essentials.',
      'Prompt caching: static prefix reused.',
      'Smaller embed summaries vs full docs.',
    ] },
  ],
  example: [
    { type: 'paragraph', text: '20 retrieved chunks → rerank top 5 → dedup overlapping paragraphs → 3K tokens not 15K.' },
  ],
  tradeoffs: {
    advantages: [
      'Lower cost/latency',
      'Often better focus',
    ],
    disadvantages: [
      'Aggressive cut loses needed facts',
      'Ranking errors',
    ],
    alternatives: [
      'Long-context model — expensive',
    ],
    whenToUse: [
      'Every RAG prod system',
    ],
    whenNotToUse: [
      'When eval shows cut hurts quality',
    ],
  },
  failureModes: [
    'Cut wrong chunks',
    'No eval after compression',
    'Caching stale system content',
  ],
  production: {
    cost: [
      'Measure $/query before/after opt',
      'Cache stable system',
    ],
    performance: [
      'Latency drops with fewer tokens',
    ],
  },
  interview: {
    expectations: [
      'Rank/dedup/cache',
      'Measure impact',
    ],
    commonQuestions: [
      'Optimize context window?',
    ],
    followUps: [
      'Prompt caching?',
    ],
    misconceptions: [
      'Stuff everything — bigger better',
    ],
    traps: [
      'Cut without eval',
    ],
    strongSignals: [
      'Rerank + dedup + cache + metrics',
    ],
  },
  keyTakeaways: [
    'Minimize tokens kept',
    'Rerank and dedup RAG',
    'Stable prefix caching',
    'Eval after compression',
    'Long-context is costly fallback',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Context optimization?', answerHint: 'Reduce tokens while keeping task-relevant info.' },
    { level: 'intermediate', question: 'Prompt caching?', answerHint: 'Provider discounts repeated identical prompt prefix.' },
    { level: 'advanced', question: 'Dedup strategy?', answerHint: 'Embedding similarity merge; MMR diversity; sentence-level trim.' },
  ],
  flashcards: [
    { front: 'Reranking', back: 'Reorder retrieved chunks by relevance before inject' },
    { front: 'Prompt caching', back: 'Reuse unchanged prefix tokens at lower cost' },
    { front: 'MMR', back: 'Maximal Marginal Relevance — diverse chunk selection' },
  ],
  quickRevision: [
    'Rerank top-k',
    'Dedup chunks',
    'Cache prefix',
    'Eval cuts',
    'Tokens=cost',
  ],
}
