import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Node.js Conceptually",
  "whatIsIt": "Node.js embeds V8 and adds libuv for async I/O, plus modules like fs, path, http, and process. It is not a browser: no DOM, and historically no window. Modern Node implements many Web APIs (fetch, Blob, AbortController) so isomorphic code is easier, but the process model and module system still differ.",
  "whyExists": "People wanted JavaScript on servers and CLIs. Reusing V8 plus a non-blocking I/O layer made JS viable for network services.",
  "mentalModel": "A long-lived process with an event loop: JS callbacks run when sockets, files, or timers complete, not when a page paints.",
  "how": [
    "Entry is a file or ESM module, not an HTML script tag.",
    "Use process, Buffer, and node:fs for OS work.",
    "The loop exits when the handle/request count drops to zero (unless you keep timers).",
    "Do not assume document, localStorage, or layout APIs exist."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Requiring a browser-only package in Node (or importing node:fs in a client bundle) is the usual runtime mismatch.",
    "variant": "warning"
  },
  "example": "import { readFile } from 'node:fs/promises';\nimport { fileURLToPath } from 'node:url';\nconsole.log(process.pid, process.versions.node);\nconst url = new URL('./package.json', import.meta.url);\nconst json = JSON.parse(await readFile(fileURLToPath(url), 'utf8'));\nconsole.log(json.name);",
  "exampleCaption": "Node process + fs (ESM)",
  "internals": [
    "libuv phases: timers, pending, idle, poll, check (setImmediate), close.",
    "Node’s nextTick queue runs before other microtasks in some versions — ordering differs from browsers.",
    "Each Worker thread has its own V8 isolate and libuv loop."
  ],
  "takeaways": [
    "Entry is a file or ESM module, not an HTML script tag.",
    "Use process, Buffer, and node:fs for OS work.",
    "Requiring a browser-only package in Node (or importing node:fs in a client bundle) is the usual runtime mismatch.",
    "libuv phases: timers, pending, idle, poll, check (setImmediate), close."
  ],
  "revision": [
    "Node.js Conceptually: A long-lived process with an event loop: JS callbacks run when sockets, files, or timers complete, not when a page paints.",
    "Entry is a file or ESM module, not an HTML script tag.",
    "Use process, Buffer, and node:fs for OS work.",
    "The loop exits when the handle/request count drops to zero (unless you keep timers).",
    "Trap: Requiring a browser-only package in Node (or importing node:fs in a client bundle) is the usual runtime mismatch."
  ],
  "flashcards": [
    [
      "Node.js Conceptually",
      "Node.js embeds V8 and adds libuv for async I/O, plus modules like fs, path, http, and process."
    ],
    [
      "Mental model",
      "A long-lived process with an event loop: JS callbacks run when sockets, files, or timers complete, not when a page paints."
    ],
    [
      "Common trap",
      "Requiring a browser-only package in Node (or importing node:fs in a client bundle) is the usual runtime mismatch."
    ],
    [
      "Entry is a file or ESM module, not an HTML script tag.",
      "Use process, Buffer, and node:fs for OS work."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Node.js Conceptually and where does a beginner first see it?",
      "answerHint": "Node.js embeds V8 and adds libuv for async I/O, plus modules like fs, path, http, and process. It is not a browser: no DOM, and historically no window. Modern Node implements many Web APIs (fetch, Blob, AbortController) so isomorphic code is easier, but the process model and module system still differ."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Node.js Conceptually works and name the main pitfall.",
      "answerHint": "Entry is a file or ESM module, not an HTML script tag. Use process, Buffer, and node:fs for OS work. The loop exits when the handle/request count drops to zero (unless you keep timers). Do not assume document, localStorage, or layout APIs exist. Pitfall: Requiring a browser-only package in Node (or importing node:fs in a client bundle) is the usual runtime mismatch."
    },
    {
      "level": "advanced",
      "question": "How would you explain Node.js Conceptually at an interview, including engine/spec details?",
      "answerHint": "libuv phases: timers, pending, idle, poll, check (setImmediate), close. Node’s nextTick queue runs before other microtasks in some versions — ordering differs from browsers. Each Worker thread has its own V8 isolate and libuv loop."
    }
  ],
  "pitfalls": [
    "Requiring a browser-only package in Node (or importing node:fs in a client bundle) is the usual runtime mismatch.",
    "Do not assume document, localStorage, or layout APIs exist."
  ],
  "interview": {
    "expectations": [
      "Explain Node.js Conceptually without mixing it up with a nearby B1.1 — JavaScript Foundations topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "libuv phases: timers, pending, idle, poll, check (setImmediate), close."
    ],
    "commonQuestions": [
      "What is Node.js Conceptually?",
      "Why does JavaScript node.js conceptually behave this way?",
      "What is the classic Node.js Conceptually interview trap?"
    ],
    "traps": [
      "Requiring a browser-only package in Node (or importing node:fs in a client bundle) is the usual runtime mismatch."
    ],
    "misconceptions": [
      "People wanted JavaScript on servers and CLIs. Reusing V8 plus a non-blocking I/O layer made JS viable for network services."
    ],
    "strongSignals": [
      "Separates Node.js Conceptually from lookalike APIs and can draw the mental model."
    ]
  }
})
