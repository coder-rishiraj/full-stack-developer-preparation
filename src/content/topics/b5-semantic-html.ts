import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Semantic HTML uses meaningful tags (header, nav, main, article, button) so document structure is machine-readable — SEO, a11y, and maintainability.',
  whyExists: 'Div soup has no structure for screen readers or search engines. Semantic elements communicate landmarks, headings hierarchy, and control types natively.',
  mentalModel: 'One main per page. Headings h1–h6 sequential. Interactive controls use button/a/input. Landmarks map to screen reader navigation.',
  howItWorks: [
    { type: 'list', items: [
      'header/footer/nav/main/article/section/aside',
      'button for actions; a href for navigation',
      'label for= id pairs inputs',
      'table for tabular data only',
      'ul/ol for lists not div stacks',
    ] },
  ],
  example: [
    { type: 'code', language: 'html', code: "<main>\n  <article>\n    <h1>Post title</h1>\n    <p>Content...</p>\n  </article>\n</main>" },
  ],
  keyTakeaways: [
    'One h1 per page typically',
    'button vs a by behavior not styling',
    'Landmarks reduce aria redundancy',
    'Semantic default styles differ — reset intentionally',
    'Forms need label association',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'button vs anchor?', answerHint: 'button activates in-page action; a navigates to URL.' },
    { level: 'intermediate', question: 'section vs div?', answerHint: 'section needs thematic heading; div no semantic meaning.' },
    { level: 'advanced', question: 'Multiple nav elements?', answerHint: 'OK with aria-label distinguishing primary vs footer nav.' },
  ],
  flashcards: [
    { front: 'main landmark', back: 'Primary content — one per page ideally' },
    { front: 'button vs a', back: 'Action vs navigation' },
    { front: 'heading order', back: 'Do not skip levels h2 to h4' },
  ],
  quickRevision: [
    'Landmarks main nav',
    'button vs link',
    'label for inputs',
    'heading hierarchy',
    'table for data',
    'lists ul ol',
  ],
  tradeoffs: {
    advantages: [
    'Free a11y and SEO',
    ],
    disadvantages: [
    'Legacy designs may fight defaults',
    ],
    alternatives: [
    'None for public web',
    ],
    whenToUse: [
    'Always in HTML',
    ],
    whenNotToUse: [
    'Never substitute div for button',
    ],
  },
  failureModes: [
    'Clickable div without role/key handlers',
    'Missing main landmark',
    'Placeholder-only inputs no label',
  ],
  production: {
    maintainability: [
      'HTML lint rules in CI',
    ],
  },
  interview: {
    expectations: [
      'Landmarks',
      'button vs a',
    ],
    commonQuestions: [
      'Improve this div soup?',
    ],
    followUps: [
      'article vs section?',
    ],
    misconceptions: [
      'Semantics irrelevant for SPAs',
    ],
    traps: [
      'h1 for logo only sitewide misuse',
    ],
    strongSignals: [
      'Landmark map, label/for, heading order',
    ],
  },
}
