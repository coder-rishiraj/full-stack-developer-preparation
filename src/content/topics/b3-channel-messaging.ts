import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "MessageChannel",
  "whatIsIt": "MessageChannel is a core Web Platform concept in iframe & Cross-Document Communication. It belongs to iframes, postMessage, and cross-document communication. Understanding MessageChannel helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide messagechannel details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat MessageChannel as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate MessageChannel in B3.30 — iframe & Cross-Document Communication: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect MessageChannel to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about messagechannel.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing MessageChannel from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// MessageChannel — minimal browser example\nconsole.log('[b3-channel-messaging]', typeof document);\n// Open DevTools → verify behavior for: MessageChannel\n// Spec reference: developer.mozilla.org (search \"MessageChannel\")",
  "exampleCaption": "MessageChannel — observe in DevTools while this runs",
  "internals": [
    "MessageChannel is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for messagechannel can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether messagechannel succeeds in production."
  ],
  "takeaways": [
    "Locate MessageChannel in B3.30 — iframe & Cross-Document Communication: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect MessageChannel to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing MessageChannel from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "MessageChannel is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "MessageChannel: Treat MessageChannel as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate MessageChannel in B3.30 — iframe & Cross-Document Communication: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect MessageChannel to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing MessageChannel from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "MessageChannel",
      "MessageChannel is a core Web Platform concept in iframe & Cross-Document Communication."
    ],
    [
      "Mental model",
      "Treat MessageChannel as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing MessageChannel from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate MessageChannel in B3.30 — iframe & Cross-Document Communication: map it t",
      "Connect MessageChannel to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is MessageChannel in the browser and when do you use it?",
      "answerHint": "MessageChannel is a core Web Platform concept in iframe & Cross-Document Communication. It belongs to iframes, postMessage, and cross-document communication. Understanding MessageChannel helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain MessageChannel with a DevTools observation and one pitfall.",
      "answerHint": "Locate MessageChannel in B3.30 — iframe & Cross-Document Communication: map it to MDN reference docs and observe behavior in DevTools. Connect MessageChannel to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about messagechannel. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing MessageChannel from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain MessageChannel in a senior frontend interview?",
      "answerHint": "MessageChannel is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for messagechannel can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether messagechannel succeeds in production. // MessageChannel — minimal browser example\nconsole.log('[b3-channel-messaging]', typeof document);\n// Open DevTools → v"
    }
  ],
  "pitfalls": [
    "Interview trap: describing MessageChannel from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain MessageChannel at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "MessageChannel is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is MessageChannel?",
      "When would MessageChannel block rendering or fail cross-origin?",
      "What is the classic MessageChannel interview trap?"
    ],
    "traps": [
      "Interview trap: describing MessageChannel from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide messagechannel details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around MessageChannel."
    ]
  }
})
