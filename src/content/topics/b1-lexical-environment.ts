import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Lexical Environment",
  "whatIsIt": "A lexical environment is a spec object: an Environment Record plus a reference to an outer environment. Records can be declarative (let/const/var/functions) or object-based (global, with). Each function call, block, and module creates environments as needed. This is the official name for ‘a scope at runtime.’",
  "whyExists": "The spec needed a precise model for closures, TDZ, and var vs let. ‘Scope’ is the human word; lexical environment is the machinery.",
  "mentalModel": "A box of name→value slots with a pointer to the parent box. Functions keep a pointer to the box they were born in.",
  "how": [
    "Entering a block creates a new declarative environment for let/const.",
    "Calling a function creates a new environment for params and locals.",
    "Closures retain those boxes after the call returns.",
    "var slots live in the function’s variable environment, which often aliases the lexical one."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Talking as if ‘the stack frame’ always holds closed-over vars — escaped bindings live on the heap in the environment record.",
    "variant": "warning"
  },
  "example": "function demo(a) {\n  let b = a + 1;\n  return function inner() {\n    return { a, b };\n  };\n}\nconst fn = demo(10);\nconsole.log(fn());\n",
  "exampleCaption": "Inner function retains the call’s lexical environment",
  "internals": [
    "NewDeclarativeEnvironment(outer) in the spec.",
    "Function Environment Records also hold this, new.target, super.",
    "VariableEnvironment vs LexicalEnvironment diverge with catch/with in sloppy mode."
  ],
  "takeaways": [
    "Entering a block creates a new declarative environment for let/const.",
    "Calling a function creates a new environment for params and locals.",
    "Talking as if ‘the stack frame’ always holds closed-over vars — escaped bindings live on the heap in the environment record.",
    "NewDeclarativeEnvironment(outer) in the spec."
  ],
  "revision": [
    "Lexical Environment: A box of name→value slots with a pointer to the parent box. Functions keep a pointer to the box they were born in.",
    "Entering a block creates a new declarative environment for let/const.",
    "Calling a function creates a new environment for params and locals.",
    "Closures retain those boxes after the call returns.",
    "Trap: Talking as if ‘the stack frame’ always holds closed-over vars — escaped bindings live on the heap in the environment record."
  ],
  "flashcards": [
    [
      "Lexical Environment",
      "A lexical environment is a spec object: an Environment Record plus a reference to an outer environment."
    ],
    [
      "Mental model",
      "A box of name→value slots with a pointer to the parent box. Functions keep a pointer to the box they were born in."
    ],
    [
      "Common trap",
      "Talking as if ‘the stack frame’ always holds closed-over vars — escaped bindings live on the heap in the environment record."
    ],
    [
      "Entering a block creates a new declarative environment for let/const.",
      "Calling a function creates a new environment for params and locals."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Lexical Environment and where does a beginner first see it?",
      "answerHint": "A lexical environment is a spec object: an Environment Record plus a reference to an outer environment. Records can be declarative (let/const/var/functions) or object-based (global, with). Each function call, block, and module creates environments as needed. This is the official name for ‘a scope at runtime.’"
    },
    {
      "level": "intermediate",
      "question": "Walk through how Lexical Environment works and name the main pitfall.",
      "answerHint": "Entering a block creates a new declarative environment for let/const. Calling a function creates a new environment for params and locals. Closures retain those boxes after the call returns. var slots live in the function’s variable environment, which often aliases the lexical one. Pitfall: Talking as if ‘the stack frame’ always holds closed-over vars — escaped bindings live on the heap in the environment record."
    },
    {
      "level": "advanced",
      "question": "How would you explain Lexical Environment at an interview, including engine/spec details?",
      "answerHint": "NewDeclarativeEnvironment(outer) in the spec. Function Environment Records also hold this, new.target, super. VariableEnvironment vs LexicalEnvironment diverge with catch/with in sloppy mode."
    }
  ],
  "pitfalls": [
    "Talking as if ‘the stack frame’ always holds closed-over vars — escaped bindings live on the heap in the environment record.",
    "var slots live in the function’s variable environment, which often aliases the lexical one."
  ],
  "interview": {
    "expectations": [
      "Explain Lexical Environment without mixing it up with a nearby B1.10 — Scope & Lexical Environments topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "NewDeclarativeEnvironment(outer) in the spec."
    ],
    "commonQuestions": [
      "What is Lexical Environment?",
      "Why does JavaScript lexical environment behave this way?",
      "What is the classic Lexical Environment interview trap?"
    ],
    "traps": [
      "Talking as if ‘the stack frame’ always holds closed-over vars — escaped bindings live on the heap in the environment record."
    ],
    "misconceptions": [
      "The spec needed a precise model for closures, TDZ, and var vs let. ‘Scope’ is the human word; lexical environment is the machinery."
    ],
    "strongSignals": [
      "Separates Lexical Environment from lookalike APIs and can draw the mental model."
    ]
  }
})
