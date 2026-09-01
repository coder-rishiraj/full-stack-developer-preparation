import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Arrow Functions",
  "whatIsIt": "(a) => a + 1 is a shorter function with lexical this, no own arguments, no prototype, not constructable with new. Expression bodies return implicitly; { } bodies need return. You cannot name them in the function token; names are inferred. They cannot be generators.",
  "whyExists": "Callbacks needed to keep the surrounding this (React, DOM, methods mapping). A new syntax made lexical this the default for those cases.",
  "mentalModel": "A lightweight function that borrows this from where it was written, like a closure over this.",
  "how": [
    "Use arrows for short callbacks and anything that must not rebind this.",
    "Use function for methods you expect to call with obj.method() or new.",
    "Wrap objects in arrows: () => ({ x: 1 }).",
    "Do not use arrows as object methods if you need dynamic this."
  ],
  "callout": {
    "title": "Watch for",
    "text": "() => { n: 1 } returns undefined — braces are a block, the label n is not an object.",
    "variant": "warning"
  },
  "example": "const add = (a, b) => a + b;\nconst pair = (a) => ({ a, b: a * 2 });\nconst obj = {\n  n: 1,\n  arrow: () => this,\n  method() { return this.n; },\n};\nconsole.log(add(2, 3), pair(4), obj.method());\ntry { new add(); } catch (e) { console.log(e.name); }\n",
  "exampleCaption": "Implicit return, object wrap, arrows are not constructors",
  "internals": [
    "ArrowFunction has [[ThisMode]] lexical and no [[Construct]].",
    "arguments in an arrow resolves to an outer function’s arguments if any.",
    "super in arrows is also lexical (derived from surrounding class method)."
  ],
  "takeaways": [
    "Use arrows for short callbacks and anything that must not rebind this.",
    "Use function for methods you expect to call with obj.method() or new.",
    "() => { n: 1 } returns undefined — braces are a block, the label n is not an object.",
    "ArrowFunction has [[ThisMode]] lexical and no [[Construct]]."
  ],
  "revision": [
    "Arrow Functions: A lightweight function that borrows this from where it was written, like a closure over this.",
    "Use arrows for short callbacks and anything that must not rebind this.",
    "Use function for methods you expect to call with obj.method() or new.",
    "Wrap objects in arrows: () => ({ x: 1 }).",
    "Trap: () => { n: 1 } returns undefined — braces are a block, the label n is not an object."
  ],
  "flashcards": [
    [
      "Arrow Functions",
      "(a) => a + 1 is a shorter function with lexical this, no own arguments, no prototype, not constructable with new."
    ],
    [
      "Mental model",
      "A lightweight function that borrows this from where it was written, like a closure over this."
    ],
    [
      "Common trap",
      "() => { n: 1 } returns undefined — braces are a block, the label n is not an object."
    ],
    [
      "Use arrows for short callbacks and anything that must not rebind this.",
      "Use function for methods you expect to call with obj.method() or new."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Arrow Functions and where does a beginner first see it?",
      "answerHint": "(a) => a + 1 is a shorter function with lexical this, no own arguments, no prototype, not constructable with new. Expression bodies return implicitly; { } bodies need return. You cannot name them in the function token; names are inferred. They cannot be generators."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Arrow Functions works and name the main pitfall.",
      "answerHint": "Use arrows for short callbacks and anything that must not rebind this. Use function for methods you expect to call with obj.method() or new. Wrap objects in arrows: () => ({ x: 1 }). Do not use arrows as object methods if you need dynamic this. Pitfall: () => { n: 1 } returns undefined — braces are a block, the label n is not an object."
    },
    {
      "level": "advanced",
      "question": "How would you explain Arrow Functions at an interview, including engine/spec details?",
      "answerHint": "ArrowFunction has [[ThisMode]] lexical and no [[Construct]]. arguments in an arrow resolves to an outer function’s arguments if any. super in arrows is also lexical (derived from surrounding class method)."
    }
  ],
  "pitfalls": [
    "() => { n: 1 } returns undefined — braces are a block, the label n is not an object.",
    "Do not use arrows as object methods if you need dynamic this."
  ],
  "interview": {
    "expectations": [
      "Explain Arrow Functions without mixing it up with a nearby B1.9 — Functions topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "ArrowFunction has [[ThisMode]] lexical and no [[Construct]]."
    ],
    "commonQuestions": [
      "What is Arrow Functions?",
      "Why does JavaScript arrow functions behave this way?",
      "What is the classic Arrow Functions interview trap?"
    ],
    "traps": [
      "() => { n: 1 } returns undefined — braces are a block, the label n is not an object."
    ],
    "misconceptions": [
      "Callbacks needed to keep the surrounding this (React, DOM, methods mapping). A new syntax made lexical this the default for those cases."
    ],
    "strongSignals": [
      "Separates Arrow Functions from lookalike APIs and can draw the mental model."
    ]
  }
})
