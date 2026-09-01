import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Parameters, Defaults, Rest, arguments",
  "whatIsIt": "Parameters are bindings created per call. Defaults run when the argument is undefined (not null). Rest (...rest) collects remaining arguments into a real array. arguments is an array-like object in non-arrow functions, with legacy aliasing in sloppy mode. Duplicate param names are illegal in strict.",
  "whyExists": "Functions needed inputs. Defaults and rest replaced arguments-munging. arguments remains for old code and arity tricks.",
  "mentalModel": "Named slots, then a box of leftovers (rest). Defaults are ‘if this slot is undefined, run this tiny expression.’",
  "how": [
    "Prefer rest over arguments.",
    "Defaults can close over earlier params: (a, b = a).",
    "Do not mix defaults with relying on arguments.length without care.",
    "Arrow functions have no arguments object of their own."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Default does not fire for null — (b = 2) with f(1, null) keeps null.",
    "variant": "warning"
  },
  "example": "function f(a, b = 2, ...rest) {\n  return { a, b, rest, argc: arguments.length };\n}\nconsole.log(f(1), f(1, undefined, 3, 4), f(1, null));\nconst arrow = (...xs) => xs;\nconsole.log(arrow(1, 2));\n",
  "exampleCaption": "Defaults, rest, arguments.length vs null",
  "internals": [
    "IteratorBindingInitialization and default evaluation when v is undefined.",
    "arguments in sloppy non-strict mapped params aliases arguments[i] with the named param.",
    "rest is a true Array exotic object, arguments is an Arguments exotic object."
  ],
  "takeaways": [
    "Prefer rest over arguments.",
    "Defaults can close over earlier params: (a, b = a).",
    "Default does not fire for null — (b = 2) with f(1, null) keeps null.",
    "IteratorBindingInitialization and default evaluation when v is undefined."
  ],
  "revision": [
    "Parameters, Defaults, Rest, arguments: Named slots, then a box of leftovers (rest). Defaults are ‘if this slot is undefined, run this tiny expression.’",
    "Prefer rest over arguments.",
    "Defaults can close over earlier params: (a, b = a).",
    "Do not mix defaults with relying on arguments.length without care.",
    "Trap: Default does not fire for null — (b = 2) with f(1, null) keeps null."
  ],
  "flashcards": [
    [
      "Parameters, Defaults, Rest, arguments",
      "Parameters are bindings created per call."
    ],
    [
      "Mental model",
      "Named slots, then a box of leftovers (rest). Defaults are ‘if this slot is undefined, run this tiny expression.’"
    ],
    [
      "Common trap",
      "Default does not fire for null — (b = 2) with f(1, null) keeps null."
    ],
    [
      "Prefer rest over arguments.",
      "Defaults can close over earlier params: (a, b = a)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Parameters, Defaults, Rest, arguments and where does a beginner first see it?",
      "answerHint": "Parameters are bindings created per call. Defaults run when the argument is undefined (not null). Rest (...rest) collects remaining arguments into a real array. arguments is an array-like object in non-arrow functions, with legacy aliasing in sloppy mode. Duplicate param names are illegal in strict."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Parameters, Defaults, Rest, arguments works and name the main pitfall.",
      "answerHint": "Prefer rest over arguments. Defaults can close over earlier params: (a, b = a). Do not mix defaults with relying on arguments.length without care. Arrow functions have no arguments object of their own. Pitfall: Default does not fire for null — (b = 2) with f(1, null) keeps null."
    },
    {
      "level": "advanced",
      "question": "How would you explain Parameters, Defaults, Rest, arguments at an interview, including engine/spec details?",
      "answerHint": "IteratorBindingInitialization and default evaluation when v is undefined. arguments in sloppy non-strict mapped params aliases arguments[i] with the named param. rest is a true Array exotic object, arguments is an Arguments exotic object."
    }
  ],
  "pitfalls": [
    "Default does not fire for null — (b = 2) with f(1, null) keeps null.",
    "Arrow functions have no arguments object of their own."
  ],
  "interview": {
    "expectations": [
      "Explain Parameters, Defaults, Rest, arguments without mixing it up with a nearby B1.9 — Functions topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "IteratorBindingInitialization and default evaluation when v is undefined."
    ],
    "commonQuestions": [
      "What is Parameters, Defaults, Rest, arguments?",
      "Why does JavaScript parameters, defaults, rest, arguments behave this way?",
      "What is the classic Parameters, Defaults, Rest, arguments interview trap?"
    ],
    "traps": [
      "Default does not fire for null — (b = 2) with f(1, null) keeps null."
    ],
    "misconceptions": [
      "Functions needed inputs. Defaults and rest replaced arguments-munging. arguments remains for old code and arity tricks."
    ],
    "strongSignals": [
      "Separates Parameters, Defaults, Rest, arguments from lookalike APIs and can draw the mental model."
    ]
  }
})
