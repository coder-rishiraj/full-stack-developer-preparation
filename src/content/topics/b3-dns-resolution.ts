import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "DNS Resolution",
  "whatIsIt": "DNS Resolution is a core Web Platform concept in Browser Architecture. It belongs to browser processes, threads, and navigation lifecycle. Understanding DNS Resolution helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide dns resolution details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat DNS Resolution as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate DNS Resolution in B3.1 — Browser Architecture: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect DNS Resolution to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about dns resolution.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing DNS Resolution from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// DNS Resolution — minimal browser example\nconsole.log('[b3-dns-resolution]', typeof document);\n// Open DevTools → verify behavior for: DNS Resolution\n// Spec reference: developer.mozilla.org (search \"DNS Resolution\")",
  "exampleCaption": "DNS Resolution — observe in DevTools while this runs",
  "internals": [
    "DNS Resolution is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for dns resolution can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether dns resolution succeeds in production."
  ],
  "takeaways": [
    "Locate DNS Resolution in B3.1 — Browser Architecture: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect DNS Resolution to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing DNS Resolution from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "DNS Resolution is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "DNS Resolution: Treat DNS Resolution as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate DNS Resolution in B3.1 — Browser Architecture: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect DNS Resolution to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing DNS Resolution from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "DNS Resolution",
      "DNS Resolution is a core Web Platform concept in Browser Architecture."
    ],
    [
      "Mental model",
      "Treat DNS Resolution as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing DNS Resolution from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate DNS Resolution in B3.1 — Browser Architecture: map it to MDN reference do",
      "Connect DNS Resolution to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is DNS Resolution in the browser and when do you use it?",
      "answerHint": "DNS Resolution is a core Web Platform concept in Browser Architecture. It belongs to browser processes, threads, and navigation lifecycle. Understanding DNS Resolution helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain DNS Resolution with a DevTools observation and one pitfall.",
      "answerHint": "Locate DNS Resolution in B3.1 — Browser Architecture: map it to MDN reference docs and observe behavior in DevTools. Connect DNS Resolution to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about dns resolution. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing DNS Resolution from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain DNS Resolution in a senior frontend interview?",
      "answerHint": "DNS Resolution is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for dns resolution can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether dns resolution succeeds in production. // DNS Resolution — minimal browser example\nconsole.log('[b3-dns-resolution]', typeof document);\n// Open DevTools → veri"
    }
  ],
  "pitfalls": [
    "Interview trap: describing DNS Resolution from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain DNS Resolution at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "DNS Resolution is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is DNS Resolution?",
      "When would DNS Resolution block rendering or fail cross-origin?",
      "What is the classic DNS Resolution interview trap?"
    ],
    "traps": [
      "Interview trap: describing DNS Resolution from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide dns resolution details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around DNS Resolution."
    ]
  }
})
