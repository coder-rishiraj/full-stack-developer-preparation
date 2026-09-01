import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "frame-ancestors",
  "whatIsIt": "frame-ancestors is a core Web Platform concept in Content Security Policy. It belongs to Content Security Policy (CSP) directives and XSS mitigation. Understanding frame-ancestors helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide frame-ancestors details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat frame-ancestors as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate frame-ancestors in B3.19 — Content Security Policy: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect frame-ancestors to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about frame-ancestors.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing frame-ancestors from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// frame-ancestors — minimal browser example\nconsole.log('[b3-csp-frame-ancestors]', typeof document);\n// Open DevTools → verify behavior for: frame-ancestors\n// Spec reference: developer.mozilla.org (search \"frame-ancestors\")",
  "exampleCaption": "frame-ancestors — observe in DevTools while this runs",
  "internals": [
    "frame-ancestors is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for frame-ancestors can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether frame-ancestors succeeds in production."
  ],
  "takeaways": [
    "Locate frame-ancestors in B3.19 — Content Security Policy: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect frame-ancestors to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing frame-ancestors from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "frame-ancestors is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "frame-ancestors: Treat frame-ancestors as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate frame-ancestors in B3.19 — Content Security Policy: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect frame-ancestors to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing frame-ancestors from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "frame-ancestors",
      "frame-ancestors is a core Web Platform concept in Content Security Policy."
    ],
    [
      "Mental model",
      "Treat frame-ancestors as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing frame-ancestors from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate frame-ancestors in B3.19 — Content Security Policy: map it to MDN referen",
      "Connect frame-ancestors to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is frame-ancestors in the browser and when do you use it?",
      "answerHint": "frame-ancestors is a core Web Platform concept in Content Security Policy. It belongs to Content Security Policy (CSP) directives and XSS mitigation. Understanding frame-ancestors helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain frame-ancestors with a DevTools observation and one pitfall.",
      "answerHint": "Locate frame-ancestors in B3.19 — Content Security Policy: map it to MDN reference docs and observe behavior in DevTools. Connect frame-ancestors to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about frame-ancestors. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing frame-ancestors from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain frame-ancestors in a senior frontend interview?",
      "answerHint": "frame-ancestors is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for frame-ancestors can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether frame-ancestors succeeds in production. // frame-ancestors — minimal browser example\nconsole.log('[b3-csp-frame-ancestors]', typeof document);\n// Open DevTools "
    }
  ],
  "pitfalls": [
    "Interview trap: describing frame-ancestors from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain frame-ancestors at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "frame-ancestors is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is frame-ancestors?",
      "When would frame-ancestors block rendering or fail cross-origin?",
      "What is the classic frame-ancestors interview trap?"
    ],
    "traps": [
      "Interview trap: describing frame-ancestors from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide frame-ancestors details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around frame-ancestors."
    ]
  }
})
