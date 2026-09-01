import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Extracting / Slicing",
  "whatIsIt": "slice(start, end) takes a half-open range, supports negatives. substring(start, end) does not treat negatives as from-end (they become 0) and swaps if start > end. substr is legacy. at(i) supports negatives for one unit. slice is the default choice.",
  "whyExists": "Extracting windows of text is parsing. Multiple methods exist because the language accreted APIs from Java and later cleaned them up.",
  "mentalModel": "slice: Python-like half-open with negatives. substring: clamp and swap. Prefer slice so your brain keeps one model.",
  "how": [
    "Use slice for almost all extraction.",
    "Use at(-1) for the last code unit.",
    "Remember end is exclusive in slice/substring.",
    "Copy with s.slice() — strings are immutable so this is equal content."
  ],
  "callout": {
    "title": "Watch for",
    "text": "substring(-3) is the whole string (negatives → 0), while slice(-3) is the last three units.",
    "variant": "warning"
  },
  "example": "const s = 'JavaScript';\nconsole.log(s.slice(0, 4), s.slice(-6));\nconsole.log(s.substring(4, 0), s.slice(4, 0));\nconsole.log(s.at(-1), s.slice(4));\nconsole.log(s.substring(-3), s.slice(-3));\n",
  "exampleCaption": "slice vs substring with swapped and negative args",
  "internals": [
    "slice uses relative indexing (max(len+int, 0) for negatives).",
    "substring uses max(0, min(len, n)) then reorders start/end.",
    "substr is in Annex B (web compatibility)."
  ],
  "takeaways": [
    "Use slice for almost all extraction.",
    "Use at(-1) for the last code unit.",
    "substring(-3) is the whole string (negatives → 0), while slice(-3) is the last three units.",
    "slice uses relative indexing (max(len+int, 0) for negatives)."
  ],
  "revision": [
    "Extracting / Slicing: slice: Python-like half-open with negatives. substring: clamp and swap. Prefer slice so your brain keeps one model.",
    "Use slice for almost all extraction.",
    "Use at(-1) for the last code unit.",
    "Remember end is exclusive in slice/substring.",
    "Trap: substring(-3) is the whole string (negatives → 0), while slice(-3) is the last three units."
  ],
  "flashcards": [
    [
      "Extracting / Slicing",
      "slice(start, end) takes a half-open range, supports negatives."
    ],
    [
      "Mental model",
      "slice: Python-like half-open with negatives. substring: clamp and swap. Prefer slice so your brain keeps one model."
    ],
    [
      "Common trap",
      "substring(-3) is the whole string (negatives → 0), while slice(-3) is the last three units."
    ],
    [
      "Use slice for almost all extraction.",
      "Use at(-1) for the last code unit."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Extracting / Slicing and where does a beginner first see it?",
      "answerHint": "slice(start, end) takes a half-open range, supports negatives. substring(start, end) does not treat negatives as from-end (they become 0) and swaps if start > end. substr is legacy. at(i) supports negatives for one unit. slice is the default choice."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Extracting / Slicing works and name the main pitfall.",
      "answerHint": "Use slice for almost all extraction. Use at(-1) for the last code unit. Remember end is exclusive in slice/substring. Copy with s.slice() — strings are immutable so this is equal content. Pitfall: substring(-3) is the whole string (negatives → 0), while slice(-3) is the last three units."
    },
    {
      "level": "advanced",
      "question": "How would you explain Extracting / Slicing at an interview, including engine/spec details?",
      "answerHint": "slice uses relative indexing (max(len+int, 0) for negatives). substring uses max(0, min(len, n)) then reorders start/end. substr is in Annex B (web compatibility)."
    }
  ],
  "pitfalls": [
    "substring(-3) is the whole string (negatives → 0), while slice(-3) is the last three units.",
    "Copy with s.slice() — strings are immutable so this is equal content."
  ],
  "interview": {
    "expectations": [
      "Explain Extracting / Slicing without mixing it up with a nearby B1.7 — Strings topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "slice uses relative indexing (max(len+int, 0) for negatives)."
    ],
    "commonQuestions": [
      "What is Extracting / Slicing?",
      "Why does JavaScript extracting / slicing behave this way?",
      "What is the classic Extracting / Slicing interview trap?"
    ],
    "traps": [
      "substring(-3) is the whole string (negatives → 0), while slice(-3) is the last three units."
    ],
    "misconceptions": [
      "Extracting windows of text is parsing. Multiple methods exist because the language accreted APIs from Java and later cleaned them up."
    ],
    "strongSignals": [
      "Separates Extracting / Slicing from lookalike APIs and can draw the mental model."
    ]
  }
})
