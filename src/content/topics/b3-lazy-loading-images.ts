import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "loading=\"lazy\" on Images",
  "whatIsIt": "loading=\"lazy\" on Images is a core Web Platform concept in Resource Loading & Performance. It belongs to browser performance metrics, Core Web Vitals, and profiling. Understanding loading=\"lazy\" on Images helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide loading=\"lazy\" on images details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat loading=\"lazy\" on Images as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate loading=\"lazy\" on Images in B3.28 — Resource Loading & Performance: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect loading=\"lazy\" on Images to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about loading=\"lazy\" on images.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing loading=\"lazy\" on Images from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// loading=\"lazy\" on Images — minimal browser example\nconsole.log('[b3-lazy-loading-images]', typeof document);\n// Open DevTools → verify behavior for: loading=\"lazy\" on Images\n// Spec reference: developer.mozilla.org (search \"loading=\"lazy\" on Images\")",
  "exampleCaption": "loading=\"lazy\" on Images — observe in DevTools while this runs",
  "internals": [
    "loading=\"lazy\" on Images is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for loading=\"lazy\" on images can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether loading=\"lazy\" on images succeeds in production."
  ],
  "takeaways": [
    "Locate loading=\"lazy\" on Images in B3.28 — Resource Loading & Performance: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect loading=\"lazy\" on Images to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing loading=\"lazy\" on Images from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "loading=\"lazy\" on Images is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "loading=\"lazy\" on Images: Treat loading=\"lazy\" on Images as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate loading=\"lazy\" on Images in B3.28 — Resource Loading & Performance: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect loading=\"lazy\" on Images to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing loading=\"lazy\" on Images from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "loading=\"lazy\" on Images",
      "loading=\"lazy\" on Images is a core Web Platform concept in Resource Loading & Performance."
    ],
    [
      "Mental model",
      "Treat loading=\"lazy\" on Images as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing loading=\"lazy\" on Images from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate loading=\"lazy\" on Images in B3.28 — Resource Loading & Performance: map i",
      "Connect loading=\"lazy\" on Images to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is loading=\"lazy\" on Images in the browser and when do you use it?",
      "answerHint": "loading=\"lazy\" on Images is a core Web Platform concept in Resource Loading & Performance. It belongs to browser performance metrics, Core Web Vitals, and profiling. Understanding loading=\"lazy\" on Images helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain loading=\"lazy\" on Images with a DevTools observation and one pitfall.",
      "answerHint": "Locate loading=\"lazy\" on Images in B3.28 — Resource Loading & Performance: map it to MDN reference docs and observe behavior in DevTools. Connect loading=\"lazy\" on Images to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about loading=\"lazy\" on images. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing loading=\"lazy\" on Images from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain loading=\"lazy\" on Images in a senior frontend interview?",
      "answerHint": "loading=\"lazy\" on Images is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for loading=\"lazy\" on images can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether loading=\"lazy\" on images succeeds in production. // loading=\"lazy\" on Images — minimal browser example\nconsole.log('[b3-lazy-loading-images]', typeof document);\n// Open "
    }
  ],
  "pitfalls": [
    "Interview trap: describing loading=\"lazy\" on Images from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain loading=\"lazy\" on Images at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "loading=\"lazy\" on Images is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is loading=\"lazy\" on Images?",
      "When would loading=\"lazy\" on Images block rendering or fail cross-origin?",
      "What is the classic loading=\"lazy\" on Images interview trap?"
    ],
    "traps": [
      "Interview trap: describing loading=\"lazy\" on Images from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide loading=\"lazy\" on images details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around loading=\"lazy\" on Images."
    ]
  }
})
