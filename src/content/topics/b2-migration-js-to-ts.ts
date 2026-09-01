import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Migrating JavaScript → TypeScript",
  "whatIsIt": "Migrate JS→TS incrementally: allowJs, checkJs, rename .js→.ts file by file, add types at boundaries, enable strict flags gradually. Avoid big-bang rewrite. Use @ts-check in JS for early wins.",
  "whyExists": "Most codebases cannot pause features for full rewrite — gradual path works.",
  "mentalModel": "Renovate room by room while house stays open.",
  "how": [
    "allowJs: true, checkJs: true in tsconfig.",
    "Start with utils and API clients — high leverage.",
    "Type inferred from JSDoc then convert to .ts.",
    "Enable strictNullChecks after baseline clean.",
    "Track any count trending down."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Big bang enable strict on day one — thousands of errors, team stops.",
    "variant": "warning"
  },
  "example": "// file-by-file: utils/format.js → format.ts\nexport function formatCurrency(n: number, locale = 'en-US'): string {\n  return new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD' }).format(n);\n}\nconsole.log(formatCurrency('demo'));\n// Strict mode catches misuse at compile time\n// Annotations are erased — zero runtime overhead\n// Enable \"strict\": true in tsconfig.json",
  "exampleCaption": "Single module migrated with typed signature",
  "internals": [
    "JS files participate in type graph with allowJs.",
    "declare module for JS assets during migration.",
    "Codemods (ts-migrate) assist large repos."
  ],
  "takeaways": [
    "allowJs: true, checkJs: true in tsconfig.",
    "Start with utils and API clients — high leverage.",
    "Big bang enable strict on day one — thousands of errors, team stops.",
    "JS files participate in type graph with allowJs."
  ],
  "revision": [
    "Migrating JavaScript → TypeScript: Renovate room by room while house stays open.",
    "allowJs: true, checkJs: true in tsconfig.",
    "Start with utils and API clients — high leverage.",
    "Type inferred from JSDoc then convert to .ts.",
    "Trap: Big bang enable strict on day one — thousands of errors, team stops."
  ],
  "flashcards": [
    [
      "Migrating JavaScript → TypeScript",
      "Migrate JS→TS incrementally: allowJs, checkJs, rename .js→.ts file by file, add types at boundaries, enable strict flags gradually."
    ],
    [
      "Mental model",
      "Renovate room by room while house stays open."
    ],
    [
      "Common trap",
      "Big bang enable strict on day one — thousands of errors, team stops."
    ],
    [
      "allowJs: true, checkJs: true in tsconfig.",
      "Start with utils and API clients — high leverage."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Migrating JavaScript → TypeScript in TypeScript and when do you use it?",
      "answerHint": "Migrate JS→TS incrementally: allowJs, checkJs, rename .js→.ts file by file, add types at boundaries, enable strict flags gradually. Avoid big-bang rewrite. Use @ts-check in JS for early wins."
    },
    {
      "level": "intermediate",
      "question": "Explain Migrating JavaScript → TypeScript with a code example and one pitfall.",
      "answerHint": "allowJs: true, checkJs: true in tsconfig. Start with utils and API clients — high leverage. Type inferred from JSDoc then convert to .ts. Enable strictNullChecks after baseline clean. Track any count trending down. Pitfall: Big bang enable strict on day one — thousands of errors, team stops."
    },
    {
      "level": "advanced",
      "question": "How would you explain Migrating JavaScript → TypeScript in a senior frontend interview?",
      "answerHint": "JS files participate in type graph with allowJs. declare module for JS assets during migration. Codemods (ts-migrate) assist large repos. // file-by-file: utils/format.js → format.ts\nexport function formatCurrency(n: number, locale = 'en-US'): string {\n  ret"
    }
  ],
  "pitfalls": [
    "Big bang enable strict on day one — thousands of errors, team stops."
  ],
  "interview": {
    "expectations": [
      "Explain Migrating JavaScript → TypeScript with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "JS files participate in type graph with allowJs."
    ],
    "commonQuestions": [
      "What is Migrating JavaScript → TypeScript?",
      "When would you choose Migrating JavaScript → TypeScript over alternatives?",
      "What is the classic Migrating JavaScript → TypeScript interview trap?"
    ],
    "traps": [
      "Big bang enable strict on day one — thousands of errors, team stops."
    ],
    "misconceptions": [
      "Most codebases cannot pause features for full rewrite — gradual path works."
    ],
    "strongSignals": [
      "Uses Migrating JavaScript → TypeScript to remove invalid states, not just document them."
    ]
  }
})
