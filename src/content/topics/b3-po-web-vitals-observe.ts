import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Observing Web Vitals",
  "whatIsIt": "Observing Web Vitals is a core Web Platform concept in Observer APIs. It belongs to Observer APIs (Intersection, Resize, Mutation, Performance). Understanding Observing Web Vitals helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide observing web vitals details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Observing Web Vitals as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Observing Web Vitals in B3.25 — Observer APIs: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Observing Web Vitals to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about observing web vitals.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Observing Web Vitals from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Observing Web Vitals — minimal browser example\nconsole.log('[b3-po-web-vitals-observe]', typeof document);\n// Open DevTools → verify behavior for: Observing Web Vitals\n// Spec reference: developer.mozilla.org (search \"Observing Web Vitals\")",
  "exampleCaption": "Observing Web Vitals — observe in DevTools while this runs",
  "internals": [
    "Observing Web Vitals is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for observing web vitals can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether observing web vitals succeeds in production."
  ],
  "takeaways": [
    "Locate Observing Web Vitals in B3.25 — Observer APIs: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Observing Web Vitals to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Observing Web Vitals from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Observing Web Vitals is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Observing Web Vitals: Treat Observing Web Vitals as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Observing Web Vitals in B3.25 — Observer APIs: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Observing Web Vitals to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Observing Web Vitals from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Observing Web Vitals",
      "Observing Web Vitals is a core Web Platform concept in Observer APIs."
    ],
    [
      "Mental model",
      "Treat Observing Web Vitals as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Observing Web Vitals from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Observing Web Vitals in B3.25 — Observer APIs: map it to MDN reference do",
      "Connect Observing Web Vitals to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Observing Web Vitals in the browser and when do you use it?",
      "answerHint": "Observing Web Vitals is a core Web Platform concept in Observer APIs. It belongs to Observer APIs (Intersection, Resize, Mutation, Performance). Understanding Observing Web Vitals helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Observing Web Vitals with a DevTools observation and one pitfall.",
      "answerHint": "Locate Observing Web Vitals in B3.25 — Observer APIs: map it to MDN reference docs and observe behavior in DevTools. Connect Observing Web Vitals to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about observing web vitals. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Observing Web Vitals from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Observing Web Vitals in a senior frontend interview?",
      "answerHint": "Observing Web Vitals is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for observing web vitals can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether observing web vitals succeeds in production. // Observing Web Vitals — minimal browser example\nconsole.log('[b3-po-web-vitals-observe]', typeof document);\n// Open De"
    }
  ],
  "pitfalls": [
    "Interview trap: describing Observing Web Vitals from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Observing Web Vitals at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Observing Web Vitals is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Observing Web Vitals?",
      "When would Observing Web Vitals block rendering or fail cross-origin?",
      "What is the classic Observing Web Vitals interview trap?"
    ],
    "traps": [
      "Interview trap: describing Observing Web Vitals from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide observing web vitals details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Observing Web Vitals."
    ]
  }
})
