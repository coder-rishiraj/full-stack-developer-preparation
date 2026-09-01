import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Offline-First Patterns",
  "whatIsIt": "Offline-First Patterns is a core Web Platform concept in Service Workers. It belongs to Service Workers, caches, and offline behavior. Understanding Offline-First Patterns helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide offline-first patterns details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Offline-First Patterns as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Offline-First Patterns in B3.22 — Service Workers: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Offline-First Patterns to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about offline-first patterns.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Offline-First Patterns from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Offline-First Patterns — minimal browser example\nconsole.log('[b3-sw-offline]', typeof document);\n// Open DevTools → verify behavior for: Offline-First Patterns\n// Spec reference: developer.mozilla.org (search \"Offline-First Patterns\")",
  "exampleCaption": "Offline-First Patterns — observe in DevTools while this runs",
  "internals": [
    "Offline-First Patterns is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for offline-first patterns can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether offline-first patterns succeeds in production."
  ],
  "takeaways": [
    "Locate Offline-First Patterns in B3.22 — Service Workers: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Offline-First Patterns to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Offline-First Patterns from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Offline-First Patterns is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Offline-First Patterns: Treat Offline-First Patterns as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Offline-First Patterns in B3.22 — Service Workers: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Offline-First Patterns to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Offline-First Patterns from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Offline-First Patterns",
      "Offline-First Patterns is a core Web Platform concept in Service Workers."
    ],
    [
      "Mental model",
      "Treat Offline-First Patterns as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Offline-First Patterns from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Offline-First Patterns in B3.22 — Service Workers: map it to MDN referenc",
      "Connect Offline-First Patterns to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Offline-First Patterns in the browser and when do you use it?",
      "answerHint": "Offline-First Patterns is a core Web Platform concept in Service Workers. It belongs to Service Workers, caches, and offline behavior. Understanding Offline-First Patterns helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Offline-First Patterns with a DevTools observation and one pitfall.",
      "answerHint": "Locate Offline-First Patterns in B3.22 — Service Workers: map it to MDN reference docs and observe behavior in DevTools. Connect Offline-First Patterns to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about offline-first patterns. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Offline-First Patterns from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Offline-First Patterns in a senior frontend interview?",
      "answerHint": "Offline-First Patterns is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for offline-first patterns can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether offline-first patterns succeeds in production. // Offline-First Patterns — minimal browser example\nconsole.log('[b3-sw-offline]', typeof document);\n// Open DevTools → "
    }
  ],
  "pitfalls": [
    "Interview trap: describing Offline-First Patterns from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Offline-First Patterns at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Offline-First Patterns is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Offline-First Patterns?",
      "When would Offline-First Patterns block rendering or fail cross-origin?",
      "What is the classic Offline-First Patterns interview trap?"
    ],
    "traps": [
      "Interview trap: describing Offline-First Patterns from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide offline-first patterns details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Offline-First Patterns."
    ]
  }
})
