import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Source Maps in DevTools",
  "whatIsIt": "Source Maps in DevTools is a core Web Platform concept in Browser Developer Tools. It belongs to Chrome DevTools panels for frontend debugging. Understanding Source Maps in DevTools helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide source maps in devtools details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Source Maps in DevTools as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Source Maps in DevTools in B3.36 — Browser Developer Tools: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Source Maps in DevTools to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about source maps in devtools.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Source Maps in DevTools from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Source Maps in DevTools — minimal browser example\nconsole.log('[b3-devtools-source-maps]', typeof document);\n// Open DevTools → verify behavior for: Source Maps in DevTools\n// Spec reference: developer.mozilla.org (search \"Source Maps in DevTools\")",
  "exampleCaption": "Source Maps in DevTools — observe in DevTools while this runs",
  "internals": [
    "Source Maps in DevTools is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for source maps in devtools can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether source maps in devtools succeeds in production."
  ],
  "takeaways": [
    "Locate Source Maps in DevTools in B3.36 — Browser Developer Tools: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Source Maps in DevTools to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Source Maps in DevTools from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Source Maps in DevTools is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Source Maps in DevTools: Treat Source Maps in DevTools as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Source Maps in DevTools in B3.36 — Browser Developer Tools: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Source Maps in DevTools to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Source Maps in DevTools from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Source Maps in DevTools",
      "Source Maps in DevTools is a core Web Platform concept in Browser Developer Tools."
    ],
    [
      "Mental model",
      "Treat Source Maps in DevTools as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Source Maps in DevTools from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Source Maps in DevTools in B3.36 — Browser Developer Tools: map it to MDN",
      "Connect Source Maps in DevTools to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Source Maps in DevTools in the browser and when do you use it?",
      "answerHint": "Source Maps in DevTools is a core Web Platform concept in Browser Developer Tools. It belongs to Chrome DevTools panels for frontend debugging. Understanding Source Maps in DevTools helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Source Maps in DevTools with a DevTools observation and one pitfall.",
      "answerHint": "Locate Source Maps in DevTools in B3.36 — Browser Developer Tools: map it to MDN reference docs and observe behavior in DevTools. Connect Source Maps in DevTools to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about source maps in devtools. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Source Maps in DevTools from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Source Maps in DevTools in a senior frontend interview?",
      "answerHint": "Source Maps in DevTools is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for source maps in devtools can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether source maps in devtools succeeds in production. // Source Maps in DevTools — minimal browser example\nconsole.log('[b3-devtools-source-maps]', typeof document);\n// Open "
    }
  ],
  "pitfalls": [
    "Interview trap: describing Source Maps in DevTools from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Source Maps in DevTools at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Source Maps in DevTools is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Source Maps in DevTools?",
      "When would Source Maps in DevTools block rendering or fail cross-origin?",
      "What is the classic Source Maps in DevTools interview trap?"
    ],
    "traps": [
      "Interview trap: describing Source Maps in DevTools from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide source maps in devtools details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Source Maps in DevTools."
    ]
  }
})
