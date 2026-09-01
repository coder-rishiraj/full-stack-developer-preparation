import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Singleton Pattern",
  "whatIsIt": "Singleton ensures one instance — private constructor + static getInstance. TS types the instance and hides constructor with private. Thread safety is runtime concern; typing ensures single typed access point.",
  "whyExists": "Config managers and connection pools often expose getInstance(): Singleton.",
  "mentalModel": "One key fits one locked room — static holder typed.",
  "how": [
    "private constructor prevents new outside.",
    "static getInstance(): Singleton lazy-init.",
    "Return type explicit for consumers.",
    "Consider module-scope const instead in ES modules.",
    "Test doubles may need reset hook — document if added."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Singleton global state hurts tests — module pattern or DI often cleaner.",
    "variant": "warning"
  },
  "example": "class Config {\n  private static instance: Config | undefined;\n  private constructor(public readonly env: string) {}\n  static getInstance(): Config {\n    if (!Config.instance) Config.instance = new Config('prod');\n    return Config.instance;\n  }\nconsole.log(Config.getInstance().env);",
  "exampleCaption": "private ctor + getInstance typed Config",
  "internals": [
    "Static private field holds instance reference.",
    "Constructor privacy is compile-time in TS.",
    "ES module singleton is natural single evaluation."
  ],
  "takeaways": [
    "private constructor prevents new outside.",
    "static getInstance(): Singleton lazy-init.",
    "Singleton global state hurts tests — module pattern or DI often cleaner.",
    "Static private field holds instance reference."
  ],
  "revision": [
    "Singleton Pattern: One key fits one locked room — static holder typed.",
    "private constructor prevents new outside.",
    "static getInstance(): Singleton lazy-init.",
    "Return type explicit for consumers.",
    "Trap: Singleton global state hurts tests — module pattern or DI often cleaner."
  ],
  "flashcards": [
    [
      "Singleton Pattern",
      "Singleton ensures one instance — private constructor + static getInstance."
    ],
    [
      "Mental model",
      "One key fits one locked room — static holder typed."
    ],
    [
      "Common trap",
      "Singleton global state hurts tests — module pattern or DI often cleaner."
    ],
    [
      "private constructor prevents new outside.",
      "static getInstance(): Singleton lazy-init."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Singleton Pattern in TypeScript and when do you use it?",
      "answerHint": "Singleton ensures one instance — private constructor + static getInstance. TS types the instance and hides constructor with private. Thread safety is runtime concern; typing ensures single typed access point."
    },
    {
      "level": "intermediate",
      "question": "Explain Singleton Pattern with a code example and one pitfall.",
      "answerHint": "private constructor prevents new outside. static getInstance(): Singleton lazy-init. Return type explicit for consumers. Consider module-scope const instead in ES modules. Test doubles may need reset hook — document if added. Pitfall: Singleton global state hurts tests — module pattern or DI often cleaner."
    },
    {
      "level": "advanced",
      "question": "How would you explain Singleton Pattern in a senior frontend interview?",
      "answerHint": "Static private field holds instance reference. Constructor privacy is compile-time in TS. ES module singleton is natural single evaluation. class Config {\n  private static instance: Config | undefined;\n  private constructor(public readonly env: string) {}\n  st"
    }
  ],
  "pitfalls": [
    "Singleton global state hurts tests — module pattern or DI often cleaner."
  ],
  "interview": {
    "expectations": [
      "Explain Singleton Pattern with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "Static private field holds instance reference."
    ],
    "commonQuestions": [
      "What is Singleton Pattern?",
      "When would you choose Singleton Pattern over alternatives?",
      "What is the classic Singleton Pattern interview trap?"
    ],
    "traps": [
      "Singleton global state hurts tests — module pattern or DI often cleaner."
    ],
    "misconceptions": [
      "Config managers and connection pools often expose getInstance(): Singleton."
    ],
    "strongSignals": [
      "Uses Singleton Pattern to remove invalid states, not just document them."
    ]
  }
})
