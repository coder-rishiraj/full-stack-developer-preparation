import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "String Creation & Immutability",
  "whatIsIt": "Strings are created with ' ', \" \", backticks, String(), or toString. They are primitive and immutable: every ‘change’ allocates a new string. String objects from new String() are wrappers. Concatenation + and templates build new strings; engines optimize some concatenations.",
  "whyExists": "Text is everywhere on the web. Immutability makes sharing and slicing safer in a concurrent-looking event-loop world.",
  "mentalModel": "A sealed UTF-16 tape. You can copy pieces into a new tape; you cannot overwrite a cell.",
  "how": [
    "Prefer literals and templates over new String.",
    "Build many pieces with an array then join, or a template, not huge + loops if profiling says so.",
    "Remember immutability when caching strings.",
    "JSON.parse produces primitives, not String objects."
  ],
  "callout": {
    "title": "Watch for",
    "text": "new String('a') !== 'a' and is truthy even for new String('').",
    "variant": "warning"
  },
  "example": "const a = 'hello';\nconst b = \"hello\";\nconst c = `hello`;\nconst d = String(42);\nconsole.log(a === b, a === c, d);\nconsole.log(a.toUpperCase() === a, a);\nconsole.log(typeof new String('x'));\n",
  "exampleCaption": "Literals vs String() vs wrapper typeof",
  "internals": [
    "String exotic objects have integer-indexed character properties.",
    "Primitive strings may be interned; === still compares contents for primitives.",
    "Rope/cons-string internals in V8 are optimizations, not language-visible mutation."
  ],
  "takeaways": [
    "Prefer literals and templates over new String.",
    "Build many pieces with an array then join, or a template, not huge + loops if profiling says so.",
    "new String('a') !== 'a' and is truthy even for new String('').",
    "String exotic objects have integer-indexed character properties."
  ],
  "revision": [
    "String Creation & Immutability: A sealed UTF-16 tape. You can copy pieces into a new tape; you cannot overwrite a cell.",
    "Prefer literals and templates over new String.",
    "Build many pieces with an array then join, or a template, not huge + loops if profiling says so.",
    "Remember immutability when caching strings.",
    "Trap: new String('a') !== 'a' and is truthy even for new String('')."
  ],
  "flashcards": [
    [
      "String Creation & Immutability",
      "Strings are created with ' ', \" \", backticks, String(), or toString."
    ],
    [
      "Mental model",
      "A sealed UTF-16 tape. You can copy pieces into a new tape; you cannot overwrite a cell."
    ],
    [
      "Common trap",
      "new String('a') !== 'a' and is truthy even for new String('')."
    ],
    [
      "Prefer literals and templates over new String.",
      "Build many pieces with an array then join, or a template, not huge + loops if profiling says so."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is String Creation & Immutability and where does a beginner first see it?",
      "answerHint": "Strings are created with ' ', \" \", backticks, String(), or toString. They are primitive and immutable: every ‘change’ allocates a new string. String objects from new String() are wrappers. Concatenation + and templates build new strings; engines optimize some concatenations."
    },
    {
      "level": "intermediate",
      "question": "Walk through how String Creation & Immutability works and name the main pitfall.",
      "answerHint": "Prefer literals and templates over new String. Build many pieces with an array then join, or a template, not huge + loops if profiling says so. Remember immutability when caching strings. JSON.parse produces primitives, not String objects. Pitfall: new String('a') !== 'a' and is truthy even for new String('')."
    },
    {
      "level": "advanced",
      "question": "How would you explain String Creation & Immutability at an interview, including engine/spec details?",
      "answerHint": "String exotic objects have integer-indexed character properties. Primitive strings may be interned; === still compares contents for primitives. Rope/cons-string internals in V8 are optimizations, not language-visible mutation."
    }
  ],
  "pitfalls": [
    "new String('a') !== 'a' and is truthy even for new String('').",
    "JSON.parse produces primitives, not String objects."
  ],
  "interview": {
    "expectations": [
      "Explain String Creation & Immutability without mixing it up with a nearby B1.7 — Strings topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "String exotic objects have integer-indexed character properties."
    ],
    "commonQuestions": [
      "What is String Creation & Immutability?",
      "Why does JavaScript string creation & immutability behave this way?",
      "What is the classic String Creation & Immutability interview trap?"
    ],
    "traps": [
      "new String('a') !== 'a' and is truthy even for new String('')."
    ],
    "misconceptions": [
      "Text is everywhere on the web. Immutability makes sharing and slicing safer in a concurrent-looking event-loop world."
    ],
    "strongSignals": [
      "Separates String Creation & Immutability from lookalike APIs and can draw the mental model."
    ]
  }
})
