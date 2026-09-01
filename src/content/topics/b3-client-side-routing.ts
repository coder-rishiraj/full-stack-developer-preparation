import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Client-Side Routing",
  "whatIsIt": "Client-Side Routing is a core Web Platform concept in Navigation & SPA Browser Behavior. It belongs to History API, SPA navigation, and browser history stack. Understanding Client-Side Routing helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide client-side routing details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Client-Side Routing as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Client-Side Routing in B3.29 — Navigation & SPA Browser Behavior: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Client-Side Routing to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about client-side routing.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Client-Side Routing from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Client-Side Routing — minimal browser example\nconsole.log('[b3-client-side-routing]', typeof document);\n// Open DevTools → verify behavior for: Client-Side Routing\n// Spec reference: developer.mozilla.org (search \"Client-Side Routing\")",
  "exampleCaption": "Client-Side Routing — observe in DevTools while this runs",
  "internals": [
    "Client-Side Routing is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for client-side routing can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether client-side routing succeeds in production."
  ],
  "takeaways": [
    "Locate Client-Side Routing in B3.29 — Navigation & SPA Browser Behavior: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Client-Side Routing to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Client-Side Routing from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Client-Side Routing is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Client-Side Routing: Treat Client-Side Routing as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Client-Side Routing in B3.29 — Navigation & SPA Browser Behavior: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Client-Side Routing to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Client-Side Routing from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Client-Side Routing",
      "Client-Side Routing is a core Web Platform concept in Navigation & SPA Browser Behavior."
    ],
    [
      "Mental model",
      "Treat Client-Side Routing as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Client-Side Routing from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Client-Side Routing in B3.29 — Navigation & SPA Browser Behavior: map it ",
      "Connect Client-Side Routing to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Client-Side Routing in the browser and when do you use it?",
      "answerHint": "Client-Side Routing is a core Web Platform concept in Navigation & SPA Browser Behavior. It belongs to History API, SPA navigation, and browser history stack. Understanding Client-Side Routing helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Client-Side Routing with a DevTools observation and one pitfall.",
      "answerHint": "Locate Client-Side Routing in B3.29 — Navigation & SPA Browser Behavior: map it to MDN reference docs and observe behavior in DevTools. Connect Client-Side Routing to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about client-side routing. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Client-Side Routing from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Client-Side Routing in a senior frontend interview?",
      "answerHint": "Client-Side Routing is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for client-side routing can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether client-side routing succeeds in production. // Client-Side Routing — minimal browser example\nconsole.log('[b3-client-side-routing]', typeof document);\n// Open DevTo"
    }
  ],
  "pitfalls": [
    "Interview trap: describing Client-Side Routing from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Client-Side Routing at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Client-Side Routing is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Client-Side Routing?",
      "When would Client-Side Routing block rendering or fail cross-origin?",
      "What is the classic Client-Side Routing interview trap?"
    ],
    "traps": [
      "Interview trap: describing Client-Side Routing from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide client-side routing details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Client-Side Routing."
    ]
  }
})
