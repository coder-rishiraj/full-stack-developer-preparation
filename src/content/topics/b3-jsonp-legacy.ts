import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "JSONP (Legacy)",
  "whatIsIt": "JSONP (Legacy) is a core Web Platform concept in CORS. It belongs to Cross-Origin Resource Sharing (CORS) and preflight. Understanding JSONP (Legacy) helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide jsonp (legacy) details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat JSONP (Legacy) as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate JSONP (Legacy) in B3.14 — CORS: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect JSONP (Legacy) to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about jsonp (legacy).",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing JSONP (Legacy) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// JSONP (Legacy) — minimal browser example\nconsole.log('[b3-jsonp-legacy]', typeof document);\n// Open DevTools → verify behavior for: JSONP (Legacy)\n// Spec reference: developer.mozilla.org (search \"JSONP (Legacy)\")",
  "exampleCaption": "JSONP (Legacy) — observe in DevTools while this runs",
  "internals": [
    "JSONP (Legacy) is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for jsonp (legacy) can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether jsonp (legacy) succeeds in production."
  ],
  "takeaways": [
    "Locate JSONP (Legacy) in B3.14 — CORS: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect JSONP (Legacy) to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing JSONP (Legacy) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "JSONP (Legacy) is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "JSONP (Legacy): Treat JSONP (Legacy) as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate JSONP (Legacy) in B3.14 — CORS: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect JSONP (Legacy) to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing JSONP (Legacy) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "JSONP (Legacy)",
      "JSONP (Legacy) is a core Web Platform concept in CORS."
    ],
    [
      "Mental model",
      "Treat JSONP (Legacy) as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing JSONP (Legacy) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate JSONP (Legacy) in B3.14 — CORS: map it to MDN reference docs and observe ",
      "Connect JSONP (Legacy) to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is JSONP (Legacy) in the browser and when do you use it?",
      "answerHint": "JSONP (Legacy) is a core Web Platform concept in CORS. It belongs to Cross-Origin Resource Sharing (CORS) and preflight. Understanding JSONP (Legacy) helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain JSONP (Legacy) with a DevTools observation and one pitfall.",
      "answerHint": "Locate JSONP (Legacy) in B3.14 — CORS: map it to MDN reference docs and observe behavior in DevTools. Connect JSONP (Legacy) to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about jsonp (legacy). Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing JSONP (Legacy) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain JSONP (Legacy) in a senior frontend interview?",
      "answerHint": "JSONP (Legacy) is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for jsonp (legacy) can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether jsonp (legacy) succeeds in production. // JSONP (Legacy) — minimal browser example\nconsole.log('[b3-jsonp-legacy]', typeof document);\n// Open DevTools → verify"
    }
  ],
  "pitfalls": [
    "Interview trap: describing JSONP (Legacy) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain JSONP (Legacy) at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "JSONP (Legacy) is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is JSONP (Legacy)?",
      "When would JSONP (Legacy) block rendering or fail cross-origin?",
      "What is the classic JSONP (Legacy) interview trap?"
    ],
    "traps": [
      "Interview trap: describing JSONP (Legacy) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide jsonp (legacy) details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around JSONP (Legacy)."
    ]
  }
})
