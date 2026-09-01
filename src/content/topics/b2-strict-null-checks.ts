import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "strictNullChecks",
  "whatIsIt": "strictNullChecks (strictNullChecks: true) ensures null and undefined are handled explicitly — no silent access on maybe-missing values. It is the single highest-impact strict flag for real-world bug prevention.",
  "whyExists": "Most production TypeErrors are \"cannot read property of undefined\" — this flag forces handling upfront.",
  "mentalModel": "Every value might be absent until you prove otherwise.",
  "how": [
    "Turn on in tsconfig compilerOptions.",
    "Fix errors with guards, ??, ?., or union types.",
    "Avoid ! non-null assertion as default fix.",
    "Narrow before dereference in callbacks.",
    "Pair with noUncheckedIndexedAccess for arrays/records."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Disabling strictNullChecks to green CI — reintroduces entire bug class.",
    "variant": "warning"
  },
  "example": "function first<T>(arr: T[]): T | undefined {\n  return arr[0];\n}\nconst item = first([1, 2]);\nif (item !== undefined) console.log(item + 1);\nconsole.log(\"void item;\");\nif (item !== undefined) // Also inspect(item + 1);\nconsole.log(first('demo'));",
  "exampleCaption": "Return T | undefined forces check before use",
  "internals": [
    "Control flow analysis tracks undefined elimination.",
    "Type guards and equality checks narrow unions.",
    "Discriminated unions reduce null checks via status field."
  ],
  "takeaways": [
    "Turn on in tsconfig compilerOptions.",
    "Fix errors with guards, ??, ?., or union types.",
    "Disabling strictNullChecks to green CI — reintroduces entire bug class.",
    "Control flow analysis tracks undefined elimination."
  ],
  "revision": [
    "strictNullChecks: Every value might be absent until you prove otherwise.",
    "Turn on in tsconfig compilerOptions.",
    "Fix errors with guards, ??, ?., or union types.",
    "Avoid ! non-null assertion as default fix.",
    "Trap: Disabling strictNullChecks to green CI — reintroduces entire bug class."
  ],
  "flashcards": [
    [
      "strictNullChecks",
      "strictNullChecks (strictNullChecks: true) ensures null and undefined are handled explicitly — no silent access on maybe-missing values."
    ],
    [
      "Mental model",
      "Every value might be absent until you prove otherwise."
    ],
    [
      "Common trap",
      "Disabling strictNullChecks to green CI — reintroduces entire bug class."
    ],
    [
      "Turn on in tsconfig compilerOptions.",
      "Fix errors with guards, ??, ?., or union types."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is strictNullChecks in TypeScript and when do you use it?",
      "answerHint": "strictNullChecks (strictNullChecks: true) ensures null and undefined are handled explicitly — no silent access on maybe-missing values. It is the single highest-impact strict flag for real-world bug prevention."
    },
    {
      "level": "intermediate",
      "question": "Explain strictNullChecks with a code example and one pitfall.",
      "answerHint": "Turn on in tsconfig compilerOptions. Fix errors with guards, ??, ?., or union types. Avoid ! non-null assertion as default fix. Narrow before dereference in callbacks. Pair with noUncheckedIndexedAccess for arrays/records. Pitfall: Disabling strictNullChecks to green CI — reintroduces entire bug class."
    },
    {
      "level": "advanced",
      "question": "How would you explain strictNullChecks in a senior frontend interview?",
      "answerHint": "Control flow analysis tracks undefined elimination. Type guards and equality checks narrow unions. Discriminated unions reduce null checks via status field. function first<T>(arr: T[]): T | undefined {\n  return arr[0];\n}\nconst item = first([1, 2]);\nif (item !== undefined) cons"
    }
  ],
  "pitfalls": [
    "Disabling strictNullChecks to green CI — reintroduces entire bug class."
  ],
  "interview": {
    "expectations": [
      "Explain strictNullChecks with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "Control flow analysis tracks undefined elimination."
    ],
    "commonQuestions": [
      "What is strictNullChecks?",
      "When would you choose strictNullChecks over alternatives?",
      "What is the classic strictNullChecks interview trap?"
    ],
    "traps": [
      "Disabling strictNullChecks to green CI — reintroduces entire bug class."
    ],
    "misconceptions": [
      "Most production TypeErrors are \"cannot read property of undefined\" — this flag forces handling upfront."
    ],
    "strongSignals": [
      "Uses strictNullChecks to remove invalid states, not just document them."
    ]
  }
})
