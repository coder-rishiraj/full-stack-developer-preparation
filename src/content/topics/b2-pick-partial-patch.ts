import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Pick + Partial Patch Payloads",
  "whatIsIt": "API PATCH pattern: Partial<Pick<T, UpdatableKeys>> — only some fields optional and updatable. Exclude id, createdAt via Omit before Pick. Generic patch helper enforces keys subset.",
  "whyExists": "Interview pattern — safe partial updates without allowing id overwrite.",
  "mentalModel": "Update form may change name/email but never id.",
  "how": [
    "type UserPatch = Partial<Pick<User, \"name\" | \"email\">>;",
    "Validate at least one key present if required.",
    "Server merges patch onto entity.",
    "Generic Patch<T, K extends keyof T> = Partial<Pick<T, K>>.",
    "Document immutable fields in type omit list."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Partial<User> — allows patching id if sent maliciously.",
    "variant": "warning"
  },
  "example": "type User = { id: string; name: string; email: string; createdAt: string };\ntype UserPatch = Partial<Pick<User, 'name' | 'email'>>;\nfunction patchUser(id: string, body: UserPatch) {\n  console.log(id, body);\n}\npatchUser('1', { name: 'Ada' });\nconst __typed: User = {} as User;\n// type User = { id: string; name: string; email: string; createdAt: string }; narrows allowed values",
  "exampleCaption": "UserPatch allows optional name/email only",
  "internals": [
    "Pick restricts keys; Partial makes them optional.",
    "Combine with Required<Pick<>> for mandatory patch fields.",
    "Zod .pick().partial() mirrors at runtime."
  ],
  "takeaways": [
    "type UserPatch = Partial<Pick<User, \"name\" | \"email\">>;",
    "Validate at least one key present if required.",
    "Partial<User> — allows patching id if sent maliciously.",
    "Pick restricts keys; Partial makes them optional."
  ],
  "revision": [
    "Pick + Partial Patch Payloads: Update form may change name/email but never id.",
    "type UserPatch = Partial<Pick<User, \"name\" | \"email\">>;",
    "Validate at least one key present if required.",
    "Server merges patch onto entity.",
    "Trap: Partial<User> — allows patching id if sent maliciously."
  ],
  "flashcards": [
    [
      "Pick + Partial Patch Payloads",
      "API PATCH pattern: Partial<Pick<T, UpdatableKeys>> — only some fields optional and updatable."
    ],
    [
      "Mental model",
      "Update form may change name/email but never id."
    ],
    [
      "Common trap",
      "Partial<User> — allows patching id if sent maliciously."
    ],
    [
      "type UserPatch = Partial<Pick<User, \"name\" | \"email\">>;",
      "Validate at least one key present if required."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Pick + Partial Patch Payloads in TypeScript and when do you use it?",
      "answerHint": "API PATCH pattern: Partial<Pick<T, UpdatableKeys>> — only some fields optional and updatable. Exclude id, createdAt via Omit before Pick. Generic patch helper enforces keys subset."
    },
    {
      "level": "intermediate",
      "question": "Explain Pick + Partial Patch Payloads with a code example and one pitfall.",
      "answerHint": "type UserPatch = Partial<Pick<User, \"name\" | \"email\">>; Validate at least one key present if required. Server merges patch onto entity. Generic Patch<T, K extends keyof T> = Partial<Pick<T, K>>. Document immutable fields in type omit list. Pitfall: Partial<User> — allows patching id if sent maliciously."
    },
    {
      "level": "advanced",
      "question": "How would you explain Pick + Partial Patch Payloads in a senior frontend interview?",
      "answerHint": "Pick restricts keys; Partial makes them optional. Combine with Required<Pick<>> for mandatory patch fields. Zod .pick().partial() mirrors at runtime. type User = { id: string; name: string; email: string; createdAt: string };\ntype UserPatch = Partial<Pick<User, 'name' |"
    }
  ],
  "pitfalls": [
    "Partial<User> — allows patching id if sent maliciously."
  ],
  "interview": {
    "expectations": [
      "Explain Pick + Partial Patch Payloads with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "Pick restricts keys; Partial makes them optional."
    ],
    "commonQuestions": [
      "What is Pick + Partial Patch Payloads?",
      "When would you choose Pick + Partial Patch Payloads over alternatives?",
      "What is the classic Pick + Partial Patch Payloads interview trap?"
    ],
    "traps": [
      "Partial<User> — allows patching id if sent maliciously."
    ],
    "misconceptions": [
      "Interview pattern — safe partial updates without allowing id overwrite."
    ],
    "strongSignals": [
      "Uses Pick + Partial Patch Payloads to remove invalid states, not just document them."
    ]
  }
})
