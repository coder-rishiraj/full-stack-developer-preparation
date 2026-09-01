import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Fetch vs XMLHttpRequest",
  "whatIsIt": "Fetch vs XMLHttpRequest is a core Web Platform concept in Fetch API. It belongs to the Fetch API for network requests in the browser. Understanding Fetch vs XMLHttpRequest helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide fetch vs xmlhttprequest details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Fetch vs XMLHttpRequest as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Fetch vs XMLHttpRequest in B3.11 — Fetch API: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Fetch vs XMLHttpRequest to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about fetch vs xmlhttprequest.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Fetch vs XMLHttpRequest from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Fetch vs XMLHttpRequest — minimal browser example\nconsole.log('[b3-fetch-vs-xhr]', typeof document);\n// Open DevTools → verify behavior for: Fetch vs XMLHttpRequest\n// Spec reference: developer.mozilla.org (search \"Fetch vs XMLHttpRequest\")",
  "exampleCaption": "Fetch vs XMLHttpRequest — observe in DevTools while this runs",
  "internals": [
    "Fetch vs XMLHttpRequest is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for fetch vs xmlhttprequest can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether fetch vs xmlhttprequest succeeds in production."
  ],
  "takeaways": [
    "Locate Fetch vs XMLHttpRequest in B3.11 — Fetch API: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Fetch vs XMLHttpRequest to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Fetch vs XMLHttpRequest from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Fetch vs XMLHttpRequest is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Fetch vs XMLHttpRequest: Treat Fetch vs XMLHttpRequest as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Fetch vs XMLHttpRequest in B3.11 — Fetch API: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Fetch vs XMLHttpRequest to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Fetch vs XMLHttpRequest from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Fetch vs XMLHttpRequest",
      "Fetch vs XMLHttpRequest is a core Web Platform concept in Fetch API."
    ],
    [
      "Mental model",
      "Treat Fetch vs XMLHttpRequest as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Fetch vs XMLHttpRequest from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Fetch vs XMLHttpRequest in B3.11 — Fetch API: map it to MDN reference doc",
      "Connect Fetch vs XMLHttpRequest to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Fetch vs XMLHttpRequest in the browser and when do you use it?",
      "answerHint": "Fetch vs XMLHttpRequest is a core Web Platform concept in Fetch API. It belongs to the Fetch API for network requests in the browser. Understanding Fetch vs XMLHttpRequest helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Fetch vs XMLHttpRequest with a DevTools observation and one pitfall.",
      "answerHint": "Locate Fetch vs XMLHttpRequest in B3.11 — Fetch API: map it to MDN reference docs and observe behavior in DevTools. Connect Fetch vs XMLHttpRequest to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about fetch vs xmlhttprequest. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Fetch vs XMLHttpRequest from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Fetch vs XMLHttpRequest in a senior frontend interview?",
      "answerHint": "Fetch vs XMLHttpRequest is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for fetch vs xmlhttprequest can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether fetch vs xmlhttprequest succeeds in production. // Fetch vs XMLHttpRequest — minimal browser example\nconsole.log('[b3-fetch-vs-xhr]', typeof document);\n// Open DevTools"
    }
  ],
  "pitfalls": [
    "Interview trap: describing Fetch vs XMLHttpRequest from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Fetch vs XMLHttpRequest at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Fetch vs XMLHttpRequest is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Fetch vs XMLHttpRequest?",
      "When would Fetch vs XMLHttpRequest block rendering or fail cross-origin?",
      "What is the classic Fetch vs XMLHttpRequest interview trap?"
    ],
    "traps": [
      "Interview trap: describing Fetch vs XMLHttpRequest from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide fetch vs xmlhttprequest details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Fetch vs XMLHttpRequest."
    ]
  }
})
