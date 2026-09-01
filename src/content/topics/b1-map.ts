import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Map",
  "whatIsIt": "Map is a key-value store with any key type (objects, functions, NaN), insertion-ordered. get/set/has/delete, size. Object keys stringify; Map keys do not. JSON.stringify(map) is {}. Iterate with map.entries() or for...of. Keys use SameValueZero.",
  "whyExists": "Using objects as dictionaries forces string keys and prototype pollution issues. Map is a real dictionary.",
  "mentalModel": "A table of key→value where the key can be an object sticker, not just a string label.",
  "how": [
    "Use Map when keys are objects or you need key order of insertion with non-strings.",
    "obj as a record of known string fields is still fine.",
    "Remember get missing is undefined (same as a stored undefined — use has).",
    "WeakMap if keys should not keep objects alive."
  ],
  "callout": {
    "title": "Watch for",
    "text": "m.get({id:1}) is undefined if you set with a different object that looks the same.",
    "variant": "warning"
  },
  "example": "const m = new Map();\nconst k = { id: 1 };\nm.set(k, 'meta');\nm.set(NaN, 'nan');\nconsole.log(m.get(k), m.get({ id: 1 }), m.get(NaN), m.size);\nfor (const [key, val] of m) console.log(val);\n",
  "exampleCaption": "Object keys by identity; NaN key; missing similar object",
  "internals": [
    "[[MapData]] list of {Key, Value} records.",
    "SameValueZero for key equality.",
    "@@iterator yields entries [k,v]."
  ],
  "takeaways": [
    "Use Map when keys are objects or you need key order of insertion with non-strings.",
    "obj as a record of known string fields is still fine.",
    "m.get({id:1}) is undefined if you set with a different object that looks the same.",
    "[[MapData]] list of {Key, Value} records."
  ],
  "revision": [
    "Map: A table of key→value where the key can be an object sticker, not just a string label.",
    "Use Map when keys are objects or you need key order of insertion with non-strings.",
    "obj as a record of known string fields is still fine.",
    "Remember get missing is undefined (same as a stored undefined — use has).",
    "Trap: m.get({id:1}) is undefined if you set with a different object that looks the same."
  ],
  "flashcards": [
    [
      "Map",
      "Map is a key-value store with any key type (objects, functions, NaN), insertion-ordered."
    ],
    [
      "Mental model",
      "A table of key→value where the key can be an object sticker, not just a string label."
    ],
    [
      "Common trap",
      "m.get({id:1}) is undefined if you set with a different object that looks the same."
    ],
    [
      "Use Map when keys are objects or you need key order of insertion with non-string",
      "obj as a record of known string fields is still fine."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Map and where does a beginner first see it?",
      "answerHint": "Map is a key-value store with any key type (objects, functions, NaN), insertion-ordered. get/set/has/delete, size. Object keys stringify; Map keys do not. JSON.stringify(map) is {}. Iterate with map.entries() or for...of. Keys use SameValueZero."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Map works and name the main pitfall.",
      "answerHint": "Use Map when keys are objects or you need key order of insertion with non-strings. obj as a record of known string fields is still fine. Remember get missing is undefined (same as a stored undefined — use has). WeakMap if keys should not keep objects alive. Pitfall: m.get({id:1}) is undefined if you set with a different object that looks the same."
    },
    {
      "level": "advanced",
      "question": "How would you explain Map at an interview, including engine/spec details?",
      "answerHint": "[[MapData]] list of {Key, Value} records. SameValueZero for key equality. @@iterator yields entries [k,v]."
    }
  ],
  "pitfalls": [
    "m.get({id:1}) is undefined if you set with a different object that looks the same.",
    "WeakMap if keys should not keep objects alive."
  ],
  "interview": {
    "expectations": [
      "Explain Map without mixing it up with a nearby B1.19 — Maps, Sets & Weak Collections topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "[[MapData]] list of {Key, Value} records."
    ],
    "commonQuestions": [
      "What is Map?",
      "Why does JavaScript map behave this way?",
      "What is the classic Map interview trap?"
    ],
    "traps": [
      "m.get({id:1}) is undefined if you set with a different object that looks the same."
    ],
    "misconceptions": [
      "Using objects as dictionaries forces string keys and prototype pollution issues. Map is a real dictionary."
    ],
    "strongSignals": [
      "Separates Map from lookalike APIs and can draw the mental model."
    ]
  }
})
