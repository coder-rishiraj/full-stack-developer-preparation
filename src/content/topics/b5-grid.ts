import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'CSS Grid is two-dimensional layout: define rows and columns with tracks, gaps, and named areas — page-level and component grids.',
  whyExists: 'Flexbox alone struggles with simultaneous row+column control. Grid enables holy grail layouts, dashboards, and responsive area templates.',
  mentalModel: 'Grid container defines template. Items placed by line numbers, span, or grid-area names. fr unit distributes free space. auto-fill/minmax for responsive columns without media queries.',
  howItWorks: [
    { type: 'list', items: [
      'display:grid; grid-template-columns: repeat(3, 1fr)',
      'grid-template-areas for semantic layout',
      'gap replaces gutter margins',
      'minmax(200px, 1fr) responsive auto-fit columns',
      'subgrid (modern) aligns nested grids',
    ] },
  ],
  example: [
    { type: 'code', language: 'css', code: ".layout {\n  display: grid;\n  grid-template-columns: 240px 1fr;\n  grid-template-areas: \"sidebar main\";\n  min-height: 100vh;\n}" },
  ],
  keyTakeaways: [
    'Grid for 2D; flex for 1D rows',
    'fr splits leftover space',
    'grid-area readable layouts',
    'auto-fit/minmax responsive without breakpoints',
    'Implicit vs explicit grid tracks',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Flex vs Grid?', answerHint: 'Flex 1D distribute; Grid 2D tracks and areas.' },
    { level: 'intermediate', question: 'Responsive columns without media queries?', answerHint: 'repeat(auto-fit, minmax(250px, 1fr)).' },
    { level: 'advanced', question: 'fr vs % in grid?', answerHint: 'fr shares remaining space after fixed tracks; % relative to container can overflow with gap.' },
  ],
  flashcards: [
    { front: 'fr unit', back: 'Fraction of free space in grid' },
    { front: 'auto-fit vs auto-fill', back: 'fit collapses empty tracks; fill keeps them' },
    { front: 'grid-area', back: 'Named placement in template-areas' },
  ],
  quickRevision: [
    '2D tracks',
    'fr and minmax',
    'template-areas',
    'gap gutters',
    'auto-fit responsive',
    'subgrid alignment',
  ],
  tradeoffs: {
    advantages: [
    'Powerful page layouts',
    'Readable area names',
    ],
    disadvantages: [
    'Older browser gaps mostly solved',
    'Overkill for simple row',
    ],
    alternatives: [
    'Flex for toolbars only',
    ],
    whenToUse: [
    'Dashboards, page shells',
    ],
    whenNotToUse: [
    'Single row of buttons',
    ],
  },
  failureModes: [
    'Fixed px columns overflow mobile',
    'Implicit tracks unexpected sizing',
    'Grid without fallback for very old browsers',
  ],
  production: {
    maintainability: [
      'Document grid templates in design tokens',
    ],
  },
  interview: {
    expectations: [
      '2D vs flex',
      'minmax pattern',
    ],
    commonQuestions: [
      'Build holy grail with grid?',
    ],
    followUps: [
      'subgrid?',
    ],
    misconceptions: [
      'Grid replaces flex entirely',
    ],
    traps: [
      '% width with gap overflow',
    ],
    strongSignals: [
      'auto-fit minmax, areas, fr explanation',
    ],
  },
}
