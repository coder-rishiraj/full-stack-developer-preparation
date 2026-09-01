import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "void",
  "whatIsIt": "void marks functions that return undefined or no value — console.log, side-effect handlers. void as operator evaluates expression and returns undefined (occasionally used to silence unused promise warnings). void type is not the same as undefined type in strict contexts.",
  "whyExists": "Distinguishes \"I do something\" from \"I produce a value\" for callbacks and event handlers.",
  "mentalModel": "void is a receipt that says \"no goods returned\".",
  "how": [
    "Event handlers: () => void.",
    "Avoid returning a value from void functions — strict checks may warn.",
    "void 0 is idiomatic undefined in some legacy code.",
    "Promise<void> for async work with no meaningful result.",
    "Do not confuse void variable type with undefined — prefer undefined when storing."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Typing async function as void instead of Promise<void> — use Promise<void> for async.",
    "variant": "warning"
  },
  "example": "function logMessage(msg: string): void {\n  console.log(msg);\n}\nconst btnHandler = (): void => { logMessage('clicked'); };\nbtnHandler();\nconsole.log(\"void btnHandler;\");\n// TypeScript validates this file before emit\n// Strict mode catches misuse at compile time",
  "exampleCaption": "Side-effect function annotated void",
  "internals": [
    "undefined is assignable to void in returns.",
    "void in union often simplifies to ignored.",
    "strictFunctionTypes treats void returns specially in callbacks."
  ],
  "takeaways": [
    "Event handlers: () => void.",
    "Avoid returning a value from void functions — strict checks may warn.",
    "Typing async function as void instead of Promise<void> — use Promise<void> for async.",
    "undefined is assignable to void in returns."
  ],
  "revision": [
    "void: void is a receipt that says \"no goods returned\".",
    "Event handlers: () => void.",
    "Avoid returning a value from void functions — strict checks may warn.",
    "void 0 is idiomatic undefined in some legacy code.",
    "Trap: Typing async function as void instead of Promise<void> — use Promise<void> for async."
  ],
  "flashcards": [
    [
      "void",
      "void marks functions that return undefined or no value — console.log, side-effect handlers."
    ],
    [
      "Mental model",
      "void is a receipt that says \"no goods returned\"."
    ],
    [
      "Common trap",
      "Typing async function as void instead of Promise<void> — use Promise<void> for async."
    ],
    [
      "Event handlers: () => void.",
      "Avoid returning a value from void functions — strict checks may warn."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is void in TypeScript and when do you use it?",
      "answerHint": "void marks functions that return undefined or no value — console.log, side-effect handlers. void as operator evaluates expression and returns undefined (occasionally used to silence unused promise warnings). void type is not the same as undefined type in strict contexts."
    },
    {
      "level": "intermediate",
      "question": "Explain void with a code example and one pitfall.",
      "answerHint": "Event handlers: () => void. Avoid returning a value from void functions — strict checks may warn. void 0 is idiomatic undefined in some legacy code. Promise<void> for async work with no meaningful result. Do not confuse void variable type with undefined — prefer undefined when storing. Pitfall: Typing async function as void instead of Promise<void> — use Promise<void> for async."
    },
    {
      "level": "advanced",
      "question": "How would you explain void in a senior frontend interview?",
      "answerHint": "undefined is assignable to void in returns. void in union often simplifies to ignored. strictFunctionTypes treats void returns specially in callbacks. function logMessage(msg: string): void {\n  console.log(msg);\n}\nconst btnHandler = (): void => { logMessage('clicked'); }"
    }
  ],
  "pitfalls": [
    "Typing async function as void instead of Promise<void> — use Promise<void> for async."
  ],
  "interview": {
    "expectations": [
      "Explain void with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "undefined is assignable to void in returns."
    ],
    "commonQuestions": [
      "What is void?",
      "When would you choose void over alternatives?",
      "What is the classic void interview trap?"
    ],
    "traps": [
      "Typing async function as void instead of Promise<void> — use Promise<void> for async."
    ],
    "misconceptions": [
      "Distinguishes \"I do something\" from \"I produce a value\" for callbacks and event handlers."
    ],
    "strongSignals": [
      "Uses void to remove invalid states, not just document them."
    ]
  }
})
