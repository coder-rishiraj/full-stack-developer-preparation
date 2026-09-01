import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "export / import",
  "whatIsIt": "export function f{} / export const x / export { x as y } / export default. import { x } / import { x as y } / import * as ns / import def from. Side-effect import: import './polyfill.js'. Static import is hoisted and analyzed at load; paths are string literals, not computed (except import()).",
  "whyExists": "Static graph analysis enables tree shaking and early errors (missing export). Dynamic paths wait for import().",
  "mentalModel": "Static import is a compile-time wiring diagram. You cannot compute the path in a static import statement.",
  "how": [
    "Named exports for libraries (refactor-friendly).",
    "Default for ‘the’ function of a small module if the team likes it.",
    "Re-export: export { x } from './m.js'.",
    "Do not mix CJS require in ESM without interop."
  ],
  "callout": {
    "title": "Watch for",
    "text": "import { default as foo } vs import foo — both work; export default { a } is one object, not named a.",
    "variant": "warning"
  },
  "example": "export const PI = 3.14;\nexport function area(r) { return PI * r * r; }\nexport { area as circleArea };\nimport { area, PI } from './shapes.js';\nimport * as shapes from './shapes.js';\nconsole.log(area(1), shapes.PI);\n",
  "exampleCaption": "Named exports, alias, namespace import",
  "internals": [
    "ImportEntry / ExportEntry records in the module.",
    "Star exports copy export names at link time.",
    "Static import() is a different production (Call-like) vs ImportDeclaration."
  ],
  "takeaways": [
    "Named exports for libraries (refactor-friendly).",
    "Default for ‘the’ function of a small module if the team likes it.",
    "import { default as foo } vs import foo — both work; export default { a } is one object, not named a.",
    "ImportEntry / ExportEntry records in the module."
  ],
  "revision": [
    "export / import: Static import is a compile-time wiring diagram. You cannot compute the path in a static import statement.",
    "Named exports for libraries (refactor-friendly).",
    "Default for ‘the’ function of a small module if the team likes it.",
    "Re-export: export { x } from './m.js'.",
    "Trap: import { default as foo } vs import foo — both work; export default { a } is one object, not named a."
  ],
  "flashcards": [
    [
      "export / import",
      "export function f{} / export const x / export { x as y } / export default."
    ],
    [
      "Mental model",
      "Static import is a compile-time wiring diagram. You cannot compute the path in a static import statement."
    ],
    [
      "Common trap",
      "import { default as foo } vs import foo — both work; export default { a } is one object, not named a."
    ],
    [
      "Named exports for libraries (refactor-friendly).",
      "Default for ‘the’ function of a small module if the team likes it."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is export / import and where does a beginner first see it?",
      "answerHint": "export function f{} / export const x / export { x as y } / export default. import { x } / import { x as y } / import * as ns / import def from. Side-effect import: import './polyfill.js'. Static import is hoisted and analyzed at load; paths are string literals, not computed (except import())."
    },
    {
      "level": "intermediate",
      "question": "Walk through how export / import works and name the main pitfall.",
      "answerHint": "Named exports for libraries (refactor-friendly). Default for ‘the’ function of a small module if the team likes it. Re-export: export { x } from './m.js'. Do not mix CJS require in ESM without interop. Pitfall: import { default as foo } vs import foo — both work; export default { a } is one object, not named a."
    },
    {
      "level": "advanced",
      "question": "How would you explain export / import at an interview, including engine/spec details?",
      "answerHint": "ImportEntry / ExportEntry records in the module. Star exports copy export names at link time. Static import() is a different production (Call-like) vs ImportDeclaration."
    }
  ],
  "pitfalls": [
    "import { default as foo } vs import foo — both work; export default { a } is one object, not named a.",
    "Do not mix CJS require in ESM without interop."
  ],
  "interview": {
    "expectations": [
      "Explain export / import without mixing it up with a nearby B1.34 — Modules topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "ImportEntry / ExportEntry records in the module."
    ],
    "commonQuestions": [
      "What is export / import?",
      "Why does JavaScript export / import behave this way?",
      "What is the classic export / import interview trap?"
    ],
    "traps": [
      "import { default as foo } vs import foo — both work; export default { a } is one object, not named a."
    ],
    "misconceptions": [
      "Static graph analysis enables tree shaking and early errors (missing export). Dynamic paths wait for import()."
    ],
    "strongSignals": [
      "Separates export / import from lookalike APIs and can draw the mental model."
    ]
  }
})
