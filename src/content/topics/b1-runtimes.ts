import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "JavaScript Runtimes",
  "whatIsIt": "A JavaScript runtime is the combination of an engine plus host APIs, an event loop, and a way to load code. Chrome, Node, Deno, and Cloudflare Workers are different runtimes that can share the V8 engine but expose different globals. Your mental model of “what can this file do?” depends on the runtime, not just the language version.",
  "whyExists": "The language is embeddable. Product teams wrap the engine with I/O, security sandboxing, and scheduling that match a browser tab, a server process, or an edge isolate.",
  "mentalModel": "Same CPU (engine), different operating systems (runtimes). Code that uses `window` fails in Node; code that uses `fs` fails in the browser.",
  "how": [
    "Identify the global object: window (browsers), global (Node CJS), globalThis (portable).",
    "List host APIs you rely on (DOM, fetch, fs, process) and confirm they exist here.",
    "Remember each runtime has its own event-loop details (browsers vs libuv).",
    "Ship for a target: browsers via bundlers; Node via engines’ supported versions."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Assuming Node globals exist in the browser (or vice versa) is the classic “works on my machine” failure.",
    "variant": "warning"
  },
  "example": "const g = globalThis;\nconsole.log('fetch' in g, 'process' in g, 'document' in g);\nconsole.log(g.constructor.name);\n// Browser: fetch true, process false, document true\n// Node 18+: fetch true, process true, document false",
  "exampleCaption": "Detect which runtime you are in",
  "internals": [
    "HTML’s event loop and Node’s libuv loop both drain microtasks, but timer and I/O phases differ.",
    "Workers and iframes are additional runtimes (realms) with their own globals.",
    "Some runtimes freeze or omit globals for security (edge workers, SES)."
  ],
  "takeaways": [
    "Identify the global object: window (browsers), global (Node CJS), globalThis (portable).",
    "List host APIs you rely on (DOM, fetch, fs, process) and confirm they exist here.",
    "Assuming Node globals exist in the browser (or vice versa) is the classic “works on my machine” failure.",
    "HTML’s event loop and Node’s libuv loop both drain microtasks, but timer and I/O phases differ."
  ],
  "revision": [
    "JavaScript Runtimes: Same CPU (engine), different operating systems (runtimes). Code that uses `window` fails in Node; code that uses `fs` fails in the browser.",
    "Identify the global object: window (browsers), global (Node CJS), globalThis (portable).",
    "List host APIs you rely on (DOM, fetch, fs, process) and confirm they exist here.",
    "Remember each runtime has its own event-loop details (browsers vs libuv).",
    "Trap: Assuming Node globals exist in the browser (or vice versa) is the classic “works on my machine” failure."
  ],
  "flashcards": [
    [
      "JavaScript Runtimes",
      "A JavaScript runtime is the combination of an engine plus host APIs, an event loop, and a way to load code."
    ],
    [
      "Mental model",
      "Same CPU (engine), different operating systems (runtimes). Code that uses `window` fails in Node; code that uses `fs` fails in the browser."
    ],
    [
      "Common trap",
      "Assuming Node globals exist in the browser (or vice versa) is the classic “works on my machine” failure."
    ],
    [
      "Identify the global object: window (browsers), global (Node CJS), globalThis (po",
      "List host APIs you rely on (DOM, fetch, fs, process) and confirm they exist here."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is JavaScript Runtimes and where does a beginner first see it?",
      "answerHint": "A JavaScript runtime is the combination of an engine plus host APIs, an event loop, and a way to load code. Chrome, Node, Deno, and Cloudflare Workers are different runtimes that can share the V8 engine but expose different globals. Your mental model of “what can this file do?” depends on the runtime, not just the language version."
    },
    {
      "level": "intermediate",
      "question": "Walk through how JavaScript Runtimes works and name the main pitfall.",
      "answerHint": "Identify the global object: window (browsers), global (Node CJS), globalThis (portable). List host APIs you rely on (DOM, fetch, fs, process) and confirm they exist here. Remember each runtime has its own event-loop details (browsers vs libuv). Ship for a target: browsers via bundlers; Node via engines’ supported versions. Pitfall: Assuming Node globals exist in the browser (or vice versa) is the classic “works on my machine” failure."
    },
    {
      "level": "advanced",
      "question": "How would you explain JavaScript Runtimes at an interview, including engine/spec details?",
      "answerHint": "HTML’s event loop and Node’s libuv loop both drain microtasks, but timer and I/O phases differ. Workers and iframes are additional runtimes (realms) with their own globals. Some runtimes freeze or omit globals for security (edge workers, SES)."
    }
  ],
  "pitfalls": [
    "Assuming Node globals exist in the browser (or vice versa) is the classic “works on my machine” failure.",
    "Ship for a target: browsers via bundlers; Node via engines’ supported versions."
  ],
  "interview": {
    "expectations": [
      "Explain JavaScript Runtimes without mixing it up with a nearby B1.1 — JavaScript Foundations topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "HTML’s event loop and Node’s libuv loop both drain microtasks, but timer and I/O phases differ."
    ],
    "commonQuestions": [
      "What is JavaScript Runtimes?",
      "Why does JavaScript javascript runtimes behave this way?",
      "What is the classic JavaScript Runtimes interview trap?"
    ],
    "traps": [
      "Assuming Node globals exist in the browser (or vice versa) is the classic “works on my machine” failure."
    ],
    "misconceptions": [
      "The language is embeddable. Product teams wrap the engine with I/O, security sandboxing, and scheduling that match a browser tab, a server process, or an edge isolate."
    ],
    "strongSignals": [
      "Separates JavaScript Runtimes from lookalike APIs and can draw the mental model."
    ]
  }
})
