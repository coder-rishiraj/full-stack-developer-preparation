import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "ETag & If-None-Match",
  "whatIsIt": "ETag & If-None-Match is a core Web Platform concept in Browser Caching. It belongs to browser HTTP caching, validation, and cache layers. Understanding ETag & If-None-Match helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide etag & if-none-match details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat ETag & If-None-Match as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate ETag & If-None-Match in B3.18 — Browser Caching: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect ETag & If-None-Match to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about etag & if-none-match.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing ETag & If-None-Match from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// ETag & If-None-Match — minimal browser example\nconsole.log('[b3-etag]', typeof document);\n// Open DevTools → verify behavior for: ETag & If-None-Match\n// Spec reference: developer.mozilla.org (search \"ETag & If-None-Match\")",
  "exampleCaption": "ETag & If-None-Match — observe in DevTools while this runs",
  "internals": [
    "ETag & If-None-Match is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for etag & if-none-match can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether etag & if-none-match succeeds in production."
  ],
  "takeaways": [
    "Locate ETag & If-None-Match in B3.18 — Browser Caching: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect ETag & If-None-Match to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing ETag & If-None-Match from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "ETag & If-None-Match is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "ETag & If-None-Match: Treat ETag & If-None-Match as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate ETag & If-None-Match in B3.18 — Browser Caching: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect ETag & If-None-Match to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing ETag & If-None-Match from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "ETag & If-None-Match",
      "ETag & If-None-Match is a core Web Platform concept in Browser Caching."
    ],
    [
      "Mental model",
      "Treat ETag & If-None-Match as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing ETag & If-None-Match from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate ETag & If-None-Match in B3.18 — Browser Caching: map it to MDN reference ",
      "Connect ETag & If-None-Match to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is ETag & If-None-Match in the browser and when do you use it?",
      "answerHint": "ETag & If-None-Match is a core Web Platform concept in Browser Caching. It belongs to browser HTTP caching, validation, and cache layers. Understanding ETag & If-None-Match helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain ETag & If-None-Match with a DevTools observation and one pitfall.",
      "answerHint": "Locate ETag & If-None-Match in B3.18 — Browser Caching: map it to MDN reference docs and observe behavior in DevTools. Connect ETag & If-None-Match to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about etag & if-none-match. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing ETag & If-None-Match from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain ETag & If-None-Match in a senior frontend interview?",
      "answerHint": "ETag & If-None-Match is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for etag & if-none-match can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether etag & if-none-match succeeds in production. // ETag & If-None-Match — minimal browser example\nconsole.log('[b3-etag]', typeof document);\n// Open DevTools → verify b"
    }
  ],
  "pitfalls": [
    "Interview trap: describing ETag & If-None-Match from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain ETag & If-None-Match at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "ETag & If-None-Match is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is ETag & If-None-Match?",
      "When would ETag & If-None-Match block rendering or fail cross-origin?",
      "What is the classic ETag & If-None-Match interview trap?"
    ],
    "traps": [
      "Interview trap: describing ETag & If-None-Match from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide etag & if-none-match details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around ETag & If-None-Match."
    ]
  }
})
