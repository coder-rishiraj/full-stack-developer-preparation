import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "ESLint + TypeScript",
  "whatIsIt": "@typescript-eslint/parser feeds TS AST to ESLint; @typescript-eslint/eslint-plugin adds type-aware rules (no-floating-promises, no-misused-promises). Requires parserOptions.project pointing to tsconfig.",
  "whyExists": "Lint + types together catch async bugs types alone miss.",
  "mentalModel": "Spell-checker plus grammar checker for code.",
  "how": [
    "npm i -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin.",
    "parserOptions: { project: true } for typed lint rules.",
    "extends plugin:@typescript-eslint/recommended-type-checked.",
    "no-explicit-any, consistent-type-imports common rules.",
    "Run eslint in CI alongside tsc --noEmit."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Typed lint without project — rules silently downgrade or error.",
    "variant": "warning"
  },
  "example": "// .eslintrc.cjs excerpt\n// parser: '@typescript-eslint/parser',\n// plugins: ['@typescript-eslint'],\n// extends: ['plugin:@typescript-eslint/recommended']\nasync function load() { return 1; }\nvoid load(); // no-floating-promises may require void or await\nconsole.log(load('demo'));\n// Strict mode catches misuse at compile time",
  "exampleCaption": "Type-aware ESLint catches floating promises",
  "internals": [
    "Type checker program shared per eslint run — slower than plain eslint.",
    "eslint-config-prettier avoids format rule conflicts.",
    "Flat config eslint 9+ uses typescript-eslint similarly."
  ],
  "takeaways": [
    "npm i -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin.",
    "parserOptions: { project: true } for typed lint rules.",
    "Typed lint without project — rules silently downgrade or error.",
    "Type checker program shared per eslint run — slower than plain eslint."
  ],
  "revision": [
    "ESLint + TypeScript: Spell-checker plus grammar checker for code.",
    "npm i -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin.",
    "parserOptions: { project: true } for typed lint rules.",
    "extends plugin:@typescript-eslint/recommended-type-checked.",
    "Trap: Typed lint without project — rules silently downgrade or error."
  ],
  "flashcards": [
    [
      "ESLint + TypeScript",
      "@typescript-eslint/parser feeds TS AST to ESLint; @typescript-eslint/eslint-plugin adds type-aware rules (no-floating-promises, no-misused-promises)."
    ],
    [
      "Mental model",
      "Spell-checker plus grammar checker for code."
    ],
    [
      "Common trap",
      "Typed lint without project — rules silently downgrade or error."
    ],
    [
      "npm i -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin.",
      "parserOptions: { project: true } for typed lint rules."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is ESLint + TypeScript in TypeScript and when do you use it?",
      "answerHint": "@typescript-eslint/parser feeds TS AST to ESLint; @typescript-eslint/eslint-plugin adds type-aware rules (no-floating-promises, no-misused-promises). Requires parserOptions.project pointing to tsconfig."
    },
    {
      "level": "intermediate",
      "question": "Explain ESLint + TypeScript with a code example and one pitfall.",
      "answerHint": "npm i -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin. parserOptions: { project: true } for typed lint rules. extends plugin:@typescript-eslint/recommended-type-checked. no-explicit-any, consistent-type-imports common rules. Run eslint in CI alongside tsc --noEmit. Pitfall: Typed lint without project — rules silently downgrade or error."
    },
    {
      "level": "advanced",
      "question": "How would you explain ESLint + TypeScript in a senior frontend interview?",
      "answerHint": "Type checker program shared per eslint run — slower than plain eslint. eslint-config-prettier avoids format rule conflicts. Flat config eslint 9+ uses typescript-eslint similarly. // .eslintrc.cjs excerpt\n// parser: '@typescript-eslint/parser',\n// plugins: ['@typescript-eslint'],\n// extends: ['plugi"
    }
  ],
  "pitfalls": [
    "Typed lint without project — rules silently downgrade or error."
  ],
  "interview": {
    "expectations": [
      "Explain ESLint + TypeScript with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "Type checker program shared per eslint run — slower than plain eslint."
    ],
    "commonQuestions": [
      "What is ESLint + TypeScript?",
      "When would you choose ESLint + TypeScript over alternatives?",
      "What is the classic ESLint + TypeScript interview trap?"
    ],
    "traps": [
      "Typed lint without project — rules silently downgrade or error."
    ],
    "misconceptions": [
      "Lint + types together catch async bugs types alone miss."
    ],
    "strongSignals": [
      "Uses ESLint + TypeScript to remove invalid states, not just document them."
    ]
  }
})
