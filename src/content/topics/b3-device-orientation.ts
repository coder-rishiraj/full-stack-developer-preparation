import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Device Orientation / Motion",
  "whatIsIt": "Device Orientation / Motion is a core Web Platform concept in Permissions & Device APIs. It belongs to Permissions API and device APIs in secure contexts. Understanding Device Orientation / Motion helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide device orientation / motion details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Device Orientation / Motion as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Device Orientation / Motion in B3.34 — Permissions & Device APIs: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Device Orientation / Motion to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about device orientation / motion.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Device Orientation / Motion from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Device Orientation / Motion — minimal browser example\nconsole.log('[b3-device-orientation]', typeof document);\n// Open DevTools → verify behavior for: Device Orientation / Motion\n// Spec reference: developer.mozilla.org (search \"Device Orientation / Motion\")",
  "exampleCaption": "Device Orientation / Motion — observe in DevTools while this runs",
  "internals": [
    "Device Orientation / Motion is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for device orientation / motion can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether device orientation / motion succeeds in production."
  ],
  "takeaways": [
    "Locate Device Orientation / Motion in B3.34 — Permissions & Device APIs: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Device Orientation / Motion to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Device Orientation / Motion from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Device Orientation / Motion is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Device Orientation / Motion: Treat Device Orientation / Motion as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Device Orientation / Motion in B3.34 — Permissions & Device APIs: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Device Orientation / Motion to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Device Orientation / Motion from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Device Orientation / Motion",
      "Device Orientation / Motion is a core Web Platform concept in Permissions & Device APIs."
    ],
    [
      "Mental model",
      "Treat Device Orientation / Motion as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Device Orientation / Motion from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Device Orientation / Motion in B3.34 — Permissions & Device APIs: map it ",
      "Connect Device Orientation / Motion to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Device Orientation / Motion in the browser and when do you use it?",
      "answerHint": "Device Orientation / Motion is a core Web Platform concept in Permissions & Device APIs. It belongs to Permissions API and device APIs in secure contexts. Understanding Device Orientation / Motion helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Device Orientation / Motion with a DevTools observation and one pitfall.",
      "answerHint": "Locate Device Orientation / Motion in B3.34 — Permissions & Device APIs: map it to MDN reference docs and observe behavior in DevTools. Connect Device Orientation / Motion to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about device orientation / motion. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Device Orientation / Motion from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Device Orientation / Motion in a senior frontend interview?",
      "answerHint": "Device Orientation / Motion is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for device orientation / motion can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether device orientation / motion succeeds in production. // Device Orientation / Motion — minimal browser example\nconsole.log('[b3-device-orientation]', typeof document);\n// Ope"
    }
  ],
  "pitfalls": [
    "Interview trap: describing Device Orientation / Motion from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Device Orientation / Motion at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Device Orientation / Motion is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Device Orientation / Motion?",
      "When would Device Orientation / Motion block rendering or fail cross-origin?",
      "What is the classic Device Orientation / Motion interview trap?"
    ],
    "traps": [
      "Interview trap: describing Device Orientation / Motion from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide device orientation / motion details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Device Orientation / Motion."
    ]
  }
})
