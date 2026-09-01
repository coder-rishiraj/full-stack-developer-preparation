import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Permission Lifecycle & Prompts",
  "whatIsIt": "Permission Lifecycle & Prompts is a core Web Platform concept in Permissions & Device APIs. It belongs to Permissions API and device APIs in secure contexts. Understanding Permission Lifecycle & Prompts helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide permission lifecycle & prompts details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Permission Lifecycle & Prompts as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Permission Lifecycle & Prompts in B3.34 — Permissions & Device APIs: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Permission Lifecycle & Prompts to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about permission lifecycle & prompts.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Permission Lifecycle & Prompts from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Permission Lifecycle & Prompts — minimal browser example\nconsole.log('[b3-permission-lifecycle]', typeof document);\n// Open DevTools → verify behavior for: Permission Lifecycle & Prompts\n// Spec reference: developer.mozilla.org (search \"Permission Lifecycle & Prompts\")",
  "exampleCaption": "Permission Lifecycle & Prompts — observe in DevTools while this runs",
  "internals": [
    "Permission Lifecycle & Prompts is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for permission lifecycle & prompts can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether permission lifecycle & prompts succeeds in production."
  ],
  "takeaways": [
    "Locate Permission Lifecycle & Prompts in B3.34 — Permissions & Device APIs: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Permission Lifecycle & Prompts to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Permission Lifecycle & Prompts from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Permission Lifecycle & Prompts is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Permission Lifecycle & Prompts: Treat Permission Lifecycle & Prompts as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Permission Lifecycle & Prompts in B3.34 — Permissions & Device APIs: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Permission Lifecycle & Prompts to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Permission Lifecycle & Prompts from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Permission Lifecycle & Prompts",
      "Permission Lifecycle & Prompts is a core Web Platform concept in Permissions & Device APIs."
    ],
    [
      "Mental model",
      "Treat Permission Lifecycle & Prompts as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Permission Lifecycle & Prompts from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Permission Lifecycle & Prompts in B3.34 — Permissions & Device APIs: map ",
      "Connect Permission Lifecycle & Prompts to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Permission Lifecycle & Prompts in the browser and when do you use it?",
      "answerHint": "Permission Lifecycle & Prompts is a core Web Platform concept in Permissions & Device APIs. It belongs to Permissions API and device APIs in secure contexts. Understanding Permission Lifecycle & Prompts helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Permission Lifecycle & Prompts with a DevTools observation and one pitfall.",
      "answerHint": "Locate Permission Lifecycle & Prompts in B3.34 — Permissions & Device APIs: map it to MDN reference docs and observe behavior in DevTools. Connect Permission Lifecycle & Prompts to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about permission lifecycle & prompts. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Permission Lifecycle & Prompts from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Permission Lifecycle & Prompts in a senior frontend interview?",
      "answerHint": "Permission Lifecycle & Prompts is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for permission lifecycle & prompts can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether permission lifecycle & prompts succeeds in production. // Permission Lifecycle & Prompts — minimal browser example\nconsole.log('[b3-permission-lifecycle]', typeof document);\n/"
    }
  ],
  "pitfalls": [
    "Interview trap: describing Permission Lifecycle & Prompts from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Permission Lifecycle & Prompts at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Permission Lifecycle & Prompts is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Permission Lifecycle & Prompts?",
      "When would Permission Lifecycle & Prompts block rendering or fail cross-origin?",
      "What is the classic Permission Lifecycle & Prompts interview trap?"
    ],
    "traps": [
      "Interview trap: describing Permission Lifecycle & Prompts from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide permission lifecycle & prompts details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Permission Lifecycle & Prompts."
    ]
  }
})
