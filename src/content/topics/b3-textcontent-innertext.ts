import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "textContent vs innerText",
  "whatIsIt": "textContent vs innerText is a core Web Platform concept in DOM Fundamentals. It belongs to the DOM tree, selection, manipulation, and traversal. Understanding textContent vs innerText helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide textcontent vs innertext details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat textContent vs innerText as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate textContent vs innerText in B3.3 — DOM Fundamentals: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect textContent vs innerText to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about textcontent vs innertext.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing textContent vs innerText from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// textContent vs innerText — minimal browser example\nconsole.log('[b3-textcontent-innertext]', typeof document);\n// Open DevTools → verify behavior for: textContent vs innerText\n// Spec reference: developer.mozilla.org (search \"textContent vs innerText\")",
  "exampleCaption": "textContent vs innerText — observe in DevTools while this runs",
  "internals": [
    "textContent vs innerText is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for textcontent vs innertext can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether textcontent vs innertext succeeds in production."
  ],
  "takeaways": [
    "Locate textContent vs innerText in B3.3 — DOM Fundamentals: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect textContent vs innerText to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing textContent vs innerText from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "textContent vs innerText is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "textContent vs innerText: Treat textContent vs innerText as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate textContent vs innerText in B3.3 — DOM Fundamentals: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect textContent vs innerText to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing textContent vs innerText from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "textContent vs innerText",
      "textContent vs innerText is a core Web Platform concept in DOM Fundamentals."
    ],
    [
      "Mental model",
      "Treat textContent vs innerText as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing textContent vs innerText from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate textContent vs innerText in B3.3 — DOM Fundamentals: map it to MDN refere",
      "Connect textContent vs innerText to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is textContent vs innerText in the browser and when do you use it?",
      "answerHint": "textContent vs innerText is a core Web Platform concept in DOM Fundamentals. It belongs to the DOM tree, selection, manipulation, and traversal. Understanding textContent vs innerText helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain textContent vs innerText with a DevTools observation and one pitfall.",
      "answerHint": "Locate textContent vs innerText in B3.3 — DOM Fundamentals: map it to MDN reference docs and observe behavior in DevTools. Connect textContent vs innerText to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about textcontent vs innertext. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing textContent vs innerText from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain textContent vs innerText in a senior frontend interview?",
      "answerHint": "textContent vs innerText is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for textcontent vs innertext can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether textcontent vs innertext succeeds in production. // textContent vs innerText — minimal browser example\nconsole.log('[b3-textcontent-innertext]', typeof document);\n// Ope"
    }
  ],
  "pitfalls": [
    "Interview trap: describing textContent vs innerText from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain textContent vs innerText at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "textContent vs innerText is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is textContent vs innerText?",
      "When would textContent vs innerText block rendering or fail cross-origin?",
      "What is the classic textContent vs innerText interview trap?"
    ],
    "traps": [
      "Interview trap: describing textContent vs innerText from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide textcontent vs innertext details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around textContent vs innerText."
    ]
  }
})
