import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Paint (or rasterization prep) is the browser phase that records drawing instructions — fill text, borders, backgrounds, shadows — for each layout box into display lists, determining visual appearance before compositing layers.',
  whyExists:
    'Layout knows where boxes are; paint knows what pixels to draw inside them. Separating paint from layout lets engines invalidate and redraw only affected regions when styles change without recomputing geometry.',
  mentalModel:
    'Layout gives rectangles; paint fills them with ops (drawText, drawRect, drawImage). Paint order follows stacking contexts (z-index, opacity groups). Some effects (box-shadow, border-radius) are expensive — they expand paint regions.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Walk layout tree in paint order (stacking context rules).',
        'For each box, emit draw commands: background, border, content, outlines.',
        'Text shaped with font glyphs; images decoded and scaled.',
        'Output: display list(s) per layer — sequences of paint ops.',
        'Rasterization turns display lists into bitmap tiles (often GPU).',
      ],
    },
    {
      type: 'table',
      headers: ['Change type', 'Typical invalidation'],
      rows: [
        ['color, background-color', 'Repaint affected elements'],
        ['box-shadow, border-radius', 'Repaint + larger damage region'],
        ['transform (no layout)', 'Often composite only — skip repaint of other layers'],
        ['visibility: hidden', 'Skip paint for subtree'],
        ['will-change: transform', 'Promote layer; isolate repaint'],
      ],
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'Repaint vs reflow',
      text: 'Reflow changes geometry; repaint redraws pixels. You can repaint without reflow (color change) but reflow usually implies repaint for affected areas.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'javascript',
      caption: 'Detecting paint in DevTools',
      code: `// Rendering tab → Paint flashing (green overlays)
// Performance recording: "Paint" and "Rasterize Paint" events

function highlight(el) {
  el.style.backgroundColor = '#ff0'; // repaint, no layout
}

function resize(el) {
  el.style.width = '200px'; // layout + paint
}`,
    },
    {
      type: 'code',
      language: 'css',
      caption: 'Expensive paint properties',
      code: `.card {
  box-shadow: 0 4px 24px rgba(0,0,0,.2); /* blurs = costly */
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea, #764ba2);
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Paint invalidation uses damage rects — only dirty regions redrawn.',
        'Stacking contexts: positioned + z-index, opacity < 1, transform, filter create groups.',
        'Fixed/sticky elements often get own compositor layers.',
        'Large border-radius + overflow:hidden forces offscreen surfaces.',
        'Canvas 2D and SVG have separate paint paths from HTML/CSS.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Incremental repaint limits work to changed regions',
      'Separating paint from layout enables partial updates',
    ],
    disadvantages: [
      'Complex effects (blur, shadow) expand paint cost',
      'Full-page repaints still happen on wide invalidations',
      'Over-promoting layers increases memory',
    ],
    alternatives: [
      'Simplify shadows/gradients on low-end devices',
      'Use CSS contain: paint to clip invalidation',
      'Promote animated elements to compositor layers',
    ],
    whenToUse: [
      'Visual-only CSS changes (color, visibility)',
      'Understanding DevTools paint flashing',
    ],
    whenNotToUse: [
      'Animating box-shadow every frame',
      'Large fixed backgrounds with scroll — consider compositor layers',
    ],
  },
  failureModes: [
    'Animating layout-triggering properties expecting paint-only perf.',
    'Huge damage rects when parent opacity/filter affects entire subtree.',
    'Ignoring paint cost of filter: blur() on large elements.',
    'Fixed position + transform creating excessive layer count.',
  ],
  production: {
    performance: [
      'Prefer transform/opacity for animations',
      'Reduce box-shadow/blur on scroll-linked elements',
      'contain: paint on cards/lists to limit invalidation',
    ],
    observability: ['DevTools Paint flashing; Performance panel Paint events'],
  },
  interview: {
    expectations: [
      'Paint records draw ops after layout',
      'Repaint without reflow examples',
      'Stacking context basics',
    ],
    commonQuestions: [
      'What happens in the paint phase?',
      'Does changing background-color trigger layout?',
      'What is a stacking context?',
    ],
    followUps: [
      'Paint vs composite?',
      'Why is box-shadow expensive?',
    ],
    misconceptions: [
      'Repaint always repaints whole page (damage rects)',
      'z-index always creates a layer (needs positioning + other triggers)',
    ],
    traps: ['Saying color change triggers reflow'],
    strongSignals: [
      'Display lists and damage regions',
      'Stacking context creation rules',
      'Expensive paint: shadow, blur, large gradients',
    ],
  },
  keyTakeaways: [
    'Paint fills layout boxes with draw commands.',
    'Repaint = redraw pixels; can happen without layout.',
    'color/background changes → repaint typically.',
    'Stacking contexts define paint order.',
    'Expensive: shadows, blurs, large border-radius.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What is the difference between layout and paint?',
      answerHint: 'Layout = geometry; paint = drawing appearance into display lists.',
    },
    {
      level: 'intermediate',
      question: 'Does changing color trigger reflow?',
      answerHint: 'Usually repaint only, not layout.',
    },
    {
      level: 'advanced',
      question: 'What creates a new stacking context?',
      answerHint: 'opacity<1, transform, filter, z-index on positioned, isolation, etc.',
    },
  ],
  flashcards: [
    { front: 'Paint phase', back: 'Record draw ops for layout boxes' },
    { front: 'Repaint', back: 'Redraw pixels without necessarily relayouting' },
    { front: 'Stacking context', back: 'Paint order group; z-index, opacity, transform…' },
  ],
  quickRevision: [
    'Paint follows layout',
    'Display lists of draw commands',
    'Repaint ≠ reflow',
    'color change → repaint',
    'Damage rects limit redraw',
    'Shadows/blurs costly',
  ],
}
