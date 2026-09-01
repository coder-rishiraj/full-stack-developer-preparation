import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Long Tasks in the Browser",
  "whatIsIt": "Long Tasks in the Browser is a core Web Platform concept in Browser Event Loop & Rendering. It belongs to browser task scheduling, microtasks, and rendering opportunities. Understanding Long Tasks in the Browser helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide long tasks in the browser details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Long Tasks in the Browser as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Long Tasks in the Browser in B3.8 — Browser Event Loop & Rendering: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Long Tasks in the Browser to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about long tasks in the browser.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Long Tasks in the Browser from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Long Tasks in the Browser — minimal browser example\nconsole.log('[b3-long-tasks-browser]', typeof document);\n// Open DevTools → verify behavior for: Long Tasks in the Browser\n// Spec reference: developer.mozilla.org (search \"Long Tasks in the Browser\")",
  "exampleCaption": "Long Tasks in the Browser — observe in DevTools while this runs",
  "internals": [
    "Long Tasks in the Browser is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for long tasks in the browser can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether long tasks in the browser succeeds in production."
  ],
  "takeaways": [
    "Locate Long Tasks in the Browser in B3.8 — Browser Event Loop & Rendering: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Long Tasks in the Browser to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Long Tasks in the Browser from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Long Tasks in the Browser is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Long Tasks in the Browser: Treat Long Tasks in the Browser as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Long Tasks in the Browser in B3.8 — Browser Event Loop & Rendering: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Long Tasks in the Browser to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Long Tasks in the Browser from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Long Tasks in the Browser",
      "Long Tasks in the Browser is a core Web Platform concept in Browser Event Loop & Rendering."
    ],
    [
      "Mental model",
      "Treat Long Tasks in the Browser as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Long Tasks in the Browser from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Long Tasks in the Browser in B3.8 — Browser Event Loop & Rendering: map i",
      "Connect Long Tasks in the Browser to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Long Tasks in the Browser in the browser and when do you use it?",
      "answerHint": "Long Tasks in the Browser is a core Web Platform concept in Browser Event Loop & Rendering. It belongs to browser task scheduling, microtasks, and rendering opportunities. Understanding Long Tasks in the Browser helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Long Tasks in the Browser with a DevTools observation and one pitfall.",
      "answerHint": "Locate Long Tasks in the Browser in B3.8 — Browser Event Loop & Rendering: map it to MDN reference docs and observe behavior in DevTools. Connect Long Tasks in the Browser to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about long tasks in the browser. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Long Tasks in the Browser from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Long Tasks in the Browser in a senior frontend interview?",
      "answerHint": "Long Tasks in the Browser is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for long tasks in the browser can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether long tasks in the browser succeeds in production. // Long Tasks in the Browser — minimal browser example\nconsole.log('[b3-long-tasks-browser]', typeof document);\n// Open "
    }
  ],
  "pitfalls": [
    "Interview trap: describing Long Tasks in the Browser from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Long Tasks in the Browser at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Long Tasks in the Browser is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Long Tasks in the Browser?",
      "When would Long Tasks in the Browser block rendering or fail cross-origin?",
      "What is the classic Long Tasks in the Browser interview trap?"
    ],
    "traps": [
      "Interview trap: describing Long Tasks in the Browser from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide long tasks in the browser details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Long Tasks in the Browser."
    ]
  }
})
