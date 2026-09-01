import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Currying & Partial Application",
  "whatIsIt": "Currying transforms f(a,b,c) into f(a)(b)(c). Partial application fixes some arguments now: f(a,b,c) with a bound → g(b,c). JS does not auto-curry. You implement with closures and rest. Arity (.length) may not match the original after wrapping.",
  "whyExists": "Function composition and config-first APIs (connect(url)(handler)) read well when arguments arrive at different times.",
  "mentalModel": "A vending machine that takes coins one slot at a time until it can drop the can (final value).",
  "how": [
    "Return a new function that closes over bound args.",
    "Decide if you curry one arg at a time or allow batches.",
    "Preserve this if wrapping methods (rare for curry).",
    "Do not confuse with just default parameters."
  ],
  "callout": {
    "title": "Watch for",
    "text": "fn.length ignores rest params and defaults — auto-curry by .length is wrong for (...args) functions.",
    "variant": "warning"
  },
  "example": "function curry(fn) {\n  return function curried(...args) {\n    if (args.length >= fn.length) return fn.apply(this, args);\n    return (...rest) => curried.apply(this, args.concat(rest));\n  };\n}\nconst add = (a, b, c) => a + b + c;\nconst cadd = curry(add);\nconsole.log(cadd(1)(2)(3), cadd(1, 2)(3), cadd(1)(2, 3));\n",
  "exampleCaption": "Simple curry using fn.length",
  "internals": [
    "Currying is a user-space pattern; the spec has no Curry abstract op.",
    "Each returned function is a new object with its own [[Environment]].",
    "Function.prototype.length is the count of declared params before the first default or rest."
  ],
  "takeaways": [
    "Return a new function that closes over bound args.",
    "Decide if you curry one arg at a time or allow batches.",
    "fn.length ignores rest params and defaults — auto-curry by .length is wrong for (...args) functions.",
    "Currying is a user-space pattern; the spec has no Curry abstract op."
  ],
  "revision": [
    "Currying & Partial Application: A vending machine that takes coins one slot at a time until it can drop the can (final value).",
    "Return a new function that closes over bound args.",
    "Decide if you curry one arg at a time or allow batches.",
    "Preserve this if wrapping methods (rare for curry).",
    "Trap: fn.length ignores rest params and defaults — auto-curry by .length is wrong for (...args) functions."
  ],
  "flashcards": [
    [
      "Currying & Partial Application",
      "Currying transforms f(a,b,c) into f(a)(b)(c)."
    ],
    [
      "Mental model",
      "A vending machine that takes coins one slot at a time until it can drop the can (final value)."
    ],
    [
      "Common trap",
      "fn.length ignores rest params and defaults — auto-curry by .length is wrong for (...args) functions."
    ],
    [
      "Return a new function that closes over bound args.",
      "Decide if you curry one arg at a time or allow batches."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Currying & Partial Application and where does a beginner first see it?",
      "answerHint": "Currying transforms f(a,b,c) into f(a)(b)(c). Partial application fixes some arguments now: f(a,b,c) with a bound → g(b,c). JS does not auto-curry. You implement with closures and rest. Arity (.length) may not match the original after wrapping."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Currying & Partial Application works and name the main pitfall.",
      "answerHint": "Return a new function that closes over bound args. Decide if you curry one arg at a time or allow batches. Preserve this if wrapping methods (rare for curry). Do not confuse with just default parameters. Pitfall: fn.length ignores rest params and defaults — auto-curry by .length is wrong for (...args) functions."
    },
    {
      "level": "advanced",
      "question": "How would you explain Currying & Partial Application at an interview, including engine/spec details?",
      "answerHint": "Currying is a user-space pattern; the spec has no Curry abstract op. Each returned function is a new object with its own [[Environment]]. Function.prototype.length is the count of declared params before the first default or rest."
    }
  ],
  "pitfalls": [
    "fn.length ignores rest params and defaults — auto-curry by .length is wrong for (...args) functions.",
    "Do not confuse with just default parameters."
  ],
  "interview": {
    "expectations": [
      "Explain Currying & Partial Application without mixing it up with a nearby B1.9 — Functions topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Currying is a user-space pattern; the spec has no Curry abstract op."
    ],
    "commonQuestions": [
      "What is Currying & Partial Application?",
      "Why does JavaScript currying & partial application behave this way?",
      "What is the classic Currying & Partial Application interview trap?"
    ],
    "traps": [
      "fn.length ignores rest params and defaults — auto-curry by .length is wrong for (...args) functions."
    ],
    "misconceptions": [
      "Function composition and config-first APIs (connect(url)(handler)) read well when arguments arrive at different times."
    ],
    "strongSignals": [
      "Separates Currying & Partial Application from lookalike APIs and can draw the mental model."
    ]
  }
})
