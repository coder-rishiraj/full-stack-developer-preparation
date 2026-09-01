import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Creation vs Execution Phase",
  "whatIsIt": "Creation (instantiation) allocates environment records and bindings. Execution (evaluation) runs statements, assigns values, and calls functions. Each function call does both for that function: create its env, then run its body. Mixing the two explains hoisting puzzles.",
  "whyExists": "The spec separates ‘prepare the scope’ from ‘run the code’ so duplicate lexical names can be early errors before any line runs.",
  "mentalModel": "Build the mailbox wall, then deliver mail in order. Reading a let mailbox before delivery is TDZ.",
  "how": [
    "When entering a function, params and vars exist before line 1.",
    "Then the body runs; let initializers fire at their lines.",
    "Loops with let clone environments each iteration during execution.",
    "eval can create bindings during execution in sloppy mode."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Default parameters run in an intermediate scope — they can see later params as TDZ.",
    "variant": "warning"
  },
  "example": "function demo() {\n  console.log('during execution, a is', a);\n  var a = 'assigned';\n  console.log(a);\n}\ndemo();\nfunction order(x = y, y = 1) { return [x, y]; }\ntry { console.log(order()); } catch (e) { console.log('defaults', e.name); }\n",
  "exampleCaption": "var exists in execution; default params have their own order",
  "internals": [
    "PrepareForOrdinaryCall then FunctionDeclarationInstantiation then Evaluate body.",
    "Parameter expressions evaluate before the body, after a parameter environment is created.",
    "Early errors run at parse/instantiate, not as thrown Error at the line."
  ],
  "takeaways": [
    "When entering a function, params and vars exist before line 1.",
    "Then the body runs; let initializers fire at their lines.",
    "Default parameters run in an intermediate scope — they can see later params as TDZ.",
    "PrepareForOrdinaryCall then FunctionDeclarationInstantiation then Evaluate body."
  ],
  "revision": [
    "Creation vs Execution Phase: Build the mailbox wall, then deliver mail in order. Reading a let mailbox before delivery is TDZ.",
    "When entering a function, params and vars exist before line 1.",
    "Then the body runs; let initializers fire at their lines.",
    "Loops with let clone environments each iteration during execution.",
    "Trap: Default parameters run in an intermediate scope — they can see later params as TDZ."
  ],
  "flashcards": [
    [
      "Creation vs Execution Phase",
      "Creation (instantiation) allocates environment records and bindings."
    ],
    [
      "Mental model",
      "Build the mailbox wall, then deliver mail in order. Reading a let mailbox before delivery is TDZ."
    ],
    [
      "Common trap",
      "Default parameters run in an intermediate scope — they can see later params as TDZ."
    ],
    [
      "When entering a function, params and vars exist before line 1.",
      "Then the body runs; let initializers fire at their lines."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Creation vs Execution Phase and where does a beginner first see it?",
      "answerHint": "Creation (instantiation) allocates environment records and bindings. Execution (evaluation) runs statements, assigns values, and calls functions. Each function call does both for that function: create its env, then run its body. Mixing the two explains hoisting puzzles."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Creation vs Execution Phase works and name the main pitfall.",
      "answerHint": "When entering a function, params and vars exist before line 1. Then the body runs; let initializers fire at their lines. Loops with let clone environments each iteration during execution. eval can create bindings during execution in sloppy mode. Pitfall: Default parameters run in an intermediate scope — they can see later params as TDZ."
    },
    {
      "level": "advanced",
      "question": "How would you explain Creation vs Execution Phase at an interview, including engine/spec details?",
      "answerHint": "PrepareForOrdinaryCall then FunctionDeclarationInstantiation then Evaluate body. Parameter expressions evaluate before the body, after a parameter environment is created. Early errors run at parse/instantiate, not as thrown Error at the line."
    }
  ],
  "pitfalls": [
    "Default parameters run in an intermediate scope — they can see later params as TDZ.",
    "eval can create bindings during execution in sloppy mode."
  ],
  "interview": {
    "expectations": [
      "Explain Creation vs Execution Phase without mixing it up with a nearby B1.11 — Hoisting & Temporal Dead Zone topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "PrepareForOrdinaryCall then FunctionDeclarationInstantiation then Evaluate body."
    ],
    "commonQuestions": [
      "What is Creation vs Execution Phase?",
      "Why does JavaScript creation vs execution phase behave this way?",
      "What is the classic Creation vs Execution Phase interview trap?"
    ],
    "traps": [
      "Default parameters run in an intermediate scope — they can see later params as TDZ."
    ],
    "misconceptions": [
      "The spec separates ‘prepare the scope’ from ‘run the code’ so duplicate lexical names can be early errors before any line runs."
    ],
    "strongSignals": [
      "Separates Creation vs Execution Phase from lookalike APIs and can draw the mental model."
    ]
  }
})
