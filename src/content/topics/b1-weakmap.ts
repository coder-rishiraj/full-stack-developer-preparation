import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "WeakMap",
  "whatIsIt": "WeakMap keys must be objects (or non-registered symbols in newer spec); values anything. Keys are held weakly: if nothing else references the key, the entry can vanish and the key can be GC’d. No size, no iteration (would pin keys). Used for private metadata and caches.",
  "whyExists": "You needed to hang data on objects you do not own without leaking those objects by storing them in a Map.",
  "mentalModel": "A sticky note on someone else’s backpack that falls off when the backpack is thrown away. You cannot list all notes.",
  "how": [
    "const wm = new WeakMap(); wm.set(el, meta).",
    "No wm.forEach — if you need to iterate, use Map and manage lifetime.",
    "Keys cannot be primitives (except some symbols).",
    "Perfect for per-DOM-node state in libraries."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Expecting WeakMap.size or JSON.stringify — neither exists in a useful way.",
    "variant": "warning"
  },
  "example": "const meta = new WeakMap();\nconst user = { id: 1 };\nmeta.set(user, { clicks: 3 });\nconsole.log(meta.get(user).clicks);\nconsole.log(meta.has(user));\nmeta.delete(user);\nconsole.log(meta.has(user));\n",
  "exampleCaption": "WeakMap metadata on an object key",
  "internals": [
    "Keys are not enumerable from JS so GC can collect them.",
    "Implementation uses ephemerons: value is live only if key is live (plus the WeakMap).",
    "No clear() iteration of keys; WeakMap.prototype has set/get/has/delete."
  ],
  "takeaways": [
    "const wm = new WeakMap(); wm.set(el, meta).",
    "No wm.forEach — if you need to iterate, use Map and manage lifetime.",
    "Expecting WeakMap.size or JSON.stringify — neither exists in a useful way.",
    "Keys are not enumerable from JS so GC can collect them."
  ],
  "revision": [
    "WeakMap: A sticky note on someone else’s backpack that falls off when the backpack is thrown away. You cannot list all notes.",
    "const wm = new WeakMap(); wm.set(el, meta).",
    "No wm.forEach — if you need to iterate, use Map and manage lifetime.",
    "Keys cannot be primitives (except some symbols).",
    "Trap: Expecting WeakMap.size or JSON.stringify — neither exists in a useful way."
  ],
  "flashcards": [
    [
      "WeakMap",
      "WeakMap keys must be objects (or non-registered symbols in newer spec); values anything."
    ],
    [
      "Mental model",
      "A sticky note on someone else’s backpack that falls off when the backpack is thrown away. You cannot list all notes."
    ],
    [
      "Common trap",
      "Expecting WeakMap.size or JSON.stringify — neither exists in a useful way."
    ],
    [
      "const wm = new WeakMap(); wm.set(el, meta).",
      "No wm.forEach — if you need to iterate, use Map and manage lifetime."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is WeakMap and where does a beginner first see it?",
      "answerHint": "WeakMap keys must be objects (or non-registered symbols in newer spec); values anything. Keys are held weakly: if nothing else references the key, the entry can vanish and the key can be GC’d. No size, no iteration (would pin keys). Used for private metadata and caches."
    },
    {
      "level": "intermediate",
      "question": "Walk through how WeakMap works and name the main pitfall.",
      "answerHint": "const wm = new WeakMap(); wm.set(el, meta). No wm.forEach — if you need to iterate, use Map and manage lifetime. Keys cannot be primitives (except some symbols). Perfect for per-DOM-node state in libraries. Pitfall: Expecting WeakMap.size or JSON.stringify — neither exists in a useful way."
    },
    {
      "level": "advanced",
      "question": "How would you explain WeakMap at an interview, including engine/spec details?",
      "answerHint": "Keys are not enumerable from JS so GC can collect them. Implementation uses ephemerons: value is live only if key is live (plus the WeakMap). No clear() iteration of keys; WeakMap.prototype has set/get/has/delete."
    }
  ],
  "pitfalls": [
    "Expecting WeakMap.size or JSON.stringify — neither exists in a useful way.",
    "Perfect for per-DOM-node state in libraries."
  ],
  "interview": {
    "expectations": [
      "Explain WeakMap without mixing it up with a nearby B1.19 — Maps, Sets & Weak Collections topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Keys are not enumerable from JS so GC can collect them."
    ],
    "commonQuestions": [
      "What is WeakMap?",
      "Why does JavaScript weakmap behave this way?",
      "What is the classic WeakMap interview trap?"
    ],
    "traps": [
      "Expecting WeakMap.size or JSON.stringify — neither exists in a useful way."
    ],
    "misconceptions": [
      "You needed to hang data on objects you do not own without leaking those objects by storing them in a Map."
    ],
    "strongSignals": [
      "Separates WeakMap from lookalike APIs and can draw the mental model."
    ]
  }
})
