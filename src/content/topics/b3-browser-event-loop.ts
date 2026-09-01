import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Browser Event Loop",
  "whatIsIt": "Browser Event Loop is a core Web Platform concept in Browser Event Loop & Rendering. It belongs to browser task scheduling, microtasks, and rendering opportunities. Understanding Browser Event Loop helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide browser event loop details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Browser Event Loop as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Browser Event Loop in B3.8 — Browser Event Loop & Rendering: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Browser Event Loop to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about browser event loop.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Browser Event Loop from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Browser Event Loop — minimal browser example\nconsole.log('[b3-browser-event-loop]', typeof window);\n// Open DevTools → verify behavior for: Browser Event Loop\n// Spec reference: developer.mozilla.org (search \"Browser Event Loop\")",
  "exampleCaption": "Browser Event Loop — observe in DevTools while this runs",
  "internals": [
    "Browser Event Loop is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for browser event loop can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether browser event loop succeeds in production."
  ],
  "takeaways": [
    "Locate Browser Event Loop in B3.8 — Browser Event Loop & Rendering: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Browser Event Loop to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Browser Event Loop from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Browser Event Loop is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Browser Event Loop: Treat Browser Event Loop as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Browser Event Loop in B3.8 — Browser Event Loop & Rendering: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Browser Event Loop to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Browser Event Loop from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Browser Event Loop",
      "Browser Event Loop is a core Web Platform concept in Browser Event Loop & Rendering."
    ],
    [
      "Mental model",
      "Treat Browser Event Loop as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Browser Event Loop from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Browser Event Loop in B3.8 — Browser Event Loop & Rendering: map it to MD",
      "Connect Browser Event Loop to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Browser Event Loop in the browser and when do you use it?",
      "answerHint": "Browser Event Loop is a core Web Platform concept in Browser Event Loop & Rendering. It belongs to browser task scheduling, microtasks, and rendering opportunities. Understanding Browser Event Loop helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Browser Event Loop with a DevTools observation and one pitfall.",
      "answerHint": "Locate Browser Event Loop in B3.8 — Browser Event Loop & Rendering: map it to MDN reference docs and observe behavior in DevTools. Connect Browser Event Loop to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about browser event loop. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Browser Event Loop from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Browser Event Loop in a senior frontend interview?",
      "answerHint": "Browser Event Loop is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for browser event loop can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether browser event loop succeeds in production. // Browser Event Loop — minimal browser example\nconsole.log('[b3-browser-event-loop]', typeof window);\n// Open DevTools "
    }
  ],
  "pitfalls": [
    "Interview trap: describing Browser Event Loop from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Browser Event Loop at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Browser Event Loop is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Browser Event Loop?",
      "When would Browser Event Loop block rendering or fail cross-origin?",
      "What is the classic Browser Event Loop interview trap?"
    ],
    "traps": [
      "Interview trap: describing Browser Event Loop from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide browser event loop details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Browser Event Loop."
    ]
  }
})
