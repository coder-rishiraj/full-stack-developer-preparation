import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "type=\"module\" Scripts",
  "whatIsIt": "type=\"module\" Scripts is a core Web Platform concept in HTML Parsing & Page Loading. It belongs to HTML parsing, script loading, and page lifecycle events. Understanding type=\"module\" Scripts helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide type=\"module\" scripts details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat type=\"module\" Scripts as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate type=\"module\" Scripts in B3.5 — HTML Parsing & Page Loading: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect type=\"module\" Scripts to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about type=\"module\" scripts.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing type=\"module\" Scripts from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// type=\"module\" Scripts — minimal browser example\nconsole.log('[b3-script-module]', typeof document);\n// Open DevTools → verify behavior for: type=\"module\" Scripts\n// Spec reference: developer.mozilla.org (search \"type=\"module\" Scripts\")",
  "exampleCaption": "type=\"module\" Scripts — observe in DevTools while this runs",
  "internals": [
    "type=\"module\" Scripts is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for type=\"module\" scripts can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether type=\"module\" scripts succeeds in production."
  ],
  "takeaways": [
    "Locate type=\"module\" Scripts in B3.5 — HTML Parsing & Page Loading: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect type=\"module\" Scripts to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing type=\"module\" Scripts from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "type=\"module\" Scripts is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "type=\"module\" Scripts: Treat type=\"module\" Scripts as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate type=\"module\" Scripts in B3.5 — HTML Parsing & Page Loading: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect type=\"module\" Scripts to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing type=\"module\" Scripts from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "type=\"module\" Scripts",
      "type=\"module\" Scripts is a core Web Platform concept in HTML Parsing & Page Loading."
    ],
    [
      "Mental model",
      "Treat type=\"module\" Scripts as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing type=\"module\" Scripts from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate type=\"module\" Scripts in B3.5 — HTML Parsing & Page Loading: map it to MD",
      "Connect type=\"module\" Scripts to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is type=\"module\" Scripts in the browser and when do you use it?",
      "answerHint": "type=\"module\" Scripts is a core Web Platform concept in HTML Parsing & Page Loading. It belongs to HTML parsing, script loading, and page lifecycle events. Understanding type=\"module\" Scripts helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain type=\"module\" Scripts with a DevTools observation and one pitfall.",
      "answerHint": "Locate type=\"module\" Scripts in B3.5 — HTML Parsing & Page Loading: map it to MDN reference docs and observe behavior in DevTools. Connect type=\"module\" Scripts to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about type=\"module\" scripts. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing type=\"module\" Scripts from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain type=\"module\" Scripts in a senior frontend interview?",
      "answerHint": "type=\"module\" Scripts is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for type=\"module\" scripts can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether type=\"module\" scripts succeeds in production. // type=\"module\" Scripts — minimal browser example\nconsole.log('[b3-script-module]', typeof document);\n// Open DevTools "
    }
  ],
  "pitfalls": [
    "Interview trap: describing type=\"module\" Scripts from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain type=\"module\" Scripts at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "type=\"module\" Scripts is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is type=\"module\" Scripts?",
      "When would type=\"module\" Scripts block rendering or fail cross-origin?",
      "What is the classic type=\"module\" Scripts interview trap?"
    ],
    "traps": [
      "Interview trap: describing type=\"module\" Scripts from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide type=\"module\" scripts details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around type=\"module\" Scripts."
    ]
  }
})
