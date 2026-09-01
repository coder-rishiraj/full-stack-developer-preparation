import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "AbortSignal",
  "whatIsIt": "AbortSignal is a core Web Platform concept in AbortController & Cancellation. It belongs to AbortController, cancellation, and stale-request races. Understanding AbortSignal helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide abortsignal details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat AbortSignal as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate AbortSignal in B3.12 — AbortController & Cancellation: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect AbortSignal to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about abortsignal.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing AbortSignal from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// AbortSignal — minimal browser example\nconsole.log('[b3-abort-signal]', typeof document);\n// Open DevTools → verify behavior for: AbortSignal\n// Spec reference: developer.mozilla.org (search \"AbortSignal\")",
  "exampleCaption": "AbortSignal — observe in DevTools while this runs",
  "internals": [
    "AbortSignal is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for abortsignal can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether abortsignal succeeds in production."
  ],
  "takeaways": [
    "Locate AbortSignal in B3.12 — AbortController & Cancellation: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect AbortSignal to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing AbortSignal from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "AbortSignal is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "AbortSignal: Treat AbortSignal as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate AbortSignal in B3.12 — AbortController & Cancellation: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect AbortSignal to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing AbortSignal from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "AbortSignal",
      "AbortSignal is a core Web Platform concept in AbortController & Cancellation."
    ],
    [
      "Mental model",
      "Treat AbortSignal as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing AbortSignal from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate AbortSignal in B3.12 — AbortController & Cancellation: map it to MDN refe",
      "Connect AbortSignal to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is AbortSignal in the browser and when do you use it?",
      "answerHint": "AbortSignal is a core Web Platform concept in AbortController & Cancellation. It belongs to AbortController, cancellation, and stale-request races. Understanding AbortSignal helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain AbortSignal with a DevTools observation and one pitfall.",
      "answerHint": "Locate AbortSignal in B3.12 — AbortController & Cancellation: map it to MDN reference docs and observe behavior in DevTools. Connect AbortSignal to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about abortsignal. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing AbortSignal from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain AbortSignal in a senior frontend interview?",
      "answerHint": "AbortSignal is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for abortsignal can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether abortsignal succeeds in production. // AbortSignal — minimal browser example\nconsole.log('[b3-abort-signal]', typeof document);\n// Open DevTools → verify be"
    }
  ],
  "pitfalls": [
    "Interview trap: describing AbortSignal from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain AbortSignal at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "AbortSignal is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is AbortSignal?",
      "When would AbortSignal block rendering or fail cross-origin?",
      "What is the classic AbortSignal interview trap?"
    ],
    "traps": [
      "Interview trap: describing AbortSignal from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide abortsignal details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around AbortSignal."
    ]
  }
})
