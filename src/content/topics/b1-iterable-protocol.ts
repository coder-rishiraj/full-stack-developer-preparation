import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Iterable / Iterator Protocol",
  "whatIsIt": "The iterable protocol: obj[Symbol.iterator]() must return an iterator. The iterator protocol: next() returns an IteratorResult. Optional return()/throw() for cleanup and generator communication. Built-ins: Array, String, Map, Set, TypedArray, arguments, NodeList in browsers.",
  "whyExists": "A standard duck type so language features (for-of, yield*, spread) work on any library collection.",
  "mentalModel": "If you have a well-known iterator method, JS can walk you. If you only have next, you are a cursor, not necessarily restartable.",
  "how": [
    "Make restartable iterables return a new iterator each @@iterator call.",
    "Implement return() if you hold resources (files, locks).",
    "Strings iterate code units? Actually they iterate UTF-16 code units... wait, they iterate code points via string iterator.",
    "Map iterates entries by default."
  ],
  "callout": {
    "title": "Watch for",
    "text": "A class that returns `this` from @@iterator is exhausted after one for-of unless you reset state.",
    "variant": "warning"
  },
  "example": "const restartable = {\n  *[Symbol.iterator]() {\n    yield 1; yield 2;\n  },\n};\nconsole.log([...restartable], [...restartable]);\nconst once = restartable[Symbol.iterator]();\nconsole.log(once.next(), once.next(), once.next());\nconsole.log([... '🙂']);\n",
  "exampleCaption": "Restartable iterable vs consumed iterator; string code points",
  "internals": [
    "If @@iterator is missing, GetIterator throws TypeError.",
    "String iterator uses code points (CodePointAt), not raw [i] units only.",
    "IteratorResult objects that are not objects throw."
  ],
  "takeaways": [
    "Make restartable iterables return a new iterator each @@iterator call.",
    "Implement return() if you hold resources (files, locks).",
    "A class that returns `this` from @@iterator is exhausted after one for-of unless you reset state.",
    "If @@iterator is missing, GetIterator throws TypeError."
  ],
  "revision": [
    "Iterable / Iterator Protocol: If you have a well-known iterator method, JS can walk you. If you only have next, you are a cursor, not necessarily restartable.",
    "Make restartable iterables return a new iterator each @@iterator call.",
    "Implement return() if you hold resources (files, locks).",
    "Strings iterate code units? Actually they iterate UTF-16 code units... wait, they iterate code points via string iterator.",
    "Trap: A class that returns `this` from @@iterator is exhausted after one for-of unless you reset state."
  ],
  "flashcards": [
    [
      "Iterable / Iterator Protocol",
      "The iterable protocol: obj[Symbol.iterator]() must return an iterator."
    ],
    [
      "Mental model",
      "If you have a well-known iterator method, JS can walk you. If you only have next, you are a cursor, not necessarily restartable."
    ],
    [
      "Common trap",
      "A class that returns `this` from @@iterator is exhausted after one for-of unless you reset state."
    ],
    [
      "Make restartable iterables return a new iterator each @@iterator call.",
      "Implement return() if you hold resources (files, locks)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Iterable / Iterator Protocol and where does a beginner first see it?",
      "answerHint": "The iterable protocol: obj[Symbol.iterator]() must return an iterator. The iterator protocol: next() returns an IteratorResult. Optional return()/throw() for cleanup and generator communication. Built-ins: Array, String, Map, Set, TypedArray, arguments, NodeList in browsers."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Iterable / Iterator Protocol works and name the main pitfall.",
      "answerHint": "Make restartable iterables return a new iterator each @@iterator call. Implement return() if you hold resources (files, locks). Strings iterate code units? Actually they iterate UTF-16 code units... wait, they iterate code points via string iterator. Map iterates entries by default. Pitfall: A class that returns `this` from @@iterator is exhausted after one for-of unless you reset state."
    },
    {
      "level": "advanced",
      "question": "How would you explain Iterable / Iterator Protocol at an interview, including engine/spec details?",
      "answerHint": "If @@iterator is missing, GetIterator throws TypeError. String iterator uses code points (CodePointAt), not raw [i] units only. IteratorResult objects that are not objects throw."
    }
  ],
  "pitfalls": [
    "A class that returns `this` from @@iterator is exhausted after one for-of unless you reset state.",
    "Map iterates entries by default."
  ],
  "interview": {
    "expectations": [
      "Explain Iterable / Iterator Protocol without mixing it up with a nearby B1.21 — Iterables, Iterators & Generators topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "If @@iterator is missing, GetIterator throws TypeError."
    ],
    "commonQuestions": [
      "What is Iterable / Iterator Protocol?",
      "Why does JavaScript iterable / iterator protocol behave this way?",
      "What is the classic Iterable / Iterator Protocol interview trap?"
    ],
    "traps": [
      "A class that returns `this` from @@iterator is exhausted after one for-of unless you reset state."
    ],
    "misconceptions": [
      "A standard duck type so language features (for-of, yield*, spread) work on any library collection."
    ],
    "strongSignals": [
      "Separates Iterable / Iterator Protocol from lookalike APIs and can draw the mental model."
    ]
  }
})
