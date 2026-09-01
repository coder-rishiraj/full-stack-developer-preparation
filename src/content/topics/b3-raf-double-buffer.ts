import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Double rAF Pattern",
  "whatIsIt": "Double rAF Pattern is a core Web Platform concept in requestAnimationFrame. It belongs to requestAnimationFrame and frame-aligned updates. Understanding Double rAF Pattern helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide double raf pattern details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Double rAF Pattern as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Double rAF Pattern in B3.9 — requestAnimationFrame: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Double rAF Pattern to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about double raf pattern.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Double rAF Pattern from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Double rAF Pattern — minimal browser example\nconsole.log('[b3-raf-double-buffer]', typeof document);\n// Open DevTools → verify behavior for: Double rAF Pattern\n// Spec reference: developer.mozilla.org (search \"Double rAF Pattern\")",
  "exampleCaption": "Double rAF Pattern — observe in DevTools while this runs",
  "internals": [
    "Double rAF Pattern is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for double raf pattern can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether double raf pattern succeeds in production."
  ],
  "takeaways": [
    "Locate Double rAF Pattern in B3.9 — requestAnimationFrame: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Double rAF Pattern to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Double rAF Pattern from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Double rAF Pattern is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Double rAF Pattern: Treat Double rAF Pattern as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Double rAF Pattern in B3.9 — requestAnimationFrame: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Double rAF Pattern to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Double rAF Pattern from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Double rAF Pattern",
      "Double rAF Pattern is a core Web Platform concept in requestAnimationFrame."
    ],
    [
      "Mental model",
      "Treat Double rAF Pattern as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Double rAF Pattern from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Double rAF Pattern in B3.9 — requestAnimationFrame: map it to MDN referen",
      "Connect Double rAF Pattern to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Double rAF Pattern in the browser and when do you use it?",
      "answerHint": "Double rAF Pattern is a core Web Platform concept in requestAnimationFrame. It belongs to requestAnimationFrame and frame-aligned updates. Understanding Double rAF Pattern helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Double rAF Pattern with a DevTools observation and one pitfall.",
      "answerHint": "Locate Double rAF Pattern in B3.9 — requestAnimationFrame: map it to MDN reference docs and observe behavior in DevTools. Connect Double rAF Pattern to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about double raf pattern. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Double rAF Pattern from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Double rAF Pattern in a senior frontend interview?",
      "answerHint": "Double rAF Pattern is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for double raf pattern can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether double raf pattern succeeds in production. // Double rAF Pattern — minimal browser example\nconsole.log('[b3-raf-double-buffer]', typeof document);\n// Open DevTools"
    }
  ],
  "pitfalls": [
    "Interview trap: describing Double rAF Pattern from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Double rAF Pattern at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Double rAF Pattern is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Double rAF Pattern?",
      "When would Double rAF Pattern block rendering or fail cross-origin?",
      "What is the classic Double rAF Pattern interview trap?"
    ],
    "traps": [
      "Interview trap: describing Double rAF Pattern from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide double raf pattern details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Double rAF Pattern."
    ]
  }
})
