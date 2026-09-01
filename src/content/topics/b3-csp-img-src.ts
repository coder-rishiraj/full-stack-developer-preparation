import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "img-src & media-src",
  "whatIsIt": "img-src & media-src is a core Web Platform concept in Content Security Policy. It belongs to Content Security Policy (CSP) directives and XSS mitigation. Understanding img-src & media-src helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide img-src & media-src details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat img-src & media-src as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate img-src & media-src in B3.19 — Content Security Policy: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect img-src & media-src to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about img-src & media-src.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing img-src & media-src from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// img-src & media-src — minimal browser example\nconsole.log('[b3-csp-img-src]', typeof document);\n// Open DevTools → verify behavior for: img-src & media-src\n// Spec reference: developer.mozilla.org (search \"img-src & media-src\")",
  "exampleCaption": "img-src & media-src — observe in DevTools while this runs",
  "internals": [
    "img-src & media-src is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for img-src & media-src can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether img-src & media-src succeeds in production."
  ],
  "takeaways": [
    "Locate img-src & media-src in B3.19 — Content Security Policy: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect img-src & media-src to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing img-src & media-src from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "img-src & media-src is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "img-src & media-src: Treat img-src & media-src as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate img-src & media-src in B3.19 — Content Security Policy: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect img-src & media-src to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing img-src & media-src from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "img-src & media-src",
      "img-src & media-src is a core Web Platform concept in Content Security Policy."
    ],
    [
      "Mental model",
      "Treat img-src & media-src as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing img-src & media-src from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate img-src & media-src in B3.19 — Content Security Policy: map it to MDN ref",
      "Connect img-src & media-src to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is img-src & media-src in the browser and when do you use it?",
      "answerHint": "img-src & media-src is a core Web Platform concept in Content Security Policy. It belongs to Content Security Policy (CSP) directives and XSS mitigation. Understanding img-src & media-src helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain img-src & media-src with a DevTools observation and one pitfall.",
      "answerHint": "Locate img-src & media-src in B3.19 — Content Security Policy: map it to MDN reference docs and observe behavior in DevTools. Connect img-src & media-src to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about img-src & media-src. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing img-src & media-src from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain img-src & media-src in a senior frontend interview?",
      "answerHint": "img-src & media-src is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for img-src & media-src can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether img-src & media-src succeeds in production. // img-src & media-src — minimal browser example\nconsole.log('[b3-csp-img-src]', typeof document);\n// Open DevTools → ve"
    }
  ],
  "pitfalls": [
    "Interview trap: describing img-src & media-src from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain img-src & media-src at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "img-src & media-src is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is img-src & media-src?",
      "When would img-src & media-src block rendering or fail cross-origin?",
      "What is the classic img-src & media-src interview trap?"
    ],
    "traps": [
      "Interview trap: describing img-src & media-src from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide img-src & media-src details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around img-src & media-src."
    ]
  }
})
