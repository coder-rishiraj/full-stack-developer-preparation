import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Same-Site vs Same-Origin",
  "whatIsIt": "Same-Site vs Same-Origin is a core Web Platform concept in Same-Origin Policy. It belongs to the Same-Origin Policy and cross-origin restrictions. Understanding Same-Site vs Same-Origin helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide same-site vs same-origin details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Same-Site vs Same-Origin as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Same-Site vs Same-Origin in B3.13 — Same-Origin Policy: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Same-Site vs Same-Origin to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about same-site vs same-origin.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Same-Site vs Same-Origin from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Same-Site vs Same-Origin — minimal browser example\nconsole.log('[b3-same-site-vs-same-origin]', typeof document);\n// Open DevTools → verify behavior for: Same-Site vs Same-Origin\n// Spec reference: developer.mozilla.org (search \"Same-Site vs Same-Origin\")",
  "exampleCaption": "Same-Site vs Same-Origin — observe in DevTools while this runs",
  "internals": [
    "Same-Site vs Same-Origin is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for same-site vs same-origin can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether same-site vs same-origin succeeds in production."
  ],
  "takeaways": [
    "Locate Same-Site vs Same-Origin in B3.13 — Same-Origin Policy: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Same-Site vs Same-Origin to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Same-Site vs Same-Origin from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Same-Site vs Same-Origin is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Same-Site vs Same-Origin: Treat Same-Site vs Same-Origin as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Same-Site vs Same-Origin in B3.13 — Same-Origin Policy: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Same-Site vs Same-Origin to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Same-Site vs Same-Origin from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Same-Site vs Same-Origin",
      "Same-Site vs Same-Origin is a core Web Platform concept in Same-Origin Policy."
    ],
    [
      "Mental model",
      "Treat Same-Site vs Same-Origin as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Same-Site vs Same-Origin from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Same-Site vs Same-Origin in B3.13 — Same-Origin Policy: map it to MDN ref",
      "Connect Same-Site vs Same-Origin to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Same-Site vs Same-Origin in the browser and when do you use it?",
      "answerHint": "Same-Site vs Same-Origin is a core Web Platform concept in Same-Origin Policy. It belongs to the Same-Origin Policy and cross-origin restrictions. Understanding Same-Site vs Same-Origin helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Same-Site vs Same-Origin with a DevTools observation and one pitfall.",
      "answerHint": "Locate Same-Site vs Same-Origin in B3.13 — Same-Origin Policy: map it to MDN reference docs and observe behavior in DevTools. Connect Same-Site vs Same-Origin to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about same-site vs same-origin. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Same-Site vs Same-Origin from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Same-Site vs Same-Origin in a senior frontend interview?",
      "answerHint": "Same-Site vs Same-Origin is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for same-site vs same-origin can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether same-site vs same-origin succeeds in production. // Same-Site vs Same-Origin — minimal browser example\nconsole.log('[b3-same-site-vs-same-origin]', typeof document);\n// "
    }
  ],
  "pitfalls": [
    "Interview trap: describing Same-Site vs Same-Origin from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Same-Site vs Same-Origin at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Same-Site vs Same-Origin is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Same-Site vs Same-Origin?",
      "When would Same-Site vs Same-Origin block rendering or fail cross-origin?",
      "What is the classic Same-Site vs Same-Origin interview trap?"
    ],
    "traps": [
      "Interview trap: describing Same-Site vs Same-Origin from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide same-site vs same-origin details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Same-Site vs Same-Origin."
    ]
  }
})
