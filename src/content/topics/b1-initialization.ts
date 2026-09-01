import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Initialization",
  "whatIsIt": "Initialization sets a binding’s first value. `let x;` initializes to `undefined` when that statement executes. `const` requires an initializer. `var x;` is initialized to `undefined` at function/script instantiation, before any line runs. Reading let/const before initialization is a TDZ error, not undefined.",
  "whyExists": "Bindings need a defined start state so the engine can distinguish “not yet born” (TDZ) from “born but empty” (undefined).",
  "mentalModel": "var mailboxes exist empty at the start of the function. let mailboxes exist but are locked until you pass the declaration line.",
  "how": [
    "Write initializers on the same line when you know the value.",
    "Split declaration and init only when the value depends on a branch.",
    "Never use a let/const above its declaration in the same scope.",
    "`const` cannot be initialized later — it is not “declare now, fill later.”"
  ],
  "callout": {
    "title": "Watch for",
    "text": "Logging a let in a default parameter of the same function can hit TDZ because parameters initialize first.",
    "variant": "warning"
  },
  "example": "var v;\nconsole.log('var', v);\nlet w = 1;\nconsole.log('let', w);\nconst c = { n: 2 };\nconsole.log('const', c.n);\nfunction demo() {\n  // console.log(x); // ReferenceError TDZ\n  let x = 3;\n  return x;\n}\nconsole.log(demo());",
  "exampleCaption": "var is undefined early; let/const wait for their line",
  "internals": [
    "InitializeBinding happens at the declaration evaluation for let/const.",
    "var CreateMutableBinding + InitializeBinding(undefined) occur in VariableInstantiation.",
    "Class declarations are lexical and TDZ until evaluated, like let."
  ],
  "takeaways": [
    "Write initializers on the same line when you know the value.",
    "Split declaration and init only when the value depends on a branch.",
    "Logging a let in a default parameter of the same function can hit TDZ because parameters initialize first.",
    "InitializeBinding happens at the declaration evaluation for let/const."
  ],
  "revision": [
    "Initialization: var mailboxes exist empty at the start of the function. let mailboxes exist but are locked until you pass the declaration line.",
    "Write initializers on the same line when you know the value.",
    "Split declaration and init only when the value depends on a branch.",
    "Never use a let/const above its declaration in the same scope.",
    "Trap: Logging a let in a default parameter of the same function can hit TDZ because parameters initialize first."
  ],
  "flashcards": [
    [
      "Initialization",
      "Initialization sets a binding’s first value."
    ],
    [
      "Mental model",
      "var mailboxes exist empty at the start of the function. let mailboxes exist but are locked until you pass the declaration line."
    ],
    [
      "Common trap",
      "Logging a let in a default parameter of the same function can hit TDZ because parameters initialize first."
    ],
    [
      "Write initializers on the same line when you know the value.",
      "Split declaration and init only when the value depends on a branch."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Initialization and where does a beginner first see it?",
      "answerHint": "Initialization sets a binding’s first value. `let x;` initializes to `undefined` when that statement executes. `const` requires an initializer. `var x;` is initialized to `undefined` at function/script instantiation, before any line runs. Reading let/const before initialization is a TDZ error, not undefined."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Initialization works and name the main pitfall.",
      "answerHint": "Write initializers on the same line when you know the value. Split declaration and init only when the value depends on a branch. Never use a let/const above its declaration in the same scope. `const` cannot be initialized later — it is not “declare now, fill later.” Pitfall: Logging a let in a default parameter of the same function can hit TDZ because parameters initialize first."
    },
    {
      "level": "advanced",
      "question": "How would you explain Initialization at an interview, including engine/spec details?",
      "answerHint": "InitializeBinding happens at the declaration evaluation for let/const. var CreateMutableBinding + InitializeBinding(undefined) occur in VariableInstantiation. Class declarations are lexical and TDZ until evaluated, like let."
    }
  ],
  "pitfalls": [
    "Logging a let in a default parameter of the same function can hit TDZ because parameters initialize first.",
    "`const` cannot be initialized later — it is not “declare now, fill later.”"
  ],
  "interview": {
    "expectations": [
      "Explain Initialization without mixing it up with a nearby B1.2 — Variables & Declarations topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "InitializeBinding happens at the declaration evaluation for let/const."
    ],
    "commonQuestions": [
      "What is Initialization?",
      "Why does JavaScript initialization behave this way?",
      "What is the classic Initialization interview trap?"
    ],
    "traps": [
      "Logging a let in a default parameter of the same function can hit TDZ because parameters initialize first."
    ],
    "misconceptions": [
      "Bindings need a defined start state so the engine can distinguish “not yet born” (TDZ) from “born but empty” (undefined)."
    ],
    "strongSignals": [
      "Separates Initialization from lookalike APIs and can draw the mental model."
    ]
  }
})
