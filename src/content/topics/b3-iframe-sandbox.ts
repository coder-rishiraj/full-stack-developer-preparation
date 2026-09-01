import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "sandbox Attribute",
  "whatIsIt": "sandbox Attribute is a core Web Platform concept in iframe & Cross-Document Communication. It belongs to iframes, postMessage, and cross-document communication. Understanding sandbox Attribute helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide sandbox attribute details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat sandbox Attribute as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate sandbox Attribute in B3.30 — iframe & Cross-Document Communication: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect sandbox Attribute to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about sandbox attribute.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing sandbox Attribute from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// sandbox Attribute — minimal browser example\nconsole.log('[b3-iframe-sandbox]', typeof document);\n// Open DevTools → verify behavior for: sandbox Attribute\n// Spec reference: developer.mozilla.org (search \"sandbox Attribute\")",
  "exampleCaption": "sandbox Attribute — observe in DevTools while this runs",
  "internals": [
    "sandbox Attribute is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for sandbox attribute can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether sandbox attribute succeeds in production."
  ],
  "takeaways": [
    "Locate sandbox Attribute in B3.30 — iframe & Cross-Document Communication: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect sandbox Attribute to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing sandbox Attribute from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "sandbox Attribute is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "sandbox Attribute: Treat sandbox Attribute as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate sandbox Attribute in B3.30 — iframe & Cross-Document Communication: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect sandbox Attribute to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing sandbox Attribute from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "sandbox Attribute",
      "sandbox Attribute is a core Web Platform concept in iframe & Cross-Document Communication."
    ],
    [
      "Mental model",
      "Treat sandbox Attribute as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing sandbox Attribute from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate sandbox Attribute in B3.30 — iframe & Cross-Document Communication: map i",
      "Connect sandbox Attribute to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is sandbox Attribute in the browser and when do you use it?",
      "answerHint": "sandbox Attribute is a core Web Platform concept in iframe & Cross-Document Communication. It belongs to iframes, postMessage, and cross-document communication. Understanding sandbox Attribute helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain sandbox Attribute with a DevTools observation and one pitfall.",
      "answerHint": "Locate sandbox Attribute in B3.30 — iframe & Cross-Document Communication: map it to MDN reference docs and observe behavior in DevTools. Connect sandbox Attribute to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about sandbox attribute. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing sandbox Attribute from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain sandbox Attribute in a senior frontend interview?",
      "answerHint": "sandbox Attribute is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for sandbox attribute can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether sandbox attribute succeeds in production. // sandbox Attribute — minimal browser example\nconsole.log('[b3-iframe-sandbox]', typeof document);\n// Open DevTools → v"
    }
  ],
  "pitfalls": [
    "Interview trap: describing sandbox Attribute from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain sandbox Attribute at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "sandbox Attribute is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is sandbox Attribute?",
      "When would sandbox Attribute block rendering or fail cross-origin?",
      "What is the classic sandbox Attribute interview trap?"
    ],
    "traps": [
      "Interview trap: describing sandbox Attribute from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide sandbox attribute details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around sandbox Attribute."
    ]
  }
})
