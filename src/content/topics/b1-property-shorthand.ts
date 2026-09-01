import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Property / Method Shorthand",
  "whatIsIt": "{ a, b } is { a: a, b: b }. Method shorthand { foo() {} } is a concise method (can use super). { a, a } is a duplicate. You cannot shorthand a computed name. Async/generator methods have their own shorthand.",
  "whyExists": "Object.init from local variables was noisy. ES2015 cut the repetition and made methods first-class in literals.",
  "mentalModel": "If the variable name is the key you want, write it once.",
  "how": [
    "Return { a, b } from functions instead of { a: a, b: b }.",
    "Use method shorthand for this-binding methods.",
    "Do not use arrow shorthand if you need this as the object.",
    "Spread plus shorthand: { ...rest, id }."
  ],
  "callout": {
    "title": "Watch for",
    "text": "{ greet: () => this.name } is not method shorthand — this is lexical, often undefined.",
    "variant": "warning"
  },
  "example": "const name = 'Ada';\nconst age = 36;\nconst user = {\n  name,\n  age,\n  greet() { return this.name; },\n};\nconsole.log(user, user.greet());\nfunction factory(id) { return { id, created: Date.now() }; }\nconsole.log(factory(1).id);\n",
  "exampleCaption": "Shorthand fields and method",
  "internals": [
    "Shorthand PropertyDefinition looks up the identifier in scope.",
    "Method definitions set [[HomeObject]] for super.",
    "MakeMethod / DefineMethod in spec vs ordinary assignment of a function expression."
  ],
  "takeaways": [
    "Return { a, b } from functions instead of { a: a, b: b }.",
    "Use method shorthand for this-binding methods.",
    "{ greet: () => this.name } is not method shorthand — this is lexical, often undefined.",
    "Shorthand PropertyDefinition looks up the identifier in scope."
  ],
  "revision": [
    "Property / Method Shorthand: If the variable name is the key you want, write it once.",
    "Return { a, b } from functions instead of { a: a, b: b }.",
    "Use method shorthand for this-binding methods.",
    "Do not use arrow shorthand if you need this as the object.",
    "Trap: { greet: () => this.name } is not method shorthand — this is lexical, often undefined."
  ],
  "flashcards": [
    [
      "Property / Method Shorthand",
      "{ a, b } is { a: a, b: b }."
    ],
    [
      "Mental model",
      "If the variable name is the key you want, write it once."
    ],
    [
      "Common trap",
      "{ greet: () => this.name } is not method shorthand — this is lexical, often undefined."
    ],
    [
      "Return { a, b } from functions instead of { a: a, b: b }.",
      "Use method shorthand for this-binding methods."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Property / Method Shorthand and where does a beginner first see it?",
      "answerHint": "{ a, b } is { a: a, b: b }. Method shorthand { foo() {} } is a concise method (can use super). { a, a } is a duplicate. You cannot shorthand a computed name. Async/generator methods have their own shorthand."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Property / Method Shorthand works and name the main pitfall.",
      "answerHint": "Return { a, b } from functions instead of { a: a, b: b }. Use method shorthand for this-binding methods. Do not use arrow shorthand if you need this as the object. Spread plus shorthand: { ...rest, id }. Pitfall: { greet: () => this.name } is not method shorthand — this is lexical, often undefined."
    },
    {
      "level": "advanced",
      "question": "How would you explain Property / Method Shorthand at an interview, including engine/spec details?",
      "answerHint": "Shorthand PropertyDefinition looks up the identifier in scope. Method definitions set [[HomeObject]] for super. MakeMethod / DefineMethod in spec vs ordinary assignment of a function expression."
    }
  ],
  "pitfalls": [
    "{ greet: () => this.name } is not method shorthand — this is lexical, often undefined.",
    "Spread plus shorthand: { ...rest, id }."
  ],
  "interview": {
    "expectations": [
      "Explain Property / Method Shorthand without mixing it up with a nearby B1.13 — Objects topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Shorthand PropertyDefinition looks up the identifier in scope."
    ],
    "commonQuestions": [
      "What is Property / Method Shorthand?",
      "Why does JavaScript property / method shorthand behave this way?",
      "What is the classic Property / Method Shorthand interview trap?"
    ],
    "traps": [
      "{ greet: () => this.name } is not method shorthand — this is lexical, often undefined."
    ],
    "misconceptions": [
      "Object.init from local variables was noisy. ES2015 cut the repetition and made methods first-class in literals."
    ],
    "strongSignals": [
      "Separates Property / Method Shorthand from lookalike APIs and can draw the mental model."
    ]
  }
})
