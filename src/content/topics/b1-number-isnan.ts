import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Number.isNaN()",
  "whatIsIt": "Number.isNaN(x) is true only if x is actually the number NaN. It does not coerce. The global isNaN(x) runs ToNumber first, so isNaN(undefined) and isNaN(\"foo\") are true. After ES2015, Number.isNaN is the correct check.",
  "whyExists": "The original isNaN was built when everything was loosely typed and coercion was considered helpful. It made “is this NaN?” useless for type checks.",
  "mentalModel": "Number.isNaN asks “is this already NaN?” Global isNaN asks “would this become NaN if I forced a number?”",
  "how": [
    "Always prefer Number.isNaN for detecting NaN.",
    "Alternatively `Object.is(x, NaN)` or `x !== x`.",
    "Validate inputs with Number.isFinite if you need a real finite number.",
    "Do not use isNaN to test numeric strings."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Filtering with `!isNaN(x)` keeps numeric strings like \"10\" and drops nothing useful for type-safe arrays.",
    "variant": "warning"
  },
  "example": "console.log(Number.isNaN(NaN), Number.isNaN('NaN'), Number.isNaN(undefined));\nconsole.log(isNaN(NaN), isNaN('NaN'), isNaN(undefined));\nconst x = 0 / 0;\nconsole.log(x !== x);",
  "exampleCaption": "Number.isNaN vs global isNaN",
  "internals": [
    "Number.isNaN is specified as Type(x) is Number and x is NaN.",
    "Global isNaN is ToNumber then comparison with NaN.",
    "x !== x is a popular interview equivalent because NaN is the only value not equal to itself."
  ],
  "takeaways": [
    "Always prefer Number.isNaN for detecting NaN.",
    "Alternatively `Object.is(x, NaN)` or `x !== x`.",
    "Filtering with `!isNaN(x)` keeps numeric strings like \"10\" and drops nothing useful for type-safe arrays.",
    "Number.isNaN is specified as Type(x) is Number and x is NaN."
  ],
  "revision": [
    "Number.isNaN(): Number.isNaN asks “is this already NaN?” Global isNaN asks “would this become NaN if I forced a number?”",
    "Always prefer Number.isNaN for detecting NaN.",
    "Alternatively `Object.is(x, NaN)` or `x !== x`.",
    "Validate inputs with Number.isFinite if you need a real finite number.",
    "Trap: Filtering with `!isNaN(x)` keeps numeric strings like \"10\" and drops nothing useful for type-safe arrays."
  ],
  "flashcards": [
    [
      "Number.isNaN()",
      "Number.isNaN(x) is true only if x is actually the number NaN."
    ],
    [
      "Mental model",
      "Number.isNaN asks “is this already NaN?” Global isNaN asks “would this become NaN if I forced a number?”"
    ],
    [
      "Common trap",
      "Filtering with `!isNaN(x)` keeps numeric strings like \"10\" and drops nothing useful for type-safe arrays."
    ],
    [
      "Always prefer Number.isNaN for detecting NaN.",
      "Alternatively `Object.is(x, NaN)` or `x !== x`."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Number.isNaN() and where does a beginner first see it?",
      "answerHint": "Number.isNaN(x) is true only if x is actually the number NaN. It does not coerce. The global isNaN(x) runs ToNumber first, so isNaN(undefined) and isNaN(\"foo\") are true. After ES2015, Number.isNaN is the correct check."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Number.isNaN() works and name the main pitfall.",
      "answerHint": "Always prefer Number.isNaN for detecting NaN. Alternatively `Object.is(x, NaN)` or `x !== x`. Validate inputs with Number.isFinite if you need a real finite number. Do not use isNaN to test numeric strings. Pitfall: Filtering with `!isNaN(x)` keeps numeric strings like \"10\" and drops nothing useful for type-safe arrays."
    },
    {
      "level": "advanced",
      "question": "How would you explain Number.isNaN() at an interview, including engine/spec details?",
      "answerHint": "Number.isNaN is specified as Type(x) is Number and x is NaN. Global isNaN is ToNumber then comparison with NaN. x !== x is a popular interview equivalent because NaN is the only value not equal to itself."
    }
  ],
  "pitfalls": [
    "Filtering with `!isNaN(x)` keeps numeric strings like \"10\" and drops nothing useful for type-safe arrays.",
    "Do not use isNaN to test numeric strings."
  ],
  "interview": {
    "expectations": [
      "Explain Number.isNaN() without mixing it up with a nearby B1.3 — Types & Values topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Number.isNaN is specified as Type(x) is Number and x is NaN."
    ],
    "commonQuestions": [
      "What is Number.isNaN()?",
      "Why does JavaScript number.isnan() behave this way?",
      "What is the classic Number.isNaN() interview trap?"
    ],
    "traps": [
      "Filtering with `!isNaN(x)` keeps numeric strings like \"10\" and drops nothing useful for type-safe arrays."
    ],
    "misconceptions": [
      "The original isNaN was built when everything was loosely typed and coercion was considered helpful. It made “is this NaN?” useless for type checks."
    ],
    "strongSignals": [
      "Separates Number.isNaN() from lookalike APIs and can draw the mental model."
    ]
  }
})
