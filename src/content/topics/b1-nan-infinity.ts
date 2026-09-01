import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "NaN, Infinity, and Safe Numbers",
  "whatIsIt": "NaN means “not a number” — invalid numeric results (0/0, parse failures). NaN !== NaN. Infinity and -Infinity are overflows (1/0). Number.MAX_VALUE is the largest finite double; beyond that you get Infinity. Safe integers are a subset of numbers, not a separate type.",
  "whyExists": "IEEE-754 needed sentinels instead of throwing on every bad math op, so one slow script would not halt the page.",
  "mentalModel": "NaN is a poisoned number that contaminates arithmetic. Infinity is a number that got too large, not an error object.",
  "how": [
    "Detect NaN with Number.isNaN, not `=== NaN` and not global isNaN.",
    "Check Infinity with Number.isFinite.",
    "Do not use NaN as a missing-value sentinel if you can use null.",
    "JSON.parse(\"NaN\") is invalid JSON; JSON has no NaN."
  ],
  "callout": {
    "title": "Watch for",
    "text": "global isNaN(\"hello\") is true because it coerces to NaN — Number.isNaN(\"hello\") is false.",
    "variant": "warning"
  },
  "example": "console.log(Number('x'), 0 / 0, 1 / 0);\nconsole.log(NaN === NaN, Number.isNaN(NaN), isNaN('x'));\nconsole.log(Number.isFinite(1 / 0), Number.MAX_SAFE_INTEGER);\nconsole.log(Infinity - Infinity);",
  "exampleCaption": "NaN inequality, isNaN coercion, Infinity",
  "internals": [
    "IEEE NaN encodings; JS has a single NaN value at the language level.",
    "ToNumber(\"foo\") → NaN is used by implicit coercion.",
    "Object.is(NaN, NaN) is true — the SameValue algorithm."
  ],
  "takeaways": [
    "Detect NaN with Number.isNaN, not `=== NaN` and not global isNaN.",
    "Check Infinity with Number.isFinite.",
    "global isNaN(\"hello\") is true because it coerces to NaN — Number.isNaN(\"hello\") is false.",
    "IEEE NaN encodings; JS has a single NaN value at the language level."
  ],
  "revision": [
    "NaN, Infinity, and Safe Numbers: NaN is a poisoned number that contaminates arithmetic. Infinity is a number that got too large, not an error object.",
    "Detect NaN with Number.isNaN, not `=== NaN` and not global isNaN.",
    "Check Infinity with Number.isFinite.",
    "Do not use NaN as a missing-value sentinel if you can use null.",
    "Trap: global isNaN(\"hello\") is true because it coerces to NaN — Number.isNaN(\"hello\") is false."
  ],
  "flashcards": [
    [
      "NaN, Infinity, and Safe Numbers",
      "NaN means “not a number” — invalid numeric results (0/0, parse failures)."
    ],
    [
      "Mental model",
      "NaN is a poisoned number that contaminates arithmetic. Infinity is a number that got too large, not an error object."
    ],
    [
      "Common trap",
      "global isNaN(\"hello\") is true because it coerces to NaN — Number.isNaN(\"hello\") is false."
    ],
    [
      "Detect NaN with Number.isNaN, not `=== NaN` and not global isNaN.",
      "Check Infinity with Number.isFinite."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is NaN, Infinity, and Safe Numbers and where does a beginner first see it?",
      "answerHint": "NaN means “not a number” — invalid numeric results (0/0, parse failures). NaN !== NaN. Infinity and -Infinity are overflows (1/0). Number.MAX_VALUE is the largest finite double; beyond that you get Infinity. Safe integers are a subset of numbers, not a separate type."
    },
    {
      "level": "intermediate",
      "question": "Walk through how NaN, Infinity, and Safe Numbers works and name the main pitfall.",
      "answerHint": "Detect NaN with Number.isNaN, not `=== NaN` and not global isNaN. Check Infinity with Number.isFinite. Do not use NaN as a missing-value sentinel if you can use null. JSON.parse(\"NaN\") is invalid JSON; JSON has no NaN. Pitfall: global isNaN(\"hello\") is true because it coerces to NaN — Number.isNaN(\"hello\") is false."
    },
    {
      "level": "advanced",
      "question": "How would you explain NaN, Infinity, and Safe Numbers at an interview, including engine/spec details?",
      "answerHint": "IEEE NaN encodings; JS has a single NaN value at the language level. ToNumber(\"foo\") → NaN is used by implicit coercion. Object.is(NaN, NaN) is true — the SameValue algorithm."
    }
  ],
  "pitfalls": [
    "global isNaN(\"hello\") is true because it coerces to NaN — Number.isNaN(\"hello\") is false.",
    "JSON.parse(\"NaN\") is invalid JSON; JSON has no NaN."
  ],
  "interview": {
    "expectations": [
      "Explain NaN, Infinity, and Safe Numbers without mixing it up with a nearby B1.3 — Types & Values topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "IEEE NaN encodings; JS has a single NaN value at the language level."
    ],
    "commonQuestions": [
      "What is NaN, Infinity, and Safe Numbers?",
      "Why does JavaScript nan, infinity, and safe numbers behave this way?",
      "What is the classic NaN, Infinity, and Safe Numbers interview trap?"
    ],
    "traps": [
      "global isNaN(\"hello\") is true because it coerces to NaN — Number.isNaN(\"hello\") is false."
    ],
    "misconceptions": [
      "IEEE-754 needed sentinels instead of throwing on every bad math op, so one slow script would not halt the page."
    ],
    "strongSignals": [
      "Separates NaN, Infinity, and Safe Numbers from lookalike APIs and can draw the mental model."
    ]
  }
})
