import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "allowJs & checkJs",
  "whatIsIt": "allowJs includes .js files in compilation. checkJs type-checks them using JSDoc @param @returns @type. //@ts-check at top of file enables without project flag. Bridge for mixed codebases.",
  "whyExists": "Type safety before renaming every file to .ts.",
  "mentalModel": "JS files get spell-check via JSDoc annotations.",
  "how": [
    "tsconfig allowJs + checkJs.",
    "/** @param {string} name */ in .js functions.",
    "//@ts-nocheck disables per file (escape hatch).",
    "//@ts-expect-error documents known gap.",
    "Gradually convert checked JS to TS."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Wrong JSDoc lies to checker — runtime still breaks.",
    "variant": "warning"
  },
  "example": "// @ts-check\n/** @param {number} a @param {number} b @returns {number} */\nfunction add(a, b) { return a + b; }\nconsole.log(add(1, 2));\n/** @type {(n: number) => boolean} */\nconst isPositive = (n) => n > 0;\nconsole.log(isPositive(3));\nconsole.log(add('demo'));",
  "exampleCaption": "@ts-check + JSDoc types add in JS file",
  "internals": [
    "checkJs infers from JSDoc and usage.",
    "Import TS types into JS via import() JSDoc.",
    "allowJs required for JS in composite projects."
  ],
  "takeaways": [
    "tsconfig allowJs + checkJs.",
    "/** @param {string} name */ in .js functions.",
    "Wrong JSDoc lies to checker — runtime still breaks.",
    "checkJs infers from JSDoc and usage."
  ],
  "revision": [
    "allowJs & checkJs: JS files get spell-check via JSDoc annotations.",
    "tsconfig allowJs + checkJs.",
    "/** @param {string} name */ in .js functions.",
    "//@ts-nocheck disables per file (escape hatch).",
    "Trap: Wrong JSDoc lies to checker — runtime still breaks."
  ],
  "flashcards": [
    [
      "allowJs & checkJs",
      "allowJs includes .js files in compilation."
    ],
    [
      "Mental model",
      "JS files get spell-check via JSDoc annotations."
    ],
    [
      "Common trap",
      "Wrong JSDoc lies to checker — runtime still breaks."
    ],
    [
      "tsconfig allowJs + checkJs.",
      "/** @param {string} name */ in .js functions."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is allowJs & checkJs in TypeScript and when do you use it?",
      "answerHint": "allowJs includes .js files in compilation. checkJs type-checks them using JSDoc @param @returns @type. //@ts-check at top of file enables without project flag. Bridge for mixed codebases."
    },
    {
      "level": "intermediate",
      "question": "Explain allowJs & checkJs with a code example and one pitfall.",
      "answerHint": "tsconfig allowJs + checkJs. /** @param {string} name */ in .js functions. //@ts-nocheck disables per file (escape hatch). //@ts-expect-error documents known gap. Gradually convert checked JS to TS. Pitfall: Wrong JSDoc lies to checker — runtime still breaks."
    },
    {
      "level": "advanced",
      "question": "How would you explain allowJs & checkJs in a senior frontend interview?",
      "answerHint": "checkJs infers from JSDoc and usage. Import TS types into JS via import() JSDoc. allowJs required for JS in composite projects. // @ts-check\n/** @param {number} a @param {number} b @returns {number} */\nfunction add(a, b) { return a + b; }\nconsole.l"
    }
  ],
  "pitfalls": [
    "Wrong JSDoc lies to checker — runtime still breaks."
  ],
  "interview": {
    "expectations": [
      "Explain allowJs & checkJs with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "checkJs infers from JSDoc and usage."
    ],
    "commonQuestions": [
      "What is allowJs & checkJs?",
      "When would you choose allowJs & checkJs over alternatives?",
      "What is the classic allowJs & checkJs interview trap?"
    ],
    "traps": [
      "Wrong JSDoc lies to checker — runtime still breaks."
    ],
    "misconceptions": [
      "Type safety before renaming every file to .ts."
    ],
    "strongSignals": [
      "Uses allowJs & checkJs to remove invalid states, not just document them."
    ]
  }
})
