import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Arrow-Function Lexical Binding",
  "whatIsIt": "Arrow functions do not bind their own this. They close over this from the surrounding non-arrow (or the global/undefined this of a module). .call/.bind cannot change it. They are ideal inside methods for callbacks. They are wrong as prototype methods that need the receiver.",
  "whyExists": "The lost-this callback problem was so common that a new function kind made lexical this the default for nested functions.",
  "mentalModel": "An arrow photocopies this when it is born. That photocopy is its this forever.",
  "how": [
    "Define arrows inside the method that has the this you want.",
    "class fields: click = () => this.handle() bind per instance.",
    "Do not put arrows on Object.prototype-style shared methods.",
    "super in arrows is also lexical from the surrounding method."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Using an arrow as an object method: this is not the object, so this.n is wrong.",
    "variant": "warning"
  },
  "example": "const obj = {\n  n: 5,\n  wait() {\n    const arrow = () => this.n;\n    const fn = function () { return this && this.n; };\n    return { arrow: arrow(), fn: fn() };\n  },\n};\nconsole.log(obj.wait());\nconst arrow = () => this;\nconsole.log(arrow.call({ n: 1 }));\n",
  "exampleCaption": "Arrow captures method this; inner function does not",
  "internals": [
    "[[ThisMode]] lexical: Call does not bind this.",
    "ResolveThisBinding walks outer environments.",
    "bind on an arrow still cannot change this (bound this is ignored for lexical functions)."
  ],
  "takeaways": [
    "Define arrows inside the method that has the this you want.",
    "class fields: click = () => this.handle() bind per instance.",
    "Using an arrow as an object method: this is not the object, so this.n is wrong.",
    "[[ThisMode]] lexical: Call does not bind this."
  ],
  "revision": [
    "Arrow-Function Lexical Binding: An arrow photocopies this when it is born. That photocopy is its this forever.",
    "Define arrows inside the method that has the this you want.",
    "class fields: click = () => this.handle() bind per instance.",
    "Do not put arrows on Object.prototype-style shared methods.",
    "Trap: Using an arrow as an object method: this is not the object, so this.n is wrong."
  ],
  "flashcards": [
    [
      "Arrow-Function Lexical Binding",
      "Arrow functions do not bind their own this."
    ],
    [
      "Mental model",
      "An arrow photocopies this when it is born. That photocopy is its this forever."
    ],
    [
      "Common trap",
      "Using an arrow as an object method: this is not the object, so this.n is wrong."
    ],
    [
      "Define arrows inside the method that has the this you want.",
      "class fields: click = () => this.handle() bind per instance."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Arrow-Function Lexical Binding and where does a beginner first see it?",
      "answerHint": "Arrow functions do not bind their own this. They close over this from the surrounding non-arrow (or the global/undefined this of a module). .call/.bind cannot change it. They are ideal inside methods for callbacks. They are wrong as prototype methods that need the receiver."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Arrow-Function Lexical Binding works and name the main pitfall.",
      "answerHint": "Define arrows inside the method that has the this you want. class fields: click = () => this.handle() bind per instance. Do not put arrows on Object.prototype-style shared methods. super in arrows is also lexical from the surrounding method. Pitfall: Using an arrow as an object method: this is not the object, so this.n is wrong."
    },
    {
      "level": "advanced",
      "question": "How would you explain Arrow-Function Lexical Binding at an interview, including engine/spec details?",
      "answerHint": "[[ThisMode]] lexical: Call does not bind this. ResolveThisBinding walks outer environments. bind on an arrow still cannot change this (bound this is ignored for lexical functions)."
    }
  ],
  "pitfalls": [
    "Using an arrow as an object method: this is not the object, so this.n is wrong.",
    "super in arrows is also lexical from the surrounding method."
  ],
  "interview": {
    "expectations": [
      "Explain Arrow-Function Lexical Binding without mixing it up with a nearby B1.15 — this, call, apply, bind topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "[[ThisMode]] lexical: Call does not bind this."
    ],
    "commonQuestions": [
      "What is Arrow-Function Lexical Binding?",
      "Why does JavaScript arrow-function lexical binding behave this way?",
      "What is the classic Arrow-Function Lexical Binding interview trap?"
    ],
    "traps": [
      "Using an arrow as an object method: this is not the object, so this.n is wrong."
    ],
    "misconceptions": [
      "The lost-this callback problem was so common that a new function kind made lexical this the default for nested functions."
    ],
    "strongSignals": [
      "Separates Arrow-Function Lexical Binding from lookalike APIs and can draw the mental model."
    ]
  }
})
