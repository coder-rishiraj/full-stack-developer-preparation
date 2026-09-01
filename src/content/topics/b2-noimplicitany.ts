import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "noImplicitAny",
  "whatIsIt": "noImplicitAny errors when TS would infer any — typically untyped parameters and implicit any variables. Part of strict. Forces annotations or inference context.",
  "whyExists": "any parameters silently infect return types — blocking implicit any closes the main leak.",
  "mentalModel": "No silent any — name every unknown shape.",
  "how": [
    "Add param types: function f(x: number).",
    "Use unknown for truly unknown JSON.",
    "Enable in tsconfig strict bundle.",
    "Legacy allowJs: use @param JSDoc in .js files.",
    "eslint no-explicit-any complements this."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Adding : any to silence — defeats purpose of flag.",
    "variant": "warning"
  },
  "example": "// Error under noImplicitAny:\n// function double(x) { return x * 2; }\nfunction double(x: number) { return x * 2; }\nconsole.log(double(4));\nconsole.log(double('demo'));\n// TypeScript validates this file before emit\n// Strict mode catches misuse at compile time\n// Annotations are erased — zero runtime overhead",
  "exampleCaption": "Implicit any on x blocked — annotate number",
  "internals": [
    "Contextual typing can save annotations on callbacks.",
    "Implies any from untyped third-party without @types.",
    "checkJs applies similar rules in JavaScript files."
  ],
  "takeaways": [
    "Add param types: function f(x: number).",
    "Use unknown for truly unknown JSON.",
    "Adding : any to silence — defeats purpose of flag.",
    "Contextual typing can save annotations on callbacks."
  ],
  "revision": [
    "noImplicitAny: No silent any — name every unknown shape.",
    "Add param types: function f(x: number).",
    "Use unknown for truly unknown JSON.",
    "Enable in tsconfig strict bundle.",
    "Trap: Adding : any to silence — defeats purpose of flag."
  ],
  "flashcards": [
    [
      "noImplicitAny",
      "noImplicitAny errors when TS would infer any — typically untyped parameters and implicit any variables."
    ],
    [
      "Mental model",
      "No silent any — name every unknown shape."
    ],
    [
      "Common trap",
      "Adding : any to silence — defeats purpose of flag."
    ],
    [
      "Add param types: function f(x: number).",
      "Use unknown for truly unknown JSON."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is noImplicitAny in TypeScript and when do you use it?",
      "answerHint": "noImplicitAny errors when TS would infer any — typically untyped parameters and implicit any variables. Part of strict. Forces annotations or inference context."
    },
    {
      "level": "intermediate",
      "question": "Explain noImplicitAny with a code example and one pitfall.",
      "answerHint": "Add param types: function f(x: number). Use unknown for truly unknown JSON. Enable in tsconfig strict bundle. Legacy allowJs: use @param JSDoc in .js files. eslint no-explicit-any complements this. Pitfall: Adding : any to silence — defeats purpose of flag."
    },
    {
      "level": "advanced",
      "question": "How would you explain noImplicitAny in a senior frontend interview?",
      "answerHint": "Contextual typing can save annotations on callbacks. Implies any from untyped third-party without @types. checkJs applies similar rules in JavaScript files. // Error under noImplicitAny:\n// function double(x) { return x * 2; }\nfunction double(x: number) { return x * 2; }\nconso"
    }
  ],
  "pitfalls": [
    "Adding : any to silence — defeats purpose of flag."
  ],
  "interview": {
    "expectations": [
      "Explain noImplicitAny with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "Contextual typing can save annotations on callbacks."
    ],
    "commonQuestions": [
      "What is noImplicitAny?",
      "When would you choose noImplicitAny over alternatives?",
      "What is the classic noImplicitAny interview trap?"
    ],
    "traps": [
      "Adding : any to silence — defeats purpose of flag."
    ],
    "misconceptions": [
      "any parameters silently infect return types — blocking implicit any closes the main leak."
    ],
    "strongSignals": [
      "Uses noImplicitAny to remove invalid states, not just document them."
    ]
  }
})
