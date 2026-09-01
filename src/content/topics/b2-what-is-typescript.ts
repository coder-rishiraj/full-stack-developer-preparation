import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "What TypeScript Is",
  "whatIsIt": "TypeScript is a typed superset of JavaScript that compiles to plain JS. You write .ts or .tsx files with optional type annotations; the TypeScript compiler (tsc) or a bundler plugin strips types and emits JS your runtime already understands. Types exist only at compile time — they do not change runtime behavior unless you use features that emit code (enums, decorators, legacy settings).",
  "whyExists": "Large JS codebases needed a way to document contracts, catch typos before runtime, and refactor safely. Microsoft built TS as an incremental layer so teams could adopt typing without abandoning the JS ecosystem.",
  "mentalModel": "TypeScript is a spell-checker for your JavaScript manuscript. The published book (compiled JS) reads the same; the checker catches mistakes before readers (users) see them.",
  "how": [
    "Install TypeScript: npm i -D typescript.",
    "Add tsconfig.json with \"strict\": true for best safety.",
    "Write .ts files; run tsc or let Vite/esbuild transpile on the fly.",
    "Types annotate variables, parameters, and return values — erased at emit.",
    "Start with allowJs/checkJs for gradual migration from existing JS."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Thinking TypeScript adds runtime type checks automatically. It does not — unless you write guards or use a validation library.",
    "variant": "warning"
  },
  "example": "function greet(name: string): string {\n  return `Hello, ${name}`;\n}\nconst msg = greet('TypeScript');\nconsole.log(msg);\n// tsc removes : string and : string before emit\n// TypeScript validates this file before emit\n// Strict mode catches misuse at compile time",
  "exampleCaption": "A typed function compiles to identical JS",
  "internals": [
    "TS extends JS grammar; invalid JS is invalid TS (with narrow exceptions).",
    "Structural typing: compatibility is shape-based, not nominal.",
    "The compiler performs type erasure — no typeof checks are injected by default."
  ],
  "takeaways": [
    "Install TypeScript: npm i -D typescript.",
    "Add tsconfig.json with \"strict\": true for best safety.",
    "Thinking TypeScript adds runtime type checks automatically. It does not — unless you write guards or use a validation library.",
    "TS extends JS grammar; invalid JS is invalid TS (with narrow exceptions)."
  ],
  "revision": [
    "What TypeScript Is: TypeScript is a spell-checker for your JavaScript manuscript. The published book (compiled JS) reads the same; the checker catches mistakes before readers (users) see them.",
    "Install TypeScript: npm i -D typescript.",
    "Add tsconfig.json with \"strict\": true for best safety.",
    "Write .ts files; run tsc or let Vite/esbuild transpile on the fly.",
    "Trap: Thinking TypeScript adds runtime type checks automatically. It does not — unless you write guards or use a validation library."
  ],
  "flashcards": [
    [
      "What TypeScript Is",
      "TypeScript is a typed superset of JavaScript that compiles to plain JS."
    ],
    [
      "Mental model",
      "TypeScript is a spell-checker for your JavaScript manuscript. The published book (compiled JS) reads the same; the checker catches mistakes before readers (users) see them."
    ],
    [
      "Common trap",
      "Thinking TypeScript adds runtime type checks automatically. It does not — unless you write guards or use a validation library."
    ],
    [
      "Install TypeScript: npm i -D typescript.",
      "Add tsconfig.json with \"strict\": true for best safety."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is What TypeScript Is in TypeScript and when do you use it?",
      "answerHint": "TypeScript is a typed superset of JavaScript that compiles to plain JS. You write .ts or .tsx files with optional type annotations; the TypeScript compiler (tsc) or a bundler plugin strips types and emits JS your runtime already understands. Types exist only at compile time — they do not change runtime behavior unless you use features that emit code (enums, decorators, legacy settings)."
    },
    {
      "level": "intermediate",
      "question": "Explain What TypeScript Is with a code example and one pitfall.",
      "answerHint": "Install TypeScript: npm i -D typescript. Add tsconfig.json with \"strict\": true for best safety. Write .ts files; run tsc or let Vite/esbuild transpile on the fly. Types annotate variables, parameters, and return values — erased at emit. Start with allowJs/checkJs for gradual migration from existing JS. Pitfall: Thinking TypeScript adds runtime type checks automatically. It does not — unless you write guards or use a validation library."
    },
    {
      "level": "advanced",
      "question": "How would you explain What TypeScript Is in a senior frontend interview?",
      "answerHint": "TS extends JS grammar; invalid JS is invalid TS (with narrow exceptions). Structural typing: compatibility is shape-based, not nominal. The compiler performs type erasure — no typeof checks are injected by default. function greet(name: string): string {\n  return `Hello, ${name}`;\n}\nconst msg = greet('TypeScript');\nconsole.log(msg);\n/"
    }
  ],
  "pitfalls": [
    "Thinking TypeScript adds runtime type checks automatically. It does not — unless you write guards or use a validation library."
  ],
  "interview": {
    "expectations": [
      "Explain What TypeScript Is with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "TS extends JS grammar; invalid JS is invalid TS (with narrow exceptions)."
    ],
    "commonQuestions": [
      "What is What TypeScript Is?",
      "When would you choose What TypeScript Is over alternatives?",
      "What is the classic What TypeScript Is interview trap?"
    ],
    "traps": [
      "Thinking TypeScript adds runtime type checks automatically. It does not — unless you write guards or use a validation library."
    ],
    "misconceptions": [
      "Large JS codebases needed a way to document contracts, catch typos before runtime, and refactor safely. Microsoft built TS as an incremental layer so teams could adopt typing without abandoning the JS ecosystem."
    ],
    "strongSignals": [
      "Uses What TypeScript Is to remove invalid states, not just document them."
    ]
  }
})
