import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Hidden Classes / Inline Caching",
  "whatIsIt": "Hidden classes (shapes/maps) are V8’s internal type for object layout: the same property names added in the same order share a shape. Adding properties in different orders, deleting, or mixing types at a site makes megamorphic ICs. This is an optimization, not a language rule — behavior stays spec-correct.",
  "whyExists": "Dynamic objects are slow if every read is a hash lookup. Shapes let engines treat objects like structs when they look regular.",
  "mentalModel": "Objects that grew the same way share a blueprint. A weird extra property makes a new blueprint and can slow the factory line.",
  "how": [
    "Initialize all fields in the constructor in the same order.",
    "Avoid delete in hot objects; set null.",
    "Do not add optional fields late in a hot path without need.",
    "This never changes JavaScript semantics."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Thinking hidden classes are in the ECMAScript spec — they are not; they are an engine trick.",
    "variant": "warning"
  },
  "example": "function A(x) { this.x = x; this.y = 1; }\nfunction B(x) { this.y = 1; this.x = x; }\nconst a = new A(1);\nconst b = new B(1);\nfunction read(o) { return o.x + o.y; }\nconsole.log(read(a), read(b));\n",
  "exampleCaption": "Same fields, different init order — two shapes",
  "internals": [
    "Transition tree of maps as properties are added.",
    "Inline cache records the map seen at a load.",
    "Megamorphic ICs fall back to slow lookup."
  ],
  "takeaways": [
    "Initialize all fields in the constructor in the same order.",
    "Avoid delete in hot objects; set null.",
    "Thinking hidden classes are in the ECMAScript spec — they are not; they are an engine trick.",
    "Transition tree of maps as properties are added."
  ],
  "revision": [
    "Hidden Classes / Inline Caching: Objects that grew the same way share a blueprint. A weird extra property makes a new blueprint and can slow the factory line.",
    "Initialize all fields in the constructor in the same order.",
    "Avoid delete in hot objects; set null.",
    "Do not add optional fields late in a hot path without need.",
    "Trap: Thinking hidden classes are in the ECMAScript spec — they are not; they are an engine trick."
  ],
  "flashcards": [
    [
      "Hidden Classes / Inline Caching",
      "Hidden classes (shapes/maps) are V8’s internal type for object layout: the same property names added in the same order share a shape."
    ],
    [
      "Mental model",
      "Objects that grew the same way share a blueprint. A weird extra property makes a new blueprint and can slow the factory line."
    ],
    [
      "Common trap",
      "Thinking hidden classes are in the ECMAScript spec — they are not; they are an engine trick."
    ],
    [
      "Initialize all fields in the constructor in the same order.",
      "Avoid delete in hot objects; set null."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Hidden Classes / Inline Caching and where does a beginner first see it?",
      "answerHint": "Hidden classes (shapes/maps) are V8’s internal type for object layout: the same property names added in the same order share a shape. Adding properties in different orders, deleting, or mixing types at a site makes megamorphic ICs. This is an optimization, not a language rule — behavior stays spec-correct."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Hidden Classes / Inline Caching works and name the main pitfall.",
      "answerHint": "Initialize all fields in the constructor in the same order. Avoid delete in hot objects; set null. Do not add optional fields late in a hot path without need. This never changes JavaScript semantics. Pitfall: Thinking hidden classes are in the ECMAScript spec — they are not; they are an engine trick."
    },
    {
      "level": "advanced",
      "question": "How would you explain Hidden Classes / Inline Caching at an interview, including engine/spec details?",
      "answerHint": "Transition tree of maps as properties are added. Inline cache records the map seen at a load. Megamorphic ICs fall back to slow lookup."
    }
  ],
  "pitfalls": [
    "Thinking hidden classes are in the ECMAScript spec — they are not; they are an engine trick.",
    "This never changes JavaScript semantics."
  ],
  "interview": {
    "expectations": [
      "Explain Hidden Classes / Inline Caching without mixing it up with a nearby B1.25 — JavaScript Runtime & Engine topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Transition tree of maps as properties are added."
    ],
    "commonQuestions": [
      "What is Hidden Classes / Inline Caching?",
      "Why does JavaScript hidden classes / inline caching behave this way?",
      "What is the classic Hidden Classes / Inline Caching interview trap?"
    ],
    "traps": [
      "Thinking hidden classes are in the ECMAScript spec — they are not; they are an engine trick."
    ],
    "misconceptions": [
      "Dynamic objects are slow if every read is a hash lookup. Shapes let engines treat objects like structs when they look regular."
    ],
    "strongSignals": [
      "Separates Hidden Classes / Inline Caching from lookalike APIs and can draw the mental model."
    ]
  }
})
