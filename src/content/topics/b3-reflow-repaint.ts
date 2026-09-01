import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Reflow (layout) and repaint are incremental invalidation stages in the browser rendering pipeline — reflow recalculates geometry when layout-affecting properties change; repaint redraws pixels when visual appearance changes without necessarily relayouting.',
  whyExists:
    'Recomputing the entire page on every DOM tweak would be unusably slow. Browsers mark dirty subtrees and skip work when possible. Engineers must know which changes trigger which stage to avoid jank and layout thrashing.',
  mentalModel:
    'Three cost tiers: (1) composite-only — transform/opacity; (2) repaint — color, visibility; (3) reflow+repaint — width, height, DOM insert. Reads after writes force synchronous reflow. Minimize tier 3 in hot paths.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Trigger examples', 'Reflow?', 'Repaint?', 'Composite?'],
      rows: [
        ['transform, opacity', 'No', 'Maybe', 'Often yes'],
        ['color, background', 'No', 'Yes', 'No'],
        ['width, height, font-size', 'Yes', 'Yes', 'No'],
        ['DOM insert/remove', 'Yes', 'Yes', 'No'],
        ['scroll (overflow)', 'No*', 'Maybe', 'Often compositor'],
      ],
    },
    {
      type: 'list',
      ordered: true,
      items: [
        'Style change → recalc style → mark layout/paint invalidation flags.',
        'If layout dirty: reflow subtree, update layout tree.',
        'If paint dirty: regenerate display lists, rasterize damage rects.',
        'Compositor may only reposition layers if transform changed.',
        'Forced sync layout: JS reads geometry mid-mutation before engine batches.',
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'The classic loop bug',
      text: 'forEach el => el.style.left = el.offsetLeft + 1) forces reflow per element. Batch reads, then batch writes.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'javascript',
      caption: 'Properties that force layout when read',
      code: `// Reading these after DOM mutation forces sync layout:
el.offsetWidth; el.offsetHeight; el.clientWidth;
el.getBoundingClientRect(); el.scrollTop;
getComputedStyle(el).width;

// FastDOM pattern: read phase then write phase
requestAnimationFrame(() => {
  const h = header.offsetHeight; // read
  sidebar.style.top = h + 'px';  // write
});`,
    },
    {
      type: 'code',
      language: 'css',
      caption: 'Reflow vs repaint only',
      code: `.box { width: 100px; background: red; }
/* width change → reflow + repaint */
/* background: blue → repaint only */`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Invalidation propagates up/down tree — sibling flex items reflow together.',
        'Document.hidden and visibility reduce work but differ in layout participation.',
        'ResizeObserver fires after layout; MutationObserver before paint.',
        'React setState batching reduces reflow count vs unbatched updates.',
        'contain: layout | paint | strict limits invalidation scope.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Incremental invalidation keeps updates fast for small changes',
      'Understanding stages enables targeted optimization',
    ],
    disadvantages: [
      'Easy to accidentally force sync layout in framework code',
      'Wide invalidations (body font-size) reflow entire document',
    ],
    alternatives: [
      'Virtual DOM diffing still hits real DOM reflow eventually',
      'Canvas for thousands of moving objects',
      'Web Workers for compute; not for DOM',
    ],
    whenToUse: [
      'Performance debugging with Paint flashing and Layout events',
      'Choosing animation properties consciously',
    ],
    whenNotToUse: [
      'Micro-optimizing repaint when network/JS is bottleneck',
    ],
  },
  failureModes: [
    'Layout thrashing in carousel/slider measuring each slide in loop.',
    'Reading scroll position in scroll handler then mutating DOM synchronously.',
    'Tables with auto layout — reflow cost grows with cell count.',
    'Hidden iframe or zero-size container still in DOM causing unexpected reflow.',
  ],
  production: {
    performance: [
      'Use transform for movement; avoid layout properties in rAF loops',
      'DocumentFragment for bulk DOM inserts — one reflow',
      'CSS contain on list items and cards',
      'Debounce resize handlers that read layout',
    ],
    observability: ['Long Tasks API; Performance layout/paint markers'],
    maintainability: ['Lint against offsetWidth in render paths where possible'],
  },
  interview: {
    expectations: [
      'Reflow = layout; repaint = redraw',
      'List common triggers for each',
      'Layout thrashing definition and fix',
    ],
    commonQuestions: [
      'Difference between reflow and repaint?',
      'What causes forced synchronous layout?',
      'How optimize animations?',
    ],
    followUps: [
      'How does contain help?',
      'React re-render vs browser reflow?',
    ],
    misconceptions: [
      'Repaint always follows reflow (reflow usually implies repaint)',
      'display:none causes reflow when toggled (yes — render tree change)',
    ],
    traps: ['Only mentioning width/height as reflow triggers'],
    strongSignals: [
      'Three-tier composite/paint/layout model',
      'Batch read/write pattern',
      'transform for animation',
    ],
  },
  keyTakeaways: [
    'Reflow = layout recalc; repaint = pixel redraw.',
    'Geometry/DOM changes → reflow; visual-only often → repaint.',
    'transform/opacity often avoid layout on animation frames.',
    'Interleaved read/write → forced sync layout (thrashing).',
    'Batch reads then writes in hot paths.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What is reflow?',
      answerHint: 'Recalculating layout geometry — also called layout.',
    },
    {
      level: 'intermediate',
      question: 'Changing font-size on body — what happens?',
      answerHint: 'Wide reflow — text metrics affect most descendants; repaint too.',
    },
    {
      level: 'advanced',
      question: 'How does contain: strict affect reflow?',
      answerHint: 'Isolates layout/paint to element subtree; limits propagation.',
    },
  ],
  flashcards: [
    { front: 'Reflow', back: 'Layout recalculation — geometry changes' },
    { front: 'Repaint', back: 'Redraw pixels — e.g. color, visibility' },
    { front: 'Layout thrashing', back: 'Sync layout forced by read/write interleaving' },
  ],
  quickRevision: [
    'Reflow = layout; repaint = draw',
    'width/DOM → reflow',
    'color → repaint often',
    'transform → composite tier',
    'Batch reads then writes',
    'Avoid offsetWidth in write loops',
  ],
}
