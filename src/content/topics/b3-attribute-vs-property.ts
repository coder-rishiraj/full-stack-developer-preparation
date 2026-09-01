import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Attributes vs Properties",
  "whatIsIt": "Attributes vs Properties is a core Web Platform concept in DOM Fundamentals. It belongs to the DOM tree, selection, manipulation, and traversal. Understanding Attributes vs Properties helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide attributes vs properties details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Attributes vs Properties as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Attributes vs Properties in B3.3 — DOM Fundamentals: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Attributes vs Properties to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about attributes vs properties.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Attributes vs Properties from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Attributes vs Properties — minimal browser example\nconsole.log('[b3-attribute-vs-property]', typeof document);\n// Open DevTools → verify behavior for: Attributes vs Properties\n// Spec reference: developer.mozilla.org (search \"Attributes vs Properties\")",
  "exampleCaption": "Attributes vs Properties — observe in DevTools while this runs",
  "internals": [
    "Attributes vs Properties is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for attributes vs properties can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether attributes vs properties succeeds in production."
  ],
  "takeaways": [
    "Locate Attributes vs Properties in B3.3 — DOM Fundamentals: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Attributes vs Properties to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Attributes vs Properties from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Attributes vs Properties is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Attributes vs Properties: Treat Attributes vs Properties as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Attributes vs Properties in B3.3 — DOM Fundamentals: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Attributes vs Properties to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Attributes vs Properties from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Attributes vs Properties",
      "Attributes vs Properties is a core Web Platform concept in DOM Fundamentals."
    ],
    [
      "Mental model",
      "Treat Attributes vs Properties as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Attributes vs Properties from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Attributes vs Properties in B3.3 — DOM Fundamentals: map it to MDN refere",
      "Connect Attributes vs Properties to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Attributes vs Properties in the browser and when do you use it?",
      "answerHint": "Attributes vs Properties is a core Web Platform concept in DOM Fundamentals. It belongs to the DOM tree, selection, manipulation, and traversal. Understanding Attributes vs Properties helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Attributes vs Properties with a DevTools observation and one pitfall.",
      "answerHint": "Locate Attributes vs Properties in B3.3 — DOM Fundamentals: map it to MDN reference docs and observe behavior in DevTools. Connect Attributes vs Properties to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about attributes vs properties. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Attributes vs Properties from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Attributes vs Properties in a senior frontend interview?",
      "answerHint": "Attributes vs Properties is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for attributes vs properties can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether attributes vs properties succeeds in production. // Attributes vs Properties — minimal browser example\nconsole.log('[b3-attribute-vs-property]', typeof document);\n// Ope"
    }
  ],
  "pitfalls": [
    "Interview trap: describing Attributes vs Properties from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Attributes vs Properties at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Attributes vs Properties is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Attributes vs Properties?",
      "When would Attributes vs Properties block rendering or fail cross-origin?",
      "What is the classic Attributes vs Properties interview trap?"
    ],
    "traps": [
      "Interview trap: describing Attributes vs Properties from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide attributes vs properties details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Attributes vs Properties."
    ]
  }
})
