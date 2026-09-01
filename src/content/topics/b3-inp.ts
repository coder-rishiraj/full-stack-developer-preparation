import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Interaction to Next Paint (INP)",
  "whatIsIt": "Interaction to Next Paint (INP) is a core Web Platform concept in Browser Performance. It belongs to browser performance metrics, Core Web Vitals, and profiling. Understanding Interaction to Next Paint (INP) helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide interaction to next paint (inp) details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Interaction to Next Paint (INP) as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Interaction to Next Paint (INP) in B3.27 — Browser Performance: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Interaction to Next Paint (INP) to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about interaction to next paint (inp).",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Interaction to Next Paint (INP) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Interaction to Next Paint (INP) — minimal browser example\nconsole.log('[b3-inp]', typeof document);\n// Open DevTools → verify behavior for: Interaction to Next Paint (INP)\n// Spec reference: developer.mozilla.org (search \"Interaction to Next Paint (INP)\")",
  "exampleCaption": "Interaction to Next Paint (INP) — observe in DevTools while this runs",
  "internals": [
    "Interaction to Next Paint (INP) is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for interaction to next paint (inp) can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether interaction to next paint (inp) succeeds in production."
  ],
  "takeaways": [
    "Locate Interaction to Next Paint (INP) in B3.27 — Browser Performance: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Interaction to Next Paint (INP) to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Interaction to Next Paint (INP) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Interaction to Next Paint (INP) is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Interaction to Next Paint (INP): Treat Interaction to Next Paint (INP) as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Interaction to Next Paint (INP) in B3.27 — Browser Performance: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Interaction to Next Paint (INP) to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Interaction to Next Paint (INP) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Interaction to Next Paint (INP)",
      "Interaction to Next Paint (INP) is a core Web Platform concept in Browser Performance."
    ],
    [
      "Mental model",
      "Treat Interaction to Next Paint (INP) as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Interaction to Next Paint (INP) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Interaction to Next Paint (INP) in B3.27 — Browser Performance: map it to",
      "Connect Interaction to Next Paint (INP) to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Interaction to Next Paint (INP) in the browser and when do you use it?",
      "answerHint": "Interaction to Next Paint (INP) is a core Web Platform concept in Browser Performance. It belongs to browser performance metrics, Core Web Vitals, and profiling. Understanding Interaction to Next Paint (INP) helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Interaction to Next Paint (INP) with a DevTools observation and one pitfall.",
      "answerHint": "Locate Interaction to Next Paint (INP) in B3.27 — Browser Performance: map it to MDN reference docs and observe behavior in DevTools. Connect Interaction to Next Paint (INP) to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about interaction to next paint (inp). Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Interaction to Next Paint (INP) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Interaction to Next Paint (INP) in a senior frontend interview?",
      "answerHint": "Interaction to Next Paint (INP) is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for interaction to next paint (inp) can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether interaction to next paint (inp) succeeds in production. // Interaction to Next Paint (INP) — minimal browser example\nconsole.log('[b3-inp]', typeof document);\n// Open DevTools "
    }
  ],
  "pitfalls": [
    "Interview trap: describing Interaction to Next Paint (INP) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Interaction to Next Paint (INP) at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Interaction to Next Paint (INP) is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Interaction to Next Paint (INP)?",
      "When would Interaction to Next Paint (INP) block rendering or fail cross-origin?",
      "What is the classic Interaction to Next Paint (INP) interview trap?"
    ],
    "traps": [
      "Interview trap: describing Interaction to Next Paint (INP) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide interaction to next paint (inp) details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Interaction to Next Paint (INP)."
    ]
  }
})
