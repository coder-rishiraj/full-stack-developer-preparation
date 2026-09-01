import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Readonly Tuples",
  "whatIsIt": "readonly [string, number] prevents length changes and index assignment while allowing read access. as const on array literals produces deeply readonly tuple types with literal members.",
  "whyExists": "Immutable pairs and config rows benefit from readonly tuples in APIs.",
  "mentalModel": "Tuple under glass — indices fixed and read-only.",
  "how": [
    "const config = [\"api\", 443] as const → readonly [\"api\", 443].",
    "Readonly tuple assignable from mutable counterpart.",
    "Map Object.entries with typed entries helper.",
    "Use satisfies for tuple shape without widening.",
    "Spread readonly tuple into new mutable array when needed."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Mutating as const array — compile error; clone first if mutation needed.",
    "variant": "warning"
  },
  "example": "const endpoint = ['https://api.example.com', 443] as const;\ntype Endpoint = typeof endpoint; // readonly [\"https://api.example.com\", 443]\nfunction host(e: readonly [string, number]) { return e[0]; }\nconsole.log(host(endpoint));\nconst __typed: Endpoint = {} as Endpoint;\nconsole.log(\"void __typed;\");\nconsole.log(\"export type { Endpoint }\");\n// type Endpoint = typeof endpoint; // readonly [\"https://api.example.com\", 443] narrows allowed values",
  "exampleCaption": "as const preserves readonly literal tuple",
  "internals": [
    "readonly modifier on each element in inferred as const.",
    "Tuple labels are compile-time only — erased in emit.",
    "ReadonlyArray is wider than readonly tuple."
  ],
  "takeaways": [
    "const config = [\"api\", 443] as const → readonly [\"api\", 443].",
    "Readonly tuple assignable from mutable counterpart.",
    "Mutating as const array — compile error; clone first if mutation needed.",
    "readonly modifier on each element in inferred as const."
  ],
  "revision": [
    "Readonly Tuples: Tuple under glass — indices fixed and read-only.",
    "const config = [\"api\", 443] as const → readonly [\"api\", 443].",
    "Readonly tuple assignable from mutable counterpart.",
    "Map Object.entries with typed entries helper.",
    "Trap: Mutating as const array — compile error; clone first if mutation needed."
  ],
  "flashcards": [
    [
      "Readonly Tuples",
      "readonly [string, number] prevents length changes and index assignment while allowing read access."
    ],
    [
      "Mental model",
      "Tuple under glass — indices fixed and read-only."
    ],
    [
      "Common trap",
      "Mutating as const array — compile error; clone first if mutation needed."
    ],
    [
      "const config = [\"api\", 443] as const → readonly [\"api\", 443].",
      "Readonly tuple assignable from mutable counterpart."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Readonly Tuples in TypeScript and when do you use it?",
      "answerHint": "readonly [string, number] prevents length changes and index assignment while allowing read access. as const on array literals produces deeply readonly tuple types with literal members."
    },
    {
      "level": "intermediate",
      "question": "Explain Readonly Tuples with a code example and one pitfall.",
      "answerHint": "const config = [\"api\", 443] as const → readonly [\"api\", 443]. Readonly tuple assignable from mutable counterpart. Map Object.entries with typed entries helper. Use satisfies for tuple shape without widening. Spread readonly tuple into new mutable array when needed. Pitfall: Mutating as const array — compile error; clone first if mutation needed."
    },
    {
      "level": "advanced",
      "question": "How would you explain Readonly Tuples in a senior frontend interview?",
      "answerHint": "readonly modifier on each element in inferred as const. Tuple labels are compile-time only — erased in emit. ReadonlyArray is wider than readonly tuple. const endpoint = ['https://api.example.com', 443] as const;\ntype Endpoint = typeof endpoint; // readonly [\"https://api.e"
    }
  ],
  "pitfalls": [
    "Mutating as const array — compile error; clone first if mutation needed."
  ],
  "interview": {
    "expectations": [
      "Explain Readonly Tuples with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "readonly modifier on each element in inferred as const."
    ],
    "commonQuestions": [
      "What is Readonly Tuples?",
      "When would you choose Readonly Tuples over alternatives?",
      "What is the classic Readonly Tuples interview trap?"
    ],
    "traps": [
      "Mutating as const array — compile error; clone first if mutation needed."
    ],
    "misconceptions": [
      "Immutable pairs and config rows benefit from readonly tuples in APIs."
    ],
    "strongSignals": [
      "Uses Readonly Tuples to remove invalid states, not just document them."
    ]
  }
})
