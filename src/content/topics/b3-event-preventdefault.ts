import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "preventDefault()",
  "whatIsIt": "preventDefault() is a core Web Platform concept in DOM Events. It belongs to DOM events, propagation, delegation, and listener options. Understanding preventDefault() helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide preventdefault() details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat preventDefault() as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate preventDefault() in B3.4 — DOM Events: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect preventDefault() to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about preventdefault().",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing preventDefault() from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// preventDefault() — minimal browser example\nconsole.log('[b3-event-preventdefault]', typeof document);\n// Open DevTools → verify behavior for: preventDefault()\n// Spec reference: developer.mozilla.org (search \"preventDefault()\")",
  "exampleCaption": "preventDefault() — observe in DevTools while this runs",
  "internals": [
    "preventDefault() is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for preventdefault() can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether preventdefault() succeeds in production."
  ],
  "takeaways": [
    "Locate preventDefault() in B3.4 — DOM Events: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect preventDefault() to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing preventDefault() from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "preventDefault() is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "preventDefault(): Treat preventDefault() as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate preventDefault() in B3.4 — DOM Events: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect preventDefault() to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing preventDefault() from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "preventDefault()",
      "preventDefault() is a core Web Platform concept in DOM Events."
    ],
    [
      "Mental model",
      "Treat preventDefault() as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing preventDefault() from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate preventDefault() in B3.4 — DOM Events: map it to MDN reference docs and o",
      "Connect preventDefault() to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is preventDefault() in the browser and when do you use it?",
      "answerHint": "preventDefault() is a core Web Platform concept in DOM Events. It belongs to DOM events, propagation, delegation, and listener options. Understanding preventDefault() helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain preventDefault() with a DevTools observation and one pitfall.",
      "answerHint": "Locate preventDefault() in B3.4 — DOM Events: map it to MDN reference docs and observe behavior in DevTools. Connect preventDefault() to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about preventdefault(). Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing preventDefault() from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain preventDefault() in a senior frontend interview?",
      "answerHint": "preventDefault() is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for preventdefault() can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether preventdefault() succeeds in production. // preventDefault() — minimal browser example\nconsole.log('[b3-event-preventdefault]', typeof document);\n// Open DevTool"
    }
  ],
  "pitfalls": [
    "Interview trap: describing preventDefault() from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain preventDefault() at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "preventDefault() is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is preventDefault()?",
      "When would preventDefault() block rendering or fail cross-origin?",
      "What is the classic preventDefault() interview trap?"
    ],
    "traps": [
      "Interview trap: describing preventDefault() from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide preventdefault() details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around preventDefault()."
    ]
  }
})
