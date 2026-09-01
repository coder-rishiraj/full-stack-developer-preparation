import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Lighthouse in DevTools",
  "whatIsIt": "Lighthouse in DevTools is a core Web Platform concept in Browser Developer Tools. It belongs to Chrome DevTools panels for frontend debugging. Understanding Lighthouse in DevTools helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide lighthouse in devtools details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Lighthouse in DevTools as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Lighthouse in DevTools in B3.36 — Browser Developer Tools: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Lighthouse in DevTools to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about lighthouse in devtools.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Lighthouse in DevTools from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Lighthouse in DevTools — minimal browser example\nconsole.log('[b3-devtools-lighthouse]', typeof document);\n// Open DevTools → verify behavior for: Lighthouse in DevTools\n// Spec reference: developer.mozilla.org (search \"Lighthouse in DevTools\")",
  "exampleCaption": "Lighthouse in DevTools — observe in DevTools while this runs",
  "internals": [
    "Lighthouse in DevTools is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for lighthouse in devtools can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether lighthouse in devtools succeeds in production."
  ],
  "takeaways": [
    "Locate Lighthouse in DevTools in B3.36 — Browser Developer Tools: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Lighthouse in DevTools to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Lighthouse in DevTools from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Lighthouse in DevTools is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Lighthouse in DevTools: Treat Lighthouse in DevTools as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Lighthouse in DevTools in B3.36 — Browser Developer Tools: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Lighthouse in DevTools to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Lighthouse in DevTools from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Lighthouse in DevTools",
      "Lighthouse in DevTools is a core Web Platform concept in Browser Developer Tools."
    ],
    [
      "Mental model",
      "Treat Lighthouse in DevTools as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Lighthouse in DevTools from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Lighthouse in DevTools in B3.36 — Browser Developer Tools: map it to MDN ",
      "Connect Lighthouse in DevTools to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Lighthouse in DevTools in the browser and when do you use it?",
      "answerHint": "Lighthouse in DevTools is a core Web Platform concept in Browser Developer Tools. It belongs to Chrome DevTools panels for frontend debugging. Understanding Lighthouse in DevTools helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Lighthouse in DevTools with a DevTools observation and one pitfall.",
      "answerHint": "Locate Lighthouse in DevTools in B3.36 — Browser Developer Tools: map it to MDN reference docs and observe behavior in DevTools. Connect Lighthouse in DevTools to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about lighthouse in devtools. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Lighthouse in DevTools from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Lighthouse in DevTools in a senior frontend interview?",
      "answerHint": "Lighthouse in DevTools is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for lighthouse in devtools can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether lighthouse in devtools succeeds in production. // Lighthouse in DevTools — minimal browser example\nconsole.log('[b3-devtools-lighthouse]', typeof document);\n// Open De"
    }
  ],
  "pitfalls": [
    "Interview trap: describing Lighthouse in DevTools from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Lighthouse in DevTools at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Lighthouse in DevTools is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Lighthouse in DevTools?",
      "When would Lighthouse in DevTools block rendering or fail cross-origin?",
      "What is the classic Lighthouse in DevTools interview trap?"
    ],
    "traps": [
      "Interview trap: describing Lighthouse in DevTools from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide lighthouse in devtools details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Lighthouse in DevTools."
    ]
  }
})
