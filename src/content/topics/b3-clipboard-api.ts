import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Clipboard API",
  "whatIsIt": "Clipboard API is a core Web Platform concept in Clipboard, Drag & Drop, Selection. It belongs to Clipboard, drag-and-drop, and selection APIs. Understanding Clipboard API helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide clipboard api details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Clipboard API as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Clipboard API in B3.33 — Clipboard, Drag & Drop, Selection: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Clipboard API to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about clipboard api.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Clipboard API from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Clipboard API — minimal browser example\nconsole.log('[b3-clipboard-api]', typeof window);\n// Open DevTools → verify behavior for: Clipboard API\n// Spec reference: developer.mozilla.org (search \"Clipboard API\")",
  "exampleCaption": "Clipboard API — observe in DevTools while this runs",
  "internals": [
    "Clipboard API is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for clipboard api can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether clipboard api succeeds in production."
  ],
  "takeaways": [
    "Locate Clipboard API in B3.33 — Clipboard, Drag & Drop, Selection: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Clipboard API to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Clipboard API from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Clipboard API is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Clipboard API: Treat Clipboard API as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Clipboard API in B3.33 — Clipboard, Drag & Drop, Selection: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Clipboard API to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Clipboard API from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Clipboard API",
      "Clipboard API is a core Web Platform concept in Clipboard, Drag & Drop, Selection."
    ],
    [
      "Mental model",
      "Treat Clipboard API as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Clipboard API from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Clipboard API in B3.33 — Clipboard, Drag & Drop, Selection: map it to MDN",
      "Connect Clipboard API to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Clipboard API in the browser and when do you use it?",
      "answerHint": "Clipboard API is a core Web Platform concept in Clipboard, Drag & Drop, Selection. It belongs to Clipboard, drag-and-drop, and selection APIs. Understanding Clipboard API helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Clipboard API with a DevTools observation and one pitfall.",
      "answerHint": "Locate Clipboard API in B3.33 — Clipboard, Drag & Drop, Selection: map it to MDN reference docs and observe behavior in DevTools. Connect Clipboard API to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about clipboard api. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Clipboard API from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Clipboard API in a senior frontend interview?",
      "answerHint": "Clipboard API is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for clipboard api can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether clipboard api succeeds in production. // Clipboard API — minimal browser example\nconsole.log('[b3-clipboard-api]', typeof window);\n// Open DevTools → verify b"
    }
  ],
  "pitfalls": [
    "Interview trap: describing Clipboard API from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Clipboard API at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Clipboard API is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Clipboard API?",
      "When would Clipboard API block rendering or fail cross-origin?",
      "What is the classic Clipboard API interview trap?"
    ],
    "traps": [
      "Interview trap: describing Clipboard API from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide clipboard api details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Clipboard API."
    ]
  }
})
