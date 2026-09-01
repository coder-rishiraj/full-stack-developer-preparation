import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Transferable Objects",
  "whatIsIt": "Transferable Objects is a core Web Platform concept in Web Workers. It belongs to Web Workers and off-main-thread computation. Understanding Transferable Objects helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide transferable objects details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Transferable Objects as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Transferable Objects in B3.21 — Web Workers: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Transferable Objects to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about transferable objects.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Transferable Objects from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Transferable Objects — minimal browser example\nconsole.log('[b3-worker-transferables]', typeof document);\n// Open DevTools → verify behavior for: Transferable Objects\n// Spec reference: developer.mozilla.org (search \"Transferable Objects\")",
  "exampleCaption": "Transferable Objects — observe in DevTools while this runs",
  "internals": [
    "Transferable Objects is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for transferable objects can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether transferable objects succeeds in production."
  ],
  "takeaways": [
    "Locate Transferable Objects in B3.21 — Web Workers: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Transferable Objects to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Transferable Objects from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Transferable Objects is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Transferable Objects: Treat Transferable Objects as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Transferable Objects in B3.21 — Web Workers: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Transferable Objects to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Transferable Objects from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Transferable Objects",
      "Transferable Objects is a core Web Platform concept in Web Workers."
    ],
    [
      "Mental model",
      "Treat Transferable Objects as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Transferable Objects from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Transferable Objects in B3.21 — Web Workers: map it to MDN reference docs",
      "Connect Transferable Objects to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Transferable Objects in the browser and when do you use it?",
      "answerHint": "Transferable Objects is a core Web Platform concept in Web Workers. It belongs to Web Workers and off-main-thread computation. Understanding Transferable Objects helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Transferable Objects with a DevTools observation and one pitfall.",
      "answerHint": "Locate Transferable Objects in B3.21 — Web Workers: map it to MDN reference docs and observe behavior in DevTools. Connect Transferable Objects to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about transferable objects. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Transferable Objects from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Transferable Objects in a senior frontend interview?",
      "answerHint": "Transferable Objects is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for transferable objects can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether transferable objects succeeds in production. // Transferable Objects — minimal browser example\nconsole.log('[b3-worker-transferables]', typeof document);\n// Open Dev"
    }
  ],
  "pitfalls": [
    "Interview trap: describing Transferable Objects from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Transferable Objects at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Transferable Objects is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Transferable Objects?",
      "When would Transferable Objects block rendering or fail cross-origin?",
      "What is the classic Transferable Objects interview trap?"
    ],
    "traps": [
      "Interview trap: describing Transferable Objects from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide transferable objects details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Transferable Objects."
    ]
  }
})
