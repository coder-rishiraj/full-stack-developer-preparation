import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'The CSS Object Model (CSSOM) is the browser’s in-memory tree representation of all CSS rules applied to a document — stylesheets, inline styles, and computed style data — parallel to the DOM and merged later into the render tree.',
  whyExists:
    'HTML alone cannot describe presentation. The browser must parse CSS, resolve the cascade, inherit values, and expose styles to layout and paint. CSSOM is the structured output of that parsing, queryable via getComputedStyle and the CSSOM API.',
  mentalModel:
    'DOM describes structure; CSSOM describes appearance rules. Both are built during parsing. The render tree combines visible DOM nodes with their computed styles. Changing a stylesheet invalidates CSSOM and triggers style recalc downstream.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'HTML parser builds DOM; CSS parser builds CSSOM from linked stylesheets and <style> blocks.',
        'CSS is render-blocking by default — browser may pause DOM construction until critical CSS is parsed.',
        'Cascade resolves specificity, origin, and !important into computed values per element.',
        'CSSOM + DOM feed render-tree construction (display:none nodes excluded).',
        'Style changes invalidate matched rules and force recalc → layout → paint pipeline stages.',
      ],
    },
    {
      type: 'mermaid',
      caption: 'CSSOM in the critical rendering path',
      diagram: `flowchart LR
  HTML[HTML bytes] --> DOM[DOM tree]
  CSS[CSS bytes] --> CSSOM[CSSOM tree]
  DOM --> RT[Render tree]
  CSSOM --> RT
  RT --> Layout --> Paint --> Composite`,
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'CSSOM vs computed style',
      text: 'CSSOM holds rule trees; getComputedStyle returns resolved values after cascade, inheritance, and viewport media queries.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'javascript',
      caption: 'Reading computed styles (forces style flush in some engines)',
      code: `const el = document.querySelector('.card');
const styles = getComputedStyle(el);
console.log(styles.width, styles.fontSize);

// CSSOM rule access (same-origin stylesheets only)
const sheet = document.styleSheets[0];
const rules = sheet?.cssRules; // may throw on cross-origin sheets`,
    },
    {
      type: 'code',
      language: 'css',
      caption: 'Cascade resolution',
      code: `/* Specificity: (0,1,1) beats (0,1,0) */
.card { color: blue; }
.card.title { color: red; } /* wins for .card.title elements */`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Stylesheet loading: blocking <link rel="stylesheet"> delays first render.',
        'Media queries evaluated during CSSOM build — wrong breakpoint = wrong initial styles.',
        'Selector matching walks DOM; expensive selectors (deep universal) slow recalc.',
        'CSS variables (--token) resolve at computed-value time, enabling runtime theming.',
        'Constructable Stylesheets (adoptedStyleSheets) update CSSOM without DOM <style> nodes.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Separates structure (DOM) from presentation (CSSOM)',
      'Enables programmatic style inspection and CSS-in-JS',
      'Cascade provides predictable override semantics',
    ],
    disadvantages: [
      'Render-blocking CSS hurts FCP/LCP',
      'Large stylesheets increase parse and match cost',
      'Dynamic CSS injection can cause FOUC or layout thrashing',
    ],
    alternatives: [
      'Inline critical CSS + async rest',
      'Utility-first CSS to reduce cascade depth',
      'CSS Modules / scoped styles to limit global matching',
    ],
    whenToUse: [
      'Standard web styling with external stylesheets',
      'Theme systems using CSS custom properties',
    ],
    whenNotToUse: [
      'Per-element inline style for everything (unmaintainable, no cache)',
      'Reading getComputedStyle in hot loops (forces sync layout)',
    ],
  },
  failureModes: [
    'Cross-origin stylesheet — cssRules access blocked, silent SecurityError.',
    'FOUC when CSS loads after HTML paints unstyled content.',
    'Specificity wars — unexpected cascade winners after refactors.',
    'Heavy :has() / deep selectors causing slow style recalc on large DOMs.',
  ],
  production: {
    performance: [
      'Inline critical above-the-fold CSS; defer non-critical stylesheets',
      'Avoid @import in CSS (serial loading)',
      'Limit selector complexity; prefer classes over deep descendants',
    ],
    reliability: ['Test styles across breakpoints — media query order matters'],
    observability: ['Performance panel: Recalculate Style, Layout events'],
  },
  interview: {
    expectations: [
      'Explain CSSOM alongside DOM in critical rendering path',
      'Why CSS blocks rendering',
      'Difference between specified, computed, and used values',
    ],
    commonQuestions: [
      'What is CSSOM?',
      'Why is CSS render-blocking?',
      'How does the cascade work?',
    ],
    followUps: [
      'How does CSS-in-JS affect CSSOM?',
      'What triggers style recalculation?',
    ],
    misconceptions: [
      'DOM includes visual styles (structure only until render tree)',
      'Changing className only repaints — often triggers layout too',
    ],
    traps: ['Saying CSS loads in parallel without noting render-blocking default'],
    strongSignals: [
      'Mentions DOM + CSSOM → render tree pipeline',
      'Cascade specificity with concrete example',
      'Critical CSS / render-blocking tradeoff',
    ],
  },
  keyTakeaways: [
    'CSSOM is the parsed CSS rule tree parallel to the DOM.',
    'Render tree = visible DOM nodes + computed styles from CSSOM.',
    'CSS is render-blocking by default — delays first paint.',
    'Style changes trigger recalc → layout → paint (maybe composite).',
    'getComputedStyle returns resolved cascade values.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What is the CSSOM?',
      answerHint: 'In-memory tree of CSS rules the browser builds while parsing stylesheets.',
    },
    {
      level: 'intermediate',
      question: 'Why does CSS block rendering?',
      answerHint: 'Browser needs computed styles before building render tree and laying out.',
    },
    {
      level: 'advanced',
      question: 'What happens when you change an element’s className?',
      answerHint: 'Style recalc, possible layout if geometry-affecting, then paint/composite.',
    },
  ],
  flashcards: [
    { front: 'CSSOM', back: 'Parsed CSS rule tree; pairs with DOM for render tree' },
    { front: 'Render-blocking CSS', back: 'Default <link> blocks render until CSSOM ready' },
    { front: 'Cascade order', back: 'Origin → importance → specificity → source order' },
  ],
  quickRevision: [
    'DOM = structure; CSSOM = style rules',
    'Both needed for render tree',
    'CSS blocks first render by default',
    'Cascade: specificity + inheritance',
    'Style change → recalc → layout → paint',
    'Critical CSS inlining for FCP',
  ],
}
