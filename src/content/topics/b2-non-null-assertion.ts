import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Non-null Assertion (!)",
  "whatIsIt": "Postfix ! asserts value is not null or undefined: user!.name. Compiler trusts you; runtime still throws if wrong. Use sparingly after checks TS cannot see or invariants (Map.get after has).",
  "whyExists": "Pragmatic escape when control flow proof exceeds compiler patience.",
  "mentalModel": "Remove optional sticker — you guarantee presence.",
  "how": [
    "Prefer if (user) narrow over user!.",
    "document.getElementById(...)! after test in same block — still risky.",
    "Definite assignment assertion on fields: id!: string.",
    "eslint no-non-null-assertion warns abuse.",
    "Refactor optional chain ?. instead when possible."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Sprinkling ! to silence strictNullChecks — hides real bugs.",
    "variant": "warning"
  },
  "example": "const map = new Map<string, number>([['a', 1]]);\nfunction get(key: string): number {\n  if (!map.has(key)) throw new Error('missing');\n  return map.get(key)!;\n}\nconsole.log(get('a'));\n// TypeScript validates this file before emit\n// Strict mode catches misuse at compile time",
  "exampleCaption": "map.get returns number | undefined; ! after has check",
  "internals": [
    "Non-null assertion does not emit runtime check.",
    "Different from definite assignment assertion on declarations.",
    "Optional chaining preferred for deep access."
  ],
  "takeaways": [
    "Prefer if (user) narrow over user!.",
    "document.getElementById(...)! after test in same block — still risky.",
    "Sprinkling ! to silence strictNullChecks — hides real bugs.",
    "Non-null assertion does not emit runtime check."
  ],
  "revision": [
    "Non-null Assertion (!): Remove optional sticker — you guarantee presence.",
    "Prefer if (user) narrow over user!.",
    "document.getElementById(...)! after test in same block — still risky.",
    "Definite assignment assertion on fields: id!: string.",
    "Trap: Sprinkling ! to silence strictNullChecks — hides real bugs."
  ],
  "flashcards": [
    [
      "Non-null Assertion (!)",
      "Postfix ! asserts value is not null or undefined: user!.name."
    ],
    [
      "Mental model",
      "Remove optional sticker — you guarantee presence."
    ],
    [
      "Common trap",
      "Sprinkling ! to silence strictNullChecks — hides real bugs."
    ],
    [
      "Prefer if (user) narrow over user!.",
      "document.getElementById(...)! after test in same block — still risky."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Non-null Assertion (!) in TypeScript and when do you use it?",
      "answerHint": "Postfix ! asserts value is not null or undefined: user!.name. Compiler trusts you; runtime still throws if wrong. Use sparingly after checks TS cannot see or invariants (Map.get after has)."
    },
    {
      "level": "intermediate",
      "question": "Explain Non-null Assertion (!) with a code example and one pitfall.",
      "answerHint": "Prefer if (user) narrow over user!. document.getElementById(...)! after test in same block — still risky. Definite assignment assertion on fields: id!: string. eslint no-non-null-assertion warns abuse. Refactor optional chain ?. instead when possible. Pitfall: Sprinkling ! to silence strictNullChecks — hides real bugs."
    },
    {
      "level": "advanced",
      "question": "How would you explain Non-null Assertion (!) in a senior frontend interview?",
      "answerHint": "Non-null assertion does not emit runtime check. Different from definite assignment assertion on declarations. Optional chaining preferred for deep access. const map = new Map<string, number>([['a', 1]]);\nfunction get(key: string): number {\n  if (!map.has(key)) throw new Erro"
    }
  ],
  "pitfalls": [
    "Sprinkling ! to silence strictNullChecks — hides real bugs."
  ],
  "interview": {
    "expectations": [
      "Explain Non-null Assertion (!) with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "Non-null assertion does not emit runtime check."
    ],
    "commonQuestions": [
      "What is Non-null Assertion (!)?",
      "When would you choose Non-null Assertion (!) over alternatives?",
      "What is the classic Non-null Assertion (!) interview trap?"
    ],
    "traps": [
      "Sprinkling ! to silence strictNullChecks — hides real bugs."
    ],
    "misconceptions": [
      "Pragmatic escape when control flow proof exceeds compiler patience."
    ],
    "strongSignals": [
      "Uses Non-null Assertion (!) to remove invalid states, not just document them."
    ]
  }
})
