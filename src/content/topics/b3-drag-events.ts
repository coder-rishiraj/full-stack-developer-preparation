import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Drag Events",
  "whatIsIt": "Drag Events is a core Web Platform concept in DOM Events. It belongs to DOM events, propagation, delegation, and listener options. Understanding Drag Events helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide drag events details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Drag Events as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Drag Events in B3.4 — DOM Events: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Drag Events to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about drag events.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Drag Events from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Drag Events — minimal browser example\nconsole.log('[b3-drag-events]', typeof window);\n// Open DevTools → verify behavior for: Drag Events\n// Spec reference: developer.mozilla.org (search \"Drag Events\")",
  "exampleCaption": "Drag Events — observe in DevTools while this runs",
  "internals": [
    "Drag Events is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for drag events can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether drag events succeeds in production."
  ],
  "takeaways": [
    "Locate Drag Events in B3.4 — DOM Events: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Drag Events to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Drag Events from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Drag Events is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Drag Events: Treat Drag Events as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Drag Events in B3.4 — DOM Events: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Drag Events to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Drag Events from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Drag Events",
      "Drag Events is a core Web Platform concept in DOM Events."
    ],
    [
      "Mental model",
      "Treat Drag Events as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Drag Events from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Drag Events in B3.4 — DOM Events: map it to MDN reference docs and observ",
      "Connect Drag Events to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Drag Events in the browser and when do you use it?",
      "answerHint": "Drag Events is a core Web Platform concept in DOM Events. It belongs to DOM events, propagation, delegation, and listener options. Understanding Drag Events helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Drag Events with a DevTools observation and one pitfall.",
      "answerHint": "Locate Drag Events in B3.4 — DOM Events: map it to MDN reference docs and observe behavior in DevTools. Connect Drag Events to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about drag events. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Drag Events from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Drag Events in a senior frontend interview?",
      "answerHint": "Drag Events is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for drag events can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether drag events succeeds in production. // Drag Events — minimal browser example\nconsole.log('[b3-drag-events]', typeof window);\n// Open DevTools → verify behav"
    }
  ],
  "pitfalls": [
    "Interview trap: describing Drag Events from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Drag Events at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Drag Events is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Drag Events?",
      "When would Drag Events block rendering or fail cross-origin?",
      "What is the classic Drag Events interview trap?"
    ],
    "traps": [
      "Interview trap: describing Drag Events from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide drag events details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Drag Events."
    ]
  }
})
