import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "FileReader",
  "whatIsIt": "FileReader is a core Web Platform concept in Blob & File APIs. It belongs to Blob, File, and object URL APIs. Understanding FileReader helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide filereader details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat FileReader as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate FileReader in B3.26 — Blob & File APIs: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect FileReader to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about filereader.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing FileReader from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// FileReader — minimal browser example\nconsole.log('[b3-file-reader]', typeof document);\n// Open DevTools → verify behavior for: FileReader\n// Spec reference: developer.mozilla.org (search \"FileReader\")",
  "exampleCaption": "FileReader — observe in DevTools while this runs",
  "internals": [
    "FileReader is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for filereader can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether filereader succeeds in production."
  ],
  "takeaways": [
    "Locate FileReader in B3.26 — Blob & File APIs: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect FileReader to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing FileReader from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "FileReader is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "FileReader: Treat FileReader as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate FileReader in B3.26 — Blob & File APIs: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect FileReader to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing FileReader from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "FileReader",
      "FileReader is a core Web Platform concept in Blob & File APIs."
    ],
    [
      "Mental model",
      "Treat FileReader as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing FileReader from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate FileReader in B3.26 — Blob & File APIs: map it to MDN reference docs and ",
      "Connect FileReader to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is FileReader in the browser and when do you use it?",
      "answerHint": "FileReader is a core Web Platform concept in Blob & File APIs. It belongs to Blob, File, and object URL APIs. Understanding FileReader helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain FileReader with a DevTools observation and one pitfall.",
      "answerHint": "Locate FileReader in B3.26 — Blob & File APIs: map it to MDN reference docs and observe behavior in DevTools. Connect FileReader to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about filereader. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing FileReader from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain FileReader in a senior frontend interview?",
      "answerHint": "FileReader is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for filereader can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether filereader succeeds in production. // FileReader — minimal browser example\nconsole.log('[b3-file-reader]', typeof document);\n// Open DevTools → verify beha"
    }
  ],
  "pitfalls": [
    "Interview trap: describing FileReader from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain FileReader at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "FileReader is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is FileReader?",
      "When would FileReader block rendering or fail cross-origin?",
      "What is the classic FileReader interview trap?"
    ],
    "traps": [
      "Interview trap: describing FileReader from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide filereader details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around FileReader."
    ]
  }
})
