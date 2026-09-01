import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "querySelector / querySelectorAll",
  "whatIsIt": "querySelector / querySelectorAll is a core Web Platform concept in DOM Fundamentals. It belongs to the DOM tree, selection, manipulation, and traversal. Understanding querySelector / querySelectorAll helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide queryselector / queryselectorall details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat querySelector / querySelectorAll as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate querySelector / querySelectorAll in B3.3 — DOM Fundamentals: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect querySelector / querySelectorAll to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about queryselector / queryselectorall.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing querySelector / querySelectorAll from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// querySelector / querySelectorAll — minimal browser example\nconsole.log('[b3-queryselector]', typeof document);\n// Open DevTools → verify behavior for: querySelector / querySelectorAll\n// Spec reference: developer.mozilla.org (search \"querySelector / querySelectorAll\")",
  "exampleCaption": "querySelector / querySelectorAll — observe in DevTools while this runs",
  "internals": [
    "querySelector / querySelectorAll is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for queryselector / queryselectorall can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether queryselector / queryselectorall succeeds in production."
  ],
  "takeaways": [
    "Locate querySelector / querySelectorAll in B3.3 — DOM Fundamentals: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect querySelector / querySelectorAll to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing querySelector / querySelectorAll from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "querySelector / querySelectorAll is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "querySelector / querySelectorAll: Treat querySelector / querySelectorAll as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate querySelector / querySelectorAll in B3.3 — DOM Fundamentals: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect querySelector / querySelectorAll to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing querySelector / querySelectorAll from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "querySelector / querySelectorAll",
      "querySelector / querySelectorAll is a core Web Platform concept in DOM Fundamentals."
    ],
    [
      "Mental model",
      "Treat querySelector / querySelectorAll as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing querySelector / querySelectorAll from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate querySelector / querySelectorAll in B3.3 — DOM Fundamentals: map it to MD",
      "Connect querySelector / querySelectorAll to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is querySelector / querySelectorAll in the browser and when do you use it?",
      "answerHint": "querySelector / querySelectorAll is a core Web Platform concept in DOM Fundamentals. It belongs to the DOM tree, selection, manipulation, and traversal. Understanding querySelector / querySelectorAll helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain querySelector / querySelectorAll with a DevTools observation and one pitfall.",
      "answerHint": "Locate querySelector / querySelectorAll in B3.3 — DOM Fundamentals: map it to MDN reference docs and observe behavior in DevTools. Connect querySelector / querySelectorAll to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about queryselector / queryselectorall. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing querySelector / querySelectorAll from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain querySelector / querySelectorAll in a senior frontend interview?",
      "answerHint": "querySelector / querySelectorAll is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for queryselector / queryselectorall can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether queryselector / queryselectorall succeeds in production. // querySelector / querySelectorAll — minimal browser example\nconsole.log('[b3-queryselector]', typeof document);\n// Ope"
    }
  ],
  "pitfalls": [
    "Interview trap: describing querySelector / querySelectorAll from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain querySelector / querySelectorAll at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "querySelector / querySelectorAll is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is querySelector / querySelectorAll?",
      "When would querySelector / querySelectorAll block rendering or fail cross-origin?",
      "What is the classic querySelector / querySelectorAll interview trap?"
    ],
    "traps": [
      "Interview trap: describing querySelector / querySelectorAll from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide queryselector / queryselectorall details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around querySelector / querySelectorAll."
    ]
  }
})
