import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "number",
  "whatIsIt": "number is IEEE-754 double-precision floating point: about 15–17 decimal digits, a 53-bit integer significand, and special values NaN, Infinity, -0. Integers past Number.MAX_SAFE_INTEGER (2^53-1) cannot all be represented. There is no distinct int type in the language (use bigint).",
  "whyExists": "JS shipped in 1995 with one numeric type to keep the language tiny. Doubles covered both money-ish math (badly) and array indexes (mostly).",
  "mentalModel": "A 64-bit scientific-notation box. Integers are just doubles that happen to be whole — until they aren’t.",
  "how": [
    "Use Number.isFinite / Number.isInteger for validation.",
    "Money: integers of cents or bigint/decimal libraries, not 0.1 + 0.2.",
    "Parse with Number() or parseInt with radix; watch NaN.",
    "Switch to bigint when you need integers beyond 2^53."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Using parseInt(\"08\") without radix in ancient engines, or parseInt(\"8px\") silently returning 8 when you wanted NaN.",
    "variant": "warning"
  },
  "example": "console.log(0.1 + 0.2 === 0.3);\nconsole.log(Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER + 1);\nconsole.log(1 / 0, -1 / 0, 0 / 0);\nconsole.log(Object.is(0, -0));",
  "exampleCaption": "Float surprise, safe integer, infinities, -0",
  "internals": [
    "IEEE-754 round-to-nearest-even explains 0.1 + 0.2.",
    "ToInt32 is used by bitwise operators — numbers are truncated to 32-bit first.",
    "JSON numbers are still IEEE doubles after JSON.parse."
  ],
  "takeaways": [
    "Use Number.isFinite / Number.isInteger for validation.",
    "Money: integers of cents or bigint/decimal libraries, not 0.1 + 0.2.",
    "Using parseInt(\"08\") without radix in ancient engines, or parseInt(\"8px\") silently returning 8 when you wanted NaN.",
    "IEEE-754 round-to-nearest-even explains 0.1 + 0.2."
  ],
  "revision": [
    "number: A 64-bit scientific-notation box. Integers are just doubles that happen to be whole — until they aren’t.",
    "Use Number.isFinite / Number.isInteger for validation.",
    "Money: integers of cents or bigint/decimal libraries, not 0.1 + 0.2.",
    "Parse with Number() or parseInt with radix; watch NaN.",
    "Trap: Using parseInt(\"08\") without radix in ancient engines, or parseInt(\"8px\") silently returning 8 when you wanted NaN."
  ],
  "flashcards": [
    [
      "number",
      "number is IEEE-754 double-precision floating point: about 15–17 decimal digits, a 53-bit integer significand, and special values NaN, Infinity, -0."
    ],
    [
      "Mental model",
      "A 64-bit scientific-notation box. Integers are just doubles that happen to be whole — until they aren’t."
    ],
    [
      "Common trap",
      "Using parseInt(\"08\") without radix in ancient engines, or parseInt(\"8px\") silently returning 8 when you wanted NaN."
    ],
    [
      "Use Number.isFinite / Number.isInteger for validation.",
      "Money: integers of cents or bigint/decimal libraries, not 0.1 + 0.2."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is number and where does a beginner first see it?",
      "answerHint": "number is IEEE-754 double-precision floating point: about 15–17 decimal digits, a 53-bit integer significand, and special values NaN, Infinity, -0. Integers past Number.MAX_SAFE_INTEGER (2^53-1) cannot all be represented. There is no distinct int type in the language (use bigint)."
    },
    {
      "level": "intermediate",
      "question": "Walk through how number works and name the main pitfall.",
      "answerHint": "Use Number.isFinite / Number.isInteger for validation. Money: integers of cents or bigint/decimal libraries, not 0.1 + 0.2. Parse with Number() or parseInt with radix; watch NaN. Switch to bigint when you need integers beyond 2^53. Pitfall: Using parseInt(\"08\") without radix in ancient engines, or parseInt(\"8px\") silently returning 8 when you wanted NaN."
    },
    {
      "level": "advanced",
      "question": "How would you explain number at an interview, including engine/spec details?",
      "answerHint": "IEEE-754 round-to-nearest-even explains 0.1 + 0.2. ToInt32 is used by bitwise operators — numbers are truncated to 32-bit first. JSON numbers are still IEEE doubles after JSON.parse."
    }
  ],
  "pitfalls": [
    "Using parseInt(\"08\") without radix in ancient engines, or parseInt(\"8px\") silently returning 8 when you wanted NaN.",
    "Switch to bigint when you need integers beyond 2^53."
  ],
  "interview": {
    "expectations": [
      "Explain number without mixing it up with a nearby B1.3 — Types & Values topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "IEEE-754 round-to-nearest-even explains 0.1 + 0.2."
    ],
    "commonQuestions": [
      "What is number?",
      "Why does JavaScript number behave this way?",
      "What is the classic number interview trap?"
    ],
    "traps": [
      "Using parseInt(\"08\") without radix in ancient engines, or parseInt(\"8px\") silently returning 8 when you wanted NaN."
    ],
    "misconceptions": [
      "JS shipped in 1995 with one numeric type to keep the language tiny. Doubles covered both money-ish math (badly) and array indexes (mostly)."
    ],
    "strongSignals": [
      "Separates number from lookalike APIs and can draw the mental model."
    ]
  }
})
