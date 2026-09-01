import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "var Hoisting",
  "whatIsIt": "var bindings are created as undefined for the whole function (or global script) during instantiation. Duplicate var merge. Blocks do not matter. Assignment happens at the var line (or for loop init). function + var same name interactions are a sloppy-mode mess.",
  "whyExists": "1995 JS implemented function-wide storage. ‘Hoisting’ is how we describe that allocation timing.",
  "mentalModel": "At function entry, every var name is already a slot filled with undefined. Later lines just write those slots.",
  "how": [
    "Do not use var.",
    "If you must read a puzzle: look at the whole function for every var.",
    "for (var i) leaves i after the loop.",
    "typeof varName above the line is 'undefined', not ReferenceError."
  ],
  "callout": {
    "title": "Watch for",
    "text": "if (false) { var a = 1 } still declares a for the function — the initializer does not run.",
    "variant": "warning"
  },
  "example": "function f() {\n  console.log(a);\n  if (false) { var a = 1; }\n  console.log(a);\n  var a = 2;\n  console.log(a);\n}\nf();\n",
  "exampleCaption": "var a exists even inside a false if",
  "internals": [
    "VarDeclaredNames are collected from the whole function, including nested blocks (not nested functions).",
    "InitializeBinding(undefined) in VariableInstantiation.",
    "Nested functions have their own var environments."
  ],
  "takeaways": [
    "Do not use var.",
    "If you must read a puzzle: look at the whole function for every var.",
    "if (false) { var a = 1 } still declares a for the function — the initializer does not run.",
    "VarDeclaredNames are collected from the whole function, including nested blocks (not nested functions)."
  ],
  "revision": [
    "var Hoisting: At function entry, every var name is already a slot filled with undefined. Later lines just write those slots.",
    "Do not use var.",
    "If you must read a puzzle: look at the whole function for every var.",
    "for (var i) leaves i after the loop.",
    "Trap: if (false) { var a = 1 } still declares a for the function — the initializer does not run."
  ],
  "flashcards": [
    [
      "var Hoisting",
      "var bindings are created as undefined for the whole function (or global script) during instantiation."
    ],
    [
      "Mental model",
      "At function entry, every var name is already a slot filled with undefined. Later lines just write those slots."
    ],
    [
      "Common trap",
      "if (false) { var a = 1 } still declares a for the function — the initializer does not run."
    ],
    [
      "Do not use var.",
      "If you must read a puzzle: look at the whole function for every var."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is var Hoisting and where does a beginner first see it?",
      "answerHint": "var bindings are created as undefined for the whole function (or global script) during instantiation. Duplicate var merge. Blocks do not matter. Assignment happens at the var line (or for loop init). function + var same name interactions are a sloppy-mode mess."
    },
    {
      "level": "intermediate",
      "question": "Walk through how var Hoisting works and name the main pitfall.",
      "answerHint": "Do not use var. If you must read a puzzle: look at the whole function for every var. for (var i) leaves i after the loop. typeof varName above the line is 'undefined', not ReferenceError. Pitfall: if (false) { var a = 1 } still declares a for the function — the initializer does not run."
    },
    {
      "level": "advanced",
      "question": "How would you explain var Hoisting at an interview, including engine/spec details?",
      "answerHint": "VarDeclaredNames are collected from the whole function, including nested blocks (not nested functions). InitializeBinding(undefined) in VariableInstantiation. Nested functions have their own var environments."
    }
  ],
  "pitfalls": [
    "if (false) { var a = 1 } still declares a for the function — the initializer does not run.",
    "typeof varName above the line is 'undefined', not ReferenceError."
  ],
  "interview": {
    "expectations": [
      "Explain var Hoisting without mixing it up with a nearby B1.11 — Hoisting & Temporal Dead Zone topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "VarDeclaredNames are collected from the whole function, including nested blocks (not nested functions)."
    ],
    "commonQuestions": [
      "What is var Hoisting?",
      "Why does JavaScript var hoisting behave this way?",
      "What is the classic var Hoisting interview trap?"
    ],
    "traps": [
      "if (false) { var a = 1 } still declares a for the function — the initializer does not run."
    ],
    "misconceptions": [
      "1995 JS implemented function-wide storage. ‘Hoisting’ is how we describe that allocation timing."
    ],
    "strongSignals": [
      "Separates var Hoisting from lookalike APIs and can draw the mental model."
    ]
  }
})
