import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Reconnection Strategies",
  "whatIsIt": "Reconnection Strategies is a core Web Platform concept in WebSockets. It belongs to WebSocket connections and real-time messaging. Understanding Reconnection Strategies helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide reconnection strategies details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Reconnection Strategies as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Reconnection Strategies in B3.23 — WebSockets: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Reconnection Strategies to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about reconnection strategies.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Reconnection Strategies from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Reconnection Strategies — minimal browser example\nconsole.log('[b3-ws-reconnection]', typeof document);\n// Open DevTools → verify behavior for: Reconnection Strategies\n// Spec reference: developer.mozilla.org (search \"Reconnection Strategies\")",
  "exampleCaption": "Reconnection Strategies — observe in DevTools while this runs",
  "internals": [
    "Reconnection Strategies is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for reconnection strategies can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether reconnection strategies succeeds in production."
  ],
  "takeaways": [
    "Locate Reconnection Strategies in B3.23 — WebSockets: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Reconnection Strategies to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Reconnection Strategies from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Reconnection Strategies is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Reconnection Strategies: Treat Reconnection Strategies as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Reconnection Strategies in B3.23 — WebSockets: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Reconnection Strategies to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Reconnection Strategies from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Reconnection Strategies",
      "Reconnection Strategies is a core Web Platform concept in WebSockets."
    ],
    [
      "Mental model",
      "Treat Reconnection Strategies as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Reconnection Strategies from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Reconnection Strategies in B3.23 — WebSockets: map it to MDN reference do",
      "Connect Reconnection Strategies to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Reconnection Strategies in the browser and when do you use it?",
      "answerHint": "Reconnection Strategies is a core Web Platform concept in WebSockets. It belongs to WebSocket connections and real-time messaging. Understanding Reconnection Strategies helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Reconnection Strategies with a DevTools observation and one pitfall.",
      "answerHint": "Locate Reconnection Strategies in B3.23 — WebSockets: map it to MDN reference docs and observe behavior in DevTools. Connect Reconnection Strategies to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about reconnection strategies. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Reconnection Strategies from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Reconnection Strategies in a senior frontend interview?",
      "answerHint": "Reconnection Strategies is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for reconnection strategies can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether reconnection strategies succeeds in production. // Reconnection Strategies — minimal browser example\nconsole.log('[b3-ws-reconnection]', typeof document);\n// Open DevTo"
    }
  ],
  "pitfalls": [
    "Interview trap: describing Reconnection Strategies from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Reconnection Strategies at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Reconnection Strategies is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Reconnection Strategies?",
      "When would Reconnection Strategies block rendering or fail cross-origin?",
      "What is the classic Reconnection Strategies interview trap?"
    ],
    "traps": [
      "Interview trap: describing Reconnection Strategies from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide reconnection strategies details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Reconnection Strategies."
    ]
  }
})
