import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Sequential vs Parallel Async Work",
  "whatIsIt": "Sequential async: await a; await b — total time is sum. Parallel: start both, then await Promise.all — total time is max. Accidental sequential is mapping with await inside a for-loop when jobs were independent. Parallel needs care: overload, ordering, and failure policy (all vs allSettled).",
  "whyExists": "Latency is the UX. Independent I/O should overlap. Dependent steps cannot.",
  "mentalModel": "Cooking: boil water then cook pasta (sequential) vs preheat oven while chopping (parallel). Dependencies decide.",
  "how": [
    "Independent fetches: Promise.all.",
    "Each step needs the previous result: await in a loop.",
    "Limit concurrency with a pool.",
    "Do not all(hugeArray) of writes without a cap."
  ],
  "callout": {
    "title": "Watch for",
    "text": "for (const x of ids) { results.push(await fetch(x)) } when fetches were independent — slow.",
    "variant": "warning"
  },
  "example": "const job = (ms, v) => new Promise((r) => setTimeout(() => r(v), ms));\nconst t0 = Date.now();\nawait job(10, 1);\nawait job(10, 2);\nconsole.log('seq', Date.now() - t0);\nconst t1 = Date.now();\nawait Promise.all([job(10, 1), job(10, 2)]);\nconsole.log('par', Date.now() - t1);\n",
  "exampleCaption": "Two 10ms jobs: sequential ~20 vs parallel ~10",
  "internals": [
    "await on an already-started promise just waits; start time is when you constructed it.",
    "all registers then on each immediately.",
    "The event loop interleaves their completions as tasks/microtasks."
  ],
  "takeaways": [
    "Independent fetches: Promise.all.",
    "Each step needs the previous result: await in a loop.",
    "for (const x of ids) { results.push(await fetch(x)) } when fetches were independent — slow.",
    "await on an already-started promise just waits; start time is when you constructed it."
  ],
  "revision": [
    "Sequential vs Parallel Async Work: Cooking: boil water then cook pasta (sequential) vs preheat oven while chopping (parallel). Dependencies decide.",
    "Independent fetches: Promise.all.",
    "Each step needs the previous result: await in a loop.",
    "Limit concurrency with a pool.",
    "Trap: for (const x of ids) { results.push(await fetch(x)) } when fetches were independent — slow."
  ],
  "flashcards": [
    [
      "Sequential vs Parallel Async Work",
      "Sequential async: await a; await b — total time is sum."
    ],
    [
      "Mental model",
      "Cooking: boil water then cook pasta (sequential) vs preheat oven while chopping (parallel). Dependencies decide."
    ],
    [
      "Common trap",
      "for (const x of ids) { results.push(await fetch(x)) } when fetches were independent — slow."
    ],
    [
      "Independent fetches: Promise.all.",
      "Each step needs the previous result: await in a loop."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Sequential vs Parallel Async Work and where does a beginner first see it?",
      "answerHint": "Sequential async: await a; await b — total time is sum. Parallel: start both, then await Promise.all — total time is max. Accidental sequential is mapping with await inside a for-loop when jobs were independent. Parallel needs care: overload, ordering, and failure policy (all vs allSettled)."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Sequential vs Parallel Async Work works and name the main pitfall.",
      "answerHint": "Independent fetches: Promise.all. Each step needs the previous result: await in a loop. Limit concurrency with a pool. Do not all(hugeArray) of writes without a cap. Pitfall: for (const x of ids) { results.push(await fetch(x)) } when fetches were independent — slow."
    },
    {
      "level": "advanced",
      "question": "How would you explain Sequential vs Parallel Async Work at an interview, including engine/spec details?",
      "answerHint": "await on an already-started promise just waits; start time is when you constructed it. all registers then on each immediately. The event loop interleaves their completions as tasks/microtasks."
    }
  ],
  "pitfalls": [
    "for (const x of ids) { results.push(await fetch(x)) } when fetches were independent — slow.",
    "Do not all(hugeArray) of writes without a cap."
  ],
  "interview": {
    "expectations": [
      "Explain Sequential vs Parallel Async Work without mixing it up with a nearby B1.29 — Promises topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "await on an already-started promise just waits; start time is when you constructed it."
    ],
    "commonQuestions": [
      "What is Sequential vs Parallel Async Work?",
      "Why does JavaScript sequential vs parallel async work behave this way?",
      "What is the classic Sequential vs Parallel Async Work interview trap?"
    ],
    "traps": [
      "for (const x of ids) { results.push(await fetch(x)) } when fetches were independent — slow."
    ],
    "misconceptions": [
      "Latency is the UX. Independent I/O should overlap. Dependent steps cannot."
    ],
    "strongSignals": [
      "Separates Sequential vs Parallel Async Work from lookalike APIs and can draw the mental model."
    ]
  }
})
