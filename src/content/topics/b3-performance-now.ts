import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "performance.now()",
  "whatIsIt": "performance.now() is a core Web Platform concept in Browser Performance. It belongs to browser performance metrics, Core Web Vitals, and profiling. Understanding performance.now() helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide performance.now() details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat performance.now() as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate performance.now() in B3.27 — Browser Performance: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect performance.now() to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about performance.now().",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing performance.now() from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// performance.now() — minimal browser example\nconsole.log('[b3-performance-now]', typeof document);\n// Open DevTools → verify behavior for: performance.now()\n// Spec reference: developer.mozilla.org (search \"performance.now()\")",
  "exampleCaption": "performance.now() — observe in DevTools while this runs",
  "internals": [
    "performance.now() is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for performance.now() can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether performance.now() succeeds in production."
  ],
  "takeaways": [
    "Locate performance.now() in B3.27 — Browser Performance: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect performance.now() to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing performance.now() from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "performance.now() is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "performance.now(): Treat performance.now() as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate performance.now() in B3.27 — Browser Performance: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect performance.now() to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing performance.now() from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "performance.now()",
      "performance.now() is a core Web Platform concept in Browser Performance."
    ],
    [
      "Mental model",
      "Treat performance.now() as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing performance.now() from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate performance.now() in B3.27 — Browser Performance: map it to MDN reference",
      "Connect performance.now() to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is performance.now() in the browser and when do you use it?",
      "answerHint": "performance.now() is a core Web Platform concept in Browser Performance. It belongs to browser performance metrics, Core Web Vitals, and profiling. Understanding performance.now() helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain performance.now() with a DevTools observation and one pitfall.",
      "answerHint": "Locate performance.now() in B3.27 — Browser Performance: map it to MDN reference docs and observe behavior in DevTools. Connect performance.now() to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about performance.now(). Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing performance.now() from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain performance.now() in a senior frontend interview?",
      "answerHint": "performance.now() is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for performance.now() can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether performance.now() succeeds in production. // performance.now() — minimal browser example\nconsole.log('[b3-performance-now]', typeof document);\n// Open DevTools → "
    }
  ],
  "pitfalls": [
    "Interview trap: describing performance.now() from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain performance.now() at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "performance.now() is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is performance.now()?",
      "When would performance.now() block rendering or fail cross-origin?",
      "What is the classic performance.now() interview trap?"
    ],
    "traps": [
      "Interview trap: describing performance.now() from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide performance.now() details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around performance.now()."
    ]
  }
})
