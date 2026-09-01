import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Memory Panel",
  "whatIsIt": "Memory Panel is a core Web Platform concept in Browser Developer Tools. It belongs to Chrome DevTools panels for frontend debugging. Understanding Memory Panel helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide memory panel details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Memory Panel as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Memory Panel in B3.36 — Browser Developer Tools: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Memory Panel to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about memory panel.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Memory Panel from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Memory Panel — minimal browser example\nconsole.log('[b3-devtools-memory]', typeof document);\n// Open DevTools → verify behavior for: Memory Panel\n// Spec reference: developer.mozilla.org (search \"Memory Panel\")",
  "exampleCaption": "Memory Panel — observe in DevTools while this runs",
  "internals": [
    "Memory Panel is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for memory panel can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether memory panel succeeds in production."
  ],
  "takeaways": [
    "Locate Memory Panel in B3.36 — Browser Developer Tools: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Memory Panel to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Memory Panel from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Memory Panel is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Memory Panel: Treat Memory Panel as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Memory Panel in B3.36 — Browser Developer Tools: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Memory Panel to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Memory Panel from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Memory Panel",
      "Memory Panel is a core Web Platform concept in Browser Developer Tools."
    ],
    [
      "Mental model",
      "Treat Memory Panel as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Memory Panel from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Memory Panel in B3.36 — Browser Developer Tools: map it to MDN reference ",
      "Connect Memory Panel to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Memory Panel in the browser and when do you use it?",
      "answerHint": "Memory Panel is a core Web Platform concept in Browser Developer Tools. It belongs to Chrome DevTools panels for frontend debugging. Understanding Memory Panel helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Memory Panel with a DevTools observation and one pitfall.",
      "answerHint": "Locate Memory Panel in B3.36 — Browser Developer Tools: map it to MDN reference docs and observe behavior in DevTools. Connect Memory Panel to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about memory panel. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Memory Panel from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Memory Panel in a senior frontend interview?",
      "answerHint": "Memory Panel is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for memory panel can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether memory panel succeeds in production. // Memory Panel — minimal browser example\nconsole.log('[b3-devtools-memory]', typeof document);\n// Open DevTools → verif"
    }
  ],
  "pitfalls": [
    "Interview trap: describing Memory Panel from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Memory Panel at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Memory Panel is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Memory Panel?",
      "When would Memory Panel block rendering or fail cross-origin?",
      "What is the classic Memory Panel interview trap?"
    ],
    "traps": [
      "Interview trap: describing Memory Panel from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide memory panel details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Memory Panel."
    ]
  }
})
