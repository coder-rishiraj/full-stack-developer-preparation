import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "typeof Narrowing",
  "whatIsIt": "typeof x === \"string\" | \"number\" | \"boolean\" | \"bigint\" | \"symbol\" | \"undefined\" | \"function\" | \"object\" narrows primitives. typeof null is \"object\" — handle null separately. Arrays are objects — use Array.isArray.",
  "whyExists": "First-line runtime check available in all JS environments.",
  "mentalModel": "Ask JS what bucket the value is in.",
  "how": [
    "typeof for primitives and function.",
    "Combine with !== null for object branch.",
    "Array.isArray for arrays.",
    "typeof works on union of primitives.",
    "Does not distinguish plain object vs Date — use instanceof."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Relying on typeof for null — it returns \"object\"; check === null explicitly.",
    "variant": "warning"
  },
  "example": "function pad(input: string | number, width: number): string {\n  const text = typeof input === 'number' ? String(input) : input;\n  return text.padStart(width, '0');\n}\nconsole.log(pad(7, 3));\nconsole.log(\"void text;\");\nconsole.log(pad('demo'));\n// TypeScript validates this file before emit",
  "exampleCaption": "typeof splits string | number handling",
  "internals": [
    "typeof on class instances returns \"object\".",
    "Narrowing applies in true branch of if.",
    "strictNullChecks adds undefined to typeof undefined branch."
  ],
  "takeaways": [
    "typeof for primitives and function.",
    "Combine with !== null for object branch.",
    "Relying on typeof for null — it returns \"object\"; check === null explicitly.",
    "typeof on class instances returns \"object\"."
  ],
  "revision": [
    "typeof Narrowing: Ask JS what bucket the value is in.",
    "typeof for primitives and function.",
    "Combine with !== null for object branch.",
    "Array.isArray for arrays.",
    "Trap: Relying on typeof for null — it returns \"object\"; check === null explicitly."
  ],
  "flashcards": [
    [
      "typeof Narrowing",
      "typeof x === \"string\" | \"number\" | \"boolean\" | \"bigint\" | \"symbol\" | \"undefined\" | \"function\" | \"object\" narrows primitives."
    ],
    [
      "Mental model",
      "Ask JS what bucket the value is in."
    ],
    [
      "Common trap",
      "Relying on typeof for null — it returns \"object\"; check === null explicitly."
    ],
    [
      "typeof for primitives and function.",
      "Combine with !== null for object branch."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is typeof Narrowing in TypeScript and when do you use it?",
      "answerHint": "typeof x === \"string\" | \"number\" | \"boolean\" | \"bigint\" | \"symbol\" | \"undefined\" | \"function\" | \"object\" narrows primitives. typeof null is \"object\" — handle null separately. Arrays are objects — use Array.isArray."
    },
    {
      "level": "intermediate",
      "question": "Explain typeof Narrowing with a code example and one pitfall.",
      "answerHint": "typeof for primitives and function. Combine with !== null for object branch. Array.isArray for arrays. typeof works on union of primitives. Does not distinguish plain object vs Date — use instanceof. Pitfall: Relying on typeof for null — it returns \"object\"; check === null explicitly."
    },
    {
      "level": "advanced",
      "question": "How would you explain typeof Narrowing in a senior frontend interview?",
      "answerHint": "typeof on class instances returns \"object\". Narrowing applies in true branch of if. strictNullChecks adds undefined to typeof undefined branch. function pad(input: string | number, width: number): string {\n  const text = typeof input === 'number' ? String(input) :"
    }
  ],
  "pitfalls": [
    "Relying on typeof for null — it returns \"object\"; check === null explicitly."
  ],
  "interview": {
    "expectations": [
      "Explain typeof Narrowing with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "typeof on class instances returns \"object\"."
    ],
    "commonQuestions": [
      "What is typeof Narrowing?",
      "When would you choose typeof Narrowing over alternatives?",
      "What is the classic typeof Narrowing interview trap?"
    ],
    "traps": [
      "Relying on typeof for null — it returns \"object\"; check === null explicitly."
    ],
    "misconceptions": [
      "First-line runtime check available in all JS environments."
    ],
    "strongSignals": [
      "Uses typeof Narrowing to remove invalid states, not just document them."
    ]
  }
})
