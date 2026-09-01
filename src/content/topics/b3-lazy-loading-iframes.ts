import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Lazy Loading iframes",
  "whatIsIt": "Lazy Loading iframes is a core Web Platform concept in Resource Loading & Performance. It belongs to browser performance metrics, Core Web Vitals, and profiling. Understanding Lazy Loading iframes helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide lazy loading iframes details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Lazy Loading iframes as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Lazy Loading iframes in B3.28 — Resource Loading & Performance: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Lazy Loading iframes to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about lazy loading iframes.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Lazy Loading iframes from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Lazy Loading iframes — minimal browser example\nconsole.log('[b3-lazy-loading-iframes]', typeof document);\n// Open DevTools → verify behavior for: Lazy Loading iframes\n// Spec reference: developer.mozilla.org (search \"Lazy Loading iframes\")",
  "exampleCaption": "Lazy Loading iframes — observe in DevTools while this runs",
  "internals": [
    "Lazy Loading iframes is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for lazy loading iframes can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether lazy loading iframes succeeds in production."
  ],
  "takeaways": [
    "Locate Lazy Loading iframes in B3.28 — Resource Loading & Performance: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Lazy Loading iframes to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Lazy Loading iframes from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Lazy Loading iframes is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Lazy Loading iframes: Treat Lazy Loading iframes as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Lazy Loading iframes in B3.28 — Resource Loading & Performance: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Lazy Loading iframes to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Lazy Loading iframes from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Lazy Loading iframes",
      "Lazy Loading iframes is a core Web Platform concept in Resource Loading & Performance."
    ],
    [
      "Mental model",
      "Treat Lazy Loading iframes as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Lazy Loading iframes from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Lazy Loading iframes in B3.28 — Resource Loading & Performance: map it to",
      "Connect Lazy Loading iframes to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Lazy Loading iframes in the browser and when do you use it?",
      "answerHint": "Lazy Loading iframes is a core Web Platform concept in Resource Loading & Performance. It belongs to browser performance metrics, Core Web Vitals, and profiling. Understanding Lazy Loading iframes helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Lazy Loading iframes with a DevTools observation and one pitfall.",
      "answerHint": "Locate Lazy Loading iframes in B3.28 — Resource Loading & Performance: map it to MDN reference docs and observe behavior in DevTools. Connect Lazy Loading iframes to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about lazy loading iframes. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Lazy Loading iframes from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Lazy Loading iframes in a senior frontend interview?",
      "answerHint": "Lazy Loading iframes is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for lazy loading iframes can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether lazy loading iframes succeeds in production. // Lazy Loading iframes — minimal browser example\nconsole.log('[b3-lazy-loading-iframes]', typeof document);\n// Open Dev"
    }
  ],
  "pitfalls": [
    "Interview trap: describing Lazy Loading iframes from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Lazy Loading iframes at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Lazy Loading iframes is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Lazy Loading iframes?",
      "When would Lazy Loading iframes block rendering or fail cross-origin?",
      "What is the classic Lazy Loading iframes interview trap?"
    ],
    "traps": [
      "Interview trap: describing Lazy Loading iframes from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide lazy loading iframes details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Lazy Loading iframes."
    ]
  }
})
