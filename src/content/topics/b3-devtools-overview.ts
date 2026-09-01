import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Browser DevTools Overview",
  "whatIsIt": "Browser DevTools Overview is a core Web Platform concept in Browser Developer Tools. It belongs to Chrome DevTools panels for frontend debugging. Understanding Browser DevTools Overview helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide browser devtools overview details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Browser DevTools Overview as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Browser DevTools Overview in B3.36 — Browser Developer Tools: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Browser DevTools Overview to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about browser devtools overview.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Browser DevTools Overview from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Browser DevTools Overview — minimal browser example\nconsole.log('[b3-devtools-overview]', typeof document);\n// Open DevTools → verify behavior for: Browser DevTools Overview\n// Spec reference: developer.mozilla.org (search \"Browser DevTools Overview\")",
  "exampleCaption": "Browser DevTools Overview — observe in DevTools while this runs",
  "internals": [
    "Browser DevTools Overview is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for browser devtools overview can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether browser devtools overview succeeds in production."
  ],
  "takeaways": [
    "Locate Browser DevTools Overview in B3.36 — Browser Developer Tools: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Browser DevTools Overview to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Browser DevTools Overview from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Browser DevTools Overview is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Browser DevTools Overview: Treat Browser DevTools Overview as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Browser DevTools Overview in B3.36 — Browser Developer Tools: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Browser DevTools Overview to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Browser DevTools Overview from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Browser DevTools Overview",
      "Browser DevTools Overview is a core Web Platform concept in Browser Developer Tools."
    ],
    [
      "Mental model",
      "Treat Browser DevTools Overview as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Browser DevTools Overview from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Browser DevTools Overview in B3.36 — Browser Developer Tools: map it to M",
      "Connect Browser DevTools Overview to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Browser DevTools Overview in the browser and when do you use it?",
      "answerHint": "Browser DevTools Overview is a core Web Platform concept in Browser Developer Tools. It belongs to Chrome DevTools panels for frontend debugging. Understanding Browser DevTools Overview helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Browser DevTools Overview with a DevTools observation and one pitfall.",
      "answerHint": "Locate Browser DevTools Overview in B3.36 — Browser Developer Tools: map it to MDN reference docs and observe behavior in DevTools. Connect Browser DevTools Overview to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about browser devtools overview. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Browser DevTools Overview from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Browser DevTools Overview in a senior frontend interview?",
      "answerHint": "Browser DevTools Overview is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for browser devtools overview can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether browser devtools overview succeeds in production. // Browser DevTools Overview — minimal browser example\nconsole.log('[b3-devtools-overview]', typeof document);\n// Open D"
    }
  ],
  "pitfalls": [
    "Interview trap: describing Browser DevTools Overview from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Browser DevTools Overview at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Browser DevTools Overview is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Browser DevTools Overview?",
      "When would Browser DevTools Overview block rendering or fail cross-origin?",
      "What is the classic Browser DevTools Overview interview trap?"
    ],
    "traps": [
      "Interview trap: describing Browser DevTools Overview from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide browser devtools overview details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Browser DevTools Overview."
    ]
  }
})
