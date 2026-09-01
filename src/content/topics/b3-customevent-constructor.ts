import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "CustomEvent Constructor",
  "whatIsIt": "CustomEvent Constructor is a core Web Platform concept in DOM Events. It belongs to DOM events, propagation, delegation, and listener options. Understanding CustomEvent Constructor helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide customevent constructor details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat CustomEvent Constructor as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate CustomEvent Constructor in B3.4 — DOM Events: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect CustomEvent Constructor to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about customevent constructor.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing CustomEvent Constructor from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// CustomEvent Constructor — minimal browser example\nconsole.log('[b3-customevent-constructor]', typeof window);\n// Open DevTools → verify behavior for: CustomEvent Constructor\n// Spec reference: developer.mozilla.org (search \"CustomEvent Constructor\")",
  "exampleCaption": "CustomEvent Constructor — observe in DevTools while this runs",
  "internals": [
    "CustomEvent Constructor is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for customevent constructor can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether customevent constructor succeeds in production."
  ],
  "takeaways": [
    "Locate CustomEvent Constructor in B3.4 — DOM Events: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect CustomEvent Constructor to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing CustomEvent Constructor from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "CustomEvent Constructor is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "CustomEvent Constructor: Treat CustomEvent Constructor as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate CustomEvent Constructor in B3.4 — DOM Events: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect CustomEvent Constructor to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing CustomEvent Constructor from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "CustomEvent Constructor",
      "CustomEvent Constructor is a core Web Platform concept in DOM Events."
    ],
    [
      "Mental model",
      "Treat CustomEvent Constructor as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing CustomEvent Constructor from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate CustomEvent Constructor in B3.4 — DOM Events: map it to MDN reference doc",
      "Connect CustomEvent Constructor to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is CustomEvent Constructor in the browser and when do you use it?",
      "answerHint": "CustomEvent Constructor is a core Web Platform concept in DOM Events. It belongs to DOM events, propagation, delegation, and listener options. Understanding CustomEvent Constructor helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain CustomEvent Constructor with a DevTools observation and one pitfall.",
      "answerHint": "Locate CustomEvent Constructor in B3.4 — DOM Events: map it to MDN reference docs and observe behavior in DevTools. Connect CustomEvent Constructor to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about customevent constructor. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing CustomEvent Constructor from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain CustomEvent Constructor in a senior frontend interview?",
      "answerHint": "CustomEvent Constructor is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for customevent constructor can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether customevent constructor succeeds in production. // CustomEvent Constructor — minimal browser example\nconsole.log('[b3-customevent-constructor]', typeof window);\n// Open"
    }
  ],
  "pitfalls": [
    "Interview trap: describing CustomEvent Constructor from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain CustomEvent Constructor at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "CustomEvent Constructor is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is CustomEvent Constructor?",
      "When would CustomEvent Constructor block rendering or fail cross-origin?",
      "What is the classic CustomEvent Constructor interview trap?"
    ],
    "traps": [
      "Interview trap: describing CustomEvent Constructor from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide customevent constructor details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around CustomEvent Constructor."
    ]
  }
})
