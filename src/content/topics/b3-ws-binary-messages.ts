import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Binary & Text Messages",
  "whatIsIt": "Binary & Text Messages is a core Web Platform concept in WebSockets. It belongs to WebSocket connections and real-time messaging. Understanding Binary & Text Messages helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide binary & text messages details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Binary & Text Messages as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Binary & Text Messages in B3.23 — WebSockets: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Binary & Text Messages to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about binary & text messages.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Binary & Text Messages from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Binary & Text Messages — minimal browser example\nconsole.log('[b3-ws-binary-messages]', typeof document);\n// Open DevTools → verify behavior for: Binary & Text Messages\n// Spec reference: developer.mozilla.org (search \"Binary & Text Messages\")",
  "exampleCaption": "Binary & Text Messages — observe in DevTools while this runs",
  "internals": [
    "Binary & Text Messages is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for binary & text messages can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether binary & text messages succeeds in production."
  ],
  "takeaways": [
    "Locate Binary & Text Messages in B3.23 — WebSockets: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Binary & Text Messages to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Binary & Text Messages from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Binary & Text Messages is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Binary & Text Messages: Treat Binary & Text Messages as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Binary & Text Messages in B3.23 — WebSockets: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Binary & Text Messages to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Binary & Text Messages from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Binary & Text Messages",
      "Binary & Text Messages is a core Web Platform concept in WebSockets."
    ],
    [
      "Mental model",
      "Treat Binary & Text Messages as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Binary & Text Messages from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Binary & Text Messages in B3.23 — WebSockets: map it to MDN reference doc",
      "Connect Binary & Text Messages to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Binary & Text Messages in the browser and when do you use it?",
      "answerHint": "Binary & Text Messages is a core Web Platform concept in WebSockets. It belongs to WebSocket connections and real-time messaging. Understanding Binary & Text Messages helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Binary & Text Messages with a DevTools observation and one pitfall.",
      "answerHint": "Locate Binary & Text Messages in B3.23 — WebSockets: map it to MDN reference docs and observe behavior in DevTools. Connect Binary & Text Messages to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about binary & text messages. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Binary & Text Messages from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Binary & Text Messages in a senior frontend interview?",
      "answerHint": "Binary & Text Messages is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for binary & text messages can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether binary & text messages succeeds in production. // Binary & Text Messages — minimal browser example\nconsole.log('[b3-ws-binary-messages]', typeof document);\n// Open Dev"
    }
  ],
  "pitfalls": [
    "Interview trap: describing Binary & Text Messages from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Binary & Text Messages at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Binary & Text Messages is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Binary & Text Messages?",
      "When would Binary & Text Messages block rendering or fail cross-origin?",
      "What is the classic Binary & Text Messages interview trap?"
    ],
    "traps": [
      "Interview trap: describing Binary & Text Messages from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide binary & text messages details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Binary & Text Messages."
    ]
  }
})
