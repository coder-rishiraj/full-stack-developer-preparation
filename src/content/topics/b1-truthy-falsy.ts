import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Truthy and Falsy Values",
  "whatIsIt": "A value is falsy if ToBoolean is false: false, 0, -0, 0n, \"\", null, undefined, NaN. Everything else is truthy, including \"0\", \"false\", [], {}, and empty Map. `if (value)` uses this conversion. Logical &&/|| return operands, not booleans.",
  "whyExists": "Conditions needed to accept any value so `if (name)` could mean “has a non-empty string” in sloppy UI code. The list of falsy values is fixed by the spec.",
  "mentalModel": "A short blacklist of “empty-ish” values. If it is not on the list, the `if` branch runs — even empty arrays.",
  "how": [
    "Memorize the falsy list; do not guess.",
    "Use explicit `=== 0` / `=== \"\"` when those are valid data.",
    "`arr.length` is a number; `if (arr)` is always true for arrays.",
    "`!!value` or Boolean(value) to force a real boolean."
  ],
  "callout": {
    "title": "Watch for",
    "text": "`if ([])` is true — empty array is truthy. `[] == false` is true because of coercion, which contradicts intuition.",
    "variant": "warning"
  },
  "example": "const samples = [false, 0, 0n, '', null, undefined, NaN, '0', [], {}, 'false'];\nfor (const v of samples) {\n  console.log(JSON.stringify(v), Boolean(v));\n}",
  "exampleCaption": "Truthy/falsy of common values",
  "internals": [
    "ToBoolean table is exhaustive in the spec.",
    "Document.all is a falsy object in browsers (deliberate spec exception).",
    "&& and || use ToBoolean internally but return the chosen operand."
  ],
  "takeaways": [
    "Memorize the falsy list; do not guess.",
    "Use explicit `=== 0` / `=== \"\"` when those are valid data.",
    "`if ([])` is true — empty array is truthy. `[] == false` is true because of coercion, which contradicts intuition.",
    "ToBoolean table is exhaustive in the spec."
  ],
  "revision": [
    "Truthy and Falsy Values: A short blacklist of “empty-ish” values. If it is not on the list, the `if` branch runs — even empty arrays.",
    "Memorize the falsy list; do not guess.",
    "Use explicit `=== 0` / `=== \"\"` when those are valid data.",
    "`arr.length` is a number; `if (arr)` is always true for arrays.",
    "Trap: `if ([])` is true — empty array is truthy. `[] == false` is true because of coercion, which contradicts intuition."
  ],
  "flashcards": [
    [
      "Truthy and Falsy Values",
      "A value is falsy if ToBoolean is false: false, 0, -0, 0n, \"\", null, undefined, NaN."
    ],
    [
      "Mental model",
      "A short blacklist of “empty-ish” values. If it is not on the list, the `if` branch runs — even empty arrays."
    ],
    [
      "Common trap",
      "`if ([])` is true — empty array is truthy. `[] == false` is true because of coercion, which contradicts intuition."
    ],
    [
      "Memorize the falsy list; do not guess.",
      "Use explicit `=== 0` / `=== \"\"` when those are valid data."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Truthy and Falsy Values and where does a beginner first see it?",
      "answerHint": "A value is falsy if ToBoolean is false: false, 0, -0, 0n, \"\", null, undefined, NaN. Everything else is truthy, including \"0\", \"false\", [], {}, and empty Map. `if (value)` uses this conversion. Logical &&/|| return operands, not booleans."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Truthy and Falsy Values works and name the main pitfall.",
      "answerHint": "Memorize the falsy list; do not guess. Use explicit `=== 0` / `=== \"\"` when those are valid data. `arr.length` is a number; `if (arr)` is always true for arrays. `!!value` or Boolean(value) to force a real boolean. Pitfall: `if ([])` is true — empty array is truthy. `[] == false` is true because of coercion, which contradicts intuition."
    },
    {
      "level": "advanced",
      "question": "How would you explain Truthy and Falsy Values at an interview, including engine/spec details?",
      "answerHint": "ToBoolean table is exhaustive in the spec. Document.all is a falsy object in browsers (deliberate spec exception). && and || use ToBoolean internally but return the chosen operand."
    }
  ],
  "pitfalls": [
    "`if ([])` is true — empty array is truthy. `[] == false` is true because of coercion, which contradicts intuition.",
    "`!!value` or Boolean(value) to force a real boolean."
  ],
  "interview": {
    "expectations": [
      "Explain Truthy and Falsy Values without mixing it up with a nearby B1.3 — Types & Values topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "ToBoolean table is exhaustive in the spec."
    ],
    "commonQuestions": [
      "What is Truthy and Falsy Values?",
      "Why does JavaScript truthy and falsy values behave this way?",
      "What is the classic Truthy and Falsy Values interview trap?"
    ],
    "traps": [
      "`if ([])` is true — empty array is truthy. `[] == false` is true because of coercion, which contradicts intuition."
    ],
    "misconceptions": [
      "Conditions needed to accept any value so `if (name)` could mean “has a non-empty string” in sloppy UI code. The list of falsy values is fixed by the spec."
    ],
    "strongSignals": [
      "Separates Truthy and Falsy Values from lookalike APIs and can draw the mental model."
    ]
  }
})
