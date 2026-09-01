import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "symbol",
  "whatIsIt": "symbol is a primitive unique ID: `Symbol(\"desc\")` never equals another symbol except the exact same reference. Symbols can be object keys that do not show up in Object.keys or JSON. Well-known symbols (Symbol.iterator, toStringTag, toPrimitive) hook language protocols. Symbol.for shares a runtime-wide registry.",
  "whyExists": "Objects needed collision-free property names for libraries (meta protocols) without inventing a new object type for every flag.",
  "mentalModel": "A unique opaque sticker. Two stickers with the same description are still different unless you used Symbol.for.",
  "how": [
    "Create with Symbol(\"hint\") for per-instance uniqueness.",
    "Use as computed keys: `{ [id]: value }`.",
    "Enumerate with Object.getOwnPropertySymbols when needed.",
    "Do not overuse; strings are fine for public APIs."
  ],
  "callout": {
    "title": "Watch for",
    "text": "JSON.stringify drops symbol keys — data vanishes if you thought they would serialize.",
    "variant": "warning"
  },
  "example": "const id = Symbol('id');\nconst user = { name: 'Ada', [id]: 7 };\nconsole.log(user[id], Object.keys(user));\nconsole.log(Symbol('id') === Symbol('id'));\nconsole.log(Symbol.for('x') === Symbol.for('x'));",
  "exampleCaption": "Unique keys vs Symbol.for registry",
  "internals": [
    "typeof symbol is \"symbol\"; they are primitives, not objects.",
    "Ordinary objects allow symbol keys in [[OwnPropertyKeys]] after string keys.",
    "Well-known symbols are shared across realms in a defined way per spec (same realm typically)."
  ],
  "takeaways": [
    "Create with Symbol(\"hint\") for per-instance uniqueness.",
    "Use as computed keys: `{ [id]: value }`.",
    "JSON.stringify drops symbol keys — data vanishes if you thought they would serialize.",
    "typeof symbol is \"symbol\"; they are primitives, not objects."
  ],
  "revision": [
    "symbol: A unique opaque sticker. Two stickers with the same description are still different unless you used Symbol.for.",
    "Create with Symbol(\"hint\") for per-instance uniqueness.",
    "Use as computed keys: `{ [id]: value }`.",
    "Enumerate with Object.getOwnPropertySymbols when needed.",
    "Trap: JSON.stringify drops symbol keys — data vanishes if you thought they would serialize."
  ],
  "flashcards": [
    [
      "symbol",
      "symbol is a primitive unique ID: `Symbol(\"desc\")` never equals another symbol except the exact same reference."
    ],
    [
      "Mental model",
      "A unique opaque sticker. Two stickers with the same description are still different unless you used Symbol.for."
    ],
    [
      "Common trap",
      "JSON.stringify drops symbol keys — data vanishes if you thought they would serialize."
    ],
    [
      "Create with Symbol(\"hint\") for per-instance uniqueness.",
      "Use as computed keys: `{ [id]: value }`."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is symbol and where does a beginner first see it?",
      "answerHint": "symbol is a primitive unique ID: `Symbol(\"desc\")` never equals another symbol except the exact same reference. Symbols can be object keys that do not show up in Object.keys or JSON. Well-known symbols (Symbol.iterator, toStringTag, toPrimitive) hook language protocols. Symbol.for shares a runtime-wide registry."
    },
    {
      "level": "intermediate",
      "question": "Walk through how symbol works and name the main pitfall.",
      "answerHint": "Create with Symbol(\"hint\") for per-instance uniqueness. Use as computed keys: `{ [id]: value }`. Enumerate with Object.getOwnPropertySymbols when needed. Do not overuse; strings are fine for public APIs. Pitfall: JSON.stringify drops symbol keys — data vanishes if you thought they would serialize."
    },
    {
      "level": "advanced",
      "question": "How would you explain symbol at an interview, including engine/spec details?",
      "answerHint": "typeof symbol is \"symbol\"; they are primitives, not objects. Ordinary objects allow symbol keys in [[OwnPropertyKeys]] after string keys. Well-known symbols are shared across realms in a defined way per spec (same realm typically)."
    }
  ],
  "pitfalls": [
    "JSON.stringify drops symbol keys — data vanishes if you thought they would serialize.",
    "Do not overuse; strings are fine for public APIs."
  ],
  "interview": {
    "expectations": [
      "Explain symbol without mixing it up with a nearby B1.3 — Types & Values topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "typeof symbol is \"symbol\"; they are primitives, not objects."
    ],
    "commonQuestions": [
      "What is symbol?",
      "Why does JavaScript symbol behave this way?",
      "What is the classic symbol interview trap?"
    ],
    "traps": [
      "JSON.stringify drops symbol keys — data vanishes if you thought they would serialize."
    ],
    "misconceptions": [
      "Objects needed collision-free property names for libraries (meta protocols) without inventing a new object type for every flag."
    ],
    "strongSignals": [
      "Separates symbol from lookalike APIs and can draw the mental model."
    ]
  }
})
