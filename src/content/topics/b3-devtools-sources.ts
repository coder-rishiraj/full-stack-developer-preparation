import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Sources Panel & Debugging",
  "whatIsIt": "Sources Panel & Debugging is a core Web Platform concept in Browser Developer Tools. It belongs to Chrome DevTools panels for frontend debugging. Understanding Sources Panel & Debugging helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide sources panel & debugging details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Sources Panel & Debugging as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Sources Panel & Debugging in B3.36 — Browser Developer Tools: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Sources Panel & Debugging to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about sources panel & debugging.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Sources Panel & Debugging from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Sources Panel & Debugging — minimal browser example\nconsole.log('[b3-devtools-sources]', typeof document);\n// Open DevTools → verify behavior for: Sources Panel & Debugging\n// Spec reference: developer.mozilla.org (search \"Sources Panel & Debugging\")",
  "exampleCaption": "Sources Panel & Debugging — observe in DevTools while this runs",
  "internals": [
    "Sources Panel & Debugging is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for sources panel & debugging can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether sources panel & debugging succeeds in production."
  ],
  "takeaways": [
    "Locate Sources Panel & Debugging in B3.36 — Browser Developer Tools: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Sources Panel & Debugging to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Sources Panel & Debugging from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Sources Panel & Debugging is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Sources Panel & Debugging: Treat Sources Panel & Debugging as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Sources Panel & Debugging in B3.36 — Browser Developer Tools: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Sources Panel & Debugging to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Sources Panel & Debugging from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Sources Panel & Debugging",
      "Sources Panel & Debugging is a core Web Platform concept in Browser Developer Tools."
    ],
    [
      "Mental model",
      "Treat Sources Panel & Debugging as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Sources Panel & Debugging from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Sources Panel & Debugging in B3.36 — Browser Developer Tools: map it to M",
      "Connect Sources Panel & Debugging to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Sources Panel & Debugging in the browser and when do you use it?",
      "answerHint": "Sources Panel & Debugging is a core Web Platform concept in Browser Developer Tools. It belongs to Chrome DevTools panels for frontend debugging. Understanding Sources Panel & Debugging helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Sources Panel & Debugging with a DevTools observation and one pitfall.",
      "answerHint": "Locate Sources Panel & Debugging in B3.36 — Browser Developer Tools: map it to MDN reference docs and observe behavior in DevTools. Connect Sources Panel & Debugging to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about sources panel & debugging. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Sources Panel & Debugging from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Sources Panel & Debugging in a senior frontend interview?",
      "answerHint": "Sources Panel & Debugging is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for sources panel & debugging can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether sources panel & debugging succeeds in production. // Sources Panel & Debugging — minimal browser example\nconsole.log('[b3-devtools-sources]', typeof document);\n// Open De"
    }
  ],
  "pitfalls": [
    "Interview trap: describing Sources Panel & Debugging from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Sources Panel & Debugging at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Sources Panel & Debugging is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Sources Panel & Debugging?",
      "When would Sources Panel & Debugging block rendering or fail cross-origin?",
      "What is the classic Sources Panel & Debugging interview trap?"
    ],
    "traps": [
      "Interview trap: describing Sources Panel & Debugging from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide sources panel & debugging details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Sources Panel & Debugging."
    ]
  }
})
