import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "target vs currentTarget",
  "whatIsIt": "target vs currentTarget is a core Web Platform concept in DOM Events. It belongs to DOM events, propagation, delegation, and listener options. Understanding target vs currentTarget helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide target vs currenttarget details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat target vs currentTarget as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate target vs currentTarget in B3.4 — DOM Events: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect target vs currentTarget to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about target vs currenttarget.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing target vs currentTarget from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// target vs currentTarget — minimal browser example\nconsole.log('[b3-event-target-currenttarget]', typeof document);\n// Open DevTools → verify behavior for: target vs currentTarget\n// Spec reference: developer.mozilla.org (search \"target vs currentTarget\")",
  "exampleCaption": "target vs currentTarget — observe in DevTools while this runs",
  "internals": [
    "target vs currentTarget is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for target vs currenttarget can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether target vs currenttarget succeeds in production."
  ],
  "takeaways": [
    "Locate target vs currentTarget in B3.4 — DOM Events: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect target vs currentTarget to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing target vs currentTarget from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "target vs currentTarget is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "target vs currentTarget: Treat target vs currentTarget as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate target vs currentTarget in B3.4 — DOM Events: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect target vs currentTarget to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing target vs currentTarget from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "target vs currentTarget",
      "target vs currentTarget is a core Web Platform concept in DOM Events."
    ],
    [
      "Mental model",
      "Treat target vs currentTarget as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing target vs currentTarget from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate target vs currentTarget in B3.4 — DOM Events: map it to MDN reference doc",
      "Connect target vs currentTarget to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is target vs currentTarget in the browser and when do you use it?",
      "answerHint": "target vs currentTarget is a core Web Platform concept in DOM Events. It belongs to DOM events, propagation, delegation, and listener options. Understanding target vs currentTarget helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain target vs currentTarget with a DevTools observation and one pitfall.",
      "answerHint": "Locate target vs currentTarget in B3.4 — DOM Events: map it to MDN reference docs and observe behavior in DevTools. Connect target vs currentTarget to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about target vs currenttarget. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing target vs currentTarget from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain target vs currentTarget in a senior frontend interview?",
      "answerHint": "target vs currentTarget is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for target vs currenttarget can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether target vs currenttarget succeeds in production. // target vs currentTarget — minimal browser example\nconsole.log('[b3-event-target-currenttarget]', typeof document);\n//"
    }
  ],
  "pitfalls": [
    "Interview trap: describing target vs currentTarget from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain target vs currentTarget at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "target vs currentTarget is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is target vs currentTarget?",
      "When would target vs currentTarget block rendering or fail cross-origin?",
      "What is the classic target vs currentTarget interview trap?"
    ],
    "traps": [
      "Interview trap: describing target vs currentTarget from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide target vs currenttarget details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around target vs currentTarget."
    ]
  }
})
