import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Resource Hints",
  "whatIsIt": "Resource Hints is a core Web Platform concept in Resource Loading & Performance. It belongs to browser performance metrics, Core Web Vitals, and profiling. Understanding Resource Hints helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide resource hints details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Resource Hints as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Resource Hints in B3.28 — Resource Loading & Performance: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Resource Hints to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about resource hints.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Resource Hints from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Resource Hints — minimal browser example\nconsole.log('[b3-resource-hints]', typeof document);\n// Open DevTools → verify behavior for: Resource Hints\n// Spec reference: developer.mozilla.org (search \"Resource Hints\")",
  "exampleCaption": "Resource Hints — observe in DevTools while this runs",
  "internals": [
    "Resource Hints is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for resource hints can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether resource hints succeeds in production."
  ],
  "takeaways": [
    "Locate Resource Hints in B3.28 — Resource Loading & Performance: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Resource Hints to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Resource Hints from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Resource Hints is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Resource Hints: Treat Resource Hints as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Resource Hints in B3.28 — Resource Loading & Performance: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Resource Hints to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Resource Hints from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Resource Hints",
      "Resource Hints is a core Web Platform concept in Resource Loading & Performance."
    ],
    [
      "Mental model",
      "Treat Resource Hints as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Resource Hints from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Resource Hints in B3.28 — Resource Loading & Performance: map it to MDN r",
      "Connect Resource Hints to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Resource Hints in the browser and when do you use it?",
      "answerHint": "Resource Hints is a core Web Platform concept in Resource Loading & Performance. It belongs to browser performance metrics, Core Web Vitals, and profiling. Understanding Resource Hints helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Resource Hints with a DevTools observation and one pitfall.",
      "answerHint": "Locate Resource Hints in B3.28 — Resource Loading & Performance: map it to MDN reference docs and observe behavior in DevTools. Connect Resource Hints to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about resource hints. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Resource Hints from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Resource Hints in a senior frontend interview?",
      "answerHint": "Resource Hints is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for resource hints can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether resource hints succeeds in production. // Resource Hints — minimal browser example\nconsole.log('[b3-resource-hints]', typeof document);\n// Open DevTools → veri"
    }
  ],
  "pitfalls": [
    "Interview trap: describing Resource Hints from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Resource Hints at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Resource Hints is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Resource Hints?",
      "When would Resource Hints block rendering or fail cross-origin?",
      "What is the classic Resource Hints interview trap?"
    ],
    "traps": [
      "Interview trap: describing Resource Hints from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide resource hints details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Resource Hints."
    ]
  }
})
