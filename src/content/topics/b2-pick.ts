import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Pick",
  "whatIsIt": "Pick<T, K> selects subset of keys K from T: Pick<User, \"id\" | \"name\">. K must be keyof T. Interview pattern with Partial for API patches.",
  "whyExists": "Expose only safe fields to clients or forms.",
  "mentalModel": "Photocopy selected columns from spreadsheet type.",
  "how": [
    "Pick<User, \"id\"> for public profile.",
    "Partial<Pick<User, \"name\">> for patch.",
    "Combine with Record for keyed projections.",
    "Generic Pick helper: Pick<T, Keys extends keyof T>.",
    "Prefer Pick over duplicating interface."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Pick with typo key not in keyof T — compile error (good).",
    "variant": "warning"
  },
  "example": "type User = { id: string; name: string; passwordHash: string };\ntype PublicUser = Pick<User, 'id' | 'name'>;\nconst u: PublicUser = { id: '1', name: 'Ada' };\nconsole.log(u.name);\nconst __typed: User = {} as User;\nconsole.log(\"void __typed;\");\nconsole.log(\"export type { User }\");\n// type User = { id: string; name: string; passwordHash: string }; narrows allowed values",
  "exampleCaption": "PublicUser excludes passwordHash",
  "internals": [
    "Pick implemented as mapped type over K.",
    "Preserves optionality of picked keys.",
    "Distributes over union T in conditional contexts carefully."
  ],
  "takeaways": [
    "Pick<User, \"id\"> for public profile.",
    "Partial<Pick<User, \"name\">> for patch.",
    "Pick with typo key not in keyof T — compile error (good).",
    "Pick implemented as mapped type over K."
  ],
  "revision": [
    "Pick: Photocopy selected columns from spreadsheet type.",
    "Pick<User, \"id\"> for public profile.",
    "Partial<Pick<User, \"name\">> for patch.",
    "Combine with Record for keyed projections.",
    "Trap: Pick with typo key not in keyof T — compile error (good)."
  ],
  "flashcards": [
    [
      "Pick",
      "Pick<T, K> selects subset of keys K from T: Pick<User, \"id\" | \"name\">."
    ],
    [
      "Mental model",
      "Photocopy selected columns from spreadsheet type."
    ],
    [
      "Common trap",
      "Pick with typo key not in keyof T — compile error (good)."
    ],
    [
      "Pick<User, \"id\"> for public profile.",
      "Partial<Pick<User, \"name\">> for patch."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Pick in TypeScript and when do you use it?",
      "answerHint": "Pick<T, K> selects subset of keys K from T: Pick<User, \"id\" | \"name\">. K must be keyof T. Interview pattern with Partial for API patches."
    },
    {
      "level": "intermediate",
      "question": "Explain Pick with a code example and one pitfall.",
      "answerHint": "Pick<User, \"id\"> for public profile. Partial<Pick<User, \"name\">> for patch. Combine with Record for keyed projections. Generic Pick helper: Pick<T, Keys extends keyof T>. Prefer Pick over duplicating interface. Pitfall: Pick with typo key not in keyof T — compile error (good)."
    },
    {
      "level": "advanced",
      "question": "How would you explain Pick in a senior frontend interview?",
      "answerHint": "Pick implemented as mapped type over K. Preserves optionality of picked keys. Distributes over union T in conditional contexts carefully. type User = { id: string; name: string; passwordHash: string };\ntype PublicUser = Pick<User, 'id' | 'name'>;\nconst u: Pu"
    }
  ],
  "pitfalls": [
    "Pick with typo key not in keyof T — compile error (good)."
  ],
  "interview": {
    "expectations": [
      "Explain Pick with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "Pick implemented as mapped type over K."
    ],
    "commonQuestions": [
      "What is Pick?",
      "When would you choose Pick over alternatives?",
      "What is the classic Pick interview trap?"
    ],
    "traps": [
      "Pick with typo key not in keyof T — compile error (good)."
    ],
    "misconceptions": [
      "Expose only safe fields to clients or forms."
    ],
    "strongSignals": [
      "Uses Pick to remove invalid states, not just document them."
    ]
  }
})
