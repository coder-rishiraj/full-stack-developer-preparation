import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "DOM Manipulation",
  "whatIsIt": "DOM Manipulation is a core Web Platform concept in DOM Fundamentals. It belongs to the DOM tree, selection, manipulation, and traversal. Understanding DOM Manipulation helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide dom manipulation details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat DOM Manipulation as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate DOM Manipulation in B3.3 — DOM Fundamentals: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect DOM Manipulation to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about dom manipulation.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing DOM Manipulation from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// DOM Manipulation — minimal browser example\nconsole.log('[b3-dom-manipulation]', typeof document);\n// Open DevTools → verify behavior for: DOM Manipulation\n// Spec reference: developer.mozilla.org (search \"DOM Manipulation\")",
  "exampleCaption": "DOM Manipulation — observe in DevTools while this runs",
  "internals": [
    "DOM Manipulation is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for dom manipulation can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether dom manipulation succeeds in production."
  ],
  "takeaways": [
    "Locate DOM Manipulation in B3.3 — DOM Fundamentals: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect DOM Manipulation to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing DOM Manipulation from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "DOM Manipulation is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "DOM Manipulation: Treat DOM Manipulation as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate DOM Manipulation in B3.3 — DOM Fundamentals: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect DOM Manipulation to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing DOM Manipulation from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "DOM Manipulation",
      "DOM Manipulation is a core Web Platform concept in DOM Fundamentals."
    ],
    [
      "Mental model",
      "Treat DOM Manipulation as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing DOM Manipulation from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate DOM Manipulation in B3.3 — DOM Fundamentals: map it to MDN reference docs",
      "Connect DOM Manipulation to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is DOM Manipulation in the browser and when do you use it?",
      "answerHint": "DOM Manipulation is a core Web Platform concept in DOM Fundamentals. It belongs to the DOM tree, selection, manipulation, and traversal. Understanding DOM Manipulation helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain DOM Manipulation with a DevTools observation and one pitfall.",
      "answerHint": "Locate DOM Manipulation in B3.3 — DOM Fundamentals: map it to MDN reference docs and observe behavior in DevTools. Connect DOM Manipulation to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about dom manipulation. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing DOM Manipulation from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain DOM Manipulation in a senior frontend interview?",
      "answerHint": "DOM Manipulation is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for dom manipulation can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether dom manipulation succeeds in production. // DOM Manipulation — minimal browser example\nconsole.log('[b3-dom-manipulation]', typeof document);\n// Open DevTools → "
    }
  ],
  "pitfalls": [
    "Interview trap: describing DOM Manipulation from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain DOM Manipulation at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "DOM Manipulation is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is DOM Manipulation?",
      "When would DOM Manipulation block rendering or fail cross-origin?",
      "What is the classic DOM Manipulation interview trap?"
    ],
    "traps": [
      "Interview trap: describing DOM Manipulation from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide dom manipulation details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around DOM Manipulation."
    ]
  }
})
