import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "iframe Loading & Lazy Loading",
  "whatIsIt": "iframe Loading & Lazy Loading is a core Web Platform concept in iframe & Cross-Document Communication. It belongs to iframes, postMessage, and cross-document communication. Understanding iframe Loading & Lazy Loading helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide iframe loading & lazy loading details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat iframe Loading & Lazy Loading as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate iframe Loading & Lazy Loading in B3.30 — iframe & Cross-Document Communication: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect iframe Loading & Lazy Loading to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about iframe loading & lazy loading.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing iframe Loading & Lazy Loading from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// iframe Loading & Lazy Loading — minimal browser example\nconsole.log('[b3-iframe-loading]', typeof document);\n// Open DevTools → verify behavior for: iframe Loading & Lazy Loading\n// Spec reference: developer.mozilla.org (search \"iframe Loading & Lazy Loading\")",
  "exampleCaption": "iframe Loading & Lazy Loading — observe in DevTools while this runs",
  "internals": [
    "iframe Loading & Lazy Loading is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for iframe loading & lazy loading can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether iframe loading & lazy loading succeeds in production."
  ],
  "takeaways": [
    "Locate iframe Loading & Lazy Loading in B3.30 — iframe & Cross-Document Communication: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect iframe Loading & Lazy Loading to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing iframe Loading & Lazy Loading from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "iframe Loading & Lazy Loading is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "iframe Loading & Lazy Loading: Treat iframe Loading & Lazy Loading as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate iframe Loading & Lazy Loading in B3.30 — iframe & Cross-Document Communication: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect iframe Loading & Lazy Loading to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing iframe Loading & Lazy Loading from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "iframe Loading & Lazy Loading",
      "iframe Loading & Lazy Loading is a core Web Platform concept in iframe & Cross-Document Communication."
    ],
    [
      "Mental model",
      "Treat iframe Loading & Lazy Loading as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing iframe Loading & Lazy Loading from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate iframe Loading & Lazy Loading in B3.30 — iframe & Cross-Document Communic",
      "Connect iframe Loading & Lazy Loading to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is iframe Loading & Lazy Loading in the browser and when do you use it?",
      "answerHint": "iframe Loading & Lazy Loading is a core Web Platform concept in iframe & Cross-Document Communication. It belongs to iframes, postMessage, and cross-document communication. Understanding iframe Loading & Lazy Loading helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain iframe Loading & Lazy Loading with a DevTools observation and one pitfall.",
      "answerHint": "Locate iframe Loading & Lazy Loading in B3.30 — iframe & Cross-Document Communication: map it to MDN reference docs and observe behavior in DevTools. Connect iframe Loading & Lazy Loading to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about iframe loading & lazy loading. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing iframe Loading & Lazy Loading from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain iframe Loading & Lazy Loading in a senior frontend interview?",
      "answerHint": "iframe Loading & Lazy Loading is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for iframe loading & lazy loading can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether iframe loading & lazy loading succeeds in production. // iframe Loading & Lazy Loading — minimal browser example\nconsole.log('[b3-iframe-loading]', typeof document);\n// Open "
    }
  ],
  "pitfalls": [
    "Interview trap: describing iframe Loading & Lazy Loading from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain iframe Loading & Lazy Loading at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "iframe Loading & Lazy Loading is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is iframe Loading & Lazy Loading?",
      "When would iframe Loading & Lazy Loading block rendering or fail cross-origin?",
      "What is the classic iframe Loading & Lazy Loading interview trap?"
    ],
    "traps": [
      "Interview trap: describing iframe Loading & Lazy Loading from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide iframe loading & lazy loading details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around iframe Loading & Lazy Loading."
    ]
  }
})
