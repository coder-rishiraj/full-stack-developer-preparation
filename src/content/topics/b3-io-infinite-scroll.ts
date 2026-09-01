import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Infinite Scroll Detection",
  "whatIsIt": "Infinite Scroll Detection is a core Web Platform concept in Observer APIs. It belongs to Observer APIs (Intersection, Resize, Mutation, Performance). Understanding Infinite Scroll Detection helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide infinite scroll detection details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Infinite Scroll Detection as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Infinite Scroll Detection in B3.25 — Observer APIs: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Infinite Scroll Detection to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about infinite scroll detection.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Infinite Scroll Detection from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Infinite Scroll Detection — minimal browser example\nconsole.log('[b3-io-infinite-scroll]', typeof document);\n// Open DevTools → verify behavior for: Infinite Scroll Detection\n// Spec reference: developer.mozilla.org (search \"Infinite Scroll Detection\")",
  "exampleCaption": "Infinite Scroll Detection — observe in DevTools while this runs",
  "internals": [
    "Infinite Scroll Detection is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for infinite scroll detection can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether infinite scroll detection succeeds in production."
  ],
  "takeaways": [
    "Locate Infinite Scroll Detection in B3.25 — Observer APIs: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Infinite Scroll Detection to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Infinite Scroll Detection from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Infinite Scroll Detection is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Infinite Scroll Detection: Treat Infinite Scroll Detection as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Infinite Scroll Detection in B3.25 — Observer APIs: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Infinite Scroll Detection to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Infinite Scroll Detection from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Infinite Scroll Detection",
      "Infinite Scroll Detection is a core Web Platform concept in Observer APIs."
    ],
    [
      "Mental model",
      "Treat Infinite Scroll Detection as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Infinite Scroll Detection from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Infinite Scroll Detection in B3.25 — Observer APIs: map it to MDN referen",
      "Connect Infinite Scroll Detection to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Infinite Scroll Detection in the browser and when do you use it?",
      "answerHint": "Infinite Scroll Detection is a core Web Platform concept in Observer APIs. It belongs to Observer APIs (Intersection, Resize, Mutation, Performance). Understanding Infinite Scroll Detection helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Infinite Scroll Detection with a DevTools observation and one pitfall.",
      "answerHint": "Locate Infinite Scroll Detection in B3.25 — Observer APIs: map it to MDN reference docs and observe behavior in DevTools. Connect Infinite Scroll Detection to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about infinite scroll detection. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Infinite Scroll Detection from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Infinite Scroll Detection in a senior frontend interview?",
      "answerHint": "Infinite Scroll Detection is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for infinite scroll detection can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether infinite scroll detection succeeds in production. // Infinite Scroll Detection — minimal browser example\nconsole.log('[b3-io-infinite-scroll]', typeof document);\n// Open "
    }
  ],
  "pitfalls": [
    "Interview trap: describing Infinite Scroll Detection from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Infinite Scroll Detection at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Infinite Scroll Detection is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Infinite Scroll Detection?",
      "When would Infinite Scroll Detection block rendering or fail cross-origin?",
      "What is the classic Infinite Scroll Detection interview trap?"
    ],
    "traps": [
      "Interview trap: describing Infinite Scroll Detection from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide infinite scroll detection details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Infinite Scroll Detection."
    ]
  }
})
