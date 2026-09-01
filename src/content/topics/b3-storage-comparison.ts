import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "localStorage vs sessionStorage vs Cookies",
  "whatIsIt": "localStorage vs sessionStorage vs Cookies is a core Web Platform concept in Web Storage. It belongs to localStorage, sessionStorage, and storage trade-offs. Understanding localStorage vs sessionStorage vs Cookies helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide localstorage vs sessionstorage vs cookies details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat localStorage vs sessionStorage vs Cookies as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate localStorage vs sessionStorage vs Cookies in B3.16 — Web Storage: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect localStorage vs sessionStorage vs Cookies to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about localstorage vs sessionstorage vs cookies.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing localStorage vs sessionStorage vs Cookies from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// localStorage vs sessionStorage vs Cookies — minimal browser example\nconsole.log('[b3-storage-comparison]', typeof document);\n// Open DevTools → verify behavior for: localStorage vs sessionStorage vs Cookies\n// Spec reference: developer.mozilla.org (search \"localStorage vs sessionStorage vs Cookies\")",
  "exampleCaption": "localStorage vs sessionStorage vs Cookies — observe in DevTools while this runs",
  "internals": [
    "localStorage vs sessionStorage vs Cookies is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for localstorage vs sessionstorage vs cookies can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether localstorage vs sessionstorage vs cookies succeeds in production."
  ],
  "takeaways": [
    "Locate localStorage vs sessionStorage vs Cookies in B3.16 — Web Storage: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect localStorage vs sessionStorage vs Cookies to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing localStorage vs sessionStorage vs Cookies from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "localStorage vs sessionStorage vs Cookies is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "localStorage vs sessionStorage vs Cookies: Treat localStorage vs sessionStorage vs Cookies as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate localStorage vs sessionStorage vs Cookies in B3.16 — Web Storage: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect localStorage vs sessionStorage vs Cookies to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing localStorage vs sessionStorage vs Cookies from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "localStorage vs sessionStorage vs Cookies",
      "localStorage vs sessionStorage vs Cookies is a core Web Platform concept in Web Storage."
    ],
    [
      "Mental model",
      "Treat localStorage vs sessionStorage vs Cookies as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing localStorage vs sessionStorage vs Cookies from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate localStorage vs sessionStorage vs Cookies in B3.16 — Web Storage: map it ",
      "Connect localStorage vs sessionStorage vs Cookies to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is localStorage vs sessionStorage vs Cookies in the browser and when do you use it?",
      "answerHint": "localStorage vs sessionStorage vs Cookies is a core Web Platform concept in Web Storage. It belongs to localStorage, sessionStorage, and storage trade-offs. Understanding localStorage vs sessionStorage vs Cookies helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain localStorage vs sessionStorage vs Cookies with a DevTools observation and one pitfall.",
      "answerHint": "Locate localStorage vs sessionStorage vs Cookies in B3.16 — Web Storage: map it to MDN reference docs and observe behavior in DevTools. Connect localStorage vs sessionStorage vs Cookies to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about localstorage vs sessionstorage vs cookies. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing localStorage vs sessionStorage vs Cookies from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain localStorage vs sessionStorage vs Cookies in a senior frontend interview?",
      "answerHint": "localStorage vs sessionStorage vs Cookies is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for localstorage vs sessionstorage vs cookies can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether localstorage vs sessionstorage vs cookies succeeds in production. // localStorage vs sessionStorage vs Cookies — minimal browser example\nconsole.log('[b3-storage-comparison]', typeof doc"
    }
  ],
  "pitfalls": [
    "Interview trap: describing localStorage vs sessionStorage vs Cookies from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain localStorage vs sessionStorage vs Cookies at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "localStorage vs sessionStorage vs Cookies is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is localStorage vs sessionStorage vs Cookies?",
      "When would localStorage vs sessionStorage vs Cookies block rendering or fail cross-origin?",
      "What is the classic localStorage vs sessionStorage vs Cookies interview trap?"
    ],
    "traps": [
      "Interview trap: describing localStorage vs sessionStorage vs Cookies from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide localstorage vs sessionstorage vs cookies details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around localStorage vs sessionStorage vs Cookies."
    ]
  }
})
