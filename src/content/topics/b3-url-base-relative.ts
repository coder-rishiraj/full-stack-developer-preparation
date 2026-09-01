import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Base URLs & Relative Resolution",
  "whatIsIt": "Base URLs & Relative Resolution is a core Web Platform concept in URL & URL APIs. It belongs to URL anatomy, URL API, and encoding. Understanding Base URLs & Relative Resolution helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide base urls & relative resolution details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Base URLs & Relative Resolution as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Base URLs & Relative Resolution in B3.31 — URL & URL APIs: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Base URLs & Relative Resolution to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about base urls & relative resolution.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Base URLs & Relative Resolution from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Base URLs & Relative Resolution — minimal browser example\nconsole.log('[b3-url-base-relative]', typeof document);\n// Open DevTools → verify behavior for: Base URLs & Relative Resolution\n// Spec reference: developer.mozilla.org (search \"Base URLs & Relative Resolution\")",
  "exampleCaption": "Base URLs & Relative Resolution — observe in DevTools while this runs",
  "internals": [
    "Base URLs & Relative Resolution is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for base urls & relative resolution can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether base urls & relative resolution succeeds in production."
  ],
  "takeaways": [
    "Locate Base URLs & Relative Resolution in B3.31 — URL & URL APIs: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Base URLs & Relative Resolution to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Base URLs & Relative Resolution from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Base URLs & Relative Resolution is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Base URLs & Relative Resolution: Treat Base URLs & Relative Resolution as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Base URLs & Relative Resolution in B3.31 — URL & URL APIs: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Base URLs & Relative Resolution to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Base URLs & Relative Resolution from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Base URLs & Relative Resolution",
      "Base URLs & Relative Resolution is a core Web Platform concept in URL & URL APIs."
    ],
    [
      "Mental model",
      "Treat Base URLs & Relative Resolution as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Base URLs & Relative Resolution from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Base URLs & Relative Resolution in B3.31 — URL & URL APIs: map it to MDN ",
      "Connect Base URLs & Relative Resolution to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Base URLs & Relative Resolution in the browser and when do you use it?",
      "answerHint": "Base URLs & Relative Resolution is a core Web Platform concept in URL & URL APIs. It belongs to URL anatomy, URL API, and encoding. Understanding Base URLs & Relative Resolution helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Base URLs & Relative Resolution with a DevTools observation and one pitfall.",
      "answerHint": "Locate Base URLs & Relative Resolution in B3.31 — URL & URL APIs: map it to MDN reference docs and observe behavior in DevTools. Connect Base URLs & Relative Resolution to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about base urls & relative resolution. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Base URLs & Relative Resolution from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Base URLs & Relative Resolution in a senior frontend interview?",
      "answerHint": "Base URLs & Relative Resolution is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for base urls & relative resolution can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether base urls & relative resolution succeeds in production. // Base URLs & Relative Resolution — minimal browser example\nconsole.log('[b3-url-base-relative]', typeof document);\n// "
    }
  ],
  "pitfalls": [
    "Interview trap: describing Base URLs & Relative Resolution from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Base URLs & Relative Resolution at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Base URLs & Relative Resolution is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Base URLs & Relative Resolution?",
      "When would Base URLs & Relative Resolution block rendering or fail cross-origin?",
      "What is the classic Base URLs & Relative Resolution interview trap?"
    ],
    "traps": [
      "Interview trap: describing Base URLs & Relative Resolution from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide base urls & relative resolution details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Base URLs & Relative Resolution."
    ]
  }
})
