import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Resource Load Priority",
  "whatIsIt": "Resource Load Priority is a core Web Platform concept in HTML Parsing & Page Loading. It belongs to HTML parsing, script loading, and page lifecycle events. Understanding Resource Load Priority helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide resource load priority details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Resource Load Priority as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Resource Load Priority in B3.5 — HTML Parsing & Page Loading: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Resource Load Priority to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about resource load priority.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Resource Load Priority from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Resource Load Priority — minimal browser example\nconsole.log('[b3-resource-priority]', typeof document);\n// Open DevTools → verify behavior for: Resource Load Priority\n// Spec reference: developer.mozilla.org (search \"Resource Load Priority\")",
  "exampleCaption": "Resource Load Priority — observe in DevTools while this runs",
  "internals": [
    "Resource Load Priority is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for resource load priority can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether resource load priority succeeds in production."
  ],
  "takeaways": [
    "Locate Resource Load Priority in B3.5 — HTML Parsing & Page Loading: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Resource Load Priority to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Resource Load Priority from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Resource Load Priority is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Resource Load Priority: Treat Resource Load Priority as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Resource Load Priority in B3.5 — HTML Parsing & Page Loading: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Resource Load Priority to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Resource Load Priority from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Resource Load Priority",
      "Resource Load Priority is a core Web Platform concept in HTML Parsing & Page Loading."
    ],
    [
      "Mental model",
      "Treat Resource Load Priority as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Resource Load Priority from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Resource Load Priority in B3.5 — HTML Parsing & Page Loading: map it to M",
      "Connect Resource Load Priority to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Resource Load Priority in the browser and when do you use it?",
      "answerHint": "Resource Load Priority is a core Web Platform concept in HTML Parsing & Page Loading. It belongs to HTML parsing, script loading, and page lifecycle events. Understanding Resource Load Priority helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Resource Load Priority with a DevTools observation and one pitfall.",
      "answerHint": "Locate Resource Load Priority in B3.5 — HTML Parsing & Page Loading: map it to MDN reference docs and observe behavior in DevTools. Connect Resource Load Priority to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about resource load priority. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Resource Load Priority from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Resource Load Priority in a senior frontend interview?",
      "answerHint": "Resource Load Priority is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for resource load priority can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether resource load priority succeeds in production. // Resource Load Priority — minimal browser example\nconsole.log('[b3-resource-priority]', typeof document);\n// Open DevT"
    }
  ],
  "pitfalls": [
    "Interview trap: describing Resource Load Priority from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Resource Load Priority at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Resource Load Priority is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Resource Load Priority?",
      "When would Resource Load Priority block rendering or fail cross-origin?",
      "What is the classic Resource Load Priority interview trap?"
    ],
    "traps": [
      "Interview trap: describing Resource Load Priority from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide resource load priority details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Resource Load Priority."
    ]
  }
})
