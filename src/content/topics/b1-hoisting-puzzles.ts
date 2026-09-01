import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Hoisting Interview Puzzles",
  "whatIsIt": "Interview puzzles mix var undefined, function declarations, duplicate names, default params, and blocks. Recipe: list all var/function in the function, then simulate line by line, applying TDZ for let/const. Nested functions hide inner vars. Annex B function-in-block is the expert-mode trap.",
  "whyExists": "Hiring processes use hoisting because it tests whether you know instantiation vs execution, not trivia about a library.",
  "mentalModel": "Two-pass mental interpreter: allocate, then run. If you only run in your head, you miss var.",
  "how": [
    "Rewrite the function with vars at the top as undefined.",
    "Place function declarations at the top as live functions (same scope).",
    "Then execute assignments and lets.",
    "Watch else-if function declarations in sloppy mode — skip in modern modules."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Assuming the function declaration always wins forever — a later var assignment overwrites the binding.",
    "variant": "warning"
  },
  "example": "var x = 1;\nfunction puzzle() {\n  console.log(x);\n  var x = 2;\n  function x() {}\n  console.log(typeof x, x);\n}\npuzzle();\nfunction mixed() {\n  console.log(typeof f);\n  var f = 3;\n  function f() {}\n  console.log(typeof f, f);\n}\nmixed();\n",
  "exampleCaption": "var + function same name: last function wins then assignment",
  "internals": [
    "When both function and var share a name, instantiation initializes with the function, then var is skipped as already declared.",
    "Evaluation of var x = 2 then assigns 2.",
    "Sloppy block functions may also assign to the enclosing var environment (Annex B)."
  ],
  "takeaways": [
    "Rewrite the function with vars at the top as undefined.",
    "Place function declarations at the top as live functions (same scope).",
    "Assuming the function declaration always wins forever — a later var assignment overwrites the binding.",
    "When both function and var share a name, instantiation initializes with the function, then var is skipped as already declared."
  ],
  "revision": [
    "Hoisting Interview Puzzles: Two-pass mental interpreter: allocate, then run. If you only run in your head, you miss var.",
    "Rewrite the function with vars at the top as undefined.",
    "Place function declarations at the top as live functions (same scope).",
    "Then execute assignments and lets.",
    "Trap: Assuming the function declaration always wins forever — a later var assignment overwrites the binding."
  ],
  "flashcards": [
    [
      "Hoisting Interview Puzzles",
      "Interview puzzles mix var undefined, function declarations, duplicate names, default params, and blocks."
    ],
    [
      "Mental model",
      "Two-pass mental interpreter: allocate, then run. If you only run in your head, you miss var."
    ],
    [
      "Common trap",
      "Assuming the function declaration always wins forever — a later var assignment overwrites the binding."
    ],
    [
      "Rewrite the function with vars at the top as undefined.",
      "Place function declarations at the top as live functions (same scope)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Hoisting Interview Puzzles and where does a beginner first see it?",
      "answerHint": "Interview puzzles mix var undefined, function declarations, duplicate names, default params, and blocks. Recipe: list all var/function in the function, then simulate line by line, applying TDZ for let/const. Nested functions hide inner vars. Annex B function-in-block is the expert-mode trap."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Hoisting Interview Puzzles works and name the main pitfall.",
      "answerHint": "Rewrite the function with vars at the top as undefined. Place function declarations at the top as live functions (same scope). Then execute assignments and lets. Watch else-if function declarations in sloppy mode — skip in modern modules. Pitfall: Assuming the function declaration always wins forever — a later var assignment overwrites the binding."
    },
    {
      "level": "advanced",
      "question": "How would you explain Hoisting Interview Puzzles at an interview, including engine/spec details?",
      "answerHint": "When both function and var share a name, instantiation initializes with the function, then var is skipped as already declared. Evaluation of var x = 2 then assigns 2. Sloppy block functions may also assign to the enclosing var environment (Annex B)."
    }
  ],
  "pitfalls": [
    "Assuming the function declaration always wins forever — a later var assignment overwrites the binding.",
    "Watch else-if function declarations in sloppy mode — skip in modern modules."
  ],
  "interview": {
    "expectations": [
      "Explain Hoisting Interview Puzzles without mixing it up with a nearby B1.11 — Hoisting & Temporal Dead Zone topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "When both function and var share a name, instantiation initializes with the function, then var is skipped as already declared."
    ],
    "commonQuestions": [
      "What is Hoisting Interview Puzzles?",
      "Why does JavaScript hoisting interview puzzles behave this way?",
      "What is the classic Hoisting Interview Puzzles interview trap?"
    ],
    "traps": [
      "Assuming the function declaration always wins forever — a later var assignment overwrites the binding."
    ],
    "misconceptions": [
      "Hiring processes use hoisting because it tests whether you know instantiation vs execution, not trivia about a library."
    ],
    "strongSignals": [
      "Separates Hoisting Interview Puzzles from lookalike APIs and can draw the mental model."
    ]
  }
})
