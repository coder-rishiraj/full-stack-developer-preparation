import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "for...of vs for...in",
  "whatIsIt": "for...of iterates iterable values (arrays, strings, maps, sets) via @@iterator. for...in enumerates enumerable property keys (strings) along the prototype chain, including inherited. for...in on arrays can include extra enumerable properties and skip holes differently than you expect. Never use for...in for arrays.",
  "whyExists": "Objects needed a key walk; ES2015 iterables needed a value walk. Two loops, two protocols.",
  "mentalModel": "of = values from an iterator. in = keys from enumerable properties, including mom’s keys on the prototype.",
  "how": [
    "Arrays, maps, sets: for...of.",
    "Plain objects: Object.keys / entries, not for...in, unless you want prototypes.",
    "for...in keys are always strings, even for array indexes.",
    "Use hasOwn inside for...in if you must filter inherited."
  ],
  "callout": {
    "title": "Watch for",
    "text": "for...in on [1,2] plus a library that added Array.prototype.foo enumerates 'foo'.",
    "variant": "warning"
  },
  "example": "const arr = [10, 20];\narr.extra = 99;\nconst proto = { inherited: 1 };\nconst obj = Object.create(proto);\nobj.own = 2;\nfor (const v of arr) console.log('of', v);\nfor (const k in arr) console.log('in arr', k);\nfor (const k in obj) console.log('in obj', k);\n",
  "exampleCaption": "for...of values vs for...in keys (and extras)",
  "internals": [
    "for-of: GetIterator, IteratorStep, IteratorValue.",
    "for-in: EnumerateObjectProperties, which is somewhat implementation-defined in order.",
    "Integer indexes on arrays are enumerable string keys by default."
  ],
  "takeaways": [
    "Arrays, maps, sets: for...of.",
    "Plain objects: Object.keys / entries, not for...in, unless you want prototypes.",
    "for...in on [1,2] plus a library that added Array.prototype.foo enumerates 'foo'.",
    "for-of: GetIterator, IteratorStep, IteratorValue."
  ],
  "revision": [
    "for...of vs for...in: of = values from an iterator. in = keys from enumerable properties, including mom’s keys on the prototype.",
    "Arrays, maps, sets: for...of.",
    "Plain objects: Object.keys / entries, not for...in, unless you want prototypes.",
    "for...in keys are always strings, even for array indexes.",
    "Trap: for...in on [1,2] plus a library that added Array.prototype.foo enumerates 'foo'."
  ],
  "flashcards": [
    [
      "for...of vs for...in",
      "for...of iterates iterable values (arrays, strings, maps, sets) via @@iterator."
    ],
    [
      "Mental model",
      "of = values from an iterator. in = keys from enumerable properties, including mom’s keys on the prototype."
    ],
    [
      "Common trap",
      "for...in on [1,2] plus a library that added Array.prototype.foo enumerates 'foo'."
    ],
    [
      "Arrays, maps, sets: for...of.",
      "Plain objects: Object.keys / entries, not for...in, unless you want prototypes."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is for...of vs for...in and where does a beginner first see it?",
      "answerHint": "for...of iterates iterable values (arrays, strings, maps, sets) via @@iterator. for...in enumerates enumerable property keys (strings) along the prototype chain, including inherited. for...in on arrays can include extra enumerable properties and skip holes differently than you expect. Never use for...in for arrays."
    },
    {
      "level": "intermediate",
      "question": "Walk through how for...of vs for...in works and name the main pitfall.",
      "answerHint": "Arrays, maps, sets: for...of. Plain objects: Object.keys / entries, not for...in, unless you want prototypes. for...in keys are always strings, even for array indexes. Use hasOwn inside for...in if you must filter inherited. Pitfall: for...in on [1,2] plus a library that added Array.prototype.foo enumerates 'foo'."
    },
    {
      "level": "advanced",
      "question": "How would you explain for...of vs for...in at an interview, including engine/spec details?",
      "answerHint": "for-of: GetIterator, IteratorStep, IteratorValue. for-in: EnumerateObjectProperties, which is somewhat implementation-defined in order. Integer indexes on arrays are enumerable string keys by default."
    }
  ],
  "pitfalls": [
    "for...in on [1,2] plus a library that added Array.prototype.foo enumerates 'foo'.",
    "Use hasOwn inside for...in if you must filter inherited."
  ],
  "interview": {
    "expectations": [
      "Explain for...of vs for...in without mixing it up with a nearby B1.6 — Control Flow topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "for-of: GetIterator, IteratorStep, IteratorValue."
    ],
    "commonQuestions": [
      "What is for...of vs for...in?",
      "Why does JavaScript for...of vs for...in behave this way?",
      "What is the classic for...of vs for...in interview trap?"
    ],
    "traps": [
      "for...in on [1,2] plus a library that added Array.prototype.foo enumerates 'foo'."
    ],
    "misconceptions": [
      "Objects needed a key walk; ES2015 iterables needed a value walk. Two loops, two protocols."
    ],
    "strongSignals": [
      "Separates for...of vs for...in from lookalike APIs and can draw the mental model."
    ]
  }
})
