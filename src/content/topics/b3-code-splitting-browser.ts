import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Code Splitting in the Browser",
  "whatIsIt": "Code Splitting in the Browser is a core Web Platform concept in Resource Loading & Performance. It belongs to browser performance metrics, Core Web Vitals, and profiling. Understanding Code Splitting in the Browser helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide code splitting in the browser details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Code Splitting in the Browser as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Code Splitting in the Browser in B3.28 — Resource Loading & Performance: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Code Splitting in the Browser to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about code splitting in the browser.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Code Splitting in the Browser from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Code Splitting in the Browser — minimal browser example\nconsole.log('[b3-code-splitting-browser]', typeof document);\n// Open DevTools → verify behavior for: Code Splitting in the Browser\n// Spec reference: developer.mozilla.org (search \"Code Splitting in the Browser\")",
  "exampleCaption": "Code Splitting in the Browser — observe in DevTools while this runs",
  "internals": [
    "Code Splitting in the Browser is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for code splitting in the browser can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether code splitting in the browser succeeds in production."
  ],
  "takeaways": [
    "Locate Code Splitting in the Browser in B3.28 — Resource Loading & Performance: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Code Splitting in the Browser to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Code Splitting in the Browser from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Code Splitting in the Browser is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Code Splitting in the Browser: Treat Code Splitting in the Browser as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Code Splitting in the Browser in B3.28 — Resource Loading & Performance: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Code Splitting in the Browser to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Code Splitting in the Browser from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Code Splitting in the Browser",
      "Code Splitting in the Browser is a core Web Platform concept in Resource Loading & Performance."
    ],
    [
      "Mental model",
      "Treat Code Splitting in the Browser as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Code Splitting in the Browser from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Code Splitting in the Browser in B3.28 — Resource Loading & Performance: ",
      "Connect Code Splitting in the Browser to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Code Splitting in the Browser in the browser and when do you use it?",
      "answerHint": "Code Splitting in the Browser is a core Web Platform concept in Resource Loading & Performance. It belongs to browser performance metrics, Core Web Vitals, and profiling. Understanding Code Splitting in the Browser helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Code Splitting in the Browser with a DevTools observation and one pitfall.",
      "answerHint": "Locate Code Splitting in the Browser in B3.28 — Resource Loading & Performance: map it to MDN reference docs and observe behavior in DevTools. Connect Code Splitting in the Browser to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about code splitting in the browser. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Code Splitting in the Browser from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Code Splitting in the Browser in a senior frontend interview?",
      "answerHint": "Code Splitting in the Browser is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for code splitting in the browser can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether code splitting in the browser succeeds in production. // Code Splitting in the Browser — minimal browser example\nconsole.log('[b3-code-splitting-browser]', typeof document);\n"
    }
  ],
  "pitfalls": [
    "Interview trap: describing Code Splitting in the Browser from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Code Splitting in the Browser at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Code Splitting in the Browser is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Code Splitting in the Browser?",
      "When would Code Splitting in the Browser block rendering or fail cross-origin?",
      "What is the classic Code Splitting in the Browser interview trap?"
    ],
    "traps": [
      "Interview trap: describing Code Splitting in the Browser from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide code splitting in the browser details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Code Splitting in the Browser."
    ]
  }
})
