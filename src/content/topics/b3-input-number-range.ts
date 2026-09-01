import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "number / range",
  "whatIsIt": "number / range is a core Web Platform concept in Forms & Browser Input. It belongs to HTML forms, FormData, and constraint validation. Understanding number / range helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide number / range details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat number / range as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate number / range in B3.32 — Forms & Browser Input: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect number / range to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about number / range.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing number / range from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// number / range — minimal browser example\nconsole.log('[b3-input-number-range]', typeof document);\n// Open DevTools → verify behavior for: number / range\n// Spec reference: developer.mozilla.org (search \"number / range\")",
  "exampleCaption": "number / range — observe in DevTools while this runs",
  "internals": [
    "number / range is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for number / range can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether number / range succeeds in production."
  ],
  "takeaways": [
    "Locate number / range in B3.32 — Forms & Browser Input: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect number / range to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing number / range from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "number / range is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "number / range: Treat number / range as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate number / range in B3.32 — Forms & Browser Input: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect number / range to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing number / range from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "number / range",
      "number / range is a core Web Platform concept in Forms & Browser Input."
    ],
    [
      "Mental model",
      "Treat number / range as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing number / range from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate number / range in B3.32 — Forms & Browser Input: map it to MDN reference ",
      "Connect number / range to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is number / range in the browser and when do you use it?",
      "answerHint": "number / range is a core Web Platform concept in Forms & Browser Input. It belongs to HTML forms, FormData, and constraint validation. Understanding number / range helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain number / range with a DevTools observation and one pitfall.",
      "answerHint": "Locate number / range in B3.32 — Forms & Browser Input: map it to MDN reference docs and observe behavior in DevTools. Connect number / range to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about number / range. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing number / range from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain number / range in a senior frontend interview?",
      "answerHint": "number / range is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for number / range can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether number / range succeeds in production. // number / range — minimal browser example\nconsole.log('[b3-input-number-range]', typeof document);\n// Open DevTools → "
    }
  ],
  "pitfalls": [
    "Interview trap: describing number / range from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain number / range at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "number / range is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is number / range?",
      "When would number / range block rendering or fail cross-origin?",
      "What is the classic number / range interview trap?"
    ],
    "traps": [
      "Interview trap: describing number / range from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide number / range details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around number / range."
    ]
  }
})
