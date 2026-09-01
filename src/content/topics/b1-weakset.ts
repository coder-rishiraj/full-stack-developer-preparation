import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "WeakSet",
  "whatIsIt": "WeakSet stores unique object (or allowed symbol) values weakly. has/add/delete, no size, no iteration. Use as a ‘seen’ mark on objects without keeping them alive. Not for primitives. Like a WeakMap where the value is just ‘present.’",
  "whyExists": "Marking nodes as visited in a graph without leaking the nodes after the walk is done (if nothing else holds them).",
  "mentalModel": "A faint stamp on objects: ‘I’ve seen you.’ When the object dies, the stamp dies. You cannot print all stamped objects.",
  "how": [
    "seen.add(node) during a walk of a possibly cyclic object graph.",
    "Cannot store strings — use Set.",
    "No .size — if you need counts, use Set.",
    "Same GC caveats as WeakMap."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Trying WeakSet of user ids (strings) throws TypeError — keys must be objects.",
    "variant": "warning"
  },
  "example": "const seen = new WeakSet();\nfunction walk(obj) {\n  if (obj === null || typeof obj !== 'object') return 0;\n  if (seen.has(obj)) return 0;\n  seen.add(obj);\n  return 1 + Object.values(obj).reduce((s, v) => s + walk(v), 0);\n}\nconst a = { n: 1 };\na.self = a;\nconsole.log(walk(a));\n",
  "exampleCaption": "WeakSet cycle guard in a graph walk",
  "internals": [
    "[[WeakSetData]] holding weakly.",
    "SameValue for object identity.",
    "No iterator protocol on WeakSet."
  ],
  "takeaways": [
    "seen.add(node) during a walk of a possibly cyclic object graph.",
    "Cannot store strings — use Set.",
    "Trying WeakSet of user ids (strings) throws TypeError — keys must be objects.",
    "[[WeakSetData]] holding weakly."
  ],
  "revision": [
    "WeakSet: A faint stamp on objects: ‘I’ve seen you.’ When the object dies, the stamp dies. You cannot print all stamped objects.",
    "seen.add(node) during a walk of a possibly cyclic object graph.",
    "Cannot store strings — use Set.",
    "No .size — if you need counts, use Set.",
    "Trap: Trying WeakSet of user ids (strings) throws TypeError — keys must be objects."
  ],
  "flashcards": [
    [
      "WeakSet",
      "WeakSet stores unique object (or allowed symbol) values weakly."
    ],
    [
      "Mental model",
      "A faint stamp on objects: ‘I’ve seen you.’ When the object dies, the stamp dies. You cannot print all stamped objects."
    ],
    [
      "Common trap",
      "Trying WeakSet of user ids (strings) throws TypeError — keys must be objects."
    ],
    [
      "seen.add(node) during a walk of a possibly cyclic object graph.",
      "Cannot store strings — use Set."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is WeakSet and where does a beginner first see it?",
      "answerHint": "WeakSet stores unique object (or allowed symbol) values weakly. has/add/delete, no size, no iteration. Use as a ‘seen’ mark on objects without keeping them alive. Not for primitives. Like a WeakMap where the value is just ‘present.’"
    },
    {
      "level": "intermediate",
      "question": "Walk through how WeakSet works and name the main pitfall.",
      "answerHint": "seen.add(node) during a walk of a possibly cyclic object graph. Cannot store strings — use Set. No .size — if you need counts, use Set. Same GC caveats as WeakMap. Pitfall: Trying WeakSet of user ids (strings) throws TypeError — keys must be objects."
    },
    {
      "level": "advanced",
      "question": "How would you explain WeakSet at an interview, including engine/spec details?",
      "answerHint": "[[WeakSetData]] holding weakly. SameValue for object identity. No iterator protocol on WeakSet."
    }
  ],
  "pitfalls": [
    "Trying WeakSet of user ids (strings) throws TypeError — keys must be objects.",
    "Same GC caveats as WeakMap."
  ],
  "interview": {
    "expectations": [
      "Explain WeakSet without mixing it up with a nearby B1.19 — Maps, Sets & Weak Collections topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "[[WeakSetData]] holding weakly."
    ],
    "commonQuestions": [
      "What is WeakSet?",
      "Why does JavaScript weakset behave this way?",
      "What is the classic WeakSet interview trap?"
    ],
    "traps": [
      "Trying WeakSet of user ids (strings) throws TypeError — keys must be objects."
    ],
    "misconceptions": [
      "Marking nodes as visited in a graph without leaking the nodes after the walk is done (if nothing else holds them)."
    ],
    "strongSignals": [
      "Separates WeakSet from lookalike APIs and can draw the mental model."
    ]
  }
})
