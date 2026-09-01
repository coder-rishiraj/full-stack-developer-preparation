import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "SameSite Cookie Defense",
  "whatIsIt": "SameSite Cookie Defense is a core Web Platform concept in Browser Security Fundamentals. It belongs to browser security: XSS, CSRF, clickjacking, and token storage. Understanding SameSite Cookie Defense helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide samesite cookie defense details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat SameSite Cookie Defense as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate SameSite Cookie Defense in B3.20 — Browser Security Fundamentals: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect SameSite Cookie Defense to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about samesite cookie defense.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing SameSite Cookie Defense from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// SameSite Cookie Defense — minimal browser example\nconsole.log('[b3-csrf-samesite-defense]', typeof document);\n// Open DevTools → verify behavior for: SameSite Cookie Defense\n// Spec reference: developer.mozilla.org (search \"SameSite Cookie Defense\")",
  "exampleCaption": "SameSite Cookie Defense — observe in DevTools while this runs",
  "internals": [
    "SameSite Cookie Defense is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for samesite cookie defense can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether samesite cookie defense succeeds in production."
  ],
  "takeaways": [
    "Locate SameSite Cookie Defense in B3.20 — Browser Security Fundamentals: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect SameSite Cookie Defense to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing SameSite Cookie Defense from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "SameSite Cookie Defense is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "SameSite Cookie Defense: Treat SameSite Cookie Defense as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate SameSite Cookie Defense in B3.20 — Browser Security Fundamentals: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect SameSite Cookie Defense to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing SameSite Cookie Defense from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "SameSite Cookie Defense",
      "SameSite Cookie Defense is a core Web Platform concept in Browser Security Fundamentals."
    ],
    [
      "Mental model",
      "Treat SameSite Cookie Defense as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing SameSite Cookie Defense from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate SameSite Cookie Defense in B3.20 — Browser Security Fundamentals: map it ",
      "Connect SameSite Cookie Defense to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is SameSite Cookie Defense in the browser and when do you use it?",
      "answerHint": "SameSite Cookie Defense is a core Web Platform concept in Browser Security Fundamentals. It belongs to browser security: XSS, CSRF, clickjacking, and token storage. Understanding SameSite Cookie Defense helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain SameSite Cookie Defense with a DevTools observation and one pitfall.",
      "answerHint": "Locate SameSite Cookie Defense in B3.20 — Browser Security Fundamentals: map it to MDN reference docs and observe behavior in DevTools. Connect SameSite Cookie Defense to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about samesite cookie defense. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing SameSite Cookie Defense from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain SameSite Cookie Defense in a senior frontend interview?",
      "answerHint": "SameSite Cookie Defense is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for samesite cookie defense can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether samesite cookie defense succeeds in production. // SameSite Cookie Defense — minimal browser example\nconsole.log('[b3-csrf-samesite-defense]', typeof document);\n// Open"
    }
  ],
  "pitfalls": [
    "Interview trap: describing SameSite Cookie Defense from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain SameSite Cookie Defense at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "SameSite Cookie Defense is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is SameSite Cookie Defense?",
      "When would SameSite Cookie Defense block rendering or fail cross-origin?",
      "What is the classic SameSite Cookie Defense interview trap?"
    ],
    "traps": [
      "Interview trap: describing SameSite Cookie Defense from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide samesite cookie defense details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around SameSite Cookie Defense."
    ]
  }
})
