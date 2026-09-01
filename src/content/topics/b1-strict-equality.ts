import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "=== Strict Equality",
  "whatIsIt": "=== requires the same type. Numbers use IEEE equality (NaN===NaN is false, +0===-0 is true). Strings compare code units. Objects compare identity. No ToNumber on the other side. This is the comparison you want in almost all production checks.",
  "whyExists": "Developers needed a comparison that would not silently coerce, after years of == bugs.",
  "mentalModel": "Same box shape and same contents for primitives; same heap address for objects.",
  "how": [
    "Use === for numbers, strings, booleans, references.",
    "Check NaN with Number.isNaN, not ===.",
    "Do not expect {} === {} to be true.",
    "Combine with typeof when you must branch on type first."
  ],
  "callout": {
    "title": "Watch for",
    "text": "document.querySelector can return null; x === undefined misses null. Use == null or check both.",
    "variant": "warning"
  },
  "example": "console.log(1 === 1, 1 === 1.0, 1 === '1');\nconsole.log(true === 1, null === undefined);\nconst a = {};\nconsole.log(a === a, a === {});\nconsole.log(+0 === -0, NaN === NaN);\n",
  "exampleCaption": "Strict equality: types, identity, zeros, NaN",
  "internals": [
    "Number::equal treats NaN as unequal to everything, including NaN.",
    "+0 and -0 are equal in === (IEEE).",
    "BigInt and Number of the same magnitude are still different types → false."
  ],
  "takeaways": [
    "Use === for numbers, strings, booleans, references.",
    "Check NaN with Number.isNaN, not ===.",
    "document.querySelector can return null; x === undefined misses null. Use == null or check both.",
    "Number::equal treats NaN as unequal to everything, including NaN."
  ],
  "revision": [
    "=== Strict Equality: Same box shape and same contents for primitives; same heap address for objects.",
    "Use === for numbers, strings, booleans, references.",
    "Check NaN with Number.isNaN, not ===.",
    "Do not expect {} === {} to be true.",
    "Trap: document.querySelector can return null; x === undefined misses null. Use == null or check both."
  ],
  "flashcards": [
    [
      "=== Strict Equality",
      "=== requires the same type."
    ],
    [
      "Mental model",
      "Same box shape and same contents for primitives; same heap address for objects."
    ],
    [
      "Common trap",
      "document.querySelector can return null; x === undefined misses null. Use == null or check both."
    ],
    [
      "Use === for numbers, strings, booleans, references.",
      "Check NaN with Number.isNaN, not ===."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is === Strict Equality and where does a beginner first see it?",
      "answerHint": "=== requires the same type. Numbers use IEEE equality (NaN===NaN is false, +0===-0 is true). Strings compare code units. Objects compare identity. No ToNumber on the other side. This is the comparison you want in almost all production checks."
    },
    {
      "level": "intermediate",
      "question": "Walk through how === Strict Equality works and name the main pitfall.",
      "answerHint": "Use === for numbers, strings, booleans, references. Check NaN with Number.isNaN, not ===. Do not expect {} === {} to be true. Combine with typeof when you must branch on type first. Pitfall: document.querySelector can return null; x === undefined misses null. Use == null or check both."
    },
    {
      "level": "advanced",
      "question": "How would you explain === Strict Equality at an interview, including engine/spec details?",
      "answerHint": "Number::equal treats NaN as unequal to everything, including NaN. +0 and -0 are equal in === (IEEE). BigInt and Number of the same magnitude are still different types → false."
    }
  ],
  "pitfalls": [
    "document.querySelector can return null; x === undefined misses null. Use == null or check both.",
    "Combine with typeof when you must branch on type first."
  ],
  "interview": {
    "expectations": [
      "Explain === Strict Equality without mixing it up with a nearby B1.4 — Type Conversion & Coercion topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Number::equal treats NaN as unequal to everything, including NaN."
    ],
    "commonQuestions": [
      "What is === Strict Equality?",
      "Why does JavaScript === strict equality behave this way?",
      "What is the classic === Strict Equality interview trap?"
    ],
    "traps": [
      "document.querySelector can return null; x === undefined misses null. Use == null or check both."
    ],
    "misconceptions": [
      "Developers needed a comparison that would not silently coerce, after years of == bugs."
    ],
    "strongSignals": [
      "Separates === Strict Equality from lookalike APIs and can draw the mental model."
    ]
  }
})
