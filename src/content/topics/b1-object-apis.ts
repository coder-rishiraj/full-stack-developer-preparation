import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Object APIs",
  "whatIsIt": "Object.keys/values/entries read enumerable own string keys. Object.fromEntries reverses entries. assign copies enumerable own properties. create sets a prototype. freeze/seal/preventExtensions lock mutability. getOwnProperty* inspect descriptors. These are standard library, not operators.",
  "whyExists": "Once objects were hashes, programs needed reflective helpers to clone, lock, and iterate without for...in prototypes.",
  "mentalModel": "A toolkit that talks to the property table: list, copy, lock, describe — without your class methods.",
  "how": [
    "keys for string enumerable own names.",
    "getOwnPropertySymbols for symbols.",
    "assign is shallow and mutates the target.",
    "freeze is shallow too."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Object.keys skips symbols and inherited keys — for...in does not skip inherited.",
    "variant": "warning"
  },
  "example": "const o = { a: 1, b: 2 };\nconsole.log(Object.keys(o), Object.values(o), Object.entries(o));\nconsole.log(Object.fromEntries([['x', 1], ['y', 2]]));\nconst t = Object.assign({}, o, { b: 9 });\nconsole.log(t, o);\n",
  "exampleCaption": "keys/values/entries/fromEntries/assign",
  "internals": [
    "EnumerableOwnProperties with kind key/value/key+value.",
    "fromEntries uses AddEntriesFromIterable.",
    "assign uses [[Get]] and [[Set]] — setters on the target fire."
  ],
  "takeaways": [
    "keys for string enumerable own names.",
    "getOwnPropertySymbols for symbols.",
    "Object.keys skips symbols and inherited keys — for...in does not skip inherited.",
    "EnumerableOwnProperties with kind key/value/key+value."
  ],
  "revision": [
    "Object APIs: A toolkit that talks to the property table: list, copy, lock, describe — without your class methods.",
    "keys for string enumerable own names.",
    "getOwnPropertySymbols for symbols.",
    "assign is shallow and mutates the target.",
    "Trap: Object.keys skips symbols and inherited keys — for...in does not skip inherited."
  ],
  "flashcards": [
    [
      "Object APIs",
      "Object.keys/values/entries read enumerable own string keys."
    ],
    [
      "Mental model",
      "A toolkit that talks to the property table: list, copy, lock, describe — without your class methods."
    ],
    [
      "Common trap",
      "Object.keys skips symbols and inherited keys — for...in does not skip inherited."
    ],
    [
      "keys for string enumerable own names.",
      "getOwnPropertySymbols for symbols."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Object APIs and where does a beginner first see it?",
      "answerHint": "Object.keys/values/entries read enumerable own string keys. Object.fromEntries reverses entries. assign copies enumerable own properties. create sets a prototype. freeze/seal/preventExtensions lock mutability. getOwnProperty* inspect descriptors. These are standard library, not operators."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Object APIs works and name the main pitfall.",
      "answerHint": "keys for string enumerable own names. getOwnPropertySymbols for symbols. assign is shallow and mutates the target. freeze is shallow too. Pitfall: Object.keys skips symbols and inherited keys — for...in does not skip inherited."
    },
    {
      "level": "advanced",
      "question": "How would you explain Object APIs at an interview, including engine/spec details?",
      "answerHint": "EnumerableOwnProperties with kind key/value/key+value. fromEntries uses AddEntriesFromIterable. assign uses [[Get]] and [[Set]] — setters on the target fire."
    }
  ],
  "pitfalls": [
    "Object.keys skips symbols and inherited keys — for...in does not skip inherited.",
    "freeze is shallow too."
  ],
  "interview": {
    "expectations": [
      "Explain Object APIs without mixing it up with a nearby B1.13 — Objects topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "EnumerableOwnProperties with kind key/value/key+value."
    ],
    "commonQuestions": [
      "What is Object APIs?",
      "Why does JavaScript object apis behave this way?",
      "What is the classic Object APIs interview trap?"
    ],
    "traps": [
      "Object.keys skips symbols and inherited keys — for...in does not skip inherited."
    ],
    "misconceptions": [
      "Once objects were hashes, programs needed reflective helpers to clone, lock, and iterate without for...in prototypes."
    ],
    "strongSignals": [
      "Separates Object APIs from lookalike APIs and can draw the mental model."
    ]
  }
})
