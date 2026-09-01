import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Browser Processes",
  "whatIsIt": "Browser Processes is a core Web Platform concept in Browser Architecture. It belongs to browser processes, threads, and navigation lifecycle. Understanding Browser Processes helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide browser processes details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Browser Processes as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Browser Processes in B3.1 — Browser Architecture: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Browser Processes to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about browser processes.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Browser Processes from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Browser Processes — minimal browser example\nconsole.log('[b3-browser-processes]', typeof document);\n// Open DevTools → verify behavior for: Browser Processes\n// Spec reference: developer.mozilla.org (search \"Browser Processes\")",
  "exampleCaption": "Browser Processes — observe in DevTools while this runs",
  "internals": [
    "Browser Processes is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for browser processes can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether browser processes succeeds in production."
  ],
  "takeaways": [
    "Locate Browser Processes in B3.1 — Browser Architecture: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Browser Processes to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Browser Processes from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Browser Processes is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Browser Processes: Treat Browser Processes as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Browser Processes in B3.1 — Browser Architecture: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Browser Processes to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Browser Processes from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Browser Processes",
      "Browser Processes is a core Web Platform concept in Browser Architecture."
    ],
    [
      "Mental model",
      "Treat Browser Processes as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Browser Processes from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Browser Processes in B3.1 — Browser Architecture: map it to MDN reference",
      "Connect Browser Processes to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Browser Processes in the browser and when do you use it?",
      "answerHint": "Browser Processes is a core Web Platform concept in Browser Architecture. It belongs to browser processes, threads, and navigation lifecycle. Understanding Browser Processes helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Browser Processes with a DevTools observation and one pitfall.",
      "answerHint": "Locate Browser Processes in B3.1 — Browser Architecture: map it to MDN reference docs and observe behavior in DevTools. Connect Browser Processes to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about browser processes. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Browser Processes from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Browser Processes in a senior frontend interview?",
      "answerHint": "Browser Processes is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for browser processes can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether browser processes succeeds in production. // Browser Processes — minimal browser example\nconsole.log('[b3-browser-processes]', typeof document);\n// Open DevTools "
    }
  ],
  "pitfalls": [
    "Interview trap: describing Browser Processes from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Browser Processes at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Browser Processes is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Browser Processes?",
      "When would Browser Processes block rendering or fail cross-origin?",
      "What is the classic Browser Processes interview trap?"
    ],
    "traps": [
      "Interview trap: describing Browser Processes from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide browser processes details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Browser Processes."
    ]
  }
})
