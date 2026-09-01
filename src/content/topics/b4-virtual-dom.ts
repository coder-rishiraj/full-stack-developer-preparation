import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'The Virtual DOM is React’s in-memory representation of UI as a tree of lightweight JavaScript objects (React elements) describing what the DOM should look like — reconciled against the previous tree to compute minimal real DOM updates rather than rebuilding the page on every change.',
  whyExists:
    'Direct DOM manipulation is verbose and error-prone at scale. Declarative UI plus virtual tree diff lets developers describe state → UI mapping while React batches efficient DOM mutations, preserves state across updates, and enables cross-platform renderers (Native, Canvas).',
  mentalModel:
    'Render returns element tree (descriptors: type, props, children) — not live DOM nodes. Reconciler diffs old vs new virtual tree → mutation list → commit to real DOM. “Virtual DOM slow” myth: unnecessary renders hurt; targeted updates are fast. Fiber is current implementation engine.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Component render produces React elements — plain objects.',
        'Reconciler walks fiber tree comparing type and key.',
        'Diff heuristics O(n): same level siblings, key matching.',
        'Marks insert/update/delete on host fibers (DOM nodes).',
        'Commit phase applies batched DOM operations.',
      ],
    },
    {
      type: 'mermaid',
      caption: 'Virtual to real DOM',
      diagram: `flowchart LR
  R[Render → React elements] --> D[Reconciliation diff]
  D --> P[DOM mutation plan]
  P --> C[Commit real DOM]`,
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'Element vs Component vs DOM',
      text: 'React element = descriptor. Component = function/class producing elements. DOM node = browser object — created/updated in commit.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'javascript',
      caption: 'React element structure (simplified)',
      code: `// JSX: <div className="box">Hello</div>
// Becomes roughly:
{ type: 'div', props: { className: 'box', children: 'Hello' }, key: null }`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Fiber nodes link tree with child/sibling/return pointers.',
        'Double buffering: current vs workInProgress trees.',
        'Event delegation at root — not per virtual node listener.',
        'React 18 concurrent scheduler interrupts low-priority diff work.',
        'Alternative libs (Svelte compile, Solid signals) skip full virtual tree — tradeoffs differ.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Declarative UI with efficient batched DOM updates',
      'Cross-platform abstraction (DOM, Native, PDF)',
      'Developer ergonomics at scale',
    ],
    disadvantages: [
      'Render work even when DOM change small',
      'Memory for fiber tree',
      'Learning curve for reconciliation behavior',
    ],
    alternatives: [
      'Direct DOM (micro-libraries, vanilla JS)',
      'Signal-based fine-grained reactivity (Solid, Preact signals)',
      'Svelte compiled DOM updates',
    ],
    whenToUse: [
      'Default React mental model for all UI updates',
      'Explaining keys, reconciliation, performance',
    ],
    whenNotToUse: [
      'Claiming virtual DOM always faster than direct DOM',
    ],
  },
  failureModes: [
    'Huge render output every keystroke — virtual diff still costs CPU.',
    'Assuming virtual DOM skips all re-renders automatically.',
    'Confusing React elements with DOM nodes in debugging.',
    'Mutating real DOM outside React breaks next diff assumptions.',
  ],
  production: {
    performance: ['Reduce render scope — virtual diff cheap but not free'],
    maintainability: ['Understand element type+key remount rules'],
  },
  interview: {
    expectations: [
      'Virtual DOM definition',
      'Diff/reconciliation purpose',
      'Not same as shadow DOM',
    ],
    commonQuestions: [
      'What is Virtual DOM?',
      'Why Virtual DOM?',
      'Virtual DOM vs real DOM?',
    ],
    followUps: ['Fiber architecture?', 'Is Virtual DOM always fast?'],
    misconceptions: [
      'Virtual DOM is shadow DOM',
      'React touches DOM on every setState everywhere always',
      'Virtual DOM unique to React forever',
    ],
    traps: ['Saying virtual DOM is faster than DOM in all cases'],
    strongSignals: [
      'In-memory element tree',
      'Reconciliation → minimal DOM ops',
      'Render vs commit separation',
    ],
  },
  keyTakeaways: [
    'Virtual DOM is lightweight JS description of UI tree.',
    'Reconciliation diffs trees for minimal real DOM changes.',
    'React elements ≠ DOM nodes.',
    'Render cost still exists — optimize render scope.',
    'Fiber implements modern virtual DOM workflow.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What is the Virtual DOM?',
      answerHint: 'In-memory JS object tree representing UI; diffed to update real DOM efficiently.',
    },
    {
      level: 'intermediate',
      question: 'Virtual DOM vs Shadow DOM?',
      answerHint: 'Virtual DOM is React abstraction for diffing; Shadow DOM is browser encapsulation for web components.',
    },
    {
      level: 'advanced',
      question: 'When is Virtual DOM overhead a problem?',
      answerHint: 'Large trees re-rendering often; fix colocate/memo/virtualize not abandon React.',
    },
  ],
  flashcards: [
    { front: 'Virtual DOM', back: 'JS element tree describing UI — not browser DOM' },
    { front: 'Reconciliation', back: 'Diff virtual trees → plan DOM mutations' },
    { front: 'React element', back: 'Descriptor object { type, props, key }' },
  ],
  quickRevision: [
    'JS UI descriptor tree',
    'Diff → minimal DOM updates',
    'Elements not DOM nodes',
    'Fiber reconciler',
    'Render still has cost',
    'Not shadow DOM',
  ],
}
