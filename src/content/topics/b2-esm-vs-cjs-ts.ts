import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "ESM vs CommonJS in TS",
  "whatIsIt": "ESM uses import/export; CJS uses require/module.exports. TS module: CommonJS vs ES2015/ESNext vs NodeNext. NodeNext respects package.json type field. import = require for CJS interop rare.",
  "whyExists": "Module format mismatch causes runtime import errors — TS config must match Node/bundler.",
  "mentalModel": "Two plug shapes — adapter (config) must match socket (runtime).",
  "how": [
    "\"type\": \"module\" → NodeNext + .js extensions in imports.",
    "CJS emit: \"module\": \"CommonJS\" for older Node.",
    "esModuleInterop eases default import from CJS.",
    "Bundler (Vite) prefers ESM + \"module\": \"ESNext\".",
    "Dual packages publish types for both."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Importing CJS without esModuleInterop — default import errors.",
    "variant": "warning"
  },
  "example": "// package.json: { \"type\": \"module\" }\n// tsconfig: \"module\": \"NodeNext\", \"moduleResolution\": \"NodeNext\"\nimport { createServer } from 'node:http';\nexport function main() { return createServer(); }\nconsole.log(main('demo'));\n// Strict mode catches misuse at compile time\n// Annotations are erased — zero runtime overhead\n// Enable \"strict\": true in tsconfig.json",
  "exampleCaption": "NodeNext aligns TS with package type module",
  "internals": [
    "require is not ESM — TS errors on require in module files.",
    "Extension .ts vs .js in import paths — emit uses .js.",
    "verbatimModuleSyntax preserves import form."
  ],
  "takeaways": [
    "\"type\": \"module\" → NodeNext + .js extensions in imports.",
    "CJS emit: \"module\": \"CommonJS\" for older Node.",
    "Importing CJS without esModuleInterop — default import errors.",
    "require is not ESM — TS errors on require in module files."
  ],
  "revision": [
    "ESM vs CommonJS in TS: Two plug shapes — adapter (config) must match socket (runtime).",
    "\"type\": \"module\" → NodeNext + .js extensions in imports.",
    "CJS emit: \"module\": \"CommonJS\" for older Node.",
    "esModuleInterop eases default import from CJS.",
    "Trap: Importing CJS without esModuleInterop — default import errors."
  ],
  "flashcards": [
    [
      "ESM vs CommonJS in TS",
      "ESM uses import/export; CJS uses require/module.exports."
    ],
    [
      "Mental model",
      "Two plug shapes — adapter (config) must match socket (runtime)."
    ],
    [
      "Common trap",
      "Importing CJS without esModuleInterop — default import errors."
    ],
    [
      "\"type\": \"module\" → NodeNext + .js extensions in imports.",
      "CJS emit: \"module\": \"CommonJS\" for older Node."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is ESM vs CommonJS in TS in TypeScript and when do you use it?",
      "answerHint": "ESM uses import/export; CJS uses require/module.exports. TS module: CommonJS vs ES2015/ESNext vs NodeNext. NodeNext respects package.json type field. import = require for CJS interop rare."
    },
    {
      "level": "intermediate",
      "question": "Explain ESM vs CommonJS in TS with a code example and one pitfall.",
      "answerHint": "\"type\": \"module\" → NodeNext + .js extensions in imports. CJS emit: \"module\": \"CommonJS\" for older Node. esModuleInterop eases default import from CJS. Bundler (Vite) prefers ESM + \"module\": \"ESNext\". Dual packages publish types for both. Pitfall: Importing CJS without esModuleInterop — default import errors."
    },
    {
      "level": "advanced",
      "question": "How would you explain ESM vs CommonJS in TS in a senior frontend interview?",
      "answerHint": "require is not ESM — TS errors on require in module files. Extension .ts vs .js in import paths — emit uses .js. verbatimModuleSyntax preserves import form. // package.json: { \"type\": \"module\" }\n// tsconfig: \"module\": \"NodeNext\", \"moduleResolution\": \"NodeNext\"\nimport { createS"
    }
  ],
  "pitfalls": [
    "Importing CJS without esModuleInterop — default import errors."
  ],
  "interview": {
    "expectations": [
      "Explain ESM vs CommonJS in TS with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "require is not ESM — TS errors on require in module files."
    ],
    "commonQuestions": [
      "What is ESM vs CommonJS in TS?",
      "When would you choose ESM vs CommonJS in TS over alternatives?",
      "What is the classic ESM vs CommonJS in TS interview trap?"
    ],
    "traps": [
      "Importing CJS without esModuleInterop — default import errors."
    ],
    "misconceptions": [
      "Module format mismatch causes runtime import errors — TS config must match Node/bundler."
    ],
    "strongSignals": [
      "Uses ESM vs CommonJS in TS to remove invalid states, not just document them."
    ]
  }
})
