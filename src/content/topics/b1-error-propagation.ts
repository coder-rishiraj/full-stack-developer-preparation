import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Error propagation is how failures move through sync code (throw/catch), Promises (reject/catch chain), and async/await (try/catch). Unhandled errors crash sync stacks or trigger unhandledrejection; boundaries must catch at appropriate layers.',
  whyExists:
    'Without a consistent propagation model, failures silently disappear or crash processes. JS combines exception throwing with Promise rejection channels — async/await unifies them syntactically but microtask timing still applies.',
  mentalModel:
    'Sync: throw a ball upward until someone catches or it hits the floor (uncaught). Promises: rejection slides down the .then chain until .catch or unhandled rejection. async/await: try/catch wraps await like sync throw inside the async function body.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'throw in sync code unwinds stack to nearest catch; finally runs on path out.',
        'Promise rejection skips fulfilled handlers; catch/onRejected handles; return from catch fulfills next link.',
        'throw inside .then → rejected next Promise.',
        'await rejected Promise → throws in async function (catchable with try/catch).',
        'Unhandled: sync uncaught exception; Promise unhandledrejection event.',
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Floating Promises',
      text: 'Calling asyncFn() without await/catch creates a Promise that can reject unhandled. Always await or .catch at API boundaries.',
    },
  ],
  architecture: {
    mermaid: `flowchart TD
  Throw[throw / reject]
  Sync[catch block / finally]
  Then[Promise.then chain]
  Catch[.catch handler]
  Async[async try/catch]
  Unhandled[Uncaught / unhandledrejection]
  Throw -->|sync| Sync
  Throw -->|Promise| Then
  Then -->|no handler| Unhandled
  Then --> Catch
  Throw -->|await| Async
  Async -->|rethrow| Then`,
    caption: 'Errors flow up sync stack or down Promise chain until handled',
  },
  example: [
    {
      type: 'code',
      language: 'javascript',
      caption: 'Promise chain propagation',
      code: `Promise.resolve()
  .then(() => {
    throw new Error('boom');
  })
  .then(() => console.log('skipped'))
  .catch((err) => {
    console.log('caught', err.message);
    return 'recovered';
  })
  .then((v) => console.log(v)); // recovered`,
    },
    {
      type: 'code',
      language: 'javascript',
      caption: 'async/await + rethrow boundary',
      code: `async function loadUser(id) {
  try {
    const res = await fetch(\`/api/users/\${id}\`);
    if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
    return await res.json();
  } catch (err) {
    logger.error(err);
    throw err; // propagate to caller
  }
}

loadUser(1).catch((e) => showToast(e.message));`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Promise rejection tracking: host tracks outstanding rejections until handled.',
        'finally runs on fulfill or reject; thrown in finally rejects override.',
        'AggregateError from Promise.any when all fail.',
        'Error.cause chains errors for wrapping (ES2022).',
        'Domain/Zone patterns (Node legacy) — modern: AsyncLocalStorage for context.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Centralized error boundaries in Express/Koa middleware',
      'catch recovers chains without crashing',
      'async/await readable try/catch',
    ],
    disadvantages: [
      'Mixing callbacks, Promises, and sync throw is inconsistent',
      'Swallowed catch blocks hide bugs',
      'Stack traces split across microtasks',
    ],
    alternatives: ['Result/Either types (never throw)', 'Callback err-first (legacy)', 'Global handlers only as last resort'],
    whenToUse: ['catch at IO boundaries; rethrow domain errors; global handler for logging'],
    whenNotToUse: ['Empty catch {}; catch-all without rethrow in low-level libs without typing'],
  },
  failureModes: [
    'Unhandled Promise rejection in async main.',
    'catch returns undefined — downstream assumes success.',
    'throw in async without await — floating rejection.',
    'finally throw masks original error.',
  ],
  production: {
    performance: ['Avoid throw in hot inner loops for control flow — use return codes or Result'],
    reliability: ['process.on unhandledRejection; Express error middleware; Sentry capture at boundary'],
    observability: ['Log stack + cause; correlation IDs through async boundaries'],
    security: ['Do not leak internal error details to clients — map to safe messages'],
  },
  interview: {
    expectations: [
      'Rejection skips then to catch',
      'async await try/catch equivalence',
      'Difference throw in then vs throw before await',
    ],
    commonQuestions: ['What if then throws?', 'Unhandled rejection?', 'finally behavior?'],
    followUps: ['Error.cause?', 'Implement global safe handler?'],
    misconceptions: ['async automatically catches errors', 'catch must be adjacent to throw'],
    traps: ['Forgetting return in catch recovery chain', 'Nested Promise without return'],
    strongSignals: ['Microtask rejection, floating promise, rethrow pattern, boundary layers'],
  },
  keyTakeaways: [
    'Sync: throw → catch/finally up the stack.',
    'Promise: reject propagates until .catch; throw in then rejects next.',
    'await wraps rejection as throw in async body.',
    'Always handle at boundaries — avoid floating Promises.',
    'finally runs always; errors in finally can mask original.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What happens if a .then callback throws?',
      answerHint: 'Next Promise in chain rejected with thrown error.',
    },
    {
      level: 'intermediate',
      question: 'How do you handle errors in async/await?',
      answerHint: 'try/catch around await; or .catch on returned Promise.',
    },
    {
      level: 'advanced',
      question: 'What is an unhandled Promise rejection?',
      answerHint: 'Rejected Promise with no catch/handler before GC — event/crash in Node.',
    },
  ],
  flashcards: [
    { front: 'throw in .then', back: 'Rejects next link in chain' },
    { front: 'await rejected promise', back: 'Throws in async function' },
    { front: 'Floating Promise', back: 'async fn() without await/catch — unhandled risk' },
  ],
  quickRevision: [
    'Reject skips fulfilled then',
    'catch recovers; return continues chain',
    'async: try/catch around await',
    'Handle at IO boundaries',
    'finally always runs',
    'No empty catch in prod',
  ],
}
