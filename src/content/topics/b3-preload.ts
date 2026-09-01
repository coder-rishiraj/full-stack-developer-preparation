import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "preload",
  "whatIsIt": "preload is a core Web Platform concept in Resource Loading & Performance. It belongs to browser performance metrics, Core Web Vitals, and profiling. Understanding preload helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide preload details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat preload as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate preload in B3.28 — Resource Loading & Performance: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect preload to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about preload.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing preload from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// preload — minimal browser example\nconsole.log('[b3-preload]', typeof document);\n// Open DevTools → verify behavior for: preload\n// Spec reference: developer.mozilla.org (search \"preload\")",
  "exampleCaption": "preload — observe in DevTools while this runs",
  "internals": [
    "preload is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for preload can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether preload succeeds in production."
  ],
  "takeaways": [
    "Locate preload in B3.28 — Resource Loading & Performance: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect preload to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing preload from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "preload is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "preload: Treat preload as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate preload in B3.28 — Resource Loading & Performance: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect preload to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing preload from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "preload",
      "preload is a core Web Platform concept in Resource Loading & Performance."
    ],
    [
      "Mental model",
      "Treat preload as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing preload from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate preload in B3.28 — Resource Loading & Performance: map it to MDN referenc",
      "Connect preload to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is preload in the browser and when do you use it?",
      "answerHint": "preload is a core Web Platform concept in Resource Loading & Performance. It belongs to browser performance metrics, Core Web Vitals, and profiling. Understanding preload helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain preload with a DevTools observation and one pitfall.",
      "answerHint": "Locate preload in B3.28 — Resource Loading & Performance: map it to MDN reference docs and observe behavior in DevTools. Connect preload to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about preload. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing preload from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain preload in a senior frontend interview?",
      "answerHint": "preload is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for preload can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether preload succeeds in production. // preload — minimal browser example\nconsole.log('[b3-preload]', typeof document);\n// Open DevTools → verify behavior fo"
    }
  ],
  "pitfalls": [
    "Interview trap: describing preload from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain preload at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "preload is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is preload?",
      "When would preload block rendering or fail cross-origin?",
      "What is the classic preload interview trap?"
    ],
    "traps": [
      "Interview trap: describing preload from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide preload details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around preload."
    ]
  }
})
