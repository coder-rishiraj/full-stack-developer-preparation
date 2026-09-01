import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'ARIA (Accessible Rich Internet Applications) adds roles, states, and properties to expose custom widget semantics to assistive technology when native HTML is insufficient.',
  whyExists: 'Complex SPAs use div-based widgets. Browsers expose built-in semantics for native controls; ARIA bridges gaps for tabs, comboboxes, live regions — only when HTML cannot.',
  mentalModel: 'Accessibility tree parallel to DOM. ARIA attributes annotate nodes: role=tablist, aria-selected, aria-expanded. Changes announced via live regions. First rule: no ARIA is better than bad ARIA.',
  howItWorks: [
    { type: 'list', items: [
      'Roles: landmark (navigation), widget (button), relationship (aria-labelledby)',
      'States: aria-expanded, aria-checked, aria-disabled',
      'Properties: aria-label, aria-describedby',
      'Live regions: aria-live polite/assertive for toasts',
      'Hide decorative: aria-hidden=true on icons',
    ] },
  ],
  example: [
    { type: 'code', language: 'html', code: "<div role=\"tablist\">\n  <button role=\"tab\" aria-selected=\"true\" aria-controls=\"panel1\">One</button>\n</div>\n<div role=\"tabpanel\" id=\"panel1\">...</div>" },
  ],
  keyTakeaways: [
    'Prefer native button/input over role=button',
    'aria-label when visible text absent',
    'aria-live for dynamic updates',
    'Do not override native semantics incorrectly',
    'Test with NVDA/VoiceOver',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'aria-label vs aria-labelledby?', answerHint: 'label provides string; labelledby references element id(s) for name.' },
    { level: 'intermediate', question: 'aria-hidden on modal backdrop?', answerHint: 'Hide inert background from AT; focus trap in modal; restore focus on close.' },
    { level: 'advanced', question: 'Build accessible combobox?', answerHint: 'Follow WAI-ARIA APG: input + listbox, aria-activedescendant, keyboard arrows.' },
  ],
  flashcards: [
    { front: 'First ARIA rule', back: 'Do not use ARIA if native HTML works' },
    { front: 'aria-live assertive', back: 'Interrupts screen reader — urgent alerts only' },
    { front: 'aria-expanded', back: 'State for disclosure widgets (menus, accordions)' },
  ],
  quickRevision: [
    'Native first',
    'role/state/property',
    'aria-live updates',
    'APG patterns',
    'Focus management',
    'Test real AT',
  ],
  tradeoffs: {
    advantages: [
    'Enables custom widgets for AT',
    ],
    disadvantages: [
    'Easy to get wrong vs native',
    ],
    alternatives: [
    'Use native input type=date, details/summary',
    ],
    whenToUse: [
    'Custom tabs, trees, comboboxes',
    ],
    whenNotToUse: [
    'When button/link/input suffices',
    ],
  },
  failureModes: [
    'role=button without keyboard handlers',
    'aria-live spam',
    'Conflicting label and aria-label',
    'aria-hidden on focused element',
  ],
  production: {
    maintainability: [
      'Use headless a11y libs (React Aria, Radix)',
    ],
  },
  interview: {
    expectations: [
      'When ARIA needed',
      'Common attributes',
    ],
    commonQuestions: [
      'Accessible modal?',
    ],
    followUps: [
      'APG combobox?',
    ],
    misconceptions: [
      'More ARIA = more accessible',
    ],
    traps: [
      'aria-label on everything',
    ],
    strongSignals: [
      'APG patterns, focus restore, live regions sparingly',
    ],
  },
}
