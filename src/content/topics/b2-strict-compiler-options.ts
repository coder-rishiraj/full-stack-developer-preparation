import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "strict & Compiler Flags",
  "whatIsIt": "strict enables: strictNullChecks, strictFunctionTypes, strictBindCallApply, strictPropertyInitialization, noImplicitAny, noImplicitThis, alwaysStrict, useUnknownInCatchVariables. Each can be toggled but strict:true is baseline for new apps.",
  "whyExists": "Strict bundle catches the bugs that hurt production most.",
  "mentalModel": "Full safety harness vs seatbelt-only subset.",
  "how": [
    "Start strict: true on greenfield.",
    "strictNullChecks highest ROI when migrating.",
    "noImplicitAny forces typing untyped params.",
    "strictPropertyInitialization needs definite assignment or constructor init.",
    "useUnknownInCatchVariables — catch (e: unknown)."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Disabling individual strict flags to greenwash errors — fix root cause.",
    "variant": "warning"
  },
  "example": "// tsconfig compilerOptions excerpt\n// \"strict\": true\n// implies noImplicitAny, strictNullChecks, etc.\nfunction parse(n: string): number {\n  const v = Number(n);\n  if (Number.isNaN(v)) throw new Error('NaN');\n  return v;\n}",
  "exampleCaption": "strict catches missing null checks and any leaks",
  "internals": [
    "strictFunctionTypes changes handler assignability.",
    "exactOptionalPropertyTypes optional separate stricter flag.",
    "noUncheckedIndexedAccess adds undefined on index access."
  ],
  "takeaways": [
    "Start strict: true on greenfield.",
    "strictNullChecks highest ROI when migrating.",
    "Disabling individual strict flags to greenwash errors — fix root cause.",
    "strictFunctionTypes changes handler assignability."
  ],
  "revision": [
    "strict & Compiler Flags: Full safety harness vs seatbelt-only subset.",
    "Start strict: true on greenfield.",
    "strictNullChecks highest ROI when migrating.",
    "noImplicitAny forces typing untyped params.",
    "Trap: Disabling individual strict flags to greenwash errors — fix root cause."
  ],
  "flashcards": [
    [
      "strict & Compiler Flags",
      "strict enables: strictNullChecks, strictFunctionTypes, strictBindCallApply, strictPropertyInitialization, noImplicitAny, noImplicitThis, alwaysStrict, useUnknownInCatchVariables."
    ],
    [
      "Mental model",
      "Full safety harness vs seatbelt-only subset."
    ],
    [
      "Common trap",
      "Disabling individual strict flags to greenwash errors — fix root cause."
    ],
    [
      "Start strict: true on greenfield.",
      "strictNullChecks highest ROI when migrating."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is strict & Compiler Flags in TypeScript and when do you use it?",
      "answerHint": "strict enables: strictNullChecks, strictFunctionTypes, strictBindCallApply, strictPropertyInitialization, noImplicitAny, noImplicitThis, alwaysStrict, useUnknownInCatchVariables. Each can be toggled but strict:true is baseline for new apps."
    },
    {
      "level": "intermediate",
      "question": "Explain strict & Compiler Flags with a code example and one pitfall.",
      "answerHint": "Start strict: true on greenfield. strictNullChecks highest ROI when migrating. noImplicitAny forces typing untyped params. strictPropertyInitialization needs definite assignment or constructor init. useUnknownInCatchVariables — catch (e: unknown). Pitfall: Disabling individual strict flags to greenwash errors — fix root cause."
    },
    {
      "level": "advanced",
      "question": "How would you explain strict & Compiler Flags in a senior frontend interview?",
      "answerHint": "strictFunctionTypes changes handler assignability. exactOptionalPropertyTypes optional separate stricter flag. noUncheckedIndexedAccess adds undefined on index access. // tsconfig compilerOptions excerpt\n// \"strict\": true\n// implies noImplicitAny, strictNullChecks, etc.\nfunction parse(n:"
    }
  ],
  "pitfalls": [
    "Disabling individual strict flags to greenwash errors — fix root cause."
  ],
  "interview": {
    "expectations": [
      "Explain strict & Compiler Flags with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "strictFunctionTypes changes handler assignability."
    ],
    "commonQuestions": [
      "What is strict & Compiler Flags?",
      "When would you choose strict & Compiler Flags over alternatives?",
      "What is the classic strict & Compiler Flags interview trap?"
    ],
    "traps": [
      "Disabling individual strict flags to greenwash errors — fix root cause."
    ],
    "misconceptions": [
      "Strict bundle catches the bugs that hurt production most."
    ],
    "strongSignals": [
      "Uses strict & Compiler Flags to remove invalid states, not just document them."
    ]
  }
})
