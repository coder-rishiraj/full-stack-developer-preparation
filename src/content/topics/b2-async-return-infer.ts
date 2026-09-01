import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Async Return with infer / Awaited",
  "whatIsIt": "AsyncReturn<T> pattern: T extends (...args: any) => Promise<infer R> ? R : T extends (...args: any) => infer S ? S : never. Or Awaited<ReturnType<T>> in modern TS. Extracts resolved async value for typed hooks.",
  "whyExists": "Interview favorite — typing useQuery/fetch wrappers without manual generics.",
  "mentalModel": "Peel Promise off function return automatically.",
  "how": [
    "type AsyncReturn<T extends (...args: any) => any> = Awaited<ReturnType<T>>;",
    "Apply to API client methods.",
    "Generic hooks: useData<typeof fetchUser>.",
    "Handles non-async functions as identity via union.",
    "Combine with infer R in conditional for libraries pre-Awaited."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Forgetting Awaited — User typed as Promise<{...}>.",
    "variant": "warning"
  },
  "example": "async function loadUser(id: string) {\n  return { id, name: 'Ada' as const };\n}\ntype User = Awaited<ReturnType<typeof loadUser>>;\nconst u: User = { id: '1', name: 'Ada' };\nconsole.log(u.name);\nconsole.log(\"export type { User }\");\n// type User = Awaited<ReturnType<typeof loadUser>>; narrows allowed values",
  "exampleCaption": "Awaited<ReturnType<typeof loadUser>> → User shape",
  "internals": [
    "ReturnType on async fn includes Promise wrapper.",
    "infer R in Promise<infer R> equivalent extraction.",
    "Conditional distributes over union of functions carefully."
  ],
  "takeaways": [
    "type AsyncReturn<T extends (...args: any) => any> = Awaited<ReturnType<T>>;",
    "Apply to API client methods.",
    "Forgetting Awaited — User typed as Promise<{...}>.",
    "ReturnType on async fn includes Promise wrapper."
  ],
  "revision": [
    "Async Return with infer / Awaited: Peel Promise off function return automatically.",
    "type AsyncReturn<T extends (...args: any) => any> = Awaited<ReturnType<T>>;",
    "Apply to API client methods.",
    "Generic hooks: useData<typeof fetchUser>.",
    "Trap: Forgetting Awaited — User typed as Promise<{...}>."
  ],
  "flashcards": [
    [
      "Async Return with infer / Awaited",
      "AsyncReturn<T> pattern: T extends (...args: any) => Promise<infer R> ? R : T extends (...args: any) => infer S ? S : never."
    ],
    [
      "Mental model",
      "Peel Promise off function return automatically."
    ],
    [
      "Common trap",
      "Forgetting Awaited — User typed as Promise<{...}>."
    ],
    [
      "type AsyncReturn<T extends (...args: any) => any> = Awaited<ReturnType<T>>;",
      "Apply to API client methods."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Async Return with infer / Awaited in TypeScript and when do you use it?",
      "answerHint": "AsyncReturn<T> pattern: T extends (...args: any) => Promise<infer R> ? R : T extends (...args: any) => infer S ? S : never. Or Awaited<ReturnType<T>> in modern TS. Extracts resolved async value for typed hooks."
    },
    {
      "level": "intermediate",
      "question": "Explain Async Return with infer / Awaited with a code example and one pitfall.",
      "answerHint": "type AsyncReturn<T extends (...args: any) => any> = Awaited<ReturnType<T>>; Apply to API client methods. Generic hooks: useData<typeof fetchUser>. Handles non-async functions as identity via union. Combine with infer R in conditional for libraries pre-Awaited. Pitfall: Forgetting Awaited — User typed as Promise<{...}>."
    },
    {
      "level": "advanced",
      "question": "How would you explain Async Return with infer / Awaited in a senior frontend interview?",
      "answerHint": "ReturnType on async fn includes Promise wrapper. infer R in Promise<infer R> equivalent extraction. Conditional distributes over union of functions carefully. async function loadUser(id: string) {\n  return { id, name: 'Ada' as const };\n}\ntype User = Awaited<ReturnType<typeof loa"
    }
  ],
  "pitfalls": [
    "Forgetting Awaited — User typed as Promise<{...}>."
  ],
  "interview": {
    "expectations": [
      "Explain Async Return with infer / Awaited with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "ReturnType on async fn includes Promise wrapper."
    ],
    "commonQuestions": [
      "What is Async Return with infer / Awaited?",
      "When would you choose Async Return with infer / Awaited over alternatives?",
      "What is the classic Async Return with infer / Awaited interview trap?"
    ],
    "traps": [
      "Forgetting Awaited — User typed as Promise<{...}>."
    ],
    "misconceptions": [
      "Interview favorite — typing useQuery/fetch wrappers without manual generics."
    ],
    "strongSignals": [
      "Uses Async Return with infer / Awaited to remove invalid states, not just document them."
    ]
  }
})
