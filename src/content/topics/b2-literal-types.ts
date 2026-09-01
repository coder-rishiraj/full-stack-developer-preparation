import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Literal Types",
  "whatIsIt": "Literal types pin exact values: \"GET\", 200, true. They combine into unions for finite sets. as const and const assertions preserve literals instead of widening to string/number.",
  "whyExists": "Precise literals power discriminated unions and API method typing.",
  "mentalModel": "Specific house numbers, not \"any address on street\".",
  "how": [
    "Method unions: type Method = \"GET\" | \"POST\".",
    "const config = { mode: \"strict\" } as const.",
    "Template literals build string literal unions.",
    "Compare with enum for runtime needs.",
    "Use in generic constraints: T extends \"asc\" | \"desc\"."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Literal widening on let variables — use const or as const.",
    "variant": "warning"
  },
  "example": "type Direction = 'north' | 'south' | 'east' | 'west';\nfunction move(d: Direction, steps: number) {\n  console.log(`Moving ${d} ${steps}`);\n}\nmove('north', 3);\nconst __typed: Direction = {} as Direction;\nconsole.log(\"export type { Direction }\");\n// type Direction = 'north' | 'south' | 'east' | 'west'; narrows allowed values",
  "exampleCaption": "Direction union of string literals",
  "internals": [
    "Boolean literals true | false same as boolean in practice.",
    "Enum members compare to literal types differently.",
    "Const context preserves literal in property inference."
  ],
  "takeaways": [
    "Method unions: type Method = \"GET\" | \"POST\".",
    "const config = { mode: \"strict\" } as const.",
    "Literal widening on let variables — use const or as const.",
    "Boolean literals true | false same as boolean in practice."
  ],
  "revision": [
    "Literal Types: Specific house numbers, not \"any address on street\".",
    "Method unions: type Method = \"GET\" | \"POST\".",
    "const config = { mode: \"strict\" } as const.",
    "Template literals build string literal unions.",
    "Trap: Literal widening on let variables — use const or as const."
  ],
  "flashcards": [
    [
      "Literal Types",
      "Literal types pin exact values: \"GET\", 200, true."
    ],
    [
      "Mental model",
      "Specific house numbers, not \"any address on street\"."
    ],
    [
      "Common trap",
      "Literal widening on let variables — use const or as const."
    ],
    [
      "Method unions: type Method = \"GET\" | \"POST\".",
      "const config = { mode: \"strict\" } as const."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Literal Types in TypeScript and when do you use it?",
      "answerHint": "Literal types pin exact values: \"GET\", 200, true. They combine into unions for finite sets. as const and const assertions preserve literals instead of widening to string/number."
    },
    {
      "level": "intermediate",
      "question": "Explain Literal Types with a code example and one pitfall.",
      "answerHint": "Method unions: type Method = \"GET\" | \"POST\". const config = { mode: \"strict\" } as const. Template literals build string literal unions. Compare with enum for runtime needs. Use in generic constraints: T extends \"asc\" | \"desc\". Pitfall: Literal widening on let variables — use const or as const."
    },
    {
      "level": "advanced",
      "question": "How would you explain Literal Types in a senior frontend interview?",
      "answerHint": "Boolean literals true | false same as boolean in practice. Enum members compare to literal types differently. Const context preserves literal in property inference. type Direction = 'north' | 'south' | 'east' | 'west';\nfunction move(d: Direction, steps: number) {\n  console.log(`Moving"
    }
  ],
  "pitfalls": [
    "Literal widening on let variables — use const or as const."
  ],
  "interview": {
    "expectations": [
      "Explain Literal Types with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "Boolean literals true | false same as boolean in practice."
    ],
    "commonQuestions": [
      "What is Literal Types?",
      "When would you choose Literal Types over alternatives?",
      "What is the classic Literal Types interview trap?"
    ],
    "traps": [
      "Literal widening on let variables — use const or as const."
    ],
    "misconceptions": [
      "Precise literals power discriminated unions and API method typing."
    ],
    "strongSignals": [
      "Uses Literal Types to remove invalid states, not just document them."
    ]
  }
})
