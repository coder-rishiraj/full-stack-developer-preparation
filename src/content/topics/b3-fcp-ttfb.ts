import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "FCP & TTFB",
  "whatIsIt": "FCP & TTFB is a core Web Platform concept in Browser Performance. It belongs to browser performance metrics, Core Web Vitals, and profiling. Understanding FCP & TTFB helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide fcp & ttfb details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat FCP & TTFB as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate FCP & TTFB in B3.27 — Browser Performance: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect FCP & TTFB to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about fcp & ttfb.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing FCP & TTFB from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// FCP & TTFB — minimal browser example\nconsole.log('[b3-fcp-ttfb]', typeof document);\n// Open DevTools → verify behavior for: FCP & TTFB\n// Spec reference: developer.mozilla.org (search \"FCP & TTFB\")",
  "exampleCaption": "FCP & TTFB — observe in DevTools while this runs",
  "internals": [
    "FCP & TTFB is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for fcp & ttfb can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether fcp & ttfb succeeds in production."
  ],
  "takeaways": [
    "Locate FCP & TTFB in B3.27 — Browser Performance: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect FCP & TTFB to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing FCP & TTFB from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "FCP & TTFB is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "FCP & TTFB: Treat FCP & TTFB as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate FCP & TTFB in B3.27 — Browser Performance: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect FCP & TTFB to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing FCP & TTFB from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "FCP & TTFB",
      "FCP & TTFB is a core Web Platform concept in Browser Performance."
    ],
    [
      "Mental model",
      "Treat FCP & TTFB as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing FCP & TTFB from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate FCP & TTFB in B3.27 — Browser Performance: map it to MDN reference docs a",
      "Connect FCP & TTFB to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is FCP & TTFB in the browser and when do you use it?",
      "answerHint": "FCP & TTFB is a core Web Platform concept in Browser Performance. It belongs to browser performance metrics, Core Web Vitals, and profiling. Understanding FCP & TTFB helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain FCP & TTFB with a DevTools observation and one pitfall.",
      "answerHint": "Locate FCP & TTFB in B3.27 — Browser Performance: map it to MDN reference docs and observe behavior in DevTools. Connect FCP & TTFB to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about fcp & ttfb. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing FCP & TTFB from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain FCP & TTFB in a senior frontend interview?",
      "answerHint": "FCP & TTFB is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for fcp & ttfb can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether fcp & ttfb succeeds in production. // FCP & TTFB — minimal browser example\nconsole.log('[b3-fcp-ttfb]', typeof document);\n// Open DevTools → verify behavio"
    }
  ],
  "pitfalls": [
    "Interview trap: describing FCP & TTFB from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain FCP & TTFB at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "FCP & TTFB is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is FCP & TTFB?",
      "When would FCP & TTFB block rendering or fail cross-origin?",
      "What is the classic FCP & TTFB interview trap?"
    ],
    "traps": [
      "Interview trap: describing FCP & TTFB from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide fcp & ttfb details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around FCP & TTFB."
    ]
  }
})
