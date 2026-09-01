import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Structural Typing",
  "whatIsIt": "TypeScript uses structural (duck) typing: types compatible if shapes match, regardless of names. Extra properties on variables OK when target type not expecting exact literal freshness.",
  "whyExists": "Unlike Java nominal types — { name: string } matches interface Person { name: string } without declaration.",
  "mentalModel": "If it walks like a duck and has duck properties typed, it is assignable.",
  "how": [
    "Assign object literal to interface with same fields.",
    "Excess property check only on fresh literals.",
    "Branded types simulate nominal typing when needed.",
    "Generics use structure not inheritance.",
    "Type guards add nominal-like discrimination at runtime."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Fresh literal { name: \"Ada\", extra: 1 } to Named — excess property error.",
    "variant": "warning"
  },
  "example": "interface Named { name: string }\nfunction greet(n: Named) { return n.name; }\nconst ada = { name: 'Ada', role: 'dev' };\nconsole.log(greet(ada)); // OK — structural match\nconst __typed: Named = {} as Named;\nconsole.log(\"const __item: Named = {} as Named\");\nconsole.log(greet('demo'));\n// TypeScript validates this file before emit",
  "exampleCaption": "Extra role allowed on ada when passing to Named",
  "internals": [
    "Width subtyping: target must accept all source properties.",
    "Function parameter types checked contravariantly under strict.",
    "Declaration merging adds structure to interfaces."
  ],
  "takeaways": [
    "Assign object literal to interface with same fields.",
    "Excess property check only on fresh literals.",
    "Fresh literal { name: \"Ada\", extra: 1 } to Named — excess property error.",
    "Width subtyping: target must accept all source properties."
  ],
  "revision": [
    "Structural Typing: If it walks like a duck and has duck properties typed, it is assignable.",
    "Assign object literal to interface with same fields.",
    "Excess property check only on fresh literals.",
    "Branded types simulate nominal typing when needed.",
    "Trap: Fresh literal { name: \"Ada\", extra: 1 } to Named — excess property error."
  ],
  "flashcards": [
    [
      "Structural Typing",
      "TypeScript uses structural (duck) typing: types compatible if shapes match, regardless of names."
    ],
    [
      "Mental model",
      "If it walks like a duck and has duck properties typed, it is assignable."
    ],
    [
      "Common trap",
      "Fresh literal { name: \"Ada\", extra: 1 } to Named — excess property error."
    ],
    [
      "Assign object literal to interface with same fields.",
      "Excess property check only on fresh literals."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Structural Typing in TypeScript and when do you use it?",
      "answerHint": "TypeScript uses structural (duck) typing: types compatible if shapes match, regardless of names. Extra properties on variables OK when target type not expecting exact literal freshness."
    },
    {
      "level": "intermediate",
      "question": "Explain Structural Typing with a code example and one pitfall.",
      "answerHint": "Assign object literal to interface with same fields. Excess property check only on fresh literals. Branded types simulate nominal typing when needed. Generics use structure not inheritance. Type guards add nominal-like discrimination at runtime. Pitfall: Fresh literal { name: \"Ada\", extra: 1 } to Named — excess property error."
    },
    {
      "level": "advanced",
      "question": "How would you explain Structural Typing in a senior frontend interview?",
      "answerHint": "Width subtyping: target must accept all source properties. Function parameter types checked contravariantly under strict. Declaration merging adds structure to interfaces. interface Named { name: string }\nfunction greet(n: Named) { return n.name; }\nconst ada = { name: 'Ada', role: 'dev' };\nc"
    }
  ],
  "pitfalls": [
    "Fresh literal { name: \"Ada\", extra: 1 } to Named — excess property error."
  ],
  "interview": {
    "expectations": [
      "Explain Structural Typing with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "Width subtyping: target must accept all source properties."
    ],
    "commonQuestions": [
      "What is Structural Typing?",
      "When would you choose Structural Typing over alternatives?",
      "What is the classic Structural Typing interview trap?"
    ],
    "traps": [
      "Fresh literal { name: \"Ada\", extra: 1 } to Named — excess property error."
    ],
    "misconceptions": [
      "Unlike Java nominal types — { name: string } matches interface Person { name: string } without declaration."
    ],
    "strongSignals": [
      "Uses Structural Typing to remove invalid states, not just document them."
    ]
  }
})
