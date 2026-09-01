import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Classes vs Factories vs Constructors",
  "whatIsIt": "Classes: new, instanceof, prototypes, extends. Factories: functions that return objects (often with closures or Object.create). Factories skip new, can return different shapes, and hide privates easily. Constructors without class are the third path. Choose factories for simple ADTs; classes when you need instanceof and a shared prototype.",
  "whyExists": "JS can mint objects many ways. Teams fight about class vs factory; both compile to objects in memory.",
  "mentalModel": "class = stamp + shared method box. factory = custom build each time, maybe with a backpack of secrets.",
  "how": [
    "Use class when you have methods + inheritance + instanceof.",
    "Use factory when privacy and no-new API matter.",
    "Document whether callers use new.",
    "Do not mix randomly in one type."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Factory objects will fail instanceof PointC and may duplicate methods per instance (memory).",
    "variant": "warning"
  },
  "example": "class PointC {\n  constructor(x, y) { this.x = x; this.y = y; }\n  dist() { return Math.hypot(this.x, this.y); }\n}\nfunction pointF(x, y) {\n  const dist = () => Math.hypot(x, y);\n  return { x, y, dist };\n}\nconsole.log(new PointC(3, 4).dist(), pointF(3, 4).dist());\nconsole.log(new PointC(1, 0) instanceof PointC);\n",
  "exampleCaption": "Class instance vs factory object with closure dist",
  "internals": [
    "class methods are one function per name on the prototype.",
    "factory closures often create new function objects per call.",
    "new.target is undefined in a factory called without new."
  ],
  "takeaways": [
    "Use class when you have methods + inheritance + instanceof.",
    "Use factory when privacy and no-new API matter.",
    "Factory objects will fail instanceof PointC and may duplicate methods per instance (memory).",
    "class methods are one function per name on the prototype."
  ],
  "revision": [
    "Classes vs Factories vs Constructors: class = stamp + shared method box. factory = custom build each time, maybe with a backpack of secrets.",
    "Use class when you have methods + inheritance + instanceof.",
    "Use factory when privacy and no-new API matter.",
    "Document whether callers use new.",
    "Trap: Factory objects will fail instanceof PointC and may duplicate methods per instance (memory)."
  ],
  "flashcards": [
    [
      "Classes vs Factories vs Constructors",
      "Classes: new, instanceof, prototypes, extends."
    ],
    [
      "Mental model",
      "class = stamp + shared method box. factory = custom build each time, maybe with a backpack of secrets."
    ],
    [
      "Common trap",
      "Factory objects will fail instanceof PointC and may duplicate methods per instance (memory)."
    ],
    [
      "Use class when you have methods + inheritance + instanceof.",
      "Use factory when privacy and no-new API matter."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Classes vs Factories vs Constructors and where does a beginner first see it?",
      "answerHint": "Classes: new, instanceof, prototypes, extends. Factories: functions that return objects (often with closures or Object.create). Factories skip new, can return different shapes, and hide privates easily. Constructors without class are the third path. Choose factories for simple ADTs; classes when you need instanceof and a shared prototype."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Classes vs Factories vs Constructors works and name the main pitfall.",
      "answerHint": "Use class when you have methods + inheritance + instanceof. Use factory when privacy and no-new API matter. Document whether callers use new. Do not mix randomly in one type. Pitfall: Factory objects will fail instanceof PointC and may duplicate methods per instance (memory)."
    },
    {
      "level": "advanced",
      "question": "How would you explain Classes vs Factories vs Constructors at an interview, including engine/spec details?",
      "answerHint": "class methods are one function per name on the prototype. factory closures often create new function objects per call. new.target is undefined in a factory called without new."
    }
  ],
  "pitfalls": [
    "Factory objects will fail instanceof PointC and may duplicate methods per instance (memory).",
    "Do not mix randomly in one type."
  ],
  "interview": {
    "expectations": [
      "Explain Classes vs Factories vs Constructors without mixing it up with a nearby B1.17 — Classes & OOP topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "class methods are one function per name on the prototype."
    ],
    "commonQuestions": [
      "What is Classes vs Factories vs Constructors?",
      "Why does JavaScript classes vs factories vs constructors behave this way?",
      "What is the classic Classes vs Factories vs Constructors interview trap?"
    ],
    "traps": [
      "Factory objects will fail instanceof PointC and may duplicate methods per instance (memory)."
    ],
    "misconceptions": [
      "JS can mint objects many ways. Teams fight about class vs factory; both compile to objects in memory."
    ],
    "strongSignals": [
      "Separates Classes vs Factories vs Constructors from lookalike APIs and can draw the mental model."
    ]
  }
})
