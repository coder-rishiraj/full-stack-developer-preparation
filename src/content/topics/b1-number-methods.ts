import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Number Methods & Parsing",
  "whatIsIt": "Number.parseInt/parseFloat are the same functions as the globals. Number.isNaN/isFinite do not coerce. toFixed/toPrecision/toExponential return strings. toString(radix) prints in base 2–36. Number(value) constructs a primitive when called without new.",
  "whyExists": "Formatting and parsing needed methods on the number prototype plus namespace functions that do not inherit global isNaN’s coercion.",
  "mentalModel": "is* are predicates on actual numbers. toFixed is a display stringer. parse* are scanners on text.",
  "how": [
    "Display money with toFixed, then treat the result as text.",
    "Use Number.isFinite for validation.",
    "toString(16) for hex dumps.",
    "Avoid new Number; boxed numbers are objects."
  ],
  "callout": {
    "title": "Watch for",
    "text": "toFixed can round up as a string ('1.005' with 2 digits is engine-dependent/surprising) — not decimal arithmetic.",
    "variant": "warning"
  },
  "example": "console.log(Number.isFinite('10'), isFinite('10'));\nconsole.log((3.14159).toFixed(2), (3.14159).toPrecision(3));\nconsole.log((255).toString(16), Number.parseInt('ff', 16));\nconsole.log((1.23e5).toExponential());\nconsole.log(Number('  8  '));\n",
  "exampleCaption": "isFinite, toFixed, toString radix, parseInt",
  "internals": [
    "Number.prototype methods ToNumber(this) so they work on boxed and primitive numbers.",
    "toFixed uses a spec algorithm that is not ‘elementary school rounding’ in all edge cases.",
    "parseInt on Number.parseInt is %parseInt% the same builtin as the global."
  ],
  "takeaways": [
    "Display money with toFixed, then treat the result as text.",
    "Use Number.isFinite for validation.",
    "toFixed can round up as a string ('1.005' with 2 digits is engine-dependent/surprising) — not decimal arithmetic.",
    "Number.prototype methods ToNumber(this) so they work on boxed and primitive numbers."
  ],
  "revision": [
    "Number Methods & Parsing: is* are predicates on actual numbers. toFixed is a display stringer. parse* are scanners on text.",
    "Display money with toFixed, then treat the result as text.",
    "Use Number.isFinite for validation.",
    "toString(16) for hex dumps.",
    "Trap: toFixed can round up as a string ('1.005' with 2 digits is engine-dependent/surprising) — not decimal arithmetic."
  ],
  "flashcards": [
    [
      "Number Methods & Parsing",
      "Number.parseInt/parseFloat are the same functions as the globals."
    ],
    [
      "Mental model",
      "is* are predicates on actual numbers. toFixed is a display stringer. parse* are scanners on text."
    ],
    [
      "Common trap",
      "toFixed can round up as a string ('1.005' with 2 digits is engine-dependent/surprising) — not decimal arithmetic."
    ],
    [
      "Display money with toFixed, then treat the result as text.",
      "Use Number.isFinite for validation."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Number Methods & Parsing and where does a beginner first see it?",
      "answerHint": "Number.parseInt/parseFloat are the same functions as the globals. Number.isNaN/isFinite do not coerce. toFixed/toPrecision/toExponential return strings. toString(radix) prints in base 2–36. Number(value) constructs a primitive when called without new."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Number Methods & Parsing works and name the main pitfall.",
      "answerHint": "Display money with toFixed, then treat the result as text. Use Number.isFinite for validation. toString(16) for hex dumps. Avoid new Number; boxed numbers are objects. Pitfall: toFixed can round up as a string ('1.005' with 2 digits is engine-dependent/surprising) — not decimal arithmetic."
    },
    {
      "level": "advanced",
      "question": "How would you explain Number Methods & Parsing at an interview, including engine/spec details?",
      "answerHint": "Number.prototype methods ToNumber(this) so they work on boxed and primitive numbers. toFixed uses a spec algorithm that is not ‘elementary school rounding’ in all edge cases. parseInt on Number.parseInt is %parseInt% the same builtin as the global."
    }
  ],
  "pitfalls": [
    "toFixed can round up as a string ('1.005' with 2 digits is engine-dependent/surprising) — not decimal arithmetic.",
    "Avoid new Number; boxed numbers are objects."
  ],
  "interview": {
    "expectations": [
      "Explain Number Methods & Parsing without mixing it up with a nearby B1.8 — Numbers & Math topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Number.prototype methods ToNumber(this) so they work on boxed and primitive numbers."
    ],
    "commonQuestions": [
      "What is Number Methods & Parsing?",
      "Why does JavaScript number methods & parsing behave this way?",
      "What is the classic Number Methods & Parsing interview trap?"
    ],
    "traps": [
      "toFixed can round up as a string ('1.005' with 2 digits is engine-dependent/surprising) — not decimal arithmetic."
    ],
    "misconceptions": [
      "Formatting and parsing needed methods on the number prototype plus namespace functions that do not inherit global isNaN’s coercion."
    ],
    "strongSignals": [
      "Separates Number Methods & Parsing from lookalike APIs and can draw the mental model."
    ]
  }
})
