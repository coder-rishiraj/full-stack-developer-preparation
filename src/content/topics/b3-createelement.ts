import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "createElement / createTextNode",
  "whatIsIt": "createElement / createTextNode is a core Web Platform concept in DOM Fundamentals. It belongs to the DOM tree, selection, manipulation, and traversal. Understanding createElement / createTextNode helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide createelement / createtextnode details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat createElement / createTextNode as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate createElement / createTextNode in B3.3 — DOM Fundamentals: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect createElement / createTextNode to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about createelement / createtextnode.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing createElement / createTextNode from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// createElement / createTextNode — minimal browser example\nconsole.log('[b3-createelement]', typeof document);\n// Open DevTools → verify behavior for: createElement / createTextNode\n// Spec reference: developer.mozilla.org (search \"createElement / createTextNode\")",
  "exampleCaption": "createElement / createTextNode — observe in DevTools while this runs",
  "internals": [
    "createElement / createTextNode is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for createelement / createtextnode can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether createelement / createtextnode succeeds in production."
  ],
  "takeaways": [
    "Locate createElement / createTextNode in B3.3 — DOM Fundamentals: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect createElement / createTextNode to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing createElement / createTextNode from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "createElement / createTextNode is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "createElement / createTextNode: Treat createElement / createTextNode as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate createElement / createTextNode in B3.3 — DOM Fundamentals: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect createElement / createTextNode to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing createElement / createTextNode from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "createElement / createTextNode",
      "createElement / createTextNode is a core Web Platform concept in DOM Fundamentals."
    ],
    [
      "Mental model",
      "Treat createElement / createTextNode as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing createElement / createTextNode from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate createElement / createTextNode in B3.3 — DOM Fundamentals: map it to MDN ",
      "Connect createElement / createTextNode to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is createElement / createTextNode in the browser and when do you use it?",
      "answerHint": "createElement / createTextNode is a core Web Platform concept in DOM Fundamentals. It belongs to the DOM tree, selection, manipulation, and traversal. Understanding createElement / createTextNode helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain createElement / createTextNode with a DevTools observation and one pitfall.",
      "answerHint": "Locate createElement / createTextNode in B3.3 — DOM Fundamentals: map it to MDN reference docs and observe behavior in DevTools. Connect createElement / createTextNode to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about createelement / createtextnode. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing createElement / createTextNode from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain createElement / createTextNode in a senior frontend interview?",
      "answerHint": "createElement / createTextNode is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for createelement / createtextnode can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether createelement / createtextnode succeeds in production. // createElement / createTextNode — minimal browser example\nconsole.log('[b3-createelement]', typeof document);\n// Open "
    }
  ],
  "pitfalls": [
    "Interview trap: describing createElement / createTextNode from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain createElement / createTextNode at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "createElement / createTextNode is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is createElement / createTextNode?",
      "When would createElement / createTextNode block rendering or fail cross-origin?",
      "What is the classic createElement / createTextNode interview trap?"
    ],
    "traps": [
      "Interview trap: describing createElement / createTextNode from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide createelement / createtextnode details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around createElement / createTextNode."
    ]
  }
})
