import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Live Regions (aria-live)",
  "whatIsIt": "Live Regions (aria-live) is a core Web Platform concept in Accessibility Tree & Focus. It belongs to accessibility tree, focus, and keyboard navigation in the browser. Understanding Live Regions (aria-live) helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide live regions (aria-live) details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Live Regions (aria-live) as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Live Regions (aria-live) in B3.35 — Accessibility Tree & Focus: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Live Regions (aria-live) to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about live regions (aria-live).",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Live Regions (aria-live) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Live Regions (aria-live) — minimal browser example\nconsole.log('[b3-live-regions]', typeof document);\n// Open DevTools → verify behavior for: Live Regions (aria-live)\n// Spec reference: developer.mozilla.org (search \"Live Regions (aria-live)\")",
  "exampleCaption": "Live Regions (aria-live) — observe in DevTools while this runs",
  "internals": [
    "Live Regions (aria-live) is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for live regions (aria-live) can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether live regions (aria-live) succeeds in production."
  ],
  "takeaways": [
    "Locate Live Regions (aria-live) in B3.35 — Accessibility Tree & Focus: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Live Regions (aria-live) to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Live Regions (aria-live) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Live Regions (aria-live) is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Live Regions (aria-live): Treat Live Regions (aria-live) as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Live Regions (aria-live) in B3.35 — Accessibility Tree & Focus: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Live Regions (aria-live) to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Live Regions (aria-live) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Live Regions (aria-live)",
      "Live Regions (aria-live) is a core Web Platform concept in Accessibility Tree & Focus."
    ],
    [
      "Mental model",
      "Treat Live Regions (aria-live) as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Live Regions (aria-live) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Live Regions (aria-live) in B3.35 — Accessibility Tree & Focus: map it to",
      "Connect Live Regions (aria-live) to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Live Regions (aria-live) in the browser and when do you use it?",
      "answerHint": "Live Regions (aria-live) is a core Web Platform concept in Accessibility Tree & Focus. It belongs to accessibility tree, focus, and keyboard navigation in the browser. Understanding Live Regions (aria-live) helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Live Regions (aria-live) with a DevTools observation and one pitfall.",
      "answerHint": "Locate Live Regions (aria-live) in B3.35 — Accessibility Tree & Focus: map it to MDN reference docs and observe behavior in DevTools. Connect Live Regions (aria-live) to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about live regions (aria-live). Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Live Regions (aria-live) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Live Regions (aria-live) in a senior frontend interview?",
      "answerHint": "Live Regions (aria-live) is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for live regions (aria-live) can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether live regions (aria-live) succeeds in production. // Live Regions (aria-live) — minimal browser example\nconsole.log('[b3-live-regions]', typeof document);\n// Open DevTool"
    }
  ],
  "pitfalls": [
    "Interview trap: describing Live Regions (aria-live) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Live Regions (aria-live) at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Live Regions (aria-live) is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Live Regions (aria-live)?",
      "When would Live Regions (aria-live) block rendering or fail cross-origin?",
      "What is the classic Live Regions (aria-live) interview trap?"
    ],
    "traps": [
      "Interview trap: describing Live Regions (aria-live) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide live regions (aria-live) details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Live Regions (aria-live)."
    ]
  }
})
