import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "back / forward / go",
  "whatIsIt": "back / forward / go is a core Web Platform concept in Window, Document & BOM. It belongs to the browser global environment (window, document, BOM APIs). Understanding back / forward / go helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide back / forward / go details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat back / forward / go as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate back / forward / go in B3.2 — Window, Document & BOM: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect back / forward / go to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about back / forward / go.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing back / forward / go from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// back / forward / go — minimal browser example\nconsole.log('[b3-history-back-forward]', typeof document);\n// Open DevTools → verify behavior for: back / forward / go\n// Spec reference: developer.mozilla.org (search \"back / forward / go\")",
  "exampleCaption": "back / forward / go — observe in DevTools while this runs",
  "internals": [
    "back / forward / go is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for back / forward / go can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether back / forward / go succeeds in production."
  ],
  "takeaways": [
    "Locate back / forward / go in B3.2 — Window, Document & BOM: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect back / forward / go to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing back / forward / go from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "back / forward / go is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "back / forward / go: Treat back / forward / go as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate back / forward / go in B3.2 — Window, Document & BOM: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect back / forward / go to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing back / forward / go from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "back / forward / go",
      "back / forward / go is a core Web Platform concept in Window, Document & BOM."
    ],
    [
      "Mental model",
      "Treat back / forward / go as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing back / forward / go from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate back / forward / go in B3.2 — Window, Document & BOM: map it to MDN refer",
      "Connect back / forward / go to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is back / forward / go in the browser and when do you use it?",
      "answerHint": "back / forward / go is a core Web Platform concept in Window, Document & BOM. It belongs to the browser global environment (window, document, BOM APIs). Understanding back / forward / go helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain back / forward / go with a DevTools observation and one pitfall.",
      "answerHint": "Locate back / forward / go in B3.2 — Window, Document & BOM: map it to MDN reference docs and observe behavior in DevTools. Connect back / forward / go to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about back / forward / go. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing back / forward / go from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain back / forward / go in a senior frontend interview?",
      "answerHint": "back / forward / go is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for back / forward / go can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether back / forward / go succeeds in production. // back / forward / go — minimal browser example\nconsole.log('[b3-history-back-forward]', typeof document);\n// Open DevT"
    }
  ],
  "pitfalls": [
    "Interview trap: describing back / forward / go from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain back / forward / go at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "back / forward / go is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is back / forward / go?",
      "When would back / forward / go block rendering or fail cross-origin?",
      "What is the classic back / forward / go interview trap?"
    ],
    "traps": [
      "Interview trap: describing back / forward / go from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide back / forward / go details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around back / forward / go."
    ]
  }
})
