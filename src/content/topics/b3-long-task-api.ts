import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Long Task API / PerformanceLongTaskTiming",
  "whatIsIt": "Long Task API / PerformanceLongTaskTiming is a core Web Platform concept in Browser Event Loop & Rendering. It belongs to browser task scheduling, microtasks, and rendering opportunities. Understanding Long Task API / PerformanceLongTaskTiming helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide long task api / performancelongtasktiming details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Long Task API / PerformanceLongTaskTiming as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Long Task API / PerformanceLongTaskTiming in B3.8 — Browser Event Loop & Rendering: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Long Task API / PerformanceLongTaskTiming to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about long task api / performancelongtasktiming.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Long Task API / PerformanceLongTaskTiming from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Long Task API / PerformanceLongTaskTiming — minimal browser example\nconsole.log('[b3-long-task-api]', typeof window);\n// Open DevTools → verify behavior for: Long Task API / PerformanceLongTaskTiming\n// Spec reference: developer.mozilla.org (search \"Long Task API / PerformanceLongTaskTiming\")",
  "exampleCaption": "Long Task API / PerformanceLongTaskTiming — observe in DevTools while this runs",
  "internals": [
    "Long Task API / PerformanceLongTaskTiming is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for long task api / performancelongtasktiming can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether long task api / performancelongtasktiming succeeds in production."
  ],
  "takeaways": [
    "Locate Long Task API / PerformanceLongTaskTiming in B3.8 — Browser Event Loop & Rendering: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Long Task API / PerformanceLongTaskTiming to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Long Task API / PerformanceLongTaskTiming from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Long Task API / PerformanceLongTaskTiming is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Long Task API / PerformanceLongTaskTiming: Treat Long Task API / PerformanceLongTaskTiming as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Long Task API / PerformanceLongTaskTiming in B3.8 — Browser Event Loop & Rendering: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Long Task API / PerformanceLongTaskTiming to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Long Task API / PerformanceLongTaskTiming from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Long Task API / PerformanceLongTaskTiming",
      "Long Task API / PerformanceLongTaskTiming is a core Web Platform concept in Browser Event Loop & Rendering."
    ],
    [
      "Mental model",
      "Treat Long Task API / PerformanceLongTaskTiming as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Long Task API / PerformanceLongTaskTiming from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Long Task API / PerformanceLongTaskTiming in B3.8 — Browser Event Loop & ",
      "Connect Long Task API / PerformanceLongTaskTiming to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Long Task API / PerformanceLongTaskTiming in the browser and when do you use it?",
      "answerHint": "Long Task API / PerformanceLongTaskTiming is a core Web Platform concept in Browser Event Loop & Rendering. It belongs to browser task scheduling, microtasks, and rendering opportunities. Understanding Long Task API / PerformanceLongTaskTiming helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Long Task API / PerformanceLongTaskTiming with a DevTools observation and one pitfall.",
      "answerHint": "Locate Long Task API / PerformanceLongTaskTiming in B3.8 — Browser Event Loop & Rendering: map it to MDN reference docs and observe behavior in DevTools. Connect Long Task API / PerformanceLongTaskTiming to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about long task api / performancelongtasktiming. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Long Task API / PerformanceLongTaskTiming from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Long Task API / PerformanceLongTaskTiming in a senior frontend interview?",
      "answerHint": "Long Task API / PerformanceLongTaskTiming is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for long task api / performancelongtasktiming can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether long task api / performancelongtasktiming succeeds in production. // Long Task API / PerformanceLongTaskTiming — minimal browser example\nconsole.log('[b3-long-task-api]', typeof window);"
    }
  ],
  "pitfalls": [
    "Interview trap: describing Long Task API / PerformanceLongTaskTiming from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Long Task API / PerformanceLongTaskTiming at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Long Task API / PerformanceLongTaskTiming is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Long Task API / PerformanceLongTaskTiming?",
      "When would Long Task API / PerformanceLongTaskTiming block rendering or fail cross-origin?",
      "What is the classic Long Task API / PerformanceLongTaskTiming interview trap?"
    ],
    "traps": [
      "Interview trap: describing Long Task API / PerformanceLongTaskTiming from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide long task api / performancelongtasktiming details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Long Task API / PerformanceLongTaskTiming."
    ]
  }
})
