import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Function Scope",
  "whatIsIt": "Function scope means a `var` or a function declaration (in classic sloppy rules) is visible throughout the enclosing function body, including before the line and outside inner blocks. Parameters are also function-scoped names. Nested functions each have their own function scope.",
  "whyExists": "The first JS mental model was “a function is the privacy boundary.” That matched how `var` and `function` were implemented.",
  "mentalModel": "The function is a room. var names are on the wall of the room, not inside the cabinets (blocks).",
  "how": [
    "Draw the function brace pair; that is the var visibility region.",
    "Inner functions do not see each other’s vars unless nested.",
    "Blocks do not hide var.",
    "Switch to let/const when you want cabinet-level privacy."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Thinking an `if` block hides `var` like Java — it does not.",
    "variant": "warning"
  },
  "example": "function outer(x) {\n  if (x > 0) {\n    var msg = 'positive';\n  } else {\n    var msg = 'not';\n  }\n  console.log(msg);\n  function inner() { return x; }\n  return inner;\n}\nconst fn = outer(5);\nconsole.log(fn());",
  "exampleCaption": "var msg visible after if/else",
  "internals": [
    "Function VariableEnvironment is created on invocation and holds var/params.",
    "Nested functions get their own VariableEnvironment linked via [[Environment]].",
    "eval in sloppy mode can still inject var into that function environment."
  ],
  "takeaways": [
    "Draw the function brace pair; that is the var visibility region.",
    "Inner functions do not see each other’s vars unless nested.",
    "Thinking an `if` block hides `var` like Java — it does not.",
    "Function VariableEnvironment is created on invocation and holds var/params."
  ],
  "revision": [
    "Function Scope: The function is a room. var names are on the wall of the room, not inside the cabinets (blocks).",
    "Draw the function brace pair; that is the var visibility region.",
    "Inner functions do not see each other’s vars unless nested.",
    "Blocks do not hide var.",
    "Trap: Thinking an `if` block hides `var` like Java — it does not."
  ],
  "flashcards": [
    [
      "Function Scope",
      "Function scope means a `var` or a function declaration (in classic sloppy rules) is visible throughout the enclosing function body, including before the line and outside inner blocks."
    ],
    [
      "Mental model",
      "The function is a room. var names are on the wall of the room, not inside the cabinets (blocks)."
    ],
    [
      "Common trap",
      "Thinking an `if` block hides `var` like Java — it does not."
    ],
    [
      "Draw the function brace pair; that is the var visibility region.",
      "Inner functions do not see each other’s vars unless nested."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Function Scope and where does a beginner first see it?",
      "answerHint": "Function scope means a `var` or a function declaration (in classic sloppy rules) is visible throughout the enclosing function body, including before the line and outside inner blocks. Parameters are also function-scoped names. Nested functions each have their own function scope."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Function Scope works and name the main pitfall.",
      "answerHint": "Draw the function brace pair; that is the var visibility region. Inner functions do not see each other’s vars unless nested. Blocks do not hide var. Switch to let/const when you want cabinet-level privacy. Pitfall: Thinking an `if` block hides `var` like Java — it does not."
    },
    {
      "level": "advanced",
      "question": "How would you explain Function Scope at an interview, including engine/spec details?",
      "answerHint": "Function VariableEnvironment is created on invocation and holds var/params. Nested functions get their own VariableEnvironment linked via [[Environment]]. eval in sloppy mode can still inject var into that function environment."
    }
  ],
  "pitfalls": [
    "Thinking an `if` block hides `var` like Java — it does not.",
    "Switch to let/const when you want cabinet-level privacy."
  ],
  "interview": {
    "expectations": [
      "Explain Function Scope without mixing it up with a nearby B1.2 — Variables & Declarations topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Function VariableEnvironment is created on invocation and holds var/params."
    ],
    "commonQuestions": [
      "What is Function Scope?",
      "Why does JavaScript function scope behave this way?",
      "What is the classic Function Scope interview trap?"
    ],
    "traps": [
      "Thinking an `if` block hides `var` like Java — it does not."
    ],
    "misconceptions": [
      "The first JS mental model was “a function is the privacy boundary.” That matched how `var` and `function` were implemented."
    ],
    "strongSignals": [
      "Separates Function Scope from lookalike APIs and can draw the mental model."
    ]
  }
})
