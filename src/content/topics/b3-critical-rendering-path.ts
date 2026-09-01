import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Critical Rendering Path",
  "whatIsIt": "Critical Rendering Path is a core Web Platform concept in Critical Rendering Path. It belongs to the critical rendering path from HTML/CSS to pixels. Understanding Critical Rendering Path helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide critical rendering path details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Critical Rendering Path as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Critical Rendering Path in B3.6 — Critical Rendering Path: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Critical Rendering Path to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about critical rendering path.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Critical Rendering Path from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Critical Rendering Path — minimal browser example\nconsole.log('[b3-critical-rendering-path]', typeof document);\n// Open DevTools → verify behavior for: Critical Rendering Path\n// Spec reference: developer.mozilla.org (search \"Critical Rendering Path\")",
  "exampleCaption": "Critical Rendering Path — observe in DevTools while this runs",
  "internals": [
    "Critical Rendering Path is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for critical rendering path can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether critical rendering path succeeds in production."
  ],
  "takeaways": [
    "Locate Critical Rendering Path in B3.6 — Critical Rendering Path: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Critical Rendering Path to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Critical Rendering Path from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Critical Rendering Path is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Critical Rendering Path: Treat Critical Rendering Path as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Critical Rendering Path in B3.6 — Critical Rendering Path: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Critical Rendering Path to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Critical Rendering Path from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Critical Rendering Path",
      "Critical Rendering Path is a core Web Platform concept in Critical Rendering Path."
    ],
    [
      "Mental model",
      "Treat Critical Rendering Path as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Critical Rendering Path from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Critical Rendering Path in B3.6 — Critical Rendering Path: map it to MDN ",
      "Connect Critical Rendering Path to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Critical Rendering Path in the browser and when do you use it?",
      "answerHint": "Critical Rendering Path is a core Web Platform concept in Critical Rendering Path. It belongs to the critical rendering path from HTML/CSS to pixels. Understanding Critical Rendering Path helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Critical Rendering Path with a DevTools observation and one pitfall.",
      "answerHint": "Locate Critical Rendering Path in B3.6 — Critical Rendering Path: map it to MDN reference docs and observe behavior in DevTools. Connect Critical Rendering Path to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about critical rendering path. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Critical Rendering Path from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Critical Rendering Path in a senior frontend interview?",
      "answerHint": "Critical Rendering Path is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for critical rendering path can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether critical rendering path succeeds in production. // Critical Rendering Path — minimal browser example\nconsole.log('[b3-critical-rendering-path]', typeof document);\n// Op"
    }
  ],
  "pitfalls": [
    "Interview trap: describing Critical Rendering Path from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Critical Rendering Path at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Critical Rendering Path is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Critical Rendering Path?",
      "When would Critical Rendering Path block rendering or fail cross-origin?",
      "What is the classic Critical Rendering Path interview trap?"
    ],
    "traps": [
      "Interview trap: describing Critical Rendering Path from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide critical rendering path details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Critical Rendering Path."
    ]
  }
})
