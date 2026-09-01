import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "SPA Navigation & bfcache",
  "whatIsIt": "SPA Navigation & bfcache is a core Web Platform concept in Browser Interview Scenarios. It belongs to senior frontend browser interview reasoning. Understanding SPA Navigation & bfcache helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide spa navigation & bfcache details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat SPA Navigation & bfcache as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate SPA Navigation & bfcache in B3.37 — Browser Interview Scenarios: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect SPA Navigation & bfcache to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about spa navigation & bfcache.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing SPA Navigation & bfcache from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// SPA Navigation & bfcache — minimal browser example\nconsole.log('[b3-interview-spa-navigation]', typeof document);\n// Open DevTools → verify behavior for: SPA Navigation & bfcache\n// Spec reference: developer.mozilla.org (search \"SPA Navigation & bfcache\")",
  "exampleCaption": "SPA Navigation & bfcache — observe in DevTools while this runs",
  "internals": [
    "SPA Navigation & bfcache is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for spa navigation & bfcache can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether spa navigation & bfcache succeeds in production."
  ],
  "takeaways": [
    "Locate SPA Navigation & bfcache in B3.37 — Browser Interview Scenarios: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect SPA Navigation & bfcache to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing SPA Navigation & bfcache from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "SPA Navigation & bfcache is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "SPA Navigation & bfcache: Treat SPA Navigation & bfcache as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate SPA Navigation & bfcache in B3.37 — Browser Interview Scenarios: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect SPA Navigation & bfcache to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing SPA Navigation & bfcache from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "SPA Navigation & bfcache",
      "SPA Navigation & bfcache is a core Web Platform concept in Browser Interview Scenarios."
    ],
    [
      "Mental model",
      "Treat SPA Navigation & bfcache as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing SPA Navigation & bfcache from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate SPA Navigation & bfcache in B3.37 — Browser Interview Scenarios: map it t",
      "Connect SPA Navigation & bfcache to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is SPA Navigation & bfcache in the browser and when do you use it?",
      "answerHint": "SPA Navigation & bfcache is a core Web Platform concept in Browser Interview Scenarios. It belongs to senior frontend browser interview reasoning. Understanding SPA Navigation & bfcache helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain SPA Navigation & bfcache with a DevTools observation and one pitfall.",
      "answerHint": "Locate SPA Navigation & bfcache in B3.37 — Browser Interview Scenarios: map it to MDN reference docs and observe behavior in DevTools. Connect SPA Navigation & bfcache to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about spa navigation & bfcache. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing SPA Navigation & bfcache from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain SPA Navigation & bfcache in a senior frontend interview?",
      "answerHint": "SPA Navigation & bfcache is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for spa navigation & bfcache can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether spa navigation & bfcache succeeds in production. // SPA Navigation & bfcache — minimal browser example\nconsole.log('[b3-interview-spa-navigation]', typeof document);\n// "
    }
  ],
  "pitfalls": [
    "Interview trap: describing SPA Navigation & bfcache from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain SPA Navigation & bfcache at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "SPA Navigation & bfcache is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is SPA Navigation & bfcache?",
      "When would SPA Navigation & bfcache block rendering or fail cross-origin?",
      "What is the classic SPA Navigation & bfcache interview trap?"
    ],
    "traps": [
      "Interview trap: describing SPA Navigation & bfcache from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide spa navigation & bfcache details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around SPA Navigation & bfcache."
    ]
  }
})
