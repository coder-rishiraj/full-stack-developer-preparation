import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Memory Cache vs Disk Cache",
  "whatIsIt": "Memory Cache vs Disk Cache is a core Web Platform concept in Browser Caching. It belongs to browser HTTP caching, validation, and cache layers. Understanding Memory Cache vs Disk Cache helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide memory cache vs disk cache details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Memory Cache vs Disk Cache as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Memory Cache vs Disk Cache in B3.18 — Browser Caching: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Memory Cache vs Disk Cache to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about memory cache vs disk cache.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Memory Cache vs Disk Cache from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Memory Cache vs Disk Cache — minimal browser example\nconsole.log('[b3-memory-disk-cache]', typeof document);\n// Open DevTools → verify behavior for: Memory Cache vs Disk Cache\n// Spec reference: developer.mozilla.org (search \"Memory Cache vs Disk Cache\")",
  "exampleCaption": "Memory Cache vs Disk Cache — observe in DevTools while this runs",
  "internals": [
    "Memory Cache vs Disk Cache is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for memory cache vs disk cache can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether memory cache vs disk cache succeeds in production."
  ],
  "takeaways": [
    "Locate Memory Cache vs Disk Cache in B3.18 — Browser Caching: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Memory Cache vs Disk Cache to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Memory Cache vs Disk Cache from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Memory Cache vs Disk Cache is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Memory Cache vs Disk Cache: Treat Memory Cache vs Disk Cache as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Memory Cache vs Disk Cache in B3.18 — Browser Caching: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Memory Cache vs Disk Cache to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Memory Cache vs Disk Cache from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Memory Cache vs Disk Cache",
      "Memory Cache vs Disk Cache is a core Web Platform concept in Browser Caching."
    ],
    [
      "Mental model",
      "Treat Memory Cache vs Disk Cache as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Memory Cache vs Disk Cache from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Memory Cache vs Disk Cache in B3.18 — Browser Caching: map it to MDN refe",
      "Connect Memory Cache vs Disk Cache to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Memory Cache vs Disk Cache in the browser and when do you use it?",
      "answerHint": "Memory Cache vs Disk Cache is a core Web Platform concept in Browser Caching. It belongs to browser HTTP caching, validation, and cache layers. Understanding Memory Cache vs Disk Cache helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Memory Cache vs Disk Cache with a DevTools observation and one pitfall.",
      "answerHint": "Locate Memory Cache vs Disk Cache in B3.18 — Browser Caching: map it to MDN reference docs and observe behavior in DevTools. Connect Memory Cache vs Disk Cache to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about memory cache vs disk cache. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Memory Cache vs Disk Cache from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Memory Cache vs Disk Cache in a senior frontend interview?",
      "answerHint": "Memory Cache vs Disk Cache is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for memory cache vs disk cache can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether memory cache vs disk cache succeeds in production. // Memory Cache vs Disk Cache — minimal browser example\nconsole.log('[b3-memory-disk-cache]', typeof document);\n// Open "
    }
  ],
  "pitfalls": [
    "Interview trap: describing Memory Cache vs Disk Cache from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Memory Cache vs Disk Cache at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Memory Cache vs Disk Cache is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Memory Cache vs Disk Cache?",
      "When would Memory Cache vs Disk Cache block rendering or fail cross-origin?",
      "What is the classic Memory Cache vs Disk Cache interview trap?"
    ],
    "traps": [
      "Interview trap: describing Memory Cache vs Disk Cache from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide memory cache vs disk cache details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Memory Cache vs Disk Cache."
    ]
  }
})
