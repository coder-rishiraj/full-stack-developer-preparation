import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Transformers are neural architectures using self-attention and feed-forward blocks stacked deeply. Encoder-only (BERT), decoder-only (GPT), encoder-decoder (T5) variants power modern NLP and LLMs.',
  whyExists: 'Replaced RNNs for parallel training and long-range context. Foundation of GPT-class generative models and embedding encoders.',
  mentalModel: 'Stack of attention layers where every token talks to every other token, plus MLP per token — repeated 12–100+ times.',
  howItWorks: [
    { type: 'list', items: [
      'Token embed + positional info → transformer blocks.',
      'Each block: multi-head attention + FFN + layer norm + residuals.',
      'Decoder-only: causal mask for left-to-right generation.',
      'Pretrain on massive text; align with RLHF/instruction tuning.',
    ] },
  ],
  example: [
    { type: 'paragraph', text: 'GPT: decoder-only transformer predicts next token. RAG embedder may use encoder-only transformer pooling to chunk vectors.' },
  ],
  tradeoffs: {
    advantages: [
      'Parallel train',
      'Scales with data/compute',
      'Transfer learning',
    ],
    disadvantages: [
      'Quadratic attention cost',
      'Huge models expensive',
    ],
    alternatives: [
      'SSM/Mamba for long seq research',
    ],
    whenToUse: [
      'Default LLM mental model',
    ],
    whenNotToUse: [
      'Do not build custom transformer for app — use APIs',
    ],
  },
  failureModes: [
    'Assuming encoder=decoder behavior',
    'Ignoring positional encoding limits',
  ],
  production: {
    performance: [
      'Use provider optimized inference',
    ],
    cost: [
      'Right-size model tier',
    ],
  },
  interview: {
    expectations: [
      'Attention + blocks',
      'Encoder vs decoder',
    ],
    commonQuestions: [
      'What is a transformer?',
    ],
    followUps: [
      'GPT architecture type?',
    ],
    misconceptions: [
      'Transformer retrieves docs',
    ],
    traps: [
      'RNN better for long text today',
    ],
    strongSignals: [
      'Decoder-only GPT',
      'Self-attention stack',
    ],
  },
  keyTakeaways: [
    'Self-attention core',
    'Encoder/decoder/dec-only variants',
    'GPT is decoder-only',
    'Scales to LLMs',
    'Use APIs not custom stack',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Transformer key mechanism?', answerHint: 'Multi-head self-attention plus FFN blocks.' },
    { level: 'intermediate', question: 'GPT variant?', answerHint: 'Decoder-only causal transformer.' },
    { level: 'advanced', question: 'Why beat RNNs?', answerHint: 'Parallel training, direct long-range deps, better scaling.' },
  ],
  flashcards: [
    { front: 'Decoder-only', back: 'Causal GPT-style autoregressive generation' },
    { front: 'Transformer block', back: 'Attention + FFN + residuals + layer norm' },
    { front: 'Encoder-only', back: 'Bidirectional — embeddings/classification' },
  ],
  quickRevision: [
    'Attention stacks',
    'GPT=decoder-only',
    'Parallel train',
    'O(n²) attention',
    'API not DIY',
  ],
}
