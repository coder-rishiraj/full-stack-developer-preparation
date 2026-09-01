import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Number Representation",
  "whatIsIt": "A JS number is a 64-bit IEEE-754 double: 1 sign bit, 11 exponent bits, 52 explicit significand bits (53 bits of integer precision including the implicit 1). Integers between -2^53+1 and 2^53-1 are uniquely representable. Beyond that, some integers skip. There is no float32 in the language (TypedArrays exist separately).",
  "whyExists": "One numeric type kept 1995 JS small and matched Java’s double, which was ‘good enough’ for browser math.",
  "mentalModel": "A scientific-notation box with ~15 decimal digits. Integers are a dense neighborhood around 0, then holes appear.",
  "how": [
    "Stay inside Number.MAX_SAFE_INTEGER for IDs or use string/bigint.",
    "Expect 0.1 + 0.2 !== 0.3.",
    "Bitwise ops are a 32-bit side quest, not the number format.",
    "JSON numbers are also doubles after parse."
  ],
  "callout": {
    "title": "Watch for",
    "text": "JSON.parse('9007199254740993') silently rounds the ID before your code sees it.",
    "variant": "warning"
  },
  "example": "console.log(Number.MAX_SAFE_INTEGER);\nconsole.log(9007199254740993 === 9007199254740992);\nconsole.log((0.1 + 0.2).toPrecision(17));\nconsole.log(Number.EPSILON);\nconsole.log((1e16 + 1) === 1e16);\n",
  "exampleCaption": "Safe integer limit and float precision",
  "internals": [
    "IEEE-754 binary64 with round-to-nearest-even.",
    "Number.EPSILON is 2^-52, the gap at 1.",
    "Subnormals, NaN payloads, and -0 are part of the format; JS exposes -0 and a canonical NaN."
  ],
  "takeaways": [
    "Stay inside Number.MAX_SAFE_INTEGER for IDs or use string/bigint.",
    "Expect 0.1 + 0.2 !== 0.3.",
    "JSON.parse('9007199254740993') silently rounds the ID before your code sees it.",
    "IEEE-754 binary64 with round-to-nearest-even."
  ],
  "revision": [
    "Number Representation: A scientific-notation box with ~15 decimal digits. Integers are a dense neighborhood around 0, then holes appear.",
    "Stay inside Number.MAX_SAFE_INTEGER for IDs or use string/bigint.",
    "Expect 0.1 + 0.2 !== 0.3.",
    "Bitwise ops are a 32-bit side quest, not the number format.",
    "Trap: JSON.parse('9007199254740993') silently rounds the ID before your code sees it."
  ],
  "flashcards": [
    [
      "Number Representation",
      "A JS number is a 64-bit IEEE-754 double: 1 sign bit, 11 exponent bits, 52 explicit significand bits (53 bits of integer precision including the implicit 1)."
    ],
    [
      "Mental model",
      "A scientific-notation box with ~15 decimal digits. Integers are a dense neighborhood around 0, then holes appear."
    ],
    [
      "Common trap",
      "JSON.parse('9007199254740993') silently rounds the ID before your code sees it."
    ],
    [
      "Stay inside Number.MAX_SAFE_INTEGER for IDs or use string/bigint.",
      "Expect 0.1 + 0.2 !== 0.3."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Number Representation and where does a beginner first see it?",
      "answerHint": "A JS number is a 64-bit IEEE-754 double: 1 sign bit, 11 exponent bits, 52 explicit significand bits (53 bits of integer precision including the implicit 1). Integers between -2^53+1 and 2^53-1 are uniquely representable. Beyond that, some integers skip. There is no float32 in the language (TypedArrays exist separately)."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Number Representation works and name the main pitfall.",
      "answerHint": "Stay inside Number.MAX_SAFE_INTEGER for IDs or use string/bigint. Expect 0.1 + 0.2 !== 0.3. Bitwise ops are a 32-bit side quest, not the number format. JSON numbers are also doubles after parse. Pitfall: JSON.parse('9007199254740993') silently rounds the ID before your code sees it."
    },
    {
      "level": "advanced",
      "question": "How would you explain Number Representation at an interview, including engine/spec details?",
      "answerHint": "IEEE-754 binary64 with round-to-nearest-even. Number.EPSILON is 2^-52, the gap at 1. Subnormals, NaN payloads, and -0 are part of the format; JS exposes -0 and a canonical NaN."
    }
  ],
  "pitfalls": [
    "JSON.parse('9007199254740993') silently rounds the ID before your code sees it.",
    "JSON numbers are also doubles after parse."
  ],
  "interview": {
    "expectations": [
      "Explain Number Representation without mixing it up with a nearby B1.8 — Numbers & Math topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "IEEE-754 binary64 with round-to-nearest-even."
    ],
    "commonQuestions": [
      "What is Number Representation?",
      "Why does JavaScript number representation behave this way?",
      "What is the classic Number Representation interview trap?"
    ],
    "traps": [
      "JSON.parse('9007199254740993') silently rounds the ID before your code sees it."
    ],
    "misconceptions": [
      "One numeric type kept 1995 JS small and matched Java’s double, which was ‘good enough’ for browser math."
    ],
    "strongSignals": [
      "Separates Number Representation from lookalike APIs and can draw the mental model."
    ]
  }
})
