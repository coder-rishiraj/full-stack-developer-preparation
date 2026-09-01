import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Shared Workers",
  "whatIsIt": "Shared Workers is a core Web Platform concept in Web Workers. It belongs to Web Workers and off-main-thread computation. Understanding Shared Workers helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide shared workers details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Shared Workers as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Shared Workers in B3.21 — Web Workers: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Shared Workers to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about shared workers.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Shared Workers from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Shared Workers — minimal browser example\nconsole.log('[b3-shared-workers]', typeof document);\n// Open DevTools → verify behavior for: Shared Workers\n// Spec reference: developer.mozilla.org (search \"Shared Workers\")",
  "exampleCaption": "Shared Workers — observe in DevTools while this runs",
  "internals": [
    "Shared Workers is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for shared workers can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether shared workers succeeds in production."
  ],
  "takeaways": [
    "Locate Shared Workers in B3.21 — Web Workers: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Shared Workers to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Shared Workers from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Shared Workers is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Shared Workers: Treat Shared Workers as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Shared Workers in B3.21 — Web Workers: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Shared Workers to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Shared Workers from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Shared Workers",
      "Shared Workers is a core Web Platform concept in Web Workers."
    ],
    [
      "Mental model",
      "Treat Shared Workers as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Shared Workers from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Shared Workers in B3.21 — Web Workers: map it to MDN reference docs and o",
      "Connect Shared Workers to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Shared Workers in the browser and when do you use it?",
      "answerHint": "Shared Workers is a core Web Platform concept in Web Workers. It belongs to Web Workers and off-main-thread computation. Understanding Shared Workers helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Shared Workers with a DevTools observation and one pitfall.",
      "answerHint": "Locate Shared Workers in B3.21 — Web Workers: map it to MDN reference docs and observe behavior in DevTools. Connect Shared Workers to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about shared workers. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Shared Workers from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Shared Workers in a senior frontend interview?",
      "answerHint": "Shared Workers is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for shared workers can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether shared workers succeeds in production. // Shared Workers — minimal browser example\nconsole.log('[b3-shared-workers]', typeof document);\n// Open DevTools → veri"
    }
  ],
  "pitfalls": [
    "Interview trap: describing Shared Workers from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Shared Workers at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Shared Workers is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Shared Workers?",
      "When would Shared Workers block rendering or fail cross-origin?",
      "What is the classic Shared Workers interview trap?"
    ],
    "traps": [
      "Interview trap: describing Shared Workers from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide shared workers details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Shared Workers."
    ]
  }
})
