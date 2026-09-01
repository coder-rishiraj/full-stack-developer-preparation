import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "async Scripts",
  "whatIsIt": "async Scripts is a core Web Platform concept in HTML Parsing & Page Loading. It belongs to HTML parsing, script loading, and page lifecycle events. Understanding async Scripts helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide async scripts details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat async Scripts as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate async Scripts in B3.5 — HTML Parsing & Page Loading: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect async Scripts to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about async scripts.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing async Scripts from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// async Scripts — minimal browser example\nconsole.log('[b3-script-async]', typeof document);\n// Open DevTools → verify behavior for: async Scripts\n// Spec reference: developer.mozilla.org (search \"async Scripts\")",
  "exampleCaption": "async Scripts — observe in DevTools while this runs",
  "internals": [
    "async Scripts is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for async scripts can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether async scripts succeeds in production."
  ],
  "takeaways": [
    "Locate async Scripts in B3.5 — HTML Parsing & Page Loading: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect async Scripts to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing async Scripts from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "async Scripts is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "async Scripts: Treat async Scripts as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate async Scripts in B3.5 — HTML Parsing & Page Loading: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect async Scripts to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing async Scripts from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "async Scripts",
      "async Scripts is a core Web Platform concept in HTML Parsing & Page Loading."
    ],
    [
      "Mental model",
      "Treat async Scripts as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing async Scripts from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate async Scripts in B3.5 — HTML Parsing & Page Loading: map it to MDN refere",
      "Connect async Scripts to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is async Scripts in the browser and when do you use it?",
      "answerHint": "async Scripts is a core Web Platform concept in HTML Parsing & Page Loading. It belongs to HTML parsing, script loading, and page lifecycle events. Understanding async Scripts helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain async Scripts with a DevTools observation and one pitfall.",
      "answerHint": "Locate async Scripts in B3.5 — HTML Parsing & Page Loading: map it to MDN reference docs and observe behavior in DevTools. Connect async Scripts to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about async scripts. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing async Scripts from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain async Scripts in a senior frontend interview?",
      "answerHint": "async Scripts is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for async scripts can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether async scripts succeeds in production. // async Scripts — minimal browser example\nconsole.log('[b3-script-async]', typeof document);\n// Open DevTools → verify "
    }
  ],
  "pitfalls": [
    "Interview trap: describing async Scripts from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain async Scripts at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "async Scripts is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is async Scripts?",
      "When would async Scripts block rendering or fail cross-origin?",
      "What is the classic async Scripts interview trap?"
    ],
    "traps": [
      "Interview trap: describing async Scripts from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide async scripts details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around async Scripts."
    ]
  }
})
