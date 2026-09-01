import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "String Enums",
  "whatIsIt": "String enums assign string values to each member: enum Color { Red = \"red\" }. They serialize cleanly to JSON and debug logs. Each member type is Color, not the literal \"red\" unless narrowed.",
  "whyExists": "String enums read well in APIs and avoid numeric magic values.",
  "mentalModel": "Named labels glued to string payloads.",
  "how": [
    "Use PascalCase members, lowercase string values if API expects.",
    "Do not rely on auto-increment — specify strings explicitly.",
    "Switch on enum for exhaustiveness.",
    "Compare to literal unions for zero emit.",
    "Document mapping if server uses different strings."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Expecting Theme.Light type to be \"light\" literal — it is Theme unless const enum or union.",
    "variant": "warning"
  },
  "example": "enum Theme { Light = 'light', Dark = 'dark' }\nfunction css(theme: Theme): string {\n  return theme === Theme.Dark ? 'color-scheme: dark' : 'color-scheme: light';\n}\nconsole.log(css(Theme.Light));\nconsole.log(css('demo'));\n// TypeScript validates this file before emit\n// Strict mode catches misuse at compile time",
  "exampleCaption": "Theme string enum drives CSS branch",
  "internals": [
    "String enums do not get reverse maps.",
    "Each member emits runtime property unless const enum.",
    "Unions of literals are assignable more flexibly at boundaries."
  ],
  "takeaways": [
    "Use PascalCase members, lowercase string values if API expects.",
    "Do not rely on auto-increment — specify strings explicitly.",
    "Expecting Theme.Light type to be \"light\" literal — it is Theme unless const enum or union.",
    "String enums do not get reverse maps."
  ],
  "revision": [
    "String Enums: Named labels glued to string payloads.",
    "Use PascalCase members, lowercase string values if API expects.",
    "Do not rely on auto-increment — specify strings explicitly.",
    "Switch on enum for exhaustiveness.",
    "Trap: Expecting Theme.Light type to be \"light\" literal — it is Theme unless const enum or union."
  ],
  "flashcards": [
    [
      "String Enums",
      "String enums assign string values to each member: enum Color { Red = \"red\" }."
    ],
    [
      "Mental model",
      "Named labels glued to string payloads."
    ],
    [
      "Common trap",
      "Expecting Theme.Light type to be \"light\" literal — it is Theme unless const enum or union."
    ],
    [
      "Use PascalCase members, lowercase string values if API expects.",
      "Do not rely on auto-increment — specify strings explicitly."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is String Enums in TypeScript and when do you use it?",
      "answerHint": "String enums assign string values to each member: enum Color { Red = \"red\" }. They serialize cleanly to JSON and debug logs. Each member type is Color, not the literal \"red\" unless narrowed."
    },
    {
      "level": "intermediate",
      "question": "Explain String Enums with a code example and one pitfall.",
      "answerHint": "Use PascalCase members, lowercase string values if API expects. Do not rely on auto-increment — specify strings explicitly. Switch on enum for exhaustiveness. Compare to literal unions for zero emit. Document mapping if server uses different strings. Pitfall: Expecting Theme.Light type to be \"light\" literal — it is Theme unless const enum or union."
    },
    {
      "level": "advanced",
      "question": "How would you explain String Enums in a senior frontend interview?",
      "answerHint": "String enums do not get reverse maps. Each member emits runtime property unless const enum. Unions of literals are assignable more flexibly at boundaries. enum Theme { Light = 'light', Dark = 'dark' }\nfunction css(theme: Theme): string {\n  return theme === Theme.Dark ? 'colo"
    }
  ],
  "pitfalls": [
    "Expecting Theme.Light type to be \"light\" literal — it is Theme unless const enum or union."
  ],
  "interview": {
    "expectations": [
      "Explain String Enums with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "String enums do not get reverse maps."
    ],
    "commonQuestions": [
      "What is String Enums?",
      "When would you choose String Enums over alternatives?",
      "What is the classic String Enums interview trap?"
    ],
    "traps": [
      "Expecting Theme.Light type to be \"light\" literal — it is Theme unless const enum or union."
    ],
    "misconceptions": [
      "String enums read well in APIs and avoid numeric magic values."
    ],
    "strongSignals": [
      "Uses String Enums to remove invalid states, not just document them."
    ]
  }
})
