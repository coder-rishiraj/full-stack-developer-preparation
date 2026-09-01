import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Object Literals",
  "whatIsIt": "{ a: 1, b() {}, [k]: v } creates a new ordinary object. Keys are strings or symbols. Later duplicate string keys win. __proto__ as a literal key is a special set-prototype syntax. Literals produce a new identity each time the line runs.",
  "whyExists": "JS’s core data structure is the object. Literal syntax made hashes and records cheap to write in UI code.",
  "mentalModel": "A bag of properties with a hidden [[Prototype]] (usually Object.prototype). Each { } is a new bag.",
  "how": [
    "Use shorthand { a } when a is a variable.",
    "Do not use __proto__ in literals except when you mean prototype.",
    "JSON is not the same as a JS object literal (no functions, keys quoted in JSON).",
    "Spread { ...obj } is a shallow copy of enumerable own properties."
  ],
  "callout": {
    "title": "Watch for",
    "text": "{ __proto__: other } does not create a property named __proto__; it sets the prototype.",
    "variant": "warning"
  },
  "example": "const k = 'id';\nconst user = {\n  name: 'Ada',\n  [k]: 7,\n  greet() { return 'hi ' + this.name; },\n};\nconsole.log(user.id, user.greet());\nconsole.log({ a: 1, a: 2 }.a);\nconst copy = { ...user, name: 'Alan' };\nconsole.log(copy.name, copy.greet());\n",
  "exampleCaption": "Literal with computed key, method, spread copy",
  "internals": [
    "ObjectLiteral evaluation calls OrdinaryObjectCreate(Object.prototype) then PropertyDefinitionEvaluation.",
    "__proto__ in a literal is special syntax (not a computed key) unless computed.",
    "Method definitions get a home object for super."
  ],
  "takeaways": [
    "Use shorthand { a } when a is a variable.",
    "Do not use __proto__ in literals except when you mean prototype.",
    "{ __proto__: other } does not create a property named __proto__; it sets the prototype.",
    "ObjectLiteral evaluation calls OrdinaryObjectCreate(Object.prototype) then PropertyDefinitionEvaluation."
  ],
  "revision": [
    "Object Literals: A bag of properties with a hidden [[Prototype]] (usually Object.prototype). Each { } is a new bag.",
    "Use shorthand { a } when a is a variable.",
    "Do not use __proto__ in literals except when you mean prototype.",
    "JSON is not the same as a JS object literal (no functions, keys quoted in JSON).",
    "Trap: { __proto__: other } does not create a property named __proto__; it sets the prototype."
  ],
  "flashcards": [
    [
      "Object Literals",
      "{ a: 1, b() {}, [k]: v } creates a new ordinary object."
    ],
    [
      "Mental model",
      "A bag of properties with a hidden [[Prototype]] (usually Object.prototype). Each { } is a new bag."
    ],
    [
      "Common trap",
      "{ __proto__: other } does not create a property named __proto__; it sets the prototype."
    ],
    [
      "Use shorthand { a } when a is a variable.",
      "Do not use __proto__ in literals except when you mean prototype."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Object Literals and where does a beginner first see it?",
      "answerHint": "{ a: 1, b() {}, [k]: v } creates a new ordinary object. Keys are strings or symbols. Later duplicate string keys win. __proto__ as a literal key is a special set-prototype syntax. Literals produce a new identity each time the line runs."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Object Literals works and name the main pitfall.",
      "answerHint": "Use shorthand { a } when a is a variable. Do not use __proto__ in literals except when you mean prototype. JSON is not the same as a JS object literal (no functions, keys quoted in JSON). Spread { ...obj } is a shallow copy of enumerable own properties. Pitfall: { __proto__: other } does not create a property named __proto__; it sets the prototype."
    },
    {
      "level": "advanced",
      "question": "How would you explain Object Literals at an interview, including engine/spec details?",
      "answerHint": "ObjectLiteral evaluation calls OrdinaryObjectCreate(Object.prototype) then PropertyDefinitionEvaluation. __proto__ in a literal is special syntax (not a computed key) unless computed. Method definitions get a home object for super."
    }
  ],
  "pitfalls": [
    "{ __proto__: other } does not create a property named __proto__; it sets the prototype.",
    "Spread { ...obj } is a shallow copy of enumerable own properties."
  ],
  "interview": {
    "expectations": [
      "Explain Object Literals without mixing it up with a nearby B1.13 — Objects topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "ObjectLiteral evaluation calls OrdinaryObjectCreate(Object.prototype) then PropertyDefinitionEvaluation."
    ],
    "commonQuestions": [
      "What is Object Literals?",
      "Why does JavaScript object literals behave this way?",
      "What is the classic Object Literals interview trap?"
    ],
    "traps": [
      "{ __proto__: other } does not create a property named __proto__; it sets the prototype."
    ],
    "misconceptions": [
      "JS’s core data structure is the object. Literal syntax made hashes and records cheap to write in UI code."
    ],
    "strongSignals": [
      "Separates Object Literals from lookalike APIs and can draw the mental model."
    ]
  }
})
