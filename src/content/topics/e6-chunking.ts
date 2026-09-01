import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Chunking splits documents into retrieval-sized segments — fixed token windows, sentence boundaries, semantic splits — balancing context coherence vs embed precision.',
  whyExists: 'Whole PDF as one vector is useless blur. Too-small chunks lose context; too-large dilute relevance signal.',
  mentalModel: 'Cut textbook into study cards — each card one idea, readable alone, with overlap so sentences aren\'t amputated.',
  howItWorks: [
    { type: 'list', items: [
      'Fixed size: 512 tokens stride 128 overlap.',
      'Structure-aware: headings, paragraphs, tables separate.',
      'Semantic chunking: split when embed similarity drops.',
      'Store chunk metadata: source, page, section.',
    ] },
  ],
  example: [
    { type: 'paragraph', text: 'Policy PDF: chunk by H2 section ~400 tokens; overlap 50; table rows as own chunks with caption prefix.' },
  ],
  tradeoffs: {
    advantages: [
      'Better retrieval precision',
    ],
    disadvantages: [
      'Wrong split breaks facts across chunks',
    ],
    alternatives: [
      'Parent-child: small retrieve, large read',
    ],
    whenToUse: [
      'All RAG ingestion',
    ],
    whenNotToUse: [
      'Skip for already atomic FAQs',
    ],
  },
  failureModes: [
    'Split mid-sentence',
    'No overlap loses context',
    'Huge tables one blob',
  ],
  production: {
    reliability: [
      'Structure-aware parsers',
      'Parent doc id on each chunk',
    ],
    maintainability: [
      'Chunk params in config per doc type',
    ],
  },
  interview: {
    expectations: [
      'Size/overlap tradeoff',
      'Structure-aware',
    ],
    commonQuestions: [
      'Chunk size?',
      'Overlap why?',
    ],
    followUps: [
      'Parent-child pattern?',
    ],
    misconceptions: [
      'One size all docs',
    ],
    traps: [
      '4000 token chunks',
    ],
    strongSignals: [
      'Structure + overlap + metadata',
    ],
  },
  keyTakeaways: [
    'Split for retrieval granularity',
    'Overlap preserves boundaries',
    'Structure-aware beats naive',
    'Metadata per chunk',
    'Parent-child for context',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Why chunk?', answerHint: 'Embeddings need focused segments; whole doc vector too vague.' },
    { level: 'intermediate', question: 'Overlap purpose?', answerHint: 'Prevent facts split across chunk boundaries.' },
    { level: 'advanced', question: 'Parent-child retrieval?', answerHint: 'Retrieve small chunk; inject larger parent section to LLM.' },
  ],
  flashcards: [
    { front: 'Chunk overlap', back: 'Repeated tokens between adjacent chunks' },
    { front: 'Structure-aware', back: 'Split on headings/tables not blind token count' },
    { front: 'Parent-child', back: 'Small index chunk; large read context for LLM' },
  ],
  quickRevision: [
    'Right-size chunks',
    'Overlap edges',
    'Structure splits',
    'Chunk metadata',
    'Parent-child optional',
  ],
}
