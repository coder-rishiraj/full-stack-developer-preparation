import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Module Augmentation",
  "whatIsIt": "Module augmentation adds types to existing module: declare module \"express-serve-static-core\" { interface Request { userId?: string } }. Enables typed plugins and middleware extensions.",
  "whyExists": "Third-party libs often need Request/Response fields — augmentation is the typed way.",
  "mentalModel": "Add drawer to existing library type cabinet.",
  "how": [
    "Import module once then declare module \"name\" { ... }.",
    "Augment only exported interfaces from target.",
    "Publish augmentation in @types package or local d.ts.",
    "Use namespace for value + type merge in UMD libs.",
    "Verify module path string matches resolution."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Wrong module string in declare module — augmentation silently not applied.",
    "variant": "warning"
  },
  "example": "import 'express';\ndeclare module 'express-serve-static-core' {\n  interface Request {\n    userId?: string;\n  }\n// middleware can set req.userId with typing\n// Strict mode catches misuse at compile time\n// Annotations are erased — zero runtime overhead",
  "exampleCaption": "Augment Express Request with userId",
  "internals": [
    "Augmentation merges with original interface exports.",
    "Ambient module declaration for untyped JS.",
    "types field in package.json guides augmentation discovery."
  ],
  "takeaways": [
    "Import module once then declare module \"name\" { ... }.",
    "Augment only exported interfaces from target.",
    "Wrong module string in declare module — augmentation silently not applied.",
    "Augmentation merges with original interface exports."
  ],
  "revision": [
    "Module Augmentation: Add drawer to existing library type cabinet.",
    "Import module once then declare module \"name\" { ... }.",
    "Augment only exported interfaces from target.",
    "Publish augmentation in @types package or local d.ts.",
    "Trap: Wrong module string in declare module — augmentation silently not applied."
  ],
  "flashcards": [
    [
      "Module Augmentation",
      "Module augmentation adds types to existing module: declare module \"express-serve-static-core\" { interface Request { userId?: string } }."
    ],
    [
      "Mental model",
      "Add drawer to existing library type cabinet."
    ],
    [
      "Common trap",
      "Wrong module string in declare module — augmentation silently not applied."
    ],
    [
      "Import module once then declare module \"name\" { ... }.",
      "Augment only exported interfaces from target."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Module Augmentation in TypeScript and when do you use it?",
      "answerHint": "Module augmentation adds types to existing module: declare module \"express-serve-static-core\" { interface Request { userId?: string } }. Enables typed plugins and middleware extensions."
    },
    {
      "level": "intermediate",
      "question": "Explain Module Augmentation with a code example and one pitfall.",
      "answerHint": "Import module once then declare module \"name\" { ... }. Augment only exported interfaces from target. Publish augmentation in @types package or local d.ts. Use namespace for value + type merge in UMD libs. Verify module path string matches resolution. Pitfall: Wrong module string in declare module — augmentation silently not applied."
    },
    {
      "level": "advanced",
      "question": "How would you explain Module Augmentation in a senior frontend interview?",
      "answerHint": "Augmentation merges with original interface exports. Ambient module declaration for untyped JS. types field in package.json guides augmentation discovery. import 'express';\ndeclare module 'express-serve-static-core' {\n  interface Request {\n    userId?: string;\n  }\n// middlew"
    }
  ],
  "pitfalls": [
    "Wrong module string in declare module — augmentation silently not applied."
  ],
  "interview": {
    "expectations": [
      "Explain Module Augmentation with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "Augmentation merges with original interface exports."
    ],
    "commonQuestions": [
      "What is Module Augmentation?",
      "When would you choose Module Augmentation over alternatives?",
      "What is the classic Module Augmentation interview trap?"
    ],
    "traps": [
      "Wrong module string in declare module — augmentation silently not applied."
    ],
    "misconceptions": [
      "Third-party libs often need Request/Response fields — augmentation is the typed way."
    ],
    "strongSignals": [
      "Uses Module Augmentation to remove invalid states, not just document them."
    ]
  }
})
