import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "3xx Redirection Codes",
  "whatIsIt": "3xx Redirection Codes is a core Web Platform concept in Browser HTTP. It belongs to HTTP from the browser perspective (requests, headers, caching). Understanding 3xx Redirection Codes helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide 3xx redirection codes details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat 3xx Redirection Codes as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate 3xx Redirection Codes in B3.10 — Browser HTTP: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect 3xx Redirection Codes to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about 3xx redirection codes.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing 3xx Redirection Codes from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// 3xx Redirection Codes — minimal browser example\nconsole.log('[b3-status-3xx]', typeof document);\n// Open DevTools → verify behavior for: 3xx Redirection Codes\n// Spec reference: developer.mozilla.org (search \"3xx Redirection Codes\")",
  "exampleCaption": "3xx Redirection Codes — observe in DevTools while this runs",
  "internals": [
    "3xx Redirection Codes is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for 3xx redirection codes can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether 3xx redirection codes succeeds in production."
  ],
  "takeaways": [
    "Locate 3xx Redirection Codes in B3.10 — Browser HTTP: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect 3xx Redirection Codes to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing 3xx Redirection Codes from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "3xx Redirection Codes is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "3xx Redirection Codes: Treat 3xx Redirection Codes as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate 3xx Redirection Codes in B3.10 — Browser HTTP: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect 3xx Redirection Codes to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing 3xx Redirection Codes from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "3xx Redirection Codes",
      "3xx Redirection Codes is a core Web Platform concept in Browser HTTP."
    ],
    [
      "Mental model",
      "Treat 3xx Redirection Codes as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing 3xx Redirection Codes from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate 3xx Redirection Codes in B3.10 — Browser HTTP: map it to MDN reference do",
      "Connect 3xx Redirection Codes to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is 3xx Redirection Codes in the browser and when do you use it?",
      "answerHint": "3xx Redirection Codes is a core Web Platform concept in Browser HTTP. It belongs to HTTP from the browser perspective (requests, headers, caching). Understanding 3xx Redirection Codes helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain 3xx Redirection Codes with a DevTools observation and one pitfall.",
      "answerHint": "Locate 3xx Redirection Codes in B3.10 — Browser HTTP: map it to MDN reference docs and observe behavior in DevTools. Connect 3xx Redirection Codes to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about 3xx redirection codes. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing 3xx Redirection Codes from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain 3xx Redirection Codes in a senior frontend interview?",
      "answerHint": "3xx Redirection Codes is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for 3xx redirection codes can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether 3xx redirection codes succeeds in production. // 3xx Redirection Codes — minimal browser example\nconsole.log('[b3-status-3xx]', typeof document);\n// Open DevTools → v"
    }
  ],
  "pitfalls": [
    "Interview trap: describing 3xx Redirection Codes from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain 3xx Redirection Codes at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "3xx Redirection Codes is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is 3xx Redirection Codes?",
      "When would 3xx Redirection Codes block rendering or fail cross-origin?",
      "What is the classic 3xx Redirection Codes interview trap?"
    ],
    "traps": [
      "Interview trap: describing 3xx Redirection Codes from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide 3xx redirection codes details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around 3xx Redirection Codes."
    ]
  }
})
