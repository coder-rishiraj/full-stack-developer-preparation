import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Inline Script Restrictions",
  "whatIsIt": "Inline Script Restrictions is a core Web Platform concept in Content Security Policy. It belongs to Content Security Policy (CSP) directives and XSS mitigation. Understanding Inline Script Restrictions helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide inline script restrictions details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Inline Script Restrictions as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Inline Script Restrictions in B3.19 — Content Security Policy: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Inline Script Restrictions to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about inline script restrictions.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Inline Script Restrictions from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Inline Script Restrictions — minimal browser example\nconsole.log('[b3-csp-inline-scripts]', typeof document);\n// Open DevTools → verify behavior for: Inline Script Restrictions\n// Spec reference: developer.mozilla.org (search \"Inline Script Restrictions\")",
  "exampleCaption": "Inline Script Restrictions — observe in DevTools while this runs",
  "internals": [
    "Inline Script Restrictions is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for inline script restrictions can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether inline script restrictions succeeds in production."
  ],
  "takeaways": [
    "Locate Inline Script Restrictions in B3.19 — Content Security Policy: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Inline Script Restrictions to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Inline Script Restrictions from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Inline Script Restrictions is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Inline Script Restrictions: Treat Inline Script Restrictions as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Inline Script Restrictions in B3.19 — Content Security Policy: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Inline Script Restrictions to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Inline Script Restrictions from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Inline Script Restrictions",
      "Inline Script Restrictions is a core Web Platform concept in Content Security Policy."
    ],
    [
      "Mental model",
      "Treat Inline Script Restrictions as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Inline Script Restrictions from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Inline Script Restrictions in B3.19 — Content Security Policy: map it to ",
      "Connect Inline Script Restrictions to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Inline Script Restrictions in the browser and when do you use it?",
      "answerHint": "Inline Script Restrictions is a core Web Platform concept in Content Security Policy. It belongs to Content Security Policy (CSP) directives and XSS mitigation. Understanding Inline Script Restrictions helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Inline Script Restrictions with a DevTools observation and one pitfall.",
      "answerHint": "Locate Inline Script Restrictions in B3.19 — Content Security Policy: map it to MDN reference docs and observe behavior in DevTools. Connect Inline Script Restrictions to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about inline script restrictions. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Inline Script Restrictions from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Inline Script Restrictions in a senior frontend interview?",
      "answerHint": "Inline Script Restrictions is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for inline script restrictions can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether inline script restrictions succeeds in production. // Inline Script Restrictions — minimal browser example\nconsole.log('[b3-csp-inline-scripts]', typeof document);\n// Open"
    }
  ],
  "pitfalls": [
    "Interview trap: describing Inline Script Restrictions from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Inline Script Restrictions at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Inline Script Restrictions is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Inline Script Restrictions?",
      "When would Inline Script Restrictions block rendering or fail cross-origin?",
      "What is the classic Inline Script Restrictions interview trap?"
    ],
    "traps": [
      "Interview trap: describing Inline Script Restrictions from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide inline script restrictions details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Inline Script Restrictions."
    ]
  }
})
