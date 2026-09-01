import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "boolean",
  "whatIsIt": "boolean has two values: true and false. Many operators produce booleans (`===`, `!`, `instanceof`). Conditions (`if`, `while`, `?:`) coerce with ToBoolean, so non-booleans also work. Boolean objects (`new Boolean(false)`) are truthy — never use them.",
  "whyExists": "Control flow needs a yes/no value. The primitive keeps that without allocating an object.",
  "mentalModel": "A 1-bit flag. Wrapper objects are impostors: they are objects, therefore truthy even when they wrap false.",
  "how": [
    "Prefer `===` / `!==` over truthiness when the value might be 0, \"\", or null.",
    "Use `Boolean(x)` or `!!x` for explicit conversion.",
    "Never `new Boolean()`.",
    "APIs should return real booleans, not 0/1, unless documented."
  ],
  "callout": {
    "title": "Watch for",
    "text": "`if (new Boolean(false))` runs the then-branch — a classic interview gotcha.",
    "variant": "warning"
  },
  "example": "console.log(Boolean(0), Boolean('0'), Boolean([]), Boolean({}));\nconst boxed = new Boolean(false);\nif (boxed) console.log('boxed is truthy');\nconsole.log(true === 1, true == 1);",
  "exampleCaption": "ToBoolean vs boxed Boolean vs ==",
  "internals": [
    "ToBoolean: false, 0, -0, 0n, \"\", null, undefined, NaN are false; everything else true.",
    "Boolean objects have [[BooleanData]] internal slot; ToBoolean on objects is true.",
    "Logical operators return operands, not necessarily booleans."
  ],
  "takeaways": [
    "Prefer `===` / `!==` over truthiness when the value might be 0, \"\", or null.",
    "Use `Boolean(x)` or `!!x` for explicit conversion.",
    "`if (new Boolean(false))` runs the then-branch — a classic interview gotcha.",
    "ToBoolean: false, 0, -0, 0n, \"\", null, undefined, NaN are false; everything else true."
  ],
  "revision": [
    "boolean: A 1-bit flag. Wrapper objects are impostors: they are objects, therefore truthy even when they wrap false.",
    "Prefer `===` / `!==` over truthiness when the value might be 0, \"\", or null.",
    "Use `Boolean(x)` or `!!x` for explicit conversion.",
    "Never `new Boolean()`.",
    "Trap: `if (new Boolean(false))` runs the then-branch — a classic interview gotcha."
  ],
  "flashcards": [
    [
      "boolean",
      "boolean has two values: true and false."
    ],
    [
      "Mental model",
      "A 1-bit flag. Wrapper objects are impostors: they are objects, therefore truthy even when they wrap false."
    ],
    [
      "Common trap",
      "`if (new Boolean(false))` runs the then-branch — a classic interview gotcha."
    ],
    [
      "Prefer `===` / `!==` over truthiness when the value might be 0, \"\", or null.",
      "Use `Boolean(x)` or `!!x` for explicit conversion."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is boolean and where does a beginner first see it?",
      "answerHint": "boolean has two values: true and false. Many operators produce booleans (`===`, `!`, `instanceof`). Conditions (`if`, `while`, `?:`) coerce with ToBoolean, so non-booleans also work. Boolean objects (`new Boolean(false)`) are truthy — never use them."
    },
    {
      "level": "intermediate",
      "question": "Walk through how boolean works and name the main pitfall.",
      "answerHint": "Prefer `===` / `!==` over truthiness when the value might be 0, \"\", or null. Use `Boolean(x)` or `!!x` for explicit conversion. Never `new Boolean()`. APIs should return real booleans, not 0/1, unless documented. Pitfall: `if (new Boolean(false))` runs the then-branch — a classic interview gotcha."
    },
    {
      "level": "advanced",
      "question": "How would you explain boolean at an interview, including engine/spec details?",
      "answerHint": "ToBoolean: false, 0, -0, 0n, \"\", null, undefined, NaN are false; everything else true. Boolean objects have [[BooleanData]] internal slot; ToBoolean on objects is true. Logical operators return operands, not necessarily booleans."
    }
  ],
  "pitfalls": [
    "`if (new Boolean(false))` runs the then-branch — a classic interview gotcha.",
    "APIs should return real booleans, not 0/1, unless documented."
  ],
  "interview": {
    "expectations": [
      "Explain boolean without mixing it up with a nearby B1.3 — Types & Values topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "ToBoolean: false, 0, -0, 0n, \"\", null, undefined, NaN are false; everything else true."
    ],
    "commonQuestions": [
      "What is boolean?",
      "Why does JavaScript boolean behave this way?",
      "What is the classic boolean interview trap?"
    ],
    "traps": [
      "`if (new Boolean(false))` runs the then-branch — a classic interview gotcha."
    ],
    "misconceptions": [
      "Control flow needs a yes/no value. The primitive keeps that without allocating an object."
    ],
    "strongSignals": [
      "Separates boolean from lookalike APIs and can draw the mental model."
    ]
  }
})
