import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "type / eventPhase / bubbles / cancelable",
  "whatIsIt": "type / eventPhase / bubbles / cancelable is a core Web Platform concept in DOM Events. It belongs to DOM events, propagation, delegation, and listener options. Understanding type / eventPhase / bubbles / cancelable helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide type / eventphase / bubbles / cancelable details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat type / eventPhase / bubbles / cancelable as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate type / eventPhase / bubbles / cancelable in B3.4 — DOM Events: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect type / eventPhase / bubbles / cancelable to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about type / eventphase / bubbles / cancelable.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing type / eventPhase / bubbles / cancelable from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// type / eventPhase / bubbles / cancelable — minimal browser example\nconsole.log('[b3-event-type-phase]', typeof document);\n// Open DevTools → verify behavior for: type / eventPhase / bubbles / cancelable\n// Spec reference: developer.mozilla.org (search \"type / eventPhase / bubbles / cancelable\")",
  "exampleCaption": "type / eventPhase / bubbles / cancelable — observe in DevTools while this runs",
  "internals": [
    "type / eventPhase / bubbles / cancelable is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for type / eventphase / bubbles / cancelable can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether type / eventphase / bubbles / cancelable succeeds in production."
  ],
  "takeaways": [
    "Locate type / eventPhase / bubbles / cancelable in B3.4 — DOM Events: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect type / eventPhase / bubbles / cancelable to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing type / eventPhase / bubbles / cancelable from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "type / eventPhase / bubbles / cancelable is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "type / eventPhase / bubbles / cancelable: Treat type / eventPhase / bubbles / cancelable as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate type / eventPhase / bubbles / cancelable in B3.4 — DOM Events: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect type / eventPhase / bubbles / cancelable to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing type / eventPhase / bubbles / cancelable from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "type / eventPhase / bubbles / cancelable",
      "type / eventPhase / bubbles / cancelable is a core Web Platform concept in DOM Events."
    ],
    [
      "Mental model",
      "Treat type / eventPhase / bubbles / cancelable as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing type / eventPhase / bubbles / cancelable from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate type / eventPhase / bubbles / cancelable in B3.4 — DOM Events: map it to ",
      "Connect type / eventPhase / bubbles / cancelable to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is type / eventPhase / bubbles / cancelable in the browser and when do you use it?",
      "answerHint": "type / eventPhase / bubbles / cancelable is a core Web Platform concept in DOM Events. It belongs to DOM events, propagation, delegation, and listener options. Understanding type / eventPhase / bubbles / cancelable helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain type / eventPhase / bubbles / cancelable with a DevTools observation and one pitfall.",
      "answerHint": "Locate type / eventPhase / bubbles / cancelable in B3.4 — DOM Events: map it to MDN reference docs and observe behavior in DevTools. Connect type / eventPhase / bubbles / cancelable to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about type / eventphase / bubbles / cancelable. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing type / eventPhase / bubbles / cancelable from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain type / eventPhase / bubbles / cancelable in a senior frontend interview?",
      "answerHint": "type / eventPhase / bubbles / cancelable is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for type / eventphase / bubbles / cancelable can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether type / eventphase / bubbles / cancelable succeeds in production. // type / eventPhase / bubbles / cancelable — minimal browser example\nconsole.log('[b3-event-type-phase]', typeof docume"
    }
  ],
  "pitfalls": [
    "Interview trap: describing type / eventPhase / bubbles / cancelable from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain type / eventPhase / bubbles / cancelable at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "type / eventPhase / bubbles / cancelable is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is type / eventPhase / bubbles / cancelable?",
      "When would type / eventPhase / bubbles / cancelable block rendering or fail cross-origin?",
      "What is the classic type / eventPhase / bubbles / cancelable interview trap?"
    ],
    "traps": [
      "Interview trap: describing type / eventPhase / bubbles / cancelable from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide type / eventphase / bubbles / cancelable details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around type / eventPhase / bubbles / cancelable."
    ]
  }
})
