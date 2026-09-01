import type { TopicContent } from '@/domain/types'

export const eventLoopContent: TopicContent = {
  whatIsIt:
    'The JavaScript event loop is the runtime mechanism that schedules when call-stack work, microtasks (promise jobs), and macrotasks (timers, I/O, UI messages) run in a single-threaded JS environment (browser or Node).',
  whyExists:
    'JS must remain responsive while performing async I/O and UI work without true parallel execution of JS on one thread. The loop multiplexes callbacks so long-running sync code blocks everything, while async work resumes later.',
  mentalModel:
    'One call stack. When the stack empties, drain the microtask queue completely, then take one macrotask, then repeat. Promises and queueMicrotask jump the line ahead of setTimeout(0).',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Run synchronous script until the call stack is empty.',
        'Checkpoint: run all microtasks (Promise then/catch/finally, queueMicrotask, MutationObserver). Newly queued microtasks also run in this turn.',
        'Render opportunity may occur (browser) if needed.',
        'Dequeue the next macrotask (timer, message, I/O, setImmediate in older Node models) and run it.',
        'Repeat from microtask drain.',
      ],
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'Browser vs Node nuances',
      text: 'Both share the microtask-before-next-macrotask idea. Node’s libuv phases (timers, poll, check) differ in detail; interview focus is usually browser + Promise ordering.',
    },
  ],
  architecture: {
    mermaid: `flowchart TB
  Stack[Call Stack]
  Micro[Microtask Queue]
  Macro[Macrotask Queue]
  Stack -->|empty| Micro
  Micro -->|drained| Render[Maybe render]
  Render --> Macro
  Macro -->|run one task| Stack
  Promise[Promise jobs] --> Micro
  Timer[setTimeout / setInterval] --> Macro
  UI[UI events / messages] --> Macro`,
    caption: 'Stack → microtasks → (render) → next macrotask',
  },
  example: [
    {
      type: 'code',
      language: 'javascript',
      caption: 'Classic ordering puzzle',
      code: `console.log('A');
setTimeout(() => console.log('B'), 0);
Promise.resolve().then(() => console.log('C'));
console.log('D');
// Order: A, D, C, B`,
    },
    {
      type: 'paragraph',
      text: 'A and D are sync. C is a microtask scheduled during the sync turn, so it runs before the timer macrotask B.',
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Execution context stack holds running functions; heap holds objects.',
        'async/await is Promise sugar: code after await continues as a microtask.',
        'Blocking the stack (tight CPU loop) freezes timers, paint, and Promise reactions.',
        'Web Workers move work off the main thread; messaging is async.',
      ],
    },
  ],
  implementation: [
    {
      language: 'javascript',
      caption: 'Prefer microtasks for immediate continuation; timers for delay',
      code: `await fetch(url);           // continuation = microtask
queueMicrotask(() => {});   // explicit microtask
setTimeout(fn, 0);          // macrotask — after microtasks`,
    },
  ],
  complexity: {
    notes:
      'Not algorithmic Big-O; fairness matters. Starving the loop with endless microtasks delays rendering and timers.',
  },
  tradeoffs: {
    advantages: [
      'Simple concurrency model for UI',
      'Predictable ordering rules for Promises vs timers',
    ],
    disadvantages: [
      'Single thread cannot use multiple cores for JS',
      'Poorly written sync code blocks UX',
    ],
    alternatives: ['Web Workers', 'WASM', 'Server-side parallelism'],
    whenToUse: ['UI apps, request handlers that await I/O'],
    whenNotToUse: ['Heavy CPU on the main thread without chunking/workers'],
  },
  failureModes: [
    'Microtask storms (recursive Promise.resolve().then) delay paint.',
    'Assuming setTimeout(0) runs “immediately” before Promises.',
    'Unhandled rejection behavior differs across environments.',
  ],
  production: {
    performance: ['Break long tasks; use scheduler/yield patterns', 'Measure Long Tasks in Performance panel'],
    reliability: ['Always handle rejections; abort fetches on unmount'],
    observability: ['User Timing marks around critical async paths'],
  },
  interview: {
    expectations: [
      'Correct A/D/C/B style ordering',
      'Define microtask vs macrotask with examples',
      'Explain why heavy sync hurts React rendering',
    ],
    commonQuestions: ['Output order with Promise + setTimeout', 'What does await do to the call stack?'],
    followUps: ['How does React 18 concurrent rendering interact with the loop?', 'Node event loop phases?'],
    misconceptions: ['async functions run on another thread'],
    traps: ['Confusing job queue details across engines'],
    strongSignals: ['Mentions “drain microtasks completely” and render opportunity'],
  },
  keyTakeaways: [
    'One JS thread: stack must clear before async callbacks.',
    'Microtasks (Promises) before next macrotask (timers).',
    'await continues as a microtask.',
    'Never block the main thread with heavy sync work.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Is JavaScript multi-threaded in the browser?',
      answerHint: 'JS on main thread is single-threaded; workers are separate.',
    },
    {
      level: 'intermediate',
      question: 'Why does Promise.then run before setTimeout(0)?',
      answerHint: 'Microtasks drain before the next macrotask.',
    },
    {
      level: 'advanced',
      question: 'How can microtasks starve rendering?',
      answerHint: 'Always-refilling microtask queue delays macrotasks/render.',
    },
  ],
  flashcards: [
    { front: 'Microtask examples', back: 'Promise reactions, queueMicrotask, MutationObserver' },
    { front: 'Macrotask examples', back: 'setTimeout, setInterval, message/UI events (typical interview set)' },
  ],
  quickRevision: [
    'Single-threaded JS call stack',
    'Empty stack → drain all microtasks → next macrotask',
    'Promises before setTimeout(0)',
    'async/await = Promise microtasks',
    'Blocking sync freezes UI/timers',
    'Workers for CPU off main thread',
  ],
}

/** Phase 4 registry export */
export const content = eventLoopContent
