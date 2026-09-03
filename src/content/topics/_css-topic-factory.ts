import type { TopicContent } from '@/domain/types'

type CssTopicInput = {
  title: string
  sectionTitle: string
  parentTitle?: string
}

const SECTION_FOCUS: Record<string, string> = {
  'Cascade & Selectors':
    'which rule wins, inheritance, specificity, and cascade layers — not memorizing selector trivia',
  'Box Model & Flow':
    'how boxes size, collapse, overflow, and contain descendants in normal flow',
  'Display & Visibility':
    'how an element participates in layout versus how it is hidden from users and assistive tech',
  Flexbox:
    'one-dimensional distribution, shrinking bugs, and alignment along the main and cross axes',
  Grid: 'two-dimensional tracks, alignment, and when Grid should own the page versus the component',
  'Positioning & Stacking':
    'containing blocks, sticky/fixed quirks, stacking contexts, and why z-index sometimes does nothing',
  'Units, Color & Typography':
    'predictable sizing, readable type, and color that survives theming and contrast requirements',
  'Responsive Design':
    'component-level constraints, fluid values, and container queries rather than only viewport breakpoints',
  'Theming & Custom Properties':
    'runtime tokens, cascade-aware variables, and theming without rebuilding CSS',
  Motion:
    'user-initiated motion that stays compositor-cheap and respects reduced-motion preferences',
  'CSS Architecture':
    'ownership of styles at scale: naming, modules, utilities, and tokenized design systems',
  'HTML & CSS Accessibility':
    'semantic structure, visible focus, and ARIA only when native HTML is insufficient',
}

export function createCssTopicContent({
  title,
  sectionTitle,
  parentTitle,
}: CssTopicInput): TopicContent {
  const focus =
    SECTION_FOCUS[sectionTitle] ??
    'layout, cascade, and maintainable CSS for production UI'
  const parentContext = parentTitle ? ` It is a focused part of ${parentTitle}.` : ''

  return {
    whatIsIt:
      `${title} is a CSS / UI concept within ${sectionTitle}.${parentContext} ` +
      `Study it in terms of ${focus}, not as an isolated property name.`,
    whyExists:
      `${title} matters because interviews and production UI work require you to explain why a layout ` +
      `breaks, which rule wins, and how the choice scales. It is about ${focus}.`,
    mentalModel:
      `For ${title}, identify the containing block, the cascade winner, the formatting context, and ` +
      `the visual result. Then ask what happens when the viewport, token, or parent constraint changes.`,
    howItWorks: [
      {
        type: 'list',
        ordered: true,
        items: [
          `Define ${title} in the context of ${sectionTitle}.`,
          'Reproduce the behavior in a minimal HTML/CSS example before using a framework.',
          'Inspect computed styles, box model, and stacking in DevTools.',
          'State one misuse that causes overlapping UI, overflow, or inaccessible hiding.',
        ],
      },
      {
        type: 'callout',
        variant: 'warning',
        title: 'Interview standard',
        text:
          `Do not answer ${title} with syntax only. Explain the cascade or layout rule, a failure ` +
          'mode (sticky, z-index, shrink-to-zero), and how you would verify it in DevTools.',
      },
    ],
    internals: [
      {
        type: 'list',
        items: [
          'Layout properties can trigger reflow; transform and opacity are often compositor-only.',
          'Stacking contexts isolate z-index; children cannot escape a lower parent context.',
          'Percentage sizes resolve against the containing block, not always the visual parent.',
        ],
      },
    ],
    failureModes: [
      `Treating ${title} as trivia instead of a debugging model.`,
      'Using IDs, !important, or ever-larger z-index values to win cascade fights.',
      'Hiding content with CSS in a way that breaks keyboard or screen-reader access.',
    ],
    interview: {
      expectations: [
        `Define ${title} and place it in ${sectionTitle}.`,
        'Walk through a broken layout or selector conflict.',
        'Name one modern alternative (container queries, @layer, logical properties) when relevant.',
      ],
      commonQuestions: [
        `What problem does ${title} solve?`,
        `When would you avoid ${title}?`,
        'How would you debug it in DevTools?',
      ],
      followUps: [
        'What happens inside a transformed parent?',
        'How does this interact with Flexbox shrinking or Grid minmax?',
      ],
      misconceptions: [`${title} is only visual and has no accessibility or performance cost.`],
      traps: ['Giving a framework-only answer as if it were a CSS guarantee.'],
      strongSignals: [
        'Uses a minimal CSS reproduction.',
        'Separates cascade, formatting context, and stacking context.',
      ],
    },
    keyTakeaways: [
      `${title} belongs to ${sectionTitle}.`,
      `Reason about ${title} through cascade, containing block, and formatting context.`,
      'Verify with computed styles and a reduced test case.',
    ],
    interviewQuestions: [
      {
        level: 'basic',
        question: `What is ${title}, and what problem does it solve?`,
        answerHint: `Define it within ${sectionTitle}, then name the layout or cascade problem it addresses.`,
      },
      {
        level: 'intermediate',
        question: `Show a practical use of ${title} and one common bug.`,
        answerHint: 'Prefer a 10-line CSS example over a framework component.',
      },
      {
        level: 'advanced',
        question: `What production trade-offs matter for ${title}?`,
        answerHint: `Discuss ${focus}, then how you would verify the result in DevTools.`,
      },
    ],
    flashcards: [
      {
        front: title,
        back: `${sectionTitle}: cascade, containing block, formatting context, observable layout.`,
      },
      {
        front: `${title} interview signal`,
        back: 'Definition → rule that wins → bug → DevTools check.',
      },
    ],
    quickRevision: [
      `${title} — ${sectionTitle}`,
      `Focus: ${focus}`,
      'Containing block → cascade winner → formatting context → pixels',
      'Know one use, one bug, one DevTools panel',
    ],
  }
}
