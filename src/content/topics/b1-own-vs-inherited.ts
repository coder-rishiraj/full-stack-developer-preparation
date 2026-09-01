import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Own vs Inherited Properties",
  "whatIsIt": "Own properties live on the object. Inherited properties live on a prototype and are visible via [[Get]] and in. Methods like toString are inherited. Overwriting a name on the instance shadows the prototype. hasOwn / getOwnPropertyDescriptor see only own.",
  "whyExists": "Prototypes share behavior without copying methods onto every instance. The own/inherited split is how sharing works.",
  "mentalModel": "Your backpack (own) vs the school handbook in the library (inherited). You can still read the handbook; stuffing a paper in your backpack hides that page.",
  "how": [
    "Put instance data as own; methods on the prototype.",
    "Shadowing: instance.method = ... hides prototype.method.",
    "for...in sees enumerable inherited; Object.keys does not.",
    "delete on own reveals inherited again."
  ],
  "callout": {
    "title": "Watch for",
    "text": "JSON.stringify omits inherited enumerable props — they are not own.",
    "variant": "warning"
  },
  "example": "const proto = { role: 'user', greet() { return this.role; } };\nconst o = Object.create(proto);\no.name = 'Ada';\nconsole.log(o.name, o.role, Object.hasOwn(o, 'role'), o.greet());\no.role = 'admin';\nconsole.log(o.role, proto.role);\ndelete o.role;\nconsole.log(o.role);\n",
  "exampleCaption": "Own name vs inherited role; shadow then delete",
  "internals": [
    "[[Get]] walks [[Prototype]]; [[GetOwnProperty]] does not.",
    "[[Set]] may define an own property that shadows (ordinary set).",
    "for-in uses enumerability on the walk."
  ],
  "takeaways": [
    "Put instance data as own; methods on the prototype.",
    "Shadowing: instance.method = ... hides prototype.method.",
    "JSON.stringify omits inherited enumerable props — they are not own.",
    "[[Get]] walks [[Prototype]]; [[GetOwnProperty]] does not."
  ],
  "revision": [
    "Own vs Inherited Properties: Your backpack (own) vs the school handbook in the library (inherited). You can still read the handbook; stuffing a paper in your backpack hides that page.",
    "Put instance data as own; methods on the prototype.",
    "Shadowing: instance.method = ... hides prototype.method.",
    "for...in sees enumerable inherited; Object.keys does not.",
    "Trap: JSON.stringify omits inherited enumerable props — they are not own."
  ],
  "flashcards": [
    [
      "Own vs Inherited Properties",
      "Own properties live on the object."
    ],
    [
      "Mental model",
      "Your backpack (own) vs the school handbook in the library (inherited). You can still read the handbook; stuffing a paper in your backpack hides that page."
    ],
    [
      "Common trap",
      "JSON.stringify omits inherited enumerable props — they are not own."
    ],
    [
      "Put instance data as own; methods on the prototype.",
      "Shadowing: instance.method = ... hides prototype.method."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Own vs Inherited Properties and where does a beginner first see it?",
      "answerHint": "Own properties live on the object. Inherited properties live on a prototype and are visible via [[Get]] and in. Methods like toString are inherited. Overwriting a name on the instance shadows the prototype. hasOwn / getOwnPropertyDescriptor see only own."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Own vs Inherited Properties works and name the main pitfall.",
      "answerHint": "Put instance data as own; methods on the prototype. Shadowing: instance.method = ... hides prototype.method. for...in sees enumerable inherited; Object.keys does not. delete on own reveals inherited again. Pitfall: JSON.stringify omits inherited enumerable props — they are not own."
    },
    {
      "level": "advanced",
      "question": "How would you explain Own vs Inherited Properties at an interview, including engine/spec details?",
      "answerHint": "[[Get]] walks [[Prototype]]; [[GetOwnProperty]] does not. [[Set]] may define an own property that shadows (ordinary set). for-in uses enumerability on the walk."
    }
  ],
  "pitfalls": [
    "JSON.stringify omits inherited enumerable props — they are not own.",
    "delete on own reveals inherited again."
  ],
  "interview": {
    "expectations": [
      "Explain Own vs Inherited Properties without mixing it up with a nearby B1.14 — Object Property Model topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "[[Get]] walks [[Prototype]]; [[GetOwnProperty]] does not."
    ],
    "commonQuestions": [
      "What is Own vs Inherited Properties?",
      "Why does JavaScript own vs inherited properties behave this way?",
      "What is the classic Own vs Inherited Properties interview trap?"
    ],
    "traps": [
      "JSON.stringify omits inherited enumerable props — they are not own."
    ],
    "misconceptions": [
      "Prototypes share behavior without copying methods onto every instance. The own/inherited split is how sharing works."
    ],
    "strongSignals": [
      "Separates Own vs Inherited Properties from lookalike APIs and can draw the mental model."
    ]
  }
})
