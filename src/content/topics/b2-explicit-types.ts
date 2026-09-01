import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Explicit Types",
  "whatIsIt": "Explicit types are annotations you write on variables, parameters, and returns: let x: number, function f(n: string): boolean. They document intent and stabilize public APIs when inference would be too wide or fragile.",
  "whyExists": "Consumers of your functions cannot see inference — explicit signatures are the contract.",
  "mentalModel": "Explicit types are name tags on boxes crossing warehouse doors.",
  "how": [
    "Export function signatures explicitly.",
    "Annotate when inference widens: [] → never[] without context.",
    "Use satisfies when you want checking without widening.",
    "Class fields and React props benefit from explicit shapes.",
    "Avoid redundant annotations on obvious const literals."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Over-annotating every local — noisy and fights inference.",
    "variant": "warning"
  },
  "example": "export function parsePort(value: string): number {\n  const n = Number(value);\n  if (!Number.isInteger(n) || n < 1 || n > 65535) throw new Error('bad port');\n  return n;\n}\nconsole.log(parsePort('demo'));\n// Strict mode catches misuse at compile time\n// Annotations are erased — zero runtime overhead",
  "exampleCaption": "Exported helper with explicit param and return",
  "internals": [
    "Explicit annotations are checked targets for assignability.",
    "Widening happens when annotation is wider than initializer.",
    "Type assertions are not explicit types — they override checking."
  ],
  "takeaways": [
    "Export function signatures explicitly.",
    "Annotate when inference widens: [] → never[] without context.",
    "Over-annotating every local — noisy and fights inference.",
    "Explicit annotations are checked targets for assignability."
  ],
  "revision": [
    "Explicit Types: Explicit types are name tags on boxes crossing warehouse doors.",
    "Export function signatures explicitly.",
    "Annotate when inference widens: [] → never[] without context.",
    "Use satisfies when you want checking without widening.",
    "Trap: Over-annotating every local — noisy and fights inference."
  ],
  "flashcards": [
    [
      "Explicit Types",
      "Explicit types are annotations you write on variables, parameters, and returns: let x: number, function f(n: string): boolean."
    ],
    [
      "Mental model",
      "Explicit types are name tags on boxes crossing warehouse doors."
    ],
    [
      "Common trap",
      "Over-annotating every local — noisy and fights inference."
    ],
    [
      "Export function signatures explicitly.",
      "Annotate when inference widens: [] → never[] without context."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Explicit Types in TypeScript and when do you use it?",
      "answerHint": "Explicit types are annotations you write on variables, parameters, and returns: let x: number, function f(n: string): boolean. They document intent and stabilize public APIs when inference would be too wide or fragile."
    },
    {
      "level": "intermediate",
      "question": "Explain Explicit Types with a code example and one pitfall.",
      "answerHint": "Export function signatures explicitly. Annotate when inference widens: [] → never[] without context. Use satisfies when you want checking without widening. Class fields and React props benefit from explicit shapes. Avoid redundant annotations on obvious const literals. Pitfall: Over-annotating every local — noisy and fights inference."
    },
    {
      "level": "advanced",
      "question": "How would you explain Explicit Types in a senior frontend interview?",
      "answerHint": "Explicit annotations are checked targets for assignability. Widening happens when annotation is wider than initializer. Type assertions are not explicit types — they override checking. export function parsePort(value: string): number {\n  const n = Number(value);\n  if (!Number.isInteger(n) || n < 1 || n >"
    }
  ],
  "pitfalls": [
    "Over-annotating every local — noisy and fights inference."
  ],
  "interview": {
    "expectations": [
      "Explain Explicit Types with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "Explicit annotations are checked targets for assignability."
    ],
    "commonQuestions": [
      "What is Explicit Types?",
      "When would you choose Explicit Types over alternatives?",
      "What is the classic Explicit Types interview trap?"
    ],
    "traps": [
      "Over-annotating every local — noisy and fights inference."
    ],
    "misconceptions": [
      "Consumers of your functions cannot see inference — explicit signatures are the contract."
    ],
    "strongSignals": [
      "Uses Explicit Types to remove invalid states, not just document them."
    ]
  }
})
