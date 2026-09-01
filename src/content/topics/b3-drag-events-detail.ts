import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "dragstart / dragover / drop",
  "whatIsIt": "dragstart / dragover / drop is a core Web Platform concept in Clipboard, Drag & Drop, Selection. It belongs to Clipboard, drag-and-drop, and selection APIs. Understanding dragstart / dragover / drop helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide dragstart / dragover / drop details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat dragstart / dragover / drop as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate dragstart / dragover / drop in B3.33 — Clipboard, Drag & Drop, Selection: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect dragstart / dragover / drop to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about dragstart / dragover / drop.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing dragstart / dragover / drop from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// dragstart / dragover / drop — minimal browser example\nconsole.log('[b3-drag-events-detail]', typeof document);\n// Open DevTools → verify behavior for: dragstart / dragover / drop\n// Spec reference: developer.mozilla.org (search \"dragstart / dragover / drop\")",
  "exampleCaption": "dragstart / dragover / drop — observe in DevTools while this runs",
  "internals": [
    "dragstart / dragover / drop is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for dragstart / dragover / drop can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether dragstart / dragover / drop succeeds in production."
  ],
  "takeaways": [
    "Locate dragstart / dragover / drop in B3.33 — Clipboard, Drag & Drop, Selection: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect dragstart / dragover / drop to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing dragstart / dragover / drop from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "dragstart / dragover / drop is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "dragstart / dragover / drop: Treat dragstart / dragover / drop as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate dragstart / dragover / drop in B3.33 — Clipboard, Drag & Drop, Selection: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect dragstart / dragover / drop to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing dragstart / dragover / drop from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "dragstart / dragover / drop",
      "dragstart / dragover / drop is a core Web Platform concept in Clipboard, Drag & Drop, Selection."
    ],
    [
      "Mental model",
      "Treat dragstart / dragover / drop as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing dragstart / dragover / drop from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate dragstart / dragover / drop in B3.33 — Clipboard, Drag & Drop, Selection:",
      "Connect dragstart / dragover / drop to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is dragstart / dragover / drop in the browser and when do you use it?",
      "answerHint": "dragstart / dragover / drop is a core Web Platform concept in Clipboard, Drag & Drop, Selection. It belongs to Clipboard, drag-and-drop, and selection APIs. Understanding dragstart / dragover / drop helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain dragstart / dragover / drop with a DevTools observation and one pitfall.",
      "answerHint": "Locate dragstart / dragover / drop in B3.33 — Clipboard, Drag & Drop, Selection: map it to MDN reference docs and observe behavior in DevTools. Connect dragstart / dragover / drop to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about dragstart / dragover / drop. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing dragstart / dragover / drop from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain dragstart / dragover / drop in a senior frontend interview?",
      "answerHint": "dragstart / dragover / drop is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for dragstart / dragover / drop can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether dragstart / dragover / drop succeeds in production. // dragstart / dragover / drop — minimal browser example\nconsole.log('[b3-drag-events-detail]', typeof document);\n// Ope"
    }
  ],
  "pitfalls": [
    "Interview trap: describing dragstart / dragover / drop from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain dragstart / dragover / drop at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "dragstart / dragover / drop is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is dragstart / dragover / drop?",
      "When would dragstart / dragover / drop block rendering or fail cross-origin?",
      "What is the classic dragstart / dragover / drop interview trap?"
    ],
    "traps": [
      "Interview trap: describing dragstart / dragover / drop from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide dragstart / dragover / drop details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around dragstart / dragover / drop."
    ]
  }
})
