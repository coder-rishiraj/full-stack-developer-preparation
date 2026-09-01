import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Well-known Symbols",
  "whatIsIt": "Well-known symbols are built-in hooks: iterator, asyncIterator, toStringTag, toPrimitive, hasInstance, species, match, replace, split, search, unscopables, isConcatSpreadable, toPrimitive, dispose (newer). Libraries implement these to plug into operators and APIs. They are unique per realm.",
  "whyExists": "The language needed extension points that would not collide with user properties named iterator or match.",
  "mentalModel": "Official USB ports on objects. If you implement the port, for-of / instanceof / String methods can call you.",
  "how": [
    "Implement @@iterator for for-of.",
    "@@toPrimitive for conversion.",
    "@@hasInstance to customize instanceof.",
    "Do not overwrite well-known symbols on built-in prototypes in apps."
  ],
  "callout": {
    "title": "Watch for",
    "text": "instanceof Foo where Foo is a realm’s Array from an iframe fails — different @@ and different Array.",
    "variant": "warning"
  },
  "example": "class Enum {\n  static [Symbol.hasInstance](v) { return typeof v === 'number'; }\n}\nconsole.log(1 instanceof Enum, '1' instanceof Enum);\nconst tagged = { [Symbol.toStringTag]: 'Enum' };\nconsole.log(Object.prototype.toString.call(tagged));\n",
  "exampleCaption": "@@hasInstance and @@toStringTag",
  "internals": [
    "Well-known symbols are %Symbol.iterator% etc., created per realm.",
    "OrdinaryHasInstance is skipped if @@hasInstance is present.",
    "RegExp methods check @@match on the first arg of String.prototype.match."
  ],
  "takeaways": [
    "Implement @@iterator for for-of.",
    "@@toPrimitive for conversion.",
    "instanceof Foo where Foo is a realm’s Array from an iframe fails — different @@ and different Array.",
    "Well-known symbols are %Symbol.iterator% etc., created per realm."
  ],
  "revision": [
    "Well-known Symbols: Official USB ports on objects. If you implement the port, for-of / instanceof / String methods can call you.",
    "Implement @@iterator for for-of.",
    "@@toPrimitive for conversion.",
    "@@hasInstance to customize instanceof.",
    "Trap: instanceof Foo where Foo is a realm’s Array from an iframe fails — different @@ and different Array."
  ],
  "flashcards": [
    [
      "Well-known Symbols",
      "Well-known symbols are built-in hooks: iterator, asyncIterator, toStringTag, toPrimitive, hasInstance, species, match, replace, split, search, unscopables, isConcatSpreadable, toPrimitive, dispose (newer)."
    ],
    [
      "Mental model",
      "Official USB ports on objects. If you implement the port, for-of / instanceof / String methods can call you."
    ],
    [
      "Common trap",
      "instanceof Foo where Foo is a realm’s Array from an iframe fails — different @@ and different Array."
    ],
    [
      "Implement @@iterator for for-of.",
      "@@toPrimitive for conversion."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Well-known Symbols and where does a beginner first see it?",
      "answerHint": "Well-known symbols are built-in hooks: iterator, asyncIterator, toStringTag, toPrimitive, hasInstance, species, match, replace, split, search, unscopables, isConcatSpreadable, toPrimitive, dispose (newer). Libraries implement these to plug into operators and APIs. They are unique per realm."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Well-known Symbols works and name the main pitfall.",
      "answerHint": "Implement @@iterator for for-of. @@toPrimitive for conversion. @@hasInstance to customize instanceof. Do not overwrite well-known symbols on built-in prototypes in apps. Pitfall: instanceof Foo where Foo is a realm’s Array from an iframe fails — different @@ and different Array."
    },
    {
      "level": "advanced",
      "question": "How would you explain Well-known Symbols at an interview, including engine/spec details?",
      "answerHint": "Well-known symbols are %Symbol.iterator% etc., created per realm. OrdinaryHasInstance is skipped if @@hasInstance is present. RegExp methods check @@match on the first arg of String.prototype.match."
    }
  ],
  "pitfalls": [
    "instanceof Foo where Foo is a realm’s Array from an iframe fails — different @@ and different Array.",
    "Do not overwrite well-known symbols on built-in prototypes in apps."
  ],
  "interview": {
    "expectations": [
      "Explain Well-known Symbols without mixing it up with a nearby B1.22 — Symbols topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Well-known symbols are %Symbol.iterator% etc., created per realm."
    ],
    "commonQuestions": [
      "What is Well-known Symbols?",
      "Why does JavaScript well-known symbols behave this way?",
      "What is the classic Well-known Symbols interview trap?"
    ],
    "traps": [
      "instanceof Foo where Foo is a realm’s Array from an iframe fails — different @@ and different Array."
    ],
    "misconceptions": [
      "The language needed extension points that would not collide with user properties named iterator or match."
    ],
    "strongSignals": [
      "Separates Well-known Symbols from lookalike APIs and can draw the mental model."
    ]
  }
})
