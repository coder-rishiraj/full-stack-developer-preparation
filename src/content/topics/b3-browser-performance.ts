import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Browser Performance",
  "whatIsIt": "Browser Performance is a core Web Platform concept in Browser Performance. It belongs to browser performance metrics, Core Web Vitals, and profiling. Understanding Browser Performance helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide browser performance details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Browser Performance as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Browser Performance in B3.27 — Browser Performance: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Browser Performance to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about browser performance.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Browser Performance from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Browser Performance — minimal browser example\nconsole.log('[b3-browser-performance]', typeof document);\n// Open DevTools → verify behavior for: Browser Performance\n// Spec reference: developer.mozilla.org (search \"Browser Performance\")",
  "exampleCaption": "Browser Performance — observe in DevTools while this runs",
  "internals": [
    "Browser Performance is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for browser performance can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether browser performance succeeds in production."
  ],
  "takeaways": [
    "Locate Browser Performance in B3.27 — Browser Performance: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Browser Performance to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Browser Performance from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Browser Performance is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Browser Performance: Treat Browser Performance as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Browser Performance in B3.27 — Browser Performance: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Browser Performance to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Browser Performance from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Browser Performance",
      "Browser Performance is a core Web Platform concept in Browser Performance."
    ],
    [
      "Mental model",
      "Treat Browser Performance as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Browser Performance from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Browser Performance in B3.27 — Browser Performance: map it to MDN referen",
      "Connect Browser Performance to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Browser Performance in the browser and when do you use it?",
      "answerHint": "Browser Performance is a core Web Platform concept in Browser Performance. It belongs to browser performance metrics, Core Web Vitals, and profiling. Understanding Browser Performance helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Browser Performance with a DevTools observation and one pitfall.",
      "answerHint": "Locate Browser Performance in B3.27 — Browser Performance: map it to MDN reference docs and observe behavior in DevTools. Connect Browser Performance to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about browser performance. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Browser Performance from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Browser Performance in a senior frontend interview?",
      "answerHint": "Browser Performance is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for browser performance can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether browser performance succeeds in production. // Browser Performance — minimal browser example\nconsole.log('[b3-browser-performance]', typeof document);\n// Open DevTo"
    }
  ],
  "pitfalls": [
    "Interview trap: describing Browser Performance from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Browser Performance at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Browser Performance is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Browser Performance?",
      "When would Browser Performance block rendering or fail cross-origin?",
      "What is the classic Browser Performance interview trap?"
    ],
    "traps": [
      "Interview trap: describing Browser Performance from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide browser performance details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Browser Performance."
    ]
  }
})
