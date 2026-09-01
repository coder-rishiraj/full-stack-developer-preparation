import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "let",
  "whatIsIt": "`let` declares a block-scoped mutable binding. It is hoisted to the block but stays in the Temporal Dead Zone until the declaration executes. It does not become a `window` property at top level. Loops with `let` get a new binding per iteration, which fixes the closure-in-loop bug.",
  "whyExists": "ES2015 needed C-like block scope without breaking `var`. `let` is the mutable half of that design.",
  "mentalModel": "A mailbox that exists only between `{ }`, locked until the `let` line runs, and duplicated each time a for-loop iterates.",
  "how": [
    "Use let when the name must be reassigned (counters, accumulators).",
    "Keep lets in the smallest block that needs them.",
    "Do not access let before its line.",
    "for (let i) closures capture that iteration’s i."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Assuming `let` is not hoisted. It is hoisted, but TDZ makes early access throw instead of undefined.",
    "variant": "warning"
  },
  "example": "let n = 0;\nn += 1;\n{\n  let n = 99; // inner block\n  console.log('inner', n);\n}\nconsole.log('outer', n);\nconst fns = [];\nfor (let i = 0; i < 3; i++) fns.push(() => i);\nconsole.log(fns.map((f) => f())); // [0,1,2]",
  "exampleCaption": "Block scope and per-iteration let",
  "internals": [
    "LexicalEnvironment of the block holds let bindings.",
    "Per-iteration bindings: ForBodyEvaluation creates a new environment each loop.",
    "Global let is in the global lexical environment, not as a window data property."
  ],
  "takeaways": [
    "Use let when the name must be reassigned (counters, accumulators).",
    "Keep lets in the smallest block that needs them.",
    "Assuming `let` is not hoisted. It is hoisted, but TDZ makes early access throw instead of undefined.",
    "LexicalEnvironment of the block holds let bindings."
  ],
  "revision": [
    "let: A mailbox that exists only between `{ }`, locked until the `let` line runs, and duplicated each time a for-loop iterates.",
    "Use let when the name must be reassigned (counters, accumulators).",
    "Keep lets in the smallest block that needs them.",
    "Do not access let before its line.",
    "Trap: Assuming `let` is not hoisted. It is hoisted, but TDZ makes early access throw instead of undefined."
  ],
  "flashcards": [
    [
      "let",
      "`let` declares a block-scoped mutable binding."
    ],
    [
      "Mental model",
      "A mailbox that exists only between `{ }`, locked until the `let` line runs, and duplicated each time a for-loop iterates."
    ],
    [
      "Common trap",
      "Assuming `let` is not hoisted. It is hoisted, but TDZ makes early access throw instead of undefined."
    ],
    [
      "Use let when the name must be reassigned (counters, accumulators).",
      "Keep lets in the smallest block that needs them."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is let and where does a beginner first see it?",
      "answerHint": "`let` declares a block-scoped mutable binding. It is hoisted to the block but stays in the Temporal Dead Zone until the declaration executes. It does not become a `window` property at top level. Loops with `let` get a new binding per iteration, which fixes the closure-in-loop bug."
    },
    {
      "level": "intermediate",
      "question": "Walk through how let works and name the main pitfall.",
      "answerHint": "Use let when the name must be reassigned (counters, accumulators). Keep lets in the smallest block that needs them. Do not access let before its line. for (let i) closures capture that iteration’s i. Pitfall: Assuming `let` is not hoisted. It is hoisted, but TDZ makes early access throw instead of undefined."
    },
    {
      "level": "advanced",
      "question": "How would you explain let at an interview, including engine/spec details?",
      "answerHint": "LexicalEnvironment of the block holds let bindings. Per-iteration bindings: ForBodyEvaluation creates a new environment each loop. Global let is in the global lexical environment, not as a window data property."
    }
  ],
  "pitfalls": [
    "Assuming `let` is not hoisted. It is hoisted, but TDZ makes early access throw instead of undefined.",
    "for (let i) closures capture that iteration’s i."
  ],
  "interview": {
    "expectations": [
      "Explain let without mixing it up with a nearby B1.2 — Variables & Declarations topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "LexicalEnvironment of the block holds let bindings."
    ],
    "commonQuestions": [
      "What is let?",
      "Why does JavaScript let behave this way?",
      "What is the classic let interview trap?"
    ],
    "traps": [
      "Assuming `let` is not hoisted. It is hoisted, but TDZ makes early access throw instead of undefined."
    ],
    "misconceptions": [
      "ES2015 needed C-like block scope without breaking `var`. `let` is the mutable half of that design."
    ],
    "strongSignals": [
      "Separates let from lookalike APIs and can draw the mental model."
    ]
  }
})
