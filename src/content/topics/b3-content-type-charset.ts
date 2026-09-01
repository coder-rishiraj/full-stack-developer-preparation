import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Content-Type & Charset",
  "whatIsIt": "Content-Type & Charset is a core Web Platform concept in Browser HTTP. It belongs to HTTP from the browser perspective (requests, headers, caching). Understanding Content-Type & Charset helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide content-type & charset details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Content-Type & Charset as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Content-Type & Charset in B3.10 — Browser HTTP: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Content-Type & Charset to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about content-type & charset.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Content-Type & Charset from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Content-Type & Charset — minimal browser example\nconsole.log('[b3-content-type-charset]', typeof document);\n// Open DevTools → verify behavior for: Content-Type & Charset\n// Spec reference: developer.mozilla.org (search \"Content-Type & Charset\")",
  "exampleCaption": "Content-Type & Charset — observe in DevTools while this runs",
  "internals": [
    "Content-Type & Charset is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for content-type & charset can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether content-type & charset succeeds in production."
  ],
  "takeaways": [
    "Locate Content-Type & Charset in B3.10 — Browser HTTP: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Content-Type & Charset to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Content-Type & Charset from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Content-Type & Charset is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Content-Type & Charset: Treat Content-Type & Charset as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Content-Type & Charset in B3.10 — Browser HTTP: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Content-Type & Charset to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Content-Type & Charset from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Content-Type & Charset",
      "Content-Type & Charset is a core Web Platform concept in Browser HTTP."
    ],
    [
      "Mental model",
      "Treat Content-Type & Charset as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Content-Type & Charset from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Content-Type & Charset in B3.10 — Browser HTTP: map it to MDN reference d",
      "Connect Content-Type & Charset to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Content-Type & Charset in the browser and when do you use it?",
      "answerHint": "Content-Type & Charset is a core Web Platform concept in Browser HTTP. It belongs to HTTP from the browser perspective (requests, headers, caching). Understanding Content-Type & Charset helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Content-Type & Charset with a DevTools observation and one pitfall.",
      "answerHint": "Locate Content-Type & Charset in B3.10 — Browser HTTP: map it to MDN reference docs and observe behavior in DevTools. Connect Content-Type & Charset to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about content-type & charset. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Content-Type & Charset from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Content-Type & Charset in a senior frontend interview?",
      "answerHint": "Content-Type & Charset is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for content-type & charset can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether content-type & charset succeeds in production. // Content-Type & Charset — minimal browser example\nconsole.log('[b3-content-type-charset]', typeof document);\n// Open D"
    }
  ],
  "pitfalls": [
    "Interview trap: describing Content-Type & Charset from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Content-Type & Charset at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Content-Type & Charset is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Content-Type & Charset?",
      "When would Content-Type & Charset block rendering or fail cross-origin?",
      "What is the classic Content-Type & Charset interview trap?"
    ],
    "traps": [
      "Interview trap: describing Content-Type & Charset from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide content-type & charset details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Content-Type & Charset."
    ]
  }
})
