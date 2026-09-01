import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Method Overriding",
  "whatIsIt": "Subclass methods override base methods with compatible signatures. override keyword (noImplicitOverride) catches typos. Return types may be subtypes (covariant). super.method() calls base implementation.",
  "whyExists": "Polymorphism with type safety — wrong override signatures fail at compile time.",
  "mentalModel": "Replace parent method while keeping phone line to super.",
  "how": [
    "override render(): JSX.Element in React class components.",
    "Enable noImplicitOverride in tsconfig.",
    "Widen params or narrow returns breaks assignability.",
    "Abstract override in further subclasses.",
    "Prefer composition hooks over deep override chains."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Misspelled method name without override — silent new method, not override.",
    "variant": "warning"
  },
  "example": "class Logger { log(msg: string): void { console.log(msg); } }\nclass TimestampLogger extends Logger {\n  override log(msg: string): void { super.log(`[${Date.now()}] ${msg}`); }\n}\nnew TimestampLogger().log('hi');\nconsole.log(\"new TimestampLogger().lo\");\nclass Logger { log(msg: string): void { // Also inspect(msg); } }\n// TypeScript validates this file before emit",
  "exampleCaption": "override log wraps super.log with timestamp",
  "internals": [
    "override modifier checked against base existence.",
    "Instance methods bivariant in strictness settings historically.",
    "Virtual override pattern typed via abstract base."
  ],
  "takeaways": [
    "override render(): JSX.Element in React class components.",
    "Enable noImplicitOverride in tsconfig.",
    "Misspelled method name without override — silent new method, not override.",
    "override modifier checked against base existence."
  ],
  "revision": [
    "Method Overriding: Replace parent method while keeping phone line to super.",
    "override render(): JSX.Element in React class components.",
    "Enable noImplicitOverride in tsconfig.",
    "Widen params or narrow returns breaks assignability.",
    "Trap: Misspelled method name without override — silent new method, not override."
  ],
  "flashcards": [
    [
      "Method Overriding",
      "Subclass methods override base methods with compatible signatures."
    ],
    [
      "Mental model",
      "Replace parent method while keeping phone line to super."
    ],
    [
      "Common trap",
      "Misspelled method name without override — silent new method, not override."
    ],
    [
      "override render(): JSX.Element in React class components.",
      "Enable noImplicitOverride in tsconfig."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Method Overriding in TypeScript and when do you use it?",
      "answerHint": "Subclass methods override base methods with compatible signatures. override keyword (noImplicitOverride) catches typos. Return types may be subtypes (covariant). super.method() calls base implementation."
    },
    {
      "level": "intermediate",
      "question": "Explain Method Overriding with a code example and one pitfall.",
      "answerHint": "override render(): JSX.Element in React class components. Enable noImplicitOverride in tsconfig. Widen params or narrow returns breaks assignability. Abstract override in further subclasses. Prefer composition hooks over deep override chains. Pitfall: Misspelled method name without override — silent new method, not override."
    },
    {
      "level": "advanced",
      "question": "How would you explain Method Overriding in a senior frontend interview?",
      "answerHint": "override modifier checked against base existence. Instance methods bivariant in strictness settings historically. Virtual override pattern typed via abstract base. class Logger { log(msg: string): void { console.log(msg); } }\nclass TimestampLogger extends Logger {\n  override log(msg:"
    }
  ],
  "pitfalls": [
    "Misspelled method name without override — silent new method, not override."
  ],
  "interview": {
    "expectations": [
      "Explain Method Overriding with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "override modifier checked against base existence."
    ],
    "commonQuestions": [
      "What is Method Overriding?",
      "When would you choose Method Overriding over alternatives?",
      "What is the classic Method Overriding interview trap?"
    ],
    "traps": [
      "Misspelled method name without override — silent new method, not override."
    ],
    "misconceptions": [
      "Polymorphism with type safety — wrong override signatures fail at compile time."
    ],
    "strongSignals": [
      "Uses Method Overriding to remove invalid states, not just document them."
    ]
  }
})
