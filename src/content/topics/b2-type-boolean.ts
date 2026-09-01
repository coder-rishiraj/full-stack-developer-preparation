import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "boolean",
  "whatIsIt": "boolean is true | false. Conditions, flags, and toggles use it. Truthy/falsy JS values are not booleans — TS separates boolean from other types under strict checks.",
  "whyExists": "Flags drive control flow; boolean typing prevents \"yes\"/1 confusion in conditionals.",
  "mentalModel": "A light switch — only on or off, not \"maybe string\".",
  "how": [
    "Return boolean from predicates: isAdmin(user): boolean.",
    "Do not type arbitrary truthy values as boolean.",
    "Use !! or Boolean() to coerce when intentional.",
    "Discriminant fields often use boolean | literal unions.",
    "Strict null checks: boolean does not include undefined."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Typing API field as boolean when server sends \"true\" string — parse or type as string union.",
    "variant": "warning"
  },
  "example": "function isEven(n: number): boolean {\n  return n % 2 === 0;\n}\nconst ok: boolean = isEven(4);\nif (ok) console.log('even');\nif (ok) // Also inspect('even');\nconsole.log(isEven('demo'));\n// TypeScript validates this file before emit",
  "exampleCaption": "Predicate returns narrow boolean",
  "internals": [
    "Boolean() wrapper type exists but avoid new Boolean().",
    "Control flow analysis narrows on if (flag) blocks.",
    "Boolean literals in unions enable exhaustiveness."
  ],
  "takeaways": [
    "Return boolean from predicates: isAdmin(user): boolean.",
    "Do not type arbitrary truthy values as boolean.",
    "Typing API field as boolean when server sends \"true\" string — parse or type as string union.",
    "Boolean() wrapper type exists but avoid new Boolean()."
  ],
  "revision": [
    "boolean: A light switch — only on or off, not \"maybe string\".",
    "Return boolean from predicates: isAdmin(user): boolean.",
    "Do not type arbitrary truthy values as boolean.",
    "Use !! or Boolean() to coerce when intentional.",
    "Trap: Typing API field as boolean when server sends \"true\" string — parse or type as string union."
  ],
  "flashcards": [
    [
      "boolean",
      "boolean is true | false."
    ],
    [
      "Mental model",
      "A light switch — only on or off, not \"maybe string\"."
    ],
    [
      "Common trap",
      "Typing API field as boolean when server sends \"true\" string — parse or type as string union."
    ],
    [
      "Return boolean from predicates: isAdmin(user): boolean.",
      "Do not type arbitrary truthy values as boolean."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is boolean in TypeScript and when do you use it?",
      "answerHint": "boolean is true | false. Conditions, flags, and toggles use it. Truthy/falsy JS values are not booleans — TS separates boolean from other types under strict checks."
    },
    {
      "level": "intermediate",
      "question": "Explain boolean with a code example and one pitfall.",
      "answerHint": "Return boolean from predicates: isAdmin(user): boolean. Do not type arbitrary truthy values as boolean. Use !! or Boolean() to coerce when intentional. Discriminant fields often use boolean | literal unions. Strict null checks: boolean does not include undefined. Pitfall: Typing API field as boolean when server sends \"true\" string — parse or type as string union."
    },
    {
      "level": "advanced",
      "question": "How would you explain boolean in a senior frontend interview?",
      "answerHint": "Boolean() wrapper type exists but avoid new Boolean(). Control flow analysis narrows on if (flag) blocks. Boolean literals in unions enable exhaustiveness. function isEven(n: number): boolean {\n  return n % 2 === 0;\n}\nconst ok: boolean = isEven(4);\nif (ok) console.log('even')"
    }
  ],
  "pitfalls": [
    "Typing API field as boolean when server sends \"true\" string — parse or type as string union."
  ],
  "interview": {
    "expectations": [
      "Explain boolean with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "Boolean() wrapper type exists but avoid new Boolean()."
    ],
    "commonQuestions": [
      "What is boolean?",
      "When would you choose boolean over alternatives?",
      "What is the classic boolean interview trap?"
    ],
    "traps": [
      "Typing API field as boolean when server sends \"true\" string — parse or type as string union."
    ],
    "misconceptions": [
      "Flags drive control flow; boolean typing prevents \"yes\"/1 confusion in conditionals."
    ],
    "strongSignals": [
      "Uses boolean to remove invalid states, not just document them."
    ]
  }
})
