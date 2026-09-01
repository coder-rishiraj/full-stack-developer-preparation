import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Site Isolation & Process Model",
  "whatIsIt": "Site Isolation & Process Model is a core Web Platform concept in Browser Architecture. It belongs to browser processes, threads, and navigation lifecycle. Understanding Site Isolation & Process Model helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide site isolation & process model details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Site Isolation & Process Model as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Site Isolation & Process Model in B3.1 — Browser Architecture: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Site Isolation & Process Model to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about site isolation & process model.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Site Isolation & Process Model from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Site Isolation & Process Model — minimal browser example\nconsole.log('[b3-site-isolation]', typeof document);\n// Open DevTools → verify behavior for: Site Isolation & Process Model\n// Spec reference: developer.mozilla.org (search \"Site Isolation & Process Model\")",
  "exampleCaption": "Site Isolation & Process Model — observe in DevTools while this runs",
  "internals": [
    "Site Isolation & Process Model is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for site isolation & process model can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether site isolation & process model succeeds in production."
  ],
  "takeaways": [
    "Locate Site Isolation & Process Model in B3.1 — Browser Architecture: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Site Isolation & Process Model to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Site Isolation & Process Model from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Site Isolation & Process Model is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Site Isolation & Process Model: Treat Site Isolation & Process Model as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Site Isolation & Process Model in B3.1 — Browser Architecture: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Site Isolation & Process Model to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Site Isolation & Process Model from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Site Isolation & Process Model",
      "Site Isolation & Process Model is a core Web Platform concept in Browser Architecture."
    ],
    [
      "Mental model",
      "Treat Site Isolation & Process Model as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Site Isolation & Process Model from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Site Isolation & Process Model in B3.1 — Browser Architecture: map it to ",
      "Connect Site Isolation & Process Model to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Site Isolation & Process Model in the browser and when do you use it?",
      "answerHint": "Site Isolation & Process Model is a core Web Platform concept in Browser Architecture. It belongs to browser processes, threads, and navigation lifecycle. Understanding Site Isolation & Process Model helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Site Isolation & Process Model with a DevTools observation and one pitfall.",
      "answerHint": "Locate Site Isolation & Process Model in B3.1 — Browser Architecture: map it to MDN reference docs and observe behavior in DevTools. Connect Site Isolation & Process Model to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about site isolation & process model. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Site Isolation & Process Model from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Site Isolation & Process Model in a senior frontend interview?",
      "answerHint": "Site Isolation & Process Model is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for site isolation & process model can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether site isolation & process model succeeds in production. // Site Isolation & Process Model — minimal browser example\nconsole.log('[b3-site-isolation]', typeof document);\n// Open"
    }
  ],
  "pitfalls": [
    "Interview trap: describing Site Isolation & Process Model from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Site Isolation & Process Model at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Site Isolation & Process Model is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Site Isolation & Process Model?",
      "When would Site Isolation & Process Model block rendering or fail cross-origin?",
      "What is the classic Site Isolation & Process Model interview trap?"
    ],
    "traps": [
      "Interview trap: describing Site Isolation & Process Model from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide site isolation & process model details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Site Isolation & Process Model."
    ]
  }
})
