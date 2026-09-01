import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Object.assign / Object.create",
  "whatIsIt": "Object.assign(target, ...sources) copies enumerable own properties (including symbols in modern engines via [[OwnPropertyKeys]] filtered by enumerable) into target and returns target. Object.create(proto, descriptors?) makes a new object with a chosen prototype and optional property descriptors. create(null) has no prototype.",
  "whyExists": "Mixing mixins and setting prototypes without constructor functions needed standard functions.",
  "mentalModel": "assign: photocopy enumerable own fields onto an existing bag (shallow). create: empty bag with a chosen parent.",
  "how": [
    "assign mutates target — pass {} for a shallow clone.",
    "create(null) for a pure dictionary (no toString inherit).",
    "assign copies accessors as values (invokes getters).",
    "create with descriptors for non-enumerable fields."
  ],
  "callout": {
    "title": "Watch for",
    "text": "assign copies getter results, not the getter — the accessor is flattened.",
    "variant": "warning"
  },
  "example": "const proto = { kind: 'shape' };\nconst o = Object.create(proto);\no.x = 1;\nconsole.log(o.kind, Object.keys(o));\nconst dict = Object.create(null);\ndict.a = 1;\nconsole.log('toString' in dict, dict.a);\nconst t = Object.assign({ a: 1 }, { b: 2 }, { a: 3 });\nconsole.log(t);\n",
  "exampleCaption": "create(proto), create(null), assign overwrite",
  "internals": [
    "assign: CopyDataProperties / [[Get]] then Set.",
    "create: OrdinaryObjectCreate(proto) then DefineProperties if given.",
    "null prototype objects still can have properties; HasProperty stops at null."
  ],
  "takeaways": [
    "assign mutates target — pass {} for a shallow clone.",
    "create(null) for a pure dictionary (no toString inherit).",
    "assign copies getter results, not the getter — the accessor is flattened.",
    "assign: CopyDataProperties / [[Get]] then Set."
  ],
  "revision": [
    "Object.assign / Object.create: assign: photocopy enumerable own fields onto an existing bag (shallow). create: empty bag with a chosen parent.",
    "assign mutates target — pass {} for a shallow clone.",
    "create(null) for a pure dictionary (no toString inherit).",
    "assign copies accessors as values (invokes getters).",
    "Trap: assign copies getter results, not the getter — the accessor is flattened."
  ],
  "flashcards": [
    [
      "Object.assign / Object.create",
      "Object.assign(target, ...sources) copies enumerable own properties (including symbols in modern engines via [[OwnPropertyKeys]] filtered by enumerable) into target and returns target."
    ],
    [
      "Mental model",
      "assign: photocopy enumerable own fields onto an existing bag (shallow). create: empty bag with a chosen parent."
    ],
    [
      "Common trap",
      "assign copies getter results, not the getter — the accessor is flattened."
    ],
    [
      "assign mutates target — pass {} for a shallow clone.",
      "create(null) for a pure dictionary (no toString inherit)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Object.assign / Object.create and where does a beginner first see it?",
      "answerHint": "Object.assign(target, ...sources) copies enumerable own properties (including symbols in modern engines via [[OwnPropertyKeys]] filtered by enumerable) into target and returns target. Object.create(proto, descriptors?) makes a new object with a chosen prototype and optional property descriptors. create(null) has no prototype."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Object.assign / Object.create works and name the main pitfall.",
      "answerHint": "assign mutates target — pass {} for a shallow clone. create(null) for a pure dictionary (no toString inherit). assign copies accessors as values (invokes getters). create with descriptors for non-enumerable fields. Pitfall: assign copies getter results, not the getter — the accessor is flattened."
    },
    {
      "level": "advanced",
      "question": "How would you explain Object.assign / Object.create at an interview, including engine/spec details?",
      "answerHint": "assign: CopyDataProperties / [[Get]] then Set. create: OrdinaryObjectCreate(proto) then DefineProperties if given. null prototype objects still can have properties; HasProperty stops at null."
    }
  ],
  "pitfalls": [
    "assign copies getter results, not the getter — the accessor is flattened.",
    "create with descriptors for non-enumerable fields."
  ],
  "interview": {
    "expectations": [
      "Explain Object.assign / Object.create without mixing it up with a nearby B1.13 — Objects topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "assign: CopyDataProperties / [[Get]] then Set."
    ],
    "commonQuestions": [
      "What is Object.assign / Object.create?",
      "Why does JavaScript object.assign / object.create behave this way?",
      "What is the classic Object.assign / Object.create interview trap?"
    ],
    "traps": [
      "assign copies getter results, not the getter — the accessor is flattened."
    ],
    "misconceptions": [
      "Mixing mixins and setting prototypes without constructor functions needed standard functions."
    ],
    "strongSignals": [
      "Separates Object.assign / Object.create from lookalike APIs and can draw the mental model."
    ]
  }
})
