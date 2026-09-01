import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "string",
  "whatIsIt": "string is the type for textual UTF-16 sequences. Template literals produce strings; TS also supports string literal types (\"admin\" | \"user\") for precise unions. Methods like trim, slice, and includes are typed on the built-in String interface.",
  "whyExists": "Most APIs carry names, URLs, and messages as strings — accurate typing prevents number/boolean confusion at boundaries.",
  "mentalModel": "A string is a labeled ribbon of characters; literal types color specific ribbons.",
  "how": [
    "Annotate user-facing text as string.",
    "Use template literal types for event name patterns.",
    "Prefer string over any for IDs when format is unknown.",
    "as const on string arrays narrows to readonly literals.",
    "Branded strings encode units: type UserId = string & { readonly brand: unique symbol }."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Confusing string with single-char — use string; char is not a separate TS primitive.",
    "variant": "warning"
  },
  "example": "type Role = 'admin' | 'viewer';\nfunction setRole(r: Role) { console.log(r); }\nsetRole('admin');\nconst label: string = `Role: admin`;\nconst __typed: Role = {} as Role;\nconsole.log(\"void __typed;\");\nconsole.log(\"export type { Role }\");\n// type Role = 'admin' | 'viewer'; narrows allowed values",
  "exampleCaption": "General string vs literal union Role",
  "internals": [
    "String literal types participate in discriminated unions.",
    "Template literal types distribute over unions.",
    "Encoding (UTF-16 surrogate pairs) matches JS string model."
  ],
  "takeaways": [
    "Annotate user-facing text as string.",
    "Use template literal types for event name patterns.",
    "Confusing string with single-char — use string; char is not a separate TS primitive.",
    "String literal types participate in discriminated unions."
  ],
  "revision": [
    "string: A string is a labeled ribbon of characters; literal types color specific ribbons.",
    "Annotate user-facing text as string.",
    "Use template literal types for event name patterns.",
    "Prefer string over any for IDs when format is unknown.",
    "Trap: Confusing string with single-char — use string; char is not a separate TS primitive."
  ],
  "flashcards": [
    [
      "string",
      "string is the type for textual UTF-16 sequences."
    ],
    [
      "Mental model",
      "A string is a labeled ribbon of characters; literal types color specific ribbons."
    ],
    [
      "Common trap",
      "Confusing string with single-char — use string; char is not a separate TS primitive."
    ],
    [
      "Annotate user-facing text as string.",
      "Use template literal types for event name patterns."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is string in TypeScript and when do you use it?",
      "answerHint": "string is the type for textual UTF-16 sequences. Template literals produce strings; TS also supports string literal types (\"admin\" | \"user\") for precise unions. Methods like trim, slice, and includes are typed on the built-in String interface."
    },
    {
      "level": "intermediate",
      "question": "Explain string with a code example and one pitfall.",
      "answerHint": "Annotate user-facing text as string. Use template literal types for event name patterns. Prefer string over any for IDs when format is unknown. as const on string arrays narrows to readonly literals. Branded strings encode units: type UserId = string & { readonly brand: unique symbol }. Pitfall: Confusing string with single-char — use string; char is not a separate TS primitive."
    },
    {
      "level": "advanced",
      "question": "How would you explain string in a senior frontend interview?",
      "answerHint": "String literal types participate in discriminated unions. Template literal types distribute over unions. Encoding (UTF-16 surrogate pairs) matches JS string model. type Role = 'admin' | 'viewer';\nfunction setRole(r: Role) { console.log(r); }\nsetRole('admin');\nconst label: string = `R"
    }
  ],
  "pitfalls": [
    "Confusing string with single-char — use string; char is not a separate TS primitive."
  ],
  "interview": {
    "expectations": [
      "Explain string with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "String literal types participate in discriminated unions."
    ],
    "commonQuestions": [
      "What is string?",
      "When would you choose string over alternatives?",
      "What is the classic string interview trap?"
    ],
    "traps": [
      "Confusing string with single-char — use string; char is not a separate TS primitive."
    ],
    "misconceptions": [
      "Most APIs carry names, URLs, and messages as strings — accurate typing prevents number/boolean confusion at boundaries."
    ],
    "strongSignals": [
      "Uses string to remove invalid states, not just document them."
    ]
  }
})
