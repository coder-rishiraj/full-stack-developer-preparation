import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "requestIdleCallback",
  "whatIsIt": "requestIdleCallback is a core Web Platform concept in Browser Event Loop & Rendering. It belongs to browser task scheduling, microtasks, and rendering opportunities. Understanding requestIdleCallback helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide requestidlecallback details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat requestIdleCallback as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate requestIdleCallback in B3.8 — Browser Event Loop & Rendering: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect requestIdleCallback to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about requestidlecallback.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing requestIdleCallback from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// requestIdleCallback — minimal browser example\nconsole.log('[b3-idle-callback]', typeof document);\n// Open DevTools → verify behavior for: requestIdleCallback\n// Spec reference: developer.mozilla.org (search \"requestIdleCallback\")",
  "exampleCaption": "requestIdleCallback — observe in DevTools while this runs",
  "internals": [
    "requestIdleCallback is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for requestidlecallback can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether requestidlecallback succeeds in production."
  ],
  "takeaways": [
    "Locate requestIdleCallback in B3.8 — Browser Event Loop & Rendering: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect requestIdleCallback to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing requestIdleCallback from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "requestIdleCallback is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "requestIdleCallback: Treat requestIdleCallback as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate requestIdleCallback in B3.8 — Browser Event Loop & Rendering: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect requestIdleCallback to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing requestIdleCallback from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "requestIdleCallback",
      "requestIdleCallback is a core Web Platform concept in Browser Event Loop & Rendering."
    ],
    [
      "Mental model",
      "Treat requestIdleCallback as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing requestIdleCallback from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate requestIdleCallback in B3.8 — Browser Event Loop & Rendering: map it to M",
      "Connect requestIdleCallback to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is requestIdleCallback in the browser and when do you use it?",
      "answerHint": "requestIdleCallback is a core Web Platform concept in Browser Event Loop & Rendering. It belongs to browser task scheduling, microtasks, and rendering opportunities. Understanding requestIdleCallback helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain requestIdleCallback with a DevTools observation and one pitfall.",
      "answerHint": "Locate requestIdleCallback in B3.8 — Browser Event Loop & Rendering: map it to MDN reference docs and observe behavior in DevTools. Connect requestIdleCallback to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about requestidlecallback. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing requestIdleCallback from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain requestIdleCallback in a senior frontend interview?",
      "answerHint": "requestIdleCallback is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for requestidlecallback can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether requestidlecallback succeeds in production. // requestIdleCallback — minimal browser example\nconsole.log('[b3-idle-callback]', typeof document);\n// Open DevTools → "
    }
  ],
  "pitfalls": [
    "Interview trap: describing requestIdleCallback from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain requestIdleCallback at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "requestIdleCallback is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is requestIdleCallback?",
      "When would requestIdleCallback block rendering or fail cross-origin?",
      "What is the classic requestIdleCallback interview trap?"
    ],
    "traps": [
      "Interview trap: describing requestIdleCallback from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide requestidlecallback details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around requestIdleCallback."
    ]
  }
})
