import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Unicode / UTF-16 Basics",
  "whatIsIt": "JS strings are UTF-16. Code units ≠ Unicode code points ≠ grapheme clusters (what users call a character). '🙂'.length is 2. \\uXXXX is one unit; \\u{1F642} is a code point that may become two units. Normalization (NFC/NFD) changes equality of visually similar text.",
  "whyExists": "JS shipped when UCS-2 was enough. Surrogates were bolted on. The web still mixes languages, emoji, and combining marks.",
  "mentalModel": "Three zoom levels: 16-bit cells, Unicode code points, and ‘what a human sees.’ Most bugs mix them up.",
  "how": [
    "Use codePointAt / for-of / [...str] for code points.",
    "Use Intl.Segmenter for graphemes when available.",
    "Normalize before comparing user names.",
    "Do not reverse a string with [i] loops if emoji matter."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Reversing with split('') breaks surrogate pairs and produces invalid strings.",
    "variant": "warning"
  },
  "example": "const s = 'A🙂é';\nconsole.log(s.length, [...s].length);\nconsole.log(s.codePointAt(1).toString(16));\nconst nfd = 'é'.normalize('NFD');\nconsole.log('é' === nfd, [...nfd]);\nconsole.log('é'.length, nfd.length);\n",
  "exampleCaption": "UTF-16 length vs code points vs NFD",
  "internals": [
    "String indices are code-unit offsets in the spec.",
    "UTF16Encode/Decode on code points > 0xFFFF.",
    "String.prototype.normalize maps to Unicode normalization forms."
  ],
  "takeaways": [
    "Use codePointAt / for-of / [...str] for code points.",
    "Use Intl.Segmenter for graphemes when available.",
    "Reversing with split('') breaks surrogate pairs and produces invalid strings.",
    "String indices are code-unit offsets in the spec."
  ],
  "revision": [
    "Unicode / UTF-16 Basics: Three zoom levels: 16-bit cells, Unicode code points, and ‘what a human sees.’ Most bugs mix them up.",
    "Use codePointAt / for-of / [...str] for code points.",
    "Use Intl.Segmenter for graphemes when available.",
    "Normalize before comparing user names.",
    "Trap: Reversing with split('') breaks surrogate pairs and produces invalid strings."
  ],
  "flashcards": [
    [
      "Unicode / UTF-16 Basics",
      "JS strings are UTF-16."
    ],
    [
      "Mental model",
      "Three zoom levels: 16-bit cells, Unicode code points, and ‘what a human sees.’ Most bugs mix them up."
    ],
    [
      "Common trap",
      "Reversing with split('') breaks surrogate pairs and produces invalid strings."
    ],
    [
      "Use codePointAt / for-of / [...str] for code points.",
      "Use Intl.Segmenter for graphemes when available."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Unicode / UTF-16 Basics and where does a beginner first see it?",
      "answerHint": "JS strings are UTF-16. Code units ≠ Unicode code points ≠ grapheme clusters (what users call a character). '🙂'.length is 2. \\uXXXX is one unit; \\u{1F642} is a code point that may become two units. Normalization (NFC/NFD) changes equality of visually similar text."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Unicode / UTF-16 Basics works and name the main pitfall.",
      "answerHint": "Use codePointAt / for-of / [...str] for code points. Use Intl.Segmenter for graphemes when available. Normalize before comparing user names. Do not reverse a string with [i] loops if emoji matter. Pitfall: Reversing with split('') breaks surrogate pairs and produces invalid strings."
    },
    {
      "level": "advanced",
      "question": "How would you explain Unicode / UTF-16 Basics at an interview, including engine/spec details?",
      "answerHint": "String indices are code-unit offsets in the spec. UTF16Encode/Decode on code points > 0xFFFF. String.prototype.normalize maps to Unicode normalization forms."
    }
  ],
  "pitfalls": [
    "Reversing with split('') breaks surrogate pairs and produces invalid strings.",
    "Do not reverse a string with [i] loops if emoji matter."
  ],
  "interview": {
    "expectations": [
      "Explain Unicode / UTF-16 Basics without mixing it up with a nearby B1.7 — Strings topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "String indices are code-unit offsets in the spec."
    ],
    "commonQuestions": [
      "What is Unicode / UTF-16 Basics?",
      "Why does JavaScript unicode / utf-16 basics behave this way?",
      "What is the classic Unicode / UTF-16 Basics interview trap?"
    ],
    "traps": [
      "Reversing with split('') breaks surrogate pairs and produces invalid strings."
    ],
    "misconceptions": [
      "JS shipped when UCS-2 was enough. Surrogates were bolted on. The web still mixes languages, emoji, and combining marks."
    ],
    "strongSignals": [
      "Separates Unicode / UTF-16 Basics from lookalike APIs and can draw the mental model."
    ]
  }
})
