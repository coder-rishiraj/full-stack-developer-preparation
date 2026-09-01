import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Fine-tuning adapts a pretrained LLM to a domain or task by continued training on curated examples — full fine-tune, LoRA/QLoRA adapters, or instruction tuning on prompt-response pairs.',
  whyExists: 'Base models lack company tone, domain jargon, and task format. Fine-tuning improves accuracy cheaper than giant prompts or training from scratch.',
  mentalModel: 'Expert hires intern: base model knows language; fine-tune teaches company FAQ style and JSON output format on labeled examples.',
  howItWorks: [
    { type: 'list', items: [
      'Curate high-quality prompt/completion dataset',
      'Choose method: full FT expensive; LoRA trains small adapter matrices',
      'Hyperparams: LR low, epochs few to avoid catastrophic forgetting',
      'Evaluate on held-out set + regression golden prompts',
      'Deploy adapter weights merged or sidecar',
    ] },
  ],
  example: [
    { type: 'code', language: 'python', code: '# LoRA: train rank-decomposed delta weights\n# base frozen; inject adapters in attention layers\ntrainer.train(lora_config=LoRAConfig(r=16, alpha=32))', caption: 'LoRA concept' },
  ],
  tradeoffs: {
    advantages: [
      'Better task accuracy',
      'Smaller inference prompts',
    ],
    disadvantages: [
      'Data curation cost',
      'Forgetting general skills',
    ],
    alternatives: [
      'RAG only',
      'Few-shot prompting',
    ],
    whenToUse: [
      'Stable format/tone',
      'Proprietary domain',
    ],
    whenNotToUse: [
      'Facts change daily — RAG better',
    ],
  },
  failureModes: [
    'Overfit tiny dataset',
    'Catastrophic forgetting',
    'Train/serve skew in formatting',
    'PII in training data leaked',
  ],
  production: {
    cost: [
      'LoRA/QLoRA vs full GPU weeks',
    ],
    reliability: [
      'Golden eval before promote',
      'Version adapter weights',
    ],
    security: [
      'Scrub PII from training set',
    ],
  },
  interview: {
    expectations: [
      'LoRA vs full FT',
      'When RAG vs fine-tune',
    ],
    commonQuestions: [
      'When fine-tune an LLM?',
    ],
    followUps: [
      'Catastrophic forgetting?',
    ],
    misconceptions: [
      'Fine-tune replaces RAG for facts',
    ],
    traps: [
      '100 examples overfit',
    ],
    strongSignals: [
      'Data quality, eval harness, LoRA',
    ],
  },
  keyTakeaways: [
    'Adapt pretrained model with domain data',
    'LoRA cheap adapter tuning',
    'Avoid overfit + forgetting',
    'Eval golden set before deploy',
    'RAG for facts; FT for behavior',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Fine-tune vs prompt?', answerHint: 'FT bakes behavior in weights; prompt ephemeral.' },
    { level: 'intermediate', question: 'LoRA benefit?', answerHint: 'Train small adapters; freeze base; less GPU.' },
    { level: 'advanced', question: 'FT vs RAG for docs?', answerHint: 'RAG for changing facts; FT for style/format.' },
  ],
  flashcards: [
    { front: 'LoRA', back: 'Low-rank adapter matrices on frozen base' },
    { front: 'Catastrophic forgetting', back: 'Model loses general skills after narrow FT' },
  ],
  quickRevision: [
    'Pretrained + domain data',
    'LoRA/QLoRA efficient',
    'Small LR few epochs',
    'Golden eval gate',
    'RAG vs FT split',
    'Scrub PII',
  ],
}
