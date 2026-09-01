import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Parameters",
  "whatIsIt": "Parameters<F> extracts tuple of parameter types from function type F. Useful for wrappers, decorators, and forwarding calls with same args.",
  "whyExists": "Type-safe call forwarding and higher-order functions.",
  "mentalModel": "Copy argument list from one function to wrapper.",
  "how": [
    "type Args = Parameters<typeof console.log>;",
    "function wrap<F extends (...args: any) => any>(fn: F, ...args: Parameters<F>)",
    "Rest spread typed with Parameters.",
    "Constructor params: ConstructorParameters.",
    "First param: Parameters<F>[0]."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Parameters on overloaded fn — uses last signature implementation.",
    "variant": "warning"
  },
  "example": "function logCall<A extends unknown[]>(fn: (...args: A) => void, ...args: A) {\n  console.log('calling', args);\n  fn(...args);\n}\nfunction greet(name: string, age: number) { console.log(name, age); }\nlogCall(greet, 'Ada', 30);\nconsole.log(\"logCall(greet, 'Ada', 30)\");\nconst sample: unknown = 'text';\nconsole.log(greet('demo'));",
  "exampleCaption": "Generic A matches Parameters of greet",
  "internals": [
    "Tuple inference preserves optional/rest markers.",
    "Spread args assignability checked via tuple.",
    "Related: ThisParameterType for this binding."
  ],
  "takeaways": [
    "type Args = Parameters<typeof console.log>;",
    "function wrap<F extends (...args: any) => any>(fn: F, ...args: Parameters<F>)",
    "Parameters on overloaded fn — uses last signature implementation.",
    "Tuple inference preserves optional/rest markers."
  ],
  "revision": [
    "Parameters: Copy argument list from one function to wrapper.",
    "type Args = Parameters<typeof console.log>;",
    "function wrap<F extends (...args: any) => any>(fn: F, ...args: Parameters<F>)",
    "Rest spread typed with Parameters.",
    "Trap: Parameters on overloaded fn — uses last signature implementation."
  ],
  "flashcards": [
    [
      "Parameters",
      "Parameters<F> extracts tuple of parameter types from function type F."
    ],
    [
      "Mental model",
      "Copy argument list from one function to wrapper."
    ],
    [
      "Common trap",
      "Parameters on overloaded fn — uses last signature implementation."
    ],
    [
      "type Args = Parameters<typeof console.log>;",
      "function wrap<F extends (...args: any) => any>(fn: F, ...args: Parameters<F>)"
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Parameters in TypeScript and when do you use it?",
      "answerHint": "Parameters<F> extracts tuple of parameter types from function type F. Useful for wrappers, decorators, and forwarding calls with same args."
    },
    {
      "level": "intermediate",
      "question": "Explain Parameters with a code example and one pitfall.",
      "answerHint": "type Args = Parameters<typeof console.log>; function wrap<F extends (...args: any) => any>(fn: F, ...args: Parameters<F>) Rest spread typed with Parameters. Constructor params: ConstructorParameters. First param: Parameters<F>[0]. Pitfall: Parameters on overloaded fn — uses last signature implementation."
    },
    {
      "level": "advanced",
      "question": "How would you explain Parameters in a senior frontend interview?",
      "answerHint": "Tuple inference preserves optional/rest markers. Spread args assignability checked via tuple. Related: ThisParameterType for this binding. function logCall<A extends unknown[]>(fn: (...args: A) => void, ...args: A) {\n  console.log('calling', args);\n  fn(...ar"
    }
  ],
  "pitfalls": [
    "Parameters on overloaded fn — uses last signature implementation."
  ],
  "interview": {
    "expectations": [
      "Explain Parameters with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "Tuple inference preserves optional/rest markers."
    ],
    "commonQuestions": [
      "What is Parameters?",
      "When would you choose Parameters over alternatives?",
      "What is the classic Parameters interview trap?"
    ],
    "traps": [
      "Parameters on overloaded fn — uses last signature implementation."
    ],
    "misconceptions": [
      "Type-safe call forwarding and higher-order functions."
    ],
    "strongSignals": [
      "Uses Parameters to remove invalid states, not just document them."
    ]
  }
})
