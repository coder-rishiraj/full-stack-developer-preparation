import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Layout (also called reflow) is the browser phase that calculates exact geometry — position and size — of every render object in the render tree, producing a box tree with coordinates ready for painting.',
  whyExists:
    'CSS declares intent (flex, grid, percent widths); the layout engine resolves constraints into pixel positions. Without layout, the browser cannot know where to draw text, images, or hit-test clicks.',
  mentalModel:
    'Top-down constraint solving: parent width flows down; child intrinsic sizes bubble up. Changing width on one flex item can reflow siblings. Layout is expensive — minimize invalidations.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Layout reads computed styles and render tree structure.',
        'Block formatting: vertical stack; inline: horizontal line boxes.',
        'Flex/Grid: two-pass algorithms resolve flexible tracks and gaps.',
        'Absolute/fixed positioned elements removed from normal flow.',
        'Output: layout tree with x, y, width, height per box → passed to paint.',
      ],
    },
    {
      type: 'table',
      headers: ['Layout mode', 'Key behavior'],
      rows: [
        ['Block', 'Stack vertically; width fills container'],
        ['Inline', 'Flow horizontally; line breaks at container width'],
        ['Flex', 'Main/cross axis; flex-grow/shrink/basis'],
        ['Grid', 'Track sizing; explicit rows/columns'],
        ['Table', 'Legacy table layout algorithm'],
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Layout thrashing',
      text: 'Interleaving DOM reads (offsetWidth, getBoundingClientRect) with writes forces synchronous layout each time — batch reads then writes.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'javascript',
      caption: 'Forced synchronous layout (layout thrashing)',
      code: `// BAD: read-write-read-write forces layout each iteration
elements.forEach(el => {
  el.style.width = el.offsetWidth + 10 + 'px'; // offsetWidth forces layout
});

// GOOD: batch reads, then writes
const widths = elements.map(el => el.offsetWidth);
elements.forEach((el, i) => {
  el.style.width = widths[i] + 10 + 'px';
});`,
    },
    {
      type: 'code',
      language: 'css',
      caption: 'Flex layout triggers',
      code: `.toolbar { display: flex; gap: 8px; }
/* Changing .toolbar width reflows all flex items */
.item { flex: 1 1 auto; }`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Incremental layout: engines mark dirty subtrees, not always full document.',
        'Subpixel layout: floats stored as fractions; rounding causes 1px gaps.',
        'Scroll containers create nested layout boundaries.',
        'contain: layout / content-visibility limits reflow scope.',
        'Fonts loading shift layout when metrics differ (FOUT/CLS).',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Automatic responsive geometry from declarative CSS',
      'Flex/Grid solve complex UIs without manual pixel math',
    ],
    disadvantages: [
      'Layout is CPU-heavy on large DOMs',
      'Geometry-changing styles trigger full subtree reflow',
      'Reading layout properties mid-mutation forces sync layout',
    ],
    alternatives: [
      'transform/opacity for animations (composite-only, skip layout)',
      'CSS contain to isolate reflow',
      'Virtualization to reduce layout node count',
    ],
    whenToUse: [
      'Structural CSS — flow, flex, grid for page layout',
      'getBoundingClientRect when you need accurate positions',
    ],
    whenNotToUse: [
      'Animating width/height/top/left every frame — use transform',
      'Polling offsetWidth in requestAnimationFrame loops without need',
    ],
  },
  failureModes: [
    'Layout thrashing from interleaved read/write in loops or React effects.',
    'Percent height without defined parent height collapses to 0.',
    'Flex min-width:auto prevents shrinking below content — overflow surprises.',
    'Cumulative Layout Shift from images without dimensions or late web fonts.',
  ],
  production: {
    performance: [
      'Batch DOM geometry reads; use DocumentFragment for bulk inserts',
      'Set width/height on images and embeds to reserve space',
      'Use transform for movement animations',
      'contain: strict on isolated widgets',
    ],
    observability: ['Performance: Layout events; CLS in Web Vitals'],
    reliability: ['font-display: optional or size-adjust to reduce CLS'],
  },
  interview: {
    expectations: [
      'Layout = reflow = geometry calculation',
      'What properties trigger layout vs paint vs composite only',
      'Layout thrashing pattern and fix',
    ],
    commonQuestions: [
      'What is reflow/layout?',
      'What causes forced synchronous layout?',
      'Flex vs Grid when to use?',
    ],
    followUps: [
      'How does contain: layout help?',
      'Why is transform cheaper than top/left animation?',
    ],
    misconceptions: [
      'Every style change reflows entire page (usually subtree)',
      'getComputedStyle is free (can force style + layout)',
    ],
    traps: ['Listing only width/height as layout triggers — missing flex, font-size, display'],
    strongSignals: [
      'Batch reads/writes anti-thrashing',
      'transform/opacity skip layout',
      'Incremental dirty subtree reflow',
    ],
  },
  keyTakeaways: [
    'Layout computes positions and sizes from render tree.',
    'Also called reflow; expensive on large trees.',
    'Geometry properties: width, height, flex, grid, font-size, display…',
    'Read layout then write — never interleave.',
    'transform/opacity animate on compositor without layout.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What does the layout phase produce?',
      answerHint: 'Box geometry — x, y, width, height for each render object.',
    },
    {
      level: 'intermediate',
      question: 'What is layout thrashing?',
      answerHint: 'Alternating DOM reads forcing sync layout with writes in a loop.',
    },
    {
      level: 'advanced',
      question: 'Which CSS changes skip layout?',
      answerHint: 'Compositor-only: transform, opacity (often); not width/margin/display.',
    },
  ],
  flashcards: [
    { front: 'Layout / reflow', back: 'Calculate box positions and sizes' },
    { front: 'Forced sync layout', back: 'Read geometry after DOM change before engine would naturally layout' },
    { front: 'Layout-free animation', back: 'transform and opacity (typically compositor-only)' },
  ],
  quickRevision: [
    'Layout = geometry from render tree',
    'Reflow = layout recalculation',
    'Flex/Grid = layout algorithms',
    'Batch reads then writes',
    'width/display/flex trigger layout',
    'transform skips layout for animation',
  ],
}
