import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Namespaces",
  "whatIsIt": "Namespaces (namespace Foo { }) group types and values pre-ES modules. Can merge across files. Largely replaced by ES modules. Still seen in legacy @types and declaration merging patterns.",
  "whyExists": "Historical TS feature — recognize in old code; do not use in new apps.",
  "mentalModel": "Folder drawer labeled namespace — prefer ES module files now.",
  "how": [
    "Read namespace in DefinitelyTyped legacy defs.",
    "export namespace for value + type together historically.",
    "Prefer module + export in new projects.",
    "namespace global augmentation rare alternative.",
    "Do not mix namespace with bundler tree-shaking expectations."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Creating new namespaces in 2024 app code — use modules instead.",
    "variant": "warning"
  },
  "example": "// Legacy pattern — prefer ES modules\nexport namespace Math2 {\n  export const PI = 3.14;\n  export function round(n: number) { return Math.round(n); }\n}\nconsole.log(Math2.round(Math2.PI));\nconsole.log(round('demo'));\n// TypeScript validates this file before emit",
  "exampleCaption": "Namespace exports value and function together",
  "internals": [
    "Namespace emits IIFE object in some module settings.",
    "Can merge namespace with function (value+type).",
    "Module syntax is tree-shakeable; namespace often is not."
  ],
  "takeaways": [
    "Read namespace in DefinitelyTyped legacy defs.",
    "export namespace for value + type together historically.",
    "Creating new namespaces in 2024 app code — use modules instead.",
    "Namespace emits IIFE object in some module settings."
  ],
  "revision": [
    "Namespaces: Folder drawer labeled namespace — prefer ES module files now.",
    "Read namespace in DefinitelyTyped legacy defs.",
    "export namespace for value + type together historically.",
    "Prefer module + export in new projects.",
    "Trap: Creating new namespaces in 2024 app code — use modules instead."
  ],
  "flashcards": [
    [
      "Namespaces",
      "Namespaces (namespace Foo { }) group types and values pre-ES modules."
    ],
    [
      "Mental model",
      "Folder drawer labeled namespace — prefer ES module files now."
    ],
    [
      "Common trap",
      "Creating new namespaces in 2024 app code — use modules instead."
    ],
    [
      "Read namespace in DefinitelyTyped legacy defs.",
      "export namespace for value + type together historically."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Namespaces in TypeScript and when do you use it?",
      "answerHint": "Namespaces (namespace Foo { }) group types and values pre-ES modules. Can merge across files. Largely replaced by ES modules. Still seen in legacy @types and declaration merging patterns."
    },
    {
      "level": "intermediate",
      "question": "Explain Namespaces with a code example and one pitfall.",
      "answerHint": "Read namespace in DefinitelyTyped legacy defs. export namespace for value + type together historically. Prefer module + export in new projects. namespace global augmentation rare alternative. Do not mix namespace with bundler tree-shaking expectations. Pitfall: Creating new namespaces in 2024 app code — use modules instead."
    },
    {
      "level": "advanced",
      "question": "How would you explain Namespaces in a senior frontend interview?",
      "answerHint": "Namespace emits IIFE object in some module settings. Can merge namespace with function (value+type). Module syntax is tree-shakeable; namespace often is not. // Legacy pattern — prefer ES modules\nexport namespace Math2 {\n  export const PI = 3.14;\n  export function round(n: numb"
    }
  ],
  "pitfalls": [
    "Creating new namespaces in 2024 app code — use modules instead."
  ],
  "interview": {
    "expectations": [
      "Explain Namespaces with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "Namespace emits IIFE object in some module settings."
    ],
    "commonQuestions": [
      "What is Namespaces?",
      "When would you choose Namespaces over alternatives?",
      "What is the classic Namespaces interview trap?"
    ],
    "traps": [
      "Creating new namespaces in 2024 app code — use modules instead."
    ],
    "misconceptions": [
      "Historical TS feature — recognize in old code; do not use in new apps."
    ],
    "strongSignals": [
      "Uses Namespaces to remove invalid states, not just document them."
    ]
  }
})
