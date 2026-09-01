import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Custom Type Guards",
  "whatIsIt": "Type predicate functions return arg is Type — TS narrows in true branches when called. Encapsulate validation logic reusable across modules. isUser(x: unknown): x is User pattern.",
  "whyExists": "Bridges runtime validation (Zod, io-ts) and static types without repeated casts.",
  "mentalModel": "Bouncer with a stamp — stamped guests get VIP type inside club.",
  "how": [
    "Return boolean with is Type suffix in return type.",
    "Validate thoroughly inside — TS trusts your predicate.",
    "Use Array.filter with guard: filter(isUser) → User[].",
    "Combine multiple guards for union narrowing.",
    "Document assumptions when guard is optimistic."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Lying guard — returns true without validation causes runtime crashes TS thought impossible.",
    "variant": "warning"
  },
  "example": "type Fish = { swim: () => void };\ntype Bird = { fly: () => void };\nfunction isFish(pet: Fish | Bird): pet is Fish {\n  return (pet as Fish).swim !== undefined;\n}\nfunction move(pet: Fish | Bird) {\n  if (isFish(pet)) pet.swim();\n  else pet.fly();",
  "exampleCaption": "pet is Fish predicate narrows union",
  "internals": [
    "Type predicates affect call expression narrowing only.",
    "Assertion functions (asserts x is T) throw instead of boolean.",
    "Control flow applies per closure capture rules."
  ],
  "takeaways": [
    "Return boolean with is Type suffix in return type.",
    "Validate thoroughly inside — TS trusts your predicate.",
    "Lying guard — returns true without validation causes runtime crashes TS thought impossible.",
    "Type predicates affect call expression narrowing only."
  ],
  "revision": [
    "Custom Type Guards: Bouncer with a stamp — stamped guests get VIP type inside club.",
    "Return boolean with is Type suffix in return type.",
    "Validate thoroughly inside — TS trusts your predicate.",
    "Use Array.filter with guard: filter(isUser) → User[].",
    "Trap: Lying guard — returns true without validation causes runtime crashes TS thought impossible."
  ],
  "flashcards": [
    [
      "Custom Type Guards",
      "Type predicate functions return arg is Type — TS narrows in true branches when called."
    ],
    [
      "Mental model",
      "Bouncer with a stamp — stamped guests get VIP type inside club."
    ],
    [
      "Common trap",
      "Lying guard — returns true without validation causes runtime crashes TS thought impossible."
    ],
    [
      "Return boolean with is Type suffix in return type.",
      "Validate thoroughly inside — TS trusts your predicate."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Custom Type Guards in TypeScript and when do you use it?",
      "answerHint": "Type predicate functions return arg is Type — TS narrows in true branches when called. Encapsulate validation logic reusable across modules. isUser(x: unknown): x is User pattern."
    },
    {
      "level": "intermediate",
      "question": "Explain Custom Type Guards with a code example and one pitfall.",
      "answerHint": "Return boolean with is Type suffix in return type. Validate thoroughly inside — TS trusts your predicate. Use Array.filter with guard: filter(isUser) → User[]. Combine multiple guards for union narrowing. Document assumptions when guard is optimistic. Pitfall: Lying guard — returns true without validation causes runtime crashes TS thought impossible."
    },
    {
      "level": "advanced",
      "question": "How would you explain Custom Type Guards in a senior frontend interview?",
      "answerHint": "Type predicates affect call expression narrowing only. Assertion functions (asserts x is T) throw instead of boolean. Control flow applies per closure capture rules. type Fish = { swim: () => void };\ntype Bird = { fly: () => void };\nfunction isFish(pet: Fish | Bird): pet is Fish {\n  re"
    }
  ],
  "pitfalls": [
    "Lying guard — returns true without validation causes runtime crashes TS thought impossible."
  ],
  "interview": {
    "expectations": [
      "Explain Custom Type Guards with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "Type predicates affect call expression narrowing only."
    ],
    "commonQuestions": [
      "What is Custom Type Guards?",
      "When would you choose Custom Type Guards over alternatives?",
      "What is the classic Custom Type Guards interview trap?"
    ],
    "traps": [
      "Lying guard — returns true without validation causes runtime crashes TS thought impossible."
    ],
    "misconceptions": [
      "Bridges runtime validation (Zod, io-ts) and static types without repeated casts."
    ],
    "strongSignals": [
      "Uses Custom Type Guards to remove invalid states, not just document them."
    ]
  }
})
