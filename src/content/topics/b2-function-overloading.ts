import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Function Overloading",
  "whatIsIt": "Overload signatures list allowed call shapes; one implementation handles all. TS checks calls against overloads, not implementation body types. Common for functions that return different types based on input.",
  "whyExists": "JavaScript has one function object — overloads are compile-time sugar for callers.",
  "mentalModel": "Multiple door labels, one room inside that accepts union input.",
  "how": [
    "declare overloads above implementation.",
    "Implementation signature must be compatible with all overloads.",
    "Prefer unions + generics when overload count explodes.",
    "Use for DOM-like APIs: get(id: string): User; get(): User[].",
    "Implementation often uses any or union internally — keep narrow externally."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Only typing implementation — callers lose overload discrimination.",
    "variant": "warning"
  },
  "example": "function len(x: string): number;\n  return x.length;\n}\nconsole.log(len('abc'), len([1, 2, 3]));\n// TypeScript validates this file before emit\n// Strict mode catches misuse at compile time\n// Annotations are erased — zero runtime overhead\n// Enable \"strict\": true in tsconfig.json",
  "exampleCaption": "Two overloads; implementation uses union",
  "internals": [
    "Overload resolution picks first matching overload.",
    "Construct signatures overload new similarly.",
    "Class method overloads follow same rules."
  ],
  "takeaways": [
    "declare overloads above implementation.",
    "Implementation signature must be compatible with all overloads.",
    "Only typing implementation — callers lose overload discrimination.",
    "Overload resolution picks first matching overload."
  ],
  "revision": [
    "Function Overloading: Multiple door labels, one room inside that accepts union input.",
    "declare overloads above implementation.",
    "Implementation signature must be compatible with all overloads.",
    "Prefer unions + generics when overload count explodes.",
    "Trap: Only typing implementation — callers lose overload discrimination."
  ],
  "flashcards": [
    [
      "Function Overloading",
      "Overload signatures list allowed call shapes; one implementation handles all."
    ],
    [
      "Mental model",
      "Multiple door labels, one room inside that accepts union input."
    ],
    [
      "Common trap",
      "Only typing implementation — callers lose overload discrimination."
    ],
    [
      "declare overloads above implementation.",
      "Implementation signature must be compatible with all overloads."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Function Overloading in TypeScript and when do you use it?",
      "answerHint": "Overload signatures list allowed call shapes; one implementation handles all. TS checks calls against overloads, not implementation body types. Common for functions that return different types based on input."
    },
    {
      "level": "intermediate",
      "question": "Explain Function Overloading with a code example and one pitfall.",
      "answerHint": "declare overloads above implementation. Implementation signature must be compatible with all overloads. Prefer unions + generics when overload count explodes. Use for DOM-like APIs: get(id: string): User; get(): User[]. Implementation often uses any or union internally — keep narrow externally. Pitfall: Only typing implementation — callers lose overload discrimination."
    },
    {
      "level": "advanced",
      "question": "How would you explain Function Overloading in a senior frontend interview?",
      "answerHint": "Overload resolution picks first matching overload. Construct signatures overload new similarly. Class method overloads follow same rules. function len(x: string): number;\n  return x.length;\n}\nconsole.log(len('abc'), len([1, 2, 3]));\n// TypeScript validates t"
    }
  ],
  "pitfalls": [
    "Only typing implementation — callers lose overload discrimination."
  ],
  "interview": {
    "expectations": [
      "Explain Function Overloading with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "Overload resolution picks first matching overload."
    ],
    "commonQuestions": [
      "What is Function Overloading?",
      "When would you choose Function Overloading over alternatives?",
      "What is the classic Function Overloading interview trap?"
    ],
    "traps": [
      "Only typing implementation — callers lose overload discrimination."
    ],
    "misconceptions": [
      "JavaScript has one function object — overloads are compile-time sugar for callers."
    ],
    "strongSignals": [
      "Uses Function Overloading to remove invalid states, not just document them."
    ]
  }
})
