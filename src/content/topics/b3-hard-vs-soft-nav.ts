import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Hard Navigation vs Soft Navigation",
  "whatIsIt": "Hard Navigation vs Soft Navigation is a core Web Platform concept in Navigation & SPA Browser Behavior. It belongs to History API, SPA navigation, and browser history stack. Understanding Hard Navigation vs Soft Navigation helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide hard navigation vs soft navigation details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Hard Navigation vs Soft Navigation as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Hard Navigation vs Soft Navigation in B3.29 — Navigation & SPA Browser Behavior: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Hard Navigation vs Soft Navigation to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about hard navigation vs soft navigation.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Hard Navigation vs Soft Navigation from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Hard Navigation vs Soft Navigation — minimal browser example\nconsole.log('[b3-hard-vs-soft-nav]', typeof document);\n// Open DevTools → verify behavior for: Hard Navigation vs Soft Navigation\n// Spec reference: developer.mozilla.org (search \"Hard Navigation vs Soft Navigation\")",
  "exampleCaption": "Hard Navigation vs Soft Navigation — observe in DevTools while this runs",
  "internals": [
    "Hard Navigation vs Soft Navigation is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for hard navigation vs soft navigation can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether hard navigation vs soft navigation succeeds in production."
  ],
  "takeaways": [
    "Locate Hard Navigation vs Soft Navigation in B3.29 — Navigation & SPA Browser Behavior: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Hard Navigation vs Soft Navigation to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Hard Navigation vs Soft Navigation from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Hard Navigation vs Soft Navigation is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Hard Navigation vs Soft Navigation: Treat Hard Navigation vs Soft Navigation as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Hard Navigation vs Soft Navigation in B3.29 — Navigation & SPA Browser Behavior: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Hard Navigation vs Soft Navigation to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Hard Navigation vs Soft Navigation from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Hard Navigation vs Soft Navigation",
      "Hard Navigation vs Soft Navigation is a core Web Platform concept in Navigation & SPA Browser Behavior."
    ],
    [
      "Mental model",
      "Treat Hard Navigation vs Soft Navigation as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Hard Navigation vs Soft Navigation from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Hard Navigation vs Soft Navigation in B3.29 — Navigation & SPA Browser Be",
      "Connect Hard Navigation vs Soft Navigation to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Hard Navigation vs Soft Navigation in the browser and when do you use it?",
      "answerHint": "Hard Navigation vs Soft Navigation is a core Web Platform concept in Navigation & SPA Browser Behavior. It belongs to History API, SPA navigation, and browser history stack. Understanding Hard Navigation vs Soft Navigation helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Hard Navigation vs Soft Navigation with a DevTools observation and one pitfall.",
      "answerHint": "Locate Hard Navigation vs Soft Navigation in B3.29 — Navigation & SPA Browser Behavior: map it to MDN reference docs and observe behavior in DevTools. Connect Hard Navigation vs Soft Navigation to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about hard navigation vs soft navigation. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Hard Navigation vs Soft Navigation from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Hard Navigation vs Soft Navigation in a senior frontend interview?",
      "answerHint": "Hard Navigation vs Soft Navigation is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for hard navigation vs soft navigation can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether hard navigation vs soft navigation succeeds in production. // Hard Navigation vs Soft Navigation — minimal browser example\nconsole.log('[b3-hard-vs-soft-nav]', typeof document);\n/"
    }
  ],
  "pitfalls": [
    "Interview trap: describing Hard Navigation vs Soft Navigation from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Hard Navigation vs Soft Navigation at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Hard Navigation vs Soft Navigation is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Hard Navigation vs Soft Navigation?",
      "When would Hard Navigation vs Soft Navigation block rendering or fail cross-origin?",
      "What is the classic Hard Navigation vs Soft Navigation interview trap?"
    ],
    "traps": [
      "Interview trap: describing Hard Navigation vs Soft Navigation from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide hard navigation vs soft navigation details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Hard Navigation vs Soft Navigation."
    ]
  }
})
