import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Request Object",
  "whatIsIt": "Request Object is a core Web Platform concept in Fetch API. It belongs to the Fetch API for network requests in the browser. Understanding Request Object helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide request object details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Request Object as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Request Object in B3.11 — Fetch API: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Request Object to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about request object.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Request Object from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Request Object — minimal browser example\nconsole.log('[b3-fetch-request]', typeof document);\n// Open DevTools → verify behavior for: Request Object\n// Spec reference: developer.mozilla.org (search \"Request Object\")",
  "exampleCaption": "Request Object — observe in DevTools while this runs",
  "internals": [
    "Request Object is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for request object can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether request object succeeds in production."
  ],
  "takeaways": [
    "Locate Request Object in B3.11 — Fetch API: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Request Object to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Request Object from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Request Object is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Request Object: Treat Request Object as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Request Object in B3.11 — Fetch API: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Request Object to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Request Object from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Request Object",
      "Request Object is a core Web Platform concept in Fetch API."
    ],
    [
      "Mental model",
      "Treat Request Object as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Request Object from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Request Object in B3.11 — Fetch API: map it to MDN reference docs and obs",
      "Connect Request Object to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Request Object in the browser and when do you use it?",
      "answerHint": "Request Object is a core Web Platform concept in Fetch API. It belongs to the Fetch API for network requests in the browser. Understanding Request Object helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Request Object with a DevTools observation and one pitfall.",
      "answerHint": "Locate Request Object in B3.11 — Fetch API: map it to MDN reference docs and observe behavior in DevTools. Connect Request Object to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about request object. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Request Object from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Request Object in a senior frontend interview?",
      "answerHint": "Request Object is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for request object can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether request object succeeds in production. // Request Object — minimal browser example\nconsole.log('[b3-fetch-request]', typeof document);\n// Open DevTools → verif"
    }
  ],
  "pitfalls": [
    "Interview trap: describing Request Object from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Request Object at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Request Object is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Request Object?",
      "When would Request Object block rendering or fail cross-origin?",
      "What is the classic Request Object interview trap?"
    ],
    "traps": [
      "Interview trap: describing Request Object from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide request object details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Request Object."
    ]
  }
})
