import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Cookie Size & Count Limits",
  "whatIsIt": "Cookie Size & Count Limits is a core Web Platform concept in Cookies. It belongs to HTTP cookies, attributes, and security implications. Understanding Cookie Size & Count Limits helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide cookie size & count limits details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Cookie Size & Count Limits as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Cookie Size & Count Limits in B3.15 — Cookies: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Cookie Size & Count Limits to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about cookie size & count limits.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Cookie Size & Count Limits from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Cookie Size & Count Limits — minimal browser example\nconsole.log('[b3-cookie-size-limits]', typeof document);\n// Open DevTools → verify behavior for: Cookie Size & Count Limits\n// Spec reference: developer.mozilla.org (search \"Cookie Size & Count Limits\")",
  "exampleCaption": "Cookie Size & Count Limits — observe in DevTools while this runs",
  "internals": [
    "Cookie Size & Count Limits is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for cookie size & count limits can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether cookie size & count limits succeeds in production."
  ],
  "takeaways": [
    "Locate Cookie Size & Count Limits in B3.15 — Cookies: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Cookie Size & Count Limits to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Cookie Size & Count Limits from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Cookie Size & Count Limits is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Cookie Size & Count Limits: Treat Cookie Size & Count Limits as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Cookie Size & Count Limits in B3.15 — Cookies: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Cookie Size & Count Limits to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Cookie Size & Count Limits from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Cookie Size & Count Limits",
      "Cookie Size & Count Limits is a core Web Platform concept in Cookies."
    ],
    [
      "Mental model",
      "Treat Cookie Size & Count Limits as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Cookie Size & Count Limits from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Cookie Size & Count Limits in B3.15 — Cookies: map it to MDN reference do",
      "Connect Cookie Size & Count Limits to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Cookie Size & Count Limits in the browser and when do you use it?",
      "answerHint": "Cookie Size & Count Limits is a core Web Platform concept in Cookies. It belongs to HTTP cookies, attributes, and security implications. Understanding Cookie Size & Count Limits helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Cookie Size & Count Limits with a DevTools observation and one pitfall.",
      "answerHint": "Locate Cookie Size & Count Limits in B3.15 — Cookies: map it to MDN reference docs and observe behavior in DevTools. Connect Cookie Size & Count Limits to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about cookie size & count limits. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Cookie Size & Count Limits from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Cookie Size & Count Limits in a senior frontend interview?",
      "answerHint": "Cookie Size & Count Limits is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for cookie size & count limits can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether cookie size & count limits succeeds in production. // Cookie Size & Count Limits — minimal browser example\nconsole.log('[b3-cookie-size-limits]', typeof document);\n// Open"
    }
  ],
  "pitfalls": [
    "Interview trap: describing Cookie Size & Count Limits from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Cookie Size & Count Limits at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Cookie Size & Count Limits is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Cookie Size & Count Limits?",
      "When would Cookie Size & Count Limits block rendering or fail cross-origin?",
      "What is the classic Cookie Size & Count Limits interview trap?"
    ],
    "traps": [
      "Interview trap: describing Cookie Size & Count Limits from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide cookie size & count limits details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Cookie Size & Count Limits."
    ]
  }
})
