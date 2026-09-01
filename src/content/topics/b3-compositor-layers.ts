import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Compositor Layers",
  "whatIsIt": "Compositor Layers is a core Web Platform concept in Layout, Reflow, Paint & Compositing. It belongs to layout, reflow, paint, compositing, and GPU layers. Understanding Compositor Layers helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide compositor layers details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Compositor Layers as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Compositor Layers in B3.7 — Layout, Reflow, Paint & Compositing: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Compositor Layers to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about compositor layers.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Compositor Layers from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Compositor Layers — minimal browser example\nconsole.log('[b3-compositor-layers]', typeof document);\n// Open DevTools → verify behavior for: Compositor Layers\n// Spec reference: developer.mozilla.org (search \"Compositor Layers\")",
  "exampleCaption": "Compositor Layers — observe in DevTools while this runs",
  "internals": [
    "Compositor Layers is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for compositor layers can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether compositor layers succeeds in production."
  ],
  "takeaways": [
    "Locate Compositor Layers in B3.7 — Layout, Reflow, Paint & Compositing: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Compositor Layers to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Compositor Layers from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Compositor Layers is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Compositor Layers: Treat Compositor Layers as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Compositor Layers in B3.7 — Layout, Reflow, Paint & Compositing: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Compositor Layers to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Compositor Layers from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Compositor Layers",
      "Compositor Layers is a core Web Platform concept in Layout, Reflow, Paint & Compositing."
    ],
    [
      "Mental model",
      "Treat Compositor Layers as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Compositor Layers from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Compositor Layers in B3.7 — Layout, Reflow, Paint & Compositing: map it t",
      "Connect Compositor Layers to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Compositor Layers in the browser and when do you use it?",
      "answerHint": "Compositor Layers is a core Web Platform concept in Layout, Reflow, Paint & Compositing. It belongs to layout, reflow, paint, compositing, and GPU layers. Understanding Compositor Layers helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Compositor Layers with a DevTools observation and one pitfall.",
      "answerHint": "Locate Compositor Layers in B3.7 — Layout, Reflow, Paint & Compositing: map it to MDN reference docs and observe behavior in DevTools. Connect Compositor Layers to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about compositor layers. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Compositor Layers from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Compositor Layers in a senior frontend interview?",
      "answerHint": "Compositor Layers is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for compositor layers can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether compositor layers succeeds in production. // Compositor Layers — minimal browser example\nconsole.log('[b3-compositor-layers]', typeof document);\n// Open DevTools "
    }
  ],
  "pitfalls": [
    "Interview trap: describing Compositor Layers from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Compositor Layers at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Compositor Layers is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Compositor Layers?",
      "When would Compositor Layers block rendering or fail cross-origin?",
      "What is the classic Compositor Layers interview trap?"
    ],
    "traps": [
      "Interview trap: describing Compositor Layers from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide compositor layers details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Compositor Layers."
    ]
  }
})
