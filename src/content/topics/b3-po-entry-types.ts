import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Performance Entry Types",
  "whatIsIt": "Performance Entry Types is a core Web Platform concept in Observer APIs. It belongs to Observer APIs (Intersection, Resize, Mutation, Performance). Understanding Performance Entry Types helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide performance entry types details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Performance Entry Types as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Performance Entry Types in B3.25 — Observer APIs: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Performance Entry Types to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about performance entry types.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Performance Entry Types from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Performance Entry Types — minimal browser example\nconsole.log('[b3-po-entry-types]', typeof document);\n// Open DevTools → verify behavior for: Performance Entry Types\n// Spec reference: developer.mozilla.org (search \"Performance Entry Types\")",
  "exampleCaption": "Performance Entry Types — observe in DevTools while this runs",
  "internals": [
    "Performance Entry Types is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for performance entry types can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether performance entry types succeeds in production."
  ],
  "takeaways": [
    "Locate Performance Entry Types in B3.25 — Observer APIs: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Performance Entry Types to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Performance Entry Types from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Performance Entry Types is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Performance Entry Types: Treat Performance Entry Types as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Performance Entry Types in B3.25 — Observer APIs: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Performance Entry Types to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Performance Entry Types from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Performance Entry Types",
      "Performance Entry Types is a core Web Platform concept in Observer APIs."
    ],
    [
      "Mental model",
      "Treat Performance Entry Types as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Performance Entry Types from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Performance Entry Types in B3.25 — Observer APIs: map it to MDN reference",
      "Connect Performance Entry Types to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Performance Entry Types in the browser and when do you use it?",
      "answerHint": "Performance Entry Types is a core Web Platform concept in Observer APIs. It belongs to Observer APIs (Intersection, Resize, Mutation, Performance). Understanding Performance Entry Types helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Performance Entry Types with a DevTools observation and one pitfall.",
      "answerHint": "Locate Performance Entry Types in B3.25 — Observer APIs: map it to MDN reference docs and observe behavior in DevTools. Connect Performance Entry Types to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about performance entry types. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Performance Entry Types from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Performance Entry Types in a senior frontend interview?",
      "answerHint": "Performance Entry Types is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for performance entry types can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether performance entry types succeeds in production. // Performance Entry Types — minimal browser example\nconsole.log('[b3-po-entry-types]', typeof document);\n// Open DevToo"
    }
  ],
  "pitfalls": [
    "Interview trap: describing Performance Entry Types from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Performance Entry Types at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Performance Entry Types is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Performance Entry Types?",
      "When would Performance Entry Types block rendering or fail cross-origin?",
      "What is the classic Performance Entry Types interview trap?"
    ],
    "traps": [
      "Interview trap: describing Performance Entry Types from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide performance entry types details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Performance Entry Types."
    ]
  }
})
