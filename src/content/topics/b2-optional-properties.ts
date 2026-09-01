import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Optional Properties",
  "whatIsIt": "Optional properties use ? : { email?: string } means string | undefined. Access requires narrowing or defaults. distinct from T | undefined when exactOptionalPropertyTypes is on — cannot assign undefined explicitly unless allowed.",
  "whyExists": "APIs often omit fields — optionals model partial payloads cleanly.",
  "mentalModel": "Fields that may be missing from the form.",
  "how": [
    "Mark sparse JSON fields optional.",
    "Use ?? or default when reading optional.",
    "Partial<T> utility makes all properties optional.",
    "Required<T> opposite for strict completeness.",
    "Do not abuse optional for always-present nullable — use | null."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Confusing ? with | null — optional is undefined absence, null is explicit value.",
    "variant": "warning"
  },
  "example": "type CreateUser = { name: string; email?: string };\nfunction save(input: CreateUser) {\n  const email = input.email ?? 'none@local';\n  console.log(input.name, email);\n}\nsave({ name: 'Ada' });\nconsole.log(\"export type { CreateUser }\");\n// type CreateUser = { name: string; email?: string }; narrows allowed values",
  "exampleCaption": "Optional email omitted; default applied",
  "internals": [
    "Optional chaining ?. on optional props.",
    "exactOptionalPropertyTypes changes assignability rules.",
    "Discriminated unions often replace many optionals."
  ],
  "takeaways": [
    "Mark sparse JSON fields optional.",
    "Use ?? or default when reading optional.",
    "Confusing ? with | null — optional is undefined absence, null is explicit value.",
    "Optional chaining ?. on optional props."
  ],
  "revision": [
    "Optional Properties: Fields that may be missing from the form.",
    "Mark sparse JSON fields optional.",
    "Use ?? or default when reading optional.",
    "Partial<T> utility makes all properties optional.",
    "Trap: Confusing ? with | null — optional is undefined absence, null is explicit value."
  ],
  "flashcards": [
    [
      "Optional Properties",
      "Optional properties use ? : { email?: string } means string | undefined."
    ],
    [
      "Mental model",
      "Fields that may be missing from the form."
    ],
    [
      "Common trap",
      "Confusing ? with | null — optional is undefined absence, null is explicit value."
    ],
    [
      "Mark sparse JSON fields optional.",
      "Use ?? or default when reading optional."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Optional Properties in TypeScript and when do you use it?",
      "answerHint": "Optional properties use ? : { email?: string } means string | undefined. Access requires narrowing or defaults. distinct from T | undefined when exactOptionalPropertyTypes is on — cannot assign undefined explicitly unless allowed."
    },
    {
      "level": "intermediate",
      "question": "Explain Optional Properties with a code example and one pitfall.",
      "answerHint": "Mark sparse JSON fields optional. Use ?? or default when reading optional. Partial<T> utility makes all properties optional. Required<T> opposite for strict completeness. Do not abuse optional for always-present nullable — use | null. Pitfall: Confusing ? with | null — optional is undefined absence, null is explicit value."
    },
    {
      "level": "advanced",
      "question": "How would you explain Optional Properties in a senior frontend interview?",
      "answerHint": "Optional chaining ?. on optional props. exactOptionalPropertyTypes changes assignability rules. Discriminated unions often replace many optionals. type CreateUser = { name: string; email?: string };\nfunction save(input: CreateUser) {\n  const email = input.email ?? 'n"
    }
  ],
  "pitfalls": [
    "Confusing ? with | null — optional is undefined absence, null is explicit value."
  ],
  "interview": {
    "expectations": [
      "Explain Optional Properties with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "Optional chaining ?. on optional props."
    ],
    "commonQuestions": [
      "What is Optional Properties?",
      "When would you choose Optional Properties over alternatives?",
      "What is the classic Optional Properties interview trap?"
    ],
    "traps": [
      "Confusing ? with | null — optional is undefined absence, null is explicit value."
    ],
    "misconceptions": [
      "APIs often omit fields — optionals model partial payloads cleanly."
    ],
    "strongSignals": [
      "Uses Optional Properties to remove invalid states, not just document them."
    ]
  }
})
