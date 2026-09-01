import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Compositing is the final rendering stage where the browser assembles pre-rasterized layers (bitmaps or GPU textures) on the GPU, applying transforms and opacity per layer to produce the final screen frame — often without redoing layout or paint.',
  whyExists:
    'Repainting the entire page every frame is too slow for 60fps animations. Promoting elements to compositor layers lets the GPU translate/scale/fade them independently, enabling smooth scroll and animation on the main thread’s critical path.',
  mentalModel:
    'Think Photoshop layers: each compositor layer is a texture. The compositor thread (in modern browsers) positions layers, applies transform/opacity, and blends. New layer ≈ memory cost. will-change and 3D transforms hint promotion.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Paint produces display lists; related ops grouped into layers.',
        'Layers rasterized to tiles (GPU textures).',
        'Compositor thread applies layer transform matrix and opacity.',
        'Layers blended in z-order; result swapped to screen (double buffering).',
        'Scroll often compositor-driven — main thread not blocked for layer scroll.',
      ],
    },
    {
      type: 'mermaid',
      caption: 'Main thread vs compositor',
      diagram: `flowchart TB
  Main[Main thread: JS layout paint]
  Main --> Layers[Layer tiles]
  Comp[Compositor thread]
  Layers --> Comp
  Comp --> Screen[Display frame]
  Input[Scroll / transform animation] --> Comp`,
    },
    {
      type: 'table',
      headers: ['Layer promotion trigger', 'Notes'],
      rows: [
        ['transform: translateZ(0) / 3D transform', 'Classic GPU layer hint'],
        ['will-change: transform', 'Advance promotion; remove after animation'],
        ['position: fixed', 'Often own layer'],
        ['<video>, <canvas>, iframe', 'Separate surfaces'],
        ['opacity animation', 'May promote depending on engine'],
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'css',
      caption: 'Compositor-friendly animation',
      code: `.slide-in {
  transform: translateX(100%);
  transition: transform 300ms ease;
}
.slide-in.open {
  transform: translateX(0); /* composite-only — no layout/paint per frame */
}

/* Avoid animating margin-left — triggers layout every frame */`,
    },
    {
      type: 'code',
      language: 'javascript',
      caption: 'Inspect layers in DevTools',
      code: `// Layers panel (Chrome): see compositor layer tree
// "Scrolling performance issues" often = main-thread paint during scroll
element.style.willChange = 'transform'; // before animation
// element.style.willChange = 'auto';   // after animation ends`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Layer explosion: too many promoted nodes → GPU memory pressure.',
        'Composited scrolling: fixed headers, parallax via separate layers.',
        'Sticky positioning creates compositor sticky layer constraints.',
        'Software raster fallback when GPU unavailable or layer too large.',
        'React 18 concurrent features still respect main-thread layout/paint boundaries.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      '60fps transform/opacity animations off main thread path',
      'Smooth scrolling for layer-backed content',
      'Isolates repaints to single layers',
    ],
    disadvantages: [
      'Each layer consumes GPU RAM',
      'Overuse of will-change causes layer explosion',
      'Subpixel text on promoted layers can look blurry when scaled',
    ],
    alternatives: [
      'CSS scroll-driven animations (where supported)',
      'Canvas/WebGL for heavy graphics',
      'Reduce DOM complexity instead of layer hacks',
    ],
    whenToUse: [
      'Animating transform/opacity',
      'Fixed navbars, modals with backdrop',
      'Video/canvas overlays',
    ],
    whenNotToUse: [
      'will-change on every list item preemptively',
      'translateZ(0) on all elements “for performance”',
    ],
  },
  failureModes: [
    'Layer explosion from blanket translateZ(0) — memory and slower compositing.',
    'Animating filter every frame — expensive, not compositor-free.',
    'will-change left on permanently — wasted memory.',
    'Assuming all scroll is compositor-only — content paint can still jank.',
  ],
  production: {
    performance: [
      'Animate transform/opacity only for high-frequency updates',
      'Toggle will-change only during animations',
      'Audit Layers panel for excessive layer count',
    ],
    observability: ['Rendering → Layer borders; Performance GPU track'],
    maintainability: ['Document why specific elements are promoted'],
  },
  interview: {
    expectations: [
      'Compositor assembles layers on GPU',
      'transform/opacity often skip layout/paint',
      'Layer promotion tradeoffs',
    ],
    commonQuestions: [
      'What is compositing?',
      'Why use transform instead of top for animation?',
      'What does will-change do?',
    ],
    followUps: [
      'Compositor thread vs main thread?',
      'What causes layer explosion?',
    ],
    misconceptions: [
      'Every element is its own layer',
      'GPU always faster (memory overhead)',
      'opacity never triggers paint',
    ],
    traps: ['Recommending translateZ(0) everywhere without caveat'],
    strongSignals: [
      'GPU layers + memory tradeoff',
      'Main vs compositor thread split',
      'Remove will-change after animation',
    ],
  },
  keyTakeaways: [
    'Compositing blends rasterized layers on GPU.',
    'transform/opacity animations often compositor-only.',
    'Layer promotion trades memory for animation smoothness.',
    'will-change hints promotion — use sparingly.',
    'Too many layers hurts performance.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What does the compositor do?',
      answerHint: 'Assembles painted layers with transforms/opacity into final frame, often on GPU.',
    },
    {
      level: 'intermediate',
      question: 'Why animate transform instead of left/top?',
      answerHint: 'Transform typically avoids layout/paint; compositor moves existing layer.',
    },
    {
      level: 'advanced',
      question: 'What is layer explosion?',
      answerHint: 'Too many compositor layers — GPU memory and compositing overhead grow.',
    },
  ],
  flashcards: [
    { front: 'Compositor', back: 'GPU blends layers into final frame' },
    { front: 'Compositor-only props', back: 'transform, opacity (typical interview answer)' },
    { front: 'will-change', back: 'Hints upcoming animation; promotes layer; remove after' },
  ],
  quickRevision: [
    'Paint → layers → compositor → screen',
    'GPU moves layers for transform/opacity',
    'Compositor thread ≠ main thread',
    'will-change sparingly',
    'Layer explosion = memory cost',
    'Fixed/video often own layers',
  ],
}
