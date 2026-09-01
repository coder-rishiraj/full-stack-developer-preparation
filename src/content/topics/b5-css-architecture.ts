import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'CSS architecture organizes styles at scale — methodologies (BEM, ITCSS), component-scoped CSS (CSS Modules, CSS-in-JS), design tokens, and layering to avoid specificity wars and global leakage.',
  whyExists: 'Global CSS does not scale in large teams. Without structure, !important cascades, duplicate rules, and unmaintainable selectors accumulate.',
  mentalModel: 'Layers stack: reset → tokens → utilities → components → pages. Each component owns styles; globals only for foundations.',
  howItWorks: [
    { type: 'list', items: [
      'BEM: Block__element--modifier naming avoids deep nesting',
      'CSS Modules: locally scoped class hashes at build',
      'ITCSS: inverted triangle — settings, tools, generic, elements, objects, components, utilities',
      'Design tokens as CSS variables for theme consistency',
      'Lint stylelint + forbid global tag selectors in components',
    ] },
  ],
  example: [
    { type: 'code', language: 'css', code: '/* BEM */\n.card { }\n.card__title { }\n.card--featured { }\n\n/* Token */\n:root { --color-primary: #0066cc; }', caption: 'BEM + tokens' },
  ],
  tradeoffs: {
    advantages: [
      'Predictable specificity',
      'Team parallel work',
    ],
    disadvantages: [
      'Naming ceremony',
      'CSS-in-JS runtime cost',
    ],
    alternatives: [
      'Tailwind utility-first',
      'Shadow DOM encapsulation',
    ],
    whenToUse: [
      'Large multi-team frontends',
    ],
    whenNotToUse: [
      'Single landing page',
    ],
  },
  failureModes: [
    'Global !important overrides',
    'Deep selector chains break encapsulation',
    'Duplicated token values drift',
    'CSS-in-JS bundle bloat',
  ],
  production: {
    maintainability: [
      'Document layering; enforce BEM/modules in review',
    ],
    performance: [
      'Critical CSS inline; purge unused utilities',
    ],
  },
  interview: {
    expectations: [
      'BEM basics',
      'Scoped vs global CSS',
    ],
    commonQuestions: [
      'Scale CSS in large app?',
    ],
    followUps: [
      'CSS Modules vs styled-components?',
    ],
    misconceptions: [
      'Tailwind replaces architecture entirely',
    ],
    traps: [
      'Nested .card .title .link selectors',
    ],
    strongSignals: [
      'Tokens, layers, scoped components',
    ],
  },
  keyTakeaways: [
    'Layer and scope styles',
    'BEM or CSS Modules for components',
    'Tokens for theming',
    'Avoid deep global selectors',
    'Lint and document conventions',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'BEM naming?', answerHint: 'Block__element--modifier.' },
    { level: 'intermediate', question: 'CSS Modules benefit?', answerHint: 'Local scope; no global class collisions.' },
    { level: 'advanced', question: 'ITCSS layers?', answerHint: 'Settings→utilities inverted specificity triangle.' },
  ],
  flashcards: [
    { front: 'BEM', back: 'Block__element--modifier naming convention' },
    { front: 'Design token', back: 'Named variable for color/spacing/typography' },
  ],
  quickRevision: [
    'BEM/Modules',
    'ITCSS layers',
    'CSS variables tokens',
    'No deep globals',
    'Stylelint enforce',
    'Component owns styles',
  ],
}
