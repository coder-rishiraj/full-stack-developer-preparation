import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "SOP & Network Access",
  "whatIsIt": "SOP & Network Access is a core Web Platform concept in Same-Origin Policy. It belongs to the Same-Origin Policy and cross-origin restrictions. Understanding SOP & Network Access helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide sop & network access details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat SOP & Network Access as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate SOP & Network Access in B3.13 — Same-Origin Policy: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect SOP & Network Access to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about sop & network access.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing SOP & Network Access from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// SOP & Network Access — minimal browser example\nconsole.log('[b3-sop-network-access]', typeof document);\n// Open DevTools → verify behavior for: SOP & Network Access\n// Spec reference: developer.mozilla.org (search \"SOP & Network Access\")",
  "exampleCaption": "SOP & Network Access — observe in DevTools while this runs",
  "internals": [
    "SOP & Network Access is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for sop & network access can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether sop & network access succeeds in production."
  ],
  "takeaways": [
    "Locate SOP & Network Access in B3.13 — Same-Origin Policy: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect SOP & Network Access to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing SOP & Network Access from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "SOP & Network Access is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "SOP & Network Access: Treat SOP & Network Access as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate SOP & Network Access in B3.13 — Same-Origin Policy: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect SOP & Network Access to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing SOP & Network Access from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "SOP & Network Access",
      "SOP & Network Access is a core Web Platform concept in Same-Origin Policy."
    ],
    [
      "Mental model",
      "Treat SOP & Network Access as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing SOP & Network Access from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate SOP & Network Access in B3.13 — Same-Origin Policy: map it to MDN referen",
      "Connect SOP & Network Access to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is SOP & Network Access in the browser and when do you use it?",
      "answerHint": "SOP & Network Access is a core Web Platform concept in Same-Origin Policy. It belongs to the Same-Origin Policy and cross-origin restrictions. Understanding SOP & Network Access helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain SOP & Network Access with a DevTools observation and one pitfall.",
      "answerHint": "Locate SOP & Network Access in B3.13 — Same-Origin Policy: map it to MDN reference docs and observe behavior in DevTools. Connect SOP & Network Access to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about sop & network access. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing SOP & Network Access from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain SOP & Network Access in a senior frontend interview?",
      "answerHint": "SOP & Network Access is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for sop & network access can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether sop & network access succeeds in production. // SOP & Network Access — minimal browser example\nconsole.log('[b3-sop-network-access]', typeof document);\n// Open DevTo"
    }
  ],
  "pitfalls": [
    "Interview trap: describing SOP & Network Access from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain SOP & Network Access at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "SOP & Network Access is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is SOP & Network Access?",
      "When would SOP & Network Access block rendering or fail cross-origin?",
      "What is the classic SOP & Network Access interview trap?"
    ],
    "traps": [
      "Interview trap: describing SOP & Network Access from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide sop & network access details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around SOP & Network Access."
    ]
  }
})
