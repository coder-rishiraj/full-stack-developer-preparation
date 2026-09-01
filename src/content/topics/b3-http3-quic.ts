import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "HTTP/3 & QUIC",
  "whatIsIt": "HTTP/3 & QUIC is a core Web Platform concept in Browser HTTP. It belongs to HTTP from the browser perspective (requests, headers, caching). Understanding HTTP/3 & QUIC helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide http/3 & quic details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat HTTP/3 & QUIC as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate HTTP/3 & QUIC in B3.10 — Browser HTTP: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect HTTP/3 & QUIC to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about http/3 & quic.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing HTTP/3 & QUIC from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// HTTP/3 & QUIC — minimal browser example\nconsole.log('[b3-http3-quic]', typeof document);\n// Open DevTools → verify behavior for: HTTP/3 & QUIC\n// Spec reference: developer.mozilla.org (search \"HTTP/3 & QUIC\")",
  "exampleCaption": "HTTP/3 & QUIC — observe in DevTools while this runs",
  "internals": [
    "HTTP/3 & QUIC is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for http/3 & quic can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether http/3 & quic succeeds in production."
  ],
  "takeaways": [
    "Locate HTTP/3 & QUIC in B3.10 — Browser HTTP: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect HTTP/3 & QUIC to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing HTTP/3 & QUIC from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "HTTP/3 & QUIC is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "HTTP/3 & QUIC: Treat HTTP/3 & QUIC as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate HTTP/3 & QUIC in B3.10 — Browser HTTP: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect HTTP/3 & QUIC to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing HTTP/3 & QUIC from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "HTTP/3 & QUIC",
      "HTTP/3 & QUIC is a core Web Platform concept in Browser HTTP."
    ],
    [
      "Mental model",
      "Treat HTTP/3 & QUIC as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing HTTP/3 & QUIC from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate HTTP/3 & QUIC in B3.10 — Browser HTTP: map it to MDN reference docs and o",
      "Connect HTTP/3 & QUIC to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is HTTP/3 & QUIC in the browser and when do you use it?",
      "answerHint": "HTTP/3 & QUIC is a core Web Platform concept in Browser HTTP. It belongs to HTTP from the browser perspective (requests, headers, caching). Understanding HTTP/3 & QUIC helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain HTTP/3 & QUIC with a DevTools observation and one pitfall.",
      "answerHint": "Locate HTTP/3 & QUIC in B3.10 — Browser HTTP: map it to MDN reference docs and observe behavior in DevTools. Connect HTTP/3 & QUIC to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about http/3 & quic. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing HTTP/3 & QUIC from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain HTTP/3 & QUIC in a senior frontend interview?",
      "answerHint": "HTTP/3 & QUIC is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for http/3 & quic can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether http/3 & quic succeeds in production. // HTTP/3 & QUIC — minimal browser example\nconsole.log('[b3-http3-quic]', typeof document);\n// Open DevTools → verify be"
    }
  ],
  "pitfalls": [
    "Interview trap: describing HTTP/3 & QUIC from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain HTTP/3 & QUIC at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "HTTP/3 & QUIC is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is HTTP/3 & QUIC?",
      "When would HTTP/3 & QUIC block rendering or fail cross-origin?",
      "What is the classic HTTP/3 & QUIC interview trap?"
    ],
    "traps": [
      "Interview trap: describing HTTP/3 & QUIC from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide http/3 & quic details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around HTTP/3 & QUIC."
    ]
  }
})
