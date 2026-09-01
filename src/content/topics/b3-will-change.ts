import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "will-change",
  "whatIsIt": "will-change is a core Web Platform concept in Layout, Reflow, Paint & Compositing. It belongs to layout, reflow, paint, compositing, and GPU layers. Understanding will-change helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide will-change details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat will-change as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate will-change in B3.7 — Layout, Reflow, Paint & Compositing: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect will-change to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about will-change.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing will-change from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// will-change — minimal browser example\nconsole.log('[b3-will-change]', typeof document);\n// Open DevTools → verify behavior for: will-change\n// Spec reference: developer.mozilla.org (search \"will-change\")",
  "exampleCaption": "will-change — observe in DevTools while this runs",
  "internals": [
    "will-change is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for will-change can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether will-change succeeds in production."
  ],
  "takeaways": [
    "Locate will-change in B3.7 — Layout, Reflow, Paint & Compositing: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect will-change to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing will-change from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "will-change is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "will-change: Treat will-change as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate will-change in B3.7 — Layout, Reflow, Paint & Compositing: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect will-change to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing will-change from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "will-change",
      "will-change is a core Web Platform concept in Layout, Reflow, Paint & Compositing."
    ],
    [
      "Mental model",
      "Treat will-change as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing will-change from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate will-change in B3.7 — Layout, Reflow, Paint & Compositing: map it to MDN ",
      "Connect will-change to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is will-change in the browser and when do you use it?",
      "answerHint": "will-change is a core Web Platform concept in Layout, Reflow, Paint & Compositing. It belongs to layout, reflow, paint, compositing, and GPU layers. Understanding will-change helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain will-change with a DevTools observation and one pitfall.",
      "answerHint": "Locate will-change in B3.7 — Layout, Reflow, Paint & Compositing: map it to MDN reference docs and observe behavior in DevTools. Connect will-change to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about will-change. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing will-change from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain will-change in a senior frontend interview?",
      "answerHint": "will-change is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for will-change can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether will-change succeeds in production. // will-change — minimal browser example\nconsole.log('[b3-will-change]', typeof document);\n// Open DevTools → verify beh"
    }
  ],
  "pitfalls": [
    "Interview trap: describing will-change from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain will-change at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "will-change is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is will-change?",
      "When would will-change block rendering or fail cross-origin?",
      "What is the classic will-change interview trap?"
    ],
    "traps": [
      "Interview trap: describing will-change from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide will-change details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around will-change."
    ]
  }
})
