import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Layout Thrashing",
  "whatIsIt": "Layout Thrashing is a core Web Platform concept in Layout, Reflow, Paint & Compositing. It belongs to layout, reflow, paint, compositing, and GPU layers. Understanding Layout Thrashing helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide layout thrashing details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Layout Thrashing as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Layout Thrashing in B3.7 — Layout, Reflow, Paint & Compositing: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Layout Thrashing to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about layout thrashing.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Layout Thrashing from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Layout Thrashing — minimal browser example\nconsole.log('[b3-layout-thrashing]', typeof document);\n// Open DevTools → verify behavior for: Layout Thrashing\n// Spec reference: developer.mozilla.org (search \"Layout Thrashing\")",
  "exampleCaption": "Layout Thrashing — observe in DevTools while this runs",
  "internals": [
    "Layout Thrashing is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for layout thrashing can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether layout thrashing succeeds in production."
  ],
  "takeaways": [
    "Locate Layout Thrashing in B3.7 — Layout, Reflow, Paint & Compositing: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Layout Thrashing to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Layout Thrashing from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Layout Thrashing is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Layout Thrashing: Treat Layout Thrashing as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Layout Thrashing in B3.7 — Layout, Reflow, Paint & Compositing: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Layout Thrashing to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Layout Thrashing from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Layout Thrashing",
      "Layout Thrashing is a core Web Platform concept in Layout, Reflow, Paint & Compositing."
    ],
    [
      "Mental model",
      "Treat Layout Thrashing as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Layout Thrashing from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Layout Thrashing in B3.7 — Layout, Reflow, Paint & Compositing: map it to",
      "Connect Layout Thrashing to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Layout Thrashing in the browser and when do you use it?",
      "answerHint": "Layout Thrashing is a core Web Platform concept in Layout, Reflow, Paint & Compositing. It belongs to layout, reflow, paint, compositing, and GPU layers. Understanding Layout Thrashing helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Layout Thrashing with a DevTools observation and one pitfall.",
      "answerHint": "Locate Layout Thrashing in B3.7 — Layout, Reflow, Paint & Compositing: map it to MDN reference docs and observe behavior in DevTools. Connect Layout Thrashing to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about layout thrashing. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Layout Thrashing from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Layout Thrashing in a senior frontend interview?",
      "answerHint": "Layout Thrashing is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for layout thrashing can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether layout thrashing succeeds in production. // Layout Thrashing — minimal browser example\nconsole.log('[b3-layout-thrashing]', typeof document);\n// Open DevTools → "
    }
  ],
  "pitfalls": [
    "Interview trap: describing Layout Thrashing from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Layout Thrashing at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Layout Thrashing is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Layout Thrashing?",
      "When would Layout Thrashing block rendering or fail cross-origin?",
      "What is the classic Layout Thrashing interview trap?"
    ],
    "traps": [
      "Interview trap: describing Layout Thrashing from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide layout thrashing details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Layout Thrashing."
    ]
  }
})
