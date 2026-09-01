import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Accessibility Tree",
  "whatIsIt": "Accessibility Tree is a core Web Platform concept in Accessibility Tree & Focus. It belongs to accessibility tree, focus, and keyboard navigation in the browser. Understanding Accessibility Tree helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide accessibility tree details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Accessibility Tree as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Accessibility Tree in B3.35 — Accessibility Tree & Focus: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Accessibility Tree to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about accessibility tree.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Accessibility Tree from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Accessibility Tree — minimal browser example\nconsole.log('[b3-accessibility-tree]', typeof document);\n// Open DevTools → verify behavior for: Accessibility Tree\n// Spec reference: developer.mozilla.org (search \"Accessibility Tree\")",
  "exampleCaption": "Accessibility Tree — observe in DevTools while this runs",
  "internals": [
    "Accessibility Tree is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for accessibility tree can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether accessibility tree succeeds in production."
  ],
  "takeaways": [
    "Locate Accessibility Tree in B3.35 — Accessibility Tree & Focus: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Accessibility Tree to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Accessibility Tree from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Accessibility Tree is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Accessibility Tree: Treat Accessibility Tree as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Accessibility Tree in B3.35 — Accessibility Tree & Focus: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Accessibility Tree to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Accessibility Tree from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Accessibility Tree",
      "Accessibility Tree is a core Web Platform concept in Accessibility Tree & Focus."
    ],
    [
      "Mental model",
      "Treat Accessibility Tree as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Accessibility Tree from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Accessibility Tree in B3.35 — Accessibility Tree & Focus: map it to MDN r",
      "Connect Accessibility Tree to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Accessibility Tree in the browser and when do you use it?",
      "answerHint": "Accessibility Tree is a core Web Platform concept in Accessibility Tree & Focus. It belongs to accessibility tree, focus, and keyboard navigation in the browser. Understanding Accessibility Tree helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Accessibility Tree with a DevTools observation and one pitfall.",
      "answerHint": "Locate Accessibility Tree in B3.35 — Accessibility Tree & Focus: map it to MDN reference docs and observe behavior in DevTools. Connect Accessibility Tree to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about accessibility tree. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Accessibility Tree from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Accessibility Tree in a senior frontend interview?",
      "answerHint": "Accessibility Tree is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for accessibility tree can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether accessibility tree succeeds in production. // Accessibility Tree — minimal browser example\nconsole.log('[b3-accessibility-tree]', typeof document);\n// Open DevTool"
    }
  ],
  "pitfalls": [
    "Interview trap: describing Accessibility Tree from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Accessibility Tree at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Accessibility Tree is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Accessibility Tree?",
      "When would Accessibility Tree block rendering or fail cross-origin?",
      "What is the classic Accessibility Tree interview trap?"
    ],
    "traps": [
      "Interview trap: describing Accessibility Tree from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide accessibility tree details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Accessibility Tree."
    ]
  }
})
