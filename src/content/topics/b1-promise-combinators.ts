import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Promise combinators are static methods — `Promise.all`, `Promise.allSettled`, `Promise.race`, and `Promise.any` — that aggregate multiple Promises into one. They define how fulfillment, rejection, and timing combine for parallel async workflows.',
  whyExists:
    'Real apps fetch many resources concurrently. Combinators express common patterns (wait for all, first wins, all outcomes, first success) without manual counter/state machines and reduce bugs in parallel vs sequential awaits.',
  mentalModel:
    'all: team must all finish — one failure cancels the mission. allSettled: everyone reports back win or lose. race: first across the line decides (fulfill or reject). any: first success wins; all fail → AggregateError.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Promise.all(iterable): fail-fast on first reject; fulfill with array of results in order.',
        'Promise.allSettled(iterable): never reject wrapper; array of { status, value|reason }.',
        'Promise.race(iterable): settle when first Promise settles (fulfill or reject).',
        'Promise.any(iterable): fulfill on first fulfillment; reject AggregateError if all reject.',
        'Non-Promise elements wrapped with Promise.resolve.',
      ],
    },
    {
      type: 'table',
      headers: ['Method', 'Resolves when', 'Rejects when', 'Result shape'],
      rows: [
        ['all', 'All fulfill', 'First rejection', 'Array of values'],
        ['allSettled', 'All settled', 'Never (wrapper)', 'Array of outcome objects'],
        ['race', 'First settle', 'First rejection if first', 'First value/reason'],
        ['any', 'First fulfillment', 'All rejected', 'First value / AggregateError'],
      ],
    },
  ],
  architecture: {
    mermaid: `flowchart TB
  P1[Promise 1]
  P2[Promise 2]
  P3[Promise 3]
  All[Promise.all]
  Settled[allSettled]
  Race[race]
  Any[any]
  P1 --> All
  P2 --> All
  P3 --> All
  P1 --> Settled
  P2 --> Settled
  P3 --> Settled
  P1 --> Race
  P2 --> Race
  P3 --> Race
  P1 --> Any
  P2 --> Any
  P3 --> Any`,
    caption: 'Four aggregation strategies over the same Promise set',
  },
  example: [
    {
      type: 'code',
      language: 'javascript',
      caption: 'Parallel fetch with all vs allSettled',
      code: `const urls = ['/api/a', '/api/b', '/api/c'];

// Fail-fast — one 404 rejects entire all
const data = await Promise.all(urls.map((u) => fetch(u).then((r) => r.json())));

// Always get per-URL outcome
const outcomes = await Promise.allSettled(
  urls.map((u) => fetch(u).then((r) => r.json()))
);
outcomes.forEach((o, i) => {
  if (o.status === 'fulfilled') console.log(urls[i], o.value);
  else console.error(urls[i], o.reason);
});`,
    },
    {
      type: 'code',
      language: 'javascript',
      caption: 'race and any',
      code: `const timeout = (ms) =>
  new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms));

// First to settle wins (often used for timeout — careful: reject can win)
await Promise.race([fetch('/api'), timeout(5000)]);

// First success among mirrors
const fastest = await Promise.any([
  fetch('https://cdn1/data'),
  fetch('https://cdn2/data'),
]);`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'all implementation: atomic counter + result array; first reject triggers reject.',
        'allSettled: must wait for every input — no short-circuit.',
        'race: attaches then to all; first settled unhooks others (implementation detail).',
        'any: AggregateError.errors holds all rejection reasons (ES2021).',
        'Empty iterable: all/allSettled/race resolve []; any rejects AggregateError.',
      ],
    },
  ],
  implementation: [
    {
      language: 'javascript',
      caption: 'Interview-style Promise.all sketch',
      code: `function promiseAll(iterable) {
  return new Promise((resolve, reject) => {
    const arr = Array.from(iterable);
    if (arr.length === 0) return resolve([]);
    const results = new Array(arr.length);
    let pending = arr.length;
    arr.forEach((p, i) => {
      Promise.resolve(p).then(
        (val) => {
          results[i] = val;
          if (--pending === 0) resolve(results);
        },
        reject // fail-fast
      );
    });
  });
}`,
    },
  ],
  tradeoffs: {
    advantages: [
      'Declarative parallel patterns',
      'allSettled for partial failure tolerance',
      'any for redundant CDN/mirror racing',
    ],
    disadvantages: [
      'all fail-fast may waste completed work',
      'race with timeout rejects on slow path even if fetch would succeed',
      'No built-in cancellation when one wins',
    ],
    alternatives: ['Manual async pool with concurrency limit', 'AbortController per fetch', 'p-limit library'],
    whenToUse: ['all independent parallel I/O', 'allSettled dashboards', 'any mirror endpoints'],
    whenNotToUse: ['Sequential deps — await in loop; all with dependent steps'],
  },
  failureModes: [
    'Promise.all — one failure loses all results (use allSettled).',
    'race timeout pattern rejects instead of ignoring slow branch.',
    'Forgetting Promise.resolve on non-promise elements (handled by spec but know it).',
    'Unhandled rejection from losing branches still possible — attach catch.',
  ],
  production: {
    performance: ['Parallel all vs sequential — wall clock ≈ max latency not sum'],
    reliability: ['allSettled + retry for bulk jobs; any with health-checked mirrors'],
    observability: ['Log AggregateError.errors from any for per-source diagnosis'],
  },
  interview: {
    expectations: [
      'Compare all four combinators',
      'Implement Promise.all',
      'race vs any distinction',
    ],
    commonQuestions: ['all vs allSettled?', 'Promise.race use case?', 'Implement all?'],
    followUps: ['Empty iterable behavior?', 'Cancel siblings on first success?'],
    misconceptions: ['all runs promises in parallel threads', 'race always returns success'],
    traps: ['Timeout via race rejects whole flow'],
    strongSignals: ['Fail-fast, AggregateError, order preserved in all, allSettled never rejects wrapper'],
  },
  keyTakeaways: [
    'all: all succeed or first reject; ordered results.',
    'allSettled: wait for every outcome; never rejects wrapper.',
    'race: first settle (fulfill or reject).',
    'any: first fulfill; all fail → AggregateError.',
    'Use allSettled when partial failure OK; AbortController for cancel.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'When does Promise.all reject?',
      answerHint: 'Immediately on first input rejection — fail-fast.',
    },
    {
      level: 'intermediate',
      question: 'Difference between Promise.race and Promise.any?',
      answerHint: 'race: first settle either way; any: first fulfillment, all reject → AggregateError.',
    },
    {
      level: 'advanced',
      question: 'Implement Promise.allSettled.',
      answerHint: 'Map each to {status,value|reason}; counter to resolve when all done.',
    },
  ],
  flashcards: [
    { front: 'Promise.all', back: 'All fulfill → array; first reject → reject' },
    { front: 'Promise.allSettled', back: 'All done; {status, value|reason}[]' },
    { front: 'Promise.any', back: 'First success; else AggregateError' },
  ],
  quickRevision: [
    'all: fail-fast parallel',
    'allSettled: all outcomes',
    'race: first settle',
    'any: first success',
    'Order preserved in all',
    'Non-promises → Promise.resolve',
  ],
}
