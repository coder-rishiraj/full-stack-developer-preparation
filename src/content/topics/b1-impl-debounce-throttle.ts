import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Implement debounce / throttle / memoize",
  "whatIsIt": "Implement debounce with clearTimeout/setTimeout storing latest args; expose cancel. Throttle with last-run timestamp or a locked flag plus optional trailing timeout. Memoize with a Map keyed by JSON.stringify(args) or the first argument; document identity vs deep keys. These are timer + closure exercises, not lodash imports.",
  "whyExists": "Every frontend interview eventually asks you to write debounce. Trailing vs leading is the follow-up.",
  "mentalModel": "Debounce: reset the timer. Throttle: locked door with a clock. Memoize: notebook of past (args→result).",
  "how": [
    "debounce: each call clearTimeout then setTimeout(fn, wait).",
    "throttle leading: if now-last>=wait, run and set last.",
    "trailing throttle: schedule a timeout for the leftover last args.",
    "memoize: cache.has(key) ? get : set(fn()).",
    "memoize only pure fns."
  ],
  "callout": {
    "title": "Watch for",
    "text": "JSON.stringify keys: object key order and undefined make cache misses/hits wrong.",
    "variant": "warning"
  },
  "example": "function debounce(fn, wait) {\n  let t; const d = (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), wait); };\n  d.cancel = () => clearTimeout(t); return d;\n}\nfunction throttle(fn, wait) {\n  let last = 0;\n  return (...a) => { const n = Date.now(); if (n - last >= wait) { last = n; fn(...a); } };\n}\nfunction memoize(fn) {\n  const c = new Map();\n  return (x) => c.has(x) ? c.get(x) : c.set(x, fn(x)).get(x);\n}\nconst f = memoize((n) => n * 2);\nconsole.log(f(3), f(3));\n",
  "exampleCaption": "debounce/throttle/memoize from closures and Map",
  "internals": [
    "Timers are host; your functions only close over ids.",
    "Map SameValueZero keys: NaN works, objects by identity.",
    "Trailing throttle is a debounce nested inside a throttle window."
  ],
  "takeaways": [
    "debounce: each call clearTimeout then setTimeout(fn, wait).",
    "throttle leading: if now-last>=wait, run and set last.",
    "JSON.stringify keys: object key order and undefined make cache misses/hits wrong.",
    "Timers are host; your functions only close over ids."
  ],
  "revision": [
    "Implement debounce / throttle / memoize: Debounce: reset the timer. Throttle: locked door with a clock. Memoize: notebook of past (args→result).",
    "debounce: each call clearTimeout then setTimeout(fn, wait).",
    "throttle leading: if now-last>=wait, run and set last.",
    "trailing throttle: schedule a timeout for the leftover last args.",
    "Trap: JSON.stringify keys: object key order and undefined make cache misses/hits wrong."
  ],
  "flashcards": [
    [
      "Implement debounce / throttle / memoize",
      "Implement debounce with clearTimeout/setTimeout storing latest args; expose cancel."
    ],
    [
      "Mental model",
      "Debounce: reset the timer. Throttle: locked door with a clock. Memoize: notebook of past (args→result)."
    ],
    [
      "Common trap",
      "JSON.stringify keys: object key order and undefined make cache misses/hits wrong."
    ],
    [
      "debounce: each call clearTimeout then setTimeout(fn, wait).",
      "throttle leading: if now-last>=wait, run and set last."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Implement debounce / throttle / memoize and where does a beginner first see it?",
      "answerHint": "Implement debounce with clearTimeout/setTimeout storing latest args; expose cancel. Throttle with last-run timestamp or a locked flag plus optional trailing timeout. Memoize with a Map keyed by JSON.stringify(args) or the first argument; document identity vs deep keys. These are timer + closure exercises, not lodash imports."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Implement debounce / throttle / memoize works and name the main pitfall.",
      "answerHint": "debounce: each call clearTimeout then setTimeout(fn, wait). throttle leading: if now-last>=wait, run and set last. trailing throttle: schedule a timeout for the leftover last args. memoize: cache.has(key) ? get : set(fn()). memoize only pure fns. Pitfall: JSON.stringify keys: object key order and undefined make cache misses/hits wrong."
    },
    {
      "level": "advanced",
      "question": "How would you explain Implement debounce / throttle / memoize at an interview, including engine/spec details?",
      "answerHint": "Timers are host; your functions only close over ids. Map SameValueZero keys: NaN works, objects by identity. Trailing throttle is a debounce nested inside a throttle window."
    }
  ],
  "pitfalls": [
    "JSON.stringify keys: object key order and undefined make cache misses/hits wrong.",
    "memoize only pure fns."
  ],
  "interview": {
    "expectations": [
      "Explain Implement debounce / throttle / memoize without mixing it up with a nearby B1.43 — JavaScript Implementation Exercises topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Timers are host; your functions only close over ids."
    ],
    "commonQuestions": [
      "What is Implement debounce / throttle / memoize?",
      "Why does JavaScript implement debounce / throttle / memoize behave this way?",
      "What is the classic Implement debounce / throttle / memoize interview trap?"
    ],
    "traps": [
      "JSON.stringify keys: object key order and undefined make cache misses/hits wrong."
    ],
    "misconceptions": [
      "Every frontend interview eventually asks you to write debounce. Trailing vs leading is the follow-up."
    ],
    "strongSignals": [
      "Separates Implement debounce / throttle / memoize from lookalike APIs and can draw the mental model."
    ]
  }
})
