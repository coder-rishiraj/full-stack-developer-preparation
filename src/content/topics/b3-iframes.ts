import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "iframe Fundamentals",
  "whatIsIt": "iframe Fundamentals is a core Web Platform concept in iframe & Cross-Document Communication. It belongs to iframes, postMessage, and cross-document communication. Understanding iframe Fundamentals helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide iframe fundamentals details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat iframe Fundamentals as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate iframe Fundamentals in B3.30 — iframe & Cross-Document Communication: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect iframe Fundamentals to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about iframe fundamentals.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing iframe Fundamentals from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// iframe Fundamentals — minimal browser example\nconsole.log('[b3-iframes]', typeof document);\n// Open DevTools → verify behavior for: iframe Fundamentals\n// Spec reference: developer.mozilla.org (search \"iframe Fundamentals\")",
  "exampleCaption": "iframe Fundamentals — observe in DevTools while this runs",
  "internals": [
    "iframe Fundamentals is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for iframe fundamentals can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether iframe fundamentals succeeds in production."
  ],
  "takeaways": [
    "Locate iframe Fundamentals in B3.30 — iframe & Cross-Document Communication: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect iframe Fundamentals to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing iframe Fundamentals from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "iframe Fundamentals is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "iframe Fundamentals: Treat iframe Fundamentals as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate iframe Fundamentals in B3.30 — iframe & Cross-Document Communication: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect iframe Fundamentals to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing iframe Fundamentals from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "iframe Fundamentals",
      "iframe Fundamentals is a core Web Platform concept in iframe & Cross-Document Communication."
    ],
    [
      "Mental model",
      "Treat iframe Fundamentals as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing iframe Fundamentals from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate iframe Fundamentals in B3.30 — iframe & Cross-Document Communication: map",
      "Connect iframe Fundamentals to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is iframe Fundamentals in the browser and when do you use it?",
      "answerHint": "iframe Fundamentals is a core Web Platform concept in iframe & Cross-Document Communication. It belongs to iframes, postMessage, and cross-document communication. Understanding iframe Fundamentals helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain iframe Fundamentals with a DevTools observation and one pitfall.",
      "answerHint": "Locate iframe Fundamentals in B3.30 — iframe & Cross-Document Communication: map it to MDN reference docs and observe behavior in DevTools. Connect iframe Fundamentals to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about iframe fundamentals. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing iframe Fundamentals from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain iframe Fundamentals in a senior frontend interview?",
      "answerHint": "iframe Fundamentals is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for iframe fundamentals can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether iframe fundamentals succeeds in production. // iframe Fundamentals — minimal browser example\nconsole.log('[b3-iframes]', typeof document);\n// Open DevTools → verify"
    }
  ],
  "pitfalls": [
    "Interview trap: describing iframe Fundamentals from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain iframe Fundamentals at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "iframe Fundamentals is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is iframe Fundamentals?",
      "When would iframe Fundamentals block rendering or fail cross-origin?",
      "What is the classic iframe Fundamentals interview trap?"
    ],
    "traps": [
      "Interview trap: describing iframe Fundamentals from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide iframe fundamentals details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around iframe Fundamentals."
    ]
  }
})
