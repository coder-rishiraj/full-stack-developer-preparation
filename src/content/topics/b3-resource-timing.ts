import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Resource Timing API",
  "whatIsIt": "Resource Timing API is a core Web Platform concept in Browser Performance. It belongs to browser performance metrics, Core Web Vitals, and profiling. Understanding Resource Timing API helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide resource timing api details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Resource Timing API as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Resource Timing API in B3.27 — Browser Performance: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Resource Timing API to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about resource timing api.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Resource Timing API from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Resource Timing API — minimal browser example\nconsole.log('[b3-resource-timing]', typeof window);\n// Open DevTools → verify behavior for: Resource Timing API\n// Spec reference: developer.mozilla.org (search \"Resource Timing API\")",
  "exampleCaption": "Resource Timing API — observe in DevTools while this runs",
  "internals": [
    "Resource Timing API is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for resource timing api can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether resource timing api succeeds in production."
  ],
  "takeaways": [
    "Locate Resource Timing API in B3.27 — Browser Performance: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Resource Timing API to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Resource Timing API from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Resource Timing API is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Resource Timing API: Treat Resource Timing API as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Resource Timing API in B3.27 — Browser Performance: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Resource Timing API to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Resource Timing API from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Resource Timing API",
      "Resource Timing API is a core Web Platform concept in Browser Performance."
    ],
    [
      "Mental model",
      "Treat Resource Timing API as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Resource Timing API from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Resource Timing API in B3.27 — Browser Performance: map it to MDN referen",
      "Connect Resource Timing API to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Resource Timing API in the browser and when do you use it?",
      "answerHint": "Resource Timing API is a core Web Platform concept in Browser Performance. It belongs to browser performance metrics, Core Web Vitals, and profiling. Understanding Resource Timing API helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Resource Timing API with a DevTools observation and one pitfall.",
      "answerHint": "Locate Resource Timing API in B3.27 — Browser Performance: map it to MDN reference docs and observe behavior in DevTools. Connect Resource Timing API to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about resource timing api. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Resource Timing API from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Resource Timing API in a senior frontend interview?",
      "answerHint": "Resource Timing API is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for resource timing api can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether resource timing api succeeds in production. // Resource Timing API — minimal browser example\nconsole.log('[b3-resource-timing]', typeof window);\n// Open DevTools → "
    }
  ],
  "pitfalls": [
    "Interview trap: describing Resource Timing API from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Resource Timing API at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Resource Timing API is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Resource Timing API?",
      "When would Resource Timing API block rendering or fail cross-origin?",
      "What is the classic Resource Timing API interview trap?"
    ],
    "traps": [
      "Interview trap: describing Resource Timing API from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide resource timing api details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Resource Timing API."
    ]
  }
})
