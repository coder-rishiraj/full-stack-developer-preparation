import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Vibration API",
  "whatIsIt": "Vibration API is a core Web Platform concept in Permissions & Device APIs. It belongs to Permissions API and device APIs in secure contexts. Understanding Vibration API helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide vibration api details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Vibration API as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Vibration API in B3.34 — Permissions & Device APIs: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Vibration API to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about vibration api.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Vibration API from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Vibration API — minimal browser example\nconsole.log('[b3-vibration-api]', typeof window);\n// Open DevTools → verify behavior for: Vibration API\n// Spec reference: developer.mozilla.org (search \"Vibration API\")",
  "exampleCaption": "Vibration API — observe in DevTools while this runs",
  "internals": [
    "Vibration API is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for vibration api can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether vibration api succeeds in production."
  ],
  "takeaways": [
    "Locate Vibration API in B3.34 — Permissions & Device APIs: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Vibration API to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Vibration API from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Vibration API is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Vibration API: Treat Vibration API as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Vibration API in B3.34 — Permissions & Device APIs: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Vibration API to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Vibration API from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Vibration API",
      "Vibration API is a core Web Platform concept in Permissions & Device APIs."
    ],
    [
      "Mental model",
      "Treat Vibration API as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Vibration API from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Vibration API in B3.34 — Permissions & Device APIs: map it to MDN referen",
      "Connect Vibration API to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Vibration API in the browser and when do you use it?",
      "answerHint": "Vibration API is a core Web Platform concept in Permissions & Device APIs. It belongs to Permissions API and device APIs in secure contexts. Understanding Vibration API helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Vibration API with a DevTools observation and one pitfall.",
      "answerHint": "Locate Vibration API in B3.34 — Permissions & Device APIs: map it to MDN reference docs and observe behavior in DevTools. Connect Vibration API to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about vibration api. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Vibration API from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Vibration API in a senior frontend interview?",
      "answerHint": "Vibration API is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for vibration api can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether vibration api succeeds in production. // Vibration API — minimal browser example\nconsole.log('[b3-vibration-api]', typeof window);\n// Open DevTools → verify b"
    }
  ],
  "pitfalls": [
    "Interview trap: describing Vibration API from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Vibration API at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Vibration API is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Vibration API?",
      "When would Vibration API block rendering or fail cross-origin?",
      "What is the classic Vibration API interview trap?"
    ],
    "traps": [
      "Interview trap: describing Vibration API from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide vibration api details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Vibration API."
    ]
  }
})
