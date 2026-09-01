import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "ESM vs CommonJS",
  "whatIsIt": "ESM: import/export, live bindings, async/static analysis, this undefined, file extensions often required. CJS: require, module.exports, copy of exports at require time (values copied for primitives), sync, __dirname. Node treats .mjs/.cjs and package.json type. They interop with sharp edges (default, dual packages).",
  "whyExists": "Node shipped CJS years before ESM. Both exist; the ecosystem is still bridging.",
  "mentalModel": "ESM is a live window into another file. CJS is a snapshot of module.exports when require ran (plus caching of the object).",
  "how": [
    "New Node libraries: ESM.",
    "Know require of ESM is not allowed; import() CJS is.",
    "__dirname in ESM: fileURLToPath(import.meta.url).",
    "Do not dual-publish incorrectly (dual package hazard)."
  ],
  "callout": {
    "title": "Watch for",
    "text": "typeof module !== 'undefined' detection is fragile in bundled dual modules.",
    "variant": "warning"
  },
  "example": "// CJS\n// const { add } = require('./math');\n// module.exports = { add };\n// ESM\nimport { createRequire } from 'node:module';\nconst require = createRequire(import.meta.url);\nconsole.log(typeof require, import.meta.url);\n",
  "exampleCaption": "createRequire bridge from ESM to CJS",
  "internals": [
    "CJS module cache is a map of filename → exports object.",
    "ESM module map is URL → Module Record.",
    "Live bindings vs cjs copy: export let n; n++ is seen by importers; cjs.exports.n++ requires the same object export."
  ],
  "takeaways": [
    "New Node libraries: ESM.",
    "Know require of ESM is not allowed; import() CJS is.",
    "typeof module !== 'undefined' detection is fragile in bundled dual modules.",
    "CJS module cache is a map of filename → exports object."
  ],
  "revision": [
    "ESM vs CommonJS: ESM is a live window into another file. CJS is a snapshot of module.exports when require ran (plus caching of the object).",
    "New Node libraries: ESM.",
    "Know require of ESM is not allowed; import() CJS is.",
    "__dirname in ESM: fileURLToPath(import.meta.url).",
    "Trap: typeof module !== 'undefined' detection is fragile in bundled dual modules."
  ],
  "flashcards": [
    [
      "ESM vs CommonJS",
      "ESM: import/export, live bindings, async/static analysis, this undefined, file extensions often required."
    ],
    [
      "Mental model",
      "ESM is a live window into another file. CJS is a snapshot of module.exports when require ran (plus caching of the object)."
    ],
    [
      "Common trap",
      "typeof module !== 'undefined' detection is fragile in bundled dual modules."
    ],
    [
      "New Node libraries: ESM.",
      "Know require of ESM is not allowed; import() CJS is."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is ESM vs CommonJS and where does a beginner first see it?",
      "answerHint": "ESM: import/export, live bindings, async/static analysis, this undefined, file extensions often required. CJS: require, module.exports, copy of exports at require time (values copied for primitives), sync, __dirname. Node treats .mjs/.cjs and package.json type. They interop with sharp edges (default, dual packages)."
    },
    {
      "level": "intermediate",
      "question": "Walk through how ESM vs CommonJS works and name the main pitfall.",
      "answerHint": "New Node libraries: ESM. Know require of ESM is not allowed; import() CJS is. __dirname in ESM: fileURLToPath(import.meta.url). Do not dual-publish incorrectly (dual package hazard). Pitfall: typeof module !== 'undefined' detection is fragile in bundled dual modules."
    },
    {
      "level": "advanced",
      "question": "How would you explain ESM vs CommonJS at an interview, including engine/spec details?",
      "answerHint": "CJS module cache is a map of filename → exports object. ESM module map is URL → Module Record. Live bindings vs cjs copy: export let n; n++ is seen by importers; cjs.exports.n++ requires the same object export."
    }
  ],
  "pitfalls": [
    "typeof module !== 'undefined' detection is fragile in bundled dual modules.",
    "Do not dual-publish incorrectly (dual package hazard)."
  ],
  "interview": {
    "expectations": [
      "Explain ESM vs CommonJS without mixing it up with a nearby B1.34 — Modules topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "CJS module cache is a map of filename → exports object."
    ],
    "commonQuestions": [
      "What is ESM vs CommonJS?",
      "Why does JavaScript esm vs commonjs behave this way?",
      "What is the classic ESM vs CommonJS interview trap?"
    ],
    "traps": [
      "typeof module !== 'undefined' detection is fragile in bundled dual modules."
    ],
    "misconceptions": [
      "Node shipped CJS years before ESM. Both exist; the ecosystem is still bridging."
    ],
    "strongSignals": [
      "Separates ESM vs CommonJS from lookalike APIs and can draw the mental model."
    ]
  }
})
