import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Scroll Events",
  "whatIsIt": "Scroll Events is a core Web Platform concept in DOM Events. It belongs to DOM events, propagation, delegation, and listener options. Understanding Scroll Events helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide scroll events details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Scroll Events as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Scroll Events in B3.4 — DOM Events: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Scroll Events to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about scroll events.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Scroll Events from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Scroll Events — minimal browser example\nconsole.log('[b3-scroll-events]', typeof window);\n// Open DevTools → verify behavior for: Scroll Events\n// Spec reference: developer.mozilla.org (search \"Scroll Events\")",
  "exampleCaption": "Scroll Events — observe in DevTools while this runs",
  "internals": [
    "Scroll Events is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for scroll events can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether scroll events succeeds in production."
  ],
  "takeaways": [
    "Locate Scroll Events in B3.4 — DOM Events: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Scroll Events to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Scroll Events from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Scroll Events is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Scroll Events: Treat Scroll Events as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Scroll Events in B3.4 — DOM Events: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Scroll Events to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Scroll Events from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Scroll Events",
      "Scroll Events is a core Web Platform concept in DOM Events."
    ],
    [
      "Mental model",
      "Treat Scroll Events as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Scroll Events from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Scroll Events in B3.4 — DOM Events: map it to MDN reference docs and obse",
      "Connect Scroll Events to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Scroll Events in the browser and when do you use it?",
      "answerHint": "Scroll Events is a core Web Platform concept in DOM Events. It belongs to DOM events, propagation, delegation, and listener options. Understanding Scroll Events helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Scroll Events with a DevTools observation and one pitfall.",
      "answerHint": "Locate Scroll Events in B3.4 — DOM Events: map it to MDN reference docs and observe behavior in DevTools. Connect Scroll Events to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about scroll events. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Scroll Events from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Scroll Events in a senior frontend interview?",
      "answerHint": "Scroll Events is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for scroll events can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether scroll events succeeds in production. // Scroll Events — minimal browser example\nconsole.log('[b3-scroll-events]', typeof window);\n// Open DevTools → verify b"
    }
  ],
  "pitfalls": [
    "Interview trap: describing Scroll Events from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Scroll Events at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Scroll Events is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Scroll Events?",
      "When would Scroll Events block rendering or fail cross-origin?",
      "What is the classic Scroll Events interview trap?"
    ],
    "traps": [
      "Interview trap: describing Scroll Events from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide scroll events details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Scroll Events."
    ]
  }
})
