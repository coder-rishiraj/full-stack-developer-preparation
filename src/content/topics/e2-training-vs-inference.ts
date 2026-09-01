import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Training updates model weights via backprop on datasets. Inference runs forward pass only with frozen weights — what production APIs serve per request.',
  whyExists: 'Confusing them causes wrong SLOs, cost models, and unsafe inline learning in prod.',
  mentalModel: 'Training bakes cake once. Inference slices and serves — fast per customer.',
  howItWorks: [
    { type: 'list', items: [
      'Training: forward, loss, backward, optimizer — needs gradients.',
      'Inference: forward only; KV-cache speeds decode.',
      'Fine-tune = smaller training run; then inference deploy.',
      'Online learning needs offline pipeline not live backprop.',
    ] },
  ],
  example: [
    { type: 'paragraph', text: 'Call OpenAI API 10K times/day = inference only. Fine-tune adapter on 5K examples = training job once, then inference.' },
  ],
  tradeoffs: {
    advantages: [
      'Clear separation of cost profiles',
    ],
    disadvantages: [
      'Fine-tune still expensive vs prompt',
    ],
    alternatives: [
      'RAG instead of fine-tune',
    ],
    whenToUse: [
      'Infer for all user traffic',
    ],
    whenNotToUse: [
      'Fine-tune when few-shot+RAG enough',
    ],
  },
  failureModes: [
    'Backprop in prod',
    'Fine-tune on PII ungoverned',
    'Undersized infer GPU for context',
  ],
  production: {
    performance: [
      'KV-cache, quantization at infer',
    ],
    cost: [
      'Infer dominates ongoing spend',
    ],
    reliability: [
      'No training in request path',
    ],
  },
  interview: {
    expectations: [
      'Forward vs backward',
      'Prod = infer',
    ],
    commonQuestions: [
      'Training vs inference?',
    ],
    followUps: [
      'When fine-tune?',
    ],
    misconceptions: [
      'API calls train model',
    ],
    traps: [
      'Retrain every user msg',
    ],
    strongSignals: [
      'Frozen weights at serve',
    ],
  },
  keyTakeaways: [
    'Train updates weights',
    'Infer serves frozen model',
    'Prod is inference',
    'Fine-tune offline',
    'RAG before fine-tune',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Difference?', answerHint: 'Train learns weights; infer applies them forward-only.' },
    { level: 'intermediate', question: 'Why not online learn per user?', answerHint: 'Cost, stability, safety — offline pipeline with eval.' },
    { level: 'advanced', question: 'Memory train vs infer?', answerHint: 'Train needs activations+grads+optimizer — multiples of infer RAM.' },
  ],
  flashcards: [
    { front: 'Inference', back: 'Forward-only production serving' },
    { front: 'Fine-tuning', back: 'Additional training then frozen deploy' },
    { front: 'KV-cache', back: 'Inference optimization for autoregressive decode' },
  ],
  quickRevision: [
    'Train=learn',
    'Infer=serve',
    'Prod=infer',
    'Fine-tune offline',
    'No grad prod',
  ],
}
