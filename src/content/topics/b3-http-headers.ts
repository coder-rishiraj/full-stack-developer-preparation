import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "HTTP Headers",
  "whatIsIt": "HTTP Headers is a core Web Platform concept in Browser HTTP. It belongs to HTTP from the browser perspective (requests, headers, caching). Understanding HTTP Headers helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide http headers details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat HTTP Headers as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate HTTP Headers in B3.10 — Browser HTTP: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect HTTP Headers to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about http headers.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing HTTP Headers from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// HTTP Headers — minimal browser example\nconsole.log('[b3-http-headers]', typeof document);\n// Open DevTools → verify behavior for: HTTP Headers\n// Spec reference: developer.mozilla.org (search \"HTTP Headers\")",
  "exampleCaption": "HTTP Headers — observe in DevTools while this runs",
  "internals": [
    "HTTP Headers is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for http headers can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether http headers succeeds in production."
  ],
  "takeaways": [
    "Locate HTTP Headers in B3.10 — Browser HTTP: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect HTTP Headers to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing HTTP Headers from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "HTTP Headers is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "HTTP Headers: Treat HTTP Headers as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate HTTP Headers in B3.10 — Browser HTTP: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect HTTP Headers to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing HTTP Headers from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "HTTP Headers",
      "HTTP Headers is a core Web Platform concept in Browser HTTP."
    ],
    [
      "Mental model",
      "Treat HTTP Headers as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing HTTP Headers from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate HTTP Headers in B3.10 — Browser HTTP: map it to MDN reference docs and ob",
      "Connect HTTP Headers to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is HTTP Headers in the browser and when do you use it?",
      "answerHint": "HTTP Headers is a core Web Platform concept in Browser HTTP. It belongs to HTTP from the browser perspective (requests, headers, caching). Understanding HTTP Headers helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain HTTP Headers with a DevTools observation and one pitfall.",
      "answerHint": "Locate HTTP Headers in B3.10 — Browser HTTP: map it to MDN reference docs and observe behavior in DevTools. Connect HTTP Headers to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about http headers. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing HTTP Headers from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain HTTP Headers in a senior frontend interview?",
      "answerHint": "HTTP Headers is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for http headers can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether http headers succeeds in production. // HTTP Headers — minimal browser example\nconsole.log('[b3-http-headers]', typeof document);\n// Open DevTools → verify b"
    }
  ],
  "pitfalls": [
    "Interview trap: describing HTTP Headers from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain HTTP Headers at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "HTTP Headers is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is HTTP Headers?",
      "When would HTTP Headers block rendering or fail cross-origin?",
      "What is the classic HTTP Headers interview trap?"
    ],
    "traps": [
      "Interview trap: describing HTTP Headers from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide http headers details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around HTTP Headers."
    ]
  }
})
