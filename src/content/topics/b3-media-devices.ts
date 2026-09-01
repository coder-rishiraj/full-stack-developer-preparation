import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "MediaDevices (Camera / Microphone)",
  "whatIsIt": "MediaDevices (Camera / Microphone) is a core Web Platform concept in Permissions & Device APIs. It belongs to Permissions API and device APIs in secure contexts. Understanding MediaDevices (Camera / Microphone) helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide mediadevices (camera / microphone) details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat MediaDevices (Camera / Microphone) as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate MediaDevices (Camera / Microphone) in B3.34 — Permissions & Device APIs: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect MediaDevices (Camera / Microphone) to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about mediadevices (camera / microphone).",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing MediaDevices (Camera / Microphone) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// MediaDevices (Camera / Microphone) — minimal browser example\nconsole.log('[b3-media-devices]', typeof document);\n// Open DevTools → verify behavior for: MediaDevices (Camera / Microphone)\n// Spec reference: developer.mozilla.org (search \"MediaDevices (Camera / Microphone)\")",
  "exampleCaption": "MediaDevices (Camera / Microphone) — observe in DevTools while this runs",
  "internals": [
    "MediaDevices (Camera / Microphone) is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for mediadevices (camera / microphone) can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether mediadevices (camera / microphone) succeeds in production."
  ],
  "takeaways": [
    "Locate MediaDevices (Camera / Microphone) in B3.34 — Permissions & Device APIs: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect MediaDevices (Camera / Microphone) to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing MediaDevices (Camera / Microphone) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "MediaDevices (Camera / Microphone) is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "MediaDevices (Camera / Microphone): Treat MediaDevices (Camera / Microphone) as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate MediaDevices (Camera / Microphone) in B3.34 — Permissions & Device APIs: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect MediaDevices (Camera / Microphone) to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing MediaDevices (Camera / Microphone) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "MediaDevices (Camera / Microphone)",
      "MediaDevices (Camera / Microphone) is a core Web Platform concept in Permissions & Device APIs."
    ],
    [
      "Mental model",
      "Treat MediaDevices (Camera / Microphone) as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing MediaDevices (Camera / Microphone) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate MediaDevices (Camera / Microphone) in B3.34 — Permissions & Device APIs: ",
      "Connect MediaDevices (Camera / Microphone) to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is MediaDevices (Camera / Microphone) in the browser and when do you use it?",
      "answerHint": "MediaDevices (Camera / Microphone) is a core Web Platform concept in Permissions & Device APIs. It belongs to Permissions API and device APIs in secure contexts. Understanding MediaDevices (Camera / Microphone) helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain MediaDevices (Camera / Microphone) with a DevTools observation and one pitfall.",
      "answerHint": "Locate MediaDevices (Camera / Microphone) in B3.34 — Permissions & Device APIs: map it to MDN reference docs and observe behavior in DevTools. Connect MediaDevices (Camera / Microphone) to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about mediadevices (camera / microphone). Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing MediaDevices (Camera / Microphone) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain MediaDevices (Camera / Microphone) in a senior frontend interview?",
      "answerHint": "MediaDevices (Camera / Microphone) is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for mediadevices (camera / microphone) can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether mediadevices (camera / microphone) succeeds in production. // MediaDevices (Camera / Microphone) — minimal browser example\nconsole.log('[b3-media-devices]', typeof document);\n// O"
    }
  ],
  "pitfalls": [
    "Interview trap: describing MediaDevices (Camera / Microphone) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain MediaDevices (Camera / Microphone) at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "MediaDevices (Camera / Microphone) is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is MediaDevices (Camera / Microphone)?",
      "When would MediaDevices (Camera / Microphone) block rendering or fail cross-origin?",
      "What is the classic MediaDevices (Camera / Microphone) interview trap?"
    ],
    "traps": [
      "Interview trap: describing MediaDevices (Camera / Microphone) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide mediadevices (camera / microphone) details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around MediaDevices (Camera / Microphone)."
    ]
  }
})
