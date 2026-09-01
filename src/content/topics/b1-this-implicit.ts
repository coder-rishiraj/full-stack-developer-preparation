import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Implicit Binding",
  "whatIsIt": "Implicit binding is obj.method() or obj['method'](): this is obj (the base of the member expression). Nested obj.a.b() sets this to a, not obj. Prototype methods still get the instance as this if called on the instance. A temporary reference const m = obj.method loses the base.",
  "whyExists": "The syntax of a method call is the most natural way to say ‘this object is the receiver.’",
  "mentalModel": "Whatever is left of the last dot before () becomes this.",
  "how": [
    "Keep the call as obj.fn() if you need obj.",
    "Chain: api.users.list() → this is users.",
    "Destructuring { list } = api.users loses this.",
    "Class inheritance still uses the instance as this."
  ],
  "callout": {
    "title": "Watch for",
    "text": "obj.fn() vs (obj.fn)() — grouping still keeps the reference in modern JS (the call is still a member call)... actually (obj.fn)() still is GetValue then Call with undefined this because grouping produces a value, not a Reference. That's the trap!",
    "variant": "warning"
  },
  "example": "const box = {\n  n: 2,\n  inner: {\n    n: 9,\n    get() { return this.n; },\n  },\n  get() { return this.n; },\n};\nconsole.log(box.get(), box.inner.get());\nconst { get } = box;\ntry { console.log(get()); } catch (e) { console.log(e.name); }\n",
  "exampleCaption": "Last-dot this; destructured method loses it",
  "internals": [
    "CallExpression on a MemberExpression uses GetValue of a Reference, passing GetThisValue(ref).",
    "If the callee is not a Reference (after grouping), thisArgument is undefined.",
    "That is why (obj.fn)() loses this."
  ],
  "takeaways": [
    "Keep the call as obj.fn() if you need obj.",
    "Chain: api.users.list() → this is users.",
    "obj.fn() vs (obj.fn)() — grouping still keeps the reference in modern JS (the call is still a member call)... actually (obj.fn)() still is GetValue then Call with undefined this because grouping produces a value, not a Reference. That's the trap!",
    "CallExpression on a MemberExpression uses GetValue of a Reference, passing GetThisValue(ref)."
  ],
  "revision": [
    "Implicit Binding: Whatever is left of the last dot before () becomes this.",
    "Keep the call as obj.fn() if you need obj.",
    "Chain: api.users.list() → this is users.",
    "Destructuring { list } = api.users loses this.",
    "Trap: obj.fn() vs (obj.fn)() — grouping still keeps the reference in modern JS (the call is still a member call)... actually (obj.fn)() still is GetValue then Call with undefined this because grouping produces a value, not a Reference. That's the trap!"
  ],
  "flashcards": [
    [
      "Implicit Binding",
      "Implicit binding is obj.method() or obj['method'](): this is obj (the base of the member expression)."
    ],
    [
      "Mental model",
      "Whatever is left of the last dot before () becomes this."
    ],
    [
      "Common trap",
      "obj.fn() vs (obj.fn)() — grouping still keeps the reference in modern JS (the call is still a member call)... actually (obj.fn)() still is GetValue then Call with undefined this because grouping produces a value, not a Reference. That's the trap!"
    ],
    [
      "Keep the call as obj.fn() if you need obj.",
      "Chain: api.users.list() → this is users."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Implicit Binding and where does a beginner first see it?",
      "answerHint": "Implicit binding is obj.method() or obj['method'](): this is obj (the base of the member expression). Nested obj.a.b() sets this to a, not obj. Prototype methods still get the instance as this if called on the instance. A temporary reference const m = obj.method loses the base."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Implicit Binding works and name the main pitfall.",
      "answerHint": "Keep the call as obj.fn() if you need obj. Chain: api.users.list() → this is users. Destructuring { list } = api.users loses this. Class inheritance still uses the instance as this. Pitfall: obj.fn() vs (obj.fn)() — grouping still keeps the reference in modern JS (the call is still a member call)... actually (obj.fn)() still is GetValue then Call with undefined this because grouping produces a value, not a Reference. That's the trap!"
    },
    {
      "level": "advanced",
      "question": "How would you explain Implicit Binding at an interview, including engine/spec details?",
      "answerHint": "CallExpression on a MemberExpression uses GetValue of a Reference, passing GetThisValue(ref). If the callee is not a Reference (after grouping), thisArgument is undefined. That is why (obj.fn)() loses this."
    }
  ],
  "pitfalls": [
    "obj.fn() vs (obj.fn)() — grouping still keeps the reference in modern JS (the call is still a member call)... actually (obj.fn)() still is GetValue then Call with undefined this because grouping produces a value, not a Reference. That's the trap!",
    "Class inheritance still uses the instance as this."
  ],
  "interview": {
    "expectations": [
      "Explain Implicit Binding without mixing it up with a nearby B1.15 — this, call, apply, bind topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "CallExpression on a MemberExpression uses GetValue of a Reference, passing GetThisValue(ref)."
    ],
    "commonQuestions": [
      "What is Implicit Binding?",
      "Why does JavaScript implicit binding behave this way?",
      "What is the classic Implicit Binding interview trap?"
    ],
    "traps": [
      "obj.fn() vs (obj.fn)() — grouping still keeps the reference in modern JS (the call is still a member call)... actually (obj.fn)() still is GetValue then Call with undefined this because grouping produces a value, not a Reference. That's the trap!"
    ],
    "misconceptions": [
      "The syntax of a method call is the most natural way to say ‘this object is the receiver.’"
    ],
    "strongSignals": [
      "Separates Implicit Binding from lookalike APIs and can draw the mental model."
    ]
  }
})
