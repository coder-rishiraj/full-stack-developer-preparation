import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Cumulative Layout Shift (CLS)",
  "whatIsIt": "Cumulative Layout Shift (CLS) is a core Web Platform concept in Browser Performance. It belongs to browser performance metrics, Core Web Vitals, and profiling. Understanding Cumulative Layout Shift (CLS) helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide cumulative layout shift (cls) details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Cumulative Layout Shift (CLS) as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Cumulative Layout Shift (CLS) in B3.27 — Browser Performance: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Cumulative Layout Shift (CLS) to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about cumulative layout shift (cls).",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Cumulative Layout Shift (CLS) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Cumulative Layout Shift (CLS) — minimal browser example\nconsole.log('[b3-cls]', typeof document);\n// Open DevTools → verify behavior for: Cumulative Layout Shift (CLS)\n// Spec reference: developer.mozilla.org (search \"Cumulative Layout Shift (CLS)\")",
  "exampleCaption": "Cumulative Layout Shift (CLS) — observe in DevTools while this runs",
  "internals": [
    "Cumulative Layout Shift (CLS) is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for cumulative layout shift (cls) can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether cumulative layout shift (cls) succeeds in production."
  ],
  "takeaways": [
    "Locate Cumulative Layout Shift (CLS) in B3.27 — Browser Performance: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Cumulative Layout Shift (CLS) to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Cumulative Layout Shift (CLS) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Cumulative Layout Shift (CLS) is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Cumulative Layout Shift (CLS): Treat Cumulative Layout Shift (CLS) as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Cumulative Layout Shift (CLS) in B3.27 — Browser Performance: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Cumulative Layout Shift (CLS) to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Cumulative Layout Shift (CLS) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Cumulative Layout Shift (CLS)",
      "Cumulative Layout Shift (CLS) is a core Web Platform concept in Browser Performance."
    ],
    [
      "Mental model",
      "Treat Cumulative Layout Shift (CLS) as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Cumulative Layout Shift (CLS) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Cumulative Layout Shift (CLS) in B3.27 — Browser Performance: map it to M",
      "Connect Cumulative Layout Shift (CLS) to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Cumulative Layout Shift (CLS) in the browser and when do you use it?",
      "answerHint": "Cumulative Layout Shift (CLS) is a core Web Platform concept in Browser Performance. It belongs to browser performance metrics, Core Web Vitals, and profiling. Understanding Cumulative Layout Shift (CLS) helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Cumulative Layout Shift (CLS) with a DevTools observation and one pitfall.",
      "answerHint": "Locate Cumulative Layout Shift (CLS) in B3.27 — Browser Performance: map it to MDN reference docs and observe behavior in DevTools. Connect Cumulative Layout Shift (CLS) to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about cumulative layout shift (cls). Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Cumulative Layout Shift (CLS) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Cumulative Layout Shift (CLS) in a senior frontend interview?",
      "answerHint": "Cumulative Layout Shift (CLS) is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for cumulative layout shift (cls) can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether cumulative layout shift (cls) succeeds in production. // Cumulative Layout Shift (CLS) — minimal browser example\nconsole.log('[b3-cls]', typeof document);\n// Open DevTools → "
    }
  ],
  "pitfalls": [
    "Interview trap: describing Cumulative Layout Shift (CLS) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Cumulative Layout Shift (CLS) at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Cumulative Layout Shift (CLS) is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Cumulative Layout Shift (CLS)?",
      "When would Cumulative Layout Shift (CLS) block rendering or fail cross-origin?",
      "What is the classic Cumulative Layout Shift (CLS) interview trap?"
    ],
    "traps": [
      "Interview trap: describing Cumulative Layout Shift (CLS) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide cumulative layout shift (cls) details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Cumulative Layout Shift (CLS)."
    ]
  }
})
