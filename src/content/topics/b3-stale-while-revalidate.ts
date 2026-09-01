import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "stale-while-revalidate",
  "whatIsIt": "stale-while-revalidate is a core Web Platform concept in Browser Caching. It belongs to browser HTTP caching, validation, and cache layers. Understanding stale-while-revalidate helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide stale-while-revalidate details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat stale-while-revalidate as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate stale-while-revalidate in B3.18 — Browser Caching: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect stale-while-revalidate to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about stale-while-revalidate.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing stale-while-revalidate from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// stale-while-revalidate — minimal browser example\nconsole.log('[b3-stale-while-revalidate]', typeof document);\n// Open DevTools → verify behavior for: stale-while-revalidate\n// Spec reference: developer.mozilla.org (search \"stale-while-revalidate\")",
  "exampleCaption": "stale-while-revalidate — observe in DevTools while this runs",
  "internals": [
    "stale-while-revalidate is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for stale-while-revalidate can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether stale-while-revalidate succeeds in production."
  ],
  "takeaways": [
    "Locate stale-while-revalidate in B3.18 — Browser Caching: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect stale-while-revalidate to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing stale-while-revalidate from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "stale-while-revalidate is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "stale-while-revalidate: Treat stale-while-revalidate as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate stale-while-revalidate in B3.18 — Browser Caching: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect stale-while-revalidate to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing stale-while-revalidate from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "stale-while-revalidate",
      "stale-while-revalidate is a core Web Platform concept in Browser Caching."
    ],
    [
      "Mental model",
      "Treat stale-while-revalidate as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing stale-while-revalidate from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate stale-while-revalidate in B3.18 — Browser Caching: map it to MDN referenc",
      "Connect stale-while-revalidate to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is stale-while-revalidate in the browser and when do you use it?",
      "answerHint": "stale-while-revalidate is a core Web Platform concept in Browser Caching. It belongs to browser HTTP caching, validation, and cache layers. Understanding stale-while-revalidate helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain stale-while-revalidate with a DevTools observation and one pitfall.",
      "answerHint": "Locate stale-while-revalidate in B3.18 — Browser Caching: map it to MDN reference docs and observe behavior in DevTools. Connect stale-while-revalidate to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about stale-while-revalidate. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing stale-while-revalidate from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain stale-while-revalidate in a senior frontend interview?",
      "answerHint": "stale-while-revalidate is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for stale-while-revalidate can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether stale-while-revalidate succeeds in production. // stale-while-revalidate — minimal browser example\nconsole.log('[b3-stale-while-revalidate]', typeof document);\n// Open"
    }
  ],
  "pitfalls": [
    "Interview trap: describing stale-while-revalidate from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain stale-while-revalidate at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "stale-while-revalidate is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is stale-while-revalidate?",
      "When would stale-while-revalidate block rendering or fail cross-origin?",
      "What is the classic stale-while-revalidate interview trap?"
    ],
    "traps": [
      "Interview trap: describing stale-while-revalidate from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide stale-while-revalidate details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around stale-while-revalidate."
    ]
  }
})
