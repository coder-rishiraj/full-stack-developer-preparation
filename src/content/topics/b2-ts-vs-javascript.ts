import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "TypeScript vs JavaScript",
  "whatIsIt": "JavaScript is the runtime language defined by ECMAScript. TypeScript is JavaScript plus a static type system checked before execution. Every valid JS program is valid TS (modulo strict mode differences); TS adds syntax for types, interfaces, enums, and compile-time-only constructs. Browsers and Node never execute TypeScript directly.",
  "whyExists": "Teams wanted stronger tooling — autocomplete, rename, dead-code detection — without inventing a new language. TS piggybacks on JS so libraries and hiring stay portable.",
  "mentalModel": "JavaScript is the road; TypeScript is the lane markings and signs drawn on the map before you drive. The car still runs on asphalt (JS).",
  "how": [
    "JS runs everywhere TS targets; TS is a dev-time layer.",
    "TS can compile to ES5, ES2020, etc. — same output choices as Babel.",
    "Use .js for untyped files; .ts/.tsx when you want the checker.",
    "Runtime errors TS prevents: calling undefined as function, wrong property names.",
    "Runtime errors TS cannot prevent: network failures, bad user input without validation."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: \"TS is slower at runtime.\" Compiled output is JS — performance is identical if emit settings match.",
    "variant": "warning"
  },
  "example": "// JavaScript — no compile-time name check\nfunction jsUser(u) { return u.nmae; }\n// TypeScript — typo caught at compile time\ninterface User { name: string }\nfunction tsUser(u: User) { return u.name; }\nconsole.log(\"const __item: User = {} as User\");\nconsole.log(tsUser('demo'));\n// TypeScript validates this file before emit",
  "exampleCaption": "Same runtime target; TS catches u.nmae before ship",
  "internals": [
    "TS uses ECMAScript module syntax; module resolution is TS-specific.",
    "JS dynamic features (eval, with) weaken TS guarantees.",
    "Downlevel emit may transform async/await, classes, and decorators."
  ],
  "takeaways": [
    "JS runs everywhere TS targets; TS is a dev-time layer.",
    "TS can compile to ES5, ES2020, etc. — same output choices as Babel.",
    "Interview trap: \"TS is slower at runtime.\" Compiled output is JS — performance is identical if emit settings match.",
    "TS uses ECMAScript module syntax; module resolution is TS-specific."
  ],
  "revision": [
    "TypeScript vs JavaScript: JavaScript is the road; TypeScript is the lane markings and signs drawn on the map before you drive. The car still runs on asphalt (JS).",
    "JS runs everywhere TS targets; TS is a dev-time layer.",
    "TS can compile to ES5, ES2020, etc. — same output choices as Babel.",
    "Use .js for untyped files; .ts/.tsx when you want the checker.",
    "Trap: Interview trap: \"TS is slower at runtime.\" Compiled output is JS — performance is identical if emit settings match."
  ],
  "flashcards": [
    [
      "TypeScript vs JavaScript",
      "JavaScript is the runtime language defined by ECMAScript."
    ],
    [
      "Mental model",
      "JavaScript is the road; TypeScript is the lane markings and signs drawn on the map before you drive. The car still runs on asphalt (JS)."
    ],
    [
      "Common trap",
      "Interview trap: \"TS is slower at runtime.\" Compiled output is JS — performance is identical if emit settings match."
    ],
    [
      "JS runs everywhere TS targets; TS is a dev-time layer.",
      "TS can compile to ES5, ES2020, etc. — same output choices as Babel."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is TypeScript vs JavaScript in TypeScript and when do you use it?",
      "answerHint": "JavaScript is the runtime language defined by ECMAScript. TypeScript is JavaScript plus a static type system checked before execution. Every valid JS program is valid TS (modulo strict mode differences); TS adds syntax for types, interfaces, enums, and compile-time-only constructs. Browsers and Node never execute TypeScript directly."
    },
    {
      "level": "intermediate",
      "question": "Explain TypeScript vs JavaScript with a code example and one pitfall.",
      "answerHint": "JS runs everywhere TS targets; TS is a dev-time layer. TS can compile to ES5, ES2020, etc. — same output choices as Babel. Use .js for untyped files; .ts/.tsx when you want the checker. Runtime errors TS prevents: calling undefined as function, wrong property names. Runtime errors TS cannot prevent: network failures, bad user input without validation. Pitfall: Interview trap: \"TS is slower at runtime.\" Compiled output is JS — performance is identical if emit settings match."
    },
    {
      "level": "advanced",
      "question": "How would you explain TypeScript vs JavaScript in a senior frontend interview?",
      "answerHint": "TS uses ECMAScript module syntax; module resolution is TS-specific. JS dynamic features (eval, with) weaken TS guarantees. Downlevel emit may transform async/await, classes, and decorators. // JavaScript — no compile-time name check\nfunction jsUser(u) { return u.nmae; }\n// TypeScript — typo caught at compile "
    }
  ],
  "pitfalls": [
    "Interview trap: \"TS is slower at runtime.\" Compiled output is JS — performance is identical if emit settings match."
  ],
  "interview": {
    "expectations": [
      "Explain TypeScript vs JavaScript with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "TS uses ECMAScript module syntax; module resolution is TS-specific."
    ],
    "commonQuestions": [
      "What is TypeScript vs JavaScript?",
      "When would you choose TypeScript vs JavaScript over alternatives?",
      "What is the classic TypeScript vs JavaScript interview trap?"
    ],
    "traps": [
      "Interview trap: \"TS is slower at runtime.\" Compiled output is JS — performance is identical if emit settings match."
    ],
    "misconceptions": [
      "Teams wanted stronger tooling — autocomplete, rename, dead-code detection — without inventing a new language. TS piggybacks on JS so libraries and hiring stay portable."
    ],
    "strongSignals": [
      "Uses TypeScript vs JavaScript to remove invalid states, not just document them."
    ]
  }
})
