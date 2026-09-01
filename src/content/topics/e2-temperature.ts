import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Temperature scales logits before softmax during sampling. Low temperature (→0) = greedy/deterministic likely tokens. High temperature = flatter distribution = more random creative outputs.',
  whyExists: 'Same prompt must produce stable JSON at temp 0 and varied marketing copy at temp 0.9. Controls creativity vs reproducibility tradeoff.',
  mentalModel: 'Dice bias knob. Low temp: almost always pick best word. High temp: give unlikely words a chance — wilder sentences.',
  howItWorks: [
    { type: 'list', items: [
      'logits divided by T; softmax → probabilities.',
      'T→0 approaches argmax (greedy). T=1 original distribution.',
      'top_p nucleus sampling often paired — truncate tail mass.',
      'Structured outputs: low temp + schema constraint.',
    ] },
  ],
  example: [
    { type: 'paragraph', text: 'API extraction temp=0 for stable JSON fields. Brainstorm slogans temp=0.8. Same model, different sampling policy per use case.' },
  ],
  tradeoffs: {
    advantages: [
      'Tune creativity per task',
      'Cheap runtime knob',
    ],
    disadvantages: [
      'High temp increases hallucination risk',
      'Not substitute for grounding',
    ],
    alternatives: [
      'top_p, top_k sampling',
      'Multiple samples + vote',
    ],
    whenToUse: [
      'Low: extraction, code, tools',
      'Higher: brainstorming copy',
    ],
    whenNotToUse: [
      'High temp for factual compliance answers',
    ],
  },
  failureModes: [
    'High temp on financial facts',
    'Expecting temp 0 to fix hallucination',
    'Ignoring top_p interaction',
  ],
  production: {
    reliability: [
      'Default low temp for structured paths',
      'Document temp per endpoint',
    ],
    observability: [
      'Log sampling params with requests',
    ],
  },
  interview: {
    expectations: [
      'Math intuition',
      'When low vs high',
    ],
    commonQuestions: [
      'What is temperature?',
    ],
    followUps: [
      'top_p vs temperature?',
    ],
    misconceptions: [
      'Temp fixes hallucination',
    ],
    traps: [
      'High temp for JSON API',
    ],
    strongSignals: [
      'Temp 0 + schema for extract',
      'top_p pairing',
    ],
  },
  keyTakeaways: [
    'Scales logits before softmax',
    'Low = deterministic',
    'High = creative/random',
    'Pair with top_p',
    'Low for structured factual tasks',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Temperature effect?', answerHint: 'Lower = peaked distribution, more deterministic.' },
    { level: 'intermediate', question: 'JSON extraction setting?', answerHint: 'Low temp (0–0.2) plus schema/structured output.' },
    { level: 'advanced', question: 'top_p vs temperature?', answerHint: 'Temp scales all logits; top_p cuts low-prob tail dynamically.' },
  ],
  flashcards: [
    { front: 'Temperature 0', back: 'Near-greedy most likely token' },
    { front: 'top_p', back: 'Sample from smallest set covering p probability mass' },
    { front: 'High temperature', back: 'More random diverse outputs' },
  ],
  quickRevision: [
    'Scale logits',
    'Low=deterministic',
    'High=creative',
    'top_p pair',
    'Low for JSON',
  ],
}
