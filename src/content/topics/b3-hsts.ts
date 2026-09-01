import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Strict-Transport-Security (HSTS)",
  "whatIsIt": "Strict-Transport-Security (HSTS) is a core Web Platform concept in Browser Security Fundamentals. It belongs to browser security: XSS, CSRF, clickjacking, and token storage. Understanding Strict-Transport-Security (HSTS) helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide strict-transport-security (hsts) details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Strict-Transport-Security (HSTS) as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Strict-Transport-Security (HSTS) in B3.20 — Browser Security Fundamentals: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Strict-Transport-Security (HSTS) to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about strict-transport-security (hsts).",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Strict-Transport-Security (HSTS) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Strict-Transport-Security (HSTS) — minimal browser example\nconsole.log('[b3-hsts]', typeof document);\n// Open DevTools → verify behavior for: Strict-Transport-Security (HSTS)\n// Spec reference: developer.mozilla.org (search \"Strict-Transport-Security (HSTS)\")",
  "exampleCaption": "Strict-Transport-Security (HSTS) — observe in DevTools while this runs",
  "internals": [
    "Strict-Transport-Security (HSTS) is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for strict-transport-security (hsts) can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether strict-transport-security (hsts) succeeds in production."
  ],
  "takeaways": [
    "Locate Strict-Transport-Security (HSTS) in B3.20 — Browser Security Fundamentals: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Strict-Transport-Security (HSTS) to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Strict-Transport-Security (HSTS) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Strict-Transport-Security (HSTS) is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Strict-Transport-Security (HSTS): Treat Strict-Transport-Security (HSTS) as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Strict-Transport-Security (HSTS) in B3.20 — Browser Security Fundamentals: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Strict-Transport-Security (HSTS) to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Strict-Transport-Security (HSTS) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Strict-Transport-Security (HSTS)",
      "Strict-Transport-Security (HSTS) is a core Web Platform concept in Browser Security Fundamentals."
    ],
    [
      "Mental model",
      "Treat Strict-Transport-Security (HSTS) as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Strict-Transport-Security (HSTS) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Strict-Transport-Security (HSTS) in B3.20 — Browser Security Fundamentals",
      "Connect Strict-Transport-Security (HSTS) to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Strict-Transport-Security (HSTS) in the browser and when do you use it?",
      "answerHint": "Strict-Transport-Security (HSTS) is a core Web Platform concept in Browser Security Fundamentals. It belongs to browser security: XSS, CSRF, clickjacking, and token storage. Understanding Strict-Transport-Security (HSTS) helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Strict-Transport-Security (HSTS) with a DevTools observation and one pitfall.",
      "answerHint": "Locate Strict-Transport-Security (HSTS) in B3.20 — Browser Security Fundamentals: map it to MDN reference docs and observe behavior in DevTools. Connect Strict-Transport-Security (HSTS) to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about strict-transport-security (hsts). Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Strict-Transport-Security (HSTS) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Strict-Transport-Security (HSTS) in a senior frontend interview?",
      "answerHint": "Strict-Transport-Security (HSTS) is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for strict-transport-security (hsts) can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether strict-transport-security (hsts) succeeds in production. // Strict-Transport-Security (HSTS) — minimal browser example\nconsole.log('[b3-hsts]', typeof document);\n// Open DevTool"
    }
  ],
  "pitfalls": [
    "Interview trap: describing Strict-Transport-Security (HSTS) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Strict-Transport-Security (HSTS) at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Strict-Transport-Security (HSTS) is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Strict-Transport-Security (HSTS)?",
      "When would Strict-Transport-Security (HSTS) block rendering or fail cross-origin?",
      "What is the classic Strict-Transport-Security (HSTS) interview trap?"
    ],
    "traps": [
      "Interview trap: describing Strict-Transport-Security (HSTS) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide strict-transport-security (hsts) details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Strict-Transport-Security (HSTS)."
    ]
  }
})
