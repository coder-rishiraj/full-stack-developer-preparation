import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "SOP & DOM Access",
  "whatIsIt": "SOP & DOM Access is a core Web Platform concept in Same-Origin Policy. It belongs to the Same-Origin Policy and cross-origin restrictions. Understanding SOP & DOM Access helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide sop & dom access details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat SOP & DOM Access as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate SOP & DOM Access in B3.13 — Same-Origin Policy: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect SOP & DOM Access to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about sop & dom access.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing SOP & DOM Access from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// SOP & DOM Access — minimal browser example\nconsole.log('[b3-sop-dom-access]', typeof document);\n// Open DevTools → verify behavior for: SOP & DOM Access\n// Spec reference: developer.mozilla.org (search \"SOP & DOM Access\")",
  "exampleCaption": "SOP & DOM Access — observe in DevTools while this runs",
  "internals": [
    "SOP & DOM Access is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for sop & dom access can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether sop & dom access succeeds in production."
  ],
  "takeaways": [
    "Locate SOP & DOM Access in B3.13 — Same-Origin Policy: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect SOP & DOM Access to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing SOP & DOM Access from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "SOP & DOM Access is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "SOP & DOM Access: Treat SOP & DOM Access as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate SOP & DOM Access in B3.13 — Same-Origin Policy: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect SOP & DOM Access to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing SOP & DOM Access from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "SOP & DOM Access",
      "SOP & DOM Access is a core Web Platform concept in Same-Origin Policy."
    ],
    [
      "Mental model",
      "Treat SOP & DOM Access as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing SOP & DOM Access from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate SOP & DOM Access in B3.13 — Same-Origin Policy: map it to MDN reference d",
      "Connect SOP & DOM Access to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is SOP & DOM Access in the browser and when do you use it?",
      "answerHint": "SOP & DOM Access is a core Web Platform concept in Same-Origin Policy. It belongs to the Same-Origin Policy and cross-origin restrictions. Understanding SOP & DOM Access helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain SOP & DOM Access with a DevTools observation and one pitfall.",
      "answerHint": "Locate SOP & DOM Access in B3.13 — Same-Origin Policy: map it to MDN reference docs and observe behavior in DevTools. Connect SOP & DOM Access to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about sop & dom access. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing SOP & DOM Access from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain SOP & DOM Access in a senior frontend interview?",
      "answerHint": "SOP & DOM Access is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for sop & dom access can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether sop & dom access succeeds in production. // SOP & DOM Access — minimal browser example\nconsole.log('[b3-sop-dom-access]', typeof document);\n// Open DevTools → ve"
    }
  ],
  "pitfalls": [
    "Interview trap: describing SOP & DOM Access from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain SOP & DOM Access at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "SOP & DOM Access is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is SOP & DOM Access?",
      "When would SOP & DOM Access block rendering or fail cross-origin?",
      "What is the classic SOP & DOM Access interview trap?"
    ],
    "traps": [
      "Interview trap: describing SOP & DOM Access from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide sop & dom access details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around SOP & DOM Access."
    ]
  }
})
