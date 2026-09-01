import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'The render tree is the browser’s merged view of which DOM nodes are visible and how they should be styled — built from the DOM and CSSOM, excluding nodes with display:none and most head/meta content, then used as input to layout.',
  whyExists:
    'DOM contains many non-visual nodes; CSSOM contains rules not tied to visible elements. The render tree is the minimal structure the layout engine needs: only painted boxes with resolved computed styles.',
  mentalModel:
    'Filter DOM → attach computed styles → tree of render objects (boxes). display:none and descendants vanish. visibility:hidden stays in tree (occupies space). Pseudo-elements (::before) get their own render objects.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Start from document root; traverse DOM.',
        'For each element, compute style from CSSOM cascade.',
        'Skip nodes not rendered: display:none, <head>, <script>, etc.',
        'Include text nodes and pseudo-elements as render objects.',
        'Output render tree → layout calculates geometry → paint records draw ops.',
      ],
    },
    {
      type: 'table',
      headers: ['DOM/CSS situation', 'In render tree?'],
      rows: [
        ['display: none', 'No — node and descendants excluded'],
        ['visibility: hidden', 'Yes — layout space reserved, not painted'],
        ['opacity: 0', 'Yes — painted transparently, may still hit-test'],
        ['<meta>, <script>', 'No — non-visual'],
        ['::before content', 'Yes — pseudo-element render object'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'Three trees',
      diagram: `flowchart TB
  DOM[DOM tree] --> Merge[Render tree builder]
  CSSOM[CSSOM] --> Merge
  Merge --> RT[Render tree]
  RT --> Layout[Layout / Reflow]
  Layout --> Paint[Paint]
  Paint --> Comp[Composite]`,
    },
  ],
  example: [
    {
      type: 'code',
      language: 'html',
      caption: 'What enters the render tree',
      code: `<div class="page">
  <header style="display:none">Hidden nav</header>
  <main>
    <p>Visible text</p>
    <span style="visibility:hidden">Ghost</span>
  </main>
</div>
<!-- header subtree absent from render tree; ghost span present but invisible -->`,
    },
    {
      type: 'paragraph',
      text: 'Only .page, main, p, and the hidden span render objects exist. The header branch is pruned entirely when display:none.',
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Each render object maps to a layout box (block, inline, flex item, etc.).',
        'Stacking contexts form during tree build / style — affect paint order.',
        'React/Vue virtual DOM diffing updates real DOM; browser rebuilds render tree incrementally.',
        'content-visibility: auto can skip layout/paint for off-screen subtrees.',
        'Shadow DOM has its own subtree merged at shadow boundaries.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Smaller tree than full DOM — layout works on visible structure only',
      'Clear separation between document semantics and painting',
    ],
    disadvantages: [
      'display:none vs visibility:hidden confusion in interviews and debugging',
      'Large DOM still produces large render tree even with optimizations',
    ],
    alternatives: [
      'content-visibility to defer off-screen subtrees',
      'Virtual lists to reduce DOM/render tree size',
    ],
    whenToUse: [
      'Understanding why hidden elements skip layout (display:none)',
      'Debugging paint/layer issues from pseudo-elements',
    ],
    whenNotToUse: [
      'N/A — browser always builds render tree; you optimize inputs',
    ],
  },
  failureModes: [
    'Assuming removed-from-DOM when only display:none (still in DOM, not render tree).',
    'visibility:hidden for “remove from layout” — still occupies space.',
    'Massive hidden DOM (display:none panels) still costs memory in DOM, not layout.',
    'Forgetting ::before/::after create extra render objects affecting layout.',
  ],
  production: {
    performance: [
      'Use display:none or remove nodes instead of visibility:hidden when no space needed',
      'content-visibility: auto for long scroll pages',
      'Keep off-screen modals out of DOM or display:none until open',
    ],
    observability: ['Elements panel “Rendering” tab shows layers and paint flashing'],
  },
  interview: {
    expectations: [
      'DOM + CSSOM → render tree → layout → paint → composite',
      'display:none vs visibility:hidden vs opacity:0',
      'Which nodes are excluded',
    ],
    commonQuestions: [
      'What is the render tree?',
      'Difference between DOM and render tree?',
      'Does display:none element take layout space?',
    ],
    followUps: [
      'How do pseudo-elements appear?',
      'What is content-visibility?',
    ],
    misconceptions: [
      'DOM equals what you see on screen',
      'visibility:hidden removes from layout',
    ],
    traps: ['Saying opacity:0 removes from render tree'],
    strongSignals: [
      'Prunes display:none subtrees',
      'Pseudo-elements included',
      'Links to full critical rendering path',
    ],
  },
  keyTakeaways: [
    'Render tree = visible DOM nodes + computed styles.',
    'Built from DOM + CSSOM; input to layout.',
    'display:none excludes subtree; visibility:hidden keeps layout space.',
    'Pseudo-elements get render objects.',
    'Not the same as DOM — fewer nodes.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What inputs build the render tree?',
      answerHint: 'DOM tree and CSSOM with computed styles per element.',
    },
    {
      level: 'intermediate',
      question: 'display:none vs visibility:hidden in render tree?',
      answerHint: 'none: excluded entirely; hidden: in tree, laid out, not painted.',
    },
    {
      level: 'advanced',
      question: 'How does changing display affect the pipeline?',
      answerHint: 'Rebuild render tree branch, full layout for affected subtree, repaint.',
    },
  ],
  flashcards: [
    { front: 'Render tree', back: 'Visible styled nodes from DOM + CSSOM' },
    { front: 'display:none', back: 'Removed from render tree and layout' },
    { front: 'visibility:hidden', back: 'In render tree; no paint; keeps space' },
  ],
  quickRevision: [
    'DOM + CSSOM → render tree',
    'Only visible nodes + pseudo-elements',
    'display:none prunes subtree',
    'visibility:hidden keeps layout box',
    'Render tree feeds layout engine',
    'Not identical to DOM',
  ],
}
