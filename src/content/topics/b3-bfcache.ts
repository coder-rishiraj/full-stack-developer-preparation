import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Back/Forward Cache (bfcache)",
  "whatIsIt": "Back/Forward Cache (bfcache) is a core Web Platform concept in Navigation & SPA Browser Behavior. It belongs to History API, SPA navigation, and browser history stack. Understanding Back/Forward Cache (bfcache) helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide back/forward cache (bfcache) details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Back/Forward Cache (bfcache) as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Back/Forward Cache (bfcache) in B3.29 — Navigation & SPA Browser Behavior: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Back/Forward Cache (bfcache) to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about back/forward cache (bfcache).",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Back/Forward Cache (bfcache) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Back/Forward Cache (bfcache) — minimal browser example\nconsole.log('[b3-bfcache]', typeof document);\n// Open DevTools → verify behavior for: Back/Forward Cache (bfcache)\n// Spec reference: developer.mozilla.org (search \"Back/Forward Cache (bfcache)\")",
  "exampleCaption": "Back/Forward Cache (bfcache) — observe in DevTools while this runs",
  "internals": [
    "Back/Forward Cache (bfcache) is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for back/forward cache (bfcache) can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether back/forward cache (bfcache) succeeds in production."
  ],
  "takeaways": [
    "Locate Back/Forward Cache (bfcache) in B3.29 — Navigation & SPA Browser Behavior: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Back/Forward Cache (bfcache) to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Back/Forward Cache (bfcache) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Back/Forward Cache (bfcache) is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Back/Forward Cache (bfcache): Treat Back/Forward Cache (bfcache) as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Back/Forward Cache (bfcache) in B3.29 — Navigation & SPA Browser Behavior: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Back/Forward Cache (bfcache) to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Back/Forward Cache (bfcache) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Back/Forward Cache (bfcache)",
      "Back/Forward Cache (bfcache) is a core Web Platform concept in Navigation & SPA Browser Behavior."
    ],
    [
      "Mental model",
      "Treat Back/Forward Cache (bfcache) as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Back/Forward Cache (bfcache) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Back/Forward Cache (bfcache) in B3.29 — Navigation & SPA Browser Behavior",
      "Connect Back/Forward Cache (bfcache) to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Back/Forward Cache (bfcache) in the browser and when do you use it?",
      "answerHint": "Back/Forward Cache (bfcache) is a core Web Platform concept in Navigation & SPA Browser Behavior. It belongs to History API, SPA navigation, and browser history stack. Understanding Back/Forward Cache (bfcache) helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Back/Forward Cache (bfcache) with a DevTools observation and one pitfall.",
      "answerHint": "Locate Back/Forward Cache (bfcache) in B3.29 — Navigation & SPA Browser Behavior: map it to MDN reference docs and observe behavior in DevTools. Connect Back/Forward Cache (bfcache) to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about back/forward cache (bfcache). Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Back/Forward Cache (bfcache) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Back/Forward Cache (bfcache) in a senior frontend interview?",
      "answerHint": "Back/Forward Cache (bfcache) is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for back/forward cache (bfcache) can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether back/forward cache (bfcache) succeeds in production. // Back/Forward Cache (bfcache) — minimal browser example\nconsole.log('[b3-bfcache]', typeof document);\n// Open DevTools"
    }
  ],
  "pitfalls": [
    "Interview trap: describing Back/Forward Cache (bfcache) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Back/Forward Cache (bfcache) at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Back/Forward Cache (bfcache) is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Back/Forward Cache (bfcache)?",
      "When would Back/Forward Cache (bfcache) block rendering or fail cross-origin?",
      "What is the classic Back/Forward Cache (bfcache) interview trap?"
    ],
    "traps": [
      "Interview trap: describing Back/Forward Cache (bfcache) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide back/forward cache (bfcache) details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Back/Forward Cache (bfcache)."
    ]
  }
})
