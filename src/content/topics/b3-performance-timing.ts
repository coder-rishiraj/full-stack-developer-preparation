import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Performance Timing / Navigation Timing",
  "whatIsIt": "Performance Timing / Navigation Timing is a core Web Platform concept in Browser Performance. It belongs to browser performance metrics, Core Web Vitals, and profiling. Understanding Performance Timing / Navigation Timing helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide performance timing / navigation timing details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Performance Timing / Navigation Timing as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Performance Timing / Navigation Timing in B3.27 — Browser Performance: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Performance Timing / Navigation Timing to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about performance timing / navigation timing.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Performance Timing / Navigation Timing from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Performance Timing / Navigation Timing — minimal browser example\nconsole.log('[b3-performance-timing]', typeof document);\n// Open DevTools → verify behavior for: Performance Timing / Navigation Timing\n// Spec reference: developer.mozilla.org (search \"Performance Timing / Navigation Timing\")",
  "exampleCaption": "Performance Timing / Navigation Timing — observe in DevTools while this runs",
  "internals": [
    "Performance Timing / Navigation Timing is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for performance timing / navigation timing can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether performance timing / navigation timing succeeds in production."
  ],
  "takeaways": [
    "Locate Performance Timing / Navigation Timing in B3.27 — Browser Performance: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Performance Timing / Navigation Timing to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Performance Timing / Navigation Timing from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Performance Timing / Navigation Timing is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Performance Timing / Navigation Timing: Treat Performance Timing / Navigation Timing as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Performance Timing / Navigation Timing in B3.27 — Browser Performance: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Performance Timing / Navigation Timing to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Performance Timing / Navigation Timing from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Performance Timing / Navigation Timing",
      "Performance Timing / Navigation Timing is a core Web Platform concept in Browser Performance."
    ],
    [
      "Mental model",
      "Treat Performance Timing / Navigation Timing as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Performance Timing / Navigation Timing from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Performance Timing / Navigation Timing in B3.27 — Browser Performance: ma",
      "Connect Performance Timing / Navigation Timing to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Performance Timing / Navigation Timing in the browser and when do you use it?",
      "answerHint": "Performance Timing / Navigation Timing is a core Web Platform concept in Browser Performance. It belongs to browser performance metrics, Core Web Vitals, and profiling. Understanding Performance Timing / Navigation Timing helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Performance Timing / Navigation Timing with a DevTools observation and one pitfall.",
      "answerHint": "Locate Performance Timing / Navigation Timing in B3.27 — Browser Performance: map it to MDN reference docs and observe behavior in DevTools. Connect Performance Timing / Navigation Timing to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about performance timing / navigation timing. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Performance Timing / Navigation Timing from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Performance Timing / Navigation Timing in a senior frontend interview?",
      "answerHint": "Performance Timing / Navigation Timing is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for performance timing / navigation timing can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether performance timing / navigation timing succeeds in production. // Performance Timing / Navigation Timing — minimal browser example\nconsole.log('[b3-performance-timing]', typeof docume"
    }
  ],
  "pitfalls": [
    "Interview trap: describing Performance Timing / Navigation Timing from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Performance Timing / Navigation Timing at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Performance Timing / Navigation Timing is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Performance Timing / Navigation Timing?",
      "When would Performance Timing / Navigation Timing block rendering or fail cross-origin?",
      "What is the classic Performance Timing / Navigation Timing interview trap?"
    ],
    "traps": [
      "Interview trap: describing Performance Timing / Navigation Timing from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide performance timing / navigation timing details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Performance Timing / Navigation Timing."
    ]
  }
})
