import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Script Loading",
  "whatIsIt": "Script Loading is a core Web Platform concept in HTML Parsing & Page Loading. It belongs to HTML parsing, script loading, and page lifecycle events. Understanding Script Loading helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide script loading details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Script Loading as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Script Loading in B3.5 — HTML Parsing & Page Loading: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Script Loading to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about script loading.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Script Loading from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Script Loading — minimal browser example\nconsole.log('[b3-script-loading]', typeof document);\n// Open DevTools → verify behavior for: Script Loading\n// Spec reference: developer.mozilla.org (search \"Script Loading\")",
  "exampleCaption": "Script Loading — observe in DevTools while this runs",
  "internals": [
    "Script Loading is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for script loading can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether script loading succeeds in production."
  ],
  "takeaways": [
    "Locate Script Loading in B3.5 — HTML Parsing & Page Loading: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Script Loading to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Script Loading from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Script Loading is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Script Loading: Treat Script Loading as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Script Loading in B3.5 — HTML Parsing & Page Loading: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Script Loading to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Script Loading from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Script Loading",
      "Script Loading is a core Web Platform concept in HTML Parsing & Page Loading."
    ],
    [
      "Mental model",
      "Treat Script Loading as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Script Loading from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Script Loading in B3.5 — HTML Parsing & Page Loading: map it to MDN refer",
      "Connect Script Loading to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Script Loading in the browser and when do you use it?",
      "answerHint": "Script Loading is a core Web Platform concept in HTML Parsing & Page Loading. It belongs to HTML parsing, script loading, and page lifecycle events. Understanding Script Loading helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Script Loading with a DevTools observation and one pitfall.",
      "answerHint": "Locate Script Loading in B3.5 — HTML Parsing & Page Loading: map it to MDN reference docs and observe behavior in DevTools. Connect Script Loading to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about script loading. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Script Loading from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Script Loading in a senior frontend interview?",
      "answerHint": "Script Loading is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for script loading can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether script loading succeeds in production. // Script Loading — minimal browser example\nconsole.log('[b3-script-loading]', typeof document);\n// Open DevTools → veri"
    }
  ],
  "pitfalls": [
    "Interview trap: describing Script Loading from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Script Loading at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Script Loading is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Script Loading?",
      "When would Script Loading block rendering or fail cross-origin?",
      "What is the classic Script Loading interview trap?"
    ],
    "traps": [
      "Interview trap: describing Script Loading from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide script loading details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Script Loading."
    ]
  }
})
