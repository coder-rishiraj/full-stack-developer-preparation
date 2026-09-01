import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "First-Class / Higher-Order Functions",
  "whatIsIt": "Functions are values: assign, pass, return, store on objects. A higher-order function takes or returns functions (map, then, addEventListener). This is how JS does strategy, callbacks, and middleware. Functions also have properties (.name, .length, custom).",
  "whyExists": "Event-driven UI needed to pass ‘what to do later.’ Treating functions as objects made that natural.",
  "mentalModel": "A function is an object you can call. Higher-order functions are factories or coordinators of those objects.",
  "how": [
    "Pass a function, not the result of calling it: addEventListener('click', fn) not fn().",
    "Return functions to make factories and partials.",
    "Keep them pure when using as map callbacks if you can.",
    "Remember they compare by reference, not by source text."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Passing getData() instead of getData to a child — you passed a promise/value, not a callback.",
    "variant": "warning"
  },
  "example": "function twice(fn) {\n  return (x) => fn(fn(x));\n}\nconst inc = (n) => n + 1;\nconst add2 = twice(inc);\nconst ops = [inc, add2];\nconsole.log(ops.map((f) => f(10)));\nconsole.log(twice(inc) === twice(inc));\n",
  "exampleCaption": "Higher-order twice; functions as array values",
  "internals": [
    "Function objects have [[Call]] (and maybe [[Construct]]).",
    "They are ordinary-ish objects: you can set fn.meta = 1.",
    "Higher-order is a usage pattern, not a spec type."
  ],
  "takeaways": [
    "Pass a function, not the result of calling it: addEventListener('click', fn) not fn().",
    "Return functions to make factories and partials.",
    "Passing getData() instead of getData to a child — you passed a promise/value, not a callback.",
    "Function objects have [[Call]] (and maybe [[Construct]])."
  ],
  "revision": [
    "First-Class / Higher-Order Functions: A function is an object you can call. Higher-order functions are factories or coordinators of those objects.",
    "Pass a function, not the result of calling it: addEventListener('click', fn) not fn().",
    "Return functions to make factories and partials.",
    "Keep them pure when using as map callbacks if you can.",
    "Trap: Passing getData() instead of getData to a child — you passed a promise/value, not a callback."
  ],
  "flashcards": [
    [
      "First-Class / Higher-Order Functions",
      "Functions are values: assign, pass, return, store on objects."
    ],
    [
      "Mental model",
      "A function is an object you can call. Higher-order functions are factories or coordinators of those objects."
    ],
    [
      "Common trap",
      "Passing getData() instead of getData to a child — you passed a promise/value, not a callback."
    ],
    [
      "Pass a function, not the result of calling it: addEventListener('click', fn) not",
      "Return functions to make factories and partials."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is First-Class / Higher-Order Functions and where does a beginner first see it?",
      "answerHint": "Functions are values: assign, pass, return, store on objects. A higher-order function takes or returns functions (map, then, addEventListener). This is how JS does strategy, callbacks, and middleware. Functions also have properties (.name, .length, custom)."
    },
    {
      "level": "intermediate",
      "question": "Walk through how First-Class / Higher-Order Functions works and name the main pitfall.",
      "answerHint": "Pass a function, not the result of calling it: addEventListener('click', fn) not fn(). Return functions to make factories and partials. Keep them pure when using as map callbacks if you can. Remember they compare by reference, not by source text. Pitfall: Passing getData() instead of getData to a child — you passed a promise/value, not a callback."
    },
    {
      "level": "advanced",
      "question": "How would you explain First-Class / Higher-Order Functions at an interview, including engine/spec details?",
      "answerHint": "Function objects have [[Call]] (and maybe [[Construct]]). They are ordinary-ish objects: you can set fn.meta = 1. Higher-order is a usage pattern, not a spec type."
    }
  ],
  "pitfalls": [
    "Passing getData() instead of getData to a child — you passed a promise/value, not a callback.",
    "Remember they compare by reference, not by source text."
  ],
  "interview": {
    "expectations": [
      "Explain First-Class / Higher-Order Functions without mixing it up with a nearby B1.9 — Functions topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Function objects have [[Call]] (and maybe [[Construct]])."
    ],
    "commonQuestions": [
      "What is First-Class / Higher-Order Functions?",
      "Why does JavaScript first-class / higher-order functions behave this way?",
      "What is the classic First-Class / Higher-Order Functions interview trap?"
    ],
    "traps": [
      "Passing getData() instead of getData to a child — you passed a promise/value, not a callback."
    ],
    "misconceptions": [
      "Event-driven UI needed to pass ‘what to do later.’ Treating functions as objects made that natural."
    ],
    "strongSignals": [
      "Separates First-Class / Higher-Order Functions from lookalike APIs and can draw the mental model."
    ]
  }
})
