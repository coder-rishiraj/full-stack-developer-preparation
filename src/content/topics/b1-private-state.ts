import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Private State / Function Factories",
  "whatIsIt": "Function factories use closures to hide variables: only returned methods can touch them. That is privacy without #fields or WeakMaps. Each call to the factory gets a new environment (new private state). Revealing module pattern returns a public API object.",
  "whyExists": "Before private fields, closures were the way to hide secrets from callers who held the object.",
  "mentalModel": "A locker inside the factory. Returned methods have the only keys. The rest of the program has the handle, not the locker.",
  "how": [
    "Put secrets in outer lets, return methods.",
    "Do not hang the secret on this unless you want it enumerable.",
    "Each factory call = new locker.",
    "Today #fields are an alternative with different copying/prototype characteristics."
  ],
  "callout": {
    "title": "Watch for",
    "text": "If you return the secret object itself, privacy is gone — return accessors, not the bag.",
    "variant": "warning"
  },
  "example": "function bank(opening) {\n  let balance = opening;\n  return {\n    deposit(n) { balance += n; },\n    withdraw(n) {\n      if (n > balance) throw new Error('funds');\n      balance -= n;\n    },\n    getBalance() { return balance; },\n  };\n}\nconst acct = bank(10);\nacct.deposit(5);\nacct.withdraw(3);\nconsole.log(acct.getBalance(), acct.balance);\n",
  "exampleCaption": "Closure-based bank account; balance is not a field",
  "internals": [
    "Privacy is convention + environment records, not a security boundary against the same realm’s debugger.",
    "Methods are distinct function objects per instance (more memory than prototype methods).",
    "#fields use a different spec mechanism (private names) shared on the prototype methods."
  ],
  "takeaways": [
    "Put secrets in outer lets, return methods.",
    "Do not hang the secret on this unless you want it enumerable.",
    "If you return the secret object itself, privacy is gone — return accessors, not the bag.",
    "Privacy is convention + environment records, not a security boundary against the same realm’s debugger."
  ],
  "revision": [
    "Private State / Function Factories: A locker inside the factory. Returned methods have the only keys. The rest of the program has the handle, not the locker.",
    "Put secrets in outer lets, return methods.",
    "Do not hang the secret on this unless you want it enumerable.",
    "Each factory call = new locker.",
    "Trap: If you return the secret object itself, privacy is gone — return accessors, not the bag."
  ],
  "flashcards": [
    [
      "Private State / Function Factories",
      "Function factories use closures to hide variables: only returned methods can touch them."
    ],
    [
      "Mental model",
      "A locker inside the factory. Returned methods have the only keys. The rest of the program has the handle, not the locker."
    ],
    [
      "Common trap",
      "If you return the secret object itself, privacy is gone — return accessors, not the bag."
    ],
    [
      "Put secrets in outer lets, return methods.",
      "Do not hang the secret on this unless you want it enumerable."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Private State / Function Factories and where does a beginner first see it?",
      "answerHint": "Function factories use closures to hide variables: only returned methods can touch them. That is privacy without #fields or WeakMaps. Each call to the factory gets a new environment (new private state). Revealing module pattern returns a public API object."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Private State / Function Factories works and name the main pitfall.",
      "answerHint": "Put secrets in outer lets, return methods. Do not hang the secret on this unless you want it enumerable. Each factory call = new locker. Today #fields are an alternative with different copying/prototype characteristics. Pitfall: If you return the secret object itself, privacy is gone — return accessors, not the bag."
    },
    {
      "level": "advanced",
      "question": "How would you explain Private State / Function Factories at an interview, including engine/spec details?",
      "answerHint": "Privacy is convention + environment records, not a security boundary against the same realm’s debugger. Methods are distinct function objects per instance (more memory than prototype methods). #fields use a different spec mechanism (private names) shared on the prototype methods."
    }
  ],
  "pitfalls": [
    "If you return the secret object itself, privacy is gone — return accessors, not the bag.",
    "Today #fields are an alternative with different copying/prototype characteristics."
  ],
  "interview": {
    "expectations": [
      "Explain Private State / Function Factories without mixing it up with a nearby B1.12 — Closures topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Privacy is convention + environment records, not a security boundary against the same realm’s debugger."
    ],
    "commonQuestions": [
      "What is Private State / Function Factories?",
      "Why does JavaScript private state / function factories behave this way?",
      "What is the classic Private State / Function Factories interview trap?"
    ],
    "traps": [
      "If you return the secret object itself, privacy is gone — return accessors, not the bag."
    ],
    "misconceptions": [
      "Before private fields, closures were the way to hide secrets from callers who held the object."
    ],
    "strongSignals": [
      "Separates Private State / Function Factories from lookalike APIs and can draw the mental model."
    ]
  }
})
