import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Typed Arrays",
  "whatIsIt": "Array types in TS use T[] or Array<T> for homogenous lists. ReadonlyArray<T> or readonly T[] prevents mutating methods. Typed arrays (Int32Array, etc.) have dedicated lib types for binary data.",
  "whyExists": "Lists are everywhere — precise element typing catches index and push mistakes.",
  "mentalModel": "A typed shelf: each slot holds the same kind of item.",
  "how": [
    "const nums: number[] = [1, 2, 3].",
    "Generics: Array<User> same as User[].",
    "Tuple vs array: fixed length uses tuple syntax.",
    "Readonly for function params you will not mutate.",
    "Multidimensional: number[][] or Matrix alias."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Using Array<any> — loses element typing on map/filter chains.",
    "variant": "warning"
  },
  "example": "type User = { id: string; name: string };\nconst users: User[] = [{ id: '1', name: 'Ada' }];\nfunction names(list: readonly User[]): string[] {\n  return list.map((u) => u.name);\n}\nconsole.log(names(users));\nconst __typed: User = {} as User;\n// type User = { id: string; name: string }; narrows allowed values",
  "exampleCaption": "User[] param accepts readonly view",
  "internals": [
    "Array inference from non-empty literals.",
    "Covariance of readonly arrays in function params.",
    "Array.isArray narrows unknown to any[] — refine further."
  ],
  "takeaways": [
    "const nums: number[] = [1, 2, 3].",
    "Generics: Array<User> same as User[].",
    "Using Array<any> — loses element typing on map/filter chains.",
    "Array inference from non-empty literals."
  ],
  "revision": [
    "Typed Arrays: A typed shelf: each slot holds the same kind of item.",
    "const nums: number[] = [1, 2, 3].",
    "Generics: Array<User> same as User[].",
    "Tuple vs array: fixed length uses tuple syntax.",
    "Trap: Using Array<any> — loses element typing on map/filter chains."
  ],
  "flashcards": [
    [
      "Typed Arrays",
      "Array types in TS use T[] or Array<T> for homogenous lists."
    ],
    [
      "Mental model",
      "A typed shelf: each slot holds the same kind of item."
    ],
    [
      "Common trap",
      "Using Array<any> — loses element typing on map/filter chains."
    ],
    [
      "const nums: number[] = [1, 2, 3].",
      "Generics: Array<User> same as User[]."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Typed Arrays in TypeScript and when do you use it?",
      "answerHint": "Array types in TS use T[] or Array<T> for homogenous lists. ReadonlyArray<T> or readonly T[] prevents mutating methods. Typed arrays (Int32Array, etc.) have dedicated lib types for binary data."
    },
    {
      "level": "intermediate",
      "question": "Explain Typed Arrays with a code example and one pitfall.",
      "answerHint": "const nums: number[] = [1, 2, 3]. Generics: Array<User> same as User[]. Tuple vs array: fixed length uses tuple syntax. Readonly for function params you will not mutate. Multidimensional: number[][] or Matrix alias. Pitfall: Using Array<any> — loses element typing on map/filter chains."
    },
    {
      "level": "advanced",
      "question": "How would you explain Typed Arrays in a senior frontend interview?",
      "answerHint": "Array inference from non-empty literals. Covariance of readonly arrays in function params. Array.isArray narrows unknown to any[] — refine further. type User = { id: string; name: string };\nconst users: User[] = [{ id: '1', name: 'Ada' }];\nfunction names(list: readonl"
    }
  ],
  "pitfalls": [
    "Using Array<any> — loses element typing on map/filter chains."
  ],
  "interview": {
    "expectations": [
      "Explain Typed Arrays with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "Array inference from non-empty literals."
    ],
    "commonQuestions": [
      "What is Typed Arrays?",
      "When would you choose Typed Arrays over alternatives?",
      "What is the classic Typed Arrays interview trap?"
    ],
    "traps": [
      "Using Array<any> — loses element typing on map/filter chains."
    ],
    "misconceptions": [
      "Lists are everywhere — precise element typing catches index and push mistakes."
    ],
    "strongSignals": [
      "Uses Typed Arrays to remove invalid states, not just document them."
    ]
  }
})
