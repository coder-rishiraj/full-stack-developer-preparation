import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "var vs let vs const",
  "whatIsIt": "var is function-scoped, hoisted to undefined, redeclarable, and can attach to window. let is block-scoped, mutable, TDZ. const is block-scoped, immutable binding, TDZ, required initializer. Modern style: const by default, let when needed, never var except when maintaining old code or documenting a puzzle.",
  "whyExists": "Three keywords exist because the language evolved: 1995 function scope, then 2015 lexical scope with a mutable/immutable split.",
  "mentalModel": "var = whole function flask. let = block flask you can refill. const = block flask sealed at the cork (contents of objects still slosh).",
  "how": [
    "Ask: does the binding need to change? If no, const.",
    "Ask: should this name die at the closing brace? If yes, let/const not var.",
    "Ask: is this a loop closure? Use let/const, not var.",
    "Top-level: let/const do not create window.x; var does in classic scripts."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Saying “const is block scope, let is function scope” — both are block scope.",
    "variant": "warning"
  },
  "example": "function compare() {\n  var a = 1;\n  let b = 2;\n  const c = 3;\n  if (true) {\n    var a = 10; // same a\n    let b = 20; // inner b\n    console.log('if', a, b, c);\n  }\n  console.log('fn', a, b, c);\n}\ncompare();",
  "exampleCaption": "Same names: var merges, let shadows",
  "internals": [
    "VarScopedDeclarations vs LexicallyScopedDeclarations in spec instantiation.",
    "Global object vs global lexical environment explain window visibility.",
    "Annex B function-in-block rules make sloppy-mode functions extra confusing vs let."
  ],
  "takeaways": [
    "Ask: does the binding need to change? If no, const.",
    "Ask: should this name die at the closing brace? If yes, let/const not var.",
    "Saying “const is block scope, let is function scope” — both are block scope.",
    "VarScopedDeclarations vs LexicallyScopedDeclarations in spec instantiation."
  ],
  "revision": [
    "var vs let vs const: var = whole function flask. let = block flask you can refill. const = block flask sealed at the cork (contents of objects still slosh).",
    "Ask: does the binding need to change? If no, const.",
    "Ask: should this name die at the closing brace? If yes, let/const not var.",
    "Ask: is this a loop closure? Use let/const, not var.",
    "Trap: Saying “const is block scope, let is function scope” — both are block scope."
  ],
  "flashcards": [
    [
      "var vs let vs const",
      "var is function-scoped, hoisted to undefined, redeclarable, and can attach to window."
    ],
    [
      "Mental model",
      "var = whole function flask. let = block flask you can refill. const = block flask sealed at the cork (contents of objects still slosh)."
    ],
    [
      "Common trap",
      "Saying “const is block scope, let is function scope” — both are block scope."
    ],
    [
      "Ask: does the binding need to change? If no, const.",
      "Ask: should this name die at the closing brace? If yes, let/const not var."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is var vs let vs const and where does a beginner first see it?",
      "answerHint": "var is function-scoped, hoisted to undefined, redeclarable, and can attach to window. let is block-scoped, mutable, TDZ. const is block-scoped, immutable binding, TDZ, required initializer. Modern style: const by default, let when needed, never var except when maintaining old code or documenting a puzzle."
    },
    {
      "level": "intermediate",
      "question": "Walk through how var vs let vs const works and name the main pitfall.",
      "answerHint": "Ask: does the binding need to change? If no, const. Ask: should this name die at the closing brace? If yes, let/const not var. Ask: is this a loop closure? Use let/const, not var. Top-level: let/const do not create window.x; var does in classic scripts. Pitfall: Saying “const is block scope, let is function scope” — both are block scope."
    },
    {
      "level": "advanced",
      "question": "How would you explain var vs let vs const at an interview, including engine/spec details?",
      "answerHint": "VarScopedDeclarations vs LexicallyScopedDeclarations in spec instantiation. Global object vs global lexical environment explain window visibility. Annex B function-in-block rules make sloppy-mode functions extra confusing vs let."
    }
  ],
  "pitfalls": [
    "Saying “const is block scope, let is function scope” — both are block scope.",
    "Top-level: let/const do not create window.x; var does in classic scripts."
  ],
  "interview": {
    "expectations": [
      "Explain var vs let vs const without mixing it up with a nearby B1.2 — Variables & Declarations topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "VarScopedDeclarations vs LexicallyScopedDeclarations in spec instantiation."
    ],
    "commonQuestions": [
      "What is var vs let vs const?",
      "Why does JavaScript var vs let vs const behave this way?",
      "What is the classic var vs let vs const interview trap?"
    ],
    "traps": [
      "Saying “const is block scope, let is function scope” — both are block scope."
    ],
    "misconceptions": [
      "Three keywords exist because the language evolved: 1995 function scope, then 2015 lexical scope with a mutable/immutable split."
    ],
    "strongSignals": [
      "Separates var vs let vs const from lookalike APIs and can draw the mental model."
    ]
  }
})
