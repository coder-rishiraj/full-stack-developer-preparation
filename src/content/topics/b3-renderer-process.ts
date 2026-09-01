import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Renderer Process",
  "whatIsIt": "Renderer Process is a core Web Platform concept in Browser Architecture. It belongs to browser processes, threads, and navigation lifecycle. Understanding Renderer Process helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide renderer process details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Renderer Process as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Renderer Process in B3.1 — Browser Architecture: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Renderer Process to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about renderer process.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Renderer Process from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Renderer Process — minimal browser example\nconsole.log('[b3-renderer-process]', typeof document);\n// Open DevTools → verify behavior for: Renderer Process\n// Spec reference: developer.mozilla.org (search \"Renderer Process\")",
  "exampleCaption": "Renderer Process — observe in DevTools while this runs",
  "internals": [
    "Renderer Process is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for renderer process can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether renderer process succeeds in production."
  ],
  "takeaways": [
    "Locate Renderer Process in B3.1 — Browser Architecture: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Renderer Process to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Renderer Process from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Renderer Process is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Renderer Process: Treat Renderer Process as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Renderer Process in B3.1 — Browser Architecture: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Renderer Process to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Renderer Process from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Renderer Process",
      "Renderer Process is a core Web Platform concept in Browser Architecture."
    ],
    [
      "Mental model",
      "Treat Renderer Process as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Renderer Process from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Renderer Process in B3.1 — Browser Architecture: map it to MDN reference ",
      "Connect Renderer Process to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Renderer Process in the browser and when do you use it?",
      "answerHint": "Renderer Process is a core Web Platform concept in Browser Architecture. It belongs to browser processes, threads, and navigation lifecycle. Understanding Renderer Process helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Renderer Process with a DevTools observation and one pitfall.",
      "answerHint": "Locate Renderer Process in B3.1 — Browser Architecture: map it to MDN reference docs and observe behavior in DevTools. Connect Renderer Process to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about renderer process. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Renderer Process from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Renderer Process in a senior frontend interview?",
      "answerHint": "Renderer Process is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for renderer process can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether renderer process succeeds in production. // Renderer Process — minimal browser example\nconsole.log('[b3-renderer-process]', typeof document);\n// Open DevTools → "
    }
  ],
  "pitfalls": [
    "Interview trap: describing Renderer Process from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Renderer Process at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Renderer Process is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Renderer Process?",
      "When would Renderer Process block rendering or fail cross-origin?",
      "What is the classic Renderer Process interview trap?"
    ],
    "traps": [
      "Interview trap: describing Renderer Process from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide renderer process details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Renderer Process."
    ]
  }
})
