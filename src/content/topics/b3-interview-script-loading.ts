import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "async vs defer vs module",
  "whatIsIt": "async vs defer vs module is a core Web Platform concept in Browser Interview Scenarios. It belongs to senior frontend browser interview reasoning. Understanding async vs defer vs module helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide async vs defer vs module details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat async vs defer vs module as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate async vs defer vs module in B3.37 — Browser Interview Scenarios: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect async vs defer vs module to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about async vs defer vs module.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing async vs defer vs module from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// async vs defer vs module — minimal browser example\nconsole.log('[b3-interview-script-loading]', typeof document);\n// Open DevTools → verify behavior for: async vs defer vs module\n// Spec reference: developer.mozilla.org (search \"async vs defer vs module\")",
  "exampleCaption": "async vs defer vs module — observe in DevTools while this runs",
  "internals": [
    "async vs defer vs module is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for async vs defer vs module can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether async vs defer vs module succeeds in production."
  ],
  "takeaways": [
    "Locate async vs defer vs module in B3.37 — Browser Interview Scenarios: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect async vs defer vs module to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing async vs defer vs module from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "async vs defer vs module is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "async vs defer vs module: Treat async vs defer vs module as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate async vs defer vs module in B3.37 — Browser Interview Scenarios: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect async vs defer vs module to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing async vs defer vs module from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "async vs defer vs module",
      "async vs defer vs module is a core Web Platform concept in Browser Interview Scenarios."
    ],
    [
      "Mental model",
      "Treat async vs defer vs module as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing async vs defer vs module from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate async vs defer vs module in B3.37 — Browser Interview Scenarios: map it t",
      "Connect async vs defer vs module to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is async vs defer vs module in the browser and when do you use it?",
      "answerHint": "async vs defer vs module is a core Web Platform concept in Browser Interview Scenarios. It belongs to senior frontend browser interview reasoning. Understanding async vs defer vs module helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain async vs defer vs module with a DevTools observation and one pitfall.",
      "answerHint": "Locate async vs defer vs module in B3.37 — Browser Interview Scenarios: map it to MDN reference docs and observe behavior in DevTools. Connect async vs defer vs module to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about async vs defer vs module. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing async vs defer vs module from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain async vs defer vs module in a senior frontend interview?",
      "answerHint": "async vs defer vs module is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for async vs defer vs module can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether async vs defer vs module succeeds in production. // async vs defer vs module — minimal browser example\nconsole.log('[b3-interview-script-loading]', typeof document);\n// "
    }
  ],
  "pitfalls": [
    "Interview trap: describing async vs defer vs module from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain async vs defer vs module at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "async vs defer vs module is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is async vs defer vs module?",
      "When would async vs defer vs module block rendering or fail cross-origin?",
      "What is the classic async vs defer vs module interview trap?"
    ],
    "traps": [
      "Interview trap: describing async vs defer vs module from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide async vs defer vs module details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around async vs defer vs module."
    ]
  }
})
