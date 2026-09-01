import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "FormData API",
  "whatIsIt": "FormData API is a core Web Platform concept in Forms & Browser Input. It belongs to HTML forms, FormData, and constraint validation. Understanding FormData API helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide formdata api details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat FormData API as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate FormData API in B3.32 — Forms & Browser Input: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect FormData API to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about formdata api.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing FormData API from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// FormData API — minimal browser example\nconsole.log('[b3-formdata-api]', typeof window);\n// Open DevTools → verify behavior for: FormData API\n// Spec reference: developer.mozilla.org (search \"FormData API\")",
  "exampleCaption": "FormData API — observe in DevTools while this runs",
  "internals": [
    "FormData API is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for formdata api can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether formdata api succeeds in production."
  ],
  "takeaways": [
    "Locate FormData API in B3.32 — Forms & Browser Input: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect FormData API to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing FormData API from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "FormData API is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "FormData API: Treat FormData API as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate FormData API in B3.32 — Forms & Browser Input: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect FormData API to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing FormData API from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "FormData API",
      "FormData API is a core Web Platform concept in Forms & Browser Input."
    ],
    [
      "Mental model",
      "Treat FormData API as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing FormData API from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate FormData API in B3.32 — Forms & Browser Input: map it to MDN reference do",
      "Connect FormData API to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is FormData API in the browser and when do you use it?",
      "answerHint": "FormData API is a core Web Platform concept in Forms & Browser Input. It belongs to HTML forms, FormData, and constraint validation. Understanding FormData API helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain FormData API with a DevTools observation and one pitfall.",
      "answerHint": "Locate FormData API in B3.32 — Forms & Browser Input: map it to MDN reference docs and observe behavior in DevTools. Connect FormData API to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about formdata api. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing FormData API from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain FormData API in a senior frontend interview?",
      "answerHint": "FormData API is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for formdata api can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether formdata api succeeds in production. // FormData API — minimal browser example\nconsole.log('[b3-formdata-api]', typeof window);\n// Open DevTools → verify beh"
    }
  ],
  "pitfalls": [
    "Interview trap: describing FormData API from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain FormData API at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "FormData API is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is FormData API?",
      "When would FormData API block rendering or fail cross-origin?",
      "What is the classic FormData API interview trap?"
    ],
    "traps": [
      "Interview trap: describing FormData API from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide formdata api details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around FormData API."
    ]
  }
})
