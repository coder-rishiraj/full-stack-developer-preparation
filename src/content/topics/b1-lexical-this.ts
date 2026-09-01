import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Lexical this",
  "whatIsIt": "Lexical this means the engine captures this from the enclosing environment at definition time, not from the call site. Arrows do this. Nested arrows keep walking out until a non-arrow function, class field initializer, or global. class fields also use a lexical this (the instance).",
  "whyExists": "Losing this in callbacks was the #1 OOP-in-JS pain. Lexical this made the capture automatic.",
  "mentalModel": "Photocopy the current this into the arrow when the arrow is created. Later calls cannot change that photocopy with .call.",
  "how": [
    "Write the arrow inside the method whose this you want.",
    "Do not use an arrow as a prototype method you expect to receive the receiver.",
    ".call/.apply on arrows ignore the thisArg.",
    "class fields: click = () => this — bound per instance."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Putting an arrow on the prototype: every instance shares it and this is not the instance when called as a method... actually if it's on prototype as arrow defined at class eval, this may be undefined/global. Classic trap.",
    "variant": "warning"
  },
  "example": "const obj = {\n  id: 7,\n  method() {\n    const arrow = () => this.id;\n    return arrow();\n  },\n};\nconst stolen = obj.method;\nconsole.log(obj.method());\ntry { console.log(stolen()); } catch (e) { console.log('stolen', this); }\nconst arrow = () => this;\nconsole.log(arrow.call({ id: 1 }));\n",
  "exampleCaption": "Arrow ignores .call thisArg; method still has this",
  "internals": [
    "Arrow functions do not have a this binding in their Environment; they use OuterEnv.",
    "Ordinary Call does not bind this for lexical ThisMode.",
    "class instance fields are initialized with this = the new instance."
  ],
  "takeaways": [
    "Write the arrow inside the method whose this you want.",
    "Do not use an arrow as a prototype method you expect to receive the receiver.",
    "Putting an arrow on the prototype: every instance shares it and this is not the instance when called as a method... actually if it's on prototype as arrow defined at class eval, this may be undefined/global. Classic trap.",
    "Arrow functions do not have a this binding in their Environment; they use OuterEnv."
  ],
  "revision": [
    "Lexical this: Photocopy the current this into the arrow when the arrow is created. Later calls cannot change that photocopy with .call.",
    "Write the arrow inside the method whose this you want.",
    "Do not use an arrow as a prototype method you expect to receive the receiver.",
    ".call/.apply on arrows ignore the thisArg.",
    "Trap: Putting an arrow on the prototype: every instance shares it and this is not the instance when called as a method... actually if it's on prototype as arrow defined at class eval, this may be undefined/global. Classic trap."
  ],
  "flashcards": [
    [
      "Lexical this",
      "Lexical this means the engine captures this from the enclosing environment at definition time, not from the call site."
    ],
    [
      "Mental model",
      "Photocopy the current this into the arrow when the arrow is created. Later calls cannot change that photocopy with .call."
    ],
    [
      "Common trap",
      "Putting an arrow on the prototype: every instance shares it and this is not the instance when called as a method... actually if it's on prototype as arrow defined at class eval, this may be undefined/global. Classic trap."
    ],
    [
      "Write the arrow inside the method whose this you want.",
      "Do not use an arrow as a prototype method you expect to receive the receiver."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Lexical this and where does a beginner first see it?",
      "answerHint": "Lexical this means the engine captures this from the enclosing environment at definition time, not from the call site. Arrows do this. Nested arrows keep walking out until a non-arrow function, class field initializer, or global. class fields also use a lexical this (the instance)."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Lexical this works and name the main pitfall.",
      "answerHint": "Write the arrow inside the method whose this you want. Do not use an arrow as a prototype method you expect to receive the receiver. .call/.apply on arrows ignore the thisArg. class fields: click = () => this — bound per instance. Pitfall: Putting an arrow on the prototype: every instance shares it and this is not the instance when called as a method... actually if it's on prototype as arrow defined at class eval, this may be undefined/global. Classic trap."
    },
    {
      "level": "advanced",
      "question": "How would you explain Lexical this at an interview, including engine/spec details?",
      "answerHint": "Arrow functions do not have a this binding in their Environment; they use OuterEnv. Ordinary Call does not bind this for lexical ThisMode. class instance fields are initialized with this = the new instance."
    }
  ],
  "pitfalls": [
    "Putting an arrow on the prototype: every instance shares it and this is not the instance when called as a method... actually if it's on prototype as arrow defined at class eval, this may be undefined/global. Classic trap.",
    "class fields: click = () => this — bound per instance."
  ],
  "interview": {
    "expectations": [
      "Explain Lexical this without mixing it up with a nearby B1.9 — Functions topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Arrow functions do not have a this binding in their Environment; they use OuterEnv."
    ],
    "commonQuestions": [
      "What is Lexical this?",
      "Why does JavaScript lexical this behave this way?",
      "What is the classic Lexical this interview trap?"
    ],
    "traps": [
      "Putting an arrow on the prototype: every instance shares it and this is not the instance when called as a method... actually if it's on prototype as arrow defined at class eval, this may be undefined/global. Classic trap."
    ],
    "misconceptions": [
      "Losing this in callbacks was the #1 OOP-in-JS pain. Lexical this made the capture automatic."
    ],
    "strongSignals": [
      "Separates Lexical this from lookalike APIs and can draw the mental model."
    ]
  }
})
