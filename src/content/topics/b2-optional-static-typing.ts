import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Optional Static Typing",
  "whatIsIt": "TypeScript's type annotations are optional: untyped variables default to inferred types, and JavaScript-style code often needs zero annotations. You add types where they help — public APIs, tricky branches, generic utilities. The compiler fills gaps via inference. This gradual style lets files coexist typed and untyped in one project.",
  "whyExists": "Mandatory typing would repel JS developers and block incremental adoption. Optional typing meets teams where they are.",
  "mentalModel": "Training wheels you can attach per wheel. Ride without them on flat paths; add them on hills.",
  "how": [
    "Let inference handle obvious locals: const n = 42 → number.",
    "Annotate function parameters consumers call.",
    "Use explicit returns on exported functions for stable contracts.",
    "strictNullChecks forces you to handle null/undefined deliberately.",
    "checkJs types .js files via JSDoc when TS files are not ready."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Assuming \"no annotations = any\" under strict — inference is smart, but untyped params error.",
    "variant": "warning"
  },
  "example": "function double(x) { return x * 2; }        // JS style — inferred any (noImplicitAny errors)\nfunction triple(x: number) { return x * 3; } // explicit param\nconst nums = [1, 2, 3].map(double);           // annotate double if needed\nconsole.log(triple('demo'));\n// Strict mode catches misuse at compile time\n// Annotations are erased — zero runtime overhead\n// Enable \"strict\": true in tsconfig.json\n// Hover types in your editor to inspect inference",
  "exampleCaption": "Inference works until noImplicitAny demands annotations",
  "internals": [
    "Contextual typing infers callback params from usage site.",
    "Best common type merges array literals.",
    "Implicit any is blocked by noImplicitAny in strict projects."
  ],
  "takeaways": [
    "Let inference handle obvious locals: const n = 42 → number.",
    "Annotate function parameters consumers call.",
    "Assuming \"no annotations = any\" under strict — inference is smart, but untyped params error.",
    "Contextual typing infers callback params from usage site."
  ],
  "revision": [
    "Optional Static Typing: Training wheels you can attach per wheel. Ride without them on flat paths; add them on hills.",
    "Let inference handle obvious locals: const n = 42 → number.",
    "Annotate function parameters consumers call.",
    "Use explicit returns on exported functions for stable contracts.",
    "Trap: Assuming \"no annotations = any\" under strict — inference is smart, but untyped params error."
  ],
  "flashcards": [
    [
      "Optional Static Typing",
      "TypeScript's type annotations are optional: untyped variables default to inferred types, and JavaScript-style code often needs zero annotations."
    ],
    [
      "Mental model",
      "Training wheels you can attach per wheel. Ride without them on flat paths; add them on hills."
    ],
    [
      "Common trap",
      "Assuming \"no annotations = any\" under strict — inference is smart, but untyped params error."
    ],
    [
      "Let inference handle obvious locals: const n = 42 → number.",
      "Annotate function parameters consumers call."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Optional Static Typing in TypeScript and when do you use it?",
      "answerHint": "TypeScript's type annotations are optional: untyped variables default to inferred types, and JavaScript-style code often needs zero annotations. You add types where they help — public APIs, tricky branches, generic utilities. The compiler fills gaps via inference. This gradual style lets files coexist typed and untyped in one project."
    },
    {
      "level": "intermediate",
      "question": "Explain Optional Static Typing with a code example and one pitfall.",
      "answerHint": "Let inference handle obvious locals: const n = 42 → number. Annotate function parameters consumers call. Use explicit returns on exported functions for stable contracts. strictNullChecks forces you to handle null/undefined deliberately. checkJs types .js files via JSDoc when TS files are not ready. Pitfall: Assuming \"no annotations = any\" under strict — inference is smart, but untyped params error."
    },
    {
      "level": "advanced",
      "question": "How would you explain Optional Static Typing in a senior frontend interview?",
      "answerHint": "Contextual typing infers callback params from usage site. Best common type merges array literals. Implicit any is blocked by noImplicitAny in strict projects. function double(x) { return x * 2; }        // JS style — inferred any (noImplicitAny errors)\nfunction triple(x: number)"
    }
  ],
  "pitfalls": [
    "Assuming \"no annotations = any\" under strict — inference is smart, but untyped params error."
  ],
  "interview": {
    "expectations": [
      "Explain Optional Static Typing with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "Contextual typing infers callback params from usage site."
    ],
    "commonQuestions": [
      "What is Optional Static Typing?",
      "When would you choose Optional Static Typing over alternatives?",
      "What is the classic Optional Static Typing interview trap?"
    ],
    "traps": [
      "Assuming \"no annotations = any\" under strict — inference is smart, but untyped params error."
    ],
    "misconceptions": [
      "Mandatory typing would repel JS developers and block incremental adoption. Optional typing meets teams where they are."
    ],
    "strongSignals": [
      "Uses Optional Static Typing to remove invalid states, not just document them."
    ]
  }
})
