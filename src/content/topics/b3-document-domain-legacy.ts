import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "document.domain (Legacy)",
  "whatIsIt": "document.domain (Legacy) is a core Web Platform concept in Same-Origin Policy. It belongs to the Same-Origin Policy and cross-origin restrictions. Understanding document.domain (Legacy) helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide document.domain (legacy) details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat document.domain (Legacy) as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate document.domain (Legacy) in B3.13 — Same-Origin Policy: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect document.domain (Legacy) to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about document.domain (legacy).",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing document.domain (Legacy) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// document.domain (Legacy) — minimal browser example\nconsole.log('[b3-document-domain-legacy]', typeof document);\n// Open DevTools → verify behavior for: document.domain (Legacy)\n// Spec reference: developer.mozilla.org (search \"document.domain (Legacy)\")",
  "exampleCaption": "document.domain (Legacy) — observe in DevTools while this runs",
  "internals": [
    "document.domain (Legacy) is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for document.domain (legacy) can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether document.domain (legacy) succeeds in production."
  ],
  "takeaways": [
    "Locate document.domain (Legacy) in B3.13 — Same-Origin Policy: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect document.domain (Legacy) to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing document.domain (Legacy) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "document.domain (Legacy) is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "document.domain (Legacy): Treat document.domain (Legacy) as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate document.domain (Legacy) in B3.13 — Same-Origin Policy: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect document.domain (Legacy) to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing document.domain (Legacy) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "document.domain (Legacy)",
      "document.domain (Legacy) is a core Web Platform concept in Same-Origin Policy."
    ],
    [
      "Mental model",
      "Treat document.domain (Legacy) as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing document.domain (Legacy) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate document.domain (Legacy) in B3.13 — Same-Origin Policy: map it to MDN ref",
      "Connect document.domain (Legacy) to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is document.domain (Legacy) in the browser and when do you use it?",
      "answerHint": "document.domain (Legacy) is a core Web Platform concept in Same-Origin Policy. It belongs to the Same-Origin Policy and cross-origin restrictions. Understanding document.domain (Legacy) helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain document.domain (Legacy) with a DevTools observation and one pitfall.",
      "answerHint": "Locate document.domain (Legacy) in B3.13 — Same-Origin Policy: map it to MDN reference docs and observe behavior in DevTools. Connect document.domain (Legacy) to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about document.domain (legacy). Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing document.domain (Legacy) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain document.domain (Legacy) in a senior frontend interview?",
      "answerHint": "document.domain (Legacy) is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for document.domain (legacy) can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether document.domain (legacy) succeeds in production. // document.domain (Legacy) — minimal browser example\nconsole.log('[b3-document-domain-legacy]', typeof document);\n// Op"
    }
  ],
  "pitfalls": [
    "Interview trap: describing document.domain (Legacy) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain document.domain (Legacy) at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "document.domain (Legacy) is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is document.domain (Legacy)?",
      "When would document.domain (Legacy) block rendering or fail cross-origin?",
      "What is the classic document.domain (Legacy) interview trap?"
    ],
    "traps": [
      "Interview trap: describing document.domain (Legacy) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide document.domain (legacy) details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around document.domain (Legacy)."
    ]
  }
})
