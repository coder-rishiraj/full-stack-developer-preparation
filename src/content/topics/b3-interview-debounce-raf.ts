import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Debounce vs rAF vs setTimeout",
  "whatIsIt": "Debounce vs rAF vs setTimeout is a core Web Platform concept in Browser Interview Scenarios. It belongs to senior frontend browser interview reasoning. Understanding Debounce vs rAF vs setTimeout helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide debounce vs raf vs settimeout details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Debounce vs rAF vs setTimeout as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Debounce vs rAF vs setTimeout in B3.37 — Browser Interview Scenarios: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Debounce vs rAF vs setTimeout to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about debounce vs raf vs settimeout.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Debounce vs rAF vs setTimeout from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Debounce vs rAF vs setTimeout — minimal browser example\nconsole.log('[b3-interview-debounce-raf]', typeof document);\n// Open DevTools → verify behavior for: Debounce vs rAF vs setTimeout\n// Spec reference: developer.mozilla.org (search \"Debounce vs rAF vs setTimeout\")",
  "exampleCaption": "Debounce vs rAF vs setTimeout — observe in DevTools while this runs",
  "internals": [
    "Debounce vs rAF vs setTimeout is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for debounce vs raf vs settimeout can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether debounce vs raf vs settimeout succeeds in production."
  ],
  "takeaways": [
    "Locate Debounce vs rAF vs setTimeout in B3.37 — Browser Interview Scenarios: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Debounce vs rAF vs setTimeout to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Debounce vs rAF vs setTimeout from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Debounce vs rAF vs setTimeout is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Debounce vs rAF vs setTimeout: Treat Debounce vs rAF vs setTimeout as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Debounce vs rAF vs setTimeout in B3.37 — Browser Interview Scenarios: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Debounce vs rAF vs setTimeout to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Debounce vs rAF vs setTimeout from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Debounce vs rAF vs setTimeout",
      "Debounce vs rAF vs setTimeout is a core Web Platform concept in Browser Interview Scenarios."
    ],
    [
      "Mental model",
      "Treat Debounce vs rAF vs setTimeout as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Debounce vs rAF vs setTimeout from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Debounce vs rAF vs setTimeout in B3.37 — Browser Interview Scenarios: map",
      "Connect Debounce vs rAF vs setTimeout to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Debounce vs rAF vs setTimeout in the browser and when do you use it?",
      "answerHint": "Debounce vs rAF vs setTimeout is a core Web Platform concept in Browser Interview Scenarios. It belongs to senior frontend browser interview reasoning. Understanding Debounce vs rAF vs setTimeout helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Debounce vs rAF vs setTimeout with a DevTools observation and one pitfall.",
      "answerHint": "Locate Debounce vs rAF vs setTimeout in B3.37 — Browser Interview Scenarios: map it to MDN reference docs and observe behavior in DevTools. Connect Debounce vs rAF vs setTimeout to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about debounce vs raf vs settimeout. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Debounce vs rAF vs setTimeout from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Debounce vs rAF vs setTimeout in a senior frontend interview?",
      "answerHint": "Debounce vs rAF vs setTimeout is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for debounce vs raf vs settimeout can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether debounce vs raf vs settimeout succeeds in production. // Debounce vs rAF vs setTimeout — minimal browser example\nconsole.log('[b3-interview-debounce-raf]', typeof document);\n"
    }
  ],
  "pitfalls": [
    "Interview trap: describing Debounce vs rAF vs setTimeout from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Debounce vs rAF vs setTimeout at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Debounce vs rAF vs setTimeout is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Debounce vs rAF vs setTimeout?",
      "When would Debounce vs rAF vs setTimeout block rendering or fail cross-origin?",
      "What is the classic Debounce vs rAF vs setTimeout interview trap?"
    ],
    "traps": [
      "Interview trap: describing Debounce vs rAF vs setTimeout from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide debounce vs raf vs settimeout details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Debounce vs rAF vs setTimeout."
    ]
  }
})
