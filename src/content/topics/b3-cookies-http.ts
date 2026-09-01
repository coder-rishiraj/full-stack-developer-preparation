import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Cookies in HTTP",
  "whatIsIt": "Cookies in HTTP is a core Web Platform concept in Browser HTTP. It belongs to HTTP from the browser perspective (requests, headers, caching). Understanding Cookies in HTTP helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide cookies in http details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Cookies in HTTP as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Cookies in HTTP in B3.10 — Browser HTTP: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Cookies in HTTP to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about cookies in http.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Cookies in HTTP from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Cookies in HTTP — minimal browser example\nconsole.log('[b3-cookies-http]', typeof document);\n// Open DevTools → verify behavior for: Cookies in HTTP\n// Spec reference: developer.mozilla.org (search \"Cookies in HTTP\")",
  "exampleCaption": "Cookies in HTTP — observe in DevTools while this runs",
  "internals": [
    "Cookies in HTTP is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for cookies in http can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether cookies in http succeeds in production."
  ],
  "takeaways": [
    "Locate Cookies in HTTP in B3.10 — Browser HTTP: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Cookies in HTTP to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Cookies in HTTP from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Cookies in HTTP is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Cookies in HTTP: Treat Cookies in HTTP as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Cookies in HTTP in B3.10 — Browser HTTP: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Cookies in HTTP to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Cookies in HTTP from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Cookies in HTTP",
      "Cookies in HTTP is a core Web Platform concept in Browser HTTP."
    ],
    [
      "Mental model",
      "Treat Cookies in HTTP as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Cookies in HTTP from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Cookies in HTTP in B3.10 — Browser HTTP: map it to MDN reference docs and",
      "Connect Cookies in HTTP to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Cookies in HTTP in the browser and when do you use it?",
      "answerHint": "Cookies in HTTP is a core Web Platform concept in Browser HTTP. It belongs to HTTP from the browser perspective (requests, headers, caching). Understanding Cookies in HTTP helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Cookies in HTTP with a DevTools observation and one pitfall.",
      "answerHint": "Locate Cookies in HTTP in B3.10 — Browser HTTP: map it to MDN reference docs and observe behavior in DevTools. Connect Cookies in HTTP to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about cookies in http. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Cookies in HTTP from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Cookies in HTTP in a senior frontend interview?",
      "answerHint": "Cookies in HTTP is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for cookies in http can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether cookies in http succeeds in production. // Cookies in HTTP — minimal browser example\nconsole.log('[b3-cookies-http]', typeof document);\n// Open DevTools → verif"
    }
  ],
  "pitfalls": [
    "Interview trap: describing Cookies in HTTP from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Cookies in HTTP at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Cookies in HTTP is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Cookies in HTTP?",
      "When would Cookies in HTTP block rendering or fail cross-origin?",
      "What is the classic Cookies in HTTP interview trap?"
    ],
    "traps": [
      "Interview trap: describing Cookies in HTTP from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide cookies in http details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Cookies in HTTP."
    ]
  }
})
