import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Symbol.for / keyFor",
  "whatIsIt": "Symbol.for(key) looks up or creates a symbol in a global registry shared across the runtime (and realms in some embeddings). Symbol.keyFor(sym) returns the key or undefined for local symbols. Use for cross-package well-known-ish keys; use Symbol() for private unique keys.",
  "whyExists": "Two libraries needed to share the same symbol without importing the same Symbol() result. A string key in a registry is that handshake.",
  "mentalModel": "A lost-and-found desk: you ask for 'id', you get the same chip everyone else got for 'id'.",
  "how": [
    "Symbol.for('my-lib.id') for shared protocol keys.",
    "Symbol('id') when you do not want sharing.",
    "keyFor only works for registry symbols.",
    "Registry is global — pick namespaced strings."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Mixing Symbol('x') and Symbol.for('x') — they are not equal; Map keys will miss.",
    "variant": "warning"
  },
  "example": "const a = Symbol.for('app.id');\nconst b = Symbol.for('app.id');\nconsole.log(a === b, Symbol.keyFor(a));\nconst local = Symbol('app.id');\nconsole.log(Symbol.keyFor(local), local === a);\n",
  "exampleCaption": "Symbol.for identity vs local Symbol",
  "internals": [
    "GlobalSymbolRegistry is a list of {[[Key]], [[Symbol]]}.",
    "Symbol.for ToString’s the key.",
    "iframe realms: for-registry is usually per-agent, but well-known symbols are per-realm — don’t mix them up."
  ],
  "takeaways": [
    "Symbol.for('my-lib.id') for shared protocol keys.",
    "Symbol('id') when you do not want sharing.",
    "Mixing Symbol('x') and Symbol.for('x') — they are not equal; Map keys will miss.",
    "GlobalSymbolRegistry is a list of {[[Key]], [[Symbol]]}."
  ],
  "revision": [
    "Symbol.for / keyFor: A lost-and-found desk: you ask for 'id', you get the same chip everyone else got for 'id'.",
    "Symbol.for('my-lib.id') for shared protocol keys.",
    "Symbol('id') when you do not want sharing.",
    "keyFor only works for registry symbols.",
    "Trap: Mixing Symbol('x') and Symbol.for('x') — they are not equal; Map keys will miss."
  ],
  "flashcards": [
    [
      "Symbol.for / keyFor",
      "Symbol.for(key) looks up or creates a symbol in a global registry shared across the runtime (and realms in some embeddings)."
    ],
    [
      "Mental model",
      "A lost-and-found desk: you ask for 'id', you get the same chip everyone else got for 'id'."
    ],
    [
      "Common trap",
      "Mixing Symbol('x') and Symbol.for('x') — they are not equal; Map keys will miss."
    ],
    [
      "Symbol.for('my-lib.id') for shared protocol keys.",
      "Symbol('id') when you do not want sharing."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Symbol.for / keyFor and where does a beginner first see it?",
      "answerHint": "Symbol.for(key) looks up or creates a symbol in a global registry shared across the runtime (and realms in some embeddings). Symbol.keyFor(sym) returns the key or undefined for local symbols. Use for cross-package well-known-ish keys; use Symbol() for private unique keys."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Symbol.for / keyFor works and name the main pitfall.",
      "answerHint": "Symbol.for('my-lib.id') for shared protocol keys. Symbol('id') when you do not want sharing. keyFor only works for registry symbols. Registry is global — pick namespaced strings. Pitfall: Mixing Symbol('x') and Symbol.for('x') — they are not equal; Map keys will miss."
    },
    {
      "level": "advanced",
      "question": "How would you explain Symbol.for / keyFor at an interview, including engine/spec details?",
      "answerHint": "GlobalSymbolRegistry is a list of {[[Key]], [[Symbol]]}. Symbol.for ToString’s the key. iframe realms: for-registry is usually per-agent, but well-known symbols are per-realm — don’t mix them up."
    }
  ],
  "pitfalls": [
    "Mixing Symbol('x') and Symbol.for('x') — they are not equal; Map keys will miss.",
    "Registry is global — pick namespaced strings."
  ],
  "interview": {
    "expectations": [
      "Explain Symbol.for / keyFor without mixing it up with a nearby B1.22 — Symbols topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "GlobalSymbolRegistry is a list of {[[Key]], [[Symbol]]}."
    ],
    "commonQuestions": [
      "What is Symbol.for / keyFor?",
      "Why does JavaScript symbol.for / keyfor behave this way?",
      "What is the classic Symbol.for / keyFor interview trap?"
    ],
    "traps": [
      "Mixing Symbol('x') and Symbol.for('x') — they are not equal; Map keys will miss."
    ],
    "misconceptions": [
      "Two libraries needed to share the same symbol without importing the same Symbol() result. A string key in a registry is that handshake."
    ],
    "strongSignals": [
      "Separates Symbol.for / keyFor from lookalike APIs and can draw the mental model."
    ]
  }
})
