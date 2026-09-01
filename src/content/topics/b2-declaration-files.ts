import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Declaration Files (.d.ts)",
  "whatIsIt": ".d.ts files declare types without implementation — for JS libraries, ambient globals, and emitted types from tsc (declaration: true). Consumers get typings without source.",
  "whyExists": "Typed ecosystem depends on declaration files — @types/npm packages.",
  "mentalModel": "Menu describing dishes without kitchen recipes.",
  "how": [
    "declaration: true emits .d.ts alongside .js.",
    "declare module \"lib\" { export function fn(): void; }",
    "Place global.d.ts in include scope.",
    "DefinitelyTyped publishes @types/* packages.",
    "types field in package.json points to entry .d.ts."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Writing .d.ts manually out of sync with .js — use declaration emit or tests.",
    "variant": "warning"
  },
  "example": "// shapes.d.ts\nexport type Point = { x: number; y: number };\nexport declare function distance(a: Point, b: Point): number;\n// app.ts imports typed API from JS implementation + d.ts\nconsole.log(distance('demo'));\n// Strict mode catches misuse at compile time\n// Annotations are erased — zero runtime overhead\n// Enable \"strict\": true in tsconfig.json",
  "exampleCaption": "declare function exposes JS impl type surface",
  "internals": [
    "Ambient declarations not modules until export/import.",
    "stripInternal removes @internal from emit.",
    "bundler DTS generation (vite-plugin-dts) for libraries."
  ],
  "takeaways": [
    "declaration: true emits .d.ts alongside .js.",
    "declare module \"lib\" { export function fn(): void; }",
    "Writing .d.ts manually out of sync with .js — use declaration emit or tests.",
    "Ambient declarations not modules until export/import."
  ],
  "revision": [
    "Declaration Files (.d.ts): Menu describing dishes without kitchen recipes.",
    "declaration: true emits .d.ts alongside .js.",
    "declare module \"lib\" { export function fn(): void; }",
    "Place global.d.ts in include scope.",
    "Trap: Writing .d.ts manually out of sync with .js — use declaration emit or tests."
  ],
  "flashcards": [
    [
      "Declaration Files (.d.ts)",
      ".d.ts files declare types without implementation — for JS libraries, ambient globals, and emitted types from tsc (declaration: true)."
    ],
    [
      "Mental model",
      "Menu describing dishes without kitchen recipes."
    ],
    [
      "Common trap",
      "Writing .d.ts manually out of sync with .js — use declaration emit or tests."
    ],
    [
      "declaration: true emits .d.ts alongside .js.",
      "declare module \"lib\" { export function fn(): void; }"
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Declaration Files (.d.ts) in TypeScript and when do you use it?",
      "answerHint": ".d.ts files declare types without implementation — for JS libraries, ambient globals, and emitted types from tsc (declaration: true). Consumers get typings without source."
    },
    {
      "level": "intermediate",
      "question": "Explain Declaration Files (.d.ts) with a code example and one pitfall.",
      "answerHint": "declaration: true emits .d.ts alongside .js. declare module \"lib\" { export function fn(): void; } Place global.d.ts in include scope. DefinitelyTyped publishes @types/* packages. types field in package.json points to entry .d.ts. Pitfall: Writing .d.ts manually out of sync with .js — use declaration emit or tests."
    },
    {
      "level": "advanced",
      "question": "How would you explain Declaration Files (.d.ts) in a senior frontend interview?",
      "answerHint": "Ambient declarations not modules until export/import. stripInternal removes @internal from emit. bundler DTS generation (vite-plugin-dts) for libraries. // shapes.d.ts\nexport type Point = { x: number; y: number };\nexport declare function distance(a: Point, b: Point): numbe"
    }
  ],
  "pitfalls": [
    "Writing .d.ts manually out of sync with .js — use declaration emit or tests."
  ],
  "interview": {
    "expectations": [
      "Explain Declaration Files (.d.ts) with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "Ambient declarations not modules until export/import."
    ],
    "commonQuestions": [
      "What is Declaration Files (.d.ts)?",
      "When would you choose Declaration Files (.d.ts) over alternatives?",
      "What is the classic Declaration Files (.d.ts) interview trap?"
    ],
    "traps": [
      "Writing .d.ts manually out of sync with .js — use declaration emit or tests."
    ],
    "misconceptions": [
      "Typed ecosystem depends on declaration files — @types/npm packages."
    ],
    "strongSignals": [
      "Uses Declaration Files (.d.ts) to remove invalid states, not just document them."
    ]
  }
})
