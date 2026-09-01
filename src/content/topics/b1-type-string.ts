import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "string",
  "whatIsIt": "A string is an immutable sequence of 16-bit UTF-16 code units. Length counts code units, so some emoji are length 2. You create strings with quotes, backticks, or String(). Indexing with `[i]` returns a 1-character string or undefined, never a mutation.",
  "whyExists": "Text is the web’s core payload: HTML, JSON keys, URLs, user input. A dedicated immutable type keeps that cheap to share.",
  "mentalModel": "A frozen strip of UTF-16 cells. Slice methods return new strips; they never edit the old one.",
  "how": [
    "Prefer template literals for interpolation.",
    "Use codePointAt / for-of for Unicode characters, not always `[i]`.",
    "Compare with ===; there is no separate “string object” you need in modern code.",
    "Empty string is falsy; `\"0\"` is truthy."
  ],
  "callout": {
    "title": "Watch for",
    "text": "`s[0] = \"X\"` does nothing (or throws in strict on wrappers); strings cannot be mutated in place.",
    "variant": "warning"
  },
  "example": "const s = 'hi';\nconsole.log(s.length, s[0], s.toUpperCase());\nconsole.log(s); // still 'hi'\nconst emoji = '🙂';\nconsole.log(emoji.length, [...emoji]);\nconsole.log('a' + 1);",
  "exampleCaption": "Immutability, UTF-16 length, concatenation",
  "internals": [
    "String indexes are UTF-16 code units; surrogate pairs split across two units.",
    "Primitive strings intern/hash in engines; String objects are heap wrappers.",
    "ToString abstract operation is used in concatenation and template interpolation."
  ],
  "takeaways": [
    "Prefer template literals for interpolation.",
    "Use codePointAt / for-of for Unicode characters, not always `[i]`.",
    "`s[0] = \"X\"` does nothing (or throws in strict on wrappers); strings cannot be mutated in place.",
    "String indexes are UTF-16 code units; surrogate pairs split across two units."
  ],
  "revision": [
    "string: A frozen strip of UTF-16 cells. Slice methods return new strips; they never edit the old one.",
    "Prefer template literals for interpolation.",
    "Use codePointAt / for-of for Unicode characters, not always `[i]`.",
    "Compare with ===; there is no separate “string object” you need in modern code.",
    "Trap: `s[0] = \"X\"` does nothing (or throws in strict on wrappers); strings cannot be mutated in place."
  ],
  "flashcards": [
    [
      "string",
      "A string is an immutable sequence of 16-bit UTF-16 code units."
    ],
    [
      "Mental model",
      "A frozen strip of UTF-16 cells. Slice methods return new strips; they never edit the old one."
    ],
    [
      "Common trap",
      "`s[0] = \"X\"` does nothing (or throws in strict on wrappers); strings cannot be mutated in place."
    ],
    [
      "Prefer template literals for interpolation.",
      "Use codePointAt / for-of for Unicode characters, not always `[i]`."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is string and where does a beginner first see it?",
      "answerHint": "A string is an immutable sequence of 16-bit UTF-16 code units. Length counts code units, so some emoji are length 2. You create strings with quotes, backticks, or String(). Indexing with `[i]` returns a 1-character string or undefined, never a mutation."
    },
    {
      "level": "intermediate",
      "question": "Walk through how string works and name the main pitfall.",
      "answerHint": "Prefer template literals for interpolation. Use codePointAt / for-of for Unicode characters, not always `[i]`. Compare with ===; there is no separate “string object” you need in modern code. Empty string is falsy; `\"0\"` is truthy. Pitfall: `s[0] = \"X\"` does nothing (or throws in strict on wrappers); strings cannot be mutated in place."
    },
    {
      "level": "advanced",
      "question": "How would you explain string at an interview, including engine/spec details?",
      "answerHint": "String indexes are UTF-16 code units; surrogate pairs split across two units. Primitive strings intern/hash in engines; String objects are heap wrappers. ToString abstract operation is used in concatenation and template interpolation."
    }
  ],
  "pitfalls": [
    "`s[0] = \"X\"` does nothing (or throws in strict on wrappers); strings cannot be mutated in place.",
    "Empty string is falsy; `\"0\"` is truthy."
  ],
  "interview": {
    "expectations": [
      "Explain string without mixing it up with a nearby B1.3 — Types & Values topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "String indexes are UTF-16 code units; surrogate pairs split across two units."
    ],
    "commonQuestions": [
      "What is string?",
      "Why does JavaScript string behave this way?",
      "What is the classic string interview trap?"
    ],
    "traps": [
      "`s[0] = \"X\"` does nothing (or throws in strict on wrappers); strings cannot be mutated in place."
    ],
    "misconceptions": [
      "Text is the web’s core payload: HTML, JSON keys, URLs, user input. A dedicated immutable type keeps that cheap to share."
    ],
    "strongSignals": [
      "Separates string from lookalike APIs and can draw the mental model."
    ]
  }
})
