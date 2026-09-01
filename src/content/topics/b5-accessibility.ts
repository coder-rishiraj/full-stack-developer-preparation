import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Web accessibility (a11y) ensures people with disabilities can perceive, operate, understand, and robustly use UIs — WCAG guidelines, assistive tech compatibility, and inclusive design.',
  whyExists: 'Legal requirements (ADA, EAA), moral inclusion, and business reach (~15%+ users). Inaccessible sites fail keyboard users, screen reader users, and low-vision users.',
  mentalModel: 'POUR: Perceivable (text alt, contrast), Operable (keyboard, focus), Understandable (labels, errors), Robust (semantic HTML + ARIA when needed). Test with keyboard only and screen reader.',
  howItWorks: [
    { type: 'list', items: [
      'Semantic HTML first — buttons are button, not div onclick',
      'Visible focus indicators; logical tab order',
      'Color contrast WCAG AA 4.5:1 text',
      'Captions/transcripts for media',
      'Skip links and landmark regions',
    ] },
  ],
  example: [
    { type: 'code', language: 'html', caption: 'Accessible button vs anti-pattern', code: "<button type=\"button\">Save</button>\n<!-- not: -->\n<div onclick=\"save()\">Save</div>" },
  ],
  keyTakeaways: [
    'Semantic HTML beats ARIA hacks',
    'Keyboard path must mirror mouse path',
    'Contrast and focus visible are non-negotiable',
    'a11y is shift-left not audit-only',
    'Screen readers use DOM accessibility tree',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'What is WCAG?', answerHint: 'Web Content Accessibility Guidelines — POUR principles, levels A/AA/AAA.' },
    { level: 'intermediate', question: 'How test accessibility without tools only?', answerHint: 'Keyboard-only navigation, zoom 200%, screen reader smoke, pause animations.' },
    { level: 'advanced', question: 'When is ARIA required?', answerHint: 'When native HTML cannot express role/state — prefer native elements first.' },
  ],
  flashcards: [
    { front: 'POUR', back: 'Perceivable, Operable, Understandable, Robust' },
    { front: 'First a11y fix', back: 'Use correct semantic HTML element' },
    { front: 'WCAG AA contrast', back: '4.5:1 normal text; 3:1 large text' },
  ],
  quickRevision: [
    'Semantic HTML first',
    'Keyboard + focus',
    'Contrast AA',
    'Alt text meaningful',
    'Labels on inputs',
    'Do not disable zoom',
  ],
  tradeoffs: {
    advantages: [
    'Broader audience',
    'Better SEO/UX for all',
    ],
    disadvantages: [
    'Extra design/dev time if bolted on late',
    ],
    alternatives: [
    'Separate accessible site (bad)',
    ],
    whenToUse: [
    'All production UIs',
    ],
    whenNotToUse: [
    'Never skip for public apps',
    ],
  },
  failureModes: [
    'Div buttons unreachable by keyboard',
    'Icon-only controls without aria-label',
    'Low contrast gray on white',
    'Removing focus outline without replacement',
  ],
  production: {
    security: [
      'a11y unrelated but forms need accessible errors',
    ],
    observability: [
      'Track a11y bug reports in support',
    ],
    maintainability: [
      'Lint jsx-a11y; axe in CI',
    ],
  },
  interview: {
    expectations: [
      'POUR, keyboard, semantic HTML',
    ],
    commonQuestions: [
      'Make modal accessible?',
    ],
    followUps: [
      'WCAG levels?',
    ],
    misconceptions: [
      'ARIA fixes bad HTML',
    ],
    traps: [
      'tabindex > 0 everywhere',
    ],
    strongSignals: [
      'Native elements, focus trap in modals, live regions for async',
    ],
  },
}
