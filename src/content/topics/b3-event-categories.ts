import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Event Categories",
  "whatIsIt": "Event Categories is a core Web Platform concept in DOM Events. It belongs to DOM events, propagation, delegation, and listener options. Understanding Event Categories helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide event categories details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Event Categories as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Event Categories in B3.4 — DOM Events: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Event Categories to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about event categories.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Event Categories from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Event Categories — minimal browser example\nconsole.log('[b3-event-categories]', typeof window);\n// Open DevTools → verify behavior for: Event Categories\n// Spec reference: developer.mozilla.org (search \"Event Categories\")",
  "exampleCaption": "Event Categories — observe in DevTools while this runs",
  "internals": [
    "Event Categories is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for event categories can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether event categories succeeds in production."
  ],
  "takeaways": [
    "Locate Event Categories in B3.4 — DOM Events: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Event Categories to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Event Categories from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Event Categories is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Event Categories: Treat Event Categories as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Event Categories in B3.4 — DOM Events: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Event Categories to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Event Categories from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Event Categories",
      "Event Categories is a core Web Platform concept in DOM Events."
    ],
    [
      "Mental model",
      "Treat Event Categories as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Event Categories from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Event Categories in B3.4 — DOM Events: map it to MDN reference docs and o",
      "Connect Event Categories to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Event Categories in the browser and when do you use it?",
      "answerHint": "Event Categories is a core Web Platform concept in DOM Events. It belongs to DOM events, propagation, delegation, and listener options. Understanding Event Categories helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Event Categories with a DevTools observation and one pitfall.",
      "answerHint": "Locate Event Categories in B3.4 — DOM Events: map it to MDN reference docs and observe behavior in DevTools. Connect Event Categories to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about event categories. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Event Categories from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Event Categories in a senior frontend interview?",
      "answerHint": "Event Categories is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for event categories can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether event categories succeeds in production. // Event Categories — minimal browser example\nconsole.log('[b3-event-categories]', typeof window);\n// Open DevTools → ve"
    }
  ],
  "pitfalls": [
    "Interview trap: describing Event Categories from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Event Categories at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Event Categories is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Event Categories?",
      "When would Event Categories block rendering or fail cross-origin?",
      "What is the classic Event Categories interview trap?"
    ],
    "traps": [
      "Interview trap: describing Event Categories from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide event categories details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Event Categories."
    ]
  }
})
