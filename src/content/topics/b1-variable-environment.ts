import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Variable / Lexical Environment",
  "whatIsIt": "The spec distinguishes VariableEnvironment (var, function declarations, arguments in sloppy) and LexicalEnvironment (let/const/block, plus usually the same as VE in simple functions). They diverge with catch, with, and eval. Most teaching just says ‘environment.’ Knowing both helps explain why var ignores blocks.",
  "whyExists": "var needed a stable home for the whole function even as lexical environments nested for blocks.",
  "mentalModel": "VE = the function’s var closet. LE = the current nested closet. let uses LE; var is stuffed in VE.",
  "how": [
    "var always in the function VE.",
    "let in the current block LE.",
    "You almost never access these names in code — they are spec.",
    "with() temporarily prepends an object LE (banned in strict)."
  ],
  "callout": {
    "title": "Watch for",
    "text": "catch (e) { let e } is a syntax error — the catch binding and inner let clash in related environments.",
    "variant": "warning"
  },
  "example": "function demo() {\n  var a = 1;\n  {\n    let b = 2;\n    var c = 3;\n    console.log(a, b, c);\n  }\n  console.log(a, c);\n  try { console.log(b); } catch (e) { console.log(e.name); }\n}\ndemo();\n",
  "exampleCaption": "var in function VE vs let in block LE",
  "internals": [
    "FunctionDeclarationInstantiation initializes VE.",
    "BlockDeclarationInstantiation pushes a new LE.",
    "Eval in sloppy can create var bindings on the VE."
  ],
  "takeaways": [
    "var always in the function VE.",
    "let in the current block LE.",
    "catch (e) { let e } is a syntax error — the catch binding and inner let clash in related environments.",
    "FunctionDeclarationInstantiation initializes VE."
  ],
  "revision": [
    "Variable / Lexical Environment: VE = the function’s var closet. LE = the current nested closet. let uses LE; var is stuffed in VE.",
    "var always in the function VE.",
    "let in the current block LE.",
    "You almost never access these names in code — they are spec.",
    "Trap: catch (e) { let e } is a syntax error — the catch binding and inner let clash in related environments."
  ],
  "flashcards": [
    [
      "Variable / Lexical Environment",
      "The spec distinguishes VariableEnvironment (var, function declarations, arguments in sloppy) and LexicalEnvironment (let/const/block, plus usually the same as VE in simple functions)."
    ],
    [
      "Mental model",
      "VE = the function’s var closet. LE = the current nested closet. let uses LE; var is stuffed in VE."
    ],
    [
      "Common trap",
      "catch (e) { let e } is a syntax error — the catch binding and inner let clash in related environments."
    ],
    [
      "var always in the function VE.",
      "let in the current block LE."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Variable / Lexical Environment and where does a beginner first see it?",
      "answerHint": "The spec distinguishes VariableEnvironment (var, function declarations, arguments in sloppy) and LexicalEnvironment (let/const/block, plus usually the same as VE in simple functions). They diverge with catch, with, and eval. Most teaching just says ‘environment.’ Knowing both helps explain why var ignores blocks."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Variable / Lexical Environment works and name the main pitfall.",
      "answerHint": "var always in the function VE. let in the current block LE. You almost never access these names in code — they are spec. with() temporarily prepends an object LE (banned in strict). Pitfall: catch (e) { let e } is a syntax error — the catch binding and inner let clash in related environments."
    },
    {
      "level": "advanced",
      "question": "How would you explain Variable / Lexical Environment at an interview, including engine/spec details?",
      "answerHint": "FunctionDeclarationInstantiation initializes VE. BlockDeclarationInstantiation pushes a new LE. Eval in sloppy can create var bindings on the VE."
    }
  ],
  "pitfalls": [
    "catch (e) { let e } is a syntax error — the catch binding and inner let clash in related environments.",
    "with() temporarily prepends an object LE (banned in strict)."
  ],
  "interview": {
    "expectations": [
      "Explain Variable / Lexical Environment without mixing it up with a nearby B1.23 — Execution Context topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "FunctionDeclarationInstantiation initializes VE."
    ],
    "commonQuestions": [
      "What is Variable / Lexical Environment?",
      "Why does JavaScript variable / lexical environment behave this way?",
      "What is the classic Variable / Lexical Environment interview trap?"
    ],
    "traps": [
      "catch (e) { let e } is a syntax error — the catch binding and inner let clash in related environments."
    ],
    "misconceptions": [
      "var needed a stable home for the whole function even as lexical environments nested for blocks."
    ],
    "strongSignals": [
      "Separates Variable / Lexical Environment from lookalike APIs and can draw the mental model."
    ]
  }
})
