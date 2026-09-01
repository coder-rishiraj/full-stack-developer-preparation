import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Design system is shared library of UI components, tokens, patterns, and documentation ensuring consistent look, accessibility, and dev speed across products.',
  whyExists: 'Without system, each team reinvents buttons/modals; UX inconsistent; a11y gaps repeat. Central system reduces duplication and drift.',
  mentalModel: 'LEGO kit: tokens = block sizes/colors; components = standard bricks; docs = assembly guide; consumers compose screens from kit.',
  howItWorks: [
    { type: 'list', items: [
      'Foundation: color, typography, spacing tokens',
      'Primitive components: Button, Input, Dialog with variants',
      'Composition patterns: forms, navigation documented',
      'Storybook/Chromatic for visual regression',
      'Semantic versioning + migration guides for breaking changes',
    ] },
  ],
  example: [
    { type: 'code', language: 'tsx', code: '<Button variant="primary" size="md" disabled={loading}>\n  Submit\n</Button>', caption: 'Token-driven component API' },
  ],
  tradeoffs: {
    advantages: [
      'Consistency',
      'Faster delivery',
      'Central a11y fixes',
    ],
    disadvantages: [
      'Upfront investment',
      'Governance overhead',
    ],
    alternatives: [
      'Ad-hoc component copy-paste',
      'Third-party UI kit only',
    ],
    whenToUse: [
      'Multi-product orgs',
      'Brand-critical apps',
    ],
    whenNotToUse: [
      'One-off prototype',
    ],
  },
  failureModes: [
    'System ignored — teams fork components',
    'Breaking change without codemod',
    'Tokens diverge from Figma',
    'Over-abstracted API unusable',
  ],
  production: {
    maintainability: [
      'RFC process for new components',
      'Deprecation policy',
    ],
    observability: [
      'Track adoption metrics per package version',
    ],
    cost: [
      'Shared CI for visual diff',
    ],
  },
  interview: {
    expectations: [
      'Tokens + components + docs',
      'Versioning strategy',
    ],
    commonQuestions: [
      'Build vs buy design system?',
    ],
    followUps: [
      'Prevent drift?',
    ],
    misconceptions: [
      'Just a component library',
    ],
    traps: [
      'No a11y in primitives',
    ],
    strongSignals: [
      'Storybook, semver, token pipeline from Figma',
    ],
  },
  keyTakeaways: [
    'Tokens + components + guidelines',
    'Storybook for docs/visual test',
    'Semver and migration paths',
    'Governance prevents drift',
    'a11y baked into primitives',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Design system parts?', answerHint: 'Tokens, components, patterns, documentation.' },
    { level: 'intermediate', question: 'Prevent team drift?', answerHint: 'Lint against raw HTML; package adoption metrics.' },
    { level: 'advanced', question: 'Breaking button API change?', answerHint: 'Major semver; codemod; dual export deprecation period.' },
  ],
  flashcards: [
    { front: 'Design token', back: 'Single source for visual primitive values' },
    { front: 'Storybook', back: 'Interactive catalog and visual test hub' },
  ],
  quickRevision: [
    'Tokens foundation',
    'Variant components',
    'Storybook docs',
    'Semver migrations',
    'a11y in primitives',
    'Governance RFC',
  ],
}
