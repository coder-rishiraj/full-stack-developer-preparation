import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Async Iterators / for await...of",
  "whatIsIt": "Async iterators have next() → Promise<{value, done}>. for await...of consumes them. Async generators (async function*) yield promises/values and can await inside. ReadableStreams and some DB cursors are async iterables. Symbol.asyncIterator is the hook. for await on a sync iterable wraps values in promises.",
  "whyExists": "I/O sequences (paginated APIs, files) should be pull-based without loading everything. await in the loop is the natural shape.",
  "mentalModel": "next() is async. for await waits for each page before asking the next. An async generator is a pauseable async function that yields a stream.",
  "how": [
    "for await (const chunk of asyncIterable).",
    "Implement async *[Symbol.asyncIterator]().",
    "Do not for-await a huge in-memory array unless you like extra microtasks.",
    "Break still calls iterator.return() for cleanup."
  ],
  "callout": {
    "title": "Watch for",
    "text": "for await of a promise of an array works (unwraps), but for await of a promise of a non-iterable fails — know what you awaited.",
    "variant": "warning"
  },
  "example": "async function* ticks(n) {\n  for (let i = 0; i < n; i++) {\n    await Promise.resolve();\n    yield i;\n  }\n}\nconst acc = [];\nfor await (const x of ticks(3)) acc.push(x);\nconsole.log(acc);\n",
  "exampleCaption": "async generator consumed with for await",
  "internals": [
    "GetIterator with hint async looks up @@asyncIterator then falls back to wrapping @@iterator.",
    "Await on next() results.",
    "AsyncGeneratorResume similar to generators plus promise plumbing."
  ],
  "takeaways": [
    "for await (const chunk of asyncIterable).",
    "Implement async *[Symbol.asyncIterator]().",
    "for await of a promise of an array works (unwraps), but for await of a promise of a non-iterable fails — know what you awaited.",
    "GetIterator with hint async looks up @@asyncIterator then falls back to wrapping @@iterator."
  ],
  "revision": [
    "Async Iterators / for await...of: next() is async. for await waits for each page before asking the next. An async generator is a pauseable async function that yields a stream.",
    "for await (const chunk of asyncIterable).",
    "Implement async *[Symbol.asyncIterator]().",
    "Do not for-await a huge in-memory array unless you like extra microtasks.",
    "Trap: for await of a promise of an array works (unwraps), but for await of a promise of a non-iterable fails — know what you awaited."
  ],
  "flashcards": [
    [
      "Async Iterators / for await...of",
      "Async iterators have next() → Promise<{value, done}>."
    ],
    [
      "Mental model",
      "next() is async. for await waits for each page before asking the next. An async generator is a pauseable async function that yields a stream."
    ],
    [
      "Common trap",
      "for await of a promise of an array works (unwraps), but for await of a promise of a non-iterable fails — know what you awaited."
    ],
    [
      "for await (const chunk of asyncIterable).",
      "Implement async *[Symbol.asyncIterator]()."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Async Iterators / for await...of and where does a beginner first see it?",
      "answerHint": "Async iterators have next() → Promise<{value, done}>. for await...of consumes them. Async generators (async function*) yield promises/values and can await inside. ReadableStreams and some DB cursors are async iterables. Symbol.asyncIterator is the hook. for await on a sync iterable wraps values in promises."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Async Iterators / for await...of works and name the main pitfall.",
      "answerHint": "for await (const chunk of asyncIterable). Implement async *[Symbol.asyncIterator](). Do not for-await a huge in-memory array unless you like extra microtasks. Break still calls iterator.return() for cleanup. Pitfall: for await of a promise of an array works (unwraps), but for await of a promise of a non-iterable fails — know what you awaited."
    },
    {
      "level": "advanced",
      "question": "How would you explain Async Iterators / for await...of at an interview, including engine/spec details?",
      "answerHint": "GetIterator with hint async looks up @@asyncIterator then falls back to wrapping @@iterator. Await on next() results. AsyncGeneratorResume similar to generators plus promise plumbing."
    }
  ],
  "pitfalls": [
    "for await of a promise of an array works (unwraps), but for await of a promise of a non-iterable fails — know what you awaited.",
    "Break still calls iterator.return() for cleanup."
  ],
  "interview": {
    "expectations": [
      "Explain Async Iterators / for await...of without mixing it up with a nearby B1.21 — Iterables, Iterators & Generators topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "GetIterator with hint async looks up @@asyncIterator then falls back to wrapping @@iterator."
    ],
    "commonQuestions": [
      "What is Async Iterators / for await...of?",
      "Why does JavaScript async iterators / for await...of behave this way?",
      "What is the classic Async Iterators / for await...of interview trap?"
    ],
    "traps": [
      "for await of a promise of an array works (unwraps), but for await of a promise of a non-iterable fails — know what you awaited."
    ],
    "misconceptions": [
      "I/O sequences (paginated APIs, files) should be pull-based without loading everything. await in the loop is the natural shape."
    ],
    "strongSignals": [
      "Separates Async Iterators / for await...of from lookalike APIs and can draw the mental model."
    ]
  }
})
