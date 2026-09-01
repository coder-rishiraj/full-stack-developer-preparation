import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'async/await is syntactic sugar over Promises: an async function always returns a Promise, and await pauses that function’s execution until a Promise settles, then resumes with the fulfilled value or throws on rejection.',
  whyExists:
    'Promise chains remain verbose for sequential logic and try/catch ergonomics. async/await reads like synchronous code while preserving non-blocking I/O and standard Promise composition.',
  mentalModel:
    'async marks a function as “returns a Promise.” await is a yield point: save local state, let the call stack clear, continue later as a microtask when the awaited Promise settles. Other code can run in between.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Call async fn → immediate Promise returned (outer).',
        'Run body until first await on pending Promise → suspend async frame.',
        'When awaited Promise settles, continuation enqueued as microtask.',
        'Resume after await; rejected await throws catchable error.',
        'Return value becomes Promise.resolve(value); throw → rejected Promise.',
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Sequential vs parallel',
      text: 'Two awaits in a row run sequentially. Use Promise.all([await a(), await b()]) wrong — await inside array still sequential. Correct: Promise.all([a(), b()]).',
    },
  ],
  architecture: {
    mermaid: `sequenceDiagram
  participant Main
  participant AsyncFn
  participant Promise
  Main->>AsyncFn: call async fn
  AsyncFn->>Main: return outer Promise
  AsyncFn->>Promise: await p
  Note over AsyncFn: suspend — stack clears
  Promise-->>AsyncFn: microtask resume
  AsyncFn->>Main: resolve outer Promise`,
    caption: 'await suspends async function, not the whole thread',
  },
  example: [
    {
      type: 'code',
      language: 'typescript',
      caption: 'Sequential with try/catch',
      code: `async function loadDashboard(userId: string) {
  try {
    const user = await fetchUser(userId);
    const posts = await fetchPosts(user.id);
    return { user, posts };
  } catch (e) {
    console.error('dashboard failed', e);
    throw e;
  }
}`,
    },
    {
      type: 'code',
      language: 'javascript',
      caption: 'Parallel fetch',
      code: `async function loadBoth() {
  const [user, settings] = await Promise.all([
    fetchUser(),
    fetchSettings(),
  ]);
  return { user, settings };
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Desugars to Promise chains + generator-like state machine (engine-dependent).',
        'await non-Promise values → Promise.resolve(value).',
        'Top-level await (modules) blocks module graph evaluation until settled.',
        'async fn errors become rejected Promises unless caught inside.',
        'Stack trace may show async gaps across await boundaries.',
      ],
    },
  ],
  templates: [
    {
      language: 'typescript',
      caption: 'Retry with exponential backoff',
      code: `async function withRetry<T>(
  fn: () => Promise<T>,
  attempts = 3,
  baseMs = 100,
): Promise<T> {
  let last: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (e) {
      last = e;
      if (i < attempts - 1) {
        await new Promise((r) => setTimeout(r, baseMs * 2 ** i));
      }
    }
  }
  throw last;
}`,
    },
    {
      language: 'javascript',
      caption: 'for-await-of on async iterables',
      code: `async function drain(stream) {
  for await (const chunk of stream) {
    process(chunk);
  }
}`,
    },
  ],
  tradeoffs: {
    advantages: [
      'Readable sequential async code',
      'try/catch/finally familiar ergonomics',
      'Still composes with Promise.all, race, etc.',
    ],
    disadvantages: [
      'Accidental sequential awaits hurt latency',
      'Debugging async stacks is harder',
      'Easy to forget await → floating Promise bugs',
    ],
    alternatives: ['Raw .then chains', 'RxJS for streams', 'Callbacks (legacy)'],
    whenToUse: ['Most modern JS/TS I/O and API layers'],
    whenNotToUse: ['Hot paths needing manual micro-optimization of task scheduling'],
  },
  failureModes: [
    'Missing await: function returns Promise<Promise<T>> or unhandled rejection.',
    'await in loop → N sequential round trips (use Promise.all when independent).',
    'async void event handler swallows errors unless try/catch.',
    'Blocking CPU inside async fn still blocks the event loop.',
  ],
  production: {
    performance: ['Batch independent awaits with Promise.all', 'Use AbortSignal for cancellation'],
    reliability: ['Lint @typescript-eslint/no-floating-promises', 'Boundary error handlers in HTTP middleware'],
    observability: ['OpenTelemetry async context propagation across await'],
  },
  interview: {
    expectations: [
      'async always returns a Promise',
      'await scheduling = microtask continuation',
      'Parallel vs sequential patterns',
    ],
    commonQuestions: ['What does await do to the call stack?', 'Convert then chain to async/await', 'Error handling?'],
    followUps: ['Top-level await?', 'How to cancel async work?'],
    misconceptions: ['await blocks the entire JS thread/runtime', 'async functions run in parallel automatically'],
    traps: ['for loop with await vs Promise.all', 'Returning without await inside async fn'],
    strongSignals: ['Mentions microtasks, outer Promise, Promise.all for parallelism'],
  },
  keyTakeaways: [
    'async fn returns a Promise always.',
    'await pauses only that async function — not the whole program.',
    'Continuations after await are microtasks.',
    'Use Promise.all for independent parallel work.',
    'Missing await is a common bug; use lint rules.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What does async function return if you return 42?',
      answerHint: 'Promise fulfilled with 42.',
    },
    {
      level: 'intermediate',
      question: 'Does await block the event loop?',
      answerHint: 'No — suspends async fn; other tasks run; resume via microtask.',
    },
    {
      level: 'advanced',
      question: 'How would you run 10 fetches in parallel with a concurrency limit?',
      answerHint: 'Pool/semaphore pattern; not naive await in loop for all 10 sequential.',
    },
  ],
  flashcards: [
    { front: 'async return type', back: 'Always Promise (wrapped value)' },
    { front: 'await scheduling', back: 'Microtask continuation when Promise settles' },
    { front: 'Parallel two async ops', back: 'Promise.all([f1(), f2()]) then await' },
  ],
  quickRevision: [
    'async → returns Promise',
    'await suspends async fn only',
    'Resume = microtask',
    'try/catch works on await reject',
    'Promise.all for parallel I/O',
    'Don’t forget await / floating promises',
  ],
}
