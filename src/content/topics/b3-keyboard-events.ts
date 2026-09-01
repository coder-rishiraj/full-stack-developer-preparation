import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Keyboard Events",
  "whatIsIt": "Keyboard Events is a core Web Platform concept in DOM Events. It belongs to DOM events, propagation, delegation, and listener options. Understanding Keyboard Events helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide keyboard events details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Keyboard Events as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Keyboard Events in B3.4 — DOM Events: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Keyboard Events to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about keyboard events.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Keyboard Events from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Keyboard Events — minimal browser example\nconsole.log('[b3-keyboard-events]', typeof window);\n// Open DevTools → verify behavior for: Keyboard Events\n// Spec reference: developer.mozilla.org (search \"Keyboard Events\")",
  "exampleCaption": "Keyboard Events — observe in DevTools while this runs",
  "internals": [
    "Keyboard Events is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for keyboard events can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether keyboard events succeeds in production."
  ],
  "takeaways": [
    "Locate Keyboard Events in B3.4 — DOM Events: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Keyboard Events to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Keyboard Events from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Keyboard Events is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Keyboard Events: Treat Keyboard Events as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Keyboard Events in B3.4 — DOM Events: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Keyboard Events to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Keyboard Events from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Keyboard Events",
      "Keyboard Events is a core Web Platform concept in DOM Events."
    ],
    [
      "Mental model",
      "Treat Keyboard Events as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Keyboard Events from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Keyboard Events in B3.4 — DOM Events: map it to MDN reference docs and ob",
      "Connect Keyboard Events to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Keyboard Events in the browser and when do you use it?",
      "answerHint": "Keyboard Events is a core Web Platform concept in DOM Events. It belongs to DOM events, propagation, delegation, and listener options. Understanding Keyboard Events helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Keyboard Events with a DevTools observation and one pitfall.",
      "answerHint": "Locate Keyboard Events in B3.4 — DOM Events: map it to MDN reference docs and observe behavior in DevTools. Connect Keyboard Events to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about keyboard events. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Keyboard Events from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Keyboard Events in a senior frontend interview?",
      "answerHint": "Keyboard Events is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for keyboard events can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether keyboard events succeeds in production. // Keyboard Events — minimal browser example\nconsole.log('[b3-keyboard-events]', typeof window);\n// Open DevTools → veri"
    }
  ],
  "pitfalls": [
    "Interview trap: describing Keyboard Events from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Keyboard Events at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Keyboard Events is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Keyboard Events?",
      "When would Keyboard Events block rendering or fail cross-origin?",
      "What is the classic Keyboard Events interview trap?"
    ],
    "traps": [
      "Interview trap: describing Keyboard Events from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide keyboard events details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Keyboard Events."
    ]
  }
})
