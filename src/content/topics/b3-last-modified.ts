import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Last-Modified & If-Modified-Since",
  "whatIsIt": "Last-Modified & If-Modified-Since is a core Web Platform concept in Browser Caching. It belongs to browser HTTP caching, validation, and cache layers. Understanding Last-Modified & If-Modified-Since helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide last-modified & if-modified-since details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Last-Modified & If-Modified-Since as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Last-Modified & If-Modified-Since in B3.18 — Browser Caching: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Last-Modified & If-Modified-Since to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about last-modified & if-modified-since.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Last-Modified & If-Modified-Since from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Last-Modified & If-Modified-Since — minimal browser example\nconsole.log('[b3-last-modified]', typeof document);\n// Open DevTools → verify behavior for: Last-Modified & If-Modified-Since\n// Spec reference: developer.mozilla.org (search \"Last-Modified & If-Modified-Since\")",
  "exampleCaption": "Last-Modified & If-Modified-Since — observe in DevTools while this runs",
  "internals": [
    "Last-Modified & If-Modified-Since is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for last-modified & if-modified-since can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether last-modified & if-modified-since succeeds in production."
  ],
  "takeaways": [
    "Locate Last-Modified & If-Modified-Since in B3.18 — Browser Caching: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Last-Modified & If-Modified-Since to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Last-Modified & If-Modified-Since from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Last-Modified & If-Modified-Since is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Last-Modified & If-Modified-Since: Treat Last-Modified & If-Modified-Since as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Last-Modified & If-Modified-Since in B3.18 — Browser Caching: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Last-Modified & If-Modified-Since to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Last-Modified & If-Modified-Since from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Last-Modified & If-Modified-Since",
      "Last-Modified & If-Modified-Since is a core Web Platform concept in Browser Caching."
    ],
    [
      "Mental model",
      "Treat Last-Modified & If-Modified-Since as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Last-Modified & If-Modified-Since from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Last-Modified & If-Modified-Since in B3.18 — Browser Caching: map it to M",
      "Connect Last-Modified & If-Modified-Since to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Last-Modified & If-Modified-Since in the browser and when do you use it?",
      "answerHint": "Last-Modified & If-Modified-Since is a core Web Platform concept in Browser Caching. It belongs to browser HTTP caching, validation, and cache layers. Understanding Last-Modified & If-Modified-Since helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Last-Modified & If-Modified-Since with a DevTools observation and one pitfall.",
      "answerHint": "Locate Last-Modified & If-Modified-Since in B3.18 — Browser Caching: map it to MDN reference docs and observe behavior in DevTools. Connect Last-Modified & If-Modified-Since to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about last-modified & if-modified-since. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Last-Modified & If-Modified-Since from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Last-Modified & If-Modified-Since in a senior frontend interview?",
      "answerHint": "Last-Modified & If-Modified-Since is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for last-modified & if-modified-since can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether last-modified & if-modified-since succeeds in production. // Last-Modified & If-Modified-Since — minimal browser example\nconsole.log('[b3-last-modified]', typeof document);\n// Op"
    }
  ],
  "pitfalls": [
    "Interview trap: describing Last-Modified & If-Modified-Since from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Last-Modified & If-Modified-Since at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Last-Modified & If-Modified-Since is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Last-Modified & If-Modified-Since?",
      "When would Last-Modified & If-Modified-Since block rendering or fail cross-origin?",
      "What is the classic Last-Modified & If-Modified-Since interview trap?"
    ],
    "traps": [
      "Interview trap: describing Last-Modified & If-Modified-Since from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide last-modified & if-modified-since details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Last-Modified & If-Modified-Since."
    ]
  }
})
