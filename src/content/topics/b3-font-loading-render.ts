import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Font Loading & FOIT/FOUT",
  "whatIsIt": "Font Loading & FOIT/FOUT is a core Web Platform concept in Critical Rendering Path. It belongs to the critical rendering path from HTML/CSS to pixels. Understanding Font Loading & FOIT/FOUT helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide font loading & foit/fout details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Font Loading & FOIT/FOUT as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Font Loading & FOIT/FOUT in B3.6 — Critical Rendering Path: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Font Loading & FOIT/FOUT to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about font loading & foit/fout.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Font Loading & FOIT/FOUT from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Font Loading & FOIT/FOUT — minimal browser example\nconsole.log('[b3-font-loading-render]', typeof document);\n// Open DevTools → verify behavior for: Font Loading & FOIT/FOUT\n// Spec reference: developer.mozilla.org (search \"Font Loading & FOIT/FOUT\")",
  "exampleCaption": "Font Loading & FOIT/FOUT — observe in DevTools while this runs",
  "internals": [
    "Font Loading & FOIT/FOUT is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for font loading & foit/fout can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether font loading & foit/fout succeeds in production."
  ],
  "takeaways": [
    "Locate Font Loading & FOIT/FOUT in B3.6 — Critical Rendering Path: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Font Loading & FOIT/FOUT to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Font Loading & FOIT/FOUT from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Font Loading & FOIT/FOUT is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Font Loading & FOIT/FOUT: Treat Font Loading & FOIT/FOUT as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Font Loading & FOIT/FOUT in B3.6 — Critical Rendering Path: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Font Loading & FOIT/FOUT to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Font Loading & FOIT/FOUT from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Font Loading & FOIT/FOUT",
      "Font Loading & FOIT/FOUT is a core Web Platform concept in Critical Rendering Path."
    ],
    [
      "Mental model",
      "Treat Font Loading & FOIT/FOUT as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Font Loading & FOIT/FOUT from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Font Loading & FOIT/FOUT in B3.6 — Critical Rendering Path: map it to MDN",
      "Connect Font Loading & FOIT/FOUT to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Font Loading & FOIT/FOUT in the browser and when do you use it?",
      "answerHint": "Font Loading & FOIT/FOUT is a core Web Platform concept in Critical Rendering Path. It belongs to the critical rendering path from HTML/CSS to pixels. Understanding Font Loading & FOIT/FOUT helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Font Loading & FOIT/FOUT with a DevTools observation and one pitfall.",
      "answerHint": "Locate Font Loading & FOIT/FOUT in B3.6 — Critical Rendering Path: map it to MDN reference docs and observe behavior in DevTools. Connect Font Loading & FOIT/FOUT to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about font loading & foit/fout. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Font Loading & FOIT/FOUT from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Font Loading & FOIT/FOUT in a senior frontend interview?",
      "answerHint": "Font Loading & FOIT/FOUT is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for font loading & foit/fout can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether font loading & foit/fout succeeds in production. // Font Loading & FOIT/FOUT — minimal browser example\nconsole.log('[b3-font-loading-render]', typeof document);\n// Open "
    }
  ],
  "pitfalls": [
    "Interview trap: describing Font Loading & FOIT/FOUT from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Font Loading & FOIT/FOUT at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Font Loading & FOIT/FOUT is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Font Loading & FOIT/FOUT?",
      "When would Font Loading & FOIT/FOUT block rendering or fail cross-origin?",
      "What is the classic Font Loading & FOIT/FOUT interview trap?"
    ],
    "traps": [
      "Interview trap: describing Font Loading & FOIT/FOUT from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide font loading & foit/fout details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Font Loading & FOIT/FOUT."
    ]
  }
})
