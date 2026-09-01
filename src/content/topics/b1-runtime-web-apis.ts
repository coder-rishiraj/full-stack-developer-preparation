import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Web APIs vs Language",
  "whatIsIt": "Web APIs are browser (or WinterCG) interfaces exposed to JS: DOM, fetch, URL, crypto, observers, storage. They are specified outside ECMA-262 and may be missing in Node or workers. Language features (Map, Promise, Proxy) work anywhere the engine version supports them.",
  "whyExists": "The web needed a programmable document and network. Standards bodies split “the language” from “the platform” so engines and browsers can evolve separately.",
  "mentalModel": "Promise is furniture that came with the house (engine). fetch is a phone the landlord installed (host).",
  "how": [
    "If it touches pixels, network, or OS, it is probably a host API.",
    "Check availability: `typeof fetch === \"function\"`.",
    "Workers have a subset (no `document`); Node may polyfill some Web APIs.",
    "Never teach setTimeout as “syntax”; it is a host function that queues a task."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Polyfilling Promise is a language gap; polyfilling fetch is a platform gap. Mixing those diagnoses wastes days.",
    "variant": "warning"
  },
  "example": "const isLanguage = [Map, Promise, Proxy].every((C) => typeof C === 'function');\nconst isHost = typeof document !== 'undefined';\nconsole.log({ isLanguage, isHost, hasFetch: typeof fetch === 'function' });",
  "exampleCaption": "Feature-detect language constructors vs host objects",
  "internals": [
    "Web IDL describes how JS values convert to/from platform types.",
    "Host-defined jobs (network, timers) enqueue tasks; Promise jobs enqueue microtasks.",
    "The same Web API can be implemented by Node, Deno, and browsers with subtle differences."
  ],
  "takeaways": [
    "If it touches pixels, network, or OS, it is probably a host API.",
    "Check availability: `typeof fetch === \"function\"`.",
    "Polyfilling Promise is a language gap; polyfilling fetch is a platform gap. Mixing those diagnoses wastes days.",
    "Web IDL describes how JS values convert to/from platform types."
  ],
  "revision": [
    "Web APIs vs Language: Promise is furniture that came with the house (engine). fetch is a phone the landlord installed (host).",
    "If it touches pixels, network, or OS, it is probably a host API.",
    "Check availability: `typeof fetch === \"function\"`.",
    "Workers have a subset (no `document`); Node may polyfill some Web APIs.",
    "Trap: Polyfilling Promise is a language gap; polyfilling fetch is a platform gap. Mixing those diagnoses wastes days."
  ],
  "flashcards": [
    [
      "Web APIs vs Language",
      "Web APIs are browser (or WinterCG) interfaces exposed to JS: DOM, fetch, URL, crypto, observers, storage."
    ],
    [
      "Mental model",
      "Promise is furniture that came with the house (engine). fetch is a phone the landlord installed (host)."
    ],
    [
      "Common trap",
      "Polyfilling Promise is a language gap; polyfilling fetch is a platform gap. Mixing those diagnoses wastes days."
    ],
    [
      "If it touches pixels, network, or OS, it is probably a host API.",
      "Check availability: `typeof fetch === \"function\"`."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Web APIs vs Language and where does a beginner first see it?",
      "answerHint": "Web APIs are browser (or WinterCG) interfaces exposed to JS: DOM, fetch, URL, crypto, observers, storage. They are specified outside ECMA-262 and may be missing in Node or workers. Language features (Map, Promise, Proxy) work anywhere the engine version supports them."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Web APIs vs Language works and name the main pitfall.",
      "answerHint": "If it touches pixels, network, or OS, it is probably a host API. Check availability: `typeof fetch === \"function\"`. Workers have a subset (no `document`); Node may polyfill some Web APIs. Never teach setTimeout as “syntax”; it is a host function that queues a task. Pitfall: Polyfilling Promise is a language gap; polyfilling fetch is a platform gap. Mixing those diagnoses wastes days."
    },
    {
      "level": "advanced",
      "question": "How would you explain Web APIs vs Language at an interview, including engine/spec details?",
      "answerHint": "Web IDL describes how JS values convert to/from platform types. Host-defined jobs (network, timers) enqueue tasks; Promise jobs enqueue microtasks. The same Web API can be implemented by Node, Deno, and browsers with subtle differences."
    }
  ],
  "pitfalls": [
    "Polyfilling Promise is a language gap; polyfilling fetch is a platform gap. Mixing those diagnoses wastes days.",
    "Never teach setTimeout as “syntax”; it is a host function that queues a task."
  ],
  "interview": {
    "expectations": [
      "Explain Web APIs vs Language without mixing it up with a nearby B1.1 — JavaScript Foundations topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Web IDL describes how JS values convert to/from platform types."
    ],
    "commonQuestions": [
      "What is Web APIs vs Language?",
      "Why does JavaScript web apis vs language behave this way?",
      "What is the classic Web APIs vs Language interview trap?"
    ],
    "traps": [
      "Polyfilling Promise is a language gap; polyfilling fetch is a platform gap. Mixing those diagnoses wastes days."
    ],
    "misconceptions": [
      "The web needed a programmable document and network. Standards bodies split “the language” from “the platform” so engines and browsers can evolve separately."
    ],
    "strongSignals": [
      "Separates Web APIs vs Language from lookalike APIs and can draw the mental model."
    ]
  }
})
