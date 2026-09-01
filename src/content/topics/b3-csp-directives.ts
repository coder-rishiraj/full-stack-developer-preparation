import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "CSP Directives",
  "whatIsIt": "CSP Directives is a core Web Platform concept in Content Security Policy. It belongs to Content Security Policy (CSP) directives and XSS mitigation. Understanding CSP Directives helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide csp directives details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat CSP Directives as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate CSP Directives in B3.19 — Content Security Policy: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect CSP Directives to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about csp directives.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing CSP Directives from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// CSP Directives — minimal browser example\nconsole.log('[b3-csp-directives]', typeof document);\n// Open DevTools → verify behavior for: CSP Directives\n// Spec reference: developer.mozilla.org (search \"CSP Directives\")",
  "exampleCaption": "CSP Directives — observe in DevTools while this runs",
  "internals": [
    "CSP Directives is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for csp directives can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether csp directives succeeds in production."
  ],
  "takeaways": [
    "Locate CSP Directives in B3.19 — Content Security Policy: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect CSP Directives to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing CSP Directives from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "CSP Directives is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "CSP Directives: Treat CSP Directives as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate CSP Directives in B3.19 — Content Security Policy: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect CSP Directives to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing CSP Directives from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "CSP Directives",
      "CSP Directives is a core Web Platform concept in Content Security Policy."
    ],
    [
      "Mental model",
      "Treat CSP Directives as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing CSP Directives from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate CSP Directives in B3.19 — Content Security Policy: map it to MDN referenc",
      "Connect CSP Directives to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is CSP Directives in the browser and when do you use it?",
      "answerHint": "CSP Directives is a core Web Platform concept in Content Security Policy. It belongs to Content Security Policy (CSP) directives and XSS mitigation. Understanding CSP Directives helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain CSP Directives with a DevTools observation and one pitfall.",
      "answerHint": "Locate CSP Directives in B3.19 — Content Security Policy: map it to MDN reference docs and observe behavior in DevTools. Connect CSP Directives to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about csp directives. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing CSP Directives from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain CSP Directives in a senior frontend interview?",
      "answerHint": "CSP Directives is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for csp directives can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether csp directives succeeds in production. // CSP Directives — minimal browser example\nconsole.log('[b3-csp-directives]', typeof document);\n// Open DevTools → veri"
    }
  ],
  "pitfalls": [
    "Interview trap: describing CSP Directives from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain CSP Directives at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "CSP Directives is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is CSP Directives?",
      "When would CSP Directives block rendering or fail cross-origin?",
      "What is the classic CSP Directives interview trap?"
    ],
    "traps": [
      "Interview trap: describing CSP Directives from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide csp directives details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around CSP Directives."
    ]
  }
})
