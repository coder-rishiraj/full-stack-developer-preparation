import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "HTTP Methods (GET, POST, PUT, PATCH, DELETE)",
  "whatIsIt": "HTTP Methods (GET, POST, PUT, PATCH, DELETE) is a core Web Platform concept in Browser HTTP. It belongs to HTTP from the browser perspective (requests, headers, caching). Understanding HTTP Methods (GET, POST, PUT, PATCH, DELETE) helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide http methods (get, post, put, patch, delete) details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat HTTP Methods (GET, POST, PUT, PATCH, DELETE) as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate HTTP Methods (GET, POST, PUT, PATCH, DELETE) in B3.10 — Browser HTTP: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect HTTP Methods (GET, POST, PUT, PATCH, DELETE) to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about http methods (get, post, put, patch, delete).",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing HTTP Methods (GET, POST, PUT, PATCH, DELETE) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// HTTP Methods (GET, POST, PUT, PATCH, DELETE) — minimal browser example\nconsole.log('[b3-http-methods]', typeof document);\n// Open DevTools → verify behavior for: HTTP Methods (GET, POST, PUT, PATCH, DELETE)\n// Spec reference: developer.mozilla.org (search \"HTTP Methods (GET, POST, PUT, PATCH, DELETE)\")",
  "exampleCaption": "HTTP Methods (GET, POST, PUT, PATCH, DELETE) — observe in DevTools while this runs",
  "internals": [
    "HTTP Methods (GET, POST, PUT, PATCH, DELETE) is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for http methods (get, post, put, patch, delete) can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether http methods (get, post, put, patch, delete) succeeds in production."
  ],
  "takeaways": [
    "Locate HTTP Methods (GET, POST, PUT, PATCH, DELETE) in B3.10 — Browser HTTP: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect HTTP Methods (GET, POST, PUT, PATCH, DELETE) to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing HTTP Methods (GET, POST, PUT, PATCH, DELETE) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "HTTP Methods (GET, POST, PUT, PATCH, DELETE) is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "HTTP Methods (GET, POST, PUT, PATCH, DELETE): Treat HTTP Methods (GET, POST, PUT, PATCH, DELETE) as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate HTTP Methods (GET, POST, PUT, PATCH, DELETE) in B3.10 — Browser HTTP: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect HTTP Methods (GET, POST, PUT, PATCH, DELETE) to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing HTTP Methods (GET, POST, PUT, PATCH, DELETE) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "HTTP Methods (GET, POST, PUT, PATCH, DELETE)",
      "HTTP Methods (GET, POST, PUT, PATCH, DELETE) is a core Web Platform concept in Browser HTTP."
    ],
    [
      "Mental model",
      "Treat HTTP Methods (GET, POST, PUT, PATCH, DELETE) as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing HTTP Methods (GET, POST, PUT, PATCH, DELETE) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate HTTP Methods (GET, POST, PUT, PATCH, DELETE) in B3.10 — Browser HTTP: map",
      "Connect HTTP Methods (GET, POST, PUT, PATCH, DELETE) to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is HTTP Methods (GET, POST, PUT, PATCH, DELETE) in the browser and when do you use it?",
      "answerHint": "HTTP Methods (GET, POST, PUT, PATCH, DELETE) is a core Web Platform concept in Browser HTTP. It belongs to HTTP from the browser perspective (requests, headers, caching). Understanding HTTP Methods (GET, POST, PUT, PATCH, DELETE) helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain HTTP Methods (GET, POST, PUT, PATCH, DELETE) with a DevTools observation and one pitfall.",
      "answerHint": "Locate HTTP Methods (GET, POST, PUT, PATCH, DELETE) in B3.10 — Browser HTTP: map it to MDN reference docs and observe behavior in DevTools. Connect HTTP Methods (GET, POST, PUT, PATCH, DELETE) to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about http methods (get, post, put, patch, delete). Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing HTTP Methods (GET, POST, PUT, PATCH, DELETE) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain HTTP Methods (GET, POST, PUT, PATCH, DELETE) in a senior frontend interview?",
      "answerHint": "HTTP Methods (GET, POST, PUT, PATCH, DELETE) is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for http methods (get, post, put, patch, delete) can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether http methods (get, post, put, patch, delete) succeeds in production. // HTTP Methods (GET, POST, PUT, PATCH, DELETE) — minimal browser example\nconsole.log('[b3-http-methods]', typeof docume"
    }
  ],
  "pitfalls": [
    "Interview trap: describing HTTP Methods (GET, POST, PUT, PATCH, DELETE) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain HTTP Methods (GET, POST, PUT, PATCH, DELETE) at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "HTTP Methods (GET, POST, PUT, PATCH, DELETE) is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is HTTP Methods (GET, POST, PUT, PATCH, DELETE)?",
      "When would HTTP Methods (GET, POST, PUT, PATCH, DELETE) block rendering or fail cross-origin?",
      "What is the classic HTTP Methods (GET, POST, PUT, PATCH, DELETE) interview trap?"
    ],
    "traps": [
      "Interview trap: describing HTTP Methods (GET, POST, PUT, PATCH, DELETE) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide http methods (get, post, put, patch, delete) details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around HTTP Methods (GET, POST, PUT, PATCH, DELETE)."
    ]
  }
})
