import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Definitely Typed (@types)",
  "whatIsIt": "DefinitelyTyped (@types scope on npm) hosts community .d.ts for JavaScript libraries. Install @types/node, @types/react alongside packages. Version @types/react should align with react major.",
  "whyExists": "Most npm JS lacks built-in types — DT fills the gap.",
  "mentalModel": "Crowdsourced type menus for untyped restaurants.",
  "how": [
    "npm i -D @types/lodash @types/node.",
    "Match major versions to runtime library.",
    "types[] in tsconfig limits auto inclusion if needed.",
    "Contribute fixes via DefinitelyTyped GitHub.",
    "Prefer packages shipping own types when available."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Missing @types — implicit any on imports; wrong @types version — weird errors.",
    "variant": "warning"
  },
  "example": "import _ from 'lodash';\n// @types/lodash enables typed _.chunk\nconst parts = _.chunk([1, 2, 3, 4], 2);\nconsole.log(parts);\nconsole.log(\"void parts;\");\n// TypeScript validates this file before emit\n// Strict mode catches misuse at compile time\n// Annotations are erased — zero runtime overhead",
  "exampleCaption": "@types/lodash types chunk return",
  "internals": [
    "DT uses export = for CJS modules sometimes.",
    "typings field deprecated for types in package.json.",
    "skipLibCheck skips type checking of .d.ts for speed."
  ],
  "takeaways": [
    "npm i -D @types/lodash @types/node.",
    "Match major versions to runtime library.",
    "Missing @types — implicit any on imports; wrong @types version — weird errors.",
    "DT uses export = for CJS modules sometimes."
  ],
  "revision": [
    "Definitely Typed (@types): Crowdsourced type menus for untyped restaurants.",
    "npm i -D @types/lodash @types/node.",
    "Match major versions to runtime library.",
    "types[] in tsconfig limits auto inclusion if needed.",
    "Trap: Missing @types — implicit any on imports; wrong @types version — weird errors."
  ],
  "flashcards": [
    [
      "Definitely Typed (@types)",
      "DefinitelyTyped (@types scope on npm) hosts community .d.ts for JavaScript libraries."
    ],
    [
      "Mental model",
      "Crowdsourced type menus for untyped restaurants."
    ],
    [
      "Common trap",
      "Missing @types — implicit any on imports; wrong @types version — weird errors."
    ],
    [
      "npm i -D @types/lodash @types/node.",
      "Match major versions to runtime library."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Definitely Typed (@types) in TypeScript and when do you use it?",
      "answerHint": "DefinitelyTyped (@types scope on npm) hosts community .d.ts for JavaScript libraries. Install @types/node, @types/react alongside packages. Version @types/react should align with react major."
    },
    {
      "level": "intermediate",
      "question": "Explain Definitely Typed (@types) with a code example and one pitfall.",
      "answerHint": "npm i -D @types/lodash @types/node. Match major versions to runtime library. types[] in tsconfig limits auto inclusion if needed. Contribute fixes via DefinitelyTyped GitHub. Prefer packages shipping own types when available. Pitfall: Missing @types — implicit any on imports; wrong @types version — weird errors."
    },
    {
      "level": "advanced",
      "question": "How would you explain Definitely Typed (@types) in a senior frontend interview?",
      "answerHint": "DT uses export = for CJS modules sometimes. typings field deprecated for types in package.json. skipLibCheck skips type checking of .d.ts for speed. import _ from 'lodash';\n// @types/lodash enables typed _.chunk\nconst parts = _.chunk([1, 2, 3, 4], 2);\nconsole.log(parts"
    }
  ],
  "pitfalls": [
    "Missing @types — implicit any on imports; wrong @types version — weird errors."
  ],
  "interview": {
    "expectations": [
      "Explain Definitely Typed (@types) with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "DT uses export = for CJS modules sometimes."
    ],
    "commonQuestions": [
      "What is Definitely Typed (@types)?",
      "When would you choose Definitely Typed (@types) over alternatives?",
      "What is the classic Definitely Typed (@types) interview trap?"
    ],
    "traps": [
      "Missing @types — implicit any on imports; wrong @types version — weird errors."
    ],
    "misconceptions": [
      "Most npm JS lacks built-in types — DT fills the gap."
    ],
    "strongSignals": [
      "Uses Definitely Typed (@types) to remove invalid states, not just document them."
    ]
  }
})
