import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Bundle Size & Tree Shaking Impact",
  "whatIsIt": "Bundle Size & Tree Shaking Impact is a core Web Platform concept in Resource Loading & Performance. It belongs to browser performance metrics, Core Web Vitals, and profiling. Understanding Bundle Size & Tree Shaking Impact helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide bundle size & tree shaking impact details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Bundle Size & Tree Shaking Impact as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Bundle Size & Tree Shaking Impact in B3.28 — Resource Loading & Performance: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Bundle Size & Tree Shaking Impact to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about bundle size & tree shaking impact.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Bundle Size & Tree Shaking Impact from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Bundle Size & Tree Shaking Impact — minimal browser example\nconsole.log('[b3-bundle-size]', typeof document);\n// Open DevTools → verify behavior for: Bundle Size & Tree Shaking Impact\n// Spec reference: developer.mozilla.org (search \"Bundle Size & Tree Shaking Impact\")",
  "exampleCaption": "Bundle Size & Tree Shaking Impact — observe in DevTools while this runs",
  "internals": [
    "Bundle Size & Tree Shaking Impact is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for bundle size & tree shaking impact can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether bundle size & tree shaking impact succeeds in production."
  ],
  "takeaways": [
    "Locate Bundle Size & Tree Shaking Impact in B3.28 — Resource Loading & Performance: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Bundle Size & Tree Shaking Impact to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Bundle Size & Tree Shaking Impact from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Bundle Size & Tree Shaking Impact is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Bundle Size & Tree Shaking Impact: Treat Bundle Size & Tree Shaking Impact as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Bundle Size & Tree Shaking Impact in B3.28 — Resource Loading & Performance: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Bundle Size & Tree Shaking Impact to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Bundle Size & Tree Shaking Impact from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Bundle Size & Tree Shaking Impact",
      "Bundle Size & Tree Shaking Impact is a core Web Platform concept in Resource Loading & Performance."
    ],
    [
      "Mental model",
      "Treat Bundle Size & Tree Shaking Impact as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Bundle Size & Tree Shaking Impact from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Bundle Size & Tree Shaking Impact in B3.28 — Resource Loading & Performan",
      "Connect Bundle Size & Tree Shaking Impact to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Bundle Size & Tree Shaking Impact in the browser and when do you use it?",
      "answerHint": "Bundle Size & Tree Shaking Impact is a core Web Platform concept in Resource Loading & Performance. It belongs to browser performance metrics, Core Web Vitals, and profiling. Understanding Bundle Size & Tree Shaking Impact helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Bundle Size & Tree Shaking Impact with a DevTools observation and one pitfall.",
      "answerHint": "Locate Bundle Size & Tree Shaking Impact in B3.28 — Resource Loading & Performance: map it to MDN reference docs and observe behavior in DevTools. Connect Bundle Size & Tree Shaking Impact to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about bundle size & tree shaking impact. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Bundle Size & Tree Shaking Impact from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Bundle Size & Tree Shaking Impact in a senior frontend interview?",
      "answerHint": "Bundle Size & Tree Shaking Impact is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for bundle size & tree shaking impact can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether bundle size & tree shaking impact succeeds in production. // Bundle Size & Tree Shaking Impact — minimal browser example\nconsole.log('[b3-bundle-size]', typeof document);\n// Open"
    }
  ],
  "pitfalls": [
    "Interview trap: describing Bundle Size & Tree Shaking Impact from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Bundle Size & Tree Shaking Impact at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Bundle Size & Tree Shaking Impact is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Bundle Size & Tree Shaking Impact?",
      "When would Bundle Size & Tree Shaking Impact block rendering or fail cross-origin?",
      "What is the classic Bundle Size & Tree Shaking Impact interview trap?"
    ],
    "traps": [
      "Interview trap: describing Bundle Size & Tree Shaking Impact from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide bundle size & tree shaking impact details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Bundle Size & Tree Shaking Impact."
    ]
  }
})
