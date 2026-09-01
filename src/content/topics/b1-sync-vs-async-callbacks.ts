import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Sync vs Async Callbacks",
  "whatIsIt": "A sync callback runs before the outer function returns (Array#map). An async callback runs in a later turn (fs.readFile, setTimeout). Mixing them in one API (sometimes sync cache hit, sometimes async) is Zalgo: the caller cannot reason about order. Always async or always sync per API.",
  "whyExists": "People write if (cache) cb() else network(cb) and create heisenbugs. ‘Do not release Zalgo’ is the cultural rule.",
  "mentalModel": "If I might call you before I return, you are sync. If I only call you from a queue, you are async. Pick one.",
  "how": [
    "Never optionally-sync-optionally-async the same callback.",
    "Use queueMicrotask to defer a cache hit if the API is async.",
    "map/forEach are sync — do not put them in the async bucket.",
    "Document it."
  ],
  "callout": {
    "title": "Watch for",
    "text": "A memoized async function that calls cb(value) synchronously on hit — consumers race.",
    "variant": "warning"
  },
  "example": "function zalgo(useCache, cb) {\n  if (useCache) cb('sync');\n  else setTimeout(() => cb('async'), 0);\n}\nlet order = [];\nzalgo(true, (v) => order.push(v));\norder.push('after');\nconsole.log(order);\norder = [];\nzalgo(false, (v) => order.push(v));\norder.push('after');\nconsole.log(order);\n",
  "exampleCaption": "Same API, two orders — Zalgo",
  "internals": [
    "The spec does not enforce async; library design does.",
    "Promise.resolve().then(cb) forces async even for cached values.",
    "Node callback style historically suffered this in early libs."
  ],
  "takeaways": [
    "Never optionally-sync-optionally-async the same callback.",
    "Use queueMicrotask to defer a cache hit if the API is async.",
    "A memoized async function that calls cb(value) synchronously on hit — consumers race.",
    "The spec does not enforce async; library design does."
  ],
  "revision": [
    "Sync vs Async Callbacks: If I might call you before I return, you are sync. If I only call you from a queue, you are async. Pick one.",
    "Never optionally-sync-optionally-async the same callback.",
    "Use queueMicrotask to defer a cache hit if the API is async.",
    "map/forEach are sync — do not put them in the async bucket.",
    "Trap: A memoized async function that calls cb(value) synchronously on hit — consumers race."
  ],
  "flashcards": [
    [
      "Sync vs Async Callbacks",
      "A sync callback runs before the outer function returns (Array#map)."
    ],
    [
      "Mental model",
      "If I might call you before I return, you are sync. If I only call you from a queue, you are async. Pick one."
    ],
    [
      "Common trap",
      "A memoized async function that calls cb(value) synchronously on hit — consumers race."
    ],
    [
      "Never optionally-sync-optionally-async the same callback.",
      "Use queueMicrotask to defer a cache hit if the API is async."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Sync vs Async Callbacks and where does a beginner first see it?",
      "answerHint": "A sync callback runs before the outer function returns (Array#map). An async callback runs in a later turn (fs.readFile, setTimeout). Mixing them in one API (sometimes sync cache hit, sometimes async) is Zalgo: the caller cannot reason about order. Always async or always sync per API."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Sync vs Async Callbacks works and name the main pitfall.",
      "answerHint": "Never optionally-sync-optionally-async the same callback. Use queueMicrotask to defer a cache hit if the API is async. map/forEach are sync — do not put them in the async bucket. Document it. Pitfall: A memoized async function that calls cb(value) synchronously on hit — consumers race."
    },
    {
      "level": "advanced",
      "question": "How would you explain Sync vs Async Callbacks at an interview, including engine/spec details?",
      "answerHint": "The spec does not enforce async; library design does. Promise.resolve().then(cb) forces async even for cached values. Node callback style historically suffered this in early libs."
    }
  ],
  "pitfalls": [
    "A memoized async function that calls cb(value) synchronously on hit — consumers race.",
    "Document it."
  ],
  "interview": {
    "expectations": [
      "Explain Sync vs Async Callbacks without mixing it up with a nearby B1.28 — Callbacks topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "The spec does not enforce async; library design does."
    ],
    "commonQuestions": [
      "What is Sync vs Async Callbacks?",
      "Why does JavaScript sync vs async callbacks behave this way?",
      "What is the classic Sync vs Async Callbacks interview trap?"
    ],
    "traps": [
      "A memoized async function that calls cb(value) synchronously on hit — consumers race."
    ],
    "misconceptions": [
      "People write if (cache) cb() else network(cb) and create heisenbugs. ‘Do not release Zalgo’ is the cultural rule."
    ],
    "strongSignals": [
      "Separates Sync vs Async Callbacks from lookalike APIs and can draw the mental model."
    ]
  }
})
