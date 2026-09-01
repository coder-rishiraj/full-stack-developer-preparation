import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Context management controls what information fills the finite context window — chat history, RAG chunks, tool results, summaries — across multi-turn sessions.',
  whyExists: 'Unmanaged history exceeds limits, raises cost, and degrades quality (lost in middle). Apps need pruning, summarization, and external memory.',
  mentalModel: 'Backpack with fixed volume — pack essentials, compress clothes, leave junk behind each trip.',
  howItWorks: [
    { type: 'list', items: [
      'Sliding window: keep last N turns.',
      'Summarize older turns to compact memory.',
      'Inject fresh RAG per query not once at start.',
      'Store long-term facts in DB/vector store.',
    ] },
  ],
  example: [
    { type: 'paragraph', text: 'After 20 turns, summarize turns 1-15 to bullet memory; keep last 5 verbatim; retrieve docs per latest question.' },
  ],
  tradeoffs: {
    advantages: [
      'Stays in budget',
      'Better relevance',
    ],
    disadvantages: [
      'Summary loses detail',
      'Implementation complexity',
    ],
    alternatives: [
      'Stateless single-turn only',
    ],
    whenToUse: [
      'Multi-turn assistants',
      'Long sessions',
    ],
    whenNotToUse: [
      'Single-shot extract',
    ],
  },
  failureModes: [
    'Never pruning — truncate drops system',
    'Stale RAG from turn 1',
    'Summary hallucination in memory',
  ],
  production: {
    cost: [
      'Token budget per session',
      'Re-retrieve don\'t hoard chunks',
    ],
    reliability: [
      'Pin system + recent turns',
    ],
  },
  interview: {
    expectations: [
      'Prune vs summarize',
      'RAG refresh',
    ],
    commonQuestions: [
      'Manage long chat?',
    ],
    followUps: [
      'External memory?',
    ],
    misconceptions: [
      'Send full log always',
    ],
    traps: [
      'Static RAG entire session',
    ],
    strongSignals: [
      'Sliding window + summary + re-retrieve',
    ],
  },
  keyTakeaways: [
    'Finite window discipline',
    'Prune or summarize history',
    'Re-retrieve per query',
    'External memory for facts',
    'Protect system prompt slot',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Context management?', answerHint: 'Choose what fits in window: history, RAG, tools.' },
    { level: 'intermediate', question: 'Summarize vs drop?', answerHint: 'Summarize old for continuity; drop irrelevant; keep recent verbatim.' },
    { level: 'advanced', question: 'Long-term memory design?', answerHint: 'Extract facts to DB; embed session summaries; retrieve on intent.' },
  ],
  flashcards: [
    { front: 'Sliding window', back: 'Keep only recent N conversation turns' },
    { front: 'Conversation summary', back: 'Compress old turns to save tokens' },
    { front: 'Re-retrieval', back: 'Fresh RAG per query not one-time inject' },
  ],
  quickRevision: [
    'Window budget',
    'Prune/summarize',
    'Re-RAG each turn',
    'External memory',
    'Pin system',
  ],
}
