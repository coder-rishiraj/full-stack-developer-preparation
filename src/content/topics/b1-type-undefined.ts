import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "undefined",
  "whatIsIt": "undefined means “this binding/property/argument has no value.” Uninitialized `let` after declaration (`let x`), missing arguments, missing object properties, and functions without return all yield undefined. It is a primitive, typeof \"undefined\". The global `undefined` can be shadowed as a variable name (do not).",
  "whyExists": "Dynamic objects and optional arguments need a distinct “nothing was provided” that is not null’s “author meant empty.”",
  "mentalModel": "The default empty of the language. If you did not put a value, JS fills undefined — unless you used null on purpose.",
  "how": [
    "Check missing props with === undefined, or the in operator / hasOwn.",
    "Default params run only for undefined, not for null.",
    "Do not return undefined on purpose when null is the domain “no entity.”",
    "void 0 is a reliable undefined value even if the name is shadowed."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Default parameters do not trigger for `null` — `f(null)` keeps null, not the default.",
    "variant": "warning"
  },
  "example": "function f(a, b = 3) { return [a, b]; }\nconsole.log(f(), f(1), f(1, undefined), f(1, null));\nconst o = {};\nconsole.log(o.x, 'x' in o);\nconsole.log((() => {})());",
  "exampleCaption": "undefined in params, properties, and returns",
  "internals": [
    "Unresolvable references GetValue to undefined in some sloppy cases; strict throws on bare assignment.",
    "Missing property OrdinaryGet returns undefined without throwing.",
    "Completion [[Value]] undefined is the default for statements that do not produce a value."
  ],
  "takeaways": [
    "Check missing props with === undefined, or the in operator / hasOwn.",
    "Default params run only for undefined, not for null.",
    "Default parameters do not trigger for `null` — `f(null)` keeps null, not the default.",
    "Unresolvable references GetValue to undefined in some sloppy cases; strict throws on bare assignment."
  ],
  "revision": [
    "undefined: The default empty of the language. If you did not put a value, JS fills undefined — unless you used null on purpose.",
    "Check missing props with === undefined, or the in operator / hasOwn.",
    "Default params run only for undefined, not for null.",
    "Do not return undefined on purpose when null is the domain “no entity.”",
    "Trap: Default parameters do not trigger for `null` — `f(null)` keeps null, not the default."
  ],
  "flashcards": [
    [
      "undefined",
      "undefined means “this binding/property/argument has no value.” Uninitialized `let` after declaration (`let x`), missing arguments, missing object properties, and functions without return all yield undefined."
    ],
    [
      "Mental model",
      "The default empty of the language. If you did not put a value, JS fills undefined — unless you used null on purpose."
    ],
    [
      "Common trap",
      "Default parameters do not trigger for `null` — `f(null)` keeps null, not the default."
    ],
    [
      "Check missing props with === undefined, or the in operator / hasOwn.",
      "Default params run only for undefined, not for null."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is undefined and where does a beginner first see it?",
      "answerHint": "undefined means “this binding/property/argument has no value.” Uninitialized `let` after declaration (`let x`), missing arguments, missing object properties, and functions without return all yield undefined. It is a primitive, typeof \"undefined\". The global `undefined` can be shadowed as a variable name (do not)."
    },
    {
      "level": "intermediate",
      "question": "Walk through how undefined works and name the main pitfall.",
      "answerHint": "Check missing props with === undefined, or the in operator / hasOwn. Default params run only for undefined, not for null. Do not return undefined on purpose when null is the domain “no entity.” void 0 is a reliable undefined value even if the name is shadowed. Pitfall: Default parameters do not trigger for `null` — `f(null)` keeps null, not the default."
    },
    {
      "level": "advanced",
      "question": "How would you explain undefined at an interview, including engine/spec details?",
      "answerHint": "Unresolvable references GetValue to undefined in some sloppy cases; strict throws on bare assignment. Missing property OrdinaryGet returns undefined without throwing. Completion [[Value]] undefined is the default for statements that do not produce a value."
    }
  ],
  "pitfalls": [
    "Default parameters do not trigger for `null` — `f(null)` keeps null, not the default.",
    "void 0 is a reliable undefined value even if the name is shadowed."
  ],
  "interview": {
    "expectations": [
      "Explain undefined without mixing it up with a nearby B1.3 — Types & Values topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Unresolvable references GetValue to undefined in some sloppy cases; strict throws on bare assignment."
    ],
    "commonQuestions": [
      "What is undefined?",
      "Why does JavaScript undefined behave this way?",
      "What is the classic undefined interview trap?"
    ],
    "traps": [
      "Default parameters do not trigger for `null` — `f(null)` keeps null, not the default."
    ],
    "misconceptions": [
      "Dynamic objects and optional arguments need a distinct “nothing was provided” that is not null’s “author meant empty.”"
    ],
    "strongSignals": [
      "Separates undefined from lookalike APIs and can draw the mental model."
    ]
  }
})
