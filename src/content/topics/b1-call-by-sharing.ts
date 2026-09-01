import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Call-by-Sharing / Parameter Passing",
  "whatIsIt": "JS passes arguments by value, but the value of an object is a reference. The callee gets a copy of the pointer. Rebinding the parameter (`obj = {}`) does not rebind the caller’s variable. Mutating properties does. This is sometimes called call-by-sharing.",
  "whyExists": "Implementers wanted cheap argument passing without full copies, while still making primitives behave like values.",
  "mentalModel": "You photocopy a slip of paper with an address. The callee can visit the house (mutate) or throw away their photocopy (rebind) without changing your slip.",
  "how": [
    "To isolate, clone before mutating in the callee.",
    "To replace the caller’s object, return a new object and assign at the call site.",
    "Primitives: callee rebind never affects caller.",
    "Document functions as “mutates args” vs “pure.”"
  ],
  "callout": {
    "title": "Watch for",
    "text": "Expecting `swap(a, b)` with `let tmp = a; a = b; b = tmp` inside a function to swap the caller’s bindings — it cannot.",
    "variant": "warning"
  },
  "example": "function rebind(obj) { obj = { n: 99 }; }\nfunction mutate(obj) { obj.n = 99; }\nconst a = { n: 1 };\nconst b = { n: 1 };\nrebind(a);\nmutate(b);\nconsole.log(a.n, b.n);",
  "exampleCaption": "Rebind vs mutate of an object parameter",
  "internals": [
    "Call evaluates arguments to values, then copies them into parameter bindings.",
    "Those parameter bindings are distinct environment slots from the caller’s.",
    "The object identity in the slot is the same heap pointer until rebound."
  ],
  "takeaways": [
    "To isolate, clone before mutating in the callee.",
    "To replace the caller’s object, return a new object and assign at the call site.",
    "Expecting `swap(a, b)` with `let tmp = a; a = b; b = tmp` inside a function to swap the caller’s bindings — it cannot.",
    "Call evaluates arguments to values, then copies them into parameter bindings."
  ],
  "revision": [
    "Call-by-Sharing / Parameter Passing: You photocopy a slip of paper with an address. The callee can visit the house (mutate) or throw away their photocopy (rebind) without changing your slip.",
    "To isolate, clone before mutating in the callee.",
    "To replace the caller’s object, return a new object and assign at the call site.",
    "Primitives: callee rebind never affects caller.",
    "Trap: Expecting `swap(a, b)` with `let tmp = a; a = b; b = tmp` inside a function to swap the caller’s bindings — it cannot."
  ],
  "flashcards": [
    [
      "Call-by-Sharing / Parameter Passing",
      "JS passes arguments by value, but the value of an object is a reference."
    ],
    [
      "Mental model",
      "You photocopy a slip of paper with an address. The callee can visit the house (mutate) or throw away their photocopy (rebind) without changing your slip."
    ],
    [
      "Common trap",
      "Expecting `swap(a, b)` with `let tmp = a; a = b; b = tmp` inside a function to swap the caller’s bindings — it cannot."
    ],
    [
      "To isolate, clone before mutating in the callee.",
      "To replace the caller’s object, return a new object and assign at the call site."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Call-by-Sharing / Parameter Passing and where does a beginner first see it?",
      "answerHint": "JS passes arguments by value, but the value of an object is a reference. The callee gets a copy of the pointer. Rebinding the parameter (`obj = {}`) does not rebind the caller’s variable. Mutating properties does. This is sometimes called call-by-sharing."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Call-by-Sharing / Parameter Passing works and name the main pitfall.",
      "answerHint": "To isolate, clone before mutating in the callee. To replace the caller’s object, return a new object and assign at the call site. Primitives: callee rebind never affects caller. Document functions as “mutates args” vs “pure.” Pitfall: Expecting `swap(a, b)` with `let tmp = a; a = b; b = tmp` inside a function to swap the caller’s bindings — it cannot."
    },
    {
      "level": "advanced",
      "question": "How would you explain Call-by-Sharing / Parameter Passing at an interview, including engine/spec details?",
      "answerHint": "Call evaluates arguments to values, then copies them into parameter bindings. Those parameter bindings are distinct environment slots from the caller’s. The object identity in the slot is the same heap pointer until rebound."
    }
  ],
  "pitfalls": [
    "Expecting `swap(a, b)` with `let tmp = a; a = b; b = tmp` inside a function to swap the caller’s bindings — it cannot.",
    "Document functions as “mutates args” vs “pure.”"
  ],
  "interview": {
    "expectations": [
      "Explain Call-by-Sharing / Parameter Passing without mixing it up with a nearby B1.3 — Types & Values topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Call evaluates arguments to values, then copies them into parameter bindings."
    ],
    "commonQuestions": [
      "What is Call-by-Sharing / Parameter Passing?",
      "Why does JavaScript call-by-sharing / parameter passing behave this way?",
      "What is the classic Call-by-Sharing / Parameter Passing interview trap?"
    ],
    "traps": [
      "Expecting `swap(a, b)` with `let tmp = a; a = b; b = tmp` inside a function to swap the caller’s bindings — it cannot."
    ],
    "misconceptions": [
      "Implementers wanted cheap argument passing without full copies, while still making primitives behave like values."
    ],
    "strongSignals": [
      "Separates Call-by-Sharing / Parameter Passing from lookalike APIs and can draw the mental model."
    ]
  }
})
