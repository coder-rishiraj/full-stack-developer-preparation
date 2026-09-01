import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Content-Security-Policy-Report-Only",
  "whatIsIt": "Content-Security-Policy-Report-Only is a core Web Platform concept in Content Security Policy. It belongs to Content Security Policy (CSP) directives and XSS mitigation. Understanding Content-Security-Policy-Report-Only helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide content-security-policy-report-only details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Content-Security-Policy-Report-Only as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Content-Security-Policy-Report-Only in B3.19 — Content Security Policy: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Content-Security-Policy-Report-Only to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about content-security-policy-report-only.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Content-Security-Policy-Report-Only from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Content-Security-Policy-Report-Only — minimal browser example\nconsole.log('[b3-csp-report-only]', typeof document);\n// Open DevTools → verify behavior for: Content-Security-Policy-Report-Only\n// Spec reference: developer.mozilla.org (search \"Content-Security-Policy-Report-Only\")",
  "exampleCaption": "Content-Security-Policy-Report-Only — observe in DevTools while this runs",
  "internals": [
    "Content-Security-Policy-Report-Only is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for content-security-policy-report-only can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether content-security-policy-report-only succeeds in production."
  ],
  "takeaways": [
    "Locate Content-Security-Policy-Report-Only in B3.19 — Content Security Policy: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Content-Security-Policy-Report-Only to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Content-Security-Policy-Report-Only from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Content-Security-Policy-Report-Only is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Content-Security-Policy-Report-Only: Treat Content-Security-Policy-Report-Only as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Content-Security-Policy-Report-Only in B3.19 — Content Security Policy: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Content-Security-Policy-Report-Only to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Content-Security-Policy-Report-Only from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Content-Security-Policy-Report-Only",
      "Content-Security-Policy-Report-Only is a core Web Platform concept in Content Security Policy."
    ],
    [
      "Mental model",
      "Treat Content-Security-Policy-Report-Only as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Content-Security-Policy-Report-Only from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Content-Security-Policy-Report-Only in B3.19 — Content Security Policy: m",
      "Connect Content-Security-Policy-Report-Only to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Content-Security-Policy-Report-Only in the browser and when do you use it?",
      "answerHint": "Content-Security-Policy-Report-Only is a core Web Platform concept in Content Security Policy. It belongs to Content Security Policy (CSP) directives and XSS mitigation. Understanding Content-Security-Policy-Report-Only helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Content-Security-Policy-Report-Only with a DevTools observation and one pitfall.",
      "answerHint": "Locate Content-Security-Policy-Report-Only in B3.19 — Content Security Policy: map it to MDN reference docs and observe behavior in DevTools. Connect Content-Security-Policy-Report-Only to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about content-security-policy-report-only. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Content-Security-Policy-Report-Only from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Content-Security-Policy-Report-Only in a senior frontend interview?",
      "answerHint": "Content-Security-Policy-Report-Only is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for content-security-policy-report-only can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether content-security-policy-report-only succeeds in production. // Content-Security-Policy-Report-Only — minimal browser example\nconsole.log('[b3-csp-report-only]', typeof document);\n/"
    }
  ],
  "pitfalls": [
    "Interview trap: describing Content-Security-Policy-Report-Only from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Content-Security-Policy-Report-Only at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Content-Security-Policy-Report-Only is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Content-Security-Policy-Report-Only?",
      "When would Content-Security-Policy-Report-Only block rendering or fail cross-origin?",
      "What is the classic Content-Security-Policy-Report-Only interview trap?"
    ],
    "traps": [
      "Interview trap: describing Content-Security-Policy-Report-Only from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide content-security-policy-report-only details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Content-Security-Policy-Report-Only."
    ]
  }
})
