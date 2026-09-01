import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Exhaustiveness & assertNever",
  "whatIsIt": "Exhaustiveness checking ensures switch/if handles every union member. default case assigning param to never triggers error when a new variant is added. assertNever(x: never) helper centralizes runtime throw.",
  "whyExists": "GreatFrontEnd senior pattern — compiler guards future enum/union additions.",
  "mentalModel": "Alarm that rings when a new branch appears but switch was not updated.",
  "how": [
    "function assertNever(x: never): never { throw new Error(String(x)); }",
    "default: return assertNever(action);",
    "Adding union member without case → error on never assign.",
    "Use in reducers and message handlers.",
    "Pair with satisfies on handler maps."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Typing default param as any in assertNever call — defeats exhaustiveness.",
    "variant": "warning"
  },
  "example": "type Action = { type: 'add'; n: number } | { type: 'reset' };\nfunction assertNever(x: never): never { throw new Error('Unhandled: ' + JSON.stringify(x)); }\nfunction reduce(state: number, a: Action): number {\n  switch (a.type) {\n    case 'add': return state + a.n;\n    case 'reset': return 0;\n    default: return assertNever(a);\n  }",
  "exampleCaption": "assertNever catches missing Action cases at compile time",
  "internals": [
    "never assignability fails when union member unhandled.",
    "Fall-through cases need explicit break or return.",
    "Implicit returns may leave undefined paths untested."
  ],
  "takeaways": [
    "function assertNever(x: never): never { throw new Error(String(x)); }",
    "default: return assertNever(action);",
    "Typing default param as any in assertNever call — defeats exhaustiveness.",
    "never assignability fails when union member unhandled."
  ],
  "revision": [
    "Exhaustiveness & assertNever: Alarm that rings when a new branch appears but switch was not updated.",
    "function assertNever(x: never): never { throw new Error(String(x)); }",
    "default: return assertNever(action);",
    "Adding union member without case → error on never assign.",
    "Trap: Typing default param as any in assertNever call — defeats exhaustiveness."
  ],
  "flashcards": [
    [
      "Exhaustiveness & assertNever",
      "Exhaustiveness checking ensures switch/if handles every union member."
    ],
    [
      "Mental model",
      "Alarm that rings when a new branch appears but switch was not updated."
    ],
    [
      "Common trap",
      "Typing default param as any in assertNever call — defeats exhaustiveness."
    ],
    [
      "function assertNever(x: never): never { throw new Error(String(x)); }",
      "default: return assertNever(action);"
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Exhaustiveness & assertNever in TypeScript and when do you use it?",
      "answerHint": "Exhaustiveness checking ensures switch/if handles every union member. default case assigning param to never triggers error when a new variant is added. assertNever(x: never) helper centralizes runtime throw."
    },
    {
      "level": "intermediate",
      "question": "Explain Exhaustiveness & assertNever with a code example and one pitfall.",
      "answerHint": "function assertNever(x: never): never { throw new Error(String(x)); } default: return assertNever(action); Adding union member without case → error on never assign. Use in reducers and message handlers. Pair with satisfies on handler maps. Pitfall: Typing default param as any in assertNever call — defeats exhaustiveness."
    },
    {
      "level": "advanced",
      "question": "How would you explain Exhaustiveness & assertNever in a senior frontend interview?",
      "answerHint": "never assignability fails when union member unhandled. Fall-through cases need explicit break or return. Implicit returns may leave undefined paths untested. type Action = { type: 'add'; n: number } | { type: 'reset' };\nfunction assertNever(x: never): never { throw new Error('U"
    }
  ],
  "pitfalls": [
    "Typing default param as any in assertNever call — defeats exhaustiveness."
  ],
  "interview": {
    "expectations": [
      "Explain Exhaustiveness & assertNever with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "never assignability fails when union member unhandled."
    ],
    "commonQuestions": [
      "What is Exhaustiveness & assertNever?",
      "When would you choose Exhaustiveness & assertNever over alternatives?",
      "What is the classic Exhaustiveness & assertNever interview trap?"
    ],
    "traps": [
      "Typing default param as any in assertNever call — defeats exhaustiveness."
    ],
    "misconceptions": [
      "GreatFrontEnd senior pattern — compiler guards future enum/union additions."
    ],
    "strongSignals": [
      "Uses Exhaustiveness & assertNever to remove invalid states, not just document them."
    ]
  }
})
