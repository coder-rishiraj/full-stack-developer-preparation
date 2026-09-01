import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Reflected XSS",
  "whatIsIt": "Reflected XSS is a core Web Platform concept in Browser Security Fundamentals. It belongs to browser security: XSS, CSRF, clickjacking, and token storage. Understanding Reflected XSS helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide reflected xss details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Reflected XSS as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Reflected XSS in B3.20 — Browser Security Fundamentals: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Reflected XSS to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about reflected xss.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Reflected XSS from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Reflected XSS — minimal browser example\nconsole.log('[b3-xss-reflected]', typeof document);\n// Open DevTools → verify behavior for: Reflected XSS\n// Spec reference: developer.mozilla.org (search \"Reflected XSS\")",
  "exampleCaption": "Reflected XSS — observe in DevTools while this runs",
  "internals": [
    "Reflected XSS is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for reflected xss can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether reflected xss succeeds in production."
  ],
  "takeaways": [
    "Locate Reflected XSS in B3.20 — Browser Security Fundamentals: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Reflected XSS to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Reflected XSS from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Reflected XSS is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Reflected XSS: Treat Reflected XSS as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Reflected XSS in B3.20 — Browser Security Fundamentals: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Reflected XSS to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Reflected XSS from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Reflected XSS",
      "Reflected XSS is a core Web Platform concept in Browser Security Fundamentals."
    ],
    [
      "Mental model",
      "Treat Reflected XSS as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Reflected XSS from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Reflected XSS in B3.20 — Browser Security Fundamentals: map it to MDN ref",
      "Connect Reflected XSS to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Reflected XSS in the browser and when do you use it?",
      "answerHint": "Reflected XSS is a core Web Platform concept in Browser Security Fundamentals. It belongs to browser security: XSS, CSRF, clickjacking, and token storage. Understanding Reflected XSS helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Reflected XSS with a DevTools observation and one pitfall.",
      "answerHint": "Locate Reflected XSS in B3.20 — Browser Security Fundamentals: map it to MDN reference docs and observe behavior in DevTools. Connect Reflected XSS to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about reflected xss. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Reflected XSS from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Reflected XSS in a senior frontend interview?",
      "answerHint": "Reflected XSS is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for reflected xss can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether reflected xss succeeds in production. // Reflected XSS — minimal browser example\nconsole.log('[b3-xss-reflected]', typeof document);\n// Open DevTools → verify"
    }
  ],
  "pitfalls": [
    "Interview trap: describing Reflected XSS from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Reflected XSS at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Reflected XSS is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Reflected XSS?",
      "When would Reflected XSS block rendering or fail cross-origin?",
      "What is the classic Reflected XSS interview trap?"
    ],
    "traps": [
      "Interview trap: describing Reflected XSS from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide reflected xss details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Reflected XSS."
    ]
  }
})
