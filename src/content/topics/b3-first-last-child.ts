import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "firstChild / lastChild / nextSibling / previousSibling",
  "whatIsIt": "firstChild / lastChild / nextSibling / previousSibling is a core Web Platform concept in DOM Fundamentals. It belongs to the DOM tree, selection, manipulation, and traversal. Understanding firstChild / lastChild / nextSibling / previousSibling helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide firstchild / lastchild / nextsibling / previoussibling details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat firstChild / lastChild / nextSibling / previousSibling as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate firstChild / lastChild / nextSibling / previousSibling in B3.3 — DOM Fundamentals: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect firstChild / lastChild / nextSibling / previousSibling to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about firstchild / lastchild / nextsibling / previoussibling.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing firstChild / lastChild / nextSibling / previousSibling from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// firstChild / lastChild / nextSibling / previousSibling — minimal browser example\nconsole.log('[b3-first-last-child]', typeof document);\n// Open DevTools → verify behavior for: firstChild / lastChild / nextSibling / previousSibling\n// Spec reference: developer.mozilla.org (search \"firstChild / lastChild / nextSibling / previousSibling\")",
  "exampleCaption": "firstChild / lastChild / nextSibling / previousSibling — observe in DevTools while this runs",
  "internals": [
    "firstChild / lastChild / nextSibling / previousSibling is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for firstchild / lastchild / nextsibling / previoussibling can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether firstchild / lastchild / nextsibling / previoussibling succeeds in production."
  ],
  "takeaways": [
    "Locate firstChild / lastChild / nextSibling / previousSibling in B3.3 — DOM Fundamentals: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect firstChild / lastChild / nextSibling / previousSibling to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing firstChild / lastChild / nextSibling / previousSibling from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "firstChild / lastChild / nextSibling / previousSibling is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "firstChild / lastChild / nextSibling / previousSibling: Treat firstChild / lastChild / nextSibling / previousSibling as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate firstChild / lastChild / nextSibling / previousSibling in B3.3 — DOM Fundamentals: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect firstChild / lastChild / nextSibling / previousSibling to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing firstChild / lastChild / nextSibling / previousSibling from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "firstChild / lastChild / nextSibling / previousSibling",
      "firstChild / lastChild / nextSibling / previousSibling is a core Web Platform concept in DOM Fundamentals."
    ],
    [
      "Mental model",
      "Treat firstChild / lastChild / nextSibling / previousSibling as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing firstChild / lastChild / nextSibling / previousSibling from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate firstChild / lastChild / nextSibling / previousSibling in B3.3 — DOM Fund",
      "Connect firstChild / lastChild / nextSibling / previousSibling to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is firstChild / lastChild / nextSibling / previousSibling in the browser and when do you use it?",
      "answerHint": "firstChild / lastChild / nextSibling / previousSibling is a core Web Platform concept in DOM Fundamentals. It belongs to the DOM tree, selection, manipulation, and traversal. Understanding firstChild / lastChild / nextSibling / previousSibling helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain firstChild / lastChild / nextSibling / previousSibling with a DevTools observation and one pitfall.",
      "answerHint": "Locate firstChild / lastChild / nextSibling / previousSibling in B3.3 — DOM Fundamentals: map it to MDN reference docs and observe behavior in DevTools. Connect firstChild / lastChild / nextSibling / previousSibling to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about firstchild / lastchild / nextsibling / previoussibling. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing firstChild / lastChild / nextSibling / previousSibling from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain firstChild / lastChild / nextSibling / previousSibling in a senior frontend interview?",
      "answerHint": "firstChild / lastChild / nextSibling / previousSibling is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for firstchild / lastchild / nextsibling / previoussibling can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether firstchild / lastchild / nextsibling / previoussibling succeeds in production. // firstChild / lastChild / nextSibling / previousSibling — minimal browser example\nconsole.log('[b3-first-last-child]',"
    }
  ],
  "pitfalls": [
    "Interview trap: describing firstChild / lastChild / nextSibling / previousSibling from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain firstChild / lastChild / nextSibling / previousSibling at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "firstChild / lastChild / nextSibling / previousSibling is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is firstChild / lastChild / nextSibling / previousSibling?",
      "When would firstChild / lastChild / nextSibling / previousSibling block rendering or fail cross-origin?",
      "What is the classic firstChild / lastChild / nextSibling / previousSibling interview trap?"
    ],
    "traps": [
      "Interview trap: describing firstChild / lastChild / nextSibling / previousSibling from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide firstchild / lastchild / nextsibling / previoussibling details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around firstChild / lastChild / nextSibling / previousSibling."
    ]
  }
})
