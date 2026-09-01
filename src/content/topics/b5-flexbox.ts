import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Flexbox is a one-dimensional CSS layout: distribute space along main axis (row/column) and align on cross axis — ideal for nav bars, centering, and flexible rows.',
  whyExists: 'Float/table hacks were fragile. Flexbox solves equal-height columns, vertical centering, and responsive toolbars with minimal code.',
  mentalModel: 'Flex container + flex items. Main axis from flex-direction. justify-content spaces along main; align-items on cross. flex-grow/shrink/basis control item sizing.',
  howItWorks: [
    { type: 'list', items: [
      'display:flex on parent',
      'flex-direction row|column sets main axis',
      'justify-content: flex-start|center|space-between',
      'align-items: stretch|center|flex-start',
      'flex: 1 1 auto shorthand for grow shrink basis',
      'gap for spacing without margin hacks',
    ] },
  ],
  example: [
    { type: 'code', language: 'css', code: ".toolbar {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 8px;\n}\n.main { flex: 1; }" },
  ],
  keyTakeaways: [
    'Flex is 1D — use Grid for 2D',
    'align-items stretch default makes equal height',
    'flex:1 means grow to fill',
    'min-width:0 fixes flex overflow ellipsis',
    'order changes visual not tab order — avoid for a11y',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'justify-content vs align-items?', answerHint: 'justify on main axis; align on cross axis.' },
    { level: 'intermediate', question: 'Center div horizontally and vertically?', answerHint: 'flex + justify-center + align-center on parent.' },
    { level: 'advanced', question: 'Flex item text overflow ellipsis?', answerHint: 'min-width:0 on flex child; overflow hidden; text-overflow ellipsis.' },
  ],
  flashcards: [
    { front: 'Main axis', back: 'Set by flex-direction (row default)' },
    { front: 'flex: 1', back: 'flex-grow 1 — take remaining space' },
    { front: 'min-width 0', back: 'Allows flex child to shrink below content size' },
  ],
  quickRevision: [
    'display flex parent',
    'justify main align cross',
    'flex 1 grow',
    'gap not margin',
    '1D not 2D',
    'min-width 0 overflow',
  ],
  tradeoffs: {
    advantages: [
    'Easy centering and equal heights',
    ],
    disadvantages: [
    '1D only; complex grids awkward',
    ],
    alternatives: [
    'CSS Grid for 2D',
    'gap in grid also',
    ],
    whenToUse: [
    'Nav, rows, centering',
    ],
    whenNotToUse: [
    'Full page 2D layout — prefer grid',
    ],
  },
  failureModes: [
    'Flex child overflow without min-width:0',
    'Using order hurting keyboard order',
    'Nested flex without flex-shrink causing overflow',
  ],
  production: {
    maintainability: [
      'Consistent flex utilities in design system',
    ],
  },
  interview: {
    expectations: [
      'Main/cross axis',
      'Centering pattern',
    ],
    commonQuestions: [
      'Flex vs Grid?',
    ],
    followUps: [
      'flex-shrink 0 when?',
    ],
    misconceptions: [
      'Flex replaces all layout',
    ],
    traps: [
      'Forgetting min-width 0',
    ],
    strongSignals: [
      'Axis terminology, gap, min-width 0 trick',
    ],
  },
}
