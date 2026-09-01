import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Cross-Origin Isolation",
  "whatIsIt": "Cross-Origin Isolation is a core Web Platform concept in Same-Origin Policy. It belongs to the Same-Origin Policy and cross-origin restrictions. Understanding Cross-Origin Isolation helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide cross-origin isolation details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Cross-Origin Isolation as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Cross-Origin Isolation in B3.13 — Same-Origin Policy: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Cross-Origin Isolation to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about cross-origin isolation.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Cross-Origin Isolation from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Cross-Origin Isolation — minimal browser example\nconsole.log('[b3-cross-origin-isolation]', typeof document);\n// Open DevTools → verify behavior for: Cross-Origin Isolation\n// Spec reference: developer.mozilla.org (search \"Cross-Origin Isolation\")",
  "exampleCaption": "Cross-Origin Isolation — observe in DevTools while this runs",
  "internals": [
    "Cross-Origin Isolation is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for cross-origin isolation can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether cross-origin isolation succeeds in production."
  ],
  "takeaways": [
    "Locate Cross-Origin Isolation in B3.13 — Same-Origin Policy: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Cross-Origin Isolation to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Cross-Origin Isolation from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Cross-Origin Isolation is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Cross-Origin Isolation: Treat Cross-Origin Isolation as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Cross-Origin Isolation in B3.13 — Same-Origin Policy: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Cross-Origin Isolation to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Cross-Origin Isolation from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Cross-Origin Isolation",
      "Cross-Origin Isolation is a core Web Platform concept in Same-Origin Policy."
    ],
    [
      "Mental model",
      "Treat Cross-Origin Isolation as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Cross-Origin Isolation from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Cross-Origin Isolation in B3.13 — Same-Origin Policy: map it to MDN refer",
      "Connect Cross-Origin Isolation to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Cross-Origin Isolation in the browser and when do you use it?",
      "answerHint": "Cross-Origin Isolation is a core Web Platform concept in Same-Origin Policy. It belongs to the Same-Origin Policy and cross-origin restrictions. Understanding Cross-Origin Isolation helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Cross-Origin Isolation with a DevTools observation and one pitfall.",
      "answerHint": "Locate Cross-Origin Isolation in B3.13 — Same-Origin Policy: map it to MDN reference docs and observe behavior in DevTools. Connect Cross-Origin Isolation to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about cross-origin isolation. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Cross-Origin Isolation from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Cross-Origin Isolation in a senior frontend interview?",
      "answerHint": "Cross-Origin Isolation is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for cross-origin isolation can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether cross-origin isolation succeeds in production. // Cross-Origin Isolation — minimal browser example\nconsole.log('[b3-cross-origin-isolation]', typeof document);\n// Open"
    }
  ],
  "pitfalls": [
    "Interview trap: describing Cross-Origin Isolation from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Cross-Origin Isolation at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Cross-Origin Isolation is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Cross-Origin Isolation?",
      "When would Cross-Origin Isolation block rendering or fail cross-origin?",
      "What is the classic Cross-Origin Isolation interview trap?"
    ],
    "traps": [
      "Interview trap: describing Cross-Origin Isolation from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide cross-origin isolation details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Cross-Origin Isolation."
    ]
  }
})
