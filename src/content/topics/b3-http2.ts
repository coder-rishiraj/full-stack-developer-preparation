import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "HTTP/2",
  "whatIsIt": "HTTP/2 is a core Web Platform concept in Browser HTTP. It belongs to HTTP from the browser perspective (requests, headers, caching). Understanding HTTP/2 helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide http/2 details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat HTTP/2 as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate HTTP/2 in B3.10 — Browser HTTP: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect HTTP/2 to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about http/2.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing HTTP/2 from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// HTTP/2 — minimal browser example\nconsole.log('[b3-http2]', typeof document);\n// Open DevTools → verify behavior for: HTTP/2\n// Spec reference: developer.mozilla.org (search \"HTTP/2\")",
  "exampleCaption": "HTTP/2 — observe in DevTools while this runs",
  "internals": [
    "HTTP/2 is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for http/2 can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether http/2 succeeds in production."
  ],
  "takeaways": [
    "Locate HTTP/2 in B3.10 — Browser HTTP: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect HTTP/2 to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing HTTP/2 from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "HTTP/2 is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "HTTP/2: Treat HTTP/2 as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate HTTP/2 in B3.10 — Browser HTTP: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect HTTP/2 to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing HTTP/2 from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "HTTP/2",
      "HTTP/2 is a core Web Platform concept in Browser HTTP."
    ],
    [
      "Mental model",
      "Treat HTTP/2 as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing HTTP/2 from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate HTTP/2 in B3.10 — Browser HTTP: map it to MDN reference docs and observe ",
      "Connect HTTP/2 to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is HTTP/2 in the browser and when do you use it?",
      "answerHint": "HTTP/2 is a core Web Platform concept in Browser HTTP. It belongs to HTTP from the browser perspective (requests, headers, caching). Understanding HTTP/2 helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain HTTP/2 with a DevTools observation and one pitfall.",
      "answerHint": "Locate HTTP/2 in B3.10 — Browser HTTP: map it to MDN reference docs and observe behavior in DevTools. Connect HTTP/2 to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about http/2. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing HTTP/2 from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain HTTP/2 in a senior frontend interview?",
      "answerHint": "HTTP/2 is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for http/2 can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether http/2 succeeds in production. // HTTP/2 — minimal browser example\nconsole.log('[b3-http2]', typeof document);\n// Open DevTools → verify behavior for: "
    }
  ],
  "pitfalls": [
    "Interview trap: describing HTTP/2 from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain HTTP/2 at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "HTTP/2 is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is HTTP/2?",
      "When would HTTP/2 block rendering or fail cross-origin?",
      "What is the classic HTTP/2 interview trap?"
    ],
    "traps": [
      "Interview trap: describing HTTP/2 from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide http/2 details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around HTTP/2."
    ]
  }
})
