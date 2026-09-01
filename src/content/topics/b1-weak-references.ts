import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Weak References & GC",
  "whatIsIt": "WeakMap/WeakSet hold weak keys. WeakRef (ES2021) lets you hold a weak pointer to an object and deref() it, getting the object or undefined if GC’d. FinalizationRegistry runs a callback after an object is collected (not for must-run logic). These are expert GC tools, not caches you should start with.",
  "whyExists": "Advanced caches and wasm/host interop needed a way to notice when JS objects died without pinning them.",
  "mentalModel": "A business card that can fade: deref() might be empty after GC. Do not write program correctness that requires a GC to run.",
  "how": [
    "Prefer WeakMap for associated data.",
    "Do not use FinalizationRegistry for disposing critical resources — use explicit dispose.",
    "deref() results must be checked every time.",
    "GC timing is engine-defined; tests that expect collection are flaky."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Relying on a finalizer to close a socket — GC may run late or not soon, leaking the socket.",
    "variant": "warning"
  },
  "example": "const wm = new WeakMap();\nlet obj = { n: 1 };\nwm.set(obj, 'meta');\nconsole.log(wm.get(obj));\nobj = null; // eligible for GC; we cannot force it here\nconst wr = new WeakRef({ x: 1 });\nconsole.log(wr.deref()?.x);\n",
  "exampleCaption": "WeakMap vs WeakRef.deref",
  "internals": [
    "WeakRef [[WeakRefTarget]] can be emptied by GC.",
    "FinalizationRegistry jobs enqueue as FinalizationRegistry Cleanup Jobs.",
    "The spec forbids depending on promptness of collection."
  ],
  "takeaways": [
    "Prefer WeakMap for associated data.",
    "Do not use FinalizationRegistry for disposing critical resources — use explicit dispose.",
    "Relying on a finalizer to close a socket — GC may run late or not soon, leaking the socket.",
    "WeakRef [[WeakRefTarget]] can be emptied by GC."
  ],
  "revision": [
    "Weak References & GC: A business card that can fade: deref() might be empty after GC. Do not write program correctness that requires a GC to run.",
    "Prefer WeakMap for associated data.",
    "Do not use FinalizationRegistry for disposing critical resources — use explicit dispose.",
    "deref() results must be checked every time.",
    "Trap: Relying on a finalizer to close a socket — GC may run late or not soon, leaking the socket."
  ],
  "flashcards": [
    [
      "Weak References & GC",
      "WeakMap/WeakSet hold weak keys."
    ],
    [
      "Mental model",
      "A business card that can fade: deref() might be empty after GC. Do not write program correctness that requires a GC to run."
    ],
    [
      "Common trap",
      "Relying on a finalizer to close a socket — GC may run late or not soon, leaking the socket."
    ],
    [
      "Prefer WeakMap for associated data.",
      "Do not use FinalizationRegistry for disposing critical resources — use explicit dispose."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Weak References & GC and where does a beginner first see it?",
      "answerHint": "WeakMap/WeakSet hold weak keys. WeakRef (ES2021) lets you hold a weak pointer to an object and deref() it, getting the object or undefined if GC’d. FinalizationRegistry runs a callback after an object is collected (not for must-run logic). These are expert GC tools, not caches you should start with."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Weak References & GC works and name the main pitfall.",
      "answerHint": "Prefer WeakMap for associated data. Do not use FinalizationRegistry for disposing critical resources — use explicit dispose. deref() results must be checked every time. GC timing is engine-defined; tests that expect collection are flaky. Pitfall: Relying on a finalizer to close a socket — GC may run late or not soon, leaking the socket."
    },
    {
      "level": "advanced",
      "question": "How would you explain Weak References & GC at an interview, including engine/spec details?",
      "answerHint": "WeakRef [[WeakRefTarget]] can be emptied by GC. FinalizationRegistry jobs enqueue as FinalizationRegistry Cleanup Jobs. The spec forbids depending on promptness of collection."
    }
  ],
  "pitfalls": [
    "Relying on a finalizer to close a socket — GC may run late or not soon, leaking the socket.",
    "GC timing is engine-defined; tests that expect collection are flaky."
  ],
  "interview": {
    "expectations": [
      "Explain Weak References & GC without mixing it up with a nearby B1.19 — Maps, Sets & Weak Collections topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "WeakRef [[WeakRefTarget]] can be emptied by GC."
    ],
    "commonQuestions": [
      "What is Weak References & GC?",
      "Why does JavaScript weak references & gc behave this way?",
      "What is the classic Weak References & GC interview trap?"
    ],
    "traps": [
      "Relying on a finalizer to close a socket — GC may run late or not soon, leaking the socket."
    ],
    "misconceptions": [
      "Advanced caches and wasm/host interop needed a way to notice when JS objects died without pinning them."
    ],
    "strongSignals": [
      "Separates Weak References & GC from lookalike APIs and can draw the mental model."
    ]
  }
})
