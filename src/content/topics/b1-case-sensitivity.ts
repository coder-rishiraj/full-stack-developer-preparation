import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Case Sensitivity",
  "whatIsIt": "JavaScript identifiers, keywords, and most APIs are case-sensitive: `map` is not `Map`, `document` is not `Document`. HTML tag names are case-insensitive in HTML parsing, which confuses people when they switch between markup and JS. String comparison is also case-sensitive unless you normalize.",
  "whyExists": "The language follows C-family tradition and Unicode identifier rules rather than HTML’s forgiving case folding.",
  "mentalModel": "The engine compares exact code points. If the bytes differ, it is a different name — no case folding on lookups.",
  "how": [
    "`let a` and `let A` are two bindings.",
    "Constructors are typically PascalCase; instances camelCase.",
    "Do not rely on HTML’s case-insensitive tags when querying via JS strings unless you know the DOM’s rules.",
    "For user-facing search, use locale-aware case folding, not naive toLowerCase for all languages."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Typing `Document.getElementById` (the interface name) instead of `document` — the global is lowercase.",
    "variant": "warning"
  },
  "example": "const user = { name: 'Ada' };\nconsole.log(user.name);\nconsole.log(user.Name); // undefined\nconst MapCtor = Map;\nconst mapFn = (xs, f) => xs.map(f);\nconsole.log(new MapCtor([[1, 2]]).get(1), mapFn([1], (x) => x + 1));",
  "exampleCaption": "Map constructor vs Array#map vs property case",
  "internals": [
    "Identifier equality is code-unit / code-point identity, not locale case-fold.",
    "DOM HTML collections fold ASCII tag names; XML/SVG do not.",
    "import specifiers are URL-case-sensitive on many servers (Linux)."
  ],
  "takeaways": [
    "`let a` and `let A` are two bindings.",
    "Constructors are typically PascalCase; instances camelCase.",
    "Typing `Document.getElementById` (the interface name) instead of `document` — the global is lowercase.",
    "Identifier equality is code-unit / code-point identity, not locale case-fold."
  ],
  "revision": [
    "Case Sensitivity: The engine compares exact code points. If the bytes differ, it is a different name — no case folding on lookups.",
    "`let a` and `let A` are two bindings.",
    "Constructors are typically PascalCase; instances camelCase.",
    "Do not rely on HTML’s case-insensitive tags when querying via JS strings unless you know the DOM’s rules.",
    "Trap: Typing `Document.getElementById` (the interface name) instead of `document` — the global is lowercase."
  ],
  "flashcards": [
    [
      "Case Sensitivity",
      "JavaScript identifiers, keywords, and most APIs are case-sensitive: `map` is not `Map`, `document` is not `Document`."
    ],
    [
      "Mental model",
      "The engine compares exact code points. If the bytes differ, it is a different name — no case folding on lookups."
    ],
    [
      "Common trap",
      "Typing `Document.getElementById` (the interface name) instead of `document` — the global is lowercase."
    ],
    [
      "`let a` and `let A` are two bindings.",
      "Constructors are typically PascalCase; instances camelCase."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Case Sensitivity and where does a beginner first see it?",
      "answerHint": "JavaScript identifiers, keywords, and most APIs are case-sensitive: `map` is not `Map`, `document` is not `Document`. HTML tag names are case-insensitive in HTML parsing, which confuses people when they switch between markup and JS. String comparison is also case-sensitive unless you normalize."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Case Sensitivity works and name the main pitfall.",
      "answerHint": "`let a` and `let A` are two bindings. Constructors are typically PascalCase; instances camelCase. Do not rely on HTML’s case-insensitive tags when querying via JS strings unless you know the DOM’s rules. For user-facing search, use locale-aware case folding, not naive toLowerCase for all languages. Pitfall: Typing `Document.getElementById` (the interface name) instead of `document` — the global is lowercase."
    },
    {
      "level": "advanced",
      "question": "How would you explain Case Sensitivity at an interview, including engine/spec details?",
      "answerHint": "Identifier equality is code-unit / code-point identity, not locale case-fold. DOM HTML collections fold ASCII tag names; XML/SVG do not. import specifiers are URL-case-sensitive on many servers (Linux)."
    }
  ],
  "pitfalls": [
    "Typing `Document.getElementById` (the interface name) instead of `document` — the global is lowercase.",
    "For user-facing search, use locale-aware case folding, not naive toLowerCase for all languages."
  ],
  "interview": {
    "expectations": [
      "Explain Case Sensitivity without mixing it up with a nearby B1.1 — JavaScript Foundations topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Identifier equality is code-unit / code-point identity, not locale case-fold."
    ],
    "commonQuestions": [
      "What is Case Sensitivity?",
      "Why does JavaScript case sensitivity behave this way?",
      "What is the classic Case Sensitivity interview trap?"
    ],
    "traps": [
      "Typing `Document.getElementById` (the interface name) instead of `document` — the global is lowercase."
    ],
    "misconceptions": [
      "The language follows C-family tradition and Unicode identifier rules rather than HTML’s forgiving case folding."
    ],
    "strongSignals": [
      "Separates Case Sensitivity from lookalike APIs and can draw the mental model."
    ]
  }
})
