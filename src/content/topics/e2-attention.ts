import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Attention lets each token weigh all other tokens when building its representation. Transformers use multi-head self-attention so the model learns which context matters for each position — core of modern LLMs.',
  whyExists: 'Fixed-length RNN bottlenecks lost long-range deps. Attention provides direct paths between any two positions — enables context windows, in-context learning, and parallel training.',
  mentalModel: 'Each word asks every other word how relevant you are to me? Softmax weights blend their vectors into a new meaning-rich representation.',
  howItWorks: [
    { type: 'list', items: [
      'Q, K, V projections from input embeddings.',
      'Scores = QK^T / sqrt(d_k); softmax → attention weights.',
      'Output = weighted sum of V vectors.',
      'Multi-head: parallel heads capture different relation types.',
      'Causal mask in decoders prevents peeking at future tokens.',
    ] },
  ],
  example: [
    { type: 'paragraph', text: 'In it bank river, attention links bank to river not finance when river is nearby — contextual disambiguation via learned weights not rules.' },
  ],
  tradeoffs: {
    advantages: [
      'Long-range deps',
      'Parallelizable training',
      'Interpretable weight patterns',
    ],
    disadvantages: [
      'O(n²) memory/time in sequence length',
      'Not literal database lookup',
    ],
    alternatives: [
      'Sliding window/sparse attention',
      'RNN for tiny sequences',
    ],
    whenToUse: [
      'Default for LLM architecture understanding',
    ],
    whenNotToUse: [
      'Do not implement custom attention in app code — use APIs',
    ],
  },
  failureModes: [
    'Assuming attention weights are faithful explanations',
    'Context too long — quadratic cost blows up',
    'Confusing attention with retrieval',
  ],
  production: {
    performance: [
      'KV-cache stores past K/V at inference',
      'FlashAttention reduces memory',
    ],
    cost: [
      'Long context = more attention compute + memory',
    ],
    observability: [
      'Do not rely on attention maps for prod debugging',
    ],
  },
  interview: {
    expectations: [
      'Q/K/V intuition',
      'Why sqrt(d_k)',
      'Causal vs bidirectional',
    ],
    commonQuestions: [
      'Explain attention?',
      'Why transformers beat RNNs?',
    ],
    followUps: [
      'Multi-head purpose?',
      'Complexity vs seq length?',
    ],
    misconceptions: [
      'Attention retrieves documents',
      'Weights always explain model',
    ],
    traps: [
      'O(n) claim for full attention',
    ],
    strongSignals: [
      'QKV + softmax + quadratic cost + KV-cache',
    ],
  },
  keyTakeaways: [
    'Attention = weighted context mix per token',
    'Multi-head learns diverse relations',
    'Causal mask for autoregressive decode',
    'O(n²) in sequence length',
    'KV-cache critical for infer speed',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'What does attention do?', answerHint: 'Each token blends others weighted by relevance scores.' },
    { level: 'intermediate', question: 'Q, K, V roles?', answerHint: 'Query seeks; Key matched; Value aggregated into output.' },
    { level: 'advanced', question: 'Why O(n²)?', answerHint: 'All-pairs token scores; mitigated by cache, sparse, sliding window.' },
  ],
  flashcards: [
    { front: 'Self-attention', back: 'Tokens attend to same sequence' },
    { front: 'Causal mask', back: 'Block future tokens in decoder' },
    { front: 'KV-cache', back: 'Reuse past keys/values during generation' },
  ],
  quickRevision: [
    'QKV softmax blend',
    'Multi-head',
    'Causal decode',
    'O(n²) length',
    'KV-cache infer',
  ],
}
