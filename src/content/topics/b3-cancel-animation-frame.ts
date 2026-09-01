import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "cancelAnimationFrame",
  "whatIsIt": "cancelAnimationFrame is a core Web Platform concept in requestAnimationFrame. It belongs to requestAnimationFrame and frame-aligned updates. Understanding cancelAnimationFrame helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide cancelanimationframe details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat cancelAnimationFrame as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate cancelAnimationFrame in B3.9 — requestAnimationFrame: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect cancelAnimationFrame to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about cancelanimationframe.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing cancelAnimationFrame from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// cancelAnimationFrame — minimal browser example\nconsole.log('[b3-cancel-animation-frame]', typeof document);\n// Open DevTools → verify behavior for: cancelAnimationFrame\n// Spec reference: developer.mozilla.org (search \"cancelAnimationFrame\")",
  "exampleCaption": "cancelAnimationFrame — observe in DevTools while this runs",
  "internals": [
    "cancelAnimationFrame is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for cancelanimationframe can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether cancelanimationframe succeeds in production."
  ],
  "takeaways": [
    "Locate cancelAnimationFrame in B3.9 — requestAnimationFrame: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect cancelAnimationFrame to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing cancelAnimationFrame from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "cancelAnimationFrame is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "cancelAnimationFrame: Treat cancelAnimationFrame as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate cancelAnimationFrame in B3.9 — requestAnimationFrame: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect cancelAnimationFrame to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing cancelAnimationFrame from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "cancelAnimationFrame",
      "cancelAnimationFrame is a core Web Platform concept in requestAnimationFrame."
    ],
    [
      "Mental model",
      "Treat cancelAnimationFrame as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing cancelAnimationFrame from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate cancelAnimationFrame in B3.9 — requestAnimationFrame: map it to MDN refer",
      "Connect cancelAnimationFrame to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is cancelAnimationFrame in the browser and when do you use it?",
      "answerHint": "cancelAnimationFrame is a core Web Platform concept in requestAnimationFrame. It belongs to requestAnimationFrame and frame-aligned updates. Understanding cancelAnimationFrame helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain cancelAnimationFrame with a DevTools observation and one pitfall.",
      "answerHint": "Locate cancelAnimationFrame in B3.9 — requestAnimationFrame: map it to MDN reference docs and observe behavior in DevTools. Connect cancelAnimationFrame to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about cancelanimationframe. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing cancelAnimationFrame from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain cancelAnimationFrame in a senior frontend interview?",
      "answerHint": "cancelAnimationFrame is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for cancelanimationframe can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether cancelanimationframe succeeds in production. // cancelAnimationFrame — minimal browser example\nconsole.log('[b3-cancel-animation-frame]', typeof document);\n// Open D"
    }
  ],
  "pitfalls": [
    "Interview trap: describing cancelAnimationFrame from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain cancelAnimationFrame at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "cancelAnimationFrame is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is cancelAnimationFrame?",
      "When would cancelAnimationFrame block rendering or fail cross-origin?",
      "What is the classic cancelAnimationFrame interview trap?"
    ],
    "traps": [
      "Interview trap: describing cancelAnimationFrame from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide cancelanimationframe details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around cancelAnimationFrame."
    ]
  }
})
