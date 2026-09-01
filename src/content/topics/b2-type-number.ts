import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "number",
  "whatIsIt": "number covers all IEEE-754 doubles: integers, floats, NaN, and Infinity. There is no separate int/float. bigint is a distinct type for arbitrary-precision integers. Literal types like 42 or -1 narrow specific constants.",
  "whyExists": "JS has one number type; TS mirrors that to avoid false precision about integers.",
  "mentalModel": "number is a wide bucket — all numeric JS values swim in the same pool.",
  "how": [
    "Use number for counters, coordinates, timestamps.",
    "Use bigint suffix n for IDs beyond 2^53-1.",
    "Number.isInteger narrows at runtime; TS still types as number.",
    "Prefer explicit checks for NaN — NaN !== NaN.",
    "Union with literal types for fixed sets: 200 | 404 | 500."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Expecting TS to distinguish float vs int — it will not; use branded types or bigint if needed.",
    "variant": "warning"
  },
  "example": "const count: number = 3;\nconst big: bigint = 9007199254740991n;\nconst maybe: number | null = null;\nconsole.log(count + 1, big + 1n);\nconst port: 200 | 404 | 500 = 200;\nconsole.log(Number.isInteger(count), maybe === null, port);\n// TypeScript validates this file before emit\n// Strict mode catches misuse at compile time",
  "exampleCaption": "number and bigint are distinct TS types",
  "internals": [
    "Numeric literal types auto-widen unless as const.",
    "Enums with numeric members compile to reverse maps.",
    "Math operations preserve number unless bigint involved."
  ],
  "takeaways": [
    "Use number for counters, coordinates, timestamps.",
    "Use bigint suffix n for IDs beyond 2^53-1.",
    "Expecting TS to distinguish float vs int — it will not; use branded types or bigint if needed.",
    "Numeric literal types auto-widen unless as const."
  ],
  "revision": [
    "number: number is a wide bucket — all numeric JS values swim in the same pool.",
    "Use number for counters, coordinates, timestamps.",
    "Use bigint suffix n for IDs beyond 2^53-1.",
    "Number.isInteger narrows at runtime; TS still types as number.",
    "Trap: Expecting TS to distinguish float vs int — it will not; use branded types or bigint if needed."
  ],
  "flashcards": [
    [
      "number",
      "number covers all IEEE-754 doubles: integers, floats, NaN, and Infinity."
    ],
    [
      "Mental model",
      "number is a wide bucket — all numeric JS values swim in the same pool."
    ],
    [
      "Common trap",
      "Expecting TS to distinguish float vs int — it will not; use branded types or bigint if needed."
    ],
    [
      "Use number for counters, coordinates, timestamps.",
      "Use bigint suffix n for IDs beyond 2^53-1."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is number in TypeScript and when do you use it?",
      "answerHint": "number covers all IEEE-754 doubles: integers, floats, NaN, and Infinity. There is no separate int/float. bigint is a distinct type for arbitrary-precision integers. Literal types like 42 or -1 narrow specific constants."
    },
    {
      "level": "intermediate",
      "question": "Explain number with a code example and one pitfall.",
      "answerHint": "Use number for counters, coordinates, timestamps. Use bigint suffix n for IDs beyond 2^53-1. Number.isInteger narrows at runtime; TS still types as number. Prefer explicit checks for NaN — NaN !== NaN. Union with literal types for fixed sets: 200 | 404 | 500. Pitfall: Expecting TS to distinguish float vs int — it will not; use branded types or bigint if needed."
    },
    {
      "level": "advanced",
      "question": "How would you explain number in a senior frontend interview?",
      "answerHint": "Numeric literal types auto-widen unless as const. Enums with numeric members compile to reverse maps. Math operations preserve number unless bigint involved. const count: number = 3;\nconst big: bigint = 9007199254740991n;\nconst maybe: number | null = null;\nconsole.log(count + 1"
    }
  ],
  "pitfalls": [
    "Expecting TS to distinguish float vs int — it will not; use branded types or bigint if needed."
  ],
  "interview": {
    "expectations": [
      "Explain number with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "Numeric literal types auto-widen unless as const."
    ],
    "commonQuestions": [
      "What is number?",
      "When would you choose number over alternatives?",
      "What is the classic number interview trap?"
    ],
    "traps": [
      "Expecting TS to distinguish float vs int — it will not; use branded types or bigint if needed."
    ],
    "misconceptions": [
      "JS has one number type; TS mirrors that to avoid false precision about integers."
    ],
    "strongSignals": [
      "Uses number to remove invalid states, not just document them."
    ]
  }
})
