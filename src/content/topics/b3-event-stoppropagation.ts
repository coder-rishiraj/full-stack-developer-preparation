import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "stopPropagation / stopImmediatePropagation",
  "whatIsIt": "stopPropagation / stopImmediatePropagation is a core Web Platform concept in DOM Events. It belongs to DOM events, propagation, delegation, and listener options. Understanding stopPropagation / stopImmediatePropagation helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide stoppropagation / stopimmediatepropagation details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat stopPropagation / stopImmediatePropagation as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate stopPropagation / stopImmediatePropagation in B3.4 — DOM Events: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect stopPropagation / stopImmediatePropagation to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about stoppropagation / stopimmediatepropagation.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing stopPropagation / stopImmediatePropagation from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// stopPropagation / stopImmediatePropagation — minimal browser example\nconsole.log('[b3-event-stoppropagation]', typeof document);\n// Open DevTools → verify behavior for: stopPropagation / stopImmediatePropagation\n// Spec reference: developer.mozilla.org (search \"stopPropagation / stopImmediatePropagation\")",
  "exampleCaption": "stopPropagation / stopImmediatePropagation — observe in DevTools while this runs",
  "internals": [
    "stopPropagation / stopImmediatePropagation is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for stoppropagation / stopimmediatepropagation can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether stoppropagation / stopimmediatepropagation succeeds in production."
  ],
  "takeaways": [
    "Locate stopPropagation / stopImmediatePropagation in B3.4 — DOM Events: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect stopPropagation / stopImmediatePropagation to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing stopPropagation / stopImmediatePropagation from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "stopPropagation / stopImmediatePropagation is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "stopPropagation / stopImmediatePropagation: Treat stopPropagation / stopImmediatePropagation as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate stopPropagation / stopImmediatePropagation in B3.4 — DOM Events: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect stopPropagation / stopImmediatePropagation to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing stopPropagation / stopImmediatePropagation from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "stopPropagation / stopImmediatePropagation",
      "stopPropagation / stopImmediatePropagation is a core Web Platform concept in DOM Events."
    ],
    [
      "Mental model",
      "Treat stopPropagation / stopImmediatePropagation as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing stopPropagation / stopImmediatePropagation from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate stopPropagation / stopImmediatePropagation in B3.4 — DOM Events: map it t",
      "Connect stopPropagation / stopImmediatePropagation to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is stopPropagation / stopImmediatePropagation in the browser and when do you use it?",
      "answerHint": "stopPropagation / stopImmediatePropagation is a core Web Platform concept in DOM Events. It belongs to DOM events, propagation, delegation, and listener options. Understanding stopPropagation / stopImmediatePropagation helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain stopPropagation / stopImmediatePropagation with a DevTools observation and one pitfall.",
      "answerHint": "Locate stopPropagation / stopImmediatePropagation in B3.4 — DOM Events: map it to MDN reference docs and observe behavior in DevTools. Connect stopPropagation / stopImmediatePropagation to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about stoppropagation / stopimmediatepropagation. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing stopPropagation / stopImmediatePropagation from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain stopPropagation / stopImmediatePropagation in a senior frontend interview?",
      "answerHint": "stopPropagation / stopImmediatePropagation is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for stoppropagation / stopimmediatepropagation can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether stoppropagation / stopimmediatepropagation succeeds in production. // stopPropagation / stopImmediatePropagation — minimal browser example\nconsole.log('[b3-event-stoppropagation]', typeof"
    }
  ],
  "pitfalls": [
    "Interview trap: describing stopPropagation / stopImmediatePropagation from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain stopPropagation / stopImmediatePropagation at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "stopPropagation / stopImmediatePropagation is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is stopPropagation / stopImmediatePropagation?",
      "When would stopPropagation / stopImmediatePropagation block rendering or fail cross-origin?",
      "What is the classic stopPropagation / stopImmediatePropagation interview trap?"
    ],
    "traps": [
      "Interview trap: describing stopPropagation / stopImmediatePropagation from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide stoppropagation / stopimmediatepropagation details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around stopPropagation / stopImmediatePropagation."
    ]
  }
})
