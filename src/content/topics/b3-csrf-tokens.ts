import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "CSRF Tokens",
  "whatIsIt": "CSRF Tokens is a core Web Platform concept in Browser Security Fundamentals. It belongs to browser security: XSS, CSRF, clickjacking, and token storage. Understanding CSRF Tokens helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide csrf tokens details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat CSRF Tokens as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate CSRF Tokens in B3.20 — Browser Security Fundamentals: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect CSRF Tokens to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about csrf tokens.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing CSRF Tokens from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// CSRF Tokens — minimal browser example\nconsole.log('[b3-csrf-tokens]', typeof document);\n// Open DevTools → verify behavior for: CSRF Tokens\n// Spec reference: developer.mozilla.org (search \"CSRF Tokens\")",
  "exampleCaption": "CSRF Tokens — observe in DevTools while this runs",
  "internals": [
    "CSRF Tokens is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for csrf tokens can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether csrf tokens succeeds in production."
  ],
  "takeaways": [
    "Locate CSRF Tokens in B3.20 — Browser Security Fundamentals: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect CSRF Tokens to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing CSRF Tokens from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "CSRF Tokens is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "CSRF Tokens: Treat CSRF Tokens as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate CSRF Tokens in B3.20 — Browser Security Fundamentals: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect CSRF Tokens to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing CSRF Tokens from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "CSRF Tokens",
      "CSRF Tokens is a core Web Platform concept in Browser Security Fundamentals."
    ],
    [
      "Mental model",
      "Treat CSRF Tokens as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing CSRF Tokens from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate CSRF Tokens in B3.20 — Browser Security Fundamentals: map it to MDN refer",
      "Connect CSRF Tokens to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is CSRF Tokens in the browser and when do you use it?",
      "answerHint": "CSRF Tokens is a core Web Platform concept in Browser Security Fundamentals. It belongs to browser security: XSS, CSRF, clickjacking, and token storage. Understanding CSRF Tokens helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain CSRF Tokens with a DevTools observation and one pitfall.",
      "answerHint": "Locate CSRF Tokens in B3.20 — Browser Security Fundamentals: map it to MDN reference docs and observe behavior in DevTools. Connect CSRF Tokens to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about csrf tokens. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing CSRF Tokens from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain CSRF Tokens in a senior frontend interview?",
      "answerHint": "CSRF Tokens is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for csrf tokens can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether csrf tokens succeeds in production. // CSRF Tokens — minimal browser example\nconsole.log('[b3-csrf-tokens]', typeof document);\n// Open DevTools → verify beh"
    }
  ],
  "pitfalls": [
    "Interview trap: describing CSRF Tokens from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain CSRF Tokens at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "CSRF Tokens is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is CSRF Tokens?",
      "When would CSRF Tokens block rendering or fail cross-origin?",
      "What is the classic CSRF Tokens interview trap?"
    ],
    "traps": [
      "Interview trap: describing CSRF Tokens from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide csrf tokens details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around CSRF Tokens."
    ]
  }
})
