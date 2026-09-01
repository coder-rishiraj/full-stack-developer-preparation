import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Element Resize Detection",
  "whatIsIt": "Element Resize Detection is a core Web Platform concept in Observer APIs. It belongs to Observer APIs (Intersection, Resize, Mutation, Performance). Understanding Element Resize Detection helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide element resize detection details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Element Resize Detection as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Element Resize Detection in B3.25 — Observer APIs: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Element Resize Detection to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about element resize detection.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Element Resize Detection from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Element Resize Detection — minimal browser example\nconsole.log('[b3-ro-element-resize]', typeof document);\n// Open DevTools → verify behavior for: Element Resize Detection\n// Spec reference: developer.mozilla.org (search \"Element Resize Detection\")",
  "exampleCaption": "Element Resize Detection — observe in DevTools while this runs",
  "internals": [
    "Element Resize Detection is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for element resize detection can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether element resize detection succeeds in production."
  ],
  "takeaways": [
    "Locate Element Resize Detection in B3.25 — Observer APIs: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Element Resize Detection to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Element Resize Detection from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Element Resize Detection is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Element Resize Detection: Treat Element Resize Detection as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Element Resize Detection in B3.25 — Observer APIs: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Element Resize Detection to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Element Resize Detection from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Element Resize Detection",
      "Element Resize Detection is a core Web Platform concept in Observer APIs."
    ],
    [
      "Mental model",
      "Treat Element Resize Detection as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Element Resize Detection from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Element Resize Detection in B3.25 — Observer APIs: map it to MDN referenc",
      "Connect Element Resize Detection to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Element Resize Detection in the browser and when do you use it?",
      "answerHint": "Element Resize Detection is a core Web Platform concept in Observer APIs. It belongs to Observer APIs (Intersection, Resize, Mutation, Performance). Understanding Element Resize Detection helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Element Resize Detection with a DevTools observation and one pitfall.",
      "answerHint": "Locate Element Resize Detection in B3.25 — Observer APIs: map it to MDN reference docs and observe behavior in DevTools. Connect Element Resize Detection to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about element resize detection. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Element Resize Detection from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Element Resize Detection in a senior frontend interview?",
      "answerHint": "Element Resize Detection is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for element resize detection can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether element resize detection succeeds in production. // Element Resize Detection — minimal browser example\nconsole.log('[b3-ro-element-resize]', typeof document);\n// Open De"
    }
  ],
  "pitfalls": [
    "Interview trap: describing Element Resize Detection from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Element Resize Detection at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Element Resize Detection is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Element Resize Detection?",
      "When would Element Resize Detection block rendering or fail cross-origin?",
      "What is the classic Element Resize Detection interview trap?"
    ],
    "traps": [
      "Interview trap: describing Element Resize Detection from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide element resize detection details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Element Resize Detection."
    ]
  }
})
