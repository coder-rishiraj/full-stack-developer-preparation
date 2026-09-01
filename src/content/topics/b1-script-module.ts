import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "type=\"module\"",
  "whatIsIt": "type=\"module\" loads an ES module graph: import/export, strict mode, module scope, and deferred execution. Modules fetch dependencies, share instances via the module map, and do not leak bindings onto window. They also require CORS for cross-origin sources.",
  "whyExists": "Large apps needed real files with explicit dependencies instead of global namespaces and IIFE bundles.",
  "mentalModel": "Each file is a sealed box with imports as labeled doors. The browser builds the graph, instantiates once, then evaluates in dependency order.",
  "how": [
    "Use import/export; there is no implicit window leak.",
    "Scripts are defer-like: they wait for parse and for the graph.",
    "import.meta.url is the module’s URL for resolving assets.",
    "Classic scripts cannot import; they must use dynamic import() or bundlers."
  ],
  "callout": {
    "title": "Watch for",
    "text": "A module file served as a classic script throws on import — MIME/type=module and CORS must be correct.",
    "variant": "warning"
  },
  "example": "// app.js  (type=\"module\")\nimport { add } from './math.js';\nconsole.log(add(2, 3));\nconsole.log(import.meta.url);\n// this === undefined at top level in browsers\nconsole.log(typeof this);",
  "exampleCaption": "Module script: imports and import.meta",
  "internals": [
    "Module records go through fetch → parse → instantiate → evaluate; cycles get live bindings.",
    "Top-level this in modules is undefined, unlike classic scripts where it is the global object.",
    "Credentials/CORS for modules follow the script’s crossorigin and the module map’s fetch options."
  ],
  "takeaways": [
    "Use import/export; there is no implicit window leak.",
    "Scripts are defer-like: they wait for parse and for the graph.",
    "A module file served as a classic script throws on import — MIME/type=module and CORS must be correct.",
    "Module records go through fetch → parse → instantiate → evaluate; cycles get live bindings."
  ],
  "revision": [
    "type=\"module\": Each file is a sealed box with imports as labeled doors. The browser builds the graph, instantiates once, then evaluates in dependency order.",
    "Use import/export; there is no implicit window leak.",
    "Scripts are defer-like: they wait for parse and for the graph.",
    "import.meta.url is the module’s URL for resolving assets.",
    "Trap: A module file served as a classic script throws on import — MIME/type=module and CORS must be correct."
  ],
  "flashcards": [
    [
      "type=\"module\"",
      "type=\"module\" loads an ES module graph: import/export, strict mode, module scope, and deferred execution."
    ],
    [
      "Mental model",
      "Each file is a sealed box with imports as labeled doors. The browser builds the graph, instantiates once, then evaluates in dependency order."
    ],
    [
      "Common trap",
      "A module file served as a classic script throws on import — MIME/type=module and CORS must be correct."
    ],
    [
      "Use import/export; there is no implicit window leak.",
      "Scripts are defer-like: they wait for parse and for the graph."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is type=\"module\" and where does a beginner first see it?",
      "answerHint": "type=\"module\" loads an ES module graph: import/export, strict mode, module scope, and deferred execution. Modules fetch dependencies, share instances via the module map, and do not leak bindings onto window. They also require CORS for cross-origin sources."
    },
    {
      "level": "intermediate",
      "question": "Walk through how type=\"module\" works and name the main pitfall.",
      "answerHint": "Use import/export; there is no implicit window leak. Scripts are defer-like: they wait for parse and for the graph. import.meta.url is the module’s URL for resolving assets. Classic scripts cannot import; they must use dynamic import() or bundlers. Pitfall: A module file served as a classic script throws on import — MIME/type=module and CORS must be correct."
    },
    {
      "level": "advanced",
      "question": "How would you explain type=\"module\" at an interview, including engine/spec details?",
      "answerHint": "Module records go through fetch → parse → instantiate → evaluate; cycles get live bindings. Top-level this in modules is undefined, unlike classic scripts where it is the global object. Credentials/CORS for modules follow the script’s crossorigin and the module map’s fetch options."
    }
  ],
  "pitfalls": [
    "A module file served as a classic script throws on import — MIME/type=module and CORS must be correct.",
    "Classic scripts cannot import; they must use dynamic import() or bundlers."
  ],
  "interview": {
    "expectations": [
      "Explain type=\"module\" without mixing it up with a nearby B1.1 — JavaScript Foundations topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Module records go through fetch → parse → instantiate → evaluate; cycles get live bindings."
    ],
    "commonQuestions": [
      "What is type=\"module\"?",
      "Why does JavaScript type=\"module\" behave this way?",
      "What is the classic type=\"module\" interview trap?"
    ],
    "traps": [
      "A module file served as a classic script throws on import — MIME/type=module and CORS must be correct."
    ],
    "misconceptions": [
      "Large apps needed real files with explicit dependencies instead of global namespaces and IIFE bundles."
    ],
    "strongSignals": [
      "Separates type=\"module\" from lookalike APIs and can draw the mental model."
    ]
  }
})
