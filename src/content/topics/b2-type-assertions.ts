import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Type Assertions (as)",
  "whatIsIt": "Type assertions x as Type tell the compiler to treat x as Type — no runtime check. Angle-bracket syntax <Type>x exists but avoid in TSX. Use when you know more than TS after narrowing insufficient.",
  "whyExists": "Escape hatch for DOM, legacy APIs, and migration — not a substitute for validation.",
  "mentalModel": "Sticky note \"trust me\" on a package — compiler stops questioning.",
  "how": [
    "Prefer narrowing and guards over as.",
    "as const asserts literal readonly.",
    "Double assertion via unknown for unrelated types — code smell.",
    "Non-null assertion ! for definite assignment.",
    "satisfies validates without widening."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Asserting without validation — runtime shape mismatch still crashes.",
    "variant": "warning"
  },
  "example": "const el = document.getElementById('root') as HTMLElement;\nconst data = JSON.parse('{\"id\":1}') as { id: number };\nconsole.log(el.tagName, data.id);\n// TypeScript validates this file before emit\n// Strict mode catches misuse at compile time\n// Annotations are erased — zero runtime overhead\n// Enable \"strict\": true in tsconfig.json\n// Hover types in your editor to inspect inference",
  "exampleCaption": "as HTMLElement after getElementById",
  "internals": [
    "Assertions are erased — zero runtime effect.",
    "Type predicates safer than blind as.",
    "as const is special assertion preserving literals."
  ],
  "takeaways": [
    "Prefer narrowing and guards over as.",
    "as const asserts literal readonly.",
    "Asserting without validation — runtime shape mismatch still crashes.",
    "Assertions are erased — zero runtime effect."
  ],
  "revision": [
    "Type Assertions (as): Sticky note \"trust me\" on a package — compiler stops questioning.",
    "Prefer narrowing and guards over as.",
    "as const asserts literal readonly.",
    "Double assertion via unknown for unrelated types — code smell.",
    "Trap: Asserting without validation — runtime shape mismatch still crashes."
  ],
  "flashcards": [
    [
      "Type Assertions (as)",
      "Type assertions x as Type tell the compiler to treat x as Type — no runtime check."
    ],
    [
      "Mental model",
      "Sticky note \"trust me\" on a package — compiler stops questioning."
    ],
    [
      "Common trap",
      "Asserting without validation — runtime shape mismatch still crashes."
    ],
    [
      "Prefer narrowing and guards over as.",
      "as const asserts literal readonly."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Type Assertions (as) in TypeScript and when do you use it?",
      "answerHint": "Type assertions x as Type tell the compiler to treat x as Type — no runtime check. Angle-bracket syntax <Type>x exists but avoid in TSX. Use when you know more than TS after narrowing insufficient."
    },
    {
      "level": "intermediate",
      "question": "Explain Type Assertions (as) with a code example and one pitfall.",
      "answerHint": "Prefer narrowing and guards over as. as const asserts literal readonly. Double assertion via unknown for unrelated types — code smell. Non-null assertion ! for definite assignment. satisfies validates without widening. Pitfall: Asserting without validation — runtime shape mismatch still crashes."
    },
    {
      "level": "advanced",
      "question": "How would you explain Type Assertions (as) in a senior frontend interview?",
      "answerHint": "Assertions are erased — zero runtime effect. Type predicates safer than blind as. as const is special assertion preserving literals. const el = document.getElementById('root') as HTMLElement;\nconst data = JSON.parse('{\"id\":1}') as { id: number };\nconsol"
    }
  ],
  "pitfalls": [
    "Asserting without validation — runtime shape mismatch still crashes."
  ],
  "interview": {
    "expectations": [
      "Explain Type Assertions (as) with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "Assertions are erased — zero runtime effect."
    ],
    "commonQuestions": [
      "What is Type Assertions (as)?",
      "When would you choose Type Assertions (as) over alternatives?",
      "What is the classic Type Assertions (as) interview trap?"
    ],
    "traps": [
      "Asserting without validation — runtime shape mismatch still crashes."
    ],
    "misconceptions": [
      "Escape hatch for DOM, legacy APIs, and migration — not a substitute for validation."
    ],
    "strongSignals": [
      "Uses Type Assertions (as) to remove invalid states, not just document them."
    ]
  }
})
