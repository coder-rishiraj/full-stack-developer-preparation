import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Cross-Site Scripting (XSS)",
  "whatIsIt": "Cross-Site Scripting (XSS) is a core Web Platform concept in Browser Security Fundamentals. It belongs to browser security: XSS, CSRF, clickjacking, and token storage. Understanding Cross-Site Scripting (XSS) helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide cross-site scripting (xss) details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Cross-Site Scripting (XSS) as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Cross-Site Scripting (XSS) in B3.20 — Browser Security Fundamentals: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Cross-Site Scripting (XSS) to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about cross-site scripting (xss).",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Cross-Site Scripting (XSS) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Cross-Site Scripting (XSS) — minimal browser example\nconsole.log('[b3-xss]', typeof document);\n// Open DevTools → verify behavior for: Cross-Site Scripting (XSS)\n// Spec reference: developer.mozilla.org (search \"Cross-Site Scripting (XSS)\")",
  "exampleCaption": "Cross-Site Scripting (XSS) — observe in DevTools while this runs",
  "internals": [
    "Cross-Site Scripting (XSS) is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for cross-site scripting (xss) can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether cross-site scripting (xss) succeeds in production."
  ],
  "takeaways": [
    "Locate Cross-Site Scripting (XSS) in B3.20 — Browser Security Fundamentals: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Cross-Site Scripting (XSS) to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Cross-Site Scripting (XSS) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Cross-Site Scripting (XSS) is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Cross-Site Scripting (XSS): Treat Cross-Site Scripting (XSS) as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Cross-Site Scripting (XSS) in B3.20 — Browser Security Fundamentals: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Cross-Site Scripting (XSS) to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Cross-Site Scripting (XSS) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Cross-Site Scripting (XSS)",
      "Cross-Site Scripting (XSS) is a core Web Platform concept in Browser Security Fundamentals."
    ],
    [
      "Mental model",
      "Treat Cross-Site Scripting (XSS) as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Cross-Site Scripting (XSS) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Cross-Site Scripting (XSS) in B3.20 — Browser Security Fundamentals: map ",
      "Connect Cross-Site Scripting (XSS) to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Cross-Site Scripting (XSS) in the browser and when do you use it?",
      "answerHint": "Cross-Site Scripting (XSS) is a core Web Platform concept in Browser Security Fundamentals. It belongs to browser security: XSS, CSRF, clickjacking, and token storage. Understanding Cross-Site Scripting (XSS) helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Cross-Site Scripting (XSS) with a DevTools observation and one pitfall.",
      "answerHint": "Locate Cross-Site Scripting (XSS) in B3.20 — Browser Security Fundamentals: map it to MDN reference docs and observe behavior in DevTools. Connect Cross-Site Scripting (XSS) to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about cross-site scripting (xss). Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Cross-Site Scripting (XSS) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Cross-Site Scripting (XSS) in a senior frontend interview?",
      "answerHint": "Cross-Site Scripting (XSS) is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for cross-site scripting (xss) can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether cross-site scripting (xss) succeeds in production. // Cross-Site Scripting (XSS) — minimal browser example\nconsole.log('[b3-xss]', typeof document);\n// Open DevTools → ver"
    }
  ],
  "pitfalls": [
    "Interview trap: describing Cross-Site Scripting (XSS) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Cross-Site Scripting (XSS) at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Cross-Site Scripting (XSS) is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Cross-Site Scripting (XSS)?",
      "When would Cross-Site Scripting (XSS) block rendering or fail cross-origin?",
      "What is the classic Cross-Site Scripting (XSS) interview trap?"
    ],
    "traps": [
      "Interview trap: describing Cross-Site Scripting (XSS) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide cross-site scripting (xss) details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Cross-Site Scripting (XSS)."
    ]
  }
})
