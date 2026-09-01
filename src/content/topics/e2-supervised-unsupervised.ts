import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Supervised learning uses labeled input-output pairs. Unsupervised finds structure without labels. LLM pretraining is self-supervised — labels generated from text itself (next token).',
  whyExists: 'Label cost blocks many projects. Paradigm choice drives data pipeline, metrics, and whether prompting substitutes for training.',
  mentalModel: 'Supervised = teacher with answer key. Unsupervised = explorer clustering. LLM pretrain = predict next word — automatic labels from corpus.',
  howItWorks: [
    { type: 'list', items: [
      'Supervised: classification/regression; metrics F1, RMSE.',
      'Unsupervised: k-means, PCA, anomaly detection.',
      'Self-supervised: next-token, masked LM — GPT/BERT pretrain.',
      'RLHF: human preferences as reward after pretrain.',
    ] },
  ],
  example: [
    { type: 'paragraph', text: 'Supervised: ticket classifier on labeled data. Unsupervised: cluster tickets for themes. LLM: zero-shot classify via prompt without fine-tune labels.' },
  ],
  tradeoffs: {
    advantages: [
      'Supervised: clear metrics',
      'Unsupervised: discovery',
    ],
    disadvantages: [
      'Labels expensive',
      'Clusters may misalign business',
    ],
    alternatives: [
      'Few-shot LLM',
      'Weak supervision',
    ],
    whenToUse: [
      'Supervised when labels reliable',
      'Unsupervised for exploration',
    ],
    whenNotToUse: [
      'Supervised with 50 noisy labels only',
    ],
  },
  failureModes: [
    'Label leakage',
    'Forced cluster meaning',
    'Mass labeling before trying prompts',
  ],
  production: {
    cost: [
      'Active learning reduces label spend',
    ],
    reliability: [
      'Track label drift',
    ],
  },
  interview: {
    expectations: [
      'Define both',
      'Self-supervised link',
    ],
    commonQuestions: [
      'Supervised vs unsupervised?',
    ],
    followUps: [
      'How GPT trains?',
    ],
    misconceptions: [
      'Human label per token',
    ],
    traps: [
      '1M labels before prompt',
    ],
    strongSignals: [
      'Prompt → few-shot → fine-tune ladder',
    ],
  },
  keyTakeaways: [
    'Supervised needs labels',
    'Unsupervised finds structure',
    'LLM pretrain self-supervised',
    'RLHF adds preferences',
    'Try prompt before mass label',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Supervised vs unsupervised?', answerHint: 'Labeled pairs vs unlabeled pattern finding.' },
    { level: 'intermediate', question: 'GPT pretraining paradigm?', answerHint: 'Self-supervised next-token on corpus.' },
    { level: 'advanced', question: 'Unsupervised then supervised?', answerHint: 'Cluster/embed, label representatives, train classifier.' },
  ],
  flashcards: [
    { front: 'Self-supervised', back: 'Labels from data itself — next token' },
    { front: 'Supervised', back: 'Learn mapping from labeled examples' },
    { front: 'RLHF', back: 'Human preferences tune model post-pretrain' },
  ],
  quickRevision: [
    'Supervised=labels',
    'Unsupervised=clusters',
    'LLM=self-supervised',
    'RLHF',
    'Prompt first',
  ],
}
