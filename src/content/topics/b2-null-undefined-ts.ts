import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "null & undefined",
  "whatIsIt": "null and undefined are distinct literal types representing absence. With strictNullChecks, they are not assignable to other types unless unioned. Optional properties include undefined; nullable fields often use T | null for SQL/API semantics.",
  "whyExists": "JS conflates missing and null in APIs — TS lets you model which absence you mean.",
  "mentalModel": "undefined = slot empty; null = explicit \"no value\" placeholder.",
  "how": [
    "Enable strictNullChecks in tsconfig.",
    "Optional prop?: T means T | undefined.",
    "Use | null when API returns explicit null.",
    "Nullish coalescing ?? and optional chaining ?.",
    "Non-null assertion ! only when you have proof."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Using || instead of ?? — falsy 0 or \"\" get replaced wrongly.",
    "variant": "warning"
  },
  "example": "type Profile = { name: string; bio?: string; avatar: string | null };\nconst p: Profile = { name: 'Ada', avatar: null };\nconsole.log(p.bio ?? 'No bio');\nconsole.log(p.avatar?.length ?? 0);\nconst __typed: Profile = {} as Profile;\nconsole.log(\"void __typed;\");\nconsole.log(\"export type { Profile }\");\n// type Profile = { name: string; bio?: string; avatar: string | null }; narrows allowed values",
  "exampleCaption": "Optional bio vs nullable avatar",
  "internals": [
    "strictNullChecks adds undefined to unmarked optional params.",
    "Definite assignment checks interact with undefined.",
    "exactOptionalPropertyTypes tightens optional semantics further."
  ],
  "takeaways": [
    "Enable strictNullChecks in tsconfig.",
    "Optional prop?: T means T | undefined.",
    "Using || instead of ?? — falsy 0 or \"\" get replaced wrongly.",
    "strictNullChecks adds undefined to unmarked optional params."
  ],
  "revision": [
    "null & undefined: undefined = slot empty; null = explicit \"no value\" placeholder.",
    "Enable strictNullChecks in tsconfig.",
    "Optional prop?: T means T | undefined.",
    "Use | null when API returns explicit null.",
    "Trap: Using || instead of ?? — falsy 0 or \"\" get replaced wrongly."
  ],
  "flashcards": [
    [
      "null & undefined",
      "null and undefined are distinct literal types representing absence."
    ],
    [
      "Mental model",
      "undefined = slot empty; null = explicit \"no value\" placeholder."
    ],
    [
      "Common trap",
      "Using || instead of ?? — falsy 0 or \"\" get replaced wrongly."
    ],
    [
      "Enable strictNullChecks in tsconfig.",
      "Optional prop?: T means T | undefined."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is null & undefined in TypeScript and when do you use it?",
      "answerHint": "null and undefined are distinct literal types representing absence. With strictNullChecks, they are not assignable to other types unless unioned. Optional properties include undefined; nullable fields often use T | null for SQL/API semantics."
    },
    {
      "level": "intermediate",
      "question": "Explain null & undefined with a code example and one pitfall.",
      "answerHint": "Enable strictNullChecks in tsconfig. Optional prop?: T means T | undefined. Use | null when API returns explicit null. Nullish coalescing ?? and optional chaining ?. Non-null assertion ! only when you have proof. Pitfall: Using || instead of ?? — falsy 0 or \"\" get replaced wrongly."
    },
    {
      "level": "advanced",
      "question": "How would you explain null & undefined in a senior frontend interview?",
      "answerHint": "strictNullChecks adds undefined to unmarked optional params. Definite assignment checks interact with undefined. exactOptionalPropertyTypes tightens optional semantics further. type Profile = { name: string; bio?: string; avatar: string | null };\nconst p: Profile = { name: 'Ada', avatar: null };\n"
    }
  ],
  "pitfalls": [
    "Using || instead of ?? — falsy 0 or \"\" get replaced wrongly."
  ],
  "interview": {
    "expectations": [
      "Explain null & undefined with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "strictNullChecks adds undefined to unmarked optional params."
    ],
    "commonQuestions": [
      "What is null & undefined?",
      "When would you choose null & undefined over alternatives?",
      "What is the classic null & undefined interview trap?"
    ],
    "traps": [
      "Using || instead of ?? — falsy 0 or \"\" get replaced wrongly."
    ],
    "misconceptions": [
      "JS conflates missing and null in APIs — TS lets you model which absence you mean."
    ],
    "strongSignals": [
      "Uses null & undefined to remove invalid states, not just document them."
    ]
  }
})
