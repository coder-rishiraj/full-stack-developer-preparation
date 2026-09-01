import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Array Creation, Indexing, Length",
  "whatIsIt": "Arrays are objects with special [[DefineOwnProperty]] for indexes and a length property. Indexes are string keys '0','1',... Length is lastIndex+1 for dense arrays, but can be set. Holes are missing own indexes. Arrays are mutable and 0-based. typeof array is 'object'; Array.isArray is the check.",
  "whyExists": "Lists are the main collection for UI data. Making them objects let methods live on Array.prototype.",
  "mentalModel": "A numbered shelf with a length sign. Empty slots (holes) are not the same as slots holding undefined.",
  "how": [
    "Use [] literals or Array.from, not new Array(n) unless you want holes.",
    "Array.isArray for type tests.",
    "length = 0 clears; shrinking length deletes indexes.",
    "Do not use for...in to iterate arrays."
  ],
  "callout": {
    "title": "Watch for",
    "text": "new Array(3) is not [undefined, undefined, undefined] — map skips holes.",
    "variant": "warning"
  },
  "example": "const a = [10, 20, 30];\nconsole.log(a[0], a.length, Array.isArray(a));\na.length = 2;\nconsole.log(a);\nconst holes = new Array(3);\nconsole.log(holes.length, 0 in holes, holes.map(() => 1));\n",
  "exampleCaption": "length shrink vs new Array(3) holes",
  "internals": [
    "Array exotic object: length vs integer index invariants.",
    "DefineOwnProperty on indexes updates length.",
    "IsArray is true for proxies of arrays too."
  ],
  "takeaways": [
    "Use [] literals or Array.from, not new Array(n) unless you want holes.",
    "Array.isArray for type tests.",
    "new Array(3) is not [undefined, undefined, undefined] — map skips holes.",
    "Array exotic object: length vs integer index invariants."
  ],
  "revision": [
    "Array Creation, Indexing, Length: A numbered shelf with a length sign. Empty slots (holes) are not the same as slots holding undefined.",
    "Use [] literals or Array.from, not new Array(n) unless you want holes.",
    "Array.isArray for type tests.",
    "length = 0 clears; shrinking length deletes indexes.",
    "Trap: new Array(3) is not [undefined, undefined, undefined] — map skips holes."
  ],
  "flashcards": [
    [
      "Array Creation, Indexing, Length",
      "Arrays are objects with special [[DefineOwnProperty]] for indexes and a length property."
    ],
    [
      "Mental model",
      "A numbered shelf with a length sign. Empty slots (holes) are not the same as slots holding undefined."
    ],
    [
      "Common trap",
      "new Array(3) is not [undefined, undefined, undefined] — map skips holes."
    ],
    [
      "Use [] literals or Array.from, not new Array(n) unless you want holes.",
      "Array.isArray for type tests."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Array Creation, Indexing, Length and where does a beginner first see it?",
      "answerHint": "Arrays are objects with special [[DefineOwnProperty]] for indexes and a length property. Indexes are string keys '0','1',... Length is lastIndex+1 for dense arrays, but can be set. Holes are missing own indexes. Arrays are mutable and 0-based. typeof array is 'object'; Array.isArray is the check."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Array Creation, Indexing, Length works and name the main pitfall.",
      "answerHint": "Use [] literals or Array.from, not new Array(n) unless you want holes. Array.isArray for type tests. length = 0 clears; shrinking length deletes indexes. Do not use for...in to iterate arrays. Pitfall: new Array(3) is not [undefined, undefined, undefined] — map skips holes."
    },
    {
      "level": "advanced",
      "question": "How would you explain Array Creation, Indexing, Length at an interview, including engine/spec details?",
      "answerHint": "Array exotic object: length vs integer index invariants. DefineOwnProperty on indexes updates length. IsArray is true for proxies of arrays too."
    }
  ],
  "pitfalls": [
    "new Array(3) is not [undefined, undefined, undefined] — map skips holes.",
    "Do not use for...in to iterate arrays."
  ],
  "interview": {
    "expectations": [
      "Explain Array Creation, Indexing, Length without mixing it up with a nearby B1.18 — Arrays topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Array exotic object: length vs integer index invariants."
    ],
    "commonQuestions": [
      "What is Array Creation, Indexing, Length?",
      "Why does JavaScript array creation, indexing, length behave this way?",
      "What is the classic Array Creation, Indexing, Length interview trap?"
    ],
    "traps": [
      "new Array(3) is not [undefined, undefined, undefined] — map skips holes."
    ],
    "misconceptions": [
      "Lists are the main collection for UI data. Making them objects let methods live on Array.prototype."
    ],
    "strongSignals": [
      "Separates Array Creation, Indexing, Length from lookalike APIs and can draw the mental model."
    ]
  }
})
