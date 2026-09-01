import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Web Workers vs Service Workers",
  "whatIsIt": "Web Workers vs Service Workers is a core Web Platform concept in Browser Interview Scenarios. It belongs to senior frontend browser interview reasoning. Understanding Web Workers vs Service Workers helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide web workers vs service workers details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Web Workers vs Service Workers as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Web Workers vs Service Workers in B3.37 — Browser Interview Scenarios: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Web Workers vs Service Workers to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about web workers vs service workers.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Web Workers vs Service Workers from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Web Workers vs Service Workers — minimal browser example\nconsole.log('[b3-interview-web-workers]', typeof document);\n// Open DevTools → verify behavior for: Web Workers vs Service Workers\n// Spec reference: developer.mozilla.org (search \"Web Workers vs Service Workers\")",
  "exampleCaption": "Web Workers vs Service Workers — observe in DevTools while this runs",
  "internals": [
    "Web Workers vs Service Workers is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for web workers vs service workers can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether web workers vs service workers succeeds in production."
  ],
  "takeaways": [
    "Locate Web Workers vs Service Workers in B3.37 — Browser Interview Scenarios: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Web Workers vs Service Workers to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Web Workers vs Service Workers from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Web Workers vs Service Workers is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Web Workers vs Service Workers: Treat Web Workers vs Service Workers as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Web Workers vs Service Workers in B3.37 — Browser Interview Scenarios: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Web Workers vs Service Workers to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Web Workers vs Service Workers from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Web Workers vs Service Workers",
      "Web Workers vs Service Workers is a core Web Platform concept in Browser Interview Scenarios."
    ],
    [
      "Mental model",
      "Treat Web Workers vs Service Workers as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Web Workers vs Service Workers from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Web Workers vs Service Workers in B3.37 — Browser Interview Scenarios: ma",
      "Connect Web Workers vs Service Workers to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Web Workers vs Service Workers in the browser and when do you use it?",
      "answerHint": "Web Workers vs Service Workers is a core Web Platform concept in Browser Interview Scenarios. It belongs to senior frontend browser interview reasoning. Understanding Web Workers vs Service Workers helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Web Workers vs Service Workers with a DevTools observation and one pitfall.",
      "answerHint": "Locate Web Workers vs Service Workers in B3.37 — Browser Interview Scenarios: map it to MDN reference docs and observe behavior in DevTools. Connect Web Workers vs Service Workers to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about web workers vs service workers. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Web Workers vs Service Workers from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Web Workers vs Service Workers in a senior frontend interview?",
      "answerHint": "Web Workers vs Service Workers is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for web workers vs service workers can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether web workers vs service workers succeeds in production. // Web Workers vs Service Workers — minimal browser example\nconsole.log('[b3-interview-web-workers]', typeof document);\n"
    }
  ],
  "pitfalls": [
    "Interview trap: describing Web Workers vs Service Workers from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Web Workers vs Service Workers at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Web Workers vs Service Workers is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Web Workers vs Service Workers?",
      "When would Web Workers vs Service Workers block rendering or fail cross-origin?",
      "What is the classic Web Workers vs Service Workers interview trap?"
    ],
    "traps": [
      "Interview trap: describing Web Workers vs Service Workers from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide web workers vs service workers details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Web Workers vs Service Workers."
    ]
  }
})
