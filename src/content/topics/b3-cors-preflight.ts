import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Preflight Requests (OPTIONS)",
  "whatIsIt": "Preflight Requests (OPTIONS) is a core Web Platform concept in CORS. It belongs to Cross-Origin Resource Sharing (CORS) and preflight. Understanding Preflight Requests (OPTIONS) helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide preflight requests (options) details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Preflight Requests (OPTIONS) as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Preflight Requests (OPTIONS) in B3.14 — CORS: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Preflight Requests (OPTIONS) to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about preflight requests (options).",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Preflight Requests (OPTIONS) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Preflight Requests (OPTIONS) — minimal browser example\nconsole.log('[b3-cors-preflight]', typeof document);\n// Open DevTools → verify behavior for: Preflight Requests (OPTIONS)\n// Spec reference: developer.mozilla.org (search \"Preflight Requests (OPTIONS)\")",
  "exampleCaption": "Preflight Requests (OPTIONS) — observe in DevTools while this runs",
  "internals": [
    "Preflight Requests (OPTIONS) is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for preflight requests (options) can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether preflight requests (options) succeeds in production."
  ],
  "takeaways": [
    "Locate Preflight Requests (OPTIONS) in B3.14 — CORS: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Preflight Requests (OPTIONS) to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Preflight Requests (OPTIONS) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Preflight Requests (OPTIONS) is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Preflight Requests (OPTIONS): Treat Preflight Requests (OPTIONS) as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Preflight Requests (OPTIONS) in B3.14 — CORS: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Preflight Requests (OPTIONS) to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Preflight Requests (OPTIONS) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Preflight Requests (OPTIONS)",
      "Preflight Requests (OPTIONS) is a core Web Platform concept in CORS."
    ],
    [
      "Mental model",
      "Treat Preflight Requests (OPTIONS) as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Preflight Requests (OPTIONS) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Preflight Requests (OPTIONS) in B3.14 — CORS: map it to MDN reference doc",
      "Connect Preflight Requests (OPTIONS) to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Preflight Requests (OPTIONS) in the browser and when do you use it?",
      "answerHint": "Preflight Requests (OPTIONS) is a core Web Platform concept in CORS. It belongs to Cross-Origin Resource Sharing (CORS) and preflight. Understanding Preflight Requests (OPTIONS) helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Preflight Requests (OPTIONS) with a DevTools observation and one pitfall.",
      "answerHint": "Locate Preflight Requests (OPTIONS) in B3.14 — CORS: map it to MDN reference docs and observe behavior in DevTools. Connect Preflight Requests (OPTIONS) to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about preflight requests (options). Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Preflight Requests (OPTIONS) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Preflight Requests (OPTIONS) in a senior frontend interview?",
      "answerHint": "Preflight Requests (OPTIONS) is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for preflight requests (options) can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether preflight requests (options) succeeds in production. // Preflight Requests (OPTIONS) — minimal browser example\nconsole.log('[b3-cors-preflight]', typeof document);\n// Open D"
    }
  ],
  "pitfalls": [
    "Interview trap: describing Preflight Requests (OPTIONS) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Preflight Requests (OPTIONS) at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Preflight Requests (OPTIONS) is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Preflight Requests (OPTIONS)?",
      "When would Preflight Requests (OPTIONS) block rendering or fail cross-origin?",
      "What is the classic Preflight Requests (OPTIONS) interview trap?"
    ],
    "traps": [
      "Interview trap: describing Preflight Requests (OPTIONS) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide preflight requests (options) details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Preflight Requests (OPTIONS)."
    ]
  }
})
