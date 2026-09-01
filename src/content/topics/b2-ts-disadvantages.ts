import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "TypeScript Trade-offs",
  "whatIsIt": "TypeScript adds build complexity, learning curve, and occasional friction with rapid prototyping or dynamic JSON. Complex generic types can become hard to read; wrong types can lie if you overuse assertions. Third-party JS without types needs @types or manual shims. Compile step adds latency unless you use transpile-only tools.",
  "whyExists": "Honest engineering weighs costs. TS is not free — teams should know when strict typing slows early exploration or fights highly dynamic domains.",
  "mentalModel": "A seatbelt adds buckle time every trip. Worth it on highways; overkill for moving a chair across the room.",
  "how": [
    "Use JSDoc + checkJs for light typing without full migration.",
    "Avoid premature abstraction in generics — start concrete.",
    "Use unknown + narrowing instead of any to keep safety.",
    "Transpile-only (esbuild, swc) for fast dev; tsc --noEmit for CI checks.",
    "Budget time for typing external APIs and edge cases."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Using any everywhere to \"move fast\" — you pay double later fixing untyped debt.",
    "variant": "warning"
  },
  "example": "// Fighting the checker — smell\nconst row = JSON.parse(raw) as User; // assertion, no runtime proof\n// Better — validate then narrow\nfunction parseUser(raw: unknown): User {\n  if (typeof raw !== 'object' || raw === null || !('name' in raw)) throw new Error('bad');\n  return { name: String((raw as { name: unknown }).name) };\n}\nconst sample: unknown = 'text';\nconsole.log(parseUser('demo'));",
  "exampleCaption": "Assertions skip checking; validation earns the type",
  "internals": [
    "Type complexity is measured in instantiations — deep conditional chains can slow tsc.",
    "Emit helpers (__extends, __awaiter) add bytes unless targeting modern ES.",
    "Some JS patterns (mixins, monkey-patching) need extra typing ceremony."
  ],
  "takeaways": [
    "Use JSDoc + checkJs for light typing without full migration.",
    "Avoid premature abstraction in generics — start concrete.",
    "Using any everywhere to \"move fast\" — you pay double later fixing untyped debt.",
    "Type complexity is measured in instantiations — deep conditional chains can slow tsc."
  ],
  "revision": [
    "TypeScript Trade-offs: A seatbelt adds buckle time every trip. Worth it on highways; overkill for moving a chair across the room.",
    "Use JSDoc + checkJs for light typing without full migration.",
    "Avoid premature abstraction in generics — start concrete.",
    "Use unknown + narrowing instead of any to keep safety.",
    "Trap: Using any everywhere to \"move fast\" — you pay double later fixing untyped debt."
  ],
  "flashcards": [
    [
      "TypeScript Trade-offs",
      "TypeScript adds build complexity, learning curve, and occasional friction with rapid prototyping or dynamic JSON."
    ],
    [
      "Mental model",
      "A seatbelt adds buckle time every trip. Worth it on highways; overkill for moving a chair across the room."
    ],
    [
      "Common trap",
      "Using any everywhere to \"move fast\" — you pay double later fixing untyped debt."
    ],
    [
      "Use JSDoc + checkJs for light typing without full migration.",
      "Avoid premature abstraction in generics — start concrete."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is TypeScript Trade-offs in TypeScript and when do you use it?",
      "answerHint": "TypeScript adds build complexity, learning curve, and occasional friction with rapid prototyping or dynamic JSON. Complex generic types can become hard to read; wrong types can lie if you overuse assertions. Third-party JS without types needs @types or manual shims. Compile step adds latency unless you use transpile-only tools."
    },
    {
      "level": "intermediate",
      "question": "Explain TypeScript Trade-offs with a code example and one pitfall.",
      "answerHint": "Use JSDoc + checkJs for light typing without full migration. Avoid premature abstraction in generics — start concrete. Use unknown + narrowing instead of any to keep safety. Transpile-only (esbuild, swc) for fast dev; tsc --noEmit for CI checks. Budget time for typing external APIs and edge cases. Pitfall: Using any everywhere to \"move fast\" — you pay double later fixing untyped debt."
    },
    {
      "level": "advanced",
      "question": "How would you explain TypeScript Trade-offs in a senior frontend interview?",
      "answerHint": "Type complexity is measured in instantiations — deep conditional chains can slow tsc. Emit helpers (__extends, __awaiter) add bytes unless targeting modern ES. Some JS patterns (mixins, monkey-patching) need extra typing ceremony. // Fighting the checker — smell\nconst row = JSON.parse(raw) as User; // assertion, no runtime proof\n// Better — validate"
    }
  ],
  "pitfalls": [
    "Using any everywhere to \"move fast\" — you pay double later fixing untyped debt."
  ],
  "interview": {
    "expectations": [
      "Explain TypeScript Trade-offs with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "Type complexity is measured in instantiations — deep conditional chains can slow tsc."
    ],
    "commonQuestions": [
      "What is TypeScript Trade-offs?",
      "When would you choose TypeScript Trade-offs over alternatives?",
      "What is the classic TypeScript Trade-offs interview trap?"
    ],
    "traps": [
      "Using any everywhere to \"move fast\" — you pay double later fixing untyped debt."
    ],
    "misconceptions": [
      "Honest engineering weighs costs. TS is not free — teams should know when strict typing slows early exploration or fights highly dynamic domains."
    ],
    "strongSignals": [
      "Uses TypeScript Trade-offs to remove invalid states, not just document them."
    ]
  }
})
