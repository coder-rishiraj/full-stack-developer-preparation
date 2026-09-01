import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Service Worker Lifecycle",
  "whatIsIt": "Service Worker Lifecycle is a core Web Platform concept in Service Workers. It belongs to Service Workers, caches, and offline behavior. Understanding Service Worker Lifecycle helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide service worker lifecycle details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Service Worker Lifecycle as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Service Worker Lifecycle in B3.22 — Service Workers: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Service Worker Lifecycle to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about service worker lifecycle.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Service Worker Lifecycle from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Service Worker Lifecycle — minimal browser example\nconsole.log('[b3-sw-lifecycle]', typeof document);\n// Open DevTools → verify behavior for: Service Worker Lifecycle\n// Spec reference: developer.mozilla.org (search \"Service Worker Lifecycle\")",
  "exampleCaption": "Service Worker Lifecycle — observe in DevTools while this runs",
  "internals": [
    "Service Worker Lifecycle is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for service worker lifecycle can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether service worker lifecycle succeeds in production."
  ],
  "takeaways": [
    "Locate Service Worker Lifecycle in B3.22 — Service Workers: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Service Worker Lifecycle to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Service Worker Lifecycle from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Service Worker Lifecycle is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Service Worker Lifecycle: Treat Service Worker Lifecycle as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Service Worker Lifecycle in B3.22 — Service Workers: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Service Worker Lifecycle to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Service Worker Lifecycle from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Service Worker Lifecycle",
      "Service Worker Lifecycle is a core Web Platform concept in Service Workers."
    ],
    [
      "Mental model",
      "Treat Service Worker Lifecycle as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Service Worker Lifecycle from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Service Worker Lifecycle in B3.22 — Service Workers: map it to MDN refere",
      "Connect Service Worker Lifecycle to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Service Worker Lifecycle in the browser and when do you use it?",
      "answerHint": "Service Worker Lifecycle is a core Web Platform concept in Service Workers. It belongs to Service Workers, caches, and offline behavior. Understanding Service Worker Lifecycle helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Service Worker Lifecycle with a DevTools observation and one pitfall.",
      "answerHint": "Locate Service Worker Lifecycle in B3.22 — Service Workers: map it to MDN reference docs and observe behavior in DevTools. Connect Service Worker Lifecycle to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about service worker lifecycle. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Service Worker Lifecycle from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Service Worker Lifecycle in a senior frontend interview?",
      "answerHint": "Service Worker Lifecycle is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for service worker lifecycle can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether service worker lifecycle succeeds in production. // Service Worker Lifecycle — minimal browser example\nconsole.log('[b3-sw-lifecycle]', typeof document);\n// Open DevTool"
    }
  ],
  "pitfalls": [
    "Interview trap: describing Service Worker Lifecycle from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Service Worker Lifecycle at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Service Worker Lifecycle is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Service Worker Lifecycle?",
      "When would Service Worker Lifecycle block rendering or fail cross-origin?",
      "What is the classic Service Worker Lifecycle interview trap?"
    ],
    "traps": [
      "Interview trap: describing Service Worker Lifecycle from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide service worker lifecycle details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Service Worker Lifecycle."
    ]
  }
})
