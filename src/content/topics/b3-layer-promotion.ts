import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Layer Promotion & Demotion",
  "whatIsIt": "Layer Promotion & Demotion is a core Web Platform concept in Layout, Reflow, Paint & Compositing. It belongs to layout, reflow, paint, compositing, and GPU layers. Understanding Layer Promotion & Demotion helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide layer promotion & demotion details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Layer Promotion & Demotion as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Layer Promotion & Demotion in B3.7 — Layout, Reflow, Paint & Compositing: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Layer Promotion & Demotion to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about layer promotion & demotion.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Layer Promotion & Demotion from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Layer Promotion & Demotion — minimal browser example\nconsole.log('[b3-layer-promotion]', typeof document);\n// Open DevTools → verify behavior for: Layer Promotion & Demotion\n// Spec reference: developer.mozilla.org (search \"Layer Promotion & Demotion\")",
  "exampleCaption": "Layer Promotion & Demotion — observe in DevTools while this runs",
  "internals": [
    "Layer Promotion & Demotion is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for layer promotion & demotion can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether layer promotion & demotion succeeds in production."
  ],
  "takeaways": [
    "Locate Layer Promotion & Demotion in B3.7 — Layout, Reflow, Paint & Compositing: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Layer Promotion & Demotion to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Layer Promotion & Demotion from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Layer Promotion & Demotion is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Layer Promotion & Demotion: Treat Layer Promotion & Demotion as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Layer Promotion & Demotion in B3.7 — Layout, Reflow, Paint & Compositing: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Layer Promotion & Demotion to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Layer Promotion & Demotion from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Layer Promotion & Demotion",
      "Layer Promotion & Demotion is a core Web Platform concept in Layout, Reflow, Paint & Compositing."
    ],
    [
      "Mental model",
      "Treat Layer Promotion & Demotion as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Layer Promotion & Demotion from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Layer Promotion & Demotion in B3.7 — Layout, Reflow, Paint & Compositing:",
      "Connect Layer Promotion & Demotion to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Layer Promotion & Demotion in the browser and when do you use it?",
      "answerHint": "Layer Promotion & Demotion is a core Web Platform concept in Layout, Reflow, Paint & Compositing. It belongs to layout, reflow, paint, compositing, and GPU layers. Understanding Layer Promotion & Demotion helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Layer Promotion & Demotion with a DevTools observation and one pitfall.",
      "answerHint": "Locate Layer Promotion & Demotion in B3.7 — Layout, Reflow, Paint & Compositing: map it to MDN reference docs and observe behavior in DevTools. Connect Layer Promotion & Demotion to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about layer promotion & demotion. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Layer Promotion & Demotion from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Layer Promotion & Demotion in a senior frontend interview?",
      "answerHint": "Layer Promotion & Demotion is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for layer promotion & demotion can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether layer promotion & demotion succeeds in production. // Layer Promotion & Demotion — minimal browser example\nconsole.log('[b3-layer-promotion]', typeof document);\n// Open De"
    }
  ],
  "pitfalls": [
    "Interview trap: describing Layer Promotion & Demotion from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Layer Promotion & Demotion at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Layer Promotion & Demotion is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Layer Promotion & Demotion?",
      "When would Layer Promotion & Demotion block rendering or fail cross-origin?",
      "What is the classic Layer Promotion & Demotion interview trap?"
    ],
    "traps": [
      "Interview trap: describing Layer Promotion & Demotion from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide layer promotion & demotion details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Layer Promotion & Demotion."
    ]
  }
})
