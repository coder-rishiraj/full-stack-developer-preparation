import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "First Paint & First Contentful Paint",
  "whatIsIt": "First Paint & First Contentful Paint is a core Web Platform concept in HTML Parsing & Page Loading. It belongs to HTML parsing, script loading, and page lifecycle events. Understanding First Paint & First Contentful Paint helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide first paint & first contentful paint details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat First Paint & First Contentful Paint as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate First Paint & First Contentful Paint in B3.5 — HTML Parsing & Page Loading: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect First Paint & First Contentful Paint to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about first paint & first contentful paint.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing First Paint & First Contentful Paint from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// First Paint & First Contentful Paint — minimal browser example\nconsole.log('[b3-first-paint-timing]', typeof document);\n// Open DevTools → verify behavior for: First Paint & First Contentful Paint\n// Spec reference: developer.mozilla.org (search \"First Paint & First Contentful Paint\")",
  "exampleCaption": "First Paint & First Contentful Paint — observe in DevTools while this runs",
  "internals": [
    "First Paint & First Contentful Paint is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for first paint & first contentful paint can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether first paint & first contentful paint succeeds in production."
  ],
  "takeaways": [
    "Locate First Paint & First Contentful Paint in B3.5 — HTML Parsing & Page Loading: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect First Paint & First Contentful Paint to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing First Paint & First Contentful Paint from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "First Paint & First Contentful Paint is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "First Paint & First Contentful Paint: Treat First Paint & First Contentful Paint as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate First Paint & First Contentful Paint in B3.5 — HTML Parsing & Page Loading: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect First Paint & First Contentful Paint to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing First Paint & First Contentful Paint from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "First Paint & First Contentful Paint",
      "First Paint & First Contentful Paint is a core Web Platform concept in HTML Parsing & Page Loading."
    ],
    [
      "Mental model",
      "Treat First Paint & First Contentful Paint as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing First Paint & First Contentful Paint from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate First Paint & First Contentful Paint in B3.5 — HTML Parsing & Page Loadin",
      "Connect First Paint & First Contentful Paint to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is First Paint & First Contentful Paint in the browser and when do you use it?",
      "answerHint": "First Paint & First Contentful Paint is a core Web Platform concept in HTML Parsing & Page Loading. It belongs to HTML parsing, script loading, and page lifecycle events. Understanding First Paint & First Contentful Paint helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain First Paint & First Contentful Paint with a DevTools observation and one pitfall.",
      "answerHint": "Locate First Paint & First Contentful Paint in B3.5 — HTML Parsing & Page Loading: map it to MDN reference docs and observe behavior in DevTools. Connect First Paint & First Contentful Paint to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about first paint & first contentful paint. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing First Paint & First Contentful Paint from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain First Paint & First Contentful Paint in a senior frontend interview?",
      "answerHint": "First Paint & First Contentful Paint is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for first paint & first contentful paint can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether first paint & first contentful paint succeeds in production. // First Paint & First Contentful Paint — minimal browser example\nconsole.log('[b3-first-paint-timing]', typeof document"
    }
  ],
  "pitfalls": [
    "Interview trap: describing First Paint & First Contentful Paint from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain First Paint & First Contentful Paint at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "First Paint & First Contentful Paint is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is First Paint & First Contentful Paint?",
      "When would First Paint & First Contentful Paint block rendering or fail cross-origin?",
      "What is the classic First Paint & First Contentful Paint interview trap?"
    ],
    "traps": [
      "Interview trap: describing First Paint & First Contentful Paint from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide first paint & first contentful paint details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around First Paint & First Contentful Paint."
    ]
  }
})
