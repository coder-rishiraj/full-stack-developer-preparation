import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "BroadcastChannel",
  "whatIsIt": "BroadcastChannel is a core Web Platform concept in iframe & Cross-Document Communication. It belongs to iframes, postMessage, and cross-document communication. Understanding BroadcastChannel helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide broadcastchannel details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat BroadcastChannel as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate BroadcastChannel in B3.30 — iframe & Cross-Document Communication: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect BroadcastChannel to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about broadcastchannel.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing BroadcastChannel from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// BroadcastChannel — minimal browser example\nconsole.log('[b3-broadcast-channel]', typeof document);\n// Open DevTools → verify behavior for: BroadcastChannel\n// Spec reference: developer.mozilla.org (search \"BroadcastChannel\")",
  "exampleCaption": "BroadcastChannel — observe in DevTools while this runs",
  "internals": [
    "BroadcastChannel is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for broadcastchannel can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether broadcastchannel succeeds in production."
  ],
  "takeaways": [
    "Locate BroadcastChannel in B3.30 — iframe & Cross-Document Communication: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect BroadcastChannel to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing BroadcastChannel from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "BroadcastChannel is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "BroadcastChannel: Treat BroadcastChannel as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate BroadcastChannel in B3.30 — iframe & Cross-Document Communication: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect BroadcastChannel to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing BroadcastChannel from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "BroadcastChannel",
      "BroadcastChannel is a core Web Platform concept in iframe & Cross-Document Communication."
    ],
    [
      "Mental model",
      "Treat BroadcastChannel as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing BroadcastChannel from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate BroadcastChannel in B3.30 — iframe & Cross-Document Communication: map it",
      "Connect BroadcastChannel to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is BroadcastChannel in the browser and when do you use it?",
      "answerHint": "BroadcastChannel is a core Web Platform concept in iframe & Cross-Document Communication. It belongs to iframes, postMessage, and cross-document communication. Understanding BroadcastChannel helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain BroadcastChannel with a DevTools observation and one pitfall.",
      "answerHint": "Locate BroadcastChannel in B3.30 — iframe & Cross-Document Communication: map it to MDN reference docs and observe behavior in DevTools. Connect BroadcastChannel to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about broadcastchannel. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing BroadcastChannel from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain BroadcastChannel in a senior frontend interview?",
      "answerHint": "BroadcastChannel is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for broadcastchannel can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether broadcastchannel succeeds in production. // BroadcastChannel — minimal browser example\nconsole.log('[b3-broadcast-channel]', typeof document);\n// Open DevTools →"
    }
  ],
  "pitfalls": [
    "Interview trap: describing BroadcastChannel from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain BroadcastChannel at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "BroadcastChannel is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is BroadcastChannel?",
      "When would BroadcastChannel block rendering or fail cross-origin?",
      "What is the classic BroadcastChannel interview trap?"
    ],
    "traps": [
      "Interview trap: describing BroadcastChannel from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide broadcastchannel details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around BroadcastChannel."
    ]
  }
})
