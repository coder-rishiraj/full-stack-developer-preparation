import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "fetch Event & Request Interception",
  "whatIsIt": "fetch Event & Request Interception is a core Web Platform concept in Service Workers. It belongs to Service Workers, caches, and offline behavior. Understanding fetch Event & Request Interception helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide fetch event & request interception details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat fetch Event & Request Interception as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate fetch Event & Request Interception in B3.22 — Service Workers: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect fetch Event & Request Interception to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about fetch event & request interception.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing fetch Event & Request Interception from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// fetch Event & Request Interception — minimal browser example\nconsole.log('[b3-sw-fetch-intercept]', typeof window);\n// Open DevTools → verify behavior for: fetch Event & Request Interception\n// Spec reference: developer.mozilla.org (search \"fetch Event & Request Interception\")",
  "exampleCaption": "fetch Event & Request Interception — observe in DevTools while this runs",
  "internals": [
    "fetch Event & Request Interception is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for fetch event & request interception can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether fetch event & request interception succeeds in production."
  ],
  "takeaways": [
    "Locate fetch Event & Request Interception in B3.22 — Service Workers: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect fetch Event & Request Interception to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing fetch Event & Request Interception from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "fetch Event & Request Interception is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "fetch Event & Request Interception: Treat fetch Event & Request Interception as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate fetch Event & Request Interception in B3.22 — Service Workers: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect fetch Event & Request Interception to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing fetch Event & Request Interception from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "fetch Event & Request Interception",
      "fetch Event & Request Interception is a core Web Platform concept in Service Workers."
    ],
    [
      "Mental model",
      "Treat fetch Event & Request Interception as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing fetch Event & Request Interception from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate fetch Event & Request Interception in B3.22 — Service Workers: map it to ",
      "Connect fetch Event & Request Interception to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is fetch Event & Request Interception in the browser and when do you use it?",
      "answerHint": "fetch Event & Request Interception is a core Web Platform concept in Service Workers. It belongs to Service Workers, caches, and offline behavior. Understanding fetch Event & Request Interception helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain fetch Event & Request Interception with a DevTools observation and one pitfall.",
      "answerHint": "Locate fetch Event & Request Interception in B3.22 — Service Workers: map it to MDN reference docs and observe behavior in DevTools. Connect fetch Event & Request Interception to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about fetch event & request interception. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing fetch Event & Request Interception from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain fetch Event & Request Interception in a senior frontend interview?",
      "answerHint": "fetch Event & Request Interception is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for fetch event & request interception can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether fetch event & request interception succeeds in production. // fetch Event & Request Interception — minimal browser example\nconsole.log('[b3-sw-fetch-intercept]', typeof window);\n/"
    }
  ],
  "pitfalls": [
    "Interview trap: describing fetch Event & Request Interception from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain fetch Event & Request Interception at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "fetch Event & Request Interception is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is fetch Event & Request Interception?",
      "When would fetch Event & Request Interception block rendering or fail cross-origin?",
      "What is the classic fetch Event & Request Interception interview trap?"
    ],
    "traps": [
      "Interview trap: describing fetch Event & Request Interception from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide fetch event & request interception details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around fetch Event & Request Interception."
    ]
  }
})
