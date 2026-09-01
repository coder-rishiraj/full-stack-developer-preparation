import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Clickjacking",
  "whatIsIt": "Clickjacking is a core Web Platform concept in Browser Security Fundamentals. It belongs to browser security: XSS, CSRF, clickjacking, and token storage. Understanding Clickjacking helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide clickjacking details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Clickjacking as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Clickjacking in B3.20 — Browser Security Fundamentals: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Clickjacking to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about clickjacking.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Clickjacking from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Clickjacking — minimal browser example\nconsole.log('[b3-clickjacking]', typeof document);\n// Open DevTools → verify behavior for: Clickjacking\n// Spec reference: developer.mozilla.org (search \"Clickjacking\")",
  "exampleCaption": "Clickjacking — observe in DevTools while this runs",
  "internals": [
    "Clickjacking is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for clickjacking can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether clickjacking succeeds in production."
  ],
  "takeaways": [
    "Locate Clickjacking in B3.20 — Browser Security Fundamentals: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Clickjacking to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Clickjacking from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Clickjacking is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Clickjacking: Treat Clickjacking as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Clickjacking in B3.20 — Browser Security Fundamentals: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Clickjacking to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Clickjacking from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Clickjacking",
      "Clickjacking is a core Web Platform concept in Browser Security Fundamentals."
    ],
    [
      "Mental model",
      "Treat Clickjacking as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Clickjacking from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Clickjacking in B3.20 — Browser Security Fundamentals: map it to MDN refe",
      "Connect Clickjacking to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Clickjacking in the browser and when do you use it?",
      "answerHint": "Clickjacking is a core Web Platform concept in Browser Security Fundamentals. It belongs to browser security: XSS, CSRF, clickjacking, and token storage. Understanding Clickjacking helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Clickjacking with a DevTools observation and one pitfall.",
      "answerHint": "Locate Clickjacking in B3.20 — Browser Security Fundamentals: map it to MDN reference docs and observe behavior in DevTools. Connect Clickjacking to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about clickjacking. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Clickjacking from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Clickjacking in a senior frontend interview?",
      "answerHint": "Clickjacking is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for clickjacking can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether clickjacking succeeds in production. // Clickjacking — minimal browser example\nconsole.log('[b3-clickjacking]', typeof document);\n// Open DevTools → verify b"
    }
  ],
  "pitfalls": [
    "Interview trap: describing Clickjacking from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Clickjacking at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Clickjacking is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Clickjacking?",
      "When would Clickjacking block rendering or fail cross-origin?",
      "What is the classic Clickjacking interview trap?"
    ],
    "traps": [
      "Interview trap: describing Clickjacking from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide clickjacking details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Clickjacking."
    ]
  }
})
