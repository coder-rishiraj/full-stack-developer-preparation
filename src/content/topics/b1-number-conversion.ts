import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Number()",
  "whatIsIt": "Number(x) uses ToNumber: true→1, false→0, null→0, undefined→NaN, ''→0, whitespace-only strings→0, '0x10'→16, objects via ToPrimitive. BigInt throws. Leading/trailing spaces are allowed on numeric strings; '10a' is NaN.",
  "whyExists": "Forms and JSON give text. The language needed one numeric parse for operators and one constructor you can call on purpose.",
  "mentalModel": "A strict-ish whole-string numeric parse (not parseInt). Garbage anywhere besides surrounding space becomes NaN — except the surprising empties that become 0.",
  "how": [
    "Validate with Number.isFinite(Number(x)) after trim if 0 must not mean empty.",
    "Use parseInt/parseFloat when suffixes should be ignored.",
    "Convert bigint with Number(bigint) only if it fits.",
    "Boolean true is 1 — rarely what you want from a checkbox without care."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Number(null) === 0 and Number('') === 0, so empty form fields become zero without Number.isNaN catching them.",
    "variant": "warning"
  },
  "example": "const samples = [true, false, null, undefined, '', '  ', '8', '08', '0x10', '10px', '1_000'];\nfor (const v of samples) console.log(JSON.stringify(v), Number(v));\nconsole.log(Number({ valueOf: () => 7 }));\n",
  "exampleCaption": "ToNumber table for common inputs",
  "internals": [
    "ToNumber on strings: trim, then StrDecimalLiteral / hex; underscores in numeric literals are syntax, not in ToNumber strings.",
    "ToPrimitive hint number prefers valueOf then toString.",
    "Number(bigint) is an explicit conversion that may lose precision; mixed arithmetic throws."
  ],
  "takeaways": [
    "Validate with Number.isFinite(Number(x)) after trim if 0 must not mean empty.",
    "Use parseInt/parseFloat when suffixes should be ignored.",
    "Number(null) === 0 and Number('') === 0, so empty form fields become zero without Number.isNaN catching them.",
    "ToNumber on strings: trim, then StrDecimalLiteral / hex; underscores in numeric literals are syntax, not in ToNumber strings."
  ],
  "revision": [
    "Number(): A strict-ish whole-string numeric parse (not parseInt). Garbage anywhere besides surrounding space becomes NaN — except the surprising empties that become 0.",
    "Validate with Number.isFinite(Number(x)) after trim if 0 must not mean empty.",
    "Use parseInt/parseFloat when suffixes should be ignored.",
    "Convert bigint with Number(bigint) only if it fits.",
    "Trap: Number(null) === 0 and Number('') === 0, so empty form fields become zero without Number.isNaN catching them."
  ],
  "flashcards": [
    [
      "Number()",
      "Number(x) uses ToNumber: true→1, false→0, null→0, undefined→NaN, ''→0, whitespace-only strings→0, '0x10'→16, objects via ToPrimitive."
    ],
    [
      "Mental model",
      "A strict-ish whole-string numeric parse (not parseInt). Garbage anywhere besides surrounding space becomes NaN — except the surprising empties that become 0."
    ],
    [
      "Common trap",
      "Number(null) === 0 and Number('') === 0, so empty form fields become zero without Number.isNaN catching them."
    ],
    [
      "Validate with Number.isFinite(Number(x)) after trim if 0 must not mean empty.",
      "Use parseInt/parseFloat when suffixes should be ignored."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Number() and where does a beginner first see it?",
      "answerHint": "Number(x) uses ToNumber: true→1, false→0, null→0, undefined→NaN, ''→0, whitespace-only strings→0, '0x10'→16, objects via ToPrimitive. BigInt throws. Leading/trailing spaces are allowed on numeric strings; '10a' is NaN."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Number() works and name the main pitfall.",
      "answerHint": "Validate with Number.isFinite(Number(x)) after trim if 0 must not mean empty. Use parseInt/parseFloat when suffixes should be ignored. Convert bigint with Number(bigint) only if it fits. Boolean true is 1 — rarely what you want from a checkbox without care. Pitfall: Number(null) === 0 and Number('') === 0, so empty form fields become zero without Number.isNaN catching them."
    },
    {
      "level": "advanced",
      "question": "How would you explain Number() at an interview, including engine/spec details?",
      "answerHint": "ToNumber on strings: trim, then StrDecimalLiteral / hex; underscores in numeric literals are syntax, not in ToNumber strings. ToPrimitive hint number prefers valueOf then toString. Number(bigint) is an explicit conversion that may lose precision; mixed arithmetic throws."
    }
  ],
  "pitfalls": [
    "Number(null) === 0 and Number('') === 0, so empty form fields become zero without Number.isNaN catching them.",
    "Boolean true is 1 — rarely what you want from a checkbox without care."
  ],
  "interview": {
    "expectations": [
      "Explain Number() without mixing it up with a nearby B1.4 — Type Conversion & Coercion topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "ToNumber on strings: trim, then StrDecimalLiteral / hex; underscores in numeric literals are syntax, not in ToNumber strings."
    ],
    "commonQuestions": [
      "What is Number()?",
      "Why does JavaScript number() behave this way?",
      "What is the classic Number() interview trap?"
    ],
    "traps": [
      "Number(null) === 0 and Number('') === 0, so empty form fields become zero without Number.isNaN catching them."
    ],
    "misconceptions": [
      "Forms and JSON give text. The language needed one numeric parse for operators and one constructor you can call on purpose."
    ],
    "strongSignals": [
      "Separates Number() from lookalike APIs and can draw the mental model."
    ]
  }
})
