import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Responsive design adapts layout and typography across viewport sizes — fluid grids, flexible images, breakpoints, and mobile-first CSS.',
  whyExists: 'Devices range from 320px phones to ultrawide monitors. Separate m.sites duplicated work; responsive single codebase scales with media queries and fluid units.',
  mentalModel: 'Mobile-first: base styles for small; min-width media queries add complexity. Use relative units (rem, %, fr), max-width on images, container queries for component-level adaptation.',
  howItWorks: [
    { type: 'list', items: [
      'viewport meta tag for mobile scaling',
      '@media (min-width: 768px) additive rules',
      'clamp() for fluid typography',
      'container-type inline-size for @container',
      'Touch targets min 44px; avoid hover-only UX',
    ] },
  ],
  example: [
    { type: 'code', language: 'css', code: "@media (min-width: 768px) {\n  .grid { grid-template-columns: repeat(2, 1fr); }\n}\nh1 { font-size: clamp(1.5rem, 4vw, 2.5rem); }" },
  ],
  keyTakeaways: [
    'Mobile-first min-width queries',
    'Fluid type with clamp',
    'Images max-width 100%',
    'Container queries decouple from viewport',
    'Test real devices not only Chrome resize',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Mobile-first vs desktop-first?', answerHint: 'Mobile-first uses min-width; desktop-first max-width — former preferred.' },
    { level: 'intermediate', question: 'rem vs em?', answerHint: 'rem root-relative consistent; em compounds from parent.' },
    { level: 'advanced', question: 'Container vs media queries?', answerHint: 'Container responds to parent width — reusable components in sidebar vs main.' },
  ],
  flashcards: [
    { front: 'viewport meta', back: 'width=device-width initial-scale=1' },
    { front: 'clamp()', back: 'min preferred max fluid value' },
    { front: 'mobile-first', back: 'Base mobile; min-width breakpoints up' },
  ],
  quickRevision: [
    'viewport meta',
    'min-width breakpoints',
    'clamp typography',
    'max-width images',
    'container queries',
    'touch target size',
  ],
  tradeoffs: {
    advantages: [
    'One codebase all devices',
    ],
    disadvantages: [
    'CSS complexity',
    'Performance if loading desktop assets on mobile',
    ],
    alternatives: [
    'Adaptive server different HTML',
    'Separate native apps',
    ],
    whenToUse: [
    'Web apps and marketing sites',
    ],
    whenNotToUse: [
    'When native-only product strategy',
    ],
  },
  failureModes: [
    'Missing viewport meta tiny text',
    'Horizontal scroll from fixed widths',
    'Hover-only menus on touch',
  ],
  production: {
    performance: [
      'Responsive images srcset',
      'Lazy load below fold',
    ],
  },
  interview: {
    expectations: [
      'Mobile-first',
      'Relative units',
    ],
    commonQuestions: [
      'Three column to one?',
    ],
    followUps: [
      'container queries?',
    ],
    misconceptions: [
      'More breakpoints = better',
    ],
    traps: [
      'px-only layouts',
    ],
    strongSignals: [
      'clamp, container queries, srcset',
    ],
  },
}
