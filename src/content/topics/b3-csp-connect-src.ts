import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "connect-src",
  "whatIsIt": "connect-src is a core Web Platform concept in Content Security Policy. It belongs to Content Security Policy (CSP) directives and XSS mitigation. Understanding connect-src helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide connect-src details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat connect-src as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate connect-src in B3.19 — Content Security Policy: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect connect-src to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about connect-src.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing connect-src from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// connect-src — minimal browser example\nconsole.log('[b3-csp-connect-src]', typeof document);\n// Open DevTools → verify behavior for: connect-src\n// Spec reference: developer.mozilla.org (search \"connect-src\")",
  "exampleCaption": "connect-src — observe in DevTools while this runs",
  "internals": [
    "connect-src is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for connect-src can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether connect-src succeeds in production."
  ],
  "takeaways": [
    "Locate connect-src in B3.19 — Content Security Policy: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect connect-src to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing connect-src from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "connect-src is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "connect-src: Treat connect-src as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate connect-src in B3.19 — Content Security Policy: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect connect-src to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing connect-src from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "connect-src",
      "connect-src is a core Web Platform concept in Content Security Policy."
    ],
    [
      "Mental model",
      "Treat connect-src as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing connect-src from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate connect-src in B3.19 — Content Security Policy: map it to MDN reference d",
      "Connect connect-src to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is connect-src in the browser and when do you use it?",
      "answerHint": "connect-src is a core Web Platform concept in Content Security Policy. It belongs to Content Security Policy (CSP) directives and XSS mitigation. Understanding connect-src helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain connect-src with a DevTools observation and one pitfall.",
      "answerHint": "Locate connect-src in B3.19 — Content Security Policy: map it to MDN reference docs and observe behavior in DevTools. Connect connect-src to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about connect-src. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing connect-src from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain connect-src in a senior frontend interview?",
      "answerHint": "connect-src is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for connect-src can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether connect-src succeeds in production. // connect-src — minimal browser example\nconsole.log('[b3-csp-connect-src]', typeof document);\n// Open DevTools → verify"
    }
  ],
  "pitfalls": [
    "Interview trap: describing connect-src from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain connect-src at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "connect-src is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is connect-src?",
      "When would connect-src block rendering or fail cross-origin?",
      "What is the classic connect-src interview trap?"
    ],
    "traps": [
      "Interview trap: describing connect-src from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide connect-src details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around connect-src."
    ]
  }
})
