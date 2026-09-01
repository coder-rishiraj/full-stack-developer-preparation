import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'A Promise is an object representing the eventual completion or failure of an async operation. It holds a state (pending → fulfilled or rejected) and queues reaction handlers (.then/.catch/.finally) that run as microtasks when settled.',
  whyExists:
    'Callback pyramids (error-first, nested) are hard to read and compose. Promises standardize one async result, chaining, and error propagation — the foundation for fetch, async/await, and modern APIs.',
  mentalModel:
    'A Promise is a IOU: you get a ticket now; later the issuer settles it with a value or reason. Reactions you attach are queued and run after current sync work, before the next timer/macrotask.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Executor runs synchronously: (resolve, reject) => { ... }.',
        'First resolve/reject wins; further calls are ignored.',
        'then/onFulfilled/onRejected registered → jobs queued as microtasks when settled.',
        'Returned thenables are flattened (assimilation) — chain passes values down.',
        'Rejection propagates down chain until catch; unhandled rejection may crash/log.',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Always return in then',
      text: 'return fetchNext() chains; bare fetchNext() without return breaks the chain.',
    },
  ],
  architecture: {
    mermaid: `stateDiagram-v2
  [*] --> Pending
  Pending --> Fulfilled: resolve(value)
  Pending --> Rejected: reject(reason)
  Fulfilled --> [*]
  Rejected --> [*]
  note right of Pending: then/catch queue microtasks on settle`,
    caption: 'Promise state machine (settled is fulfilled or rejected)',
  },
  example: [
    {
      type: 'code',
      language: 'javascript',
      caption: 'Chaining and error propagation',
      code: `fetch('/api/user')
  .then((r) => {
    if (!r.ok) throw new Error(r.statusText);
    return r.json();
  })
  .then((user) => fetch(\`/api/posts/\${user.id}\`))
  .then((r) => r.json())
  .catch((err) => {
    console.error(err);
    return []; // recover — next then gets []
  })
  .finally(() => console.log('done'));`,
    },
    {
      type: 'code',
      language: 'javascript',
      caption: 'Executor runs sync — microtask ordering',
      code: `new Promise((resolve) => {
  console.log('sync');
  resolve(1);
}).then((v) => console.log('then', v));
console.log('after');
// sync, after, then 1`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Promise reactions are microtasks (same queue as queueMicrotask).',
        'then returns a new Promise — enables chaining.',
        'Promise.resolve(x) assimilates thenables (objects with .then).',
        'finally runs on fulfill/reject; its return value is ignored except thrown errors.',
        'Static helpers: all (fail-fast), allSettled, race, any.',
      ],
    },
  ],
  implementation: [
    {
      language: 'typescript',
      caption: 'Deferred pattern for manual resolve',
      code: `function defer<T>() {
  let resolve!: (v: T) => void;
  let reject!: (e: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}`,
    },
    {
      language: 'javascript',
      caption: 'Parallel vs sequential',
      code: `// Parallel — total time ≈ max(t1, t2)
const [a, b] = await Promise.all([fetchA(), fetchB()]);

// Sequential — total time ≈ t1 + t2
const a2 = await fetchA();
const b2 = await fetchB();`,
    },
  ],
  tradeoffs: {
    advantages: [
      'Flat async composition vs callbacks',
      'Standard error propagation with catch',
      'Interop with async/await',
    ],
    disadvantages: [
      'Easy to forget return in then',
      'Unhandled rejection footguns',
      'Debugging stack traces across microtasks',
    ],
    alternatives: ['async/await sugar', 'Observable streams', 'Callback APIs (legacy)'],
    whenToUse: ['fetch, DB drivers, any single-shot async result'],
    whenNotToUse: ['Multi-value streams — consider AsyncIterator/Observable'],
  },
  failureModes: [
    'Unhandled Promise rejection (missing catch).',
    'Floating Promise: async fn called without await/catch.',
    'Promise constructor anti-pattern — wrap sync code unnecessarily.',
    'Race without cancellation — stale response wins.',
  ],
  production: {
    performance: ['Use Promise.all for independent I/O', 'Avoid sequential awaits in loops when parallel OK'],
    reliability: ['Global unhandledRejection handler; always catch at boundaries'],
    observability: ['Trace IDs through async chains'],
  },
  interview: {
    expectations: [
      'Explain pending/fulfilled/rejected',
      'Why then runs after sync code',
      'Difference Promise.all vs allSettled vs race',
    ],
    commonQuestions: ['Implement Promise.all', 'What if then throws?', 'Executor sync or async?'],
    followUps: ['How does async/await desugar?', 'Cancel a fetch?'],
    misconceptions: ['Promises run on another thread', 'then always runs immediately'],
    traps: ['Nested Promise without return', 'Confusing resolve with return in then'],
    strongSignals: ['Microtask scheduling, assimilation, return for chaining'],
  },
  keyTakeaways: [
    'Promise = future value + state machine.',
    'Executor is synchronous; reactions are microtasks.',
    'Return values/ Promises from then to chain.',
    'Rejections propagate until catch.',
    'Promise.all fails fast; allSettled waits for all.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What states can a Promise be in?',
      answerHint: 'Pending, fulfilled, rejected; settled = fulfilled or rejected.',
    },
    {
      level: 'intermediate',
      question: 'Why does .then run after console.log following new Promise?',
      answerHint: 'Executor sync; then callback is microtask after current stack.',
    },
    {
      level: 'advanced',
      question: 'Implement Promise.all in interview',
      answerHint: 'Track count, reject on first error, resolve array when all done.',
    },
  ],
  flashcards: [
    { front: 'Promise reaction queue', back: 'Microtask queue' },
    { front: 'Promise.all vs allSettled', back: 'all: fail-fast; allSettled: all outcomes' },
    { front: 'Chaining rule', back: 'Return value/Promise from then' },
  ],
  quickRevision: [
    'pending → fulfilled | rejected',
    'Executor runs sync',
    'then/catch = microtasks',
    'return to chain; throw → reject',
    'all / allSettled / race / any',
    'Always handle rejections at edges',
  ],
}
