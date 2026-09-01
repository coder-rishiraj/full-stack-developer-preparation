import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "scheme / host / port / path / query / hash",
  "whatIsIt": "scheme / host / port / path / query / hash is a core Web Platform concept in URL & URL APIs. It belongs to URL anatomy, URL API, and encoding. Understanding scheme / host / port / path / query / hash helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide scheme / host / port / path / query / hash details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat scheme / host / port / path / query / hash as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate scheme / host / port / path / query / hash in B3.31 — URL & URL APIs: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect scheme / host / port / path / query / hash to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about scheme / host / port / path / query / hash.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing scheme / host / port / path / query / hash from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// scheme / host / port / path / query / hash — minimal browser example\nconsole.log('[b3-url-components]', typeof document);\n// Open DevTools → verify behavior for: scheme / host / port / path / query / hash\n// Spec reference: developer.mozilla.org (search \"scheme / host / port / path / query / hash\")",
  "exampleCaption": "scheme / host / port / path / query / hash — observe in DevTools while this runs",
  "internals": [
    "scheme / host / port / path / query / hash is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for scheme / host / port / path / query / hash can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether scheme / host / port / path / query / hash succeeds in production."
  ],
  "takeaways": [
    "Locate scheme / host / port / path / query / hash in B3.31 — URL & URL APIs: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect scheme / host / port / path / query / hash to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing scheme / host / port / path / query / hash from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "scheme / host / port / path / query / hash is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "scheme / host / port / path / query / hash: Treat scheme / host / port / path / query / hash as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate scheme / host / port / path / query / hash in B3.31 — URL & URL APIs: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect scheme / host / port / path / query / hash to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing scheme / host / port / path / query / hash from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "scheme / host / port / path / query / hash",
      "scheme / host / port / path / query / hash is a core Web Platform concept in URL & URL APIs."
    ],
    [
      "Mental model",
      "Treat scheme / host / port / path / query / hash as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing scheme / host / port / path / query / hash from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate scheme / host / port / path / query / hash in B3.31 — URL & URL APIs: map",
      "Connect scheme / host / port / path / query / hash to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is scheme / host / port / path / query / hash in the browser and when do you use it?",
      "answerHint": "scheme / host / port / path / query / hash is a core Web Platform concept in URL & URL APIs. It belongs to URL anatomy, URL API, and encoding. Understanding scheme / host / port / path / query / hash helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain scheme / host / port / path / query / hash with a DevTools observation and one pitfall.",
      "answerHint": "Locate scheme / host / port / path / query / hash in B3.31 — URL & URL APIs: map it to MDN reference docs and observe behavior in DevTools. Connect scheme / host / port / path / query / hash to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about scheme / host / port / path / query / hash. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing scheme / host / port / path / query / hash from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain scheme / host / port / path / query / hash in a senior frontend interview?",
      "answerHint": "scheme / host / port / path / query / hash is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for scheme / host / port / path / query / hash can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether scheme / host / port / path / query / hash succeeds in production. // scheme / host / port / path / query / hash — minimal browser example\nconsole.log('[b3-url-components]', typeof docume"
    }
  ],
  "pitfalls": [
    "Interview trap: describing scheme / host / port / path / query / hash from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain scheme / host / port / path / query / hash at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "scheme / host / port / path / query / hash is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is scheme / host / port / path / query / hash?",
      "When would scheme / host / port / path / query / hash block rendering or fail cross-origin?",
      "What is the classic scheme / host / port / path / query / hash interview trap?"
    ],
    "traps": [
      "Interview trap: describing scheme / host / port / path / query / hash from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide scheme / host / port / path / query / hash details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around scheme / host / port / path / query / hash."
    ]
  }
})
