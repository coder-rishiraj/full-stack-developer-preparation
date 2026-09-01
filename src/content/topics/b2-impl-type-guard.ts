import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Implement isPreferences Guard",
  "whatIsIt": "Implementation: write custom type guard isUser(u: unknown): u is User with runtime checks and use to narrow unknown[] to User[].",
  "whyExists": "Practice unknown → concrete via predicate.",
  "mentalModel": "Filter unknown JSON array to User[] with guard.",
  "how": [
    "Define User interface.",
    "Check typeof, null, required keys, nested types.",
    "Use in filter: candidates.filter(isUser).",
    "Return false on any failed check.",
    "Avoid as User cast inside guard body except final narrow."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Guard returns true without validating nested fields — partial validation lie.",
    "variant": "warning"
  },
  "example": "type User = { id: string; name: string };\nfunction isUser(v: unknown): v is User {\n  if (typeof v !== 'object' || v === null) return false;\n  const o = v as Record<string, unknown>;\n  return typeof o.id === 'string' && typeof o.name === 'string';\n}\nconst raw: unknown[] = [{ id: '1', name: 'Ada' }, null, { id: 2 }];\nconst users = raw.filter(isUser);\nconsole.log(users[0]?.name);",
  "exampleCaption": "filter(isUser) narrows unknown[] to User[]",
  "internals": [
    "Type predicate affects narrowing on boolean && guard(x).",
    "Assertion functions alternative with asserts x is User.",
    "Zod schema .safeParse replaces hand guards in prod."
  ],
  "takeaways": [
    "Define User interface.",
    "Check typeof, null, required keys, nested types.",
    "Guard returns true without validating nested fields — partial validation lie.",
    "Type predicate affects narrowing on boolean && guard(x)."
  ],
  "revision": [
    "Implement isPreferences Guard: Filter unknown JSON array to User[] with guard.",
    "Define User interface.",
    "Check typeof, null, required keys, nested types.",
    "Use in filter: candidates.filter(isUser).",
    "Trap: Guard returns true without validating nested fields — partial validation lie."
  ],
  "flashcards": [
    [
      "Implement isPreferences Guard",
      "Implementation: write custom type guard isUser(u: unknown): u is User with runtime checks and use to narrow unknown[] to User[]."
    ],
    [
      "Mental model",
      "Filter unknown JSON array to User[] with guard."
    ],
    [
      "Common trap",
      "Guard returns true without validating nested fields — partial validation lie."
    ],
    [
      "Define User interface.",
      "Check typeof, null, required keys, nested types."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Implement isPreferences Guard in TypeScript and when do you use it?",
      "answerHint": "Implementation: write custom type guard isUser(u: unknown): u is User with runtime checks and use to narrow unknown[] to User[]."
    },
    {
      "level": "intermediate",
      "question": "Explain Implement isPreferences Guard with a code example and one pitfall.",
      "answerHint": "Define User interface. Check typeof, null, required keys, nested types. Use in filter: candidates.filter(isUser). Return false on any failed check. Avoid as User cast inside guard body except final narrow. Pitfall: Guard returns true without validating nested fields — partial validation lie."
    },
    {
      "level": "advanced",
      "question": "How would you explain Implement isPreferences Guard in a senior frontend interview?",
      "answerHint": "Type predicate affects narrowing on boolean && guard(x). Assertion functions alternative with asserts x is User. Zod schema .safeParse replaces hand guards in prod. type User = { id: string; name: string };\nfunction isUser(v: unknown): v is User {\n  if (typeof v !== 'object' || v === "
    }
  ],
  "pitfalls": [
    "Guard returns true without validating nested fields — partial validation lie."
  ],
  "interview": {
    "expectations": [
      "Explain Implement isPreferences Guard with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "Type predicate affects narrowing on boolean && guard(x)."
    ],
    "commonQuestions": [
      "What is Implement isPreferences Guard?",
      "When would you choose Implement isPreferences Guard over alternatives?",
      "What is the classic Implement isPreferences Guard interview trap?"
    ],
    "traps": [
      "Guard returns true without validating nested fields — partial validation lie."
    ],
    "misconceptions": [
      "Practice unknown → concrete via predicate."
    ],
    "strongSignals": [
      "Uses Implement isPreferences Guard to remove invalid states, not just document them."
    ]
  }
})
