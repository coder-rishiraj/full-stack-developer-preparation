import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Dedicated Workers",
  "whatIsIt": "Dedicated Workers is a core Web Platform concept in Web Workers. It belongs to Web Workers and off-main-thread computation. Understanding Dedicated Workers helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide dedicated workers details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Dedicated Workers as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Dedicated Workers in B3.21 — Web Workers: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Dedicated Workers to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about dedicated workers.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Dedicated Workers from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Dedicated Workers — minimal browser example\nconsole.log('[b3-dedicated-workers]', typeof document);\n// Open DevTools → verify behavior for: Dedicated Workers\n// Spec reference: developer.mozilla.org (search \"Dedicated Workers\")",
  "exampleCaption": "Dedicated Workers — observe in DevTools while this runs",
  "internals": [
    "Dedicated Workers is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for dedicated workers can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether dedicated workers succeeds in production."
  ],
  "takeaways": [
    "Locate Dedicated Workers in B3.21 — Web Workers: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Dedicated Workers to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Dedicated Workers from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Dedicated Workers is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Dedicated Workers: Treat Dedicated Workers as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Dedicated Workers in B3.21 — Web Workers: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Dedicated Workers to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Dedicated Workers from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Dedicated Workers",
      "Dedicated Workers is a core Web Platform concept in Web Workers."
    ],
    [
      "Mental model",
      "Treat Dedicated Workers as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Dedicated Workers from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Dedicated Workers in B3.21 — Web Workers: map it to MDN reference docs an",
      "Connect Dedicated Workers to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Dedicated Workers in the browser and when do you use it?",
      "answerHint": "Dedicated Workers is a core Web Platform concept in Web Workers. It belongs to Web Workers and off-main-thread computation. Understanding Dedicated Workers helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Dedicated Workers with a DevTools observation and one pitfall.",
      "answerHint": "Locate Dedicated Workers in B3.21 — Web Workers: map it to MDN reference docs and observe behavior in DevTools. Connect Dedicated Workers to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about dedicated workers. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Dedicated Workers from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Dedicated Workers in a senior frontend interview?",
      "answerHint": "Dedicated Workers is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for dedicated workers can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether dedicated workers succeeds in production. // Dedicated Workers — minimal browser example\nconsole.log('[b3-dedicated-workers]', typeof document);\n// Open DevTools "
    }
  ],
  "pitfalls": [
    "Interview trap: describing Dedicated Workers from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Dedicated Workers at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Dedicated Workers is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Dedicated Workers?",
      "When would Dedicated Workers block rendering or fail cross-origin?",
      "What is the classic Dedicated Workers interview trap?"
    ],
    "traps": [
      "Interview trap: describing Dedicated Workers from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide dedicated workers details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Dedicated Workers."
    ]
  }
})
