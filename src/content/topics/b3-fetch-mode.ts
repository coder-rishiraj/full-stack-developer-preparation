import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "mode: cors / no-cors / same-origin",
  "whatIsIt": "mode: cors / no-cors / same-origin is a core Web Platform concept in Fetch API. It belongs to the Fetch API for network requests in the browser. Understanding mode: cors / no-cors / same-origin helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide mode: cors / no-cors / same-origin details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat mode: cors / no-cors / same-origin as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate mode: cors / no-cors / same-origin in B3.11 — Fetch API: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect mode: cors / no-cors / same-origin to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about mode: cors / no-cors / same-origin.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing mode: cors / no-cors / same-origin from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// mode: cors / no-cors / same-origin — minimal browser example\nconsole.log('[b3-fetch-mode]', typeof document);\n// Open DevTools → verify behavior for: mode: cors / no-cors / same-origin\n// Spec reference: developer.mozilla.org (search \"mode: cors / no-cors / same-origin\")",
  "exampleCaption": "mode: cors / no-cors / same-origin — observe in DevTools while this runs",
  "internals": [
    "mode: cors / no-cors / same-origin is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for mode: cors / no-cors / same-origin can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether mode: cors / no-cors / same-origin succeeds in production."
  ],
  "takeaways": [
    "Locate mode: cors / no-cors / same-origin in B3.11 — Fetch API: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect mode: cors / no-cors / same-origin to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing mode: cors / no-cors / same-origin from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "mode: cors / no-cors / same-origin is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "mode: cors / no-cors / same-origin: Treat mode: cors / no-cors / same-origin as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate mode: cors / no-cors / same-origin in B3.11 — Fetch API: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect mode: cors / no-cors / same-origin to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing mode: cors / no-cors / same-origin from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "mode: cors / no-cors / same-origin",
      "mode: cors / no-cors / same-origin is a core Web Platform concept in Fetch API."
    ],
    [
      "Mental model",
      "Treat mode: cors / no-cors / same-origin as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing mode: cors / no-cors / same-origin from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate mode: cors / no-cors / same-origin in B3.11 — Fetch API: map it to MDN re",
      "Connect mode: cors / no-cors / same-origin to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is mode: cors / no-cors / same-origin in the browser and when do you use it?",
      "answerHint": "mode: cors / no-cors / same-origin is a core Web Platform concept in Fetch API. It belongs to the Fetch API for network requests in the browser. Understanding mode: cors / no-cors / same-origin helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain mode: cors / no-cors / same-origin with a DevTools observation and one pitfall.",
      "answerHint": "Locate mode: cors / no-cors / same-origin in B3.11 — Fetch API: map it to MDN reference docs and observe behavior in DevTools. Connect mode: cors / no-cors / same-origin to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about mode: cors / no-cors / same-origin. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing mode: cors / no-cors / same-origin from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain mode: cors / no-cors / same-origin in a senior frontend interview?",
      "answerHint": "mode: cors / no-cors / same-origin is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for mode: cors / no-cors / same-origin can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether mode: cors / no-cors / same-origin succeeds in production. // mode: cors / no-cors / same-origin — minimal browser example\nconsole.log('[b3-fetch-mode]', typeof document);\n// Open"
    }
  ],
  "pitfalls": [
    "Interview trap: describing mode: cors / no-cors / same-origin from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain mode: cors / no-cors / same-origin at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "mode: cors / no-cors / same-origin is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is mode: cors / no-cors / same-origin?",
      "When would mode: cors / no-cors / same-origin block rendering or fail cross-origin?",
      "What is the classic mode: cors / no-cors / same-origin interview trap?"
    ],
    "traps": [
      "Interview trap: describing mode: cors / no-cors / same-origin from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide mode: cors / no-cors / same-origin details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around mode: cors / no-cors / same-origin."
    ]
  }
})
