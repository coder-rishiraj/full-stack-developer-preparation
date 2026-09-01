import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Window Properties & Methods",
  "whatIsIt": "Window Properties & Methods is a core Web Platform concept in Window, Document & BOM. It belongs to the browser global environment (window, document, BOM APIs). Understanding Window Properties & Methods helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide window properties & methods details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Window Properties & Methods as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Window Properties & Methods in B3.2 — Window, Document & BOM: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Window Properties & Methods to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about window properties & methods.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Window Properties & Methods from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Window Properties & Methods — minimal browser example\nconsole.log('[b3-window-properties]', typeof document);\n// Open DevTools → verify behavior for: Window Properties & Methods\n// Spec reference: developer.mozilla.org (search \"Window Properties & Methods\")",
  "exampleCaption": "Window Properties & Methods — observe in DevTools while this runs",
  "internals": [
    "Window Properties & Methods is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for window properties & methods can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether window properties & methods succeeds in production."
  ],
  "takeaways": [
    "Locate Window Properties & Methods in B3.2 — Window, Document & BOM: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Window Properties & Methods to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Window Properties & Methods from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Window Properties & Methods is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Window Properties & Methods: Treat Window Properties & Methods as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Window Properties & Methods in B3.2 — Window, Document & BOM: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Window Properties & Methods to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Window Properties & Methods from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Window Properties & Methods",
      "Window Properties & Methods is a core Web Platform concept in Window, Document & BOM."
    ],
    [
      "Mental model",
      "Treat Window Properties & Methods as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Window Properties & Methods from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Window Properties & Methods in B3.2 — Window, Document & BOM: map it to M",
      "Connect Window Properties & Methods to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Window Properties & Methods in the browser and when do you use it?",
      "answerHint": "Window Properties & Methods is a core Web Platform concept in Window, Document & BOM. It belongs to the browser global environment (window, document, BOM APIs). Understanding Window Properties & Methods helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Window Properties & Methods with a DevTools observation and one pitfall.",
      "answerHint": "Locate Window Properties & Methods in B3.2 — Window, Document & BOM: map it to MDN reference docs and observe behavior in DevTools. Connect Window Properties & Methods to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about window properties & methods. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Window Properties & Methods from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Window Properties & Methods in a senior frontend interview?",
      "answerHint": "Window Properties & Methods is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for window properties & methods can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether window properties & methods succeeds in production. // Window Properties & Methods — minimal browser example\nconsole.log('[b3-window-properties]', typeof document);\n// Open"
    }
  ],
  "pitfalls": [
    "Interview trap: describing Window Properties & Methods from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Window Properties & Methods at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Window Properties & Methods is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Window Properties & Methods?",
      "When would Window Properties & Methods block rendering or fail cross-origin?",
      "What is the classic Window Properties & Methods interview trap?"
    ],
    "traps": [
      "Interview trap: describing Window Properties & Methods from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide window properties & methods details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Window Properties & Methods."
    ]
  }
})
