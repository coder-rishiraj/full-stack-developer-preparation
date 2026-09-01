import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Redeclaration",
  "whatIsIt": "Redeclaration means introducing the same name twice in one scope. `var` may redeclare `var` (and even merge with a function). `let`/`const`/`class` cannot redeclare a lexical name in the same scope. A `var` and a `let` of the same name in one scope is also illegal. Nested scopes may shadow instead of redeclare.",
  "whyExists": "JS kept `var` redeclaration so old scripts concatenating files would not crash. Lexical bindings opted into “one name, one slot” to catch bugs.",
  "mentalModel": "var is a sticky label you can slap on twice. let is a reserved seat: two tickets with the same number are an error.",
  "how": [
    "Do not redeclare let/const in the same block.",
    "Shadow in an inner block if you need a temporary same name.",
    "Avoid `var` so accidental duplicates become syntax errors.",
    "Parameters already occupy names; `let` of the same param name in the body errors."
  ],
  "callout": {
    "title": "Watch for",
    "text": "A `let x` in a block that also has `var x` in the function is a SyntaxError — mixed redeclaration.",
    "variant": "warning"
  },
  "example": "var a = 1;\nvar a = 2; // allowed\nconsole.log(a);\nfunction wrap() {\n  let b = 1;\n  {\n    let b = 2; // shadow, not redeclare\n    console.log('inner', b);\n  }\n  console.log('outer', b);\n}\nwrap();",
  "exampleCaption": "var redeclare vs let shadow",
  "internals": [
    "Early error rules for Duplicate bindings in LexicallyDeclaredNames.",
    "var declarations are merged; FunctionDeclarations in sloppy eval/scripts have extra annex-B behavior.",
    "Catch parameters and let in the catch block cannot clash in the same binding set."
  ],
  "takeaways": [
    "Do not redeclare let/const in the same block.",
    "Shadow in an inner block if you need a temporary same name.",
    "A `let x` in a block that also has `var x` in the function is a SyntaxError — mixed redeclaration.",
    "Early error rules for Duplicate bindings in LexicallyDeclaredNames."
  ],
  "revision": [
    "Redeclaration: var is a sticky label you can slap on twice. let is a reserved seat: two tickets with the same number are an error.",
    "Do not redeclare let/const in the same block.",
    "Shadow in an inner block if you need a temporary same name.",
    "Avoid `var` so accidental duplicates become syntax errors.",
    "Trap: A `let x` in a block that also has `var x` in the function is a SyntaxError — mixed redeclaration."
  ],
  "flashcards": [
    [
      "Redeclaration",
      "Redeclaration means introducing the same name twice in one scope."
    ],
    [
      "Mental model",
      "var is a sticky label you can slap on twice. let is a reserved seat: two tickets with the same number are an error."
    ],
    [
      "Common trap",
      "A `let x` in a block that also has `var x` in the function is a SyntaxError — mixed redeclaration."
    ],
    [
      "Do not redeclare let/const in the same block.",
      "Shadow in an inner block if you need a temporary same name."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Redeclaration and where does a beginner first see it?",
      "answerHint": "Redeclaration means introducing the same name twice in one scope. `var` may redeclare `var` (and even merge with a function). `let`/`const`/`class` cannot redeclare a lexical name in the same scope. A `var` and a `let` of the same name in one scope is also illegal. Nested scopes may shadow instead of redeclare."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Redeclaration works and name the main pitfall.",
      "answerHint": "Do not redeclare let/const in the same block. Shadow in an inner block if you need a temporary same name. Avoid `var` so accidental duplicates become syntax errors. Parameters already occupy names; `let` of the same param name in the body errors. Pitfall: A `let x` in a block that also has `var x` in the function is a SyntaxError — mixed redeclaration."
    },
    {
      "level": "advanced",
      "question": "How would you explain Redeclaration at an interview, including engine/spec details?",
      "answerHint": "Early error rules for Duplicate bindings in LexicallyDeclaredNames. var declarations are merged; FunctionDeclarations in sloppy eval/scripts have extra annex-B behavior. Catch parameters and let in the catch block cannot clash in the same binding set."
    }
  ],
  "pitfalls": [
    "A `let x` in a block that also has `var x` in the function is a SyntaxError — mixed redeclaration.",
    "Parameters already occupy names; `let` of the same param name in the body errors."
  ],
  "interview": {
    "expectations": [
      "Explain Redeclaration without mixing it up with a nearby B1.2 — Variables & Declarations topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Early error rules for Duplicate bindings in LexicallyDeclaredNames."
    ],
    "commonQuestions": [
      "What is Redeclaration?",
      "Why does JavaScript redeclaration behave this way?",
      "What is the classic Redeclaration interview trap?"
    ],
    "traps": [
      "A `let x` in a block that also has `var x` in the function is a SyntaxError — mixed redeclaration."
    ],
    "misconceptions": [
      "JS kept `var` redeclaration so old scripts concatenating files would not crash. Lexical bindings opted into “one name, one slot” to catch bugs."
    ],
    "strongSignals": [
      "Separates Redeclaration from lookalike APIs and can draw the mental model."
    ]
  }
})
