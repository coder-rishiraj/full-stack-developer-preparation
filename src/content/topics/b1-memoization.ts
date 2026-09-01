import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Memoization",
  "whatIsIt": "Memoization caches a function’s results by arguments so repeat calls skip work. It requires purity (or a defined invalidation). Keys are usually JSON.stringify(args) or a Map with the first object arg as key. Unbounded caches leak memory. Recursion (fib) is the teaching example.",
  "whyExists": "Expensive CPU or I/O with repeat inputs is common (selectors, recursive DP). Caching at the function boundary is a small, local optimization.",
  "mentalModel": "A notebook next to a calculator: if the question was asked, copy the old answer.",
  "how": [
    "Only memoize pure functions.",
    "Choose a key that distinguishes args (NaN, objects).",
    "Bound the cache (LRU) in long-lived apps.",
    "Do not memoize functions that take event objects unless you pick stable ids."
  ],
  "callout": {
    "title": "Watch for",
    "text": "JSON.stringify({a:1}) vs insertion-order keys — object argument identity vs deep equality is the usual cache miss/hit bug.",
    "variant": "warning"
  },
  "example": "function memoize(fn) {\n  const cache = new Map();\n  return function (x) {\n    if (cache.has(x)) return cache.get(x);\n    const v = fn(x);\n    cache.set(x, v);\n    return v;\n  };\n}\nlet work = 0;\nconst fib = memoize((n) => {\n  work += 1;\n  return n < 2 ? n : fib(n - 1) + fib(n - 2);\n});\nconsole.log(fib(10), work);\n",
  "exampleCaption": "Memoized recursive fib with a Map cache",
  "internals": [
    "Map uses SameValueZero for keys; NaN works as a key, +0/-0 collide.",
    "Closures keep the cache alive as long as the memoized function is reachable.",
    "A cache of object keys prevents those objects from being GC’d (strong Map)."
  ],
  "takeaways": [
    "Only memoize pure functions.",
    "Choose a key that distinguishes args (NaN, objects).",
    "JSON.stringify({a:1}) vs insertion-order keys — object argument identity vs deep equality is the usual cache miss/hit bug.",
    "Map uses SameValueZero for keys; NaN works as a key, +0/-0 collide."
  ],
  "revision": [
    "Memoization: A notebook next to a calculator: if the question was asked, copy the old answer.",
    "Only memoize pure functions.",
    "Choose a key that distinguishes args (NaN, objects).",
    "Bound the cache (LRU) in long-lived apps.",
    "Trap: JSON.stringify({a:1}) vs insertion-order keys — object argument identity vs deep equality is the usual cache miss/hit bug."
  ],
  "flashcards": [
    [
      "Memoization",
      "Memoization caches a function’s results by arguments so repeat calls skip work."
    ],
    [
      "Mental model",
      "A notebook next to a calculator: if the question was asked, copy the old answer."
    ],
    [
      "Common trap",
      "JSON.stringify({a:1}) vs insertion-order keys — object argument identity vs deep equality is the usual cache miss/hit bug."
    ],
    [
      "Only memoize pure functions.",
      "Choose a key that distinguishes args (NaN, objects)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Memoization and where does a beginner first see it?",
      "answerHint": "Memoization caches a function’s results by arguments so repeat calls skip work. It requires purity (or a defined invalidation). Keys are usually JSON.stringify(args) or a Map with the first object arg as key. Unbounded caches leak memory. Recursion (fib) is the teaching example."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Memoization works and name the main pitfall.",
      "answerHint": "Only memoize pure functions. Choose a key that distinguishes args (NaN, objects). Bound the cache (LRU) in long-lived apps. Do not memoize functions that take event objects unless you pick stable ids. Pitfall: JSON.stringify({a:1}) vs insertion-order keys — object argument identity vs deep equality is the usual cache miss/hit bug."
    },
    {
      "level": "advanced",
      "question": "How would you explain Memoization at an interview, including engine/spec details?",
      "answerHint": "Map uses SameValueZero for keys; NaN works as a key, +0/-0 collide. Closures keep the cache alive as long as the memoized function is reachable. A cache of object keys prevents those objects from being GC’d (strong Map)."
    }
  ],
  "pitfalls": [
    "JSON.stringify({a:1}) vs insertion-order keys — object argument identity vs deep equality is the usual cache miss/hit bug.",
    "Do not memoize functions that take event objects unless you pick stable ids."
  ],
  "interview": {
    "expectations": [
      "Explain Memoization without mixing it up with a nearby B1.9 — Functions topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Map uses SameValueZero for keys; NaN works as a key, +0/-0 collide."
    ],
    "commonQuestions": [
      "What is Memoization?",
      "Why does JavaScript memoization behave this way?",
      "What is the classic Memoization interview trap?"
    ],
    "traps": [
      "JSON.stringify({a:1}) vs insertion-order keys — object argument identity vs deep equality is the usual cache miss/hit bug."
    ],
    "misconceptions": [
      "Expensive CPU or I/O with repeat inputs is common (selectors, recursive DP). Caching at the function boundary is a small, local optimization."
    ],
    "strongSignals": [
      "Separates Memoization from lookalike APIs and can draw the mental model."
    ]
  }
})
