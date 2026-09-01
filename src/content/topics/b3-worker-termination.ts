import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Worker Termination",
  "whatIsIt": "Worker Termination is a core Web Platform concept in Web Workers. It belongs to Web Workers and off-main-thread computation. Understanding Worker Termination helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide worker termination details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Worker Termination as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Worker Termination in B3.21 — Web Workers: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Worker Termination to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about worker termination.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Worker Termination from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Worker Termination — minimal browser example\nconsole.log('[b3-worker-termination]', typeof document);\n// Open DevTools → verify behavior for: Worker Termination\n// Spec reference: developer.mozilla.org (search \"Worker Termination\")",
  "exampleCaption": "Worker Termination — observe in DevTools while this runs",
  "internals": [
    "Worker Termination is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for worker termination can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether worker termination succeeds in production."
  ],
  "takeaways": [
    "Locate Worker Termination in B3.21 — Web Workers: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Worker Termination to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Worker Termination from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Worker Termination is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Worker Termination: Treat Worker Termination as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Worker Termination in B3.21 — Web Workers: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Worker Termination to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Worker Termination from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Worker Termination",
      "Worker Termination is a core Web Platform concept in Web Workers."
    ],
    [
      "Mental model",
      "Treat Worker Termination as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Worker Termination from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Worker Termination in B3.21 — Web Workers: map it to MDN reference docs a",
      "Connect Worker Termination to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Worker Termination in the browser and when do you use it?",
      "answerHint": "Worker Termination is a core Web Platform concept in Web Workers. It belongs to Web Workers and off-main-thread computation. Understanding Worker Termination helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Worker Termination with a DevTools observation and one pitfall.",
      "answerHint": "Locate Worker Termination in B3.21 — Web Workers: map it to MDN reference docs and observe behavior in DevTools. Connect Worker Termination to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about worker termination. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Worker Termination from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Worker Termination in a senior frontend interview?",
      "answerHint": "Worker Termination is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for worker termination can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether worker termination succeeds in production. // Worker Termination — minimal browser example\nconsole.log('[b3-worker-termination]', typeof document);\n// Open DevTool"
    }
  ],
  "pitfalls": [
    "Interview trap: describing Worker Termination from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Worker Termination at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Worker Termination is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Worker Termination?",
      "When would Worker Termination block rendering or fail cross-origin?",
      "What is the classic Worker Termination interview trap?"
    ],
    "traps": [
      "Interview trap: describing Worker Termination from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide worker termination details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Worker Termination."
    ]
  }
})
