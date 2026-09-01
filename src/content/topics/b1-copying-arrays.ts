import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Copying Arrays",
  "whatIsIt": "Shallow copies: slice(), [...arr], Array.from(arr), concat(). Nested objects stay shared. structuredClone is deep (with limits). slice copies holes as holes; spread may or may not densify holes depending on iterator vs property copy — [...sparse] uses the iterator and yields undefined for holes, densifying.",
  "whyExists": "Immutability patterns need copies. The hole behavior difference between slice and spread is a sharp edge.",
  "mentalModel": "Shallow: new list, same item references. Spread on arrays uses the iterator (holes → undefined). slice copies properties (holes stay holes).",
  "how": [
    "Use slice or concat to preserve holes if you must.",
    "Use spread when you want a dense copy.",
    "Deep: structuredClone or a custom clone.",
    "arr.slice() is a common shallow clone."
  ],
  "callout": {
    "title": "Watch for",
    "text": "const b = a; is not a copy. const b = a.slice() is shallow — nested mutation still shows up in a.",
    "variant": "warning"
  },
  "example": "const a = [1, { n: 2 }];\nconst b = a.slice();\nb[1].n = 9;\nconsole.log(a[1].n);\nconst sparse = [1, , 3];\nconsole.log(sparse.slice(), [...sparse]);\nconst d = structuredClone(a);\nd[1].n = 1;\nconsole.log(a[1].n, d[1].n);\n",
  "exampleCaption": "Shallow nest share; slice vs spread holes; structuredClone",
  "internals": [
    "Array iterator yields Get(i) for 0..length-1, so holes become undefined.",
    "slice uses HasProperty and copies holes.",
    "spread of arrays uses the iterator protocol."
  ],
  "takeaways": [
    "Use slice or concat to preserve holes if you must.",
    "Use spread when you want a dense copy.",
    "const b = a; is not a copy. const b = a.slice() is shallow — nested mutation still shows up in a.",
    "Array iterator yields Get(i) for 0..length-1, so holes become undefined."
  ],
  "revision": [
    "Copying Arrays: Shallow: new list, same item references. Spread on arrays uses the iterator (holes → undefined). slice copies properties (holes stay holes).",
    "Use slice or concat to preserve holes if you must.",
    "Use spread when you want a dense copy.",
    "Deep: structuredClone or a custom clone.",
    "Trap: const b = a; is not a copy. const b = a.slice() is shallow — nested mutation still shows up in a."
  ],
  "flashcards": [
    [
      "Copying Arrays",
      "Shallow copies: slice(), [...arr], Array.from(arr), concat()."
    ],
    [
      "Mental model",
      "Shallow: new list, same item references. Spread on arrays uses the iterator (holes → undefined). slice copies properties (holes stay holes)."
    ],
    [
      "Common trap",
      "const b = a; is not a copy. const b = a.slice() is shallow — nested mutation still shows up in a."
    ],
    [
      "Use slice or concat to preserve holes if you must.",
      "Use spread when you want a dense copy."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Copying Arrays and where does a beginner first see it?",
      "answerHint": "Shallow copies: slice(), [...arr], Array.from(arr), concat(). Nested objects stay shared. structuredClone is deep (with limits). slice copies holes as holes; spread may or may not densify holes depending on iterator vs property copy — [...sparse] uses the iterator and yields undefined for holes, densifying."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Copying Arrays works and name the main pitfall.",
      "answerHint": "Use slice or concat to preserve holes if you must. Use spread when you want a dense copy. Deep: structuredClone or a custom clone. arr.slice() is a common shallow clone. Pitfall: const b = a; is not a copy. const b = a.slice() is shallow — nested mutation still shows up in a."
    },
    {
      "level": "advanced",
      "question": "How would you explain Copying Arrays at an interview, including engine/spec details?",
      "answerHint": "Array iterator yields Get(i) for 0..length-1, so holes become undefined. slice uses HasProperty and copies holes. spread of arrays uses the iterator protocol."
    }
  ],
  "pitfalls": [
    "const b = a; is not a copy. const b = a.slice() is shallow — nested mutation still shows up in a.",
    "arr.slice() is a common shallow clone."
  ],
  "interview": {
    "expectations": [
      "Explain Copying Arrays without mixing it up with a nearby B1.18 — Arrays topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Array iterator yields Get(i) for 0..length-1, so holes become undefined."
    ],
    "commonQuestions": [
      "What is Copying Arrays?",
      "Why does JavaScript copying arrays behave this way?",
      "What is the classic Copying Arrays interview trap?"
    ],
    "traps": [
      "const b = a; is not a copy. const b = a.slice() is shallow — nested mutation still shows up in a."
    ],
    "misconceptions": [
      "Immutability patterns need copies. The hole behavior difference between slice and spread is a sharp edge."
    ],
    "strongSignals": [
      "Separates Copying Arrays from lookalike APIs and can draw the mental model."
    ]
  }
})
