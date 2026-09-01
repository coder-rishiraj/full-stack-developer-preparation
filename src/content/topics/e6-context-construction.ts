import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Context construction assembles retrieved chunks, metadata, and instructions into the final LLM prompt — ordering, dedup, citation tags, and token budget fit.',
  whyExists: 'Raw top-k dump causes duplication, wrong order, and overflow. Quality of assembled context drives answer accuracy.',
  mentalModel: 'Build briefing packet for expert — highlight key excerpts in logical order with source labels under page limit.',
  howItWorks: [
    { type: 'list', items: [
      'Rerank retrieved chunks.',
      'Dedup overlapping text.',
      'Format: [id] source excerpt per chunk.',
      'Truncate lowest scores to fit token budget.',
      'Place most relevant near prompt edges.',
    ] },
  ],
  example: [
    { type: 'code', language: 'text', code: '<context>\n[doc-12] Returns accepted within 30 days...\n[doc-7] Refunds process in 5-7 business days...\n</context>', caption: 'Context block' },
  ],
  tradeoffs: {
    advantages: [
      'Higher answer quality',
      'Traceable citations',
    ],
    disadvantages: [
      'Assembly latency',
      'Formatting uses tokens',
    ],
    alternatives: [
      'Minimal join with newlines only',
    ],
    whenToUse: [
      'Every RAG answer path',
    ],
    whenNotToUse: [
      'Skip citations only in internal tools',
    ],
  },
  failureModes: [
    'Random chunk order',
    'Duplicate paragraphs confuse model',
    'Exceed budget mid-build',
  ],
  production: {
    reliability: [
      'Deterministic assembly template',
      'Log included chunk ids',
    ],
    cost: [
      'Token budget allocator',
    ],
  },
  interview: {
    expectations: [
      'Rerank dedup format',
      'Citation ids',
    ],
    commonQuestions: [
      'Build RAG context how?',
    ],
    followUps: [
      'Lost in middle mitigation?',
    ],
    misconceptions: [
      'Concat top-k enough',
    ],
    traps: [
      'No source ids',
    ],
    strongSignals: [
      'Tagged chunks + rerank + budget',
    ],
  },
  keyTakeaways: [
    'Assemble don\'t dump',
    'Rerank and dedup',
    'Citation tags per chunk',
    'Fit token budget',
    'Key info at edges',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Context construction?', answerHint: 'Format and order retrieved chunks into LLM prompt.' },
    { level: 'intermediate', question: 'Citation format?', answerHint: 'Stable chunk ids model must reference in answer.' },
    { level: 'advanced', question: 'Lost in the middle fix?', answerHint: 'Put best chunks first/last; summarize middle; reduce total.' },
  ],
  flashcards: [
    { front: 'Context assembly', back: 'Prompt-ready formatted retrieval set' },
    { front: 'Chunk citation id', back: 'Stable reference for grounding claims' },
    { front: 'Token budget fit', back: 'Drop lowest rank chunks until under limit' },
  ],
  quickRevision: [
    'Rerank+dedup',
    'Tag sources',
    'Budget fit',
    'Template assembly',
    'Edges for key facts',
  ],
}
