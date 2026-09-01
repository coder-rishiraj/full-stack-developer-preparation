import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Service Workers in DevTools",
  "whatIsIt": "Service Workers in DevTools is a core Web Platform concept in Browser Developer Tools. It belongs to Chrome DevTools panels for frontend debugging. Understanding Service Workers in DevTools helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide service workers in devtools details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Service Workers in DevTools as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Service Workers in DevTools in B3.36 — Browser Developer Tools: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Service Workers in DevTools to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about service workers in devtools.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Service Workers in DevTools from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Service Workers in DevTools — minimal browser example\nconsole.log('[b3-devtools-service-workers]', typeof document);\n// Open DevTools → verify behavior for: Service Workers in DevTools\n// Spec reference: developer.mozilla.org (search \"Service Workers in DevTools\")",
  "exampleCaption": "Service Workers in DevTools — observe in DevTools while this runs",
  "internals": [
    "Service Workers in DevTools is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for service workers in devtools can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether service workers in devtools succeeds in production."
  ],
  "takeaways": [
    "Locate Service Workers in DevTools in B3.36 — Browser Developer Tools: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Service Workers in DevTools to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Service Workers in DevTools from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Service Workers in DevTools is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Service Workers in DevTools: Treat Service Workers in DevTools as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Service Workers in DevTools in B3.36 — Browser Developer Tools: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Service Workers in DevTools to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Service Workers in DevTools from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Service Workers in DevTools",
      "Service Workers in DevTools is a core Web Platform concept in Browser Developer Tools."
    ],
    [
      "Mental model",
      "Treat Service Workers in DevTools as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Service Workers in DevTools from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Service Workers in DevTools in B3.36 — Browser Developer Tools: map it to",
      "Connect Service Workers in DevTools to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Service Workers in DevTools in the browser and when do you use it?",
      "answerHint": "Service Workers in DevTools is a core Web Platform concept in Browser Developer Tools. It belongs to Chrome DevTools panels for frontend debugging. Understanding Service Workers in DevTools helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Service Workers in DevTools with a DevTools observation and one pitfall.",
      "answerHint": "Locate Service Workers in DevTools in B3.36 — Browser Developer Tools: map it to MDN reference docs and observe behavior in DevTools. Connect Service Workers in DevTools to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about service workers in devtools. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Service Workers in DevTools from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Service Workers in DevTools in a senior frontend interview?",
      "answerHint": "Service Workers in DevTools is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for service workers in devtools can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether service workers in devtools succeeds in production. // Service Workers in DevTools — minimal browser example\nconsole.log('[b3-devtools-service-workers]', typeof document);\n"
    }
  ],
  "pitfalls": [
    "Interview trap: describing Service Workers in DevTools from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Service Workers in DevTools at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Service Workers in DevTools is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Service Workers in DevTools?",
      "When would Service Workers in DevTools block rendering or fail cross-origin?",
      "What is the classic Service Workers in DevTools interview trap?"
    ],
    "traps": [
      "Interview trap: describing Service Workers in DevTools from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide service workers in devtools details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Service Workers in DevTools."
    ]
  }
})
