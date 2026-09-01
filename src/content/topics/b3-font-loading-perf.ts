import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Font Loading Performance",
  "whatIsIt": "Font Loading Performance is a core Web Platform concept in Resource Loading & Performance. It belongs to browser performance metrics, Core Web Vitals, and profiling. Understanding Font Loading Performance helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide font loading performance details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Font Loading Performance as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Font Loading Performance in B3.28 — Resource Loading & Performance: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Font Loading Performance to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about font loading performance.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Font Loading Performance from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Font Loading Performance — minimal browser example\nconsole.log('[b3-font-loading-perf]', typeof document);\n// Open DevTools → verify behavior for: Font Loading Performance\n// Spec reference: developer.mozilla.org (search \"Font Loading Performance\")",
  "exampleCaption": "Font Loading Performance — observe in DevTools while this runs",
  "internals": [
    "Font Loading Performance is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for font loading performance can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether font loading performance succeeds in production."
  ],
  "takeaways": [
    "Locate Font Loading Performance in B3.28 — Resource Loading & Performance: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Font Loading Performance to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Font Loading Performance from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Font Loading Performance is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Font Loading Performance: Treat Font Loading Performance as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Font Loading Performance in B3.28 — Resource Loading & Performance: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Font Loading Performance to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Font Loading Performance from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Font Loading Performance",
      "Font Loading Performance is a core Web Platform concept in Resource Loading & Performance."
    ],
    [
      "Mental model",
      "Treat Font Loading Performance as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Font Loading Performance from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Font Loading Performance in B3.28 — Resource Loading & Performance: map i",
      "Connect Font Loading Performance to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Font Loading Performance in the browser and when do you use it?",
      "answerHint": "Font Loading Performance is a core Web Platform concept in Resource Loading & Performance. It belongs to browser performance metrics, Core Web Vitals, and profiling. Understanding Font Loading Performance helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Font Loading Performance with a DevTools observation and one pitfall.",
      "answerHint": "Locate Font Loading Performance in B3.28 — Resource Loading & Performance: map it to MDN reference docs and observe behavior in DevTools. Connect Font Loading Performance to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about font loading performance. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Font Loading Performance from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Font Loading Performance in a senior frontend interview?",
      "answerHint": "Font Loading Performance is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for font loading performance can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether font loading performance succeeds in production. // Font Loading Performance — minimal browser example\nconsole.log('[b3-font-loading-perf]', typeof document);\n// Open De"
    }
  ],
  "pitfalls": [
    "Interview trap: describing Font Loading Performance from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Font Loading Performance at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Font Loading Performance is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Font Loading Performance?",
      "When would Font Loading Performance block rendering or fail cross-origin?",
      "What is the classic Font Loading Performance interview trap?"
    ],
    "traps": [
      "Interview trap: describing Font Loading Performance from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide font loading performance details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Font Loading Performance."
    ]
  }
})
