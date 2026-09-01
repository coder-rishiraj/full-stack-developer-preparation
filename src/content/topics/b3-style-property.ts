import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "element.style",
  "whatIsIt": "element.style is a core Web Platform concept in DOM Fundamentals. It belongs to the DOM tree, selection, manipulation, and traversal. Understanding element.style helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide element.style details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat element.style as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate element.style in B3.3 — DOM Fundamentals: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect element.style to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about element.style.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing element.style from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// element.style — minimal browser example\nconsole.log('[b3-style-property]', typeof document);\n// Open DevTools → verify behavior for: element.style\n// Spec reference: developer.mozilla.org (search \"element.style\")",
  "exampleCaption": "element.style — observe in DevTools while this runs",
  "internals": [
    "element.style is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for element.style can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether element.style succeeds in production."
  ],
  "takeaways": [
    "Locate element.style in B3.3 — DOM Fundamentals: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect element.style to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing element.style from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "element.style is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "element.style: Treat element.style as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate element.style in B3.3 — DOM Fundamentals: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect element.style to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing element.style from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "element.style",
      "element.style is a core Web Platform concept in DOM Fundamentals."
    ],
    [
      "Mental model",
      "Treat element.style as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing element.style from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate element.style in B3.3 — DOM Fundamentals: map it to MDN reference docs an",
      "Connect element.style to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is element.style in the browser and when do you use it?",
      "answerHint": "element.style is a core Web Platform concept in DOM Fundamentals. It belongs to the DOM tree, selection, manipulation, and traversal. Understanding element.style helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain element.style with a DevTools observation and one pitfall.",
      "answerHint": "Locate element.style in B3.3 — DOM Fundamentals: map it to MDN reference docs and observe behavior in DevTools. Connect element.style to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about element.style. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing element.style from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain element.style in a senior frontend interview?",
      "answerHint": "element.style is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for element.style can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether element.style succeeds in production. // element.style — minimal browser example\nconsole.log('[b3-style-property]', typeof document);\n// Open DevTools → verif"
    }
  ],
  "pitfalls": [
    "Interview trap: describing element.style from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain element.style at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "element.style is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is element.style?",
      "When would element.style block rendering or fail cross-origin?",
      "What is the classic element.style interview trap?"
    ],
    "traps": [
      "Interview trap: describing element.style from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide element.style details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around element.style."
    ]
  }
})
