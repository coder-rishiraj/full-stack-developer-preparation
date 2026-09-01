import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "TypeScript Modules",
  "whatIsIt": "TS supports ES modules (import/export) and legacy namespaces. moduleResolution finds imports. type-only imports erased. Ambient modules declare untyped packages.",
  "whyExists": "Modules scope types and values — align with bundler/runtime strategy.",
  "mentalModel": "File boundaries are package boundaries for types.",
  "how": [
    "Use import/export per file — avoid namespace for new code.",
    "import type { T } for type-only.",
    "export type re-exports types without values.",
    "declare module \"pkg\" for shim untyped JS.",
    "package.json \"exports\" affects resolution."
  ],
  "callout": {
    "title": "Watch for",
    "text": "import { User } when User is type-only — use import type under verbatimModuleSyntax.",
    "variant": "warning"
  },
  "example": "export type User = { id: string };\nexport function getUser(): User { return { id: '1' }; }\nimport type { User } from './types.js';\nimport { getUser } from './api.js';\nconst __typed: User = {} as User;\nconsole.log(\"const __typed: User = {} as User\");\nconsole.log(getUser('demo'));\n// TypeScript validates this file before emit",
  "exampleCaption": "Separate type and value exports",
  "internals": [
    "ESM/CJS interop rules in moduleResolution node16.",
    "Triple-slash reference legacy for scripts.",
    "isolatedModules requires transpile-safe imports."
  ],
  "takeaways": [
    "Use import/export per file — avoid namespace for new code.",
    "import type { T } for type-only.",
    "import { User } when User is type-only — use import type under verbatimModuleSyntax.",
    "ESM/CJS interop rules in moduleResolution node16."
  ],
  "revision": [
    "TypeScript Modules: File boundaries are package boundaries for types.",
    "Use import/export per file — avoid namespace for new code.",
    "import type { T } for type-only.",
    "export type re-exports types without values.",
    "Trap: import { User } when User is type-only — use import type under verbatimModuleSyntax."
  ],
  "flashcards": [
    [
      "TypeScript Modules",
      "TS supports ES modules (import/export) and legacy namespaces."
    ],
    [
      "Mental model",
      "File boundaries are package boundaries for types."
    ],
    [
      "Common trap",
      "import { User } when User is type-only — use import type under verbatimModuleSyntax."
    ],
    [
      "Use import/export per file — avoid namespace for new code.",
      "import type { T } for type-only."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is TypeScript Modules in TypeScript and when do you use it?",
      "answerHint": "TS supports ES modules (import/export) and legacy namespaces. moduleResolution finds imports. type-only imports erased. Ambient modules declare untyped packages."
    },
    {
      "level": "intermediate",
      "question": "Explain TypeScript Modules with a code example and one pitfall.",
      "answerHint": "Use import/export per file — avoid namespace for new code. import type { T } for type-only. export type re-exports types without values. declare module \"pkg\" for shim untyped JS. package.json \"exports\" affects resolution. Pitfall: import { User } when User is type-only — use import type under verbatimModuleSyntax."
    },
    {
      "level": "advanced",
      "question": "How would you explain TypeScript Modules in a senior frontend interview?",
      "answerHint": "ESM/CJS interop rules in moduleResolution node16. Triple-slash reference legacy for scripts. isolatedModules requires transpile-safe imports. export type User = { id: string };\nexport function getUser(): User { return { id: '1' }; }\nimport type { User } from './"
    }
  ],
  "pitfalls": [
    "import { User } when User is type-only — use import type under verbatimModuleSyntax."
  ],
  "interview": {
    "expectations": [
      "Explain TypeScript Modules with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "ESM/CJS interop rules in moduleResolution node16."
    ],
    "commonQuestions": [
      "What is TypeScript Modules?",
      "When would you choose TypeScript Modules over alternatives?",
      "What is the classic TypeScript Modules interview trap?"
    ],
    "traps": [
      "import { User } when User is type-only — use import type under verbatimModuleSyntax."
    ],
    "misconceptions": [
      "Modules scope types and values — align with bundler/runtime strategy."
    ],
    "strongSignals": [
      "Uses TypeScript Modules to remove invalid states, not just document them."
    ]
  }
})
