import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "root / rootMargin / threshold",
  "whatIsIt": "root / rootMargin / threshold is a core Web Platform concept in Observer APIs. It belongs to Observer APIs (Intersection, Resize, Mutation, Performance). Understanding root / rootMargin / threshold helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide root / rootmargin / threshold details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat root / rootMargin / threshold as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate root / rootMargin / threshold in B3.25 — Observer APIs: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect root / rootMargin / threshold to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about root / rootmargin / threshold.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing root / rootMargin / threshold from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// root / rootMargin / threshold — minimal browser example\nconsole.log('[b3-io-root-margin]', typeof document);\n// Open DevTools → verify behavior for: root / rootMargin / threshold\n// Spec reference: developer.mozilla.org (search \"root / rootMargin / threshold\")",
  "exampleCaption": "root / rootMargin / threshold — observe in DevTools while this runs",
  "internals": [
    "root / rootMargin / threshold is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for root / rootmargin / threshold can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether root / rootmargin / threshold succeeds in production."
  ],
  "takeaways": [
    "Locate root / rootMargin / threshold in B3.25 — Observer APIs: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect root / rootMargin / threshold to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing root / rootMargin / threshold from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "root / rootMargin / threshold is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "root / rootMargin / threshold: Treat root / rootMargin / threshold as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate root / rootMargin / threshold in B3.25 — Observer APIs: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect root / rootMargin / threshold to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing root / rootMargin / threshold from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "root / rootMargin / threshold",
      "root / rootMargin / threshold is a core Web Platform concept in Observer APIs."
    ],
    [
      "Mental model",
      "Treat root / rootMargin / threshold as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing root / rootMargin / threshold from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate root / rootMargin / threshold in B3.25 — Observer APIs: map it to MDN ref",
      "Connect root / rootMargin / threshold to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is root / rootMargin / threshold in the browser and when do you use it?",
      "answerHint": "root / rootMargin / threshold is a core Web Platform concept in Observer APIs. It belongs to Observer APIs (Intersection, Resize, Mutation, Performance). Understanding root / rootMargin / threshold helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain root / rootMargin / threshold with a DevTools observation and one pitfall.",
      "answerHint": "Locate root / rootMargin / threshold in B3.25 — Observer APIs: map it to MDN reference docs and observe behavior in DevTools. Connect root / rootMargin / threshold to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about root / rootmargin / threshold. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing root / rootMargin / threshold from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain root / rootMargin / threshold in a senior frontend interview?",
      "answerHint": "root / rootMargin / threshold is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for root / rootmargin / threshold can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether root / rootmargin / threshold succeeds in production. // root / rootMargin / threshold — minimal browser example\nconsole.log('[b3-io-root-margin]', typeof document);\n// Open "
    }
  ],
  "pitfalls": [
    "Interview trap: describing root / rootMargin / threshold from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain root / rootMargin / threshold at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "root / rootMargin / threshold is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is root / rootMargin / threshold?",
      "When would root / rootMargin / threshold block rendering or fail cross-origin?",
      "What is the classic root / rootMargin / threshold interview trap?"
    ],
    "traps": [
      "Interview trap: describing root / rootMargin / threshold from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide root / rootmargin / threshold details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around root / rootMargin / threshold."
    ]
  }
})
