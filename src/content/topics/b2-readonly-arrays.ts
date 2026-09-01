import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Readonly Arrays",
  "whatIsIt": "readonly T[] or ReadonlyArray<T> disables push, pop, splice, and indexed assignment. It signals intent: consumers may read but not mutate. Spread and map still produce new arrays.",
  "whyExists": "Immutability at type level documents API contracts without runtime cost.",
  "mentalModel": "Glass display case — look, do not rearrange.",
  "how": [
    "Function params: items: readonly string[].",
    "const tuple = [1, 2] as const → readonly tuple.",
    "ReadonlyArray includes length and readonly index signature.",
    "Deep readonly needs recursive mapped type or libraries.",
    "Combine with Readonly utility on object arrays."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Assuming readonly is deep — nested objects may still be mutable unless Readonly<T>.",
    "variant": "warning"
  },
  "example": "function sum(nums: readonly number[]): number {\n  return nums.reduce((a, b) => a + b, 0);\n}\nconst values = [1, 2, 3] as const;\nconsole.log(sum([...values]));\nconsole.log(\"void values;\");\nconsole.log(sum('demo'));\n// TypeScript validates this file before emit",
  "exampleCaption": "readonly param accepts mutable array at call site",
  "internals": [
    "readonly is modifier on array type, not runtime freeze.",
    "Mutable arrays assignable to readonly (covariance).",
    "Object.freeze is runtime; readonly is compile-time."
  ],
  "takeaways": [
    "Function params: items: readonly string[].",
    "const tuple = [1, 2] as const → readonly tuple.",
    "Assuming readonly is deep — nested objects may still be mutable unless Readonly<T>.",
    "readonly is modifier on array type, not runtime freeze."
  ],
  "revision": [
    "Readonly Arrays: Glass display case — look, do not rearrange.",
    "Function params: items: readonly string[].",
    "const tuple = [1, 2] as const → readonly tuple.",
    "ReadonlyArray includes length and readonly index signature.",
    "Trap: Assuming readonly is deep — nested objects may still be mutable unless Readonly<T>."
  ],
  "flashcards": [
    [
      "Readonly Arrays",
      "readonly T[] or ReadonlyArray<T> disables push, pop, splice, and indexed assignment."
    ],
    [
      "Mental model",
      "Glass display case — look, do not rearrange."
    ],
    [
      "Common trap",
      "Assuming readonly is deep — nested objects may still be mutable unless Readonly<T>."
    ],
    [
      "Function params: items: readonly string[].",
      "const tuple = [1, 2] as const → readonly tuple."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Readonly Arrays in TypeScript and when do you use it?",
      "answerHint": "readonly T[] or ReadonlyArray<T> disables push, pop, splice, and indexed assignment. It signals intent: consumers may read but not mutate. Spread and map still produce new arrays."
    },
    {
      "level": "intermediate",
      "question": "Explain Readonly Arrays with a code example and one pitfall.",
      "answerHint": "Function params: items: readonly string[]. const tuple = [1, 2] as const → readonly tuple. ReadonlyArray includes length and readonly index signature. Deep readonly needs recursive mapped type or libraries. Combine with Readonly utility on object arrays. Pitfall: Assuming readonly is deep — nested objects may still be mutable unless Readonly<T>."
    },
    {
      "level": "advanced",
      "question": "How would you explain Readonly Arrays in a senior frontend interview?",
      "answerHint": "readonly is modifier on array type, not runtime freeze. Mutable arrays assignable to readonly (covariance). Object.freeze is runtime; readonly is compile-time. function sum(nums: readonly number[]): number {\n  return nums.reduce((a, b) => a + b, 0);\n}\nconst values = [1, 2, 3] as "
    }
  ],
  "pitfalls": [
    "Assuming readonly is deep — nested objects may still be mutable unless Readonly<T>."
  ],
  "interview": {
    "expectations": [
      "Explain Readonly Arrays with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "readonly is modifier on array type, not runtime freeze."
    ],
    "commonQuestions": [
      "What is Readonly Arrays?",
      "When would you choose Readonly Arrays over alternatives?",
      "What is the classic Readonly Arrays interview trap?"
    ],
    "traps": [
      "Assuming readonly is deep — nested objects may still be mutable unless Readonly<T>."
    ],
    "misconceptions": [
      "Immutability at type level documents API contracts without runtime cost."
    ],
    "strongSignals": [
      "Uses Readonly Arrays to remove invalid states, not just document them."
    ]
  }
})
