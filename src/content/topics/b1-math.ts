import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Math",
  "whatIsIt": "Math is a namespace object of static functions and constants (PI, E, SQRT2): abs, min, max, floor, ceil, round, trunc, sqrt, pow, hypot, sin/cos, random. It is not a constructor. Many functions convert with ToNumber and return NaN on junk. min/max of zero args are Infinity/-Infinity.",
  "whyExists": "Numeric recipes needed a standard library without polluting the global with sin. Math mirrors Java’s Math.",
  "mentalModel": "A calculator drawer. You never new Math(); you call Math.fn(x).",
  "how": [
    "Math.min(...arr) watch empty arrays → Infinity.",
    "Use Math.hypot for distance without overflow of x*x+y*y when possible.",
    "Math.pow vs ** — ** is an operator; Math.pow is a call.",
    "Trigonometry is in radians, not degrees."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Math.max() with no args is -Infinity, so reduce without an initializer can surprise.",
    "variant": "warning"
  },
  "example": "console.log(Math.min(3, 1, 2), Math.max(3, 1, 2));\nconsole.log(Math.min(...[]));\nconsole.log(Math.hypot(3, 4), Math.sqrt(3 ** 2 + 4 ** 2));\nconsole.log(Math.PI, Math.sin(Math.PI / 2));\nconsole.log(Math.abs(-0), Object.is(Math.abs(-0), 0));\n",
  "exampleCaption": "min/max, hypot, radians, abs(-0)",
  "internals": [
    "Math is %Math% with [[Prototype]] Object.prototype; not callable typically as a constructor (throws).",
    "Math.min uses ToNumber on each argument in order.",
    "Some functions (Math.imul) operate on 32-bit ints internally."
  ],
  "takeaways": [
    "Math.min(...arr) watch empty arrays → Infinity.",
    "Use Math.hypot for distance without overflow of x*x+y*y when possible.",
    "Math.max() with no args is -Infinity, so reduce without an initializer can surprise.",
    "Math is %Math% with [[Prototype]] Object.prototype; not callable typically as a constructor (throws)."
  ],
  "revision": [
    "Math: A calculator drawer. You never new Math(); you call Math.fn(x).",
    "Math.min(...arr) watch empty arrays → Infinity.",
    "Use Math.hypot for distance without overflow of x*x+y*y when possible.",
    "Math.pow vs ** — ** is an operator; Math.pow is a call.",
    "Trap: Math.max() with no args is -Infinity, so reduce without an initializer can surprise."
  ],
  "flashcards": [
    [
      "Math",
      "Math is a namespace object of static functions and constants (PI, E, SQRT2): abs, min, max, floor, ceil, round, trunc, sqrt, pow, hypot, sin/cos, random."
    ],
    [
      "Mental model",
      "A calculator drawer. You never new Math(); you call Math.fn(x)."
    ],
    [
      "Common trap",
      "Math.max() with no args is -Infinity, so reduce without an initializer can surprise."
    ],
    [
      "Math.min(...arr) watch empty arrays → Infinity.",
      "Use Math.hypot for distance without overflow of x*x+y*y when possible."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Math and where does a beginner first see it?",
      "answerHint": "Math is a namespace object of static functions and constants (PI, E, SQRT2): abs, min, max, floor, ceil, round, trunc, sqrt, pow, hypot, sin/cos, random. It is not a constructor. Many functions convert with ToNumber and return NaN on junk. min/max of zero args are Infinity/-Infinity."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Math works and name the main pitfall.",
      "answerHint": "Math.min(...arr) watch empty arrays → Infinity. Use Math.hypot for distance without overflow of x*x+y*y when possible. Math.pow vs ** — ** is an operator; Math.pow is a call. Trigonometry is in radians, not degrees. Pitfall: Math.max() with no args is -Infinity, so reduce without an initializer can surprise."
    },
    {
      "level": "advanced",
      "question": "How would you explain Math at an interview, including engine/spec details?",
      "answerHint": "Math is %Math% with [[Prototype]] Object.prototype; not callable typically as a constructor (throws). Math.min uses ToNumber on each argument in order. Some functions (Math.imul) operate on 32-bit ints internally."
    }
  ],
  "pitfalls": [
    "Math.max() with no args is -Infinity, so reduce without an initializer can surprise.",
    "Trigonometry is in radians, not degrees."
  ],
  "interview": {
    "expectations": [
      "Explain Math without mixing it up with a nearby B1.8 — Numbers & Math topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Math is %Math% with [[Prototype]] Object.prototype; not callable typically as a constructor (throws)."
    ],
    "commonQuestions": [
      "What is Math?",
      "Why does JavaScript math behave this way?",
      "What is the classic Math interview trap?"
    ],
    "traps": [
      "Math.max() with no args is -Infinity, so reduce without an initializer can surprise."
    ],
    "misconceptions": [
      "Numeric recipes needed a standard library without polluting the global with sin. Math mirrors Java’s Math."
    ],
    "strongSignals": [
      "Separates Math from lookalike APIs and can draw the mental model."
    ]
  }
})
