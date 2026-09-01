import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Permissions-Policy",
  "whatIsIt": "Permissions-Policy is a core Web Platform concept in Browser Security Fundamentals. It belongs to browser security: XSS, CSRF, clickjacking, and token storage. Understanding Permissions-Policy helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide permissions-policy details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Permissions-Policy as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Permissions-Policy in B3.20 — Browser Security Fundamentals: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Permissions-Policy to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about permissions-policy.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Permissions-Policy from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Permissions-Policy — minimal browser example\nconsole.log('[b3-permissions-policy]', typeof document);\n// Open DevTools → verify behavior for: Permissions-Policy\n// Spec reference: developer.mozilla.org (search \"Permissions-Policy\")",
  "exampleCaption": "Permissions-Policy — observe in DevTools while this runs",
  "internals": [
    "Permissions-Policy is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for permissions-policy can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether permissions-policy succeeds in production."
  ],
  "takeaways": [
    "Locate Permissions-Policy in B3.20 — Browser Security Fundamentals: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Permissions-Policy to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Permissions-Policy from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Permissions-Policy is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Permissions-Policy: Treat Permissions-Policy as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Permissions-Policy in B3.20 — Browser Security Fundamentals: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Permissions-Policy to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Permissions-Policy from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Permissions-Policy",
      "Permissions-Policy is a core Web Platform concept in Browser Security Fundamentals."
    ],
    [
      "Mental model",
      "Treat Permissions-Policy as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Permissions-Policy from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Permissions-Policy in B3.20 — Browser Security Fundamentals: map it to MD",
      "Connect Permissions-Policy to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Permissions-Policy in the browser and when do you use it?",
      "answerHint": "Permissions-Policy is a core Web Platform concept in Browser Security Fundamentals. It belongs to browser security: XSS, CSRF, clickjacking, and token storage. Understanding Permissions-Policy helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Permissions-Policy with a DevTools observation and one pitfall.",
      "answerHint": "Locate Permissions-Policy in B3.20 — Browser Security Fundamentals: map it to MDN reference docs and observe behavior in DevTools. Connect Permissions-Policy to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about permissions-policy. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Permissions-Policy from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Permissions-Policy in a senior frontend interview?",
      "answerHint": "Permissions-Policy is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for permissions-policy can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether permissions-policy succeeds in production. // Permissions-Policy — minimal browser example\nconsole.log('[b3-permissions-policy]', typeof document);\n// Open DevTool"
    }
  ],
  "pitfalls": [
    "Interview trap: describing Permissions-Policy from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Permissions-Policy at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Permissions-Policy is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Permissions-Policy?",
      "When would Permissions-Policy block rendering or fail cross-origin?",
      "What is the classic Permissions-Policy interview trap?"
    ],
    "traps": [
      "Interview trap: describing Permissions-Policy from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide permissions-policy details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Permissions-Policy."
    ]
  }
})
