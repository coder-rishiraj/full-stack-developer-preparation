import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Flexbox & Grid Layout",
  "whatIsIt": "Flexbox & Grid Layout is a core Web Platform concept in Layout, Reflow, Paint & Compositing. It belongs to layout, reflow, paint, compositing, and GPU layers. Understanding Flexbox & Grid Layout helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide flexbox & grid layout details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Flexbox & Grid Layout as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Flexbox & Grid Layout in B3.7 — Layout, Reflow, Paint & Compositing: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Flexbox & Grid Layout to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about flexbox & grid layout.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Flexbox & Grid Layout from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Flexbox & Grid Layout — minimal browser example\nconsole.log('[b3-layout-flex-grid]', typeof document);\n// Open DevTools → verify behavior for: Flexbox & Grid Layout\n// Spec reference: developer.mozilla.org (search \"Flexbox & Grid Layout\")",
  "exampleCaption": "Flexbox & Grid Layout — observe in DevTools while this runs",
  "internals": [
    "Flexbox & Grid Layout is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for flexbox & grid layout can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether flexbox & grid layout succeeds in production."
  ],
  "takeaways": [
    "Locate Flexbox & Grid Layout in B3.7 — Layout, Reflow, Paint & Compositing: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Flexbox & Grid Layout to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Flexbox & Grid Layout from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Flexbox & Grid Layout is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Flexbox & Grid Layout: Treat Flexbox & Grid Layout as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Flexbox & Grid Layout in B3.7 — Layout, Reflow, Paint & Compositing: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Flexbox & Grid Layout to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Flexbox & Grid Layout from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Flexbox & Grid Layout",
      "Flexbox & Grid Layout is a core Web Platform concept in Layout, Reflow, Paint & Compositing."
    ],
    [
      "Mental model",
      "Treat Flexbox & Grid Layout as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Flexbox & Grid Layout from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Flexbox & Grid Layout in B3.7 — Layout, Reflow, Paint & Compositing: map ",
      "Connect Flexbox & Grid Layout to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Flexbox & Grid Layout in the browser and when do you use it?",
      "answerHint": "Flexbox & Grid Layout is a core Web Platform concept in Layout, Reflow, Paint & Compositing. It belongs to layout, reflow, paint, compositing, and GPU layers. Understanding Flexbox & Grid Layout helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Flexbox & Grid Layout with a DevTools observation and one pitfall.",
      "answerHint": "Locate Flexbox & Grid Layout in B3.7 — Layout, Reflow, Paint & Compositing: map it to MDN reference docs and observe behavior in DevTools. Connect Flexbox & Grid Layout to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about flexbox & grid layout. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Flexbox & Grid Layout from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Flexbox & Grid Layout in a senior frontend interview?",
      "answerHint": "Flexbox & Grid Layout is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for flexbox & grid layout can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether flexbox & grid layout succeeds in production. // Flexbox & Grid Layout — minimal browser example\nconsole.log('[b3-layout-flex-grid]', typeof document);\n// Open DevToo"
    }
  ],
  "pitfalls": [
    "Interview trap: describing Flexbox & Grid Layout from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Flexbox & Grid Layout at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Flexbox & Grid Layout is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Flexbox & Grid Layout?",
      "When would Flexbox & Grid Layout block rendering or fail cross-origin?",
      "What is the classic Flexbox & Grid Layout interview trap?"
    ],
    "traps": [
      "Interview trap: describing Flexbox & Grid Layout from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide flexbox & grid layout details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Flexbox & Grid Layout."
    ]
  }
})
