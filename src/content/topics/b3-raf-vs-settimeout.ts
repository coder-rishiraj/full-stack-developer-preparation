import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "rAF vs setTimeout for Animation",
  "whatIsIt": "rAF vs setTimeout for Animation is a core Web Platform concept in requestAnimationFrame. It belongs to requestAnimationFrame and frame-aligned updates. Understanding rAF vs setTimeout for Animation helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide raf vs settimeout for animation details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat rAF vs setTimeout for Animation as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate rAF vs setTimeout for Animation in B3.9 — requestAnimationFrame: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect rAF vs setTimeout for Animation to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about raf vs settimeout for animation.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing rAF vs setTimeout for Animation from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// rAF vs setTimeout for Animation — minimal browser example\nconsole.log('[b3-raf-vs-settimeout]', typeof document);\n// Open DevTools → verify behavior for: rAF vs setTimeout for Animation\n// Spec reference: developer.mozilla.org (search \"rAF vs setTimeout for Animation\")",
  "exampleCaption": "rAF vs setTimeout for Animation — observe in DevTools while this runs",
  "internals": [
    "rAF vs setTimeout for Animation is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for raf vs settimeout for animation can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether raf vs settimeout for animation succeeds in production."
  ],
  "takeaways": [
    "Locate rAF vs setTimeout for Animation in B3.9 — requestAnimationFrame: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect rAF vs setTimeout for Animation to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing rAF vs setTimeout for Animation from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "rAF vs setTimeout for Animation is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "rAF vs setTimeout for Animation: Treat rAF vs setTimeout for Animation as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate rAF vs setTimeout for Animation in B3.9 — requestAnimationFrame: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect rAF vs setTimeout for Animation to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing rAF vs setTimeout for Animation from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "rAF vs setTimeout for Animation",
      "rAF vs setTimeout for Animation is a core Web Platform concept in requestAnimationFrame."
    ],
    [
      "Mental model",
      "Treat rAF vs setTimeout for Animation as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing rAF vs setTimeout for Animation from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate rAF vs setTimeout for Animation in B3.9 — requestAnimationFrame: map it t",
      "Connect rAF vs setTimeout for Animation to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is rAF vs setTimeout for Animation in the browser and when do you use it?",
      "answerHint": "rAF vs setTimeout for Animation is a core Web Platform concept in requestAnimationFrame. It belongs to requestAnimationFrame and frame-aligned updates. Understanding rAF vs setTimeout for Animation helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain rAF vs setTimeout for Animation with a DevTools observation and one pitfall.",
      "answerHint": "Locate rAF vs setTimeout for Animation in B3.9 — requestAnimationFrame: map it to MDN reference docs and observe behavior in DevTools. Connect rAF vs setTimeout for Animation to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about raf vs settimeout for animation. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing rAF vs setTimeout for Animation from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain rAF vs setTimeout for Animation in a senior frontend interview?",
      "answerHint": "rAF vs setTimeout for Animation is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for raf vs settimeout for animation can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether raf vs settimeout for animation succeeds in production. // rAF vs setTimeout for Animation — minimal browser example\nconsole.log('[b3-raf-vs-settimeout]', typeof document);\n// "
    }
  ],
  "pitfalls": [
    "Interview trap: describing rAF vs setTimeout for Animation from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain rAF vs setTimeout for Animation at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "rAF vs setTimeout for Animation is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is rAF vs setTimeout for Animation?",
      "When would rAF vs setTimeout for Animation block rendering or fail cross-origin?",
      "What is the classic rAF vs setTimeout for Animation interview trap?"
    ],
    "traps": [
      "Interview trap: describing rAF vs setTimeout for Animation from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide raf vs settimeout for animation details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around rAF vs setTimeout for Animation."
    ]
  }
})
