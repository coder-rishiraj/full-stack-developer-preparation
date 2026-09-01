import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Browser Process Architecture",
  "whatIsIt": "Browser Process Architecture is a core Web Platform concept in Browser Interview Scenarios. It belongs to senior frontend browser interview reasoning. Understanding Browser Process Architecture helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide browser process architecture details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Browser Process Architecture as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Browser Process Architecture in B3.37 — Browser Interview Scenarios: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Browser Process Architecture to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about browser process architecture.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Browser Process Architecture from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Browser Process Architecture — minimal browser example\nconsole.log('[b3-interview-browser-architecture]', typeof document);\n// Open DevTools → verify behavior for: Browser Process Architecture\n// Spec reference: developer.mozilla.org (search \"Browser Process Architecture\")",
  "exampleCaption": "Browser Process Architecture — observe in DevTools while this runs",
  "internals": [
    "Browser Process Architecture is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for browser process architecture can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether browser process architecture succeeds in production."
  ],
  "takeaways": [
    "Locate Browser Process Architecture in B3.37 — Browser Interview Scenarios: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Browser Process Architecture to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Browser Process Architecture from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Browser Process Architecture is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Browser Process Architecture: Treat Browser Process Architecture as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Browser Process Architecture in B3.37 — Browser Interview Scenarios: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Browser Process Architecture to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Browser Process Architecture from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Browser Process Architecture",
      "Browser Process Architecture is a core Web Platform concept in Browser Interview Scenarios."
    ],
    [
      "Mental model",
      "Treat Browser Process Architecture as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Browser Process Architecture from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Browser Process Architecture in B3.37 — Browser Interview Scenarios: map ",
      "Connect Browser Process Architecture to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Browser Process Architecture in the browser and when do you use it?",
      "answerHint": "Browser Process Architecture is a core Web Platform concept in Browser Interview Scenarios. It belongs to senior frontend browser interview reasoning. Understanding Browser Process Architecture helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Browser Process Architecture with a DevTools observation and one pitfall.",
      "answerHint": "Locate Browser Process Architecture in B3.37 — Browser Interview Scenarios: map it to MDN reference docs and observe behavior in DevTools. Connect Browser Process Architecture to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about browser process architecture. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Browser Process Architecture from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Browser Process Architecture in a senior frontend interview?",
      "answerHint": "Browser Process Architecture is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for browser process architecture can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether browser process architecture succeeds in production. // Browser Process Architecture — minimal browser example\nconsole.log('[b3-interview-browser-architecture]', typeof docu"
    }
  ],
  "pitfalls": [
    "Interview trap: describing Browser Process Architecture from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Browser Process Architecture at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Browser Process Architecture is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Browser Process Architecture?",
      "When would Browser Process Architecture block rendering or fail cross-origin?",
      "What is the classic Browser Process Architecture interview trap?"
    ],
    "traps": [
      "Interview trap: describing Browser Process Architecture from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide browser process architecture details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Browser Process Architecture."
    ]
  }
})
