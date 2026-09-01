import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Request Deduplication",
  "whatIsIt": "Request Deduplication is a core Web Platform concept in AbortController & Cancellation. It belongs to AbortController, cancellation, and stale-request races. Understanding Request Deduplication helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide request deduplication details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Request Deduplication as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Request Deduplication in B3.12 — AbortController & Cancellation: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Request Deduplication to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about request deduplication.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Request Deduplication from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Request Deduplication — minimal browser example\nconsole.log('[b3-request-deduplication]', typeof document);\n// Open DevTools → verify behavior for: Request Deduplication\n// Spec reference: developer.mozilla.org (search \"Request Deduplication\")",
  "exampleCaption": "Request Deduplication — observe in DevTools while this runs",
  "internals": [
    "Request Deduplication is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for request deduplication can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether request deduplication succeeds in production."
  ],
  "takeaways": [
    "Locate Request Deduplication in B3.12 — AbortController & Cancellation: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Request Deduplication to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Request Deduplication from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Request Deduplication is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Request Deduplication: Treat Request Deduplication as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Request Deduplication in B3.12 — AbortController & Cancellation: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Request Deduplication to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Request Deduplication from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Request Deduplication",
      "Request Deduplication is a core Web Platform concept in AbortController & Cancellation."
    ],
    [
      "Mental model",
      "Treat Request Deduplication as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Request Deduplication from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Request Deduplication in B3.12 — AbortController & Cancellation: map it t",
      "Connect Request Deduplication to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Request Deduplication in the browser and when do you use it?",
      "answerHint": "Request Deduplication is a core Web Platform concept in AbortController & Cancellation. It belongs to AbortController, cancellation, and stale-request races. Understanding Request Deduplication helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Request Deduplication with a DevTools observation and one pitfall.",
      "answerHint": "Locate Request Deduplication in B3.12 — AbortController & Cancellation: map it to MDN reference docs and observe behavior in DevTools. Connect Request Deduplication to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about request deduplication. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Request Deduplication from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Request Deduplication in a senior frontend interview?",
      "answerHint": "Request Deduplication is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for request deduplication can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether request deduplication succeeds in production. // Request Deduplication — minimal browser example\nconsole.log('[b3-request-deduplication]', typeof document);\n// Open D"
    }
  ],
  "pitfalls": [
    "Interview trap: describing Request Deduplication from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Request Deduplication at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Request Deduplication is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Request Deduplication?",
      "When would Request Deduplication block rendering or fail cross-origin?",
      "What is the classic Request Deduplication interview trap?"
    ],
    "traps": [
      "Interview trap: describing Request Deduplication from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide request deduplication details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Request Deduplication."
    ]
  }
})
