import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Tree Shaking Conceptually",
  "whatIsIt": "Tree shaking is bundler dead-code elimination of unused exports, enabled by ESM’s static structure. Side-effectful modules (polyfills, CSS-in-JS) must be marked so they are not dropped. Default exports and ‘touch everything’ namespaces shake worse. It is not a runtime JS feature.",
  "whyExists": "Shipping unused library code costs bytes and parse time. Static import/export made automated dropping possible.",
  "mentalModel": "A tree of files. If nobody imported shake(), the bundler saws that branch off — unless the file pokes the world at load.",
  "how": [
    "Named exports, pure functions, sideEffects: false in package.json (honestly).",
    "Avoid top-level DOM writes in barrel files.",
    "import * as all may keep more than you think.",
    "Measure the bundle; do not trust names."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Barrel index.js re-exporting everything with side effects keeps the whole library.",
    "variant": "warning"
  },
  "example": "export function used() { return 1; }\nexport function unused() { return 2; }\nconsole.log(used());\n// bundler may drop unused() if this is the only entry and used is imported\n",
  "exampleCaption": "Named unused export is shakeable if side-effect free",
  "internals": [
    "Bundlers parse import/export to a graph + purity analysis.",
    "eval, computed property access of namespace, and module.sideEffects complicate it.",
    "Runtime ESM in browsers does not delete unused exports from the file on disk."
  ],
  "takeaways": [
    "Named exports, pure functions, sideEffects: false in package.json (honestly).",
    "Avoid top-level DOM writes in barrel files.",
    "Barrel index.js re-exporting everything with side effects keeps the whole library.",
    "Bundlers parse import/export to a graph + purity analysis."
  ],
  "revision": [
    "Tree Shaking Conceptually: A tree of files. If nobody imported shake(), the bundler saws that branch off — unless the file pokes the world at load.",
    "Named exports, pure functions, sideEffects: false in package.json (honestly).",
    "Avoid top-level DOM writes in barrel files.",
    "import * as all may keep more than you think.",
    "Trap: Barrel index.js re-exporting everything with side effects keeps the whole library."
  ],
  "flashcards": [
    [
      "Tree Shaking Conceptually",
      "Tree shaking is bundler dead-code elimination of unused exports, enabled by ESM’s static structure."
    ],
    [
      "Mental model",
      "A tree of files. If nobody imported shake(), the bundler saws that branch off — unless the file pokes the world at load."
    ],
    [
      "Common trap",
      "Barrel index.js re-exporting everything with side effects keeps the whole library."
    ],
    [
      "Named exports, pure functions, sideEffects: false in package.json (honestly).",
      "Avoid top-level DOM writes in barrel files."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Tree Shaking Conceptually and where does a beginner first see it?",
      "answerHint": "Tree shaking is bundler dead-code elimination of unused exports, enabled by ESM’s static structure. Side-effectful modules (polyfills, CSS-in-JS) must be marked so they are not dropped. Default exports and ‘touch everything’ namespaces shake worse. It is not a runtime JS feature."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Tree Shaking Conceptually works and name the main pitfall.",
      "answerHint": "Named exports, pure functions, sideEffects: false in package.json (honestly). Avoid top-level DOM writes in barrel files. import * as all may keep more than you think. Measure the bundle; do not trust names. Pitfall: Barrel index.js re-exporting everything with side effects keeps the whole library."
    },
    {
      "level": "advanced",
      "question": "How would you explain Tree Shaking Conceptually at an interview, including engine/spec details?",
      "answerHint": "Bundlers parse import/export to a graph + purity analysis. eval, computed property access of namespace, and module.sideEffects complicate it. Runtime ESM in browsers does not delete unused exports from the file on disk."
    }
  ],
  "pitfalls": [
    "Barrel index.js re-exporting everything with side effects keeps the whole library.",
    "Measure the bundle; do not trust names."
  ],
  "interview": {
    "expectations": [
      "Explain Tree Shaking Conceptually without mixing it up with a nearby B1.34 — Modules topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Bundlers parse import/export to a graph + purity analysis."
    ],
    "commonQuestions": [
      "What is Tree Shaking Conceptually?",
      "Why does JavaScript tree shaking conceptually behave this way?",
      "What is the classic Tree Shaking Conceptually interview trap?"
    ],
    "traps": [
      "Barrel index.js re-exporting everything with side effects keeps the whole library."
    ],
    "misconceptions": [
      "Shipping unused library code costs bytes and parse time. Static import/export made automated dropping possible."
    ],
    "strongSignals": [
      "Separates Tree Shaking Conceptually from lookalike APIs and can draw the mental model."
    ]
  }
})
