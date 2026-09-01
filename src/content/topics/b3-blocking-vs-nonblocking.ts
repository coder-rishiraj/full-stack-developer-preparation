import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Blocking vs Non-Blocking Resources",
  "whatIsIt": "Blocking vs Non-Blocking Resources is a core Web Platform concept in Critical Rendering Path. It belongs to the critical rendering path from HTML/CSS to pixels. Understanding Blocking vs Non-Blocking Resources helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide blocking vs non-blocking resources details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Blocking vs Non-Blocking Resources as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Blocking vs Non-Blocking Resources in B3.6 — Critical Rendering Path: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Blocking vs Non-Blocking Resources to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about blocking vs non-blocking resources.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Blocking vs Non-Blocking Resources from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Blocking vs Non-Blocking Resources — minimal browser example\nconsole.log('[b3-blocking-vs-nonblocking]', typeof document);\n// Open DevTools → verify behavior for: Blocking vs Non-Blocking Resources\n// Spec reference: developer.mozilla.org (search \"Blocking vs Non-Blocking Resources\")",
  "exampleCaption": "Blocking vs Non-Blocking Resources — observe in DevTools while this runs",
  "internals": [
    "Blocking vs Non-Blocking Resources is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for blocking vs non-blocking resources can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether blocking vs non-blocking resources succeeds in production."
  ],
  "takeaways": [
    "Locate Blocking vs Non-Blocking Resources in B3.6 — Critical Rendering Path: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Blocking vs Non-Blocking Resources to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Blocking vs Non-Blocking Resources from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Blocking vs Non-Blocking Resources is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Blocking vs Non-Blocking Resources: Treat Blocking vs Non-Blocking Resources as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Blocking vs Non-Blocking Resources in B3.6 — Critical Rendering Path: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Blocking vs Non-Blocking Resources to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Blocking vs Non-Blocking Resources from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Blocking vs Non-Blocking Resources",
      "Blocking vs Non-Blocking Resources is a core Web Platform concept in Critical Rendering Path."
    ],
    [
      "Mental model",
      "Treat Blocking vs Non-Blocking Resources as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Blocking vs Non-Blocking Resources from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Blocking vs Non-Blocking Resources in B3.6 — Critical Rendering Path: map",
      "Connect Blocking vs Non-Blocking Resources to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Blocking vs Non-Blocking Resources in the browser and when do you use it?",
      "answerHint": "Blocking vs Non-Blocking Resources is a core Web Platform concept in Critical Rendering Path. It belongs to the critical rendering path from HTML/CSS to pixels. Understanding Blocking vs Non-Blocking Resources helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Blocking vs Non-Blocking Resources with a DevTools observation and one pitfall.",
      "answerHint": "Locate Blocking vs Non-Blocking Resources in B3.6 — Critical Rendering Path: map it to MDN reference docs and observe behavior in DevTools. Connect Blocking vs Non-Blocking Resources to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about blocking vs non-blocking resources. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Blocking vs Non-Blocking Resources from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Blocking vs Non-Blocking Resources in a senior frontend interview?",
      "answerHint": "Blocking vs Non-Blocking Resources is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for blocking vs non-blocking resources can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether blocking vs non-blocking resources succeeds in production. // Blocking vs Non-Blocking Resources — minimal browser example\nconsole.log('[b3-blocking-vs-nonblocking]', typeof docum"
    }
  ],
  "pitfalls": [
    "Interview trap: describing Blocking vs Non-Blocking Resources from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Blocking vs Non-Blocking Resources at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Blocking vs Non-Blocking Resources is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Blocking vs Non-Blocking Resources?",
      "When would Blocking vs Non-Blocking Resources block rendering or fail cross-origin?",
      "What is the classic Blocking vs Non-Blocking Resources interview trap?"
    ],
    "traps": [
      "Interview trap: describing Blocking vs Non-Blocking Resources from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide blocking vs non-blocking resources details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Blocking vs Non-Blocking Resources."
    ]
  }
})
