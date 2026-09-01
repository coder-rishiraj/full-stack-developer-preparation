import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "insertBefore / insertAdjacentElement",
  "whatIsIt": "insertBefore / insertAdjacentElement is a core Web Platform concept in DOM Fundamentals. It belongs to the DOM tree, selection, manipulation, and traversal. Understanding insertBefore / insertAdjacentElement helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide insertbefore / insertadjacentelement details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat insertBefore / insertAdjacentElement as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate insertBefore / insertAdjacentElement in B3.3 — DOM Fundamentals: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect insertBefore / insertAdjacentElement to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about insertbefore / insertadjacentelement.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing insertBefore / insertAdjacentElement from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// insertBefore / insertAdjacentElement — minimal browser example\nconsole.log('[b3-insertbefore-after]', typeof document);\n// Open DevTools → verify behavior for: insertBefore / insertAdjacentElement\n// Spec reference: developer.mozilla.org (search \"insertBefore / insertAdjacentElement\")",
  "exampleCaption": "insertBefore / insertAdjacentElement — observe in DevTools while this runs",
  "internals": [
    "insertBefore / insertAdjacentElement is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for insertbefore / insertadjacentelement can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether insertbefore / insertadjacentelement succeeds in production."
  ],
  "takeaways": [
    "Locate insertBefore / insertAdjacentElement in B3.3 — DOM Fundamentals: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect insertBefore / insertAdjacentElement to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing insertBefore / insertAdjacentElement from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "insertBefore / insertAdjacentElement is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "insertBefore / insertAdjacentElement: Treat insertBefore / insertAdjacentElement as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate insertBefore / insertAdjacentElement in B3.3 — DOM Fundamentals: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect insertBefore / insertAdjacentElement to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing insertBefore / insertAdjacentElement from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "insertBefore / insertAdjacentElement",
      "insertBefore / insertAdjacentElement is a core Web Platform concept in DOM Fundamentals."
    ],
    [
      "Mental model",
      "Treat insertBefore / insertAdjacentElement as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing insertBefore / insertAdjacentElement from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate insertBefore / insertAdjacentElement in B3.3 — DOM Fundamentals: map it t",
      "Connect insertBefore / insertAdjacentElement to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is insertBefore / insertAdjacentElement in the browser and when do you use it?",
      "answerHint": "insertBefore / insertAdjacentElement is a core Web Platform concept in DOM Fundamentals. It belongs to the DOM tree, selection, manipulation, and traversal. Understanding insertBefore / insertAdjacentElement helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain insertBefore / insertAdjacentElement with a DevTools observation and one pitfall.",
      "answerHint": "Locate insertBefore / insertAdjacentElement in B3.3 — DOM Fundamentals: map it to MDN reference docs and observe behavior in DevTools. Connect insertBefore / insertAdjacentElement to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about insertbefore / insertadjacentelement. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing insertBefore / insertAdjacentElement from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain insertBefore / insertAdjacentElement in a senior frontend interview?",
      "answerHint": "insertBefore / insertAdjacentElement is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for insertbefore / insertadjacentelement can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether insertbefore / insertadjacentelement succeeds in production. // insertBefore / insertAdjacentElement — minimal browser example\nconsole.log('[b3-insertbefore-after]', typeof document"
    }
  ],
  "pitfalls": [
    "Interview trap: describing insertBefore / insertAdjacentElement from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain insertBefore / insertAdjacentElement at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "insertBefore / insertAdjacentElement is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is insertBefore / insertAdjacentElement?",
      "When would insertBefore / insertAdjacentElement block rendering or fail cross-origin?",
      "What is the classic insertBefore / insertAdjacentElement interview trap?"
    ],
    "traps": [
      "Interview trap: describing insertBefore / insertAdjacentElement from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide insertbefore / insertadjacentelement details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around insertBefore / insertAdjacentElement."
    ]
  }
})
