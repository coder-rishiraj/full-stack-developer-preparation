import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "SPA Navigation in the Browser",
  "whatIsIt": "SPA Navigation in the Browser is a core Web Platform concept in Navigation & SPA Browser Behavior. It belongs to History API, SPA navigation, and browser history stack. Understanding SPA Navigation in the Browser helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide spa navigation in the browser details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat SPA Navigation in the Browser as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate SPA Navigation in the Browser in B3.29 — Navigation & SPA Browser Behavior: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect SPA Navigation in the Browser to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about spa navigation in the browser.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing SPA Navigation in the Browser from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// SPA Navigation in the Browser — minimal browser example\nconsole.log('[b3-spa-navigation]', typeof document);\n// Open DevTools → verify behavior for: SPA Navigation in the Browser\n// Spec reference: developer.mozilla.org (search \"SPA Navigation in the Browser\")",
  "exampleCaption": "SPA Navigation in the Browser — observe in DevTools while this runs",
  "internals": [
    "SPA Navigation in the Browser is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for spa navigation in the browser can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether spa navigation in the browser succeeds in production."
  ],
  "takeaways": [
    "Locate SPA Navigation in the Browser in B3.29 — Navigation & SPA Browser Behavior: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect SPA Navigation in the Browser to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing SPA Navigation in the Browser from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "SPA Navigation in the Browser is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "SPA Navigation in the Browser: Treat SPA Navigation in the Browser as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate SPA Navigation in the Browser in B3.29 — Navigation & SPA Browser Behavior: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect SPA Navigation in the Browser to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing SPA Navigation in the Browser from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "SPA Navigation in the Browser",
      "SPA Navigation in the Browser is a core Web Platform concept in Navigation & SPA Browser Behavior."
    ],
    [
      "Mental model",
      "Treat SPA Navigation in the Browser as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing SPA Navigation in the Browser from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate SPA Navigation in the Browser in B3.29 — Navigation & SPA Browser Behavio",
      "Connect SPA Navigation in the Browser to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is SPA Navigation in the Browser in the browser and when do you use it?",
      "answerHint": "SPA Navigation in the Browser is a core Web Platform concept in Navigation & SPA Browser Behavior. It belongs to History API, SPA navigation, and browser history stack. Understanding SPA Navigation in the Browser helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain SPA Navigation in the Browser with a DevTools observation and one pitfall.",
      "answerHint": "Locate SPA Navigation in the Browser in B3.29 — Navigation & SPA Browser Behavior: map it to MDN reference docs and observe behavior in DevTools. Connect SPA Navigation in the Browser to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about spa navigation in the browser. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing SPA Navigation in the Browser from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain SPA Navigation in the Browser in a senior frontend interview?",
      "answerHint": "SPA Navigation in the Browser is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for spa navigation in the browser can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether spa navigation in the browser succeeds in production. // SPA Navigation in the Browser — minimal browser example\nconsole.log('[b3-spa-navigation]', typeof document);\n// Open "
    }
  ],
  "pitfalls": [
    "Interview trap: describing SPA Navigation in the Browser from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain SPA Navigation in the Browser at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "SPA Navigation in the Browser is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is SPA Navigation in the Browser?",
      "When would SPA Navigation in the Browser block rendering or fail cross-origin?",
      "What is the classic SPA Navigation in the Browser interview trap?"
    ],
    "traps": [
      "Interview trap: describing SPA Navigation in the Browser from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide spa navigation in the browser details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around SPA Navigation in the Browser."
    ]
  }
})
