import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Nonces & Hashes",
  "whatIsIt": "Nonces & Hashes is a core Web Platform concept in Content Security Policy. It belongs to Content Security Policy (CSP) directives and XSS mitigation. Understanding Nonces & Hashes helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide nonces & hashes details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Nonces & Hashes as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Nonces & Hashes in B3.19 — Content Security Policy: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Nonces & Hashes to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about nonces & hashes.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Nonces & Hashes from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Nonces & Hashes — minimal browser example\nconsole.log('[b3-csp-nonces-hashes]', typeof document);\n// Open DevTools → verify behavior for: Nonces & Hashes\n// Spec reference: developer.mozilla.org (search \"Nonces & Hashes\")",
  "exampleCaption": "Nonces & Hashes — observe in DevTools while this runs",
  "internals": [
    "Nonces & Hashes is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for nonces & hashes can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether nonces & hashes succeeds in production."
  ],
  "takeaways": [
    "Locate Nonces & Hashes in B3.19 — Content Security Policy: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Nonces & Hashes to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Nonces & Hashes from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Nonces & Hashes is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Nonces & Hashes: Treat Nonces & Hashes as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Nonces & Hashes in B3.19 — Content Security Policy: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Nonces & Hashes to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Nonces & Hashes from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Nonces & Hashes",
      "Nonces & Hashes is a core Web Platform concept in Content Security Policy."
    ],
    [
      "Mental model",
      "Treat Nonces & Hashes as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Nonces & Hashes from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Nonces & Hashes in B3.19 — Content Security Policy: map it to MDN referen",
      "Connect Nonces & Hashes to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Nonces & Hashes in the browser and when do you use it?",
      "answerHint": "Nonces & Hashes is a core Web Platform concept in Content Security Policy. It belongs to Content Security Policy (CSP) directives and XSS mitigation. Understanding Nonces & Hashes helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Nonces & Hashes with a DevTools observation and one pitfall.",
      "answerHint": "Locate Nonces & Hashes in B3.19 — Content Security Policy: map it to MDN reference docs and observe behavior in DevTools. Connect Nonces & Hashes to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about nonces & hashes. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Nonces & Hashes from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Nonces & Hashes in a senior frontend interview?",
      "answerHint": "Nonces & Hashes is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for nonces & hashes can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether nonces & hashes succeeds in production. // Nonces & Hashes — minimal browser example\nconsole.log('[b3-csp-nonces-hashes]', typeof document);\n// Open DevTools → "
    }
  ],
  "pitfalls": [
    "Interview trap: describing Nonces & Hashes from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Nonces & Hashes at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Nonces & Hashes is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Nonces & Hashes?",
      "When would Nonces & Hashes block rendering or fail cross-origin?",
      "What is the classic Nonces & Hashes interview trap?"
    ],
    "traps": [
      "Interview trap: describing Nonces & Hashes from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide nonces & hashes details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Nonces & Hashes."
    ]
  }
})
