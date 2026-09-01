import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Function Type Variance",
  "whatIsIt": "Variance describes subtyping of function types: parameters are contravariant (wider param ok in assignability under strictFunctionTypes), returns covariant (narrower return ok). Bivariant methods in classes are legacy exception.",
  "whyExists": "Interview depth — explains why callback assignability errors appear under strict.",
  "mentalModel": "Inputs widen acceptance; outputs narrow promises.",
  "how": [
    "Enable strictFunctionTypes in strict bundle.",
    "Handler (x: Animal) => void not assignable to (x: Dog) => void unsafely.",
    "Return type can be subtype of expected return.",
    "Use generic callbacks to preserve param type.",
    "Method syntax in interfaces bivariant historically — prefer property function type."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Disabling strictFunctionTypes hides unsound callback assignments.",
    "variant": "warning"
  },
  "example": "type Handler = (value: string | number) => void;\nconst onlyString: (value: string) => void = (s) => console.log(s.toUpperCase());\nconst handler: Handler = onlyString; // OK: param accepts wider domain\nconsole.log(typeof handler);\nconst __typed: Handler = {} as Handler;\nconsole.log(\"void __typed;\");\nconsole.log(\"export type { Handler }\");\nconst onlyString: (value: string) => void = (s) => // Also inspect(s.toUpperCase());\n// type Handler = (value: string | number) => void; narrows allowed values",
  "exampleCaption": "Narrower param function assignable to wider Handler target",
  "internals": [
    "Variance rules prevent unsound param narrowing.",
    "Conditional types encode variance in libraries.",
    "TypeScript 4.7+ improved method variance options."
  ],
  "takeaways": [
    "Enable strictFunctionTypes in strict bundle.",
    "Handler (x: Animal) => void not assignable to (x: Dog) => void unsafely.",
    "Disabling strictFunctionTypes hides unsound callback assignments.",
    "Variance rules prevent unsound param narrowing."
  ],
  "revision": [
    "Function Type Variance: Inputs widen acceptance; outputs narrow promises.",
    "Enable strictFunctionTypes in strict bundle.",
    "Handler (x: Animal) => void not assignable to (x: Dog) => void unsafely.",
    "Return type can be subtype of expected return.",
    "Trap: Disabling strictFunctionTypes hides unsound callback assignments."
  ],
  "flashcards": [
    [
      "Function Type Variance",
      "Variance describes subtyping of function types: parameters are contravariant (wider param ok in assignability under strictFunctionTypes), returns covariant (narrower return ok)."
    ],
    [
      "Mental model",
      "Inputs widen acceptance; outputs narrow promises."
    ],
    [
      "Common trap",
      "Disabling strictFunctionTypes hides unsound callback assignments."
    ],
    [
      "Enable strictFunctionTypes in strict bundle.",
      "Handler (x: Animal) => void not assignable to (x: Dog) => void unsafely."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Function Type Variance in TypeScript and when do you use it?",
      "answerHint": "Variance describes subtyping of function types: parameters are contravariant (wider param ok in assignability under strictFunctionTypes), returns covariant (narrower return ok). Bivariant methods in classes are legacy exception."
    },
    {
      "level": "intermediate",
      "question": "Explain Function Type Variance with a code example and one pitfall.",
      "answerHint": "Enable strictFunctionTypes in strict bundle. Handler (x: Animal) => void not assignable to (x: Dog) => void unsafely. Return type can be subtype of expected return. Use generic callbacks to preserve param type. Method syntax in interfaces bivariant historically — prefer property function type. Pitfall: Disabling strictFunctionTypes hides unsound callback assignments."
    },
    {
      "level": "advanced",
      "question": "How would you explain Function Type Variance in a senior frontend interview?",
      "answerHint": "Variance rules prevent unsound param narrowing. Conditional types encode variance in libraries. TypeScript 4.7+ improved method variance options. type Handler = (value: string | number) => void;\nconst onlyString: (value: string) => void = (s) => console.log(s.toUppe"
    }
  ],
  "pitfalls": [
    "Disabling strictFunctionTypes hides unsound callback assignments."
  ],
  "interview": {
    "expectations": [
      "Explain Function Type Variance with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "Variance rules prevent unsound param narrowing."
    ],
    "commonQuestions": [
      "What is Function Type Variance?",
      "When would you choose Function Type Variance over alternatives?",
      "What is the classic Function Type Variance interview trap?"
    ],
    "traps": [
      "Disabling strictFunctionTypes hides unsound callback assignments."
    ],
    "misconceptions": [
      "Interview depth — explains why callback assignability errors appear under strict."
    ],
    "strongSignals": [
      "Uses Function Type Variance to remove invalid states, not just document them."
    ]
  }
})
