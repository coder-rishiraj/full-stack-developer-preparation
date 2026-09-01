import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Indexing and Length",
  "whatIsIt": "s[i] and s.charAt(i) access UTF-16 code units. length is the code-unit count. Out of range [i] is undefined; charAt returns ''. Assigning s[0] = 'x' does not mutate. for...of and codePointAt walk Unicode code points more safely than [i] for emoji.",
  "whyExists": "Strings needed array-like access for parsers. UTF-16 was inherited from Java/Windows, so length is not ‘user-perceived characters.’",
  "mentalModel": "A 0-based array of 16-bit cells, not of emoji. Some characters occupy two cells (surrogate pairs).",
  "how": [
    "Use length for code units; [...s] or codePointAt for code points.",
    "Do not loop by i++ over emoji-heavy text without care.",
    "charAt is safer than [] if you want '' instead of undefined.",
    "Indexes are integers; s['00'] is a named property, not index 0."
  ],
  "callout": {
    "title": "Watch for",
    "text": "s[s.length-1] on a trailing emoji can be a lone surrogate, not the whole character.",
    "variant": "warning"
  },
  "example": "const s = 'JS🙂';\nconsole.log(s.length, s[0], s[2], s.charAt(99));\nconsole.log([...s]);\nconsole.log(s.codePointAt(2)?.toString(16));\nconsole.log(s.at(-1));\n",
  "exampleCaption": "length vs code points on a string with emoji",
  "internals": [
    "Canonical numeric index strings on String objects.",
    "UTF-16 encoding: code points > 0xFFFF use two code units.",
    "String.prototype.at supports negative indexes; [] does not."
  ],
  "takeaways": [
    "Use length for code units; [...s] or codePointAt for code points.",
    "Do not loop by i++ over emoji-heavy text without care.",
    "s[s.length-1] on a trailing emoji can be a lone surrogate, not the whole character.",
    "Canonical numeric index strings on String objects."
  ],
  "revision": [
    "Indexing and Length: A 0-based array of 16-bit cells, not of emoji. Some characters occupy two cells (surrogate pairs).",
    "Use length for code units; [...s] or codePointAt for code points.",
    "Do not loop by i++ over emoji-heavy text without care.",
    "charAt is safer than [] if you want '' instead of undefined.",
    "Trap: s[s.length-1] on a trailing emoji can be a lone surrogate, not the whole character."
  ],
  "flashcards": [
    [
      "Indexing and Length",
      "s[i] and s.charAt(i) access UTF-16 code units."
    ],
    [
      "Mental model",
      "A 0-based array of 16-bit cells, not of emoji. Some characters occupy two cells (surrogate pairs)."
    ],
    [
      "Common trap",
      "s[s.length-1] on a trailing emoji can be a lone surrogate, not the whole character."
    ],
    [
      "Use length for code units; [...s] or codePointAt for code points.",
      "Do not loop by i++ over emoji-heavy text without care."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Indexing and Length and where does a beginner first see it?",
      "answerHint": "s[i] and s.charAt(i) access UTF-16 code units. length is the code-unit count. Out of range [i] is undefined; charAt returns ''. Assigning s[0] = 'x' does not mutate. for...of and codePointAt walk Unicode code points more safely than [i] for emoji."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Indexing and Length works and name the main pitfall.",
      "answerHint": "Use length for code units; [...s] or codePointAt for code points. Do not loop by i++ over emoji-heavy text without care. charAt is safer than [] if you want '' instead of undefined. Indexes are integers; s['00'] is a named property, not index 0. Pitfall: s[s.length-1] on a trailing emoji can be a lone surrogate, not the whole character."
    },
    {
      "level": "advanced",
      "question": "How would you explain Indexing and Length at an interview, including engine/spec details?",
      "answerHint": "Canonical numeric index strings on String objects. UTF-16 encoding: code points > 0xFFFF use two code units. String.prototype.at supports negative indexes; [] does not."
    }
  ],
  "pitfalls": [
    "s[s.length-1] on a trailing emoji can be a lone surrogate, not the whole character.",
    "Indexes are integers; s['00'] is a named property, not index 0."
  ],
  "interview": {
    "expectations": [
      "Explain Indexing and Length without mixing it up with a nearby B1.7 — Strings topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Canonical numeric index strings on String objects."
    ],
    "commonQuestions": [
      "What is Indexing and Length?",
      "Why does JavaScript indexing and length behave this way?",
      "What is the classic Indexing and Length interview trap?"
    ],
    "traps": [
      "s[s.length-1] on a trailing emoji can be a lone surrogate, not the whole character."
    ],
    "misconceptions": [
      "Strings needed array-like access for parsers. UTF-16 was inherited from Java/Windows, so length is not ‘user-perceived characters.’"
    ],
    "strongSignals": [
      "Separates Indexing and Length from lookalike APIs and can draw the mental model."
    ]
  }
})
