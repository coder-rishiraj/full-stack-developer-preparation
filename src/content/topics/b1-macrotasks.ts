import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Macrotasks (tasks) are event-loop jobs scheduled from timers, I/O completion, UI events, and message channels. After the call stack clears and microtasks drain, the runtime picks the next macrotask — one per loop iteration (typical browser model).',
  whyExists:
    'Not all async work fits the urgent microtask queue. Timers, user input, network callbacks, and rendering need coarser scheduling so microtasks can finish Promise chains without interleaving arbitrary timer firings every tick.',
  mentalModel:
    'Macrotasks are the “next turn” queue: setTimeout, click handlers, fetch resolution (often), postMessage. Each macrotask starts a new turn: run it, drain microtasks, maybe render, then next macrotask.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Source schedules callback: timer fires, socket readable, user clicks, message posted.',
        'Callback queued in macrotask queue (implementation-specific multiple queues in Node).',
        'When stack empty and microtasks drained, dequeue one macrotask.',
        'Run macrotask → may enqueue more microtasks → drain again.',
        'Browser may render between macrotasks; repeat.',
      ],
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'Browser vs Node',
      text: 'Interviews usually cite setTimeout/setInterval, DOM events, postMessage as macrotasks. Node adds libuv phases (timers, poll, check/setImmediate) — same idea: coarser than Promise microtasks.',
    },
  ],
  architecture: {
    mermaid: `flowchart TB
  subgraph sources [Macrotask sources]
    T[setTimeout / setInterval]
    UI[UI events]
    IO[I/O callbacks]
    MSG[postMessage]
  end
  sources --> MQ[Macrotask queue]
  MQ --> Run[Run one task]
  Run --> Micro[Drain microtasks]
  Micro --> Paint[Render?]
  Paint --> MQ`,
    caption: 'One macrotask per loop iteration (typical)',
  },
  example: [
    {
      type: 'code',
      language: 'javascript',
      caption: 'Multiple timers — order of enqueue',
      code: `setTimeout(() => console.log('A'), 0);
setTimeout(() => console.log('B'), 0);
Promise.resolve().then(() => console.log('C'));
console.log('D');
// D, C, A, B — microtask C before both timers`,
    },
    {
      type: 'code',
      language: 'javascript',
      caption: 'Macrotask yields between turns',
      code: `console.log('start');
setTimeout(() => {
  console.log('timeout');
  Promise.resolve().then(() => console.log('micro inside timeout'));
}, 0);
Promise.resolve().then(() => console.log('micro'));
console.log('end');
// start, end, micro, timeout, micro inside timeout`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'setTimeout(fn, 0) is minimum delay — not guaranteed immediate; runs as macrotask after microtasks.',
        'setInterval can drift if macrotask handler exceeds interval.',
        'requestAnimationFrame is not a macrotask — runs before paint, different queue.',
        'Node: process.nextTick runs before microtasks (Node-specific, often cited in Node interviews).',
        'MessageChannel/setTimeout(0) used to polyfill macrotask deferral before queueMicrotask.',
      ],
    },
  ],
  implementation: [
    {
      language: 'javascript',
      caption: 'Defer to next macrotask (lower priority than microtask)',
      code: `function deferMacrotask(fn) {
  setTimeout(fn, 0);
  // or: postMessage('', '*') pattern in older codebases
}`,
    },
    {
      language: 'typescript',
      caption: 'Cooperative scheduling — chunk long work',
      code: `async function processBatch<T>(items: T[], fn: (x: T) => void, chunk = 100) {
  for (let i = 0; i < items.length; i++) {
    fn(items[i]);
    if (i % chunk === chunk - 1) {
      await new Promise((r) => setTimeout(r, 0)); // macrotask yield
    }
  }
}`,
    },
  ],
  tradeoffs: {
    advantages: [
      'Fair interleaving with UI and I/O',
      'Timers for debounce/throttle patterns',
      'Natural boundary for “next event loop turn”',
    ],
    disadvantages: [
      'setTimeout(0) not precise for timing',
      'Minimum delay clamping in background tabs',
      'One macrotask at a time can delay long handler chains',
    ],
    alternatives: ['queueMicrotask for urgent continuations', 'requestAnimationFrame for visual updates', 'Workers for CPU'],
    whenToUse: ['Debounce, throttle, yield long loops, delayed retries'],
    whenNotToUse: ['Promise continuation — use microtask (automatic with await)'],
  },
  failureModes: [
    'Assuming setTimeout(0) runs before Promise.then.',
    'setInterval stacking when handler slower than interval.',
    'Blocking macrotask handler freezes input and paint.',
    'Confusing rAF with setTimeout for animation.',
  ],
  production: {
    performance: ['Debounce resize/scroll; throttle high-frequency events', 'Break work across macrotasks'],
    reliability: ['Clear timers on unmount; use AbortSignal with fetch'],
    observability: ['INP measures slow event (macrotask) handlers'],
  },
  interview: {
    expectations: [
      'Examples: setTimeout, setInterval, I/O, UI events',
      'Run after microtasks in same overall turn ordering puzzles',
      'One macrotask then microtask drain pattern',
    ],
    commonQuestions: ['Macrotask vs microtask?', 'Order: sync, Promise, setTimeout?', 'What is setTimeout(0) really?'],
    followUps: ['Node event loop phases?', 'requestAnimationFrame vs setTimeout?'],
    misconceptions: ['Timers always fire exactly on schedule', 'Click handler is microtask'],
    traps: ['Zero delay timer vs Promise ordering', 'Nested setTimeout in same script turn'],
    strongSignals: ['Timers are macrotasks; run after microtask drain; chunk long work'],
  },
  keyTakeaways: [
    'Macrotasks = timers, UI events, many I/O callbacks.',
    'Scheduled after current microtask checkpoint.',
    'setTimeout(0) means “next macrotask”, not instant.',
    'One macrotask per loop tick (typical), then microtasks again.',
    'Use macrotasks to yield and keep UI responsive.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Is setTimeout(fn, 0) a microtask or macrotask?',
      answerHint: 'Macrotask — runs after microtasks drain.',
    },
    {
      level: 'intermediate',
      question: 'Why use setTimeout to break up long synchronous loops?',
      answerHint: 'Yields to macrotask — lets paint/input/microtasks run between chunks.',
    },
    {
      level: 'advanced',
      question: 'How does Node ordering differ with process.nextTick?',
      answerHint: 'nextTick before Promise microtasks; then macrotask phases — know high-level, not every libuv detail.',
    },
  ],
  flashcards: [
    { front: 'Macrotask examples', back: 'setTimeout, setInterval, UI events, I/O' },
    { front: 'setTimeout(0) meaning', back: 'Next macrotask after microtasks' },
    { front: 'vs microtask priority', back: 'Microtasks run first each turn' },
  ],
  quickRevision: [
    'Timers & UI = macrotasks',
    'After microtask drain',
    'One macrotask per loop tick',
    'setTimeout(0) ≠ immediate',
    'Chunk long work across macrotasks',
    'rAF is separate — paint timing',
  ],
}
