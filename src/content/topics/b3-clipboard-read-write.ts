import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "navigator.clipboard.readText / writeText",
  "whatIsIt": "navigator.clipboard.readText / writeText is a core Web Platform concept in Clipboard, Drag & Drop, Selection. It belongs to Clipboard, drag-and-drop, and selection APIs. Understanding navigator.clipboard.readText / writeText helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide navigator.clipboard.readtext / writetext details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat navigator.clipboard.readText / writeText as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate navigator.clipboard.readText / writeText in B3.33 — Clipboard, Drag & Drop, Selection: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect navigator.clipboard.readText / writeText to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about navigator.clipboard.readtext / writetext.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing navigator.clipboard.readText / writeText from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// navigator.clipboard.readText / writeText — minimal browser example\nconsole.log('[b3-clipboard-read-write]', typeof document);\n// Open DevTools → verify behavior for: navigator.clipboard.readText / writeText\n// Spec reference: developer.mozilla.org (search \"navigator.clipboard.readText / writeText\")",
  "exampleCaption": "navigator.clipboard.readText / writeText — observe in DevTools while this runs",
  "internals": [
    "navigator.clipboard.readText / writeText is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for navigator.clipboard.readtext / writetext can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether navigator.clipboard.readtext / writetext succeeds in production."
  ],
  "takeaways": [
    "Locate navigator.clipboard.readText / writeText in B3.33 — Clipboard, Drag & Drop, Selection: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect navigator.clipboard.readText / writeText to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing navigator.clipboard.readText / writeText from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "navigator.clipboard.readText / writeText is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "navigator.clipboard.readText / writeText: Treat navigator.clipboard.readText / writeText as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate navigator.clipboard.readText / writeText in B3.33 — Clipboard, Drag & Drop, Selection: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect navigator.clipboard.readText / writeText to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing navigator.clipboard.readText / writeText from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "navigator.clipboard.readText / writeText",
      "navigator.clipboard.readText / writeText is a core Web Platform concept in Clipboard, Drag & Drop, Selection."
    ],
    [
      "Mental model",
      "Treat navigator.clipboard.readText / writeText as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing navigator.clipboard.readText / writeText from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate navigator.clipboard.readText / writeText in B3.33 — Clipboard, Drag & Dro",
      "Connect navigator.clipboard.readText / writeText to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is navigator.clipboard.readText / writeText in the browser and when do you use it?",
      "answerHint": "navigator.clipboard.readText / writeText is a core Web Platform concept in Clipboard, Drag & Drop, Selection. It belongs to Clipboard, drag-and-drop, and selection APIs. Understanding navigator.clipboard.readText / writeText helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain navigator.clipboard.readText / writeText with a DevTools observation and one pitfall.",
      "answerHint": "Locate navigator.clipboard.readText / writeText in B3.33 — Clipboard, Drag & Drop, Selection: map it to MDN reference docs and observe behavior in DevTools. Connect navigator.clipboard.readText / writeText to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about navigator.clipboard.readtext / writetext. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing navigator.clipboard.readText / writeText from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain navigator.clipboard.readText / writeText in a senior frontend interview?",
      "answerHint": "navigator.clipboard.readText / writeText is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for navigator.clipboard.readtext / writetext can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether navigator.clipboard.readtext / writetext succeeds in production. // navigator.clipboard.readText / writeText — minimal browser example\nconsole.log('[b3-clipboard-read-write]', typeof do"
    }
  ],
  "pitfalls": [
    "Interview trap: describing navigator.clipboard.readText / writeText from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain navigator.clipboard.readText / writeText at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "navigator.clipboard.readText / writeText is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is navigator.clipboard.readText / writeText?",
      "When would navigator.clipboard.readText / writeText block rendering or fail cross-origin?",
      "What is the classic navigator.clipboard.readText / writeText interview trap?"
    ],
    "traps": [
      "Interview trap: describing navigator.clipboard.readText / writeText from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide navigator.clipboard.readtext / writetext details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around navigator.clipboard.readText / writeText."
    ]
  }
})
