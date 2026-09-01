import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Domain & Path",
  "whatIsIt": "Domain & Path is a core Web Platform concept in Cookies. It belongs to HTTP cookies, attributes, and security implications. Understanding Domain & Path helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide domain & path details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Domain & Path as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Domain & Path in B3.15 — Cookies: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Domain & Path to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about domain & path.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Domain & Path from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Domain & Path — minimal browser example\nconsole.log('[b3-cookie-domain-path]', typeof document);\n// Open DevTools → verify behavior for: Domain & Path\n// Spec reference: developer.mozilla.org (search \"Domain & Path\")",
  "exampleCaption": "Domain & Path — observe in DevTools while this runs",
  "internals": [
    "Domain & Path is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for domain & path can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether domain & path succeeds in production."
  ],
  "takeaways": [
    "Locate Domain & Path in B3.15 — Cookies: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Domain & Path to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Domain & Path from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Domain & Path is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Domain & Path: Treat Domain & Path as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Domain & Path in B3.15 — Cookies: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Domain & Path to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Domain & Path from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Domain & Path",
      "Domain & Path is a core Web Platform concept in Cookies."
    ],
    [
      "Mental model",
      "Treat Domain & Path as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Domain & Path from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Domain & Path in B3.15 — Cookies: map it to MDN reference docs and observ",
      "Connect Domain & Path to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Domain & Path in the browser and when do you use it?",
      "answerHint": "Domain & Path is a core Web Platform concept in Cookies. It belongs to HTTP cookies, attributes, and security implications. Understanding Domain & Path helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Domain & Path with a DevTools observation and one pitfall.",
      "answerHint": "Locate Domain & Path in B3.15 — Cookies: map it to MDN reference docs and observe behavior in DevTools. Connect Domain & Path to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about domain & path. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Domain & Path from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Domain & Path in a senior frontend interview?",
      "answerHint": "Domain & Path is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for domain & path can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether domain & path succeeds in production. // Domain & Path — minimal browser example\nconsole.log('[b3-cookie-domain-path]', typeof document);\n// Open DevTools → v"
    }
  ],
  "pitfalls": [
    "Interview trap: describing Domain & Path from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Domain & Path at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Domain & Path is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Domain & Path?",
      "When would Domain & Path block rendering or fail cross-origin?",
      "What is the classic Domain & Path interview trap?"
    ],
    "traps": [
      "Interview trap: describing Domain & Path from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide domain & path details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Domain & Path."
    ]
  }
})
