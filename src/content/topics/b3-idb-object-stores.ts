import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Object Stores & Indexes",
  "whatIsIt": "Object Stores & Indexes is a core Web Platform concept in IndexedDB. It belongs to IndexedDB for structured client-side storage. Understanding Object Stores & Indexes helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide object stores & indexes details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Object Stores & Indexes as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Object Stores & Indexes in B3.17 — IndexedDB: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Object Stores & Indexes to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about object stores & indexes.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Object Stores & Indexes from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Object Stores & Indexes — minimal browser example\nconsole.log('[b3-idb-object-stores]', typeof document);\n// Open DevTools → verify behavior for: Object Stores & Indexes\n// Spec reference: developer.mozilla.org (search \"Object Stores & Indexes\")",
  "exampleCaption": "Object Stores & Indexes — observe in DevTools while this runs",
  "internals": [
    "Object Stores & Indexes is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for object stores & indexes can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether object stores & indexes succeeds in production."
  ],
  "takeaways": [
    "Locate Object Stores & Indexes in B3.17 — IndexedDB: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Object Stores & Indexes to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Object Stores & Indexes from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Object Stores & Indexes is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Object Stores & Indexes: Treat Object Stores & Indexes as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Object Stores & Indexes in B3.17 — IndexedDB: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Object Stores & Indexes to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Object Stores & Indexes from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Object Stores & Indexes",
      "Object Stores & Indexes is a core Web Platform concept in IndexedDB."
    ],
    [
      "Mental model",
      "Treat Object Stores & Indexes as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Object Stores & Indexes from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Object Stores & Indexes in B3.17 — IndexedDB: map it to MDN reference doc",
      "Connect Object Stores & Indexes to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Object Stores & Indexes in the browser and when do you use it?",
      "answerHint": "Object Stores & Indexes is a core Web Platform concept in IndexedDB. It belongs to IndexedDB for structured client-side storage. Understanding Object Stores & Indexes helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Object Stores & Indexes with a DevTools observation and one pitfall.",
      "answerHint": "Locate Object Stores & Indexes in B3.17 — IndexedDB: map it to MDN reference docs and observe behavior in DevTools. Connect Object Stores & Indexes to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about object stores & indexes. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Object Stores & Indexes from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Object Stores & Indexes in a senior frontend interview?",
      "answerHint": "Object Stores & Indexes is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for object stores & indexes can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether object stores & indexes succeeds in production. // Object Stores & Indexes — minimal browser example\nconsole.log('[b3-idb-object-stores]', typeof document);\n// Open Dev"
    }
  ],
  "pitfalls": [
    "Interview trap: describing Object Stores & Indexes from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Object Stores & Indexes at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Object Stores & Indexes is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Object Stores & Indexes?",
      "When would Object Stores & Indexes block rendering or fail cross-origin?",
      "What is the classic Object Stores & Indexes interview trap?"
    ],
    "traps": [
      "Interview trap: describing Object Stores & Indexes from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide object stores & indexes details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Object Stores & Indexes."
    ]
  }
})
