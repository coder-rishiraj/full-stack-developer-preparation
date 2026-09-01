import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Common Request Headers",
  "whatIsIt": "Common Request Headers is a core Web Platform concept in Browser HTTP. It belongs to HTTP from the browser perspective (requests, headers, caching). Understanding Common Request Headers helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide common request headers details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Common Request Headers as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Common Request Headers in B3.10 — Browser HTTP: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Common Request Headers to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about common request headers.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Common Request Headers from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Common Request Headers — minimal browser example\nconsole.log('[b3-request-headers]', typeof document);\n// Open DevTools → verify behavior for: Common Request Headers\n// Spec reference: developer.mozilla.org (search \"Common Request Headers\")",
  "exampleCaption": "Common Request Headers — observe in DevTools while this runs",
  "internals": [
    "Common Request Headers is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for common request headers can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether common request headers succeeds in production."
  ],
  "takeaways": [
    "Locate Common Request Headers in B3.10 — Browser HTTP: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Common Request Headers to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Common Request Headers from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Common Request Headers is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Common Request Headers: Treat Common Request Headers as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Common Request Headers in B3.10 — Browser HTTP: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Common Request Headers to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Common Request Headers from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Common Request Headers",
      "Common Request Headers is a core Web Platform concept in Browser HTTP."
    ],
    [
      "Mental model",
      "Treat Common Request Headers as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Common Request Headers from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Common Request Headers in B3.10 — Browser HTTP: map it to MDN reference d",
      "Connect Common Request Headers to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Common Request Headers in the browser and when do you use it?",
      "answerHint": "Common Request Headers is a core Web Platform concept in Browser HTTP. It belongs to HTTP from the browser perspective (requests, headers, caching). Understanding Common Request Headers helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Common Request Headers with a DevTools observation and one pitfall.",
      "answerHint": "Locate Common Request Headers in B3.10 — Browser HTTP: map it to MDN reference docs and observe behavior in DevTools. Connect Common Request Headers to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about common request headers. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Common Request Headers from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Common Request Headers in a senior frontend interview?",
      "answerHint": "Common Request Headers is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for common request headers can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether common request headers succeeds in production. // Common Request Headers — minimal browser example\nconsole.log('[b3-request-headers]', typeof document);\n// Open DevToo"
    }
  ],
  "pitfalls": [
    "Interview trap: describing Common Request Headers from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Common Request Headers at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Common Request Headers is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Common Request Headers?",
      "When would Common Request Headers block rendering or fail cross-origin?",
      "What is the classic Common Request Headers interview trap?"
    ],
    "traps": [
      "Interview trap: describing Common Request Headers from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide common request headers details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Common Request Headers."
    ]
  }
})
