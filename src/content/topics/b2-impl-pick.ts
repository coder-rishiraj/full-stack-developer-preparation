import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Implement type-safe pick()",
  "whatIsIt": "Implementation exercise: build typed pick(obj, keys) where return type Pick<T, K>. Use generic T, K extends keyof T, reduce keys into typed result object.",
  "whyExists": "Hands-on utility types + generics — common live coding prompt.",
  "mentalModel": "Write runtime pick matching Pick<T,K> type.",
  "how": [
    "function pick<T, K extends keyof T>(obj: T, keys: readonly K[]): Pick<T, K>.",
    "Loop keys building result as Pick<T, K>.",
    "Use satisfies or typed accumulator Record<string, unknown>.",
    "Unit test preserves types at call site.",
    "Compare to lodash.pick typings."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Return type any on accumulator — loses Pick inference at call site.",
    "variant": "warning"
  },
  "example": "function pick<T extends object, K extends keyof T>(\n  obj: T,\n  keys: readonly K[]\n): Pick<T, K> {\n  const out = {} as Pick<T, K>;\n  for (const k of keys) out[k] = obj[k];\n  return out;\n}\nconst user = { id: '1', name: 'Ada', role: 'admin' };\nconst pub = pick(user, ['id', 'name'] as const);\nconsole.log(pub.name);",
  "exampleCaption": "pick returns Pick<User, \"id\" | \"name\">",
  "internals": [
    "keyof T constraint ensures keys exist.",
    "readonly K[] preserves tuple literal keys.",
    "Impl validates generics + indexed access understanding."
  ],
  "takeaways": [
    "function pick<T, K extends keyof T>(obj: T, keys: readonly K[]): Pick<T, K>.",
    "Loop keys building result as Pick<T, K>.",
    "Return type any on accumulator — loses Pick inference at call site.",
    "keyof T constraint ensures keys exist."
  ],
  "revision": [
    "Implement type-safe pick(): Write runtime pick matching Pick<T,K> type.",
    "function pick<T, K extends keyof T>(obj: T, keys: readonly K[]): Pick<T, K>.",
    "Loop keys building result as Pick<T, K>.",
    "Use satisfies or typed accumulator Record<string, unknown>.",
    "Trap: Return type any on accumulator — loses Pick inference at call site."
  ],
  "flashcards": [
    [
      "Implement type-safe pick()",
      "Implementation exercise: build typed pick(obj, keys) where return type Pick<T, K>."
    ],
    [
      "Mental model",
      "Write runtime pick matching Pick<T,K> type."
    ],
    [
      "Common trap",
      "Return type any on accumulator — loses Pick inference at call site."
    ],
    [
      "function pick<T, K extends keyof T>(obj: T, keys: readonly K[]): Pick<T, K>.",
      "Loop keys building result as Pick<T, K>."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Implement type-safe pick() in TypeScript and when do you use it?",
      "answerHint": "Implementation exercise: build typed pick(obj, keys) where return type Pick<T, K>. Use generic T, K extends keyof T, reduce keys into typed result object."
    },
    {
      "level": "intermediate",
      "question": "Explain Implement type-safe pick() with a code example and one pitfall.",
      "answerHint": "function pick<T, K extends keyof T>(obj: T, keys: readonly K[]): Pick<T, K>. Loop keys building result as Pick<T, K>. Use satisfies or typed accumulator Record<string, unknown>. Unit test preserves types at call site. Compare to lodash.pick typings. Pitfall: Return type any on accumulator — loses Pick inference at call site."
    },
    {
      "level": "advanced",
      "question": "How would you explain Implement type-safe pick() in a senior frontend interview?",
      "answerHint": "keyof T constraint ensures keys exist. readonly K[] preserves tuple literal keys. Impl validates generics + indexed access understanding. function pick<T extends object, K extends keyof T>(\n  obj: T,\n  keys: readonly K[]\n): Pick<T, K> {\n  const out = {} as P"
    }
  ],
  "pitfalls": [
    "Return type any on accumulator — loses Pick inference at call site."
  ],
  "interview": {
    "expectations": [
      "Explain Implement type-safe pick() with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "keyof T constraint ensures keys exist."
    ],
    "commonQuestions": [
      "What is Implement type-safe pick()?",
      "When would you choose Implement type-safe pick() over alternatives?",
      "What is the classic Implement type-safe pick() interview trap?"
    ],
    "traps": [
      "Return type any on accumulator — loses Pick inference at call site."
    ],
    "misconceptions": [
      "Hands-on utility types + generics — common live coding prompt."
    ],
    "strongSignals": [
      "Uses Implement type-safe pick() to remove invalid states, not just document them."
    ]
  }
})
