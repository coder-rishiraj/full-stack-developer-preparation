import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Objects as Values",
  "whatIsIt": "Objects are collections of properties with identity on the heap. Arrays, functions, dates, maps, and your `{ }` literals are all objects. Assigning an object copies the reference, not the property bag. Property keys are strings or symbols. Objects are mutable by default.",
  "whyExists": "JS models everything structured — DOM nodes, hashes, modules — as objects so one property system and prototype chain can serve all of them.",
  "mentalModel": "A heap record with a pointer. Two variables can hold the same pointer; mutating through one is visible through the other.",
  "how": [
    "Create with `{}`, `Object.create`, classes, or `new`.",
    "Access with `.` or `[]`.",
    "Compare identity with ===; compare contents with a deep helper you control.",
    "Prototype chain supplies inherited methods like toString."
  ],
  "callout": {
    "title": "Watch for",
    "text": "`const copy = original` does not copy. Later mutations “mysteriously” change both names.",
    "variant": "warning"
  },
  "example": "const a = { n: 1 };\nconst b = a;\nb.n = 2;\nconst c = { n: 2 };\nconsole.log(a.n, a === b, a === c);\nconsole.log(typeof a, typeof [1], typeof (() => {}));",
  "exampleCaption": "Shared reference vs equal-looking object",
  "internals": [
    "Ordinary objects have [[Prototype]], [[Extensible]], and a property table.",
    "Exotic objects (arrays, typed arrays) override internal methods like [[DefineOwnProperty]].",
    "Functions are callable objects with [[ThisMode]] and [[Environment]]."
  ],
  "takeaways": [
    "Create with `{}`, `Object.create`, classes, or `new`.",
    "Access with `.` or `[]`.",
    "`const copy = original` does not copy. Later mutations “mysteriously” change both names.",
    "Ordinary objects have [[Prototype]], [[Extensible]], and a property table."
  ],
  "revision": [
    "Objects as Values: A heap record with a pointer. Two variables can hold the same pointer; mutating through one is visible through the other.",
    "Create with `{}`, `Object.create`, classes, or `new`.",
    "Access with `.` or `[]`.",
    "Compare identity with ===; compare contents with a deep helper you control.",
    "Trap: `const copy = original` does not copy. Later mutations “mysteriously” change both names."
  ],
  "flashcards": [
    [
      "Objects as Values",
      "Objects are collections of properties with identity on the heap."
    ],
    [
      "Mental model",
      "A heap record with a pointer. Two variables can hold the same pointer; mutating through one is visible through the other."
    ],
    [
      "Common trap",
      "`const copy = original` does not copy. Later mutations “mysteriously” change both names."
    ],
    [
      "Create with `{}`, `Object.create`, classes, or `new`.",
      "Access with `.` or `[]`."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Objects as Values and where does a beginner first see it?",
      "answerHint": "Objects are collections of properties with identity on the heap. Arrays, functions, dates, maps, and your `{ }` literals are all objects. Assigning an object copies the reference, not the property bag. Property keys are strings or symbols. Objects are mutable by default."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Objects as Values works and name the main pitfall.",
      "answerHint": "Create with `{}`, `Object.create`, classes, or `new`. Access with `.` or `[]`. Compare identity with ===; compare contents with a deep helper you control. Prototype chain supplies inherited methods like toString. Pitfall: `const copy = original` does not copy. Later mutations “mysteriously” change both names."
    },
    {
      "level": "advanced",
      "question": "How would you explain Objects as Values at an interview, including engine/spec details?",
      "answerHint": "Ordinary objects have [[Prototype]], [[Extensible]], and a property table. Exotic objects (arrays, typed arrays) override internal methods like [[DefineOwnProperty]]. Functions are callable objects with [[ThisMode]] and [[Environment]]."
    }
  ],
  "pitfalls": [
    "`const copy = original` does not copy. Later mutations “mysteriously” change both names.",
    "Prototype chain supplies inherited methods like toString."
  ],
  "interview": {
    "expectations": [
      "Explain Objects as Values without mixing it up with a nearby B1.3 — Types & Values topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Ordinary objects have [[Prototype]], [[Extensible]], and a property table."
    ],
    "commonQuestions": [
      "What is Objects as Values?",
      "Why does JavaScript objects as values behave this way?",
      "What is the classic Objects as Values interview trap?"
    ],
    "traps": [
      "`const copy = original` does not copy. Later mutations “mysteriously” change both names."
    ],
    "misconceptions": [
      "JS models everything structured — DOM nodes, hashes, modules — as objects so one property system and prototype chain can serve all of them."
    ],
    "strongSignals": [
      "Separates Objects as Values from lookalike APIs and can draw the mental model."
    ]
  }
})
