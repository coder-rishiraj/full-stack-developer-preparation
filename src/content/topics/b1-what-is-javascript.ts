import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "What JavaScript Is",
  "whatIsIt": "JavaScript is a high-level, dynamically typed language that runs inside a host: a browser, Node.js, Deno, Bun, or an embedded engine. It is multi-paradigm: you can write procedural scripts, objects with prototypes, classes, and functional pipelines in the same file. The language itself is small; timers, DOM, and fetch are host APIs, not ECMAScript. Almost every modern web UI and a huge share of backends execute this language.",
  "whyExists": "Netscape needed a lightweight language that could react to user input in the page without a round trip to the server. The same syntax later escaped the browser because engines are embeddable and the language is easy to hire for.",
  "mentalModel": "Picture a guest language living in a house (the host). The guest speaks ECMAScript; the house provides doors (Web APIs / Node APIs) to the outside world.",
  "how": [
    "ECMAScript defines syntax, types, functions, promises, modules — not the DOM.",
    "A runtime pairs an engine (V8, SpiderMonkey, JavaScriptCore) with host APIs and an event loop.",
    "Scripts are parsed, compiled (often JIT), and run on a single JS thread per isolate by default.",
    "Use JS for UI glue, servers, CLIs, and scripting; do not confuse language features with browser APIs."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: calling fetch/setTimeout “JavaScript features.” They are host-provided; a bare engine has neither.",
    "variant": "warning"
  },
  "example": "console.log(typeof 1);           // \"number\"  — language\nconsole.log(typeof fetch);       // \"function\" — host API (browser / some runtimes)\nconsole.log(globalThis.queueMicrotask); // host scheduling hook\nconst sum = (a, b) => a + b;     // language: first-class function\nconsole.log(sum(2, 3));",
  "exampleCaption": "Language vs host: typeof and a host function",
  "internals": [
    "ECMA-262 is the language spec; HTML/WHATWG and Node docs specify host APIs.",
    "Each realm has its own intrinsics (Array, Object, Promise) — iframes are separate realms.",
    "Engines implement the spec plus host hooks (Job queues, Promise jobs, module loading)."
  ],
  "takeaways": [
    "ECMAScript defines syntax, types, functions, promises, modules — not the DOM.",
    "A runtime pairs an engine (V8, SpiderMonkey, JavaScriptCore) with host APIs and an event loop.",
    "Interview trap: calling fetch/setTimeout “JavaScript features.” They are host-provided; a bare engine has neither.",
    "ECMA-262 is the language spec; HTML/WHATWG and Node docs specify host APIs."
  ],
  "revision": [
    "What JavaScript Is: Picture a guest language living in a house (the host). The guest speaks ECMAScript; the house provides doors (Web APIs / Node APIs) to the outside world.",
    "ECMAScript defines syntax, types, functions, promises, modules — not the DOM.",
    "A runtime pairs an engine (V8, SpiderMonkey, JavaScriptCore) with host APIs and an event loop.",
    "Scripts are parsed, compiled (often JIT), and run on a single JS thread per isolate by default.",
    "Trap: Interview trap: calling fetch/setTimeout “JavaScript features.” They are host-provided; a bare engine has neither."
  ],
  "flashcards": [
    [
      "What JavaScript Is",
      "JavaScript is a high-level, dynamically typed language that runs inside a host: a browser, Node.js, Deno, Bun, or an embedded engine."
    ],
    [
      "Mental model",
      "Picture a guest language living in a house (the host). The guest speaks ECMAScript; the house provides doors (Web APIs / Node APIs) to the outside world."
    ],
    [
      "Common trap",
      "Interview trap: calling fetch/setTimeout “JavaScript features.” They are host-provided; a bare engine has neither."
    ],
    [
      "ECMAScript defines syntax, types, functions, promises, modules — not the DOM.",
      "A runtime pairs an engine (V8, SpiderMonkey, JavaScriptCore) with host APIs and an event loop."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is What JavaScript Is and where does a beginner first see it?",
      "answerHint": "JavaScript is a high-level, dynamically typed language that runs inside a host: a browser, Node.js, Deno, Bun, or an embedded engine. It is multi-paradigm: you can write procedural scripts, objects with prototypes, classes, and functional pipelines in the same file. The language itself is small; timers, DOM, and fetch are host APIs, not ECMAScript. Almost every modern web UI and a huge share of backends execute this language."
    },
    {
      "level": "intermediate",
      "question": "Walk through how What JavaScript Is works and name the main pitfall.",
      "answerHint": "ECMAScript defines syntax, types, functions, promises, modules — not the DOM. A runtime pairs an engine (V8, SpiderMonkey, JavaScriptCore) with host APIs and an event loop. Scripts are parsed, compiled (often JIT), and run on a single JS thread per isolate by default. Use JS for UI glue, servers, CLIs, and scripting; do not confuse language features with browser APIs. Pitfall: Interview trap: calling fetch/setTimeout “JavaScript features.” They are host-provided; a bare engine has neither."
    },
    {
      "level": "advanced",
      "question": "How would you explain What JavaScript Is at an interview, including engine/spec details?",
      "answerHint": "ECMA-262 is the language spec; HTML/WHATWG and Node docs specify host APIs. Each realm has its own intrinsics (Array, Object, Promise) — iframes are separate realms. Engines implement the spec plus host hooks (Job queues, Promise jobs, module loading)."
    }
  ],
  "pitfalls": [
    "Interview trap: calling fetch/setTimeout “JavaScript features.” They are host-provided; a bare engine has neither.",
    "Use JS for UI glue, servers, CLIs, and scripting; do not confuse language features with browser APIs."
  ],
  "interview": {
    "expectations": [
      "Explain What JavaScript Is without mixing it up with a nearby B1.1 — JavaScript Foundations topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "ECMA-262 is the language spec; HTML/WHATWG and Node docs specify host APIs."
    ],
    "commonQuestions": [
      "What is What JavaScript Is?",
      "Why does JavaScript what javascript is behave this way?",
      "What is the classic What JavaScript Is interview trap?"
    ],
    "traps": [
      "Interview trap: calling fetch/setTimeout “JavaScript features.” They are host-provided; a bare engine has neither."
    ],
    "misconceptions": [
      "Netscape needed a lightweight language that could react to user input in the page without a round trip to the server. The same syntax later escaped the browser because engines are embeddable and the language is easy to hire for."
    ],
    "strongSignals": [
      "Separates What JavaScript Is from lookalike APIs and can draw the mental model."
    ]
  }
})
