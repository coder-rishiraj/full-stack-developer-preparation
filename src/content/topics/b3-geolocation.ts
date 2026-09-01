import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Geolocation API",
  "whatIsIt": "Geolocation API is a core Web Platform concept in Permissions & Device APIs. It belongs to Permissions API and device APIs in secure contexts. Understanding Geolocation API helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide geolocation api details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Geolocation API as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Geolocation API in B3.34 — Permissions & Device APIs: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Geolocation API to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about geolocation api.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Geolocation API from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Geolocation API — minimal browser example\nconsole.log('[b3-geolocation]', typeof window);\n// Open DevTools → verify behavior for: Geolocation API\n// Spec reference: developer.mozilla.org (search \"Geolocation API\")",
  "exampleCaption": "Geolocation API — observe in DevTools while this runs",
  "internals": [
    "Geolocation API is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for geolocation api can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether geolocation api succeeds in production."
  ],
  "takeaways": [
    "Locate Geolocation API in B3.34 — Permissions & Device APIs: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Geolocation API to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Geolocation API from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Geolocation API is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Geolocation API: Treat Geolocation API as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Geolocation API in B3.34 — Permissions & Device APIs: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Geolocation API to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Geolocation API from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Geolocation API",
      "Geolocation API is a core Web Platform concept in Permissions & Device APIs."
    ],
    [
      "Mental model",
      "Treat Geolocation API as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Geolocation API from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Geolocation API in B3.34 — Permissions & Device APIs: map it to MDN refer",
      "Connect Geolocation API to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Geolocation API in the browser and when do you use it?",
      "answerHint": "Geolocation API is a core Web Platform concept in Permissions & Device APIs. It belongs to Permissions API and device APIs in secure contexts. Understanding Geolocation API helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Geolocation API with a DevTools observation and one pitfall.",
      "answerHint": "Locate Geolocation API in B3.34 — Permissions & Device APIs: map it to MDN reference docs and observe behavior in DevTools. Connect Geolocation API to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about geolocation api. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Geolocation API from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Geolocation API in a senior frontend interview?",
      "answerHint": "Geolocation API is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for geolocation api can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether geolocation api succeeds in production. // Geolocation API — minimal browser example\nconsole.log('[b3-geolocation]', typeof window);\n// Open DevTools → verify b"
    }
  ],
  "pitfalls": [
    "Interview trap: describing Geolocation API from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Geolocation API at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Geolocation API is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Geolocation API?",
      "When would Geolocation API block rendering or fail cross-origin?",
      "What is the classic Geolocation API interview trap?"
    ],
    "traps": [
      "Interview trap: describing Geolocation API from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide geolocation api details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Geolocation API."
    ]
  }
})
