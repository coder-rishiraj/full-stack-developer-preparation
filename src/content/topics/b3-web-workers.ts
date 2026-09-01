import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Web Workers are browser threads that run JavaScript off the main thread — sharing no DOM access but communicating via postMessage — used for CPU-heavy work, parsing, cryptography, and background processing without blocking UI and the event loop.',
  whyExists:
    'Main thread runs JS, layout, paint, and input. Heavy computation freezes scrolling and React renders. Workers parallelize CPU work while the main thread stays responsive; Service Workers extend the model for network proxying.',
  mentalModel:
    'Separate JS VM with its own event loop. No window, document, or parent DOM. Clone or transfer ArrayBuffers across postMessage. Spawn from main; terminate when done. Dedicated worker per script; SharedWorker rare; Service Worker for fetch intercept.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Main: new Worker(url) or new Worker(url, { type: "module" }).',
        'Worker script loads and runs independently.',
        'Communication: postMessage(data) + onmessage; structured clone or transferables.',
        'Worker terminates: worker.terminate() or self.close() inside worker.',
        'Errors surface via worker.onerror on main thread.',
      ],
    },
    {
      type: 'mermaid',
      caption: 'Main ↔ Worker messaging',
      diagram: `sequenceDiagram
  participant M as Main thread
  participant W as Web Worker
  M->>W: postMessage(largeBuffer, [buffer])
  W->>W: CPU work on buffer
  W->>M: postMessage(result)
  M->>M: update UI (React setState)`,
    },
    {
      type: 'table',
      headers: ['Worker type', 'Use case'],
      rows: [
        ['Dedicated Worker', 'One-off heavy task, parser, crypto'],
        ['Shared Worker', 'Shared state across tabs (rare)'],
        ['Service Worker', 'Fetch proxy, offline, push'],
        ['Worklet (Paint/Audio)', 'Specialized low-latency hooks'],
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'javascript',
      caption: 'Main thread + worker',
      code: `// main.js
const worker = new Worker(new URL('./hash.worker.js', import.meta.url), {
  type: 'module',
});

worker.postMessage({ chunks: data });
worker.onmessage = (e) => setResult(e.data);

// hash.worker.js
self.onmessage = (e) => {
  const hash = expensiveHash(e.data.chunks);
  self.postMessage(hash);
};`,
    },
    {
      type: 'code',
      language: 'javascript',
      caption: 'Transferable ArrayBuffer (zero-copy move)',
      code: `const buf = new ArrayBuffer(1024 * 1024);
worker.postMessage({ buf }, [buf]); // buf detached on main — ownership transferred`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Structured clone duplicates most objects; functions/DOM not cloneable.',
        'Transferables move ownership — main loses access after post.',
        'Workers can fetch and use IndexedDB (origin-scoped).',
        'Module workers support ESM import in supported bundlers (Vite).',
        'Comlink library wraps postMessage as async RPC.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Keeps main thread responsive during CPU work',
      'True parallel JS on multi-core machines',
      'Isolates crashes if handled (worker error event)',
    ],
    disadvantages: [
      'No DOM — must marshal data via messages',
      'postMessage clone cost for large objects',
      'Worker startup overhead — not for tiny tasks',
      'Debugging harder than main thread',
    ],
    alternatives: [
      'requestIdleCallback for low-priority main-thread work',
      'Chunk work with setTimeout(0) / scheduler.yield (still main thread)',
      'WASM for numeric hotspots',
    ],
    whenToUse: [
      'Image/video processing, large JSON parse, crypto',
      'Search index build, diff algorithms',
      'Off-main-thread data transforms before React render',
    ],
    whenNotToUse: [
      'DOM manipulation (impossible in worker)',
      'Small tasks where startup > savings',
      'Shared mutable state without message discipline',
    ],
  },
  failureModes: [
    'Posting huge objects every frame — clone overhead kills perf.',
    'Forgetting to terminate workers — memory leak.',
    'Assuming worker shares variables with main (separate heaps).',
    'CORS/worker script must be same-origin or proper CORS for classic workers.',
    'React state updates only from main onmessage handler.',
  ],
  production: {
    performance: [
      'Pool workers for repeated tasks',
      'Transfer ArrayBuffers instead of cloning',
      'Measure worker startup vs work size threshold',
    ],
    reliability: ['worker.onerror logging; fallback to main-thread degraded mode'],
    maintainability: ['Comlink or typed message protocol for worker API'],
  },
  interview: {
    expectations: [
      'Workers run JS off main thread, no DOM',
      'postMessage communication model',
      'When workers help vs hurt',
    ],
    commonQuestions: [
      'What are Web Workers?',
      'Can workers access DOM?',
      'Worker vs Service Worker?',
    ],
    followUps: [
      'Transferable vs structured clone?',
      'How integrate with React?',
    ],
    misconceptions: [
      'Workers share memory with main by default',
      'Workers fix all performance problems',
      'Service Worker is just a named Web Worker (different lifecycle/purpose)',
    ],
    traps: ['Suggesting workers for DOM updates'],
    strongSignals: [
      'No DOM — postMessage only',
      'Transferables for large binary data',
      'Main thread stays for UI/React',
    ],
  },
  keyTakeaways: [
    'Separate thread; own event loop; no DOM.',
    'postMessage + structured clone / transferables.',
    'Use for CPU-heavy work blocking main thread.',
    'Service Worker = network/offline layer, not general compute.',
    'Pool/terminate workers; avoid tiny-task overhead.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Can a Web Worker modify the DOM?',
      answerHint: 'No — no document/window; communicate results to main for UI updates.',
    },
    {
      level: 'intermediate',
      question: 'Transferable vs structured clone?',
      answerHint: 'Transfer moves ArrayBuffer ownership zero-copy; clone duplicates data.',
    },
    {
      level: 'advanced',
      question: 'Web Worker vs Service Worker?',
      answerHint: 'Dedicated worker for compute; service worker intercepts fetch, push, offline — different registration and lifecycle.',
    },
  ],
  flashcards: [
    { front: 'Web Worker DOM', back: 'No access — postMessage to main' },
    { front: 'Transferable', back: 'Move ArrayBuffer ownership without copy' },
    { front: 'Service Worker', back: 'Network proxy / offline — not general CPU offload' },
  ],
  quickRevision: [
    'Off-main-thread JS',
    'No DOM access',
    'postMessage communication',
    'CPU-heavy tasks',
    'Transfer large buffers',
    'Service Worker ≠ dedicated worker',
  ],
}
