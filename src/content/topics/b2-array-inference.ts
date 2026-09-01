import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Array Type Inference",
  "whatIsIt": "Array literals infer element types from members: [1, \"a\"] → (string | number)[]. Empty [] infers never[] without context. Contextual typing from expected type guides inference: const f = (x: number[]) => x; f([]) ok as number[].",
  "whyExists": "Correct inference avoids redundant annotations while preventing never[] traps.",
  "mentalModel": "The compiler averages ingredients to guess stew flavor.",
  "how": [
    "Provide context: const ids: string[] = [].",
    "as const on tuples preserves literal types.",
    "map/filter preserve element types with generics.",
    "satisfies on config arrays keeps literal union.",
    "Explicit generic on empty: Array<number>()."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Pushing to const inferred array — readonly if as const; error on mutation.",
    "variant": "warning"
  },
  "example": "const mixed = [1, 'two'];              // (string | number)[]\nconst empty: number[] = [];\nconst tuple = [1, 'a'] as const;           // readonly [1, \"a\"]\nconst doubled = [1, 2, 3].map((n) => n * 2); // number[]\n// Strict mode catches misuse at compile time\n// Annotations are erased — zero runtime overhead\n// Enable \"strict\": true in tsconfig.json\n// Hover types in your editor to inspect inference",
  "exampleCaption": "Mixed literals widen; as const freezes tuple",
  "internals": [
    "Best common type widens numeric/string literals in arrays.",
    "Homogeneous array inference prefers single element type.",
    "NoImplicitAny affects untyped empty array in JS files."
  ],
  "takeaways": [
    "Provide context: const ids: string[] = [].",
    "as const on tuples preserves literal types.",
    "Pushing to const inferred array — readonly if as const; error on mutation.",
    "Best common type widens numeric/string literals in arrays."
  ],
  "revision": [
    "Array Type Inference: The compiler averages ingredients to guess stew flavor.",
    "Provide context: const ids: string[] = [].",
    "as const on tuples preserves literal types.",
    "map/filter preserve element types with generics.",
    "Trap: Pushing to const inferred array — readonly if as const; error on mutation."
  ],
  "flashcards": [
    [
      "Array Type Inference",
      "Array literals infer element types from members: [1, \"a\"] → (string | number)[]."
    ],
    [
      "Mental model",
      "The compiler averages ingredients to guess stew flavor."
    ],
    [
      "Common trap",
      "Pushing to const inferred array — readonly if as const; error on mutation."
    ],
    [
      "Provide context: const ids: string[] = [].",
      "as const on tuples preserves literal types."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Array Type Inference in TypeScript and when do you use it?",
      "answerHint": "Array literals infer element types from members: [1, \"a\"] → (string | number)[]. Empty [] infers never[] without context. Contextual typing from expected type guides inference: const f = (x: number[]) => x; f([]) ok as number[]."
    },
    {
      "level": "intermediate",
      "question": "Explain Array Type Inference with a code example and one pitfall.",
      "answerHint": "Provide context: const ids: string[] = []. as const on tuples preserves literal types. map/filter preserve element types with generics. satisfies on config arrays keeps literal union. Explicit generic on empty: Array<number>(). Pitfall: Pushing to const inferred array — readonly if as const; error on mutation."
    },
    {
      "level": "advanced",
      "question": "How would you explain Array Type Inference in a senior frontend interview?",
      "answerHint": "Best common type widens numeric/string literals in arrays. Homogeneous array inference prefers single element type. NoImplicitAny affects untyped empty array in JS files. const mixed = [1, 'two'];              // (string | number)[]\nconst empty: number[] = [];\nconst tuple = [1, 'a'] as cons"
    }
  ],
  "pitfalls": [
    "Pushing to const inferred array — readonly if as const; error on mutation."
  ],
  "interview": {
    "expectations": [
      "Explain Array Type Inference with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "Best common type widens numeric/string literals in arrays."
    ],
    "commonQuestions": [
      "What is Array Type Inference?",
      "When would you choose Array Type Inference over alternatives?",
      "What is the classic Array Type Inference interview trap?"
    ],
    "traps": [
      "Pushing to const inferred array — readonly if as const; error on mutation."
    ],
    "misconceptions": [
      "Correct inference avoids redundant annotations while preventing never[] traps."
    ],
    "strongSignals": [
      "Uses Array Type Inference to remove invalid states, not just document them."
    ]
  }
})
