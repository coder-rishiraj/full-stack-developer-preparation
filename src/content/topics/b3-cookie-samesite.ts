import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "SameSite (Strict / Lax / None)",
  "whatIsIt": "SameSite (Strict / Lax / None) is a core Web Platform concept in Cookies. It belongs to HTTP cookies, attributes, and security implications. Understanding SameSite (Strict / Lax / None) helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide samesite (strict / lax / none) details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat SameSite (Strict / Lax / None) as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate SameSite (Strict / Lax / None) in B3.15 — Cookies: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect SameSite (Strict / Lax / None) to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about samesite (strict / lax / none).",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing SameSite (Strict / Lax / None) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// SameSite (Strict / Lax / None) — minimal browser example\nconsole.log('[b3-cookie-samesite]', typeof document);\n// Open DevTools → verify behavior for: SameSite (Strict / Lax / None)\n// Spec reference: developer.mozilla.org (search \"SameSite (Strict / Lax / None)\")",
  "exampleCaption": "SameSite (Strict / Lax / None) — observe in DevTools while this runs",
  "internals": [
    "SameSite (Strict / Lax / None) is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for samesite (strict / lax / none) can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether samesite (strict / lax / none) succeeds in production."
  ],
  "takeaways": [
    "Locate SameSite (Strict / Lax / None) in B3.15 — Cookies: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect SameSite (Strict / Lax / None) to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing SameSite (Strict / Lax / None) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "SameSite (Strict / Lax / None) is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "SameSite (Strict / Lax / None): Treat SameSite (Strict / Lax / None) as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate SameSite (Strict / Lax / None) in B3.15 — Cookies: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect SameSite (Strict / Lax / None) to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing SameSite (Strict / Lax / None) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "SameSite (Strict / Lax / None)",
      "SameSite (Strict / Lax / None) is a core Web Platform concept in Cookies."
    ],
    [
      "Mental model",
      "Treat SameSite (Strict / Lax / None) as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing SameSite (Strict / Lax / None) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate SameSite (Strict / Lax / None) in B3.15 — Cookies: map it to MDN referenc",
      "Connect SameSite (Strict / Lax / None) to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is SameSite (Strict / Lax / None) in the browser and when do you use it?",
      "answerHint": "SameSite (Strict / Lax / None) is a core Web Platform concept in Cookies. It belongs to HTTP cookies, attributes, and security implications. Understanding SameSite (Strict / Lax / None) helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain SameSite (Strict / Lax / None) with a DevTools observation and one pitfall.",
      "answerHint": "Locate SameSite (Strict / Lax / None) in B3.15 — Cookies: map it to MDN reference docs and observe behavior in DevTools. Connect SameSite (Strict / Lax / None) to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about samesite (strict / lax / none). Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing SameSite (Strict / Lax / None) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain SameSite (Strict / Lax / None) in a senior frontend interview?",
      "answerHint": "SameSite (Strict / Lax / None) is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for samesite (strict / lax / none) can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether samesite (strict / lax / none) succeeds in production. // SameSite (Strict / Lax / None) — minimal browser example\nconsole.log('[b3-cookie-samesite]', typeof document);\n// Ope"
    }
  ],
  "pitfalls": [
    "Interview trap: describing SameSite (Strict / Lax / None) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain SameSite (Strict / Lax / None) at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "SameSite (Strict / Lax / None) is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is SameSite (Strict / Lax / None)?",
      "When would SameSite (Strict / Lax / None) block rendering or fail cross-origin?",
      "What is the classic SameSite (Strict / Lax / None) interview trap?"
    ],
    "traps": [
      "Interview trap: describing SameSite (Strict / Lax / None) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide samesite (strict / lax / none) details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around SameSite (Strict / Lax / None)."
    ]
  }
})
