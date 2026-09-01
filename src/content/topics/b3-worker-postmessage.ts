import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "postMessage & Message Passing",
  "whatIsIt": "postMessage & Message Passing is a core Web Platform concept in Web Workers. It belongs to Web Workers and off-main-thread computation. Understanding postMessage & Message Passing helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide postmessage & message passing details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat postMessage & Message Passing as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate postMessage & Message Passing in B3.21 — Web Workers: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect postMessage & Message Passing to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about postmessage & message passing.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing postMessage & Message Passing from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// postMessage & Message Passing — minimal browser example\nconsole.log('[b3-worker-postmessage]', typeof document);\n// Open DevTools → verify behavior for: postMessage & Message Passing\n// Spec reference: developer.mozilla.org (search \"postMessage & Message Passing\")",
  "exampleCaption": "postMessage & Message Passing — observe in DevTools while this runs",
  "internals": [
    "postMessage & Message Passing is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for postmessage & message passing can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether postmessage & message passing succeeds in production."
  ],
  "takeaways": [
    "Locate postMessage & Message Passing in B3.21 — Web Workers: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect postMessage & Message Passing to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing postMessage & Message Passing from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "postMessage & Message Passing is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "postMessage & Message Passing: Treat postMessage & Message Passing as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate postMessage & Message Passing in B3.21 — Web Workers: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect postMessage & Message Passing to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing postMessage & Message Passing from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "postMessage & Message Passing",
      "postMessage & Message Passing is a core Web Platform concept in Web Workers."
    ],
    [
      "Mental model",
      "Treat postMessage & Message Passing as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing postMessage & Message Passing from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate postMessage & Message Passing in B3.21 — Web Workers: map it to MDN refer",
      "Connect postMessage & Message Passing to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is postMessage & Message Passing in the browser and when do you use it?",
      "answerHint": "postMessage & Message Passing is a core Web Platform concept in Web Workers. It belongs to Web Workers and off-main-thread computation. Understanding postMessage & Message Passing helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain postMessage & Message Passing with a DevTools observation and one pitfall.",
      "answerHint": "Locate postMessage & Message Passing in B3.21 — Web Workers: map it to MDN reference docs and observe behavior in DevTools. Connect postMessage & Message Passing to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about postmessage & message passing. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing postMessage & Message Passing from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain postMessage & Message Passing in a senior frontend interview?",
      "answerHint": "postMessage & Message Passing is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for postmessage & message passing can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether postmessage & message passing succeeds in production. // postMessage & Message Passing — minimal browser example\nconsole.log('[b3-worker-postmessage]', typeof document);\n// O"
    }
  ],
  "pitfalls": [
    "Interview trap: describing postMessage & Message Passing from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain postMessage & Message Passing at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "postMessage & Message Passing is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is postMessage & Message Passing?",
      "When would postMessage & Message Passing block rendering or fail cross-origin?",
      "What is the classic postMessage & Message Passing interview trap?"
    ],
    "traps": [
      "Interview trap: describing postMessage & Message Passing from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide postmessage & message passing details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around postMessage & Message Passing."
    ]
  }
})
