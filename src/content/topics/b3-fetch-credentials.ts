import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "credentials: include / same-origin / omit",
  "whatIsIt": "credentials: include / same-origin / omit is a core Web Platform concept in Fetch API. It belongs to the Fetch API for network requests in the browser. Understanding credentials: include / same-origin / omit helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide credentials: include / same-origin / omit details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat credentials: include / same-origin / omit as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate credentials: include / same-origin / omit in B3.11 — Fetch API: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect credentials: include / same-origin / omit to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about credentials: include / same-origin / omit.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing credentials: include / same-origin / omit from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// credentials: include / same-origin / omit — minimal browser example\nconsole.log('[b3-fetch-credentials]', typeof document);\n// Open DevTools → verify behavior for: credentials: include / same-origin / omit\n// Spec reference: developer.mozilla.org (search \"credentials: include / same-origin / omit\")",
  "exampleCaption": "credentials: include / same-origin / omit — observe in DevTools while this runs",
  "internals": [
    "credentials: include / same-origin / omit is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for credentials: include / same-origin / omit can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether credentials: include / same-origin / omit succeeds in production."
  ],
  "takeaways": [
    "Locate credentials: include / same-origin / omit in B3.11 — Fetch API: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect credentials: include / same-origin / omit to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing credentials: include / same-origin / omit from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "credentials: include / same-origin / omit is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "credentials: include / same-origin / omit: Treat credentials: include / same-origin / omit as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate credentials: include / same-origin / omit in B3.11 — Fetch API: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect credentials: include / same-origin / omit to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing credentials: include / same-origin / omit from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "credentials: include / same-origin / omit",
      "credentials: include / same-origin / omit is a core Web Platform concept in Fetch API."
    ],
    [
      "Mental model",
      "Treat credentials: include / same-origin / omit as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing credentials: include / same-origin / omit from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate credentials: include / same-origin / omit in B3.11 — Fetch API: map it to",
      "Connect credentials: include / same-origin / omit to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is credentials: include / same-origin / omit in the browser and when do you use it?",
      "answerHint": "credentials: include / same-origin / omit is a core Web Platform concept in Fetch API. It belongs to the Fetch API for network requests in the browser. Understanding credentials: include / same-origin / omit helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain credentials: include / same-origin / omit with a DevTools observation and one pitfall.",
      "answerHint": "Locate credentials: include / same-origin / omit in B3.11 — Fetch API: map it to MDN reference docs and observe behavior in DevTools. Connect credentials: include / same-origin / omit to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about credentials: include / same-origin / omit. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing credentials: include / same-origin / omit from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain credentials: include / same-origin / omit in a senior frontend interview?",
      "answerHint": "credentials: include / same-origin / omit is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for credentials: include / same-origin / omit can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether credentials: include / same-origin / omit succeeds in production. // credentials: include / same-origin / omit — minimal browser example\nconsole.log('[b3-fetch-credentials]', typeof docu"
    }
  ],
  "pitfalls": [
    "Interview trap: describing credentials: include / same-origin / omit from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain credentials: include / same-origin / omit at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "credentials: include / same-origin / omit is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is credentials: include / same-origin / omit?",
      "When would credentials: include / same-origin / omit block rendering or fail cross-origin?",
      "What is the classic credentials: include / same-origin / omit interview trap?"
    ],
    "traps": [
      "Interview trap: describing credentials: include / same-origin / omit from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide credentials: include / same-origin / omit details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around credentials: include / same-origin / omit."
    ]
  }
})
