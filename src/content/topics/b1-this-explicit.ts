import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Explicit Binding",
  "whatIsIt": "Explicit binding is fn.call(thisArg, ...args), fn.apply(thisArg, array), and fn.bind(thisArg, ...partial). They set this regardless of how you later call (bind creates a bound function). Arrows ignore explicit this. null/undefined thisArg becomes the global object in sloppy non-bound calls.",
  "whyExists": "You needed to borrow methods (Array.prototype.slice.call(arguments)) and to pre-bind event handlers.",
  "mentalModel": "A sticker on the function: ‘when called, this is X,’ or a one-shot call/apply with X for this time.",
  "how": [
    "bind for event handlers you will pass around.",
    "call/apply for one-shot borrowing.",
    "apply when args are already an array (or use spread).",
    "Cannot re-bind a bound function’s this (further bind only prepends args)."
  ],
  "callout": {
    "title": "Watch for",
    "text": "bind does not copy prototype for use as a constructor the way you might think — bound functions as classes are rare and weird.",
    "variant": "warning"
  },
  "example": "function intro(greeting) { return greeting + ' ' + this.name; }\nconst user = { name: 'Ada' };\nconsole.log(intro.call(user, 'hi'));\nconsole.log(intro.apply(user, ['yo']));\nconst bound = intro.bind(user, 'hello');\nconsole.log(bound());\n",
  "exampleCaption": "call, apply, and bind for explicit this",
  "internals": [
    "Bound function exotic objects store [[BoundThis]] and [[BoundArguments]].",
    "[[Call]] of a bound function calls the target with those.",
    "call/apply are specified as using PrepareForTailCall and Call with given this."
  ],
  "takeaways": [
    "bind for event handlers you will pass around.",
    "call/apply for one-shot borrowing.",
    "bind does not copy prototype for use as a constructor the way you might think — bound functions as classes are rare and weird.",
    "Bound function exotic objects store [[BoundThis]] and [[BoundArguments]]."
  ],
  "revision": [
    "Explicit Binding: A sticker on the function: ‘when called, this is X,’ or a one-shot call/apply with X for this time.",
    "bind for event handlers you will pass around.",
    "call/apply for one-shot borrowing.",
    "apply when args are already an array (or use spread).",
    "Trap: bind does not copy prototype for use as a constructor the way you might think — bound functions as classes are rare and weird."
  ],
  "flashcards": [
    [
      "Explicit Binding",
      "Explicit binding is fn.call(thisArg, ...args), fn.apply(thisArg, array), and fn.bind(thisArg, ...partial)."
    ],
    [
      "Mental model",
      "A sticker on the function: ‘when called, this is X,’ or a one-shot call/apply with X for this time."
    ],
    [
      "Common trap",
      "bind does not copy prototype for use as a constructor the way you might think — bound functions as classes are rare and weird."
    ],
    [
      "bind for event handlers you will pass around.",
      "call/apply for one-shot borrowing."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Explicit Binding and where does a beginner first see it?",
      "answerHint": "Explicit binding is fn.call(thisArg, ...args), fn.apply(thisArg, array), and fn.bind(thisArg, ...partial). They set this regardless of how you later call (bind creates a bound function). Arrows ignore explicit this. null/undefined thisArg becomes the global object in sloppy non-bound calls."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Explicit Binding works and name the main pitfall.",
      "answerHint": "bind for event handlers you will pass around. call/apply for one-shot borrowing. apply when args are already an array (or use spread). Cannot re-bind a bound function’s this (further bind only prepends args). Pitfall: bind does not copy prototype for use as a constructor the way you might think — bound functions as classes are rare and weird."
    },
    {
      "level": "advanced",
      "question": "How would you explain Explicit Binding at an interview, including engine/spec details?",
      "answerHint": "Bound function exotic objects store [[BoundThis]] and [[BoundArguments]]. [[Call]] of a bound function calls the target with those. call/apply are specified as using PrepareForTailCall and Call with given this."
    }
  ],
  "pitfalls": [
    "bind does not copy prototype for use as a constructor the way you might think — bound functions as classes are rare and weird.",
    "Cannot re-bind a bound function’s this (further bind only prepends args)."
  ],
  "interview": {
    "expectations": [
      "Explain Explicit Binding without mixing it up with a nearby B1.15 — this, call, apply, bind topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Bound function exotic objects store [[BoundThis]] and [[BoundArguments]]."
    ],
    "commonQuestions": [
      "What is Explicit Binding?",
      "Why does JavaScript explicit binding behave this way?",
      "What is the classic Explicit Binding interview trap?"
    ],
    "traps": [
      "bind does not copy prototype for use as a constructor the way you might think — bound functions as classes are rare and weird."
    ],
    "misconceptions": [
      "You needed to borrow methods (Array.prototype.slice.call(arguments)) and to pre-bind event handlers."
    ],
    "strongSignals": [
      "Separates Explicit Binding from lookalike APIs and can draw the mental model."
    ]
  }
})
