import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "content-visibility",
  "whatIsIt": "content-visibility is a core Web Platform concept in Critical Rendering Path. It belongs to the critical rendering path from HTML/CSS to pixels. Understanding content-visibility helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide content-visibility details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat content-visibility as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate content-visibility in B3.6 — Critical Rendering Path: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect content-visibility to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about content-visibility.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing content-visibility from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// content-visibility — minimal browser example\nconsole.log('[b3-content-visibility]', typeof document);\n// Open DevTools → verify behavior for: content-visibility\n// Spec reference: developer.mozilla.org (search \"content-visibility\")",
  "exampleCaption": "content-visibility — observe in DevTools while this runs",
  "internals": [
    "content-visibility is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for content-visibility can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether content-visibility succeeds in production."
  ],
  "takeaways": [
    "Locate content-visibility in B3.6 — Critical Rendering Path: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect content-visibility to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing content-visibility from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "content-visibility is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "content-visibility: Treat content-visibility as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate content-visibility in B3.6 — Critical Rendering Path: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect content-visibility to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing content-visibility from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "content-visibility",
      "content-visibility is a core Web Platform concept in Critical Rendering Path."
    ],
    [
      "Mental model",
      "Treat content-visibility as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing content-visibility from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate content-visibility in B3.6 — Critical Rendering Path: map it to MDN refer",
      "Connect content-visibility to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is content-visibility in the browser and when do you use it?",
      "answerHint": "content-visibility is a core Web Platform concept in Critical Rendering Path. It belongs to the critical rendering path from HTML/CSS to pixels. Understanding content-visibility helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain content-visibility with a DevTools observation and one pitfall.",
      "answerHint": "Locate content-visibility in B3.6 — Critical Rendering Path: map it to MDN reference docs and observe behavior in DevTools. Connect content-visibility to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about content-visibility. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing content-visibility from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain content-visibility in a senior frontend interview?",
      "answerHint": "content-visibility is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for content-visibility can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether content-visibility succeeds in production. // content-visibility — minimal browser example\nconsole.log('[b3-content-visibility]', typeof document);\n// Open DevTool"
    }
  ],
  "pitfalls": [
    "Interview trap: describing content-visibility from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain content-visibility at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "content-visibility is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is content-visibility?",
      "When would content-visibility block rendering or fail cross-origin?",
      "What is the classic content-visibility interview trap?"
    ],
    "traps": [
      "Interview trap: describing content-visibility from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide content-visibility details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around content-visibility."
    ]
  }
})
