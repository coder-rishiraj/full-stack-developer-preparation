import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Arithmetic Operators",
  "whatIsIt": "Binary + - * / % ** operate on numbers (IEEE) or bigints, not mixed. + also concatenates strings. % is remainder (sign follows dividend), not modulo in the mathematical sense for negatives. ** is exponentiation and is right-associative. Division by zero yields Infinity for numbers, throws RangeError for 0n.",
  "whyExists": "Scripts needed calculator ops in expressions. IEEE rules were reused instead of throwing on overflow.",
  "mentalModel": "ToNumeric both sides, then refuse to mix bigint with number. + has a string fork before that.",
  "how": [
    "Convert strings before math if you mean numbers.",
    "Use Number.isFinite on results when inputs can be garbage.",
    "For true modulo with negatives, adjust ((n % m) + m) % m.",
    "Parenthesize ** with unary minus: -(2 ** 2) vs -2 ** 2 (syntax error / ambiguity)."
  ],
  "callout": {
    "title": "Watch for",
    "text": "-7 % 3 is -1 in JS, not +2; algorithm interviews often want non-negative modulo.",
    "variant": "warning"
  },
  "example": "console.log(7 + 2, 7 - 2, 7 * 2, 7 / 2, 7 % 2, 2 ** 3);\nconsole.log((-7) % 3, 7 % -3);\nconsole.log(1 / 0, 2 ** -1);\ntry { console.log(1n / 0n); } catch (e) { console.log(e.name); }\nconsole.log(8 ** 2 ** 3 === 8 ** 8);\n",
  "exampleCaption": "Arithmetic, remainder sign, bigint divide-by-zero",
  "internals": [
    "ApplyStringOrNumericBinaryOperator vs numeric-only operators.",
    "Number::remainder uses IEEE remainder toward zero truncation of quotient.",
    "** uses Number::exponentiate; right-associativity is in the grammar."
  ],
  "takeaways": [
    "Convert strings before math if you mean numbers.",
    "Use Number.isFinite on results when inputs can be garbage.",
    "-7 % 3 is -1 in JS, not +2; algorithm interviews often want non-negative modulo.",
    "ApplyStringOrNumericBinaryOperator vs numeric-only operators."
  ],
  "revision": [
    "Arithmetic Operators: ToNumeric both sides, then refuse to mix bigint with number. + has a string fork before that.",
    "Convert strings before math if you mean numbers.",
    "Use Number.isFinite on results when inputs can be garbage.",
    "For true modulo with negatives, adjust ((n % m) + m) % m.",
    "Trap: -7 % 3 is -1 in JS, not +2; algorithm interviews often want non-negative modulo."
  ],
  "flashcards": [
    [
      "Arithmetic Operators",
      "Binary + - * / % ** operate on numbers (IEEE) or bigints, not mixed."
    ],
    [
      "Mental model",
      "ToNumeric both sides, then refuse to mix bigint with number. + has a string fork before that."
    ],
    [
      "Common trap",
      "-7 % 3 is -1 in JS, not +2; algorithm interviews often want non-negative modulo."
    ],
    [
      "Convert strings before math if you mean numbers.",
      "Use Number.isFinite on results when inputs can be garbage."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Arithmetic Operators and where does a beginner first see it?",
      "answerHint": "Binary + - * / % ** operate on numbers (IEEE) or bigints, not mixed. + also concatenates strings. % is remainder (sign follows dividend), not modulo in the mathematical sense for negatives. ** is exponentiation and is right-associative. Division by zero yields Infinity for numbers, throws RangeError for 0n."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Arithmetic Operators works and name the main pitfall.",
      "answerHint": "Convert strings before math if you mean numbers. Use Number.isFinite on results when inputs can be garbage. For true modulo with negatives, adjust ((n % m) + m) % m. Parenthesize ** with unary minus: -(2 ** 2) vs -2 ** 2 (syntax error / ambiguity). Pitfall: -7 % 3 is -1 in JS, not +2; algorithm interviews often want non-negative modulo."
    },
    {
      "level": "advanced",
      "question": "How would you explain Arithmetic Operators at an interview, including engine/spec details?",
      "answerHint": "ApplyStringOrNumericBinaryOperator vs numeric-only operators. Number::remainder uses IEEE remainder toward zero truncation of quotient. ** uses Number::exponentiate; right-associativity is in the grammar."
    }
  ],
  "pitfalls": [
    "-7 % 3 is -1 in JS, not +2; algorithm interviews often want non-negative modulo.",
    "Parenthesize ** with unary minus: -(2 ** 2) vs -2 ** 2 (syntax error / ambiguity)."
  ],
  "interview": {
    "expectations": [
      "Explain Arithmetic Operators without mixing it up with a nearby B1.5 — Operators & Expressions topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "ApplyStringOrNumericBinaryOperator vs numeric-only operators."
    ],
    "commonQuestions": [
      "What is Arithmetic Operators?",
      "Why does JavaScript arithmetic operators behave this way?",
      "What is the classic Arithmetic Operators interview trap?"
    ],
    "traps": [
      "-7 % 3 is -1 in JS, not +2; algorithm interviews often want non-negative modulo."
    ],
    "misconceptions": [
      "Scripts needed calculator ops in expressions. IEEE rules were reused instead of throwing on overflow."
    ],
    "strongSignals": [
      "Separates Arithmetic Operators from lookalike APIs and can draw the mental model."
    ]
  }
})
