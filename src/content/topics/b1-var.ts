import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "var",
  "whatIsIt": "`var` declares a function-scoped (or script-scoped) mutable binding, hoisted and initialized to `undefined`. It ignores block braces: a `var` inside `if` or `for` is still visible in the whole function. In browsers, a top-level `var` also becomes a `window` property.",
  "whyExists": "Original JavaScript had only function scope. `var` is that 1995 design, kept forever for compatibility.",
  "mentalModel": "One mailbox for the entire function, created empty at entry, regardless of which block the `var` line sits in.",
  "how": [
    "Prefer let/const; treat var as legacy.",
    "Know that `for (var i)` shares one `i` for all closures.",
    "Redeclaring var is silent — easy to overwrite.",
    "Top-level var in classic scripts pollutes `window`."
  ],
  "callout": {
    "title": "Watch for",
    "text": "The classic setTimeout-in-a-loop puzzle is almost always `var i` shared across iterations.",
    "variant": "warning"
  },
  "example": "function f() {\n  if (true) {\n    var hidden = 1;\n  }\n  console.log(hidden); // 1 — function scoped\n}\nf();\nconsole.log(typeof hidden); // \"undefined\" outside\nfor (var i = 0; i < 2; i++) {}\nconsole.log('i after loop', i);",
  "exampleCaption": "var leaks out of blocks",
  "internals": [
    "VariableEnvironment vs LexicalEnvironment: var uses the VariableEnvironment of the function.",
    "Hoisting: CreateMutableBinding + InitializeBinding(undefined) before evaluation.",
    "Global var creates a configurable object property on the global object (historically)."
  ],
  "takeaways": [
    "Prefer let/const; treat var as legacy.",
    "Know that `for (var i)` shares one `i` for all closures.",
    "The classic setTimeout-in-a-loop puzzle is almost always `var i` shared across iterations.",
    "VariableEnvironment vs LexicalEnvironment: var uses the VariableEnvironment of the function."
  ],
  "revision": [
    "var: One mailbox for the entire function, created empty at entry, regardless of which block the `var` line sits in.",
    "Prefer let/const; treat var as legacy.",
    "Know that `for (var i)` shares one `i` for all closures.",
    "Redeclaring var is silent — easy to overwrite.",
    "Trap: The classic setTimeout-in-a-loop puzzle is almost always `var i` shared across iterations."
  ],
  "flashcards": [
    [
      "var",
      "`var` declares a function-scoped (or script-scoped) mutable binding, hoisted and initialized to `undefined`."
    ],
    [
      "Mental model",
      "One mailbox for the entire function, created empty at entry, regardless of which block the `var` line sits in."
    ],
    [
      "Common trap",
      "The classic setTimeout-in-a-loop puzzle is almost always `var i` shared across iterations."
    ],
    [
      "Prefer let/const; treat var as legacy.",
      "Know that `for (var i)` shares one `i` for all closures."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is var and where does a beginner first see it?",
      "answerHint": "`var` declares a function-scoped (or script-scoped) mutable binding, hoisted and initialized to `undefined`. It ignores block braces: a `var` inside `if` or `for` is still visible in the whole function. In browsers, a top-level `var` also becomes a `window` property."
    },
    {
      "level": "intermediate",
      "question": "Walk through how var works and name the main pitfall.",
      "answerHint": "Prefer let/const; treat var as legacy. Know that `for (var i)` shares one `i` for all closures. Redeclaring var is silent — easy to overwrite. Top-level var in classic scripts pollutes `window`. Pitfall: The classic setTimeout-in-a-loop puzzle is almost always `var i` shared across iterations."
    },
    {
      "level": "advanced",
      "question": "How would you explain var at an interview, including engine/spec details?",
      "answerHint": "VariableEnvironment vs LexicalEnvironment: var uses the VariableEnvironment of the function. Hoisting: CreateMutableBinding + InitializeBinding(undefined) before evaluation. Global var creates a configurable object property on the global object (historically)."
    }
  ],
  "pitfalls": [
    "The classic setTimeout-in-a-loop puzzle is almost always `var i` shared across iterations.",
    "Top-level var in classic scripts pollutes `window`."
  ],
  "interview": {
    "expectations": [
      "Explain var without mixing it up with a nearby B1.2 — Variables & Declarations topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "VariableEnvironment vs LexicalEnvironment: var uses the VariableEnvironment of the function."
    ],
    "commonQuestions": [
      "What is var?",
      "Why does JavaScript var behave this way?",
      "What is the classic var interview trap?"
    ],
    "traps": [
      "The classic setTimeout-in-a-loop puzzle is almost always `var i` shared across iterations."
    ],
    "misconceptions": [
      "Original JavaScript had only function scope. `var` is that 1995 design, kept forever for compatibility."
    ],
    "strongSignals": [
      "Separates var from lookalike APIs and can draw the mental model."
    ]
  }
})
