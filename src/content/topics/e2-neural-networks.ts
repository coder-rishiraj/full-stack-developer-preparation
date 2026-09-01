import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Neural networks stack layers of weighted neurons with nonlinear activations. Training adjusts weights via backprop and gradient descent to minimize loss — foundation of deep learning and LLMs.',
  whyExists: 'Hand-crafted features fail on vision/NLP complexity. NNs learn hierarchical representations — edges → shapes → objects; tokens → syntax → semantics.',
  mentalModel: 'Adjustable pipeline of matrix multiplies + nonlinearities. Loss measures error; backprop tells each knob which way to turn.',
  howItWorks: [
    { type: 'list', items: [
      'Input → hidden layers → output; weights and biases per layer.',
      'Activation (ReLU, GELU) enables non-linear decision boundaries.',
      'Forward pass computes prediction; loss compares to target.',
      'Backprop computes gradients; optimizer (Adam) updates weights.',
      'LLMs are deep nets — transformer blocks instead of dense layers.',
    ] },
  ],
  example: [
    { type: 'paragraph', text: 'Binary spam classifier: embedding layer → two hidden ReLU layers → sigmoid output. LLM scales same idea to billions of params and next-token loss.' },
  ],
  tradeoffs: {
    advantages: [
      'Universal approximators',
      'GPU parallelizable',
      'Transfer learning',
    ],
    disadvantages: [
      'Need data and compute',
      'Black-box interpretability',
      'Overfit small data',
    ],
    alternatives: [
      'Classical ML on good features',
      'Rules for tiny domains',
    ],
    whenToUse: [
      'Complex perception/language tasks',
    ],
    whenNotToUse: [
      '100-row tabular with strong features',
    ],
  },
  failureModes: [
    'Overfit without val set',
    'Vanishing gradients in deep unnormalized nets',
    'Data leakage inflates metrics',
  ],
  production: {
    performance: [
      'Inference quantization',
      'Batch GPU kernels',
    ],
    cost: [
      'Train once serve many — inference dominates',
    ],
    observability: [
      'Track prediction drift not just loss',
    ],
  },
  interview: {
    expectations: [
      'Forward/backward intuition',
      'Activation purpose',
      'Overfit',
    ],
    commonQuestions: [
      'How NNs learn?',
      'Backprop in one sentence?',
    ],
    followUps: [
      'Why nonlinearity?',
      'LLM relation?',
    ],
    misconceptions: [
      'NNs simulate brains literally',
      'More layers always helps',
    ],
    traps: [
      'Cannot explain gradient descent',
    ],
    strongSignals: [
      'Loss + backprop + generalization',
    ],
  },
  keyTakeaways: [
    'Layers of weighted transforms + activations',
    'Train via loss minimization/backprop',
    'LLMs are large NNs',
    'Need data/compute',
    'Watch overfit and drift',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'How NN learns?', answerHint: 'Forward pass, loss, backprop gradients, weight updates.' },
    { level: 'intermediate', question: 'Why activation functions?', answerHint: 'Without nonlinearity stacked linear layers collapse to one linear map.' },
    { level: 'advanced', question: 'Overfitting signs?', answerHint: 'Train loss down val loss up; fix dropout, data, early stop, regularize.' },
  ],
  flashcards: [
    { front: 'Backprop', back: 'Chain rule to compute gradients for weight updates' },
    { front: 'Activation', back: 'Nonlinearity enabling complex boundaries' },
    { front: 'Overfitting', back: 'Memorizes train set; poor generalization' },
  ],
  quickRevision: [
    'Layers+activations',
    'Loss+backprop',
    'LLM=big NN',
    'Val set',
    'Overfit watch',
  ],
}
