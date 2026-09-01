import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "dataTransfer Object",
  "whatIsIt": "dataTransfer Object is a core Web Platform concept in Clipboard, Drag & Drop, Selection. It belongs to Clipboard, drag-and-drop, and selection APIs. Understanding dataTransfer Object helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide datatransfer object details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat dataTransfer Object as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate dataTransfer Object in B3.33 — Clipboard, Drag & Drop, Selection: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect dataTransfer Object to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about datatransfer object.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing dataTransfer Object from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// dataTransfer Object — minimal browser example\nconsole.log('[b3-data-transfer]', typeof document);\n// Open DevTools → verify behavior for: dataTransfer Object\n// Spec reference: developer.mozilla.org (search \"dataTransfer Object\")",
  "exampleCaption": "dataTransfer Object — observe in DevTools while this runs",
  "internals": [
    "dataTransfer Object is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for datatransfer object can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether datatransfer object succeeds in production."
  ],
  "takeaways": [
    "Locate dataTransfer Object in B3.33 — Clipboard, Drag & Drop, Selection: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect dataTransfer Object to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing dataTransfer Object from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "dataTransfer Object is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "dataTransfer Object: Treat dataTransfer Object as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate dataTransfer Object in B3.33 — Clipboard, Drag & Drop, Selection: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect dataTransfer Object to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing dataTransfer Object from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "dataTransfer Object",
      "dataTransfer Object is a core Web Platform concept in Clipboard, Drag & Drop, Selection."
    ],
    [
      "Mental model",
      "Treat dataTransfer Object as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing dataTransfer Object from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate dataTransfer Object in B3.33 — Clipboard, Drag & Drop, Selection: map it ",
      "Connect dataTransfer Object to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is dataTransfer Object in the browser and when do you use it?",
      "answerHint": "dataTransfer Object is a core Web Platform concept in Clipboard, Drag & Drop, Selection. It belongs to Clipboard, drag-and-drop, and selection APIs. Understanding dataTransfer Object helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain dataTransfer Object with a DevTools observation and one pitfall.",
      "answerHint": "Locate dataTransfer Object in B3.33 — Clipboard, Drag & Drop, Selection: map it to MDN reference docs and observe behavior in DevTools. Connect dataTransfer Object to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about datatransfer object. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing dataTransfer Object from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain dataTransfer Object in a senior frontend interview?",
      "answerHint": "dataTransfer Object is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for datatransfer object can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether datatransfer object succeeds in production. // dataTransfer Object — minimal browser example\nconsole.log('[b3-data-transfer]', typeof document);\n// Open DevTools → "
    }
  ],
  "pitfalls": [
    "Interview trap: describing dataTransfer Object from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain dataTransfer Object at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "dataTransfer Object is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is dataTransfer Object?",
      "When would dataTransfer Object block rendering or fail cross-origin?",
      "What is the classic dataTransfer Object interview trap?"
    ],
    "traps": [
      "Interview trap: describing dataTransfer Object from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide datatransfer object details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around dataTransfer Object."
    ]
  }
})
