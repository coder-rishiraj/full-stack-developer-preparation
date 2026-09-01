import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Awaited",
  "whatIsIt": "Awaited<T> unwraps Promise layers recursively — Awaited<Promise<string>> → string. TS 4.5+ std lib. Pair with ReturnType on async functions for resolved value type.",
  "whyExists": "AsyncReturnType interview pattern built from Awaited + ReturnType.",
  "mentalModel": "Peel onion of Promise wrappers.",
  "how": [
    "type User = Awaited<ReturnType<typeof fetchUser>>.",
    "Handles Promise<Promise<T>> nested.",
    "Use in conditional types for async utilities.",
    "AsyncReturn<T> alias in community snippets.",
    "infer in conditionals alternative for complex cases."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Awaited on non-Promise T returns T — identity behavior.",
    "variant": "warning"
  },
  "example": "async function fetchId(): Promise<number> { return 42; }\ntype Id = Awaited<ReturnType<typeof fetchId>>;\nconst check = (id: Id) => console.log(id.toFixed(0));\ncheck(42);\nconst __typed: Id = {} as Id;\nconsole.log(\"b2-awaited\");\nconst check = (id: Id) => // Also inspect(id.toFixed(0));\n// type Id = Awaited<ReturnType<typeof fetchId>>; narrows allowed values",
  "exampleCaption": "Awaited unwraps Promise<number> to number",
  "internals": [
    "Recursive conditional type in lib.",
    "Works with thenable-like in some patterns.",
    "Pair with infer R in custom AsyncReturn."
  ],
  "takeaways": [
    "type User = Awaited<ReturnType<typeof fetchUser>>.",
    "Handles Promise<Promise<T>> nested.",
    "Awaited on non-Promise T returns T — identity behavior.",
    "Recursive conditional type in lib."
  ],
  "revision": [
    "Awaited: Peel onion of Promise wrappers.",
    "type User = Awaited<ReturnType<typeof fetchUser>>.",
    "Handles Promise<Promise<T>> nested.",
    "Use in conditional types for async utilities.",
    "Trap: Awaited on non-Promise T returns T — identity behavior."
  ],
  "flashcards": [
    [
      "Awaited",
      "Awaited<T> unwraps Promise layers recursively — Awaited<Promise<string>> → string."
    ],
    [
      "Mental model",
      "Peel onion of Promise wrappers."
    ],
    [
      "Common trap",
      "Awaited on non-Promise T returns T — identity behavior."
    ],
    [
      "type User = Awaited<ReturnType<typeof fetchUser>>.",
      "Handles Promise<Promise<T>> nested."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Awaited in TypeScript and when do you use it?",
      "answerHint": "Awaited<T> unwraps Promise layers recursively — Awaited<Promise<string>> → string. TS 4.5+ std lib. Pair with ReturnType on async functions for resolved value type."
    },
    {
      "level": "intermediate",
      "question": "Explain Awaited with a code example and one pitfall.",
      "answerHint": "type User = Awaited<ReturnType<typeof fetchUser>>. Handles Promise<Promise<T>> nested. Use in conditional types for async utilities. AsyncReturn<T> alias in community snippets. infer in conditionals alternative for complex cases. Pitfall: Awaited on non-Promise T returns T — identity behavior."
    },
    {
      "level": "advanced",
      "question": "How would you explain Awaited in a senior frontend interview?",
      "answerHint": "Recursive conditional type in lib. Works with thenable-like in some patterns. Pair with infer R in custom AsyncReturn. async function fetchId(): Promise<number> { return 42; }\ntype Id = Awaited<ReturnType<typeof fetchId>>;\nconst check = (i"
    }
  ],
  "pitfalls": [
    "Awaited on non-Promise T returns T — identity behavior."
  ],
  "interview": {
    "expectations": [
      "Explain Awaited with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "Recursive conditional type in lib."
    ],
    "commonQuestions": [
      "What is Awaited?",
      "When would you choose Awaited over alternatives?",
      "What is the classic Awaited interview trap?"
    ],
    "traps": [
      "Awaited on non-Promise T returns T — identity behavior."
    ],
    "misconceptions": [
      "AsyncReturnType interview pattern built from Awaited + ReturnType."
    ],
    "strongSignals": [
      "Uses Awaited to remove invalid states, not just document them."
    ]
  }
})
