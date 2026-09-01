import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "rAF Callback Timing",
  "whatIsIt": "rAF Callback Timing is a core Web Platform concept in requestAnimationFrame. It belongs to requestAnimationFrame and frame-aligned updates. Understanding rAF Callback Timing helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide raf callback timing details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat rAF Callback Timing as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate rAF Callback Timing in B3.9 — requestAnimationFrame: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect rAF Callback Timing to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about raf callback timing.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing rAF Callback Timing from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// rAF Callback Timing — minimal browser example\nconsole.log('[b3-raf-callback-timing]', typeof document);\n// Open DevTools → verify behavior for: rAF Callback Timing\n// Spec reference: developer.mozilla.org (search \"rAF Callback Timing\")",
  "exampleCaption": "rAF Callback Timing — observe in DevTools while this runs",
  "internals": [
    "rAF Callback Timing is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for raf callback timing can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether raf callback timing succeeds in production."
  ],
  "takeaways": [
    "Locate rAF Callback Timing in B3.9 — requestAnimationFrame: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect rAF Callback Timing to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing rAF Callback Timing from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "rAF Callback Timing is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "rAF Callback Timing: Treat rAF Callback Timing as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate rAF Callback Timing in B3.9 — requestAnimationFrame: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect rAF Callback Timing to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing rAF Callback Timing from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "rAF Callback Timing",
      "rAF Callback Timing is a core Web Platform concept in requestAnimationFrame."
    ],
    [
      "Mental model",
      "Treat rAF Callback Timing as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing rAF Callback Timing from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate rAF Callback Timing in B3.9 — requestAnimationFrame: map it to MDN refere",
      "Connect rAF Callback Timing to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is rAF Callback Timing in the browser and when do you use it?",
      "answerHint": "rAF Callback Timing is a core Web Platform concept in requestAnimationFrame. It belongs to requestAnimationFrame and frame-aligned updates. Understanding rAF Callback Timing helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain rAF Callback Timing with a DevTools observation and one pitfall.",
      "answerHint": "Locate rAF Callback Timing in B3.9 — requestAnimationFrame: map it to MDN reference docs and observe behavior in DevTools. Connect rAF Callback Timing to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about raf callback timing. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing rAF Callback Timing from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain rAF Callback Timing in a senior frontend interview?",
      "answerHint": "rAF Callback Timing is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for raf callback timing can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether raf callback timing succeeds in production. // rAF Callback Timing — minimal browser example\nconsole.log('[b3-raf-callback-timing]', typeof document);\n// Open DevTo"
    }
  ],
  "pitfalls": [
    "Interview trap: describing rAF Callback Timing from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain rAF Callback Timing at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "rAF Callback Timing is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is rAF Callback Timing?",
      "When would rAF Callback Timing block rendering or fail cross-origin?",
      "What is the classic rAF Callback Timing interview trap?"
    ],
    "traps": [
      "Interview trap: describing rAF Callback Timing from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide raf callback timing details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around rAF Callback Timing."
    ]
  }
})
