import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Set",
  "whatIsIt": "Set stores unique values using SameValueZero (NaN counts as one, +0/-0 collide). It is iterable in insertion order. add/has/delete/clear, size not length. Objects are unique by reference. Sets are not typed arrays; querying is average O(1).",
  "whyExists": "Membership tests on arrays are O(n) and duplicates are tedious to filter. Set is the dedicated unique bag.",
  "mentalModel": "A collection that refuses a second copy of the same value (by SameValueZero).",
  "how": [
    "new Set(iterable) to unique an array: [...new Set(arr)].",
    "has instead of includes for large collections.",
    "Remember objects need the same reference.",
    "No index access — iterate or convert to array."
  ],
  "callout": {
    "title": "Watch for",
    "text": "new Set([{a:1},{a:1}]).size is 2 — different object identities.",
    "variant": "warning"
  },
  "example": "const s = new Set([1, 1, 2, NaN, NaN]);\ns.add(2);\nconsole.log(s.size, s.has(1), s.has(NaN));\nconsole.log([...s]);\nconst o = {};\ns.add(o).add({});\nconsole.log(s.has(o), s.size);\n",
  "exampleCaption": "Uniqueness, NaN, object identity",
  "internals": [
    "SetData list internally; SameValueZero for matching.",
    "@@iterator is the values iterator.",
    "Keys and values are the same in a Set."
  ],
  "takeaways": [
    "new Set(iterable) to unique an array: [...new Set(arr)].",
    "has instead of includes for large collections.",
    "new Set([{a:1},{a:1}]).size is 2 — different object identities.",
    "SetData list internally; SameValueZero for matching."
  ],
  "revision": [
    "Set: A collection that refuses a second copy of the same value (by SameValueZero).",
    "new Set(iterable) to unique an array: [...new Set(arr)].",
    "has instead of includes for large collections.",
    "Remember objects need the same reference.",
    "Trap: new Set([{a:1},{a:1}]).size is 2 — different object identities."
  ],
  "flashcards": [
    [
      "Set",
      "Set stores unique values using SameValueZero (NaN counts as one, +0/-0 collide)."
    ],
    [
      "Mental model",
      "A collection that refuses a second copy of the same value (by SameValueZero)."
    ],
    [
      "Common trap",
      "new Set([{a:1},{a:1}]).size is 2 — different object identities."
    ],
    [
      "new Set(iterable) to unique an array: [...new Set(arr)].",
      "has instead of includes for large collections."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Set and where does a beginner first see it?",
      "answerHint": "Set stores unique values using SameValueZero (NaN counts as one, +0/-0 collide). It is iterable in insertion order. add/has/delete/clear, size not length. Objects are unique by reference. Sets are not typed arrays; querying is average O(1)."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Set works and name the main pitfall.",
      "answerHint": "new Set(iterable) to unique an array: [...new Set(arr)]. has instead of includes for large collections. Remember objects need the same reference. No index access — iterate or convert to array. Pitfall: new Set([{a:1},{a:1}]).size is 2 — different object identities."
    },
    {
      "level": "advanced",
      "question": "How would you explain Set at an interview, including engine/spec details?",
      "answerHint": "SetData list internally; SameValueZero for matching. @@iterator is the values iterator. Keys and values are the same in a Set."
    }
  ],
  "pitfalls": [
    "new Set([{a:1},{a:1}]).size is 2 — different object identities.",
    "No index access — iterate or convert to array."
  ],
  "interview": {
    "expectations": [
      "Explain Set without mixing it up with a nearby B1.19 — Maps, Sets & Weak Collections topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "SetData list internally; SameValueZero for matching."
    ],
    "commonQuestions": [
      "What is Set?",
      "Why does JavaScript set behave this way?",
      "What is the classic Set interview trap?"
    ],
    "traps": [
      "new Set([{a:1},{a:1}]).size is 2 — different object identities."
    ],
    "misconceptions": [
      "Membership tests on arrays are O(n) and duplicates are tedious to filter. Set is the dedicated unique bag."
    ],
    "strongSignals": [
      "Separates Set from lookalike APIs and can draw the mental model."
    ]
  }
})
