import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "let/const Hoisting",
  "whatIsIt": "let and const are hoisted to the block in the sense that the binding exists for the whole block, but they stay uninitialized until the declaration executes. Access is ReferenceError. const also requires an initializer at that moment. Redeclaring in the same block is a syntax error at parse/instantiate.",
  "whyExists": "Block scope needed to exist for the whole block to shadow correctly, but reading before init should not yield undefined like var.",
  "mentalModel": "Reserved parking spot (shadows others) with a boot on the wheel until the let/const line runs.",
  "how": [
    "Declare at the top of the block if you need to use it throughout.",
    "Do not use a let in the same block above its line.",
    "const cannot split declare/assign.",
    "class follows this TDZ model too."
  ],
  "callout": {
    "title": "Watch for",
    "text": "A ‘temporal dead zone’ is not a time in milliseconds — it is a region of source/runtime until initialization.",
    "variant": "warning"
  },
  "example": "const x = 'outer';\n{\n  try { console.log(x); } catch (e) { console.log(e.name); }\n  let x = 'inner';\n  console.log(x);\n}\nconsole.log(x);\n",
  "exampleCaption": "Inner let hoisted to the block, TDZ hides outer x",
  "internals": [
    "Binding is created uninitialized in BlockDeclarationInstantiation.",
    "InitializeBinding happens in Evaluation of LexicalBinding.",
    "const uses ImmutableBinding."
  ],
  "takeaways": [
    "Declare at the top of the block if you need to use it throughout.",
    "Do not use a let in the same block above its line.",
    "A ‘temporal dead zone’ is not a time in milliseconds — it is a region of source/runtime until initialization.",
    "Binding is created uninitialized in BlockDeclarationInstantiation."
  ],
  "revision": [
    "let/const Hoisting: Reserved parking spot (shadows others) with a boot on the wheel until the let/const line runs.",
    "Declare at the top of the block if you need to use it throughout.",
    "Do not use a let in the same block above its line.",
    "const cannot split declare/assign.",
    "Trap: A ‘temporal dead zone’ is not a time in milliseconds — it is a region of source/runtime until initialization."
  ],
  "flashcards": [
    [
      "let/const Hoisting",
      "let and const are hoisted to the block in the sense that the binding exists for the whole block, but they stay uninitialized until the declaration executes."
    ],
    [
      "Mental model",
      "Reserved parking spot (shadows others) with a boot on the wheel until the let/const line runs."
    ],
    [
      "Common trap",
      "A ‘temporal dead zone’ is not a time in milliseconds — it is a region of source/runtime until initialization."
    ],
    [
      "Declare at the top of the block if you need to use it throughout.",
      "Do not use a let in the same block above its line."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is let/const Hoisting and where does a beginner first see it?",
      "answerHint": "let and const are hoisted to the block in the sense that the binding exists for the whole block, but they stay uninitialized until the declaration executes. Access is ReferenceError. const also requires an initializer at that moment. Redeclaring in the same block is a syntax error at parse/instantiate."
    },
    {
      "level": "intermediate",
      "question": "Walk through how let/const Hoisting works and name the main pitfall.",
      "answerHint": "Declare at the top of the block if you need to use it throughout. Do not use a let in the same block above its line. const cannot split declare/assign. class follows this TDZ model too. Pitfall: A ‘temporal dead zone’ is not a time in milliseconds — it is a region of source/runtime until initialization."
    },
    {
      "level": "advanced",
      "question": "How would you explain let/const Hoisting at an interview, including engine/spec details?",
      "answerHint": "Binding is created uninitialized in BlockDeclarationInstantiation. InitializeBinding happens in Evaluation of LexicalBinding. const uses ImmutableBinding."
    }
  ],
  "pitfalls": [
    "A ‘temporal dead zone’ is not a time in milliseconds — it is a region of source/runtime until initialization.",
    "class follows this TDZ model too."
  ],
  "interview": {
    "expectations": [
      "Explain let/const Hoisting without mixing it up with a nearby B1.11 — Hoisting & Temporal Dead Zone topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Binding is created uninitialized in BlockDeclarationInstantiation."
    ],
    "commonQuestions": [
      "What is let/const Hoisting?",
      "Why does JavaScript let/const hoisting behave this way?",
      "What is the classic let/const Hoisting interview trap?"
    ],
    "traps": [
      "A ‘temporal dead zone’ is not a time in milliseconds — it is a region of source/runtime until initialization."
    ],
    "misconceptions": [
      "Block scope needed to exist for the whole block to shadow correctly, but reading before init should not yield undefined like var."
    ],
    "strongSignals": [
      "Separates let/const Hoisting from lookalike APIs and can draw the mental model."
    ]
  }
})
