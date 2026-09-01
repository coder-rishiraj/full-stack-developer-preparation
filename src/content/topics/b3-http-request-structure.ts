import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "HTTP Request Structure",
  "whatIsIt": "HTTP Request Structure is a core Web Platform concept in Browser HTTP. It belongs to HTTP from the browser perspective (requests, headers, caching). Understanding HTTP Request Structure helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide http request structure details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat HTTP Request Structure as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate HTTP Request Structure in B3.10 — Browser HTTP: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect HTTP Request Structure to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about http request structure.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing HTTP Request Structure from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// HTTP Request Structure — minimal browser example\nconsole.log('[b3-http-request-structure]', typeof document);\n// Open DevTools → verify behavior for: HTTP Request Structure\n// Spec reference: developer.mozilla.org (search \"HTTP Request Structure\")",
  "exampleCaption": "HTTP Request Structure — observe in DevTools while this runs",
  "internals": [
    "HTTP Request Structure is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for http request structure can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether http request structure succeeds in production."
  ],
  "takeaways": [
    "Locate HTTP Request Structure in B3.10 — Browser HTTP: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect HTTP Request Structure to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing HTTP Request Structure from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "HTTP Request Structure is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "HTTP Request Structure: Treat HTTP Request Structure as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate HTTP Request Structure in B3.10 — Browser HTTP: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect HTTP Request Structure to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing HTTP Request Structure from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "HTTP Request Structure",
      "HTTP Request Structure is a core Web Platform concept in Browser HTTP."
    ],
    [
      "Mental model",
      "Treat HTTP Request Structure as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing HTTP Request Structure from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate HTTP Request Structure in B3.10 — Browser HTTP: map it to MDN reference d",
      "Connect HTTP Request Structure to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is HTTP Request Structure in the browser and when do you use it?",
      "answerHint": "HTTP Request Structure is a core Web Platform concept in Browser HTTP. It belongs to HTTP from the browser perspective (requests, headers, caching). Understanding HTTP Request Structure helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain HTTP Request Structure with a DevTools observation and one pitfall.",
      "answerHint": "Locate HTTP Request Structure in B3.10 — Browser HTTP: map it to MDN reference docs and observe behavior in DevTools. Connect HTTP Request Structure to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about http request structure. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing HTTP Request Structure from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain HTTP Request Structure in a senior frontend interview?",
      "answerHint": "HTTP Request Structure is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for http request structure can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether http request structure succeeds in production. // HTTP Request Structure — minimal browser example\nconsole.log('[b3-http-request-structure]', typeof document);\n// Open"
    }
  ],
  "pitfalls": [
    "Interview trap: describing HTTP Request Structure from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain HTTP Request Structure at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "HTTP Request Structure is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is HTTP Request Structure?",
      "When would HTTP Request Structure block rendering or fail cross-origin?",
      "What is the classic HTTP Request Structure interview trap?"
    ],
    "traps": [
      "Interview trap: describing HTTP Request Structure from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide http request structure details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around HTTP Request Structure."
    ]
  }
})
