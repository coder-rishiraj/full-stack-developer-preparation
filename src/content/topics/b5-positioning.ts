import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'CSS positioning (static, relative, absolute, fixed, sticky) controls how elements are placed and what they are offset against — containing blocks and stacking contexts.',
  whyExists: 'Normal flow cannot overlay modals, sticky headers, or badges. Positioning plus z-index enables layered UI while document flow rules define reference frames.',
  mentalModel: 'static: in flow. relative: offset from self; still occupies space. absolute: out of flow; positioned vs nearest positioned ancestor. fixed: viewport. sticky: hybrid until scroll threshold.',
  howItWorks: [
    { type: 'list', items: [
      'position:relative on parent for absolute children',
      'top/right/bottom/left offsets',
      'z-index only on positioned elements',
      'sticky needs overflow visible ancestor',
      'fixed modals + backdrop; watch mobile viewport',
    ] },
  ],
  example: [
    { type: 'code', language: 'css', code: ".card { position: relative; }\n.badge {\n  position: absolute;\n  top: -8px;\n  right: -8px;\n}" },
  ],
  keyTakeaways: [
    'Absolute needs positioned ancestor',
    'Sticky fails if parent overflow:hidden',
    'Fixed relative to viewport — mobile URL bar quirks',
    'z-index wars — isolate stacking contexts',
    'Removed from flow: absolute/fixed',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'absolute positioned relative to what?', answerHint: 'Nearest ancestor with position not static; else viewport.' },
    { level: 'intermediate', question: 'Why sticky not working?', answerHint: 'Ancestor overflow hidden/auto; no room to stick; missing top value.' },
    { level: 'advanced', question: 'Stacking context creation?', answerHint: 'positioned + z-index, opacity <1, transform, filter create new contexts.' },
  ],
  flashcards: [
    { front: 'sticky requirement', back: 'top/bottom set; no overflow:hidden on ancestor' },
    { front: 'absolute containing block', back: 'Nearest positioned ancestor padding edge' },
    { front: 'fixed', back: 'Viewport — modals, FABs' },
  ],
  quickRevision: [
    'relative anchor',
    'absolute out of flow',
    'fixed viewport',
    'sticky scroll',
    'z-index contexts',
    'overflow breaks sticky',
  ],
  tradeoffs: {
    advantages: [
    'Overlays and sticky nav',
    ],
    disadvantages: [
    'Stacking bugs',
    'a11y focus with portaled modals',
    ],
    alternatives: [
    'Popover API',
    'CSS anchor positioning emerging',
    ],
    whenToUse: [
    'Badges, modals, sticky headers',
    ],
    whenNotToUse: [
    'Whole page layout — grid/flex',
    ],
  },
  failureModes: [
    'Sticky inside overflow hidden',
    'Modal under header wrong z-index',
    'Fixed element clipped on iOS',
  ],
  production: {
    maintainability: [
      'Portal modals to body; central z-index scale',
    ],
  },
  interview: {
    expectations: [
      'Containing block',
      'sticky pitfalls',
    ],
    commonQuestions: [
      'Center absolute element?',
    ],
    followUps: [
      'Stacking context?',
    ],
    misconceptions: [
      'z-index global ordering',
    ],
    traps: [
      'absolute without relative parent',
    ],
    strongSignals: [
      'Ancestor chain, portal, sticky overflow',
    ],
  },
}
