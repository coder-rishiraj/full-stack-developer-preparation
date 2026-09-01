import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Default Type Parameters",
  "whatIsIt": "Generic defaults supply fallback when type arg omitted: interface Response<T = unknown>. Call sites stay clean; advanced callers specialize. Defaults must satisfy constraints.",
  "whyExists": "Library ergonomics — simple cases need no type args.",
  "mentalModel": "Preset dial when caller does not choose temperature.",
  "how": [
    "type ApiError<TDetails = void> = { message: string; details: TDetails }.",
    "Multiple defaults left to right.",
    "Partial<T = {}> style in custom utilities.",
    "Document default meaning in public APIs.",
    "Avoid default any — use unknown."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Default that contradicts constraint — compiler error at declaration.",
    "variant": "warning"
  },
  "example": "type Paginated<T, Page extends number = 1> = { items: T[]; page: Page };\nconst p: Paginated<string> = { items: ['a'], page: 1 };\nconsole.log(p.items[0]);\nconst __typed: Paginated = {} as Paginated;\nconsole.log(\"void __typed;\");\n// type Paginated<T, Page extends number = 1> = { items: T[]; page: Page }; narrows allowed values\n// Paginated is available to importers as a type alias\n// TypeScript validates this file before emit",
  "exampleCaption": "Paginated defaults Page to literal 1",
  "internals": [
    "Inference may still pick explicit T without default.",
    "Order: required type params before defaulted ones.",
    "Conditional defaults in advanced utility types."
  ],
  "takeaways": [
    "type ApiError<TDetails = void> = { message: string; details: TDetails }.",
    "Multiple defaults left to right.",
    "Default that contradicts constraint — compiler error at declaration.",
    "Inference may still pick explicit T without default."
  ],
  "revision": [
    "Default Type Parameters: Preset dial when caller does not choose temperature.",
    "type ApiError<TDetails = void> = { message: string; details: TDetails }.",
    "Multiple defaults left to right.",
    "Partial<T = {}> style in custom utilities.",
    "Trap: Default that contradicts constraint — compiler error at declaration."
  ],
  "flashcards": [
    [
      "Default Type Parameters",
      "Generic defaults supply fallback when type arg omitted: interface Response<T = unknown>."
    ],
    [
      "Mental model",
      "Preset dial when caller does not choose temperature."
    ],
    [
      "Common trap",
      "Default that contradicts constraint — compiler error at declaration."
    ],
    [
      "type ApiError<TDetails = void> = { message: string; details: TDetails }.",
      "Multiple defaults left to right."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Default Type Parameters in TypeScript and when do you use it?",
      "answerHint": "Generic defaults supply fallback when type arg omitted: interface Response<T = unknown>. Call sites stay clean; advanced callers specialize. Defaults must satisfy constraints."
    },
    {
      "level": "intermediate",
      "question": "Explain Default Type Parameters with a code example and one pitfall.",
      "answerHint": "type ApiError<TDetails = void> = { message: string; details: TDetails }. Multiple defaults left to right. Partial<T = {}> style in custom utilities. Document default meaning in public APIs. Avoid default any — use unknown. Pitfall: Default that contradicts constraint — compiler error at declaration."
    },
    {
      "level": "advanced",
      "question": "How would you explain Default Type Parameters in a senior frontend interview?",
      "answerHint": "Inference may still pick explicit T without default. Order: required type params before defaulted ones. Conditional defaults in advanced utility types. type Paginated<T, Page extends number = 1> = { items: T[]; page: Page };\nconst p: Paginated<string> = { items: ['a'], pa"
    }
  ],
  "pitfalls": [
    "Default that contradicts constraint — compiler error at declaration."
  ],
  "interview": {
    "expectations": [
      "Explain Default Type Parameters with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "Inference may still pick explicit T without default."
    ],
    "commonQuestions": [
      "What is Default Type Parameters?",
      "When would you choose Default Type Parameters over alternatives?",
      "What is the classic Default Type Parameters interview trap?"
    ],
    "traps": [
      "Default that contradicts constraint — compiler error at declaration."
    ],
    "misconceptions": [
      "Library ergonomics — simple cases need no type args."
    ],
    "strongSignals": [
      "Uses Default Type Parameters to remove invalid states, not just document them."
    ]
  }
})
