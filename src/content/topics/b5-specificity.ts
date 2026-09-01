import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'CSS specificity determines which rule wins when conflicts occur — calculated from inline styles, IDs, classes/attributes, and elements, plus source order and !important.',
  whyExists: 'Cascade needs deterministic conflict resolution. Without specificity, stylesheets would be unpredictable. Understanding it prevents !important wars and debugging nightmares.',
  mentalModel: 'Score (inline, IDs, classes, elements). Higher wins; tie broken by order. !important beats non-important. Inherited properties separate from cascade winner on element.',
  howItWorks: [
    { type: 'list', items: [
      'Inline style beats stylesheet',
      '#id beats .class beats element',
      ':not() does not add; inner selector does',
      '!important inversions within layer',
      'Cascade layers @layer manage ordering explicitly (modern)',
    ] },
  ],
  example: [
    { type: 'code', language: 'css', code: "/* specificity: (0,1,0) */\n.btn { color: blue; }\n/* (0,2,0) wins */\n.nav .btn { color: white; }" },
  ],
  keyTakeaways: [
    'Avoid ID selectors in components',
    '!important is escape hatch not default',
    'Lower specificity easier to override',
    '@layer for design system ordering',
    'Specificity not inheritance',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Which wins .nav a or a.nav?', answerHint: 'Both (0,1,1) — tie, later rule in file wins.' },
    { level: 'intermediate', question: 'inline vs !important in stylesheet?', answerHint: '!important in author sheet beats normal inline; inline !important beats all.' },
    { level: 'advanced', question: 'Fix specificity wars in large app?', answerHint: 'BEM low specificity, @layer tokens, no IDs, lint max specificity.' },
  ],
  flashcards: [
    { front: 'Specificity order', back: 'inline > id > class > element' },
    { front: '!important', back: 'Beats normal rules; avoid chains' },
    { front: '@layer', back: 'Explicit cascade ordering beyond specificity' },
  ],
  quickRevision: [
    'inline id class element',
    'order ties',
    'important last resort',
    '@layer system',
    'inherit != cascade',
    'BEM low specificity',
  ],
  tradeoffs: {
    advantages: [
    'Predictable conflicts',
    ],
    disadvantages: [
    'High specificity hard to override',
    ],
    alternatives: [
    'CSS modules scoping',
    'Utility-first Tailwind',
    ],
    whenToUse: [
    'Understanding debug',
    ],
    whenNotToUse: [
    '!important as first fix',
    ],
  },
  failureModes: [
    'ID selectors block overrides',
    '!important everywhere',
    'Confusing inheritance with cascade',
  ],
  production: {
    maintainability: [
      'Stylelint max specificity; design tokens @layer',
    ],
  },
  interview: {
    expectations: [
      'Calculate specificity',
      'Avoid !important',
    ],
    commonQuestions: [
      'Why rule not applying?',
    ],
    followUps: [
      '@layer?',
    ],
    misconceptions: [
      'Later file always wins regardless',
    ],
    traps: [
      ':hover adds specificity incorrectly thought',
    ],
    strongSignals: [
      'BEM, layers, calculate (0,2,1)',
    ],
  },
}
