import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'HTML parsing is the browser\'s process of converting HTML byte stream into a DOM tree — tokenization, tree construction, handling malformed markup, and incremental parsing while bytes arrive. Scripts, CSS, and async/defer attributes interact with the parser and block or defer work.',
  whyExists:
    'Pages stream over the network. Incremental parsing lets the browser build DOM and fetch subresources early. Error-tolerant parsing ensures legacy pages render despite invalid HTML.',
  mentalModel:
    'Assembly line: bytes → tokens (start tag, end tag, text) → nodes attached to the tree under open-element stack. Parser meets <script> → may pause (classic sync script). CSS blocks render when linked in head.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Tokenizer reads characters; emits tokens per HTML5 spec.',
        'Tree builder creates nodes; foster parenting for mis-nested tags.',
        'DOCTYPE triggers standards vs quirks mode.',
        'Sync script without defer/async: parser pauses, script runs, then continues.',
        'defer scripts run after parse; async scripts run when downloaded (order not guaranteed).',
        'DOMContentLoaded — HTML parsed; load — all subresources fetched.',
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Parser-inserted scripts',
      text: 'document.write only during parse — calling after load clears or replaces document in some cases. Avoid in modern SPAs.',
    },
  ],
  architecture: {
    mermaid: `flowchart LR
  Bytes[HTML bytes]
  Token[Tokenizer]
  Tree[Tree builder / DOM]
  Script[Script execution]
  Bytes --> Token
  Token --> Tree
  Tree -->|sync script| Script
  Script --> Tree`,
    caption: 'Incremental parse with possible pauses for synchronous scripts',
  },
  example: [
    {
      type: 'code',
      language: 'html',
      caption: 'Script loading attributes',
      code: `<!-- Blocks parse + run immediately when reached -->
<script src="legacy.js"></script>

<!-- Downloads parallel, runs after document parsed, in order -->
<script defer src="app.defer.js"></script>

<!-- Downloads parallel, runs ASAP when ready — order varies -->
<script async src="analytics.async.js"></script>

<!-- Module scripts defer by default -->
<script type="module" src="app.module.js"></script>`,
    },
    {
      type: 'code',
      language: 'javascript',
      caption: 'Parse lifecycle events',
      code: `document.addEventListener('DOMContentLoaded', () => {
  // DOM tree built; images/styles may still be loading
  initUI();
});

window.addEventListener('load', () => {
  // All deferred resources loaded
  hideSplash();
});

// Parser vs script at end of body — classic pattern
// <script> at bottom runs after most DOM exists`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'HTML5 parsing algorithm error recovery — auto-close tags, implied tbody/tr.',
        'Preload scanner speculatively fetches resources while parser blocked.',
        'innerHTML and DOMParser parse fragments with separate contexts.',
        'template contents inert until activated — not in main DOM initially.',
        'Streaming SSR + hydration reconnects server HTML to client JS.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Incremental display — first paint before full download',
      'Fault tolerant legacy support',
      'defer/async/module for controlled script timing',
    ],
    disadvantages: [
      'Sync scripts in head block first paint',
      'Malformed HTML yields inconsistent cross-browser trees if non-standard',
      'document.write anti-pattern on loaded pages',
    ],
    alternatives: ['Module bundlers inlining critical CSS', 'SSR/SSG serving complete HTML', 'async component loading'],
    whenToUse: ['Understanding performance, script placement, hydration, SEO crawlability'],
    whenNotToUse: ['Relying on parser fixes for intentionally broken HTML in new apps'],
  },
  failureModes: [
    'Sync script in head delays DOMContentLoaded and TTI.',
    'Async scripts executing before DOM ready — null querySelector.',
    'Missing closing tags changing tree shape (browser-dependent recovery).',
    'Huge innerHTML parse blocks main thread.',
  ],
  production: {
    performance: ['defer/module scripts; critical CSS inline; scripts at end or defer', 'Preconnect/preload key assets'],
    reliability: ['DOMContentLoaded for DOM-ready init; load for asset-dependent code'],
    maintainability: ['Valid HTML5; validate in CI with html-validate'],
  },
  interview: {
    expectations: [
      'Parse pipeline overview',
      'defer vs async vs module',
      'DOMContentLoaded vs load',
    ],
    commonQuestions: ['How browser parses HTML?', 'defer vs async?', 'When DOMContentLoaded fires?'],
    followUps: ['What blocks parsing?', 'innerHTML parsing?'],
    misconceptions: ['Parser waits for all images before DOMContentLoaded'],
    traps: ['async order guarantee between two async scripts'],
    strongSignals: ['Tokenizer, sync script pause, preload scanner, defer default on modules'],
  },
  keyTakeaways: [
    'HTML → tokens → DOM tree incrementally.',
    'Sync scripts pause parsing; defer after parse; async when ready.',
    'DOMContentLoaded = DOM ready; load = all resources.',
    'HTML5 error-tolerant parsing — still write valid HTML.',
    'Module scripts defer by default.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What is DOMContentLoaded?',
      answerHint: 'Fires when HTML fully parsed; without waiting all images/stylesheets.',
    },
    {
      level: 'intermediate',
      question: 'Difference defer and async on script?',
      answerHint: 'defer: after parse, ordered; async: download parallel, run ASAP, unordered.',
    },
    {
      level: 'advanced',
      question: 'What happens when parser hits sync script in body?',
      answerHint: 'Parsing pauses; script fetched if external and executed; then parsing resumes.',
    },
  ],
  flashcards: [
    { front: 'DOMContentLoaded', back: 'HTML parsed — DOM ready' },
    { front: 'defer', back: 'Run after parse, preserve order' },
    { front: 'async', back: 'Run when downloaded — order not guaranteed' },
    { front: 'Sync script', back: 'Blocks HTML parser during execution' },
  ],
  quickRevision: [
    'Bytes → tokens → DOM',
    'Incremental parsing',
    'Sync script blocks parser',
    'defer vs async vs module',
    'DOMContentLoaded vs load',
    'Valid HTML still matters',
  ],
}
