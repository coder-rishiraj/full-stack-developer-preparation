import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Third-Party Cookies",
  "whatIsIt": "Third-Party Cookies is a core Web Platform concept in Cookies. It belongs to HTTP cookies, attributes, and security implications. Understanding Third-Party Cookies helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide third-party cookies details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Third-Party Cookies as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Third-Party Cookies in B3.15 — Cookies: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Third-Party Cookies to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about third-party cookies.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Third-Party Cookies from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Third-Party Cookies — minimal browser example\nconsole.log('[b3-third-party-cookies]', typeof document);\n// Open DevTools → verify behavior for: Third-Party Cookies\n// Spec reference: developer.mozilla.org (search \"Third-Party Cookies\")",
  "exampleCaption": "Third-Party Cookies — observe in DevTools while this runs",
  "internals": [
    "Third-Party Cookies is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for third-party cookies can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether third-party cookies succeeds in production."
  ],
  "takeaways": [
    "Locate Third-Party Cookies in B3.15 — Cookies: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Third-Party Cookies to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Third-Party Cookies from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Third-Party Cookies is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Third-Party Cookies: Treat Third-Party Cookies as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Third-Party Cookies in B3.15 — Cookies: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Third-Party Cookies to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Third-Party Cookies from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Third-Party Cookies",
      "Third-Party Cookies is a core Web Platform concept in Cookies."
    ],
    [
      "Mental model",
      "Treat Third-Party Cookies as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Third-Party Cookies from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Third-Party Cookies in B3.15 — Cookies: map it to MDN reference docs and ",
      "Connect Third-Party Cookies to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Third-Party Cookies in the browser and when do you use it?",
      "answerHint": "Third-Party Cookies is a core Web Platform concept in Cookies. It belongs to HTTP cookies, attributes, and security implications. Understanding Third-Party Cookies helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Third-Party Cookies with a DevTools observation and one pitfall.",
      "answerHint": "Locate Third-Party Cookies in B3.15 — Cookies: map it to MDN reference docs and observe behavior in DevTools. Connect Third-Party Cookies to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about third-party cookies. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Third-Party Cookies from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Third-Party Cookies in a senior frontend interview?",
      "answerHint": "Third-Party Cookies is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for third-party cookies can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether third-party cookies succeeds in production. // Third-Party Cookies — minimal browser example\nconsole.log('[b3-third-party-cookies]', typeof document);\n// Open DevTo"
    }
  ],
  "pitfalls": [
    "Interview trap: describing Third-Party Cookies from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Third-Party Cookies at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Third-Party Cookies is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Third-Party Cookies?",
      "When would Third-Party Cookies block rendering or fail cross-origin?",
      "What is the classic Third-Party Cookies interview trap?"
    ],
    "traps": [
      "Interview trap: describing Third-Party Cookies from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide third-party cookies details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Third-Party Cookies."
    ]
  }
})
