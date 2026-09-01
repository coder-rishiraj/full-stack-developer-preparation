import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Referrer-Policy",
  "whatIsIt": "Referrer-Policy is a core Web Platform concept in Browser Security Fundamentals. It belongs to browser security: XSS, CSRF, clickjacking, and token storage. Understanding Referrer-Policy helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide referrer-policy details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Referrer-Policy as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Referrer-Policy in B3.20 — Browser Security Fundamentals: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Referrer-Policy to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about referrer-policy.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Referrer-Policy from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Referrer-Policy — minimal browser example\nconsole.log('[b3-referrer-policy]', typeof document);\n// Open DevTools → verify behavior for: Referrer-Policy\n// Spec reference: developer.mozilla.org (search \"Referrer-Policy\")",
  "exampleCaption": "Referrer-Policy — observe in DevTools while this runs",
  "internals": [
    "Referrer-Policy is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for referrer-policy can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether referrer-policy succeeds in production."
  ],
  "takeaways": [
    "Locate Referrer-Policy in B3.20 — Browser Security Fundamentals: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Referrer-Policy to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Referrer-Policy from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Referrer-Policy is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Referrer-Policy: Treat Referrer-Policy as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Referrer-Policy in B3.20 — Browser Security Fundamentals: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Referrer-Policy to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Referrer-Policy from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Referrer-Policy",
      "Referrer-Policy is a core Web Platform concept in Browser Security Fundamentals."
    ],
    [
      "Mental model",
      "Treat Referrer-Policy as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Referrer-Policy from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Referrer-Policy in B3.20 — Browser Security Fundamentals: map it to MDN r",
      "Connect Referrer-Policy to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Referrer-Policy in the browser and when do you use it?",
      "answerHint": "Referrer-Policy is a core Web Platform concept in Browser Security Fundamentals. It belongs to browser security: XSS, CSRF, clickjacking, and token storage. Understanding Referrer-Policy helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Referrer-Policy with a DevTools observation and one pitfall.",
      "answerHint": "Locate Referrer-Policy in B3.20 — Browser Security Fundamentals: map it to MDN reference docs and observe behavior in DevTools. Connect Referrer-Policy to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about referrer-policy. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Referrer-Policy from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Referrer-Policy in a senior frontend interview?",
      "answerHint": "Referrer-Policy is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for referrer-policy can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether referrer-policy succeeds in production. // Referrer-Policy — minimal browser example\nconsole.log('[b3-referrer-policy]', typeof document);\n// Open DevTools → ve"
    }
  ],
  "pitfalls": [
    "Interview trap: describing Referrer-Policy from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Referrer-Policy at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Referrer-Policy is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Referrer-Policy?",
      "When would Referrer-Policy block rendering or fail cross-origin?",
      "What is the classic Referrer-Policy interview trap?"
    ],
    "traps": [
      "Interview trap: describing Referrer-Policy from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide referrer-policy details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Referrer-Policy."
    ]
  }
})
