import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Async Control Flow",
  "whatIsIt": "Async control flow is sequencing, branching, looping, and joining with await/all/race. Patterns: waterfall (await in series), parallel join, timeout race, retry loops with backoff, queues with concurrency limits. for await of streams. Errors: try/catch, Promise.all fail-fast vs allSettled.",
  "whyExists": "Business workflows are graphs of I/O. Structured async is how you implement those graphs in JS.",
  "mentalModel": "Flowcharts where some arrows are ‘wait for a promise.’ Pick sequential vs parallel per arrow.",
  "how": [
    "Series: for-of + await.",
    "Parallel: map to promises, all.",
    "Retry: loop + catch + delay.",
    "Cancel: AbortSignal through the graph."
  ],
  "callout": {
    "title": "Watch for",
    "text": "retry without delay/backoff can hammer a failing API in a tight microtask loop if fn rejects immediately.",
    "variant": "warning"
  },
  "example": "async function retry(fn, n) {\n  let last;\n  for (let i = 0; i < n; i++) {\n    try { return await fn(); } catch (e) { last = e; }\n  }\n  throw last;\n}\nlet k = 0;\nconst v = await retry(async () => {\n  k += 1;\n  if (k < 2) throw new Error('e');\n  return k;\n}, 3);\nconsole.log(v);\n",
  "exampleCaption": "Retry loop as async control flow",
  "internals": [
    "Each await is a resume point; loops just create many of them.",
    "all/race are joins in the graph.",
    "AbortSignal is host-level cancellation plumbing, not a language keyword."
  ],
  "takeaways": [
    "Series: for-of + await.",
    "Parallel: map to promises, all.",
    "retry without delay/backoff can hammer a failing API in a tight microtask loop if fn rejects immediately.",
    "Each await is a resume point; loops just create many of them."
  ],
  "revision": [
    "Async Control Flow: Flowcharts where some arrows are ‘wait for a promise.’ Pick sequential vs parallel per arrow.",
    "Series: for-of + await.",
    "Parallel: map to promises, all.",
    "Retry: loop + catch + delay.",
    "Trap: retry without delay/backoff can hammer a failing API in a tight microtask loop if fn rejects immediately."
  ],
  "flashcards": [
    [
      "Async Control Flow",
      "Async control flow is sequencing, branching, looping, and joining with await/all/race."
    ],
    [
      "Mental model",
      "Flowcharts where some arrows are ‘wait for a promise.’ Pick sequential vs parallel per arrow."
    ],
    [
      "Common trap",
      "retry without delay/backoff can hammer a failing API in a tight microtask loop if fn rejects immediately."
    ],
    [
      "Series: for-of + await.",
      "Parallel: map to promises, all."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Async Control Flow and where does a beginner first see it?",
      "answerHint": "Async control flow is sequencing, branching, looping, and joining with await/all/race. Patterns: waterfall (await in series), parallel join, timeout race, retry loops with backoff, queues with concurrency limits. for await of streams. Errors: try/catch, Promise.all fail-fast vs allSettled."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Async Control Flow works and name the main pitfall.",
      "answerHint": "Series: for-of + await. Parallel: map to promises, all. Retry: loop + catch + delay. Cancel: AbortSignal through the graph. Pitfall: retry without delay/backoff can hammer a failing API in a tight microtask loop if fn rejects immediately."
    },
    {
      "level": "advanced",
      "question": "How would you explain Async Control Flow at an interview, including engine/spec details?",
      "answerHint": "Each await is a resume point; loops just create many of them. all/race are joins in the graph. AbortSignal is host-level cancellation plumbing, not a language keyword."
    }
  ],
  "pitfalls": [
    "retry without delay/backoff can hammer a failing API in a tight microtask loop if fn rejects immediately.",
    "Cancel: AbortSignal through the graph."
  ],
  "interview": {
    "expectations": [
      "Explain Async Control Flow without mixing it up with a nearby B1.30 — Async/Await topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Each await is a resume point; loops just create many of them."
    ],
    "commonQuestions": [
      "What is Async Control Flow?",
      "Why does JavaScript async control flow behave this way?",
      "What is the classic Async Control Flow interview trap?"
    ],
    "traps": [
      "retry without delay/backoff can hammer a failing API in a tight microtask loop if fn rejects immediately."
    ],
    "misconceptions": [
      "Business workflows are graphs of I/O. Structured async is how you implement those graphs in JS."
    ],
    "strongSignals": [
      "Separates Async Control Flow from lookalike APIs and can draw the mental model."
    ]
  }
})
