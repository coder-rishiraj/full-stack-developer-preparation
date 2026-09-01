import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Core Web Vitals",
  "whatIsIt": "Core Web Vitals is a core Web Platform concept in Browser Performance. It belongs to browser performance metrics, Core Web Vitals, and profiling. Understanding Core Web Vitals helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide core web vitals details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Core Web Vitals as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Core Web Vitals in B3.27 — Browser Performance: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Core Web Vitals to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about core web vitals.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Core Web Vitals from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Core Web Vitals — minimal browser example\nconsole.log('[b3-core-web-vitals]', typeof document);\n// Open DevTools → verify behavior for: Core Web Vitals\n// Spec reference: developer.mozilla.org (search \"Core Web Vitals\")",
  "exampleCaption": "Core Web Vitals — observe in DevTools while this runs",
  "internals": [
    "Core Web Vitals is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for core web vitals can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether core web vitals succeeds in production."
  ],
  "takeaways": [
    "Locate Core Web Vitals in B3.27 — Browser Performance: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Core Web Vitals to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Core Web Vitals from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Core Web Vitals is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Core Web Vitals: Treat Core Web Vitals as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Core Web Vitals in B3.27 — Browser Performance: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Core Web Vitals to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Core Web Vitals from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Core Web Vitals",
      "Core Web Vitals is a core Web Platform concept in Browser Performance."
    ],
    [
      "Mental model",
      "Treat Core Web Vitals as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Core Web Vitals from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Core Web Vitals in B3.27 — Browser Performance: map it to MDN reference d",
      "Connect Core Web Vitals to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Core Web Vitals in the browser and when do you use it?",
      "answerHint": "Core Web Vitals is a core Web Platform concept in Browser Performance. It belongs to browser performance metrics, Core Web Vitals, and profiling. Understanding Core Web Vitals helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Core Web Vitals with a DevTools observation and one pitfall.",
      "answerHint": "Locate Core Web Vitals in B3.27 — Browser Performance: map it to MDN reference docs and observe behavior in DevTools. Connect Core Web Vitals to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about core web vitals. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Core Web Vitals from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Core Web Vitals in a senior frontend interview?",
      "answerHint": "Core Web Vitals is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for core web vitals can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether core web vitals succeeds in production. // Core Web Vitals — minimal browser example\nconsole.log('[b3-core-web-vitals]', typeof document);\n// Open DevTools → ve"
    }
  ],
  "pitfalls": [
    "Interview trap: describing Core Web Vitals from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Core Web Vitals at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Core Web Vitals is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Core Web Vitals?",
      "When would Core Web Vitals block rendering or fail cross-origin?",
      "What is the classic Core Web Vitals interview trap?"
    ],
    "traps": [
      "Interview trap: describing Core Web Vitals from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide core web vitals details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Core Web Vitals."
    ]
  }
})
