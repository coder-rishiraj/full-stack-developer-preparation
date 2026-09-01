import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Attributes & Properties",
  "whatIsIt": "Attributes & Properties is a core Web Platform concept in DOM Fundamentals. It belongs to the DOM tree, selection, manipulation, and traversal. Understanding Attributes & Properties helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide attributes & properties details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Attributes & Properties as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Attributes & Properties in B3.3 — DOM Fundamentals: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Attributes & Properties to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about attributes & properties.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Attributes & Properties from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Attributes & Properties — minimal browser example\nconsole.log('[b3-dom-attributes]', typeof document);\n// Open DevTools → verify behavior for: Attributes & Properties\n// Spec reference: developer.mozilla.org (search \"Attributes & Properties\")",
  "exampleCaption": "Attributes & Properties — observe in DevTools while this runs",
  "internals": [
    "Attributes & Properties is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for attributes & properties can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether attributes & properties succeeds in production."
  ],
  "takeaways": [
    "Locate Attributes & Properties in B3.3 — DOM Fundamentals: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Attributes & Properties to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Attributes & Properties from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Attributes & Properties is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Attributes & Properties: Treat Attributes & Properties as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Attributes & Properties in B3.3 — DOM Fundamentals: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Attributes & Properties to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Attributes & Properties from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Attributes & Properties",
      "Attributes & Properties is a core Web Platform concept in DOM Fundamentals."
    ],
    [
      "Mental model",
      "Treat Attributes & Properties as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Attributes & Properties from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Attributes & Properties in B3.3 — DOM Fundamentals: map it to MDN referen",
      "Connect Attributes & Properties to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Attributes & Properties in the browser and when do you use it?",
      "answerHint": "Attributes & Properties is a core Web Platform concept in DOM Fundamentals. It belongs to the DOM tree, selection, manipulation, and traversal. Understanding Attributes & Properties helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Attributes & Properties with a DevTools observation and one pitfall.",
      "answerHint": "Locate Attributes & Properties in B3.3 — DOM Fundamentals: map it to MDN reference docs and observe behavior in DevTools. Connect Attributes & Properties to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about attributes & properties. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Attributes & Properties from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Attributes & Properties in a senior frontend interview?",
      "answerHint": "Attributes & Properties is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for attributes & properties can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether attributes & properties succeeds in production. // Attributes & Properties — minimal browser example\nconsole.log('[b3-dom-attributes]', typeof document);\n// Open DevToo"
    }
  ],
  "pitfalls": [
    "Interview trap: describing Attributes & Properties from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Attributes & Properties at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Attributes & Properties is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Attributes & Properties?",
      "When would Attributes & Properties block rendering or fail cross-origin?",
      "What is the classic Attributes & Properties interview trap?"
    ],
    "traps": [
      "Interview trap: describing Attributes & Properties from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide attributes & properties details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Attributes & Properties."
    ]
  }
})
