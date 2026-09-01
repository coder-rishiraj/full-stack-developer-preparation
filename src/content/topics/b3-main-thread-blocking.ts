import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Main-Thread Blocking Symptoms",
  "whatIsIt": "Main-Thread Blocking Symptoms is a core Web Platform concept in Browser Event Loop & Rendering. It belongs to browser task scheduling, microtasks, and rendering opportunities. Understanding Main-Thread Blocking Symptoms helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide main-thread blocking symptoms details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Main-Thread Blocking Symptoms as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Main-Thread Blocking Symptoms in B3.8 — Browser Event Loop & Rendering: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Main-Thread Blocking Symptoms to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about main-thread blocking symptoms.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Main-Thread Blocking Symptoms from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Main-Thread Blocking Symptoms — minimal browser example\nconsole.log('[b3-main-thread-blocking]', typeof document);\n// Open DevTools → verify behavior for: Main-Thread Blocking Symptoms\n// Spec reference: developer.mozilla.org (search \"Main-Thread Blocking Symptoms\")",
  "exampleCaption": "Main-Thread Blocking Symptoms — observe in DevTools while this runs",
  "internals": [
    "Main-Thread Blocking Symptoms is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for main-thread blocking symptoms can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether main-thread blocking symptoms succeeds in production."
  ],
  "takeaways": [
    "Locate Main-Thread Blocking Symptoms in B3.8 — Browser Event Loop & Rendering: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Main-Thread Blocking Symptoms to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Main-Thread Blocking Symptoms from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Main-Thread Blocking Symptoms is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Main-Thread Blocking Symptoms: Treat Main-Thread Blocking Symptoms as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Main-Thread Blocking Symptoms in B3.8 — Browser Event Loop & Rendering: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Main-Thread Blocking Symptoms to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Main-Thread Blocking Symptoms from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Main-Thread Blocking Symptoms",
      "Main-Thread Blocking Symptoms is a core Web Platform concept in Browser Event Loop & Rendering."
    ],
    [
      "Mental model",
      "Treat Main-Thread Blocking Symptoms as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Main-Thread Blocking Symptoms from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Main-Thread Blocking Symptoms in B3.8 — Browser Event Loop & Rendering: m",
      "Connect Main-Thread Blocking Symptoms to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Main-Thread Blocking Symptoms in the browser and when do you use it?",
      "answerHint": "Main-Thread Blocking Symptoms is a core Web Platform concept in Browser Event Loop & Rendering. It belongs to browser task scheduling, microtasks, and rendering opportunities. Understanding Main-Thread Blocking Symptoms helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Main-Thread Blocking Symptoms with a DevTools observation and one pitfall.",
      "answerHint": "Locate Main-Thread Blocking Symptoms in B3.8 — Browser Event Loop & Rendering: map it to MDN reference docs and observe behavior in DevTools. Connect Main-Thread Blocking Symptoms to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about main-thread blocking symptoms. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Main-Thread Blocking Symptoms from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Main-Thread Blocking Symptoms in a senior frontend interview?",
      "answerHint": "Main-Thread Blocking Symptoms is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for main-thread blocking symptoms can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether main-thread blocking symptoms succeeds in production. // Main-Thread Blocking Symptoms — minimal browser example\nconsole.log('[b3-main-thread-blocking]', typeof document);\n//"
    }
  ],
  "pitfalls": [
    "Interview trap: describing Main-Thread Blocking Symptoms from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Main-Thread Blocking Symptoms at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Main-Thread Blocking Symptoms is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Main-Thread Blocking Symptoms?",
      "When would Main-Thread Blocking Symptoms block rendering or fail cross-origin?",
      "What is the classic Main-Thread Blocking Symptoms interview trap?"
    ],
    "traps": [
      "Interview trap: describing Main-Thread Blocking Symptoms from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide main-thread blocking symptoms details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Main-Thread Blocking Symptoms."
    ]
  }
})
