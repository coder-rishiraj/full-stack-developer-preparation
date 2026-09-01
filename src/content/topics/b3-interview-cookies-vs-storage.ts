import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Cookies vs localStorage vs sessionStorage",
  "whatIsIt": "Cookies vs localStorage vs sessionStorage is a core Web Platform concept in Browser Interview Scenarios. It belongs to senior frontend browser interview reasoning. Understanding Cookies vs localStorage vs sessionStorage helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide cookies vs localstorage vs sessionstorage details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Cookies vs localStorage vs sessionStorage as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Cookies vs localStorage vs sessionStorage in B3.37 — Browser Interview Scenarios: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Cookies vs localStorage vs sessionStorage to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about cookies vs localstorage vs sessionstorage.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Cookies vs localStorage vs sessionStorage from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Cookies vs localStorage vs sessionStorage — minimal browser example\nconsole.log('[b3-interview-cookies-vs-storage]', typeof document);\n// Open DevTools → verify behavior for: Cookies vs localStorage vs sessionStorage\n// Spec reference: developer.mozilla.org (search \"Cookies vs localStorage vs sessionStorage\")",
  "exampleCaption": "Cookies vs localStorage vs sessionStorage — observe in DevTools while this runs",
  "internals": [
    "Cookies vs localStorage vs sessionStorage is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for cookies vs localstorage vs sessionstorage can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether cookies vs localstorage vs sessionstorage succeeds in production."
  ],
  "takeaways": [
    "Locate Cookies vs localStorage vs sessionStorage in B3.37 — Browser Interview Scenarios: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Cookies vs localStorage vs sessionStorage to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Cookies vs localStorage vs sessionStorage from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Cookies vs localStorage vs sessionStorage is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Cookies vs localStorage vs sessionStorage: Treat Cookies vs localStorage vs sessionStorage as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Cookies vs localStorage vs sessionStorage in B3.37 — Browser Interview Scenarios: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Cookies vs localStorage vs sessionStorage to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Cookies vs localStorage vs sessionStorage from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Cookies vs localStorage vs sessionStorage",
      "Cookies vs localStorage vs sessionStorage is a core Web Platform concept in Browser Interview Scenarios."
    ],
    [
      "Mental model",
      "Treat Cookies vs localStorage vs sessionStorage as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Cookies vs localStorage vs sessionStorage from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Cookies vs localStorage vs sessionStorage in B3.37 — Browser Interview Sc",
      "Connect Cookies vs localStorage vs sessionStorage to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Cookies vs localStorage vs sessionStorage in the browser and when do you use it?",
      "answerHint": "Cookies vs localStorage vs sessionStorage is a core Web Platform concept in Browser Interview Scenarios. It belongs to senior frontend browser interview reasoning. Understanding Cookies vs localStorage vs sessionStorage helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Cookies vs localStorage vs sessionStorage with a DevTools observation and one pitfall.",
      "answerHint": "Locate Cookies vs localStorage vs sessionStorage in B3.37 — Browser Interview Scenarios: map it to MDN reference docs and observe behavior in DevTools. Connect Cookies vs localStorage vs sessionStorage to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about cookies vs localstorage vs sessionstorage. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Cookies vs localStorage vs sessionStorage from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Cookies vs localStorage vs sessionStorage in a senior frontend interview?",
      "answerHint": "Cookies vs localStorage vs sessionStorage is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for cookies vs localstorage vs sessionstorage can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether cookies vs localstorage vs sessionstorage succeeds in production. // Cookies vs localStorage vs sessionStorage — minimal browser example\nconsole.log('[b3-interview-cookies-vs-storage]', "
    }
  ],
  "pitfalls": [
    "Interview trap: describing Cookies vs localStorage vs sessionStorage from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Cookies vs localStorage vs sessionStorage at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Cookies vs localStorage vs sessionStorage is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Cookies vs localStorage vs sessionStorage?",
      "When would Cookies vs localStorage vs sessionStorage block rendering or fail cross-origin?",
      "What is the classic Cookies vs localStorage vs sessionStorage interview trap?"
    ],
    "traps": [
      "Interview trap: describing Cookies vs localStorage vs sessionStorage from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide cookies vs localstorage vs sessionstorage details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Cookies vs localStorage vs sessionStorage."
    ]
  }
})
