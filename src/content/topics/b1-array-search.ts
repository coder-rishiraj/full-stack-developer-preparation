import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Searching Arrays",
  "whatIsIt": "indexOf/lastIndexOf use === and return -1 if missing. includes uses SameValueZero (finds NaN, treats +0/-0 as equal). find/findIndex/findLast take a predicate. includes on objects looks for the same reference. Search is linear unless you build a Map/Set.",
  "whyExists": "Finding an element is the most common list task. includes was added because indexOf(NaN) was -1.",
  "mentalModel": "Walk from the left (or right). includes has a slightly different equality than indexOf.",
  "how": [
    "includes for existence; indexOf for position of primitives.",
    "find for objects matching a predicate.",
    "Do not if (arr.indexOf(x)) — 0 is found.",
    "Build a Set for repeated membership tests."
  ],
  "callout": {
    "title": "Watch for",
    "text": "indexOf({id:1}) is -1 even if an equal-looking object is in the array.",
    "variant": "warning"
  },
  "example": "const a = [1, NaN, 0, { id: 1 }];\nconsole.log(a.indexOf(NaN), a.includes(NaN));\nconsole.log(a.indexOf(0), a.includes(-0));\nconsole.log(a.find((x) => x.id === 1));\nconsole.log(a.indexOf({ id: 1 }));\n",
  "exampleCaption": "NaN, -0, find vs indexOf object identity",
  "internals": [
    "indexOf uses Strict Equality; includes uses SameValueZero.",
    "find calls the predicate for each index including holes (holes pass undefined).",
    "find is generic; sparse vs dense differs from forEach (forEach skips holes)."
  ],
  "takeaways": [
    "includes for existence; indexOf for position of primitives.",
    "find for objects matching a predicate.",
    "indexOf({id:1}) is -1 even if an equal-looking object is in the array.",
    "indexOf uses Strict Equality; includes uses SameValueZero."
  ],
  "revision": [
    "Searching Arrays: Walk from the left (or right). includes has a slightly different equality than indexOf.",
    "includes for existence; indexOf for position of primitives.",
    "find for objects matching a predicate.",
    "Do not if (arr.indexOf(x)) — 0 is found.",
    "Trap: indexOf({id:1}) is -1 even if an equal-looking object is in the array."
  ],
  "flashcards": [
    [
      "Searching Arrays",
      "indexOf/lastIndexOf use === and return -1 if missing."
    ],
    [
      "Mental model",
      "Walk from the left (or right). includes has a slightly different equality than indexOf."
    ],
    [
      "Common trap",
      "indexOf({id:1}) is -1 even if an equal-looking object is in the array."
    ],
    [
      "includes for existence; indexOf for position of primitives.",
      "find for objects matching a predicate."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Searching Arrays and where does a beginner first see it?",
      "answerHint": "indexOf/lastIndexOf use === and return -1 if missing. includes uses SameValueZero (finds NaN, treats +0/-0 as equal). find/findIndex/findLast take a predicate. includes on objects looks for the same reference. Search is linear unless you build a Map/Set."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Searching Arrays works and name the main pitfall.",
      "answerHint": "includes for existence; indexOf for position of primitives. find for objects matching a predicate. Do not if (arr.indexOf(x)) — 0 is found. Build a Set for repeated membership tests. Pitfall: indexOf({id:1}) is -1 even if an equal-looking object is in the array."
    },
    {
      "level": "advanced",
      "question": "How would you explain Searching Arrays at an interview, including engine/spec details?",
      "answerHint": "indexOf uses Strict Equality; includes uses SameValueZero. find calls the predicate for each index including holes (holes pass undefined). find is generic; sparse vs dense differs from forEach (forEach skips holes)."
    }
  ],
  "pitfalls": [
    "indexOf({id:1}) is -1 even if an equal-looking object is in the array.",
    "Build a Set for repeated membership tests."
  ],
  "interview": {
    "expectations": [
      "Explain Searching Arrays without mixing it up with a nearby B1.18 — Arrays topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "indexOf uses Strict Equality; includes uses SameValueZero."
    ],
    "commonQuestions": [
      "What is Searching Arrays?",
      "Why does JavaScript searching arrays behave this way?",
      "What is the classic Searching Arrays interview trap?"
    ],
    "traps": [
      "indexOf({id:1}) is -1 even if an equal-looking object is in the array."
    ],
    "misconceptions": [
      "Finding an element is the most common list task. includes was added because indexOf(NaN) was -1."
    ],
    "strongSignals": [
      "Separates Searching Arrays from lookalike APIs and can draw the mental model."
    ]
  }
})
