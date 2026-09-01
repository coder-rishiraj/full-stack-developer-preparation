import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Implement RemoteData<T>",
  "whatIsIt": "Implementation: model API result as discriminated union and handle with exhaustive switch + assertNever. Add new variant and watch compiler force new case.",
  "whyExists": "Proves discriminated unions + exhaustiveness workflow.",
  "mentalModel": "Write reducer consuming tagged union safely.",
  "how": [
    "Define union with type/status discriminant.",
    "Switch on discriminant accessing variant fields.",
    "default: assertNever(x).",
    "Add variant — fix compile error in switch.",
    "Optional map handlers object with satisfies."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Using if (r.ok) without else — TS may not narrow false branch for return.",
    "variant": "warning"
  },
  "example": "type Result =\n  | { ok: true; value: number }\n  | { ok: false; error: string };\nfunction assertNever(x: never): never { throw new Error(String(x)); }\nfunction unwrap(r: Result): number {\n  if (r.ok) return r.value;\n  if (!r.ok) return assertNever(r as never);\n  throw new Error(r.error);\n}\nconsole.log(unwrap({ ok: true, value: 42 }));",
  "exampleCaption": "unwrap narrows on ok discriminant",
  "internals": [
    "Boolean discriminant ok splits union.",
    "assertNever documents intentional unreachable.",
    "Pattern scales to remote data states."
  ],
  "takeaways": [
    "Define union with type/status discriminant.",
    "Switch on discriminant accessing variant fields.",
    "Using if (r.ok) without else — TS may not narrow false branch for return.",
    "Boolean discriminant ok splits union."
  ],
  "revision": [
    "Implement RemoteData<T>: Write reducer consuming tagged union safely.",
    "Define union with type/status discriminant.",
    "Switch on discriminant accessing variant fields.",
    "default: assertNever(x).",
    "Trap: Using if (r.ok) without else — TS may not narrow false branch for return."
  ],
  "flashcards": [
    [
      "Implement RemoteData<T>",
      "Implementation: model API result as discriminated union and handle with exhaustive switch + assertNever."
    ],
    [
      "Mental model",
      "Write reducer consuming tagged union safely."
    ],
    [
      "Common trap",
      "Using if (r.ok) without else — TS may not narrow false branch for return."
    ],
    [
      "Define union with type/status discriminant.",
      "Switch on discriminant accessing variant fields."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Implement RemoteData<T> in TypeScript and when do you use it?",
      "answerHint": "Implementation: model API result as discriminated union and handle with exhaustive switch + assertNever. Add new variant and watch compiler force new case."
    },
    {
      "level": "intermediate",
      "question": "Explain Implement RemoteData<T> with a code example and one pitfall.",
      "answerHint": "Define union with type/status discriminant. Switch on discriminant accessing variant fields. default: assertNever(x). Add variant — fix compile error in switch. Optional map handlers object with satisfies. Pitfall: Using if (r.ok) without else — TS may not narrow false branch for return."
    },
    {
      "level": "advanced",
      "question": "How would you explain Implement RemoteData<T> in a senior frontend interview?",
      "answerHint": "Boolean discriminant ok splits union. assertNever documents intentional unreachable. Pattern scales to remote data states. type Result =\n  | { ok: true; value: number }\n  | { ok: false; error: string };\nfunction assertNever(x: never): never { "
    }
  ],
  "pitfalls": [
    "Using if (r.ok) without else — TS may not narrow false branch for return."
  ],
  "interview": {
    "expectations": [
      "Explain Implement RemoteData<T> with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "Boolean discriminant ok splits union."
    ],
    "commonQuestions": [
      "What is Implement RemoteData<T>?",
      "When would you choose Implement RemoteData<T> over alternatives?",
      "What is the classic Implement RemoteData<T> interview trap?"
    ],
    "traps": [
      "Using if (r.ok) without else — TS may not narrow false branch for return."
    ],
    "misconceptions": [
      "Proves discriminated unions + exhaustiveness workflow."
    ],
    "strongSignals": [
      "Uses Implement RemoteData<T> to remove invalid states, not just document them."
    ]
  }
})
