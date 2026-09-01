import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Blob Constructor",
  "whatIsIt": "Blob Constructor is a core Web Platform concept in Blob & File APIs. It belongs to Blob, File, and object URL APIs. Understanding Blob Constructor helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide blob constructor details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Blob Constructor as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Blob Constructor in B3.26 — Blob & File APIs: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Blob Constructor to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about blob constructor.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Blob Constructor from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Blob Constructor — minimal browser example\nconsole.log('[b3-blob-constructor]', typeof document);\n// Open DevTools → verify behavior for: Blob Constructor\n// Spec reference: developer.mozilla.org (search \"Blob Constructor\")",
  "exampleCaption": "Blob Constructor — observe in DevTools while this runs",
  "internals": [
    "Blob Constructor is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for blob constructor can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether blob constructor succeeds in production."
  ],
  "takeaways": [
    "Locate Blob Constructor in B3.26 — Blob & File APIs: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Blob Constructor to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Blob Constructor from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Blob Constructor is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Blob Constructor: Treat Blob Constructor as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Blob Constructor in B3.26 — Blob & File APIs: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Blob Constructor to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Blob Constructor from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Blob Constructor",
      "Blob Constructor is a core Web Platform concept in Blob & File APIs."
    ],
    [
      "Mental model",
      "Treat Blob Constructor as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Blob Constructor from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Blob Constructor in B3.26 — Blob & File APIs: map it to MDN reference doc",
      "Connect Blob Constructor to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Blob Constructor in the browser and when do you use it?",
      "answerHint": "Blob Constructor is a core Web Platform concept in Blob & File APIs. It belongs to Blob, File, and object URL APIs. Understanding Blob Constructor helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Blob Constructor with a DevTools observation and one pitfall.",
      "answerHint": "Locate Blob Constructor in B3.26 — Blob & File APIs: map it to MDN reference docs and observe behavior in DevTools. Connect Blob Constructor to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about blob constructor. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Blob Constructor from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Blob Constructor in a senior frontend interview?",
      "answerHint": "Blob Constructor is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for blob constructor can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether blob constructor succeeds in production. // Blob Constructor — minimal browser example\nconsole.log('[b3-blob-constructor]', typeof document);\n// Open DevTools → "
    }
  ],
  "pitfalls": [
    "Interview trap: describing Blob Constructor from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Blob Constructor at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Blob Constructor is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Blob Constructor?",
      "When would Blob Constructor block rendering or fail cross-origin?",
      "What is the classic Blob Constructor interview trap?"
    ],
    "traps": [
      "Interview trap: describing Blob Constructor from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide blob constructor details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Blob Constructor."
    ]
  }
})
