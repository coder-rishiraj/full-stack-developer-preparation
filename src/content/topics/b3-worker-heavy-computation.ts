import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Offloading Heavy Computation",
  "whatIsIt": "Offloading Heavy Computation is a core Web Platform concept in Web Workers. It belongs to Web Workers and off-main-thread computation. Understanding Offloading Heavy Computation helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide offloading heavy computation details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Offloading Heavy Computation as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Offloading Heavy Computation in B3.21 — Web Workers: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Offloading Heavy Computation to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about offloading heavy computation.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Offloading Heavy Computation from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Offloading Heavy Computation — minimal browser example\nconsole.log('[b3-worker-heavy-computation]', typeof document);\n// Open DevTools → verify behavior for: Offloading Heavy Computation\n// Spec reference: developer.mozilla.org (search \"Offloading Heavy Computation\")",
  "exampleCaption": "Offloading Heavy Computation — observe in DevTools while this runs",
  "internals": [
    "Offloading Heavy Computation is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for offloading heavy computation can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether offloading heavy computation succeeds in production."
  ],
  "takeaways": [
    "Locate Offloading Heavy Computation in B3.21 — Web Workers: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Offloading Heavy Computation to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Offloading Heavy Computation from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Offloading Heavy Computation is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Offloading Heavy Computation: Treat Offloading Heavy Computation as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Offloading Heavy Computation in B3.21 — Web Workers: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Offloading Heavy Computation to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Offloading Heavy Computation from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Offloading Heavy Computation",
      "Offloading Heavy Computation is a core Web Platform concept in Web Workers."
    ],
    [
      "Mental model",
      "Treat Offloading Heavy Computation as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Offloading Heavy Computation from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Offloading Heavy Computation in B3.21 — Web Workers: map it to MDN refere",
      "Connect Offloading Heavy Computation to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Offloading Heavy Computation in the browser and when do you use it?",
      "answerHint": "Offloading Heavy Computation is a core Web Platform concept in Web Workers. It belongs to Web Workers and off-main-thread computation. Understanding Offloading Heavy Computation helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Offloading Heavy Computation with a DevTools observation and one pitfall.",
      "answerHint": "Locate Offloading Heavy Computation in B3.21 — Web Workers: map it to MDN reference docs and observe behavior in DevTools. Connect Offloading Heavy Computation to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about offloading heavy computation. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Offloading Heavy Computation from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Offloading Heavy Computation in a senior frontend interview?",
      "answerHint": "Offloading Heavy Computation is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for offloading heavy computation can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether offloading heavy computation succeeds in production. // Offloading Heavy Computation — minimal browser example\nconsole.log('[b3-worker-heavy-computation]', typeof document);"
    }
  ],
  "pitfalls": [
    "Interview trap: describing Offloading Heavy Computation from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Offloading Heavy Computation at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Offloading Heavy Computation is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Offloading Heavy Computation?",
      "When would Offloading Heavy Computation block rendering or fail cross-origin?",
      "What is the classic Offloading Heavy Computation interview trap?"
    ],
    "traps": [
      "Interview trap: describing Offloading Heavy Computation from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide offloading heavy computation details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Offloading Heavy Computation."
    ]
  }
})
