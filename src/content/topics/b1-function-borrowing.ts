import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Function Borrowing",
  "whatIsIt": "Function borrowing is calling a method whose this you set to another object: Array.prototype.map.call(nodeList, fn). The method must use this as an array-like or matching shape. It is prototype-oriented reuse without inheritance. Today Array.from and spread cover many old borrowing cases.",
  "whyExists": "Array-likes (arguments, NodeList) did not have map. Borrowing Array methods was the idiom.",
  "mentalModel": "Rent Array.prototype.slice, point it at arguments, get a real array.",
  "how": [
    "Array.from(arrayLike) first in new code.",
    "Borrow when you need a specific method and the this shape matches.",
    "Do not borrow methods that assume holes vs undefined incorrectly without tests.",
    "call vs apply: choose based on how args are stored."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Borrowing mutate methods (push) on a plain object can create an accidental array-like mess on that object.",
    "variant": "warning"
  },
  "example": "const arrayLike = { 0: 10, 1: 20, length: 2 };\nconsole.log(Array.prototype.map.call(arrayLike, (n) => n * 2));\nconsole.log(Array.from(arrayLike, (n) => n * 2));\nconst args = function () { return Array.prototype.slice.call(arguments); }(1, 2);\nconsole.log(args);\n",
  "exampleCaption": "map.call on an array-like vs Array.from",
  "internals": [
    "Generic array methods use ToObject(this) and LengthOfArrayLike.",
    "They do not require [[Prototype]] to be Array.prototype.",
    "This is why strings can use Array.prototype.map.call('ab', ...) on code units."
  ],
  "takeaways": [
    "Array.from(arrayLike) first in new code.",
    "Borrow when you need a specific method and the this shape matches.",
    "Borrowing mutate methods (push) on a plain object can create an accidental array-like mess on that object.",
    "Generic array methods use ToObject(this) and LengthOfArrayLike."
  ],
  "revision": [
    "Function Borrowing: Rent Array.prototype.slice, point it at arguments, get a real array.",
    "Array.from(arrayLike) first in new code.",
    "Borrow when you need a specific method and the this shape matches.",
    "Do not borrow methods that assume holes vs undefined incorrectly without tests.",
    "Trap: Borrowing mutate methods (push) on a plain object can create an accidental array-like mess on that object."
  ],
  "flashcards": [
    [
      "Function Borrowing",
      "Function borrowing is calling a method whose this you set to another object: Array.prototype.map.call(nodeList, fn)."
    ],
    [
      "Mental model",
      "Rent Array.prototype.slice, point it at arguments, get a real array."
    ],
    [
      "Common trap",
      "Borrowing mutate methods (push) on a plain object can create an accidental array-like mess on that object."
    ],
    [
      "Array.from(arrayLike) first in new code.",
      "Borrow when you need a specific method and the this shape matches."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Function Borrowing and where does a beginner first see it?",
      "answerHint": "Function borrowing is calling a method whose this you set to another object: Array.prototype.map.call(nodeList, fn). The method must use this as an array-like or matching shape. It is prototype-oriented reuse without inheritance. Today Array.from and spread cover many old borrowing cases."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Function Borrowing works and name the main pitfall.",
      "answerHint": "Array.from(arrayLike) first in new code. Borrow when you need a specific method and the this shape matches. Do not borrow methods that assume holes vs undefined incorrectly without tests. call vs apply: choose based on how args are stored. Pitfall: Borrowing mutate methods (push) on a plain object can create an accidental array-like mess on that object."
    },
    {
      "level": "advanced",
      "question": "How would you explain Function Borrowing at an interview, including engine/spec details?",
      "answerHint": "Generic array methods use ToObject(this) and LengthOfArrayLike. They do not require [[Prototype]] to be Array.prototype. This is why strings can use Array.prototype.map.call('ab', ...) on code units."
    }
  ],
  "pitfalls": [
    "Borrowing mutate methods (push) on a plain object can create an accidental array-like mess on that object.",
    "call vs apply: choose based on how args are stored."
  ],
  "interview": {
    "expectations": [
      "Explain Function Borrowing without mixing it up with a nearby B1.15 — this, call, apply, bind topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Generic array methods use ToObject(this) and LengthOfArrayLike."
    ],
    "commonQuestions": [
      "What is Function Borrowing?",
      "Why does JavaScript function borrowing behave this way?",
      "What is the classic Function Borrowing interview trap?"
    ],
    "traps": [
      "Borrowing mutate methods (push) on a plain object can create an accidental array-like mess on that object."
    ],
    "misconceptions": [
      "Array-likes (arguments, NodeList) did not have map. Borrowing Array methods was the idiom."
    ],
    "strongSignals": [
      "Separates Function Borrowing from lookalike APIs and can draw the mental model."
    ]
  }
})
