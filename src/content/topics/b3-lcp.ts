import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Largest Contentful Paint (LCP)",
  "whatIsIt": "Largest Contentful Paint (LCP) is a core Web Platform concept in Browser Performance. It belongs to browser performance metrics, Core Web Vitals, and profiling. Understanding Largest Contentful Paint (LCP) helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide largest contentful paint (lcp) details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Largest Contentful Paint (LCP) as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Largest Contentful Paint (LCP) in B3.27 — Browser Performance: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Largest Contentful Paint (LCP) to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about largest contentful paint (lcp).",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Largest Contentful Paint (LCP) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Largest Contentful Paint (LCP) — minimal browser example\nconsole.log('[b3-lcp]', typeof document);\n// Open DevTools → verify behavior for: Largest Contentful Paint (LCP)\n// Spec reference: developer.mozilla.org (search \"Largest Contentful Paint (LCP)\")",
  "exampleCaption": "Largest Contentful Paint (LCP) — observe in DevTools while this runs",
  "internals": [
    "Largest Contentful Paint (LCP) is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for largest contentful paint (lcp) can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether largest contentful paint (lcp) succeeds in production."
  ],
  "takeaways": [
    "Locate Largest Contentful Paint (LCP) in B3.27 — Browser Performance: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Largest Contentful Paint (LCP) to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Largest Contentful Paint (LCP) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Largest Contentful Paint (LCP) is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Largest Contentful Paint (LCP): Treat Largest Contentful Paint (LCP) as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Largest Contentful Paint (LCP) in B3.27 — Browser Performance: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Largest Contentful Paint (LCP) to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Largest Contentful Paint (LCP) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Largest Contentful Paint (LCP)",
      "Largest Contentful Paint (LCP) is a core Web Platform concept in Browser Performance."
    ],
    [
      "Mental model",
      "Treat Largest Contentful Paint (LCP) as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Largest Contentful Paint (LCP) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Largest Contentful Paint (LCP) in B3.27 — Browser Performance: map it to ",
      "Connect Largest Contentful Paint (LCP) to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Largest Contentful Paint (LCP) in the browser and when do you use it?",
      "answerHint": "Largest Contentful Paint (LCP) is a core Web Platform concept in Browser Performance. It belongs to browser performance metrics, Core Web Vitals, and profiling. Understanding Largest Contentful Paint (LCP) helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Largest Contentful Paint (LCP) with a DevTools observation and one pitfall.",
      "answerHint": "Locate Largest Contentful Paint (LCP) in B3.27 — Browser Performance: map it to MDN reference docs and observe behavior in DevTools. Connect Largest Contentful Paint (LCP) to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about largest contentful paint (lcp). Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Largest Contentful Paint (LCP) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Largest Contentful Paint (LCP) in a senior frontend interview?",
      "answerHint": "Largest Contentful Paint (LCP) is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for largest contentful paint (lcp) can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether largest contentful paint (lcp) succeeds in production. // Largest Contentful Paint (LCP) — minimal browser example\nconsole.log('[b3-lcp]', typeof document);\n// Open DevTools →"
    }
  ],
  "pitfalls": [
    "Interview trap: describing Largest Contentful Paint (LCP) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Largest Contentful Paint (LCP) at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Largest Contentful Paint (LCP) is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Largest Contentful Paint (LCP)?",
      "When would Largest Contentful Paint (LCP) block rendering or fail cross-origin?",
      "What is the classic Largest Contentful Paint (LCP) interview trap?"
    ],
    "traps": [
      "Interview trap: describing Largest Contentful Paint (LCP) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide largest contentful paint (lcp) details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Largest Contentful Paint (LCP)."
    ]
  }
})
