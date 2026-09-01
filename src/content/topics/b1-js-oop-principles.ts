import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Encapsulation, Polymorphism, Composition",
  "whatIsIt": "Encapsulation: hide internals (closures, #fields, modules). Polymorphism: the same call this.method() hits different methods. Composition: objects holding other objects, often preferred over deep extends. JS is prototype-based; class is a layer. Duck typing is common: if it has .map, treat it as mappable.",
  "whyExists": "These words show up in interviews. JS implements them with objects and functions, not with a heavy type system.",
  "mentalModel": "Hide the guts, share a method name, build with parts instead of a tall family tree unless is-a is real.",
  "how": [
    "Prefer composition: User has an Address, not User extends Address.",
    "Encapsulate with # or factory closures.",
    "Polymorphism via method names and prototypes.",
    "Duck-type at boundaries; class instanceof inside a realm."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Deep class hierarchies in JS UIs become unreadable; hooks/composition usually win.",
    "variant": "warning"
  },
  "example": "function withLogger(obj) {\n  return { ...obj, log(m) { console.log(m); return obj; } };\n}\nclass Animal { speak() { return '...'; } }\nclass Cat extends Animal { speak() { return 'meow'; } }\nfunction say(a) { return a.speak(); }\nconsole.log(say(new Cat()), say({ speak() { return 'honk'; } }));\nconst u = withLogger({ id: 1 });\nu.log('hi');\n",
  "exampleCaption": "Polymorphic speak and composition via wrapper",
  "internals": [
    "JS has no access modifiers besides private names and module scope.",
    "Polymorphism is dynamic [[Get]] of a method name.",
    "Composition is just object references — no extra spec feature."
  ],
  "takeaways": [
    "Prefer composition: User has an Address, not User extends Address.",
    "Encapsulate with # or factory closures.",
    "Deep class hierarchies in JS UIs become unreadable; hooks/composition usually win.",
    "JS has no access modifiers besides private names and module scope."
  ],
  "revision": [
    "Encapsulation, Polymorphism, Composition: Hide the guts, share a method name, build with parts instead of a tall family tree unless is-a is real.",
    "Prefer composition: User has an Address, not User extends Address.",
    "Encapsulate with # or factory closures.",
    "Polymorphism via method names and prototypes.",
    "Trap: Deep class hierarchies in JS UIs become unreadable; hooks/composition usually win."
  ],
  "flashcards": [
    [
      "Encapsulation, Polymorphism, Composition",
      "Encapsulation: hide internals (closures, #fields, modules)."
    ],
    [
      "Mental model",
      "Hide the guts, share a method name, build with parts instead of a tall family tree unless is-a is real."
    ],
    [
      "Common trap",
      "Deep class hierarchies in JS UIs become unreadable; hooks/composition usually win."
    ],
    [
      "Prefer composition: User has an Address, not User extends Address.",
      "Encapsulate with # or factory closures."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Encapsulation, Polymorphism, Composition and where does a beginner first see it?",
      "answerHint": "Encapsulation: hide internals (closures, #fields, modules). Polymorphism: the same call this.method() hits different methods. Composition: objects holding other objects, often preferred over deep extends. JS is prototype-based; class is a layer. Duck typing is common: if it has .map, treat it as mappable."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Encapsulation, Polymorphism, Composition works and name the main pitfall.",
      "answerHint": "Prefer composition: User has an Address, not User extends Address. Encapsulate with # or factory closures. Polymorphism via method names and prototypes. Duck-type at boundaries; class instanceof inside a realm. Pitfall: Deep class hierarchies in JS UIs become unreadable; hooks/composition usually win."
    },
    {
      "level": "advanced",
      "question": "How would you explain Encapsulation, Polymorphism, Composition at an interview, including engine/spec details?",
      "answerHint": "JS has no access modifiers besides private names and module scope. Polymorphism is dynamic [[Get]] of a method name. Composition is just object references — no extra spec feature."
    }
  ],
  "pitfalls": [
    "Deep class hierarchies in JS UIs become unreadable; hooks/composition usually win.",
    "Duck-type at boundaries; class instanceof inside a realm."
  ],
  "interview": {
    "expectations": [
      "Explain Encapsulation, Polymorphism, Composition without mixing it up with a nearby B1.17 — Classes & OOP topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "JS has no access modifiers besides private names and module scope."
    ],
    "commonQuestions": [
      "What is Encapsulation, Polymorphism, Composition?",
      "Why does JavaScript encapsulation, polymorphism, composition behave this way?",
      "What is the classic Encapsulation, Polymorphism, Composition interview trap?"
    ],
    "traps": [
      "Deep class hierarchies in JS UIs become unreadable; hooks/composition usually win."
    ],
    "misconceptions": [
      "These words show up in interviews. JS implements them with objects and functions, not with a heavy type system."
    ],
    "strongSignals": [
      "Separates Encapsulation, Polymorphism, Composition from lookalike APIs and can draw the mental model."
    ]
  }
})
