import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Cache-Control Directives",
  "whatIsIt": "Cache-Control Directives is a core Web Platform concept in Browser Caching. It belongs to browser HTTP caching, validation, and cache layers. Understanding Cache-Control Directives helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide cache-control directives details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Cache-Control Directives as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Cache-Control Directives in B3.18 — Browser Caching: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Cache-Control Directives to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about cache-control directives.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Cache-Control Directives from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Cache-Control Directives — minimal browser example\nconsole.log('[b3-cache-control-directives]', typeof document);\n// Open DevTools → verify behavior for: Cache-Control Directives\n// Spec reference: developer.mozilla.org (search \"Cache-Control Directives\")",
  "exampleCaption": "Cache-Control Directives — observe in DevTools while this runs",
  "internals": [
    "Cache-Control Directives is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for cache-control directives can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether cache-control directives succeeds in production."
  ],
  "takeaways": [
    "Locate Cache-Control Directives in B3.18 — Browser Caching: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Cache-Control Directives to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Cache-Control Directives from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Cache-Control Directives is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Cache-Control Directives: Treat Cache-Control Directives as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Cache-Control Directives in B3.18 — Browser Caching: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Cache-Control Directives to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Cache-Control Directives from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Cache-Control Directives",
      "Cache-Control Directives is a core Web Platform concept in Browser Caching."
    ],
    [
      "Mental model",
      "Treat Cache-Control Directives as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Cache-Control Directives from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Cache-Control Directives in B3.18 — Browser Caching: map it to MDN refere",
      "Connect Cache-Control Directives to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Cache-Control Directives in the browser and when do you use it?",
      "answerHint": "Cache-Control Directives is a core Web Platform concept in Browser Caching. It belongs to browser HTTP caching, validation, and cache layers. Understanding Cache-Control Directives helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Cache-Control Directives with a DevTools observation and one pitfall.",
      "answerHint": "Locate Cache-Control Directives in B3.18 — Browser Caching: map it to MDN reference docs and observe behavior in DevTools. Connect Cache-Control Directives to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about cache-control directives. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Cache-Control Directives from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Cache-Control Directives in a senior frontend interview?",
      "answerHint": "Cache-Control Directives is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for cache-control directives can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether cache-control directives succeeds in production. // Cache-Control Directives — minimal browser example\nconsole.log('[b3-cache-control-directives]', typeof document);\n// "
    }
  ],
  "pitfalls": [
    "Interview trap: describing Cache-Control Directives from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Cache-Control Directives at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Cache-Control Directives is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Cache-Control Directives?",
      "When would Cache-Control Directives block rendering or fail cross-origin?",
      "What is the classic Cache-Control Directives interview trap?"
    ],
    "traps": [
      "Interview trap: describing Cache-Control Directives from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide cache-control directives details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Cache-Control Directives."
    ]
  }
})
