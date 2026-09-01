import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Tokenization splits raw text into subword token IDs the model vocabulary understands. BPE/WordPiece merge frequent pairs — balances unknown words vs sequence length.',
  whyExists: 'Models operate on integers not UTF-8 chars. Subword tokenization handles rare words, multilingual text, and code without huge vocabularies.',
  mentalModel: 'Custom compression alphabet. Common words = one token; rare words = several pieces. Same string can tokenize differently per model.',
  howItWorks: [
    { type: 'list', items: [
      'BPE: iteratively merge frequent byte pairs.',
      'WordPiece/SentencePiece variants per model family.',
      'Special tokens: <|endoftext|>, tool markers.',
      'tiktoken/OpenAI encodings differ from Llama.',
      'Decode: IDs → text may differ slightly from input whitespace.',
    ] },
  ],
  example: [
    { type: 'code', language: 'python', code: 'import tiktoken\nenc = tiktoken.encoding_for_model("gpt-4o")\nids = enc.encode("Refund policy: 30 days")\nprint(len(ids))', caption: 'Count tokens before API call' },
  ],
  tradeoffs: {
    advantages: [
      'Handles OOV via subwords',
      'Efficient vocab size',
    ],
    disadvantages: [
      'Model-specific — not portable counts',
      'Surprising splits affect cost',
    ],
    alternatives: [
      'Char-level (long sequences)',
      'Word-level (huge vocab)',
    ],
    whenToUse: [
      'Always count tokens pre-call',
    ],
    whenNotToUse: [
      'Never assume chars/4 rule in billing',
    ],
  },
  failureModes: [
    'Wrong tokenizer for model',
    'Unicode normalization surprises',
    'Prompt injection via special tokens',
  ],
  production: {
    cost: [
      'Pre-count tokens in middleware',
    ],
    reliability: [
      'Use provider tokenizer library',
    ],
  },
  interview: {
    expectations: [
      'BPE intuition',
      'Model-specific',
    ],
    commonQuestions: [
      'What is tokenization?',
    ],
    followUps: [
      'Why subword?',
    ],
    misconceptions: [
      'Tokens = words',
    ],
    traps: [
      'chars/4 for all languages',
    ],
    strongSignals: [
      'tiktoken per model',
      'special tokens awareness',
    ],
  },
  keyTakeaways: [
    'Text → subword IDs',
    'BPE/WordPiece common',
    'Per-model tokenizer',
    'Count before API',
    'Special tokens exist',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Why tokenize?', answerHint: 'Model maps fixed vocab IDs; subwords handle rare text.' },
    { level: 'intermediate', question: 'BPE idea?', answerHint: 'Merge frequent pairs into larger tokens iteratively.' },
    { level: 'advanced', question: 'Same string different token counts?', answerHint: 'Different models/vocabs/encodings — always use matching tokenizer.' },
  ],
  flashcards: [
    { front: 'BPE', back: 'Byte Pair Encoding — merge frequent substrings' },
    { front: 'Special tokens', back: 'Reserved IDs for boundaries, tools, padding' },
    { front: 'tiktoken', back: 'OpenAI tokenizer library for accurate counts' },
  ],
  quickRevision: [
    'Subword IDs',
    'BPE merges',
    'Per-model',
    'Count pre-call',
    'Special tokens',
  ],
}
