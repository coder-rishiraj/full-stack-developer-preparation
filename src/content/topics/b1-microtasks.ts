import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Microtasks are high-priority jobs queued after the current synchronous call stack clears and before the next macrotask or render. In browsers and Node, Promise reactions (.then/catch/finally), queueMicrotask, and MutationObserver callbacks are microtasks.',
  whyExists:
    'Async continuations (especially Promises) must run soon and in predictable order without waiting for timers or I/O polling. Microtasks let the runtime finish logical “turns” of async work before yielding to slower macrotask sources.',
  mentalModel:
    'After sync code finishes, drain the microtask queue completely — like clearing urgent inbox before checking the mail slot. New microtasks scheduled during draining also run in the same turn (can starve macrotasks).',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Sync script runs until call stack empty.',
        'Engine drains microtask queue: dequeue, run, repeat until empty.',
        'Microtasks scheduled while draining run in same checkpoint.',
        'Then browser may render; then one macrotask runs.',
        'After macrotask, microtasks drain again before next macrotask.',
      ],
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'Promise = microtask',
      text: 'Promise.then/catch/finally handlers and async/await continuations enqueue microtasks — not macrotasks.',
    },
  ],
  architecture: {
    mermaid: `flowchart LR
  Sync[Sync code]
  MicroQ[Microtask queue]
  MacroQ[Macrotask queue]
  Sync -->|stack empty| MicroQ
  MicroQ -->|drain all| Render[Optional render]
  Render --> MacroQ
  MacroQ -->|one task| Sync
  Promise[Promise.then] --> MicroQ
  QM[queueMicrotask] --> MicroQ`,
    caption: 'Microtasks run after sync, before next macrotask',
  },
  example: [
    {
      type: 'code',
      language: 'javascript',
      caption: 'Promise beats setTimeout(0)',
      code: `console.log(1);
setTimeout(() => console.log(2), 0);
Promise.resolve().then(() => console.log(3));
queueMicrotask(() => console.log(4));
console.log(5);
// 1, 5, 3, 4, 2`,
    },
    {
      type: 'code',
      language: 'javascript',
      caption: 'Microtask storm',
      code: `function spin() {
  Promise.resolve().then(spin);
}
spin(); // timers/render starve until stack blow or tab hang`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'HTML spec: microtask checkpoint after each task (macrotask) and after script if stack empty.',
        'V8 uses microtask queue for Promise jobs; Node aligns for cross-platform mental model.',
        'await continuation is scheduled as microtask when Promise settles.',
        'queueMicrotask(fn) is explicit API — same queue as Promises.',
        'MutationObserver batches DOM mutations into microtasks (before paint).',
      ],
    },
  ],
  implementation: [
    {
      language: 'javascript',
      caption: 'Defer work to after current sync turn',
      code: `function afterCurrentTurn(fn) {
  queueMicrotask(fn);
  // equivalent: Promise.resolve().then(fn);
}`,
    },
    {
      language: 'typescript',
      caption: 'Yield to event loop without setTimeout delay',
      code: `async function yieldMicrotask(): Promise<void> {
  await Promise.resolve();
}
// Use in tight loops to allow paint/interrupt`,
    },
  ],
  tradeoffs: {
    advantages: [
      'Fast Promise/async continuations',
      'Consistent ordering before timers',
      'Good for DOM consistency before paint (MutationObserver)',
    ],
    disadvantages: [
      'Can starve macrotasks and rendering if queue never empties',
      'Harder mental model than “everything async is equal”',
      'Debugging ordering puzzles in interviews',
    ],
    alternatives: ['setTimeout(0) for lower priority (macrotask)', 'requestAnimationFrame for paint-aligned work'],
    whenToUse: ['Promise chains, await, immediate post-sync cleanup'],
    whenNotToUse: ['Intentionally delaying to next event loop turn for fairness — use macrotask'],
  },
  failureModes: [
    'Recursive Promise.resolve().then blocks UI and timers.',
    'Assuming setTimeout(0) runs before Promise.then.',
    'Mixing queueMicrotask storms with heavy sync in same turn.',
    'Testing flaky due to microtask vs macrotask ordering assumptions.',
  ],
  production: {
    performance: ['Avoid unbounded microtask recursion', 'Chunk work with await Promise.resolve() or setTimeout'],
    reliability: ['Understand test libs (fake timers) vs real microtask timing'],
    observability: ['Long task detection when microtasks + sync dominate'],
  },
  interview: {
    expectations: [
      'List microtask sources: Promise, queueMicrotask, MutationObserver',
      'Explain 1,5,3,4,2 ordering',
      'Drain completely before next macrotask',
    ],
    commonQuestions: ['Microtask vs macrotask?', 'Why Promise before setTimeout?', 'What is queueMicrotask?'],
    followUps: ['Can microtasks starve render?', 'Node vs browser differences?'],
    misconceptions: ['setTimeout(0) is “immediate” before Promises', 'Each then runs as separate macrotask'],
    traps: ['Nested then scheduling order', 'async IIFE vs sync IIFE timing'],
    strongSignals: ['Says “drain entire microtask queue”, cites Promise before timer'],
  },
  keyTakeaways: [
    'Microtasks run after sync, before next macrotask.',
    'Promise reactions and await continuations are microtasks.',
    'Queue drains completely in one checkpoint.',
    'Recursive microtasks can starve timers and paint.',
    'queueMicrotask === Promise.then scheduling priority.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Name three microtask sources in the browser.',
      answerHint: 'Promise.then, queueMicrotask, MutationObserver (accept process.nextTick in Node context).',
    },
    {
      level: 'intermediate',
      question: 'In what order do sync, Promise.then, and setTimeout(0) run?',
      answerHint: 'Sync first, then all microtasks, then macrotask timer.',
    },
    {
      level: 'advanced',
      question: 'How can microtasks starve rendering?',
      answerHint: 'Continuously enqueue microtasks — never reach render/macrotask phase.',
    },
  ],
  flashcards: [
    { front: 'Microtask timing', back: 'After sync stack empty, before next macrotask' },
    { front: 'Promise.then queue type', back: 'Microtask' },
    { front: 'Drain behavior', back: 'Run all microtasks in current checkpoint' },
  ],
  quickRevision: [
    'Post-sync, pre-macrotask',
    'Promise / queueMicrotask / MutationObserver',
    'Drain queue fully each turn',
    'Before setTimeout(0)',
    'async/await resume = microtask',
    'Avoid microtask infinite loops',
  ],
}
