import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "instanceof Narrowing",
  "whatIsIt": "instanceof checks prototype chain — narrows to class instances like Date, Error, custom classes. Does not work across realms/iframes for same class. Prefer for built-ins and your own classes.",
  "whyExists": "Object subtypes need instanceof or in checks — typeof is insufficient.",
  "mentalModel": "Check the birth certificate (constructor prototype).",
  "how": [
    "if (e instanceof Error) console.log(e.message).",
    "Custom class guards in domain layer.",
    "Combine with null check before instanceof.",
    "For interfaces use in operator or custom guard.",
    "Cross-realm: duck-type with in + shape check."
  ],
  "callout": {
    "title": "Watch for",
    "text": "instanceof on plain objects from JSON — false; use structural guard.",
    "variant": "warning"
  },
  "example": "class ApiError extends Error {\n  constructor(public status: number, message: string) { super(message); }\n}\nfunction message(err: unknown): string {\n  if (err instanceof ApiError) return `[${err.status}] ${err.message}`;\n  if (err instanceof Error) return err.message;\n  return String(err);\nconst sample: unknown = 'text';\nconsole.log(message('demo'));",
  "exampleCaption": "instanceof narrows to ApiError fields",
  "internals": [
    "instanceof uses Symbol.hasInstance if defined.",
    "Structural types have no runtime class — guards needed.",
    "Narrowing persists in else-if chain."
  ],
  "takeaways": [
    "if (e instanceof Error) console.log(e.message).",
    "Custom class guards in domain layer.",
    "instanceof on plain objects from JSON — false; use structural guard.",
    "instanceof uses Symbol.hasInstance if defined."
  ],
  "revision": [
    "instanceof Narrowing: Check the birth certificate (constructor prototype).",
    "if (e instanceof Error) console.log(e.message).",
    "Custom class guards in domain layer.",
    "Combine with null check before instanceof.",
    "Trap: instanceof on plain objects from JSON — false; use structural guard."
  ],
  "flashcards": [
    [
      "instanceof Narrowing",
      "instanceof checks prototype chain — narrows to class instances like Date, Error, custom classes."
    ],
    [
      "Mental model",
      "Check the birth certificate (constructor prototype)."
    ],
    [
      "Common trap",
      "instanceof on plain objects from JSON — false; use structural guard."
    ],
    [
      "if (e instanceof Error) console.log(e.message).",
      "Custom class guards in domain layer."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is instanceof Narrowing in TypeScript and when do you use it?",
      "answerHint": "instanceof checks prototype chain — narrows to class instances like Date, Error, custom classes. Does not work across realms/iframes for same class. Prefer for built-ins and your own classes."
    },
    {
      "level": "intermediate",
      "question": "Explain instanceof Narrowing with a code example and one pitfall.",
      "answerHint": "if (e instanceof Error) console.log(e.message). Custom class guards in domain layer. Combine with null check before instanceof. For interfaces use in operator or custom guard. Cross-realm: duck-type with in + shape check. Pitfall: instanceof on plain objects from JSON — false; use structural guard."
    },
    {
      "level": "advanced",
      "question": "How would you explain instanceof Narrowing in a senior frontend interview?",
      "answerHint": "instanceof uses Symbol.hasInstance if defined. Structural types have no runtime class — guards needed. Narrowing persists in else-if chain. class ApiError extends Error {\n  constructor(public status: number, message: string) { super(message); }\n}\nfunction mess"
    }
  ],
  "pitfalls": [
    "instanceof on plain objects from JSON — false; use structural guard."
  ],
  "interview": {
    "expectations": [
      "Explain instanceof Narrowing with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "instanceof uses Symbol.hasInstance if defined."
    ],
    "commonQuestions": [
      "What is instanceof Narrowing?",
      "When would you choose instanceof Narrowing over alternatives?",
      "What is the classic instanceof Narrowing interview trap?"
    ],
    "traps": [
      "instanceof on plain objects from JSON — false; use structural guard."
    ],
    "misconceptions": [
      "Object subtypes need instanceof or in checks — typeof is insufficient."
    ],
    "strongSignals": [
      "Uses instanceof Narrowing to remove invalid states, not just document them."
    ]
  }
})
