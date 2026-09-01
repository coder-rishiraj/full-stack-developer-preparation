import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "What Triggers Repaint",
  "whatIsIt": "What Triggers Repaint is a core Web Platform concept in Layout, Reflow, Paint & Compositing. It belongs to layout, reflow, paint, compositing, and GPU layers. Understanding What Triggers Repaint helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide what triggers repaint details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat What Triggers Repaint as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate What Triggers Repaint in B3.7 — Layout, Reflow, Paint & Compositing: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect What Triggers Repaint to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about what triggers repaint.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing What Triggers Repaint from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// What Triggers Repaint — minimal browser example\nconsole.log('[b3-repaint-triggers]', typeof document);\n// Open DevTools → verify behavior for: What Triggers Repaint\n// Spec reference: developer.mozilla.org (search \"What Triggers Repaint\")",
  "exampleCaption": "What Triggers Repaint — observe in DevTools while this runs",
  "internals": [
    "What Triggers Repaint is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for what triggers repaint can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether what triggers repaint succeeds in production."
  ],
  "takeaways": [
    "Locate What Triggers Repaint in B3.7 — Layout, Reflow, Paint & Compositing: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect What Triggers Repaint to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing What Triggers Repaint from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "What Triggers Repaint is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "What Triggers Repaint: Treat What Triggers Repaint as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate What Triggers Repaint in B3.7 — Layout, Reflow, Paint & Compositing: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect What Triggers Repaint to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing What Triggers Repaint from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "What Triggers Repaint",
      "What Triggers Repaint is a core Web Platform concept in Layout, Reflow, Paint & Compositing."
    ],
    [
      "Mental model",
      "Treat What Triggers Repaint as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing What Triggers Repaint from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate What Triggers Repaint in B3.7 — Layout, Reflow, Paint & Compositing: map ",
      "Connect What Triggers Repaint to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is What Triggers Repaint in the browser and when do you use it?",
      "answerHint": "What Triggers Repaint is a core Web Platform concept in Layout, Reflow, Paint & Compositing. It belongs to layout, reflow, paint, compositing, and GPU layers. Understanding What Triggers Repaint helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain What Triggers Repaint with a DevTools observation and one pitfall.",
      "answerHint": "Locate What Triggers Repaint in B3.7 — Layout, Reflow, Paint & Compositing: map it to MDN reference docs and observe behavior in DevTools. Connect What Triggers Repaint to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about what triggers repaint. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing What Triggers Repaint from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain What Triggers Repaint in a senior frontend interview?",
      "answerHint": "What Triggers Repaint is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for what triggers repaint can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether what triggers repaint succeeds in production. // What Triggers Repaint — minimal browser example\nconsole.log('[b3-repaint-triggers]', typeof document);\n// Open DevToo"
    }
  ],
  "pitfalls": [
    "Interview trap: describing What Triggers Repaint from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain What Triggers Repaint at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "What Triggers Repaint is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is What Triggers Repaint?",
      "When would What Triggers Repaint block rendering or fail cross-origin?",
      "What is the classic What Triggers Repaint interview trap?"
    ],
    "traps": [
      "Interview trap: describing What Triggers Repaint from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide what triggers repaint details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around What Triggers Repaint."
    ]
  }
})
