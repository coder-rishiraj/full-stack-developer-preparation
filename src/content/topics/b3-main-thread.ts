import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Main Thread",
  "whatIsIt": "Main Thread is a core Web Platform concept in Browser Architecture. It belongs to browser processes, threads, and navigation lifecycle. Understanding Main Thread helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide main thread details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Main Thread as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Main Thread in B3.1 — Browser Architecture: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Main Thread to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about main thread.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Main Thread from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Main Thread — minimal browser example\nconsole.log('[b3-main-thread]', typeof document);\n// Open DevTools → verify behavior for: Main Thread\n// Spec reference: developer.mozilla.org (search \"Main Thread\")",
  "exampleCaption": "Main Thread — observe in DevTools while this runs",
  "internals": [
    "Main Thread is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for main thread can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether main thread succeeds in production."
  ],
  "takeaways": [
    "Locate Main Thread in B3.1 — Browser Architecture: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Main Thread to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Main Thread from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Main Thread is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Main Thread: Treat Main Thread as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Main Thread in B3.1 — Browser Architecture: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Main Thread to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Main Thread from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Main Thread",
      "Main Thread is a core Web Platform concept in Browser Architecture."
    ],
    [
      "Mental model",
      "Treat Main Thread as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Main Thread from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Main Thread in B3.1 — Browser Architecture: map it to MDN reference docs ",
      "Connect Main Thread to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Main Thread in the browser and when do you use it?",
      "answerHint": "Main Thread is a core Web Platform concept in Browser Architecture. It belongs to browser processes, threads, and navigation lifecycle. Understanding Main Thread helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Main Thread with a DevTools observation and one pitfall.",
      "answerHint": "Locate Main Thread in B3.1 — Browser Architecture: map it to MDN reference docs and observe behavior in DevTools. Connect Main Thread to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about main thread. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Main Thread from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Main Thread in a senior frontend interview?",
      "answerHint": "Main Thread is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for main thread can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether main thread succeeds in production. // Main Thread — minimal browser example\nconsole.log('[b3-main-thread]', typeof document);\n// Open DevTools → verify beh"
    }
  ],
  "pitfalls": [
    "Interview trap: describing Main Thread from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Main Thread at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Main Thread is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Main Thread?",
      "When would Main Thread block rendering or fail cross-origin?",
      "What is the classic Main Thread interview trap?"
    ],
    "traps": [
      "Interview trap: describing Main Thread from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide main thread details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Main Thread."
    ]
  }
})
