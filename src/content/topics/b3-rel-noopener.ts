import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "rel=\"noopener\"",
  "whatIsIt": "rel=\"noopener\" is a core Web Platform concept in iframe & Cross-Document Communication. It belongs to iframes, postMessage, and cross-document communication. Understanding rel=\"noopener\" helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide rel=\"noopener\" details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat rel=\"noopener\" as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate rel=\"noopener\" in B3.30 — iframe & Cross-Document Communication: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect rel=\"noopener\" to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about rel=\"noopener\".",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing rel=\"noopener\" from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// rel=\"noopener\" — minimal browser example\nconsole.log('[b3-rel-noopener]', typeof document);\n// Open DevTools → verify behavior for: rel=\"noopener\"\n// Spec reference: developer.mozilla.org (search \"rel=\"noopener\"\")",
  "exampleCaption": "rel=\"noopener\" — observe in DevTools while this runs",
  "internals": [
    "rel=\"noopener\" is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for rel=\"noopener\" can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether rel=\"noopener\" succeeds in production."
  ],
  "takeaways": [
    "Locate rel=\"noopener\" in B3.30 — iframe & Cross-Document Communication: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect rel=\"noopener\" to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing rel=\"noopener\" from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "rel=\"noopener\" is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "rel=\"noopener\": Treat rel=\"noopener\" as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate rel=\"noopener\" in B3.30 — iframe & Cross-Document Communication: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect rel=\"noopener\" to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing rel=\"noopener\" from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "rel=\"noopener\"",
      "rel=\"noopener\" is a core Web Platform concept in iframe & Cross-Document Communication."
    ],
    [
      "Mental model",
      "Treat rel=\"noopener\" as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing rel=\"noopener\" from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate rel=\"noopener\" in B3.30 — iframe & Cross-Document Communication: map it t",
      "Connect rel=\"noopener\" to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is rel=\"noopener\" in the browser and when do you use it?",
      "answerHint": "rel=\"noopener\" is a core Web Platform concept in iframe & Cross-Document Communication. It belongs to iframes, postMessage, and cross-document communication. Understanding rel=\"noopener\" helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain rel=\"noopener\" with a DevTools observation and one pitfall.",
      "answerHint": "Locate rel=\"noopener\" in B3.30 — iframe & Cross-Document Communication: map it to MDN reference docs and observe behavior in DevTools. Connect rel=\"noopener\" to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about rel=\"noopener\". Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing rel=\"noopener\" from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain rel=\"noopener\" in a senior frontend interview?",
      "answerHint": "rel=\"noopener\" is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for rel=\"noopener\" can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether rel=\"noopener\" succeeds in production. // rel=\"noopener\" — minimal browser example\nconsole.log('[b3-rel-noopener]', typeof document);\n// Open DevTools → verify"
    }
  ],
  "pitfalls": [
    "Interview trap: describing rel=\"noopener\" from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain rel=\"noopener\" at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "rel=\"noopener\" is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is rel=\"noopener\"?",
      "When would rel=\"noopener\" block rendering or fail cross-origin?",
      "What is the classic rel=\"noopener\" interview trap?"
    ],
    "traps": [
      "Interview trap: describing rel=\"noopener\" from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide rel=\"noopener\" details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around rel=\"noopener\"."
    ]
  }
})
