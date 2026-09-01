import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Default vs Named Exports",
  "whatIsIt": "A module may have many named exports and at most one default. Default is the ‘main’ value; import foo from gets it. Named need braces. export default function name() still creates a local name. Mixing: import foo, { bar }. Interop with CJS default is the .default pitfall in bundlers.",
  "whyExists": "CommonJS modules.exports = fn was one value. Default export maps to that mental model; named exports map to a bag of tools.",
  "mentalModel": "Named = labeled drawers. Default = the package on the counter. You can use both in one file.",
  "how": [
    "Libraries: prefer named for better tree shaking and rename.",
    "Apps: either is fine if consistent.",
    "Do not default-export and also forget people will import it wrong.",
    "TypeScript esModuleInterop exists because of this mismatch."
  ],
  "callout": {
    "title": "Watch for",
    "text": "import { greet } when it was export default greet — undefined / syntax error depending on interop.",
    "variant": "warning"
  },
  "example": "export default function greet(n) { return 'hi ' + n; }\nexport const VERSION = 1;\nimport greet, { VERSION } from './g.js';\nimport * as g from './g.js';\nconsole.log(greet('Ada'), VERSION, g.default('Ada'));\n",
  "exampleCaption": "default + named; namespace .default",
  "internals": [
    "default is a name in the export table, not a keyword binding unless you export default function name.",
    "CJS interop synthesizes a default in ESM importers of CJS.",
    "Tree shaking of default is all-or-nothing if the bundler cannot see properties."
  ],
  "takeaways": [
    "Libraries: prefer named for better tree shaking and rename.",
    "Apps: either is fine if consistent.",
    "import { greet } when it was export default greet — undefined / syntax error depending on interop.",
    "default is a name in the export table, not a keyword binding unless you export default function name."
  ],
  "revision": [
    "Default vs Named Exports: Named = labeled drawers. Default = the package on the counter. You can use both in one file.",
    "Libraries: prefer named for better tree shaking and rename.",
    "Apps: either is fine if consistent.",
    "Do not default-export and also forget people will import it wrong.",
    "Trap: import { greet } when it was export default greet — undefined / syntax error depending on interop."
  ],
  "flashcards": [
    [
      "Default vs Named Exports",
      "A module may have many named exports and at most one default."
    ],
    [
      "Mental model",
      "Named = labeled drawers. Default = the package on the counter. You can use both in one file."
    ],
    [
      "Common trap",
      "import { greet } when it was export default greet — undefined / syntax error depending on interop."
    ],
    [
      "Libraries: prefer named for better tree shaking and rename.",
      "Apps: either is fine if consistent."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Default vs Named Exports and where does a beginner first see it?",
      "answerHint": "A module may have many named exports and at most one default. Default is the ‘main’ value; import foo from gets it. Named need braces. export default function name() still creates a local name. Mixing: import foo, { bar }. Interop with CJS default is the .default pitfall in bundlers."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Default vs Named Exports works and name the main pitfall.",
      "answerHint": "Libraries: prefer named for better tree shaking and rename. Apps: either is fine if consistent. Do not default-export and also forget people will import it wrong. TypeScript esModuleInterop exists because of this mismatch. Pitfall: import { greet } when it was export default greet — undefined / syntax error depending on interop."
    },
    {
      "level": "advanced",
      "question": "How would you explain Default vs Named Exports at an interview, including engine/spec details?",
      "answerHint": "default is a name in the export table, not a keyword binding unless you export default function name. CJS interop synthesizes a default in ESM importers of CJS. Tree shaking of default is all-or-nothing if the bundler cannot see properties."
    }
  ],
  "pitfalls": [
    "import { greet } when it was export default greet — undefined / syntax error depending on interop.",
    "TypeScript esModuleInterop exists because of this mismatch."
  ],
  "interview": {
    "expectations": [
      "Explain Default vs Named Exports without mixing it up with a nearby B1.34 — Modules topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "default is a name in the export table, not a keyword binding unless you export default function name."
    ],
    "commonQuestions": [
      "What is Default vs Named Exports?",
      "Why does JavaScript default vs named exports behave this way?",
      "What is the classic Default vs Named Exports interview trap?"
    ],
    "traps": [
      "import { greet } when it was export default greet — undefined / syntax error depending on interop."
    ],
    "misconceptions": [
      "CommonJS modules.exports = fn was one value. Default export maps to that mental model; named exports map to a bag of tools."
    ],
    "strongSignals": [
      "Separates Default vs Named Exports from lookalike APIs and can draw the mental model."
    ]
  }
})
