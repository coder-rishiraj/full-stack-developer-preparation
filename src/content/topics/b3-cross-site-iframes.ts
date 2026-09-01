import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Cross-Site iframe Process Boundaries",
  "whatIsIt": "Cross-Site iframe Process Boundaries is a core Web Platform concept in Browser Architecture. It belongs to browser processes, threads, and navigation lifecycle. Understanding Cross-Site iframe Process Boundaries helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide cross-site iframe process boundaries details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Cross-Site iframe Process Boundaries as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Cross-Site iframe Process Boundaries in B3.1 — Browser Architecture: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Cross-Site iframe Process Boundaries to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about cross-site iframe process boundaries.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Cross-Site iframe Process Boundaries from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Cross-Site iframe Process Boundaries — minimal browser example\nconsole.log('[b3-cross-site-iframes]', typeof document);\n// Open DevTools → verify behavior for: Cross-Site iframe Process Boundaries\n// Spec reference: developer.mozilla.org (search \"Cross-Site iframe Process Boundaries\")",
  "exampleCaption": "Cross-Site iframe Process Boundaries — observe in DevTools while this runs",
  "internals": [
    "Cross-Site iframe Process Boundaries is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for cross-site iframe process boundaries can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether cross-site iframe process boundaries succeeds in production."
  ],
  "takeaways": [
    "Locate Cross-Site iframe Process Boundaries in B3.1 — Browser Architecture: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Cross-Site iframe Process Boundaries to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Cross-Site iframe Process Boundaries from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Cross-Site iframe Process Boundaries is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Cross-Site iframe Process Boundaries: Treat Cross-Site iframe Process Boundaries as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Cross-Site iframe Process Boundaries in B3.1 — Browser Architecture: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Cross-Site iframe Process Boundaries to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Cross-Site iframe Process Boundaries from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Cross-Site iframe Process Boundaries",
      "Cross-Site iframe Process Boundaries is a core Web Platform concept in Browser Architecture."
    ],
    [
      "Mental model",
      "Treat Cross-Site iframe Process Boundaries as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Cross-Site iframe Process Boundaries from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Cross-Site iframe Process Boundaries in B3.1 — Browser Architecture: map ",
      "Connect Cross-Site iframe Process Boundaries to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Cross-Site iframe Process Boundaries in the browser and when do you use it?",
      "answerHint": "Cross-Site iframe Process Boundaries is a core Web Platform concept in Browser Architecture. It belongs to browser processes, threads, and navigation lifecycle. Understanding Cross-Site iframe Process Boundaries helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Cross-Site iframe Process Boundaries with a DevTools observation and one pitfall.",
      "answerHint": "Locate Cross-Site iframe Process Boundaries in B3.1 — Browser Architecture: map it to MDN reference docs and observe behavior in DevTools. Connect Cross-Site iframe Process Boundaries to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about cross-site iframe process boundaries. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Cross-Site iframe Process Boundaries from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Cross-Site iframe Process Boundaries in a senior frontend interview?",
      "answerHint": "Cross-Site iframe Process Boundaries is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for cross-site iframe process boundaries can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether cross-site iframe process boundaries succeeds in production. // Cross-Site iframe Process Boundaries — minimal browser example\nconsole.log('[b3-cross-site-iframes]', typeof document"
    }
  ],
  "pitfalls": [
    "Interview trap: describing Cross-Site iframe Process Boundaries from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Cross-Site iframe Process Boundaries at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Cross-Site iframe Process Boundaries is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Cross-Site iframe Process Boundaries?",
      "When would Cross-Site iframe Process Boundaries block rendering or fail cross-origin?",
      "What is the classic Cross-Site iframe Process Boundaries interview trap?"
    ],
    "traps": [
      "Interview trap: describing Cross-Site iframe Process Boundaries from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide cross-site iframe process boundaries details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Cross-Site iframe Process Boundaries."
    ]
  }
})
