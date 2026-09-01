import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'The CSS box model describes every element as a rectangular box: content → padding → border → margin. box-sizing controls whether width includes padding/border.',
  whyExists: 'Layout math needs predictable dimensions. Default content-box makes width=300 plus padding explode layout; border-box makes width include padding and border.',
  mentalModel: 'Four nested rectangles. width/height apply to content box by default. margin collapses vertically between siblings. outline does not affect layout flow.',
  howItWorks: [
    { type: 'list', items: [
      'content-box: width = content only',
      'border-box: width = content + padding + border',
      'margin separates boxes; auto horizontal margin centers block',
      'padding affects clickable hit area inside border',
      'overflow hidden clips content not margin',
    ] },
  ],
  example: [
    { type: 'code', language: 'css', code: "*, *::before, *::after { box-sizing: border-box; }\n.card {\n  width: 200px;\n  padding: 16px;\n  border: 1px solid #ccc;\n}" },
  ],
  keyTakeaways: [
    'Global border-box is industry default',
    'Margin collapse between adjacent vertical margins',
    'Padding increases inner space; margin separates elements',
    'width 100% + padding overflows without border-box',
    'Inline elements ignore width/height (mostly)',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'content-box vs border-box?', answerHint: 'border-box width includes padding and border; easier layout.' },
    { level: 'intermediate', question: 'What is margin collapse?', answerHint: 'Adjacent vertical margins combine to larger of two, not sum.' },
    { level: 'advanced', question: 'Why 100vw causes horizontal scroll?', answerHint: 'vw includes scrollbar width; use 100% or overflow-x hidden carefully.' },
  ],
  flashcards: [
    { front: 'box-sizing border-box', back: 'width includes padding + border' },
    { front: 'Margin collapse', back: 'Vertical adjacent margins merge' },
    { front: 'Outline vs border', back: 'Outline does not affect layout box size' },
  ],
  quickRevision: [
    'content padding border margin',
    'border-box reset',
    'margin collapse vertical',
    'padding inside border',
    'outline no layout',
    'inline ignores w/h',
  ],
  tradeoffs: {
    advantages: [
    'border-box predictable sizing',
    ],
    disadvantages: [
    'Legacy content-box confusion in old CSS',
    ],
    alternatives: [
    'calc() for explicit sizes',
    ],
    whenToUse: [
    'All component sizing',
    ],
    whenNotToUse: [
    'Rare when matching third-party content-box widgets',
    ],
  },
  failureModes: [
    '100% width + horizontal padding overflow',
    'Margin collapse surprises in layouts',
    'Assuming height includes margin',
  ],
  production: {
    maintainability: [
      'border-box on *, document in reset',
    ],
  },
  interview: {
    expectations: [
      'Draw four boxes',
      'border-box default',
    ],
    commonQuestions: [
      'Explain box model',
    ],
    followUps: [
      'Margin collapse example?',
    ],
    misconceptions: [
      'Padding collapses',
    ],
    traps: [
      'box-sizing only on one element inconsistently',
    ],
    strongSignals: [
      'border-box reset, collapse, outline vs border',
    ],
  },
}
