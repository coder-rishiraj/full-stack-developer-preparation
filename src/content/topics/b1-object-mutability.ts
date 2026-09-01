import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Object Mutability",
  "whatIsIt": "Objects are mutable unless you freeze/seal them or use immutable patterns. Adding, deleting, or changing properties is visible to every reference. Nested objects need nested copies for a true snapshot. Arrays are objects: `push` mutates the same array.",
  "whyExists": "UI state, DOM nodes, and caches need in-place updates for performance and identity (React keys, Maps). Mutability is the default because cloning everything would be expensive.",
  "mentalModel": "One house, many keys. Anyone with a key can move the furniture. Freeze is taping the drawers shut (shallow).",
  "how": [
    "Mutate when you own the object and identity should stay.",
    "Copy-on-write (spread) when you must not surprise other holders.",
    "Object.freeze is shallow — nested objects still mutate.",
    "Track aliasing: who else stored this pointer?"
  ],
  "callout": {
    "title": "Watch for",
    "text": "Spreading `{...obj}` then mutating `obj.nested` still mutates both — shallow copy.",
    "variant": "warning"
  },
  "example": "const state = { user: { name: 'Ada' }, tags: ['js'] };\nconst alias = state;\nalias.tags.push('html');\nconst next = { ...state, tags: [...state.tags, 'css'] };\nconsole.log(state.tags, next.tags, state.user === next.user);",
  "exampleCaption": "In-place mutate vs shallow copy",
  "internals": [
    "[[Set]] / [[DefineOwnProperty]] mutate the same ordinary object identity.",
    "Extensible flag + freeze change whether new properties can appear.",
    "React/Redux immutability is a convention on top of mutable objects, not a language mode."
  ],
  "takeaways": [
    "Mutate when you own the object and identity should stay.",
    "Copy-on-write (spread) when you must not surprise other holders.",
    "Spreading `{...obj}` then mutating `obj.nested` still mutates both — shallow copy.",
    "[[Set]] / [[DefineOwnProperty]] mutate the same ordinary object identity."
  ],
  "revision": [
    "Object Mutability: One house, many keys. Anyone with a key can move the furniture. Freeze is taping the drawers shut (shallow).",
    "Mutate when you own the object and identity should stay.",
    "Copy-on-write (spread) when you must not surprise other holders.",
    "Object.freeze is shallow — nested objects still mutate.",
    "Trap: Spreading `{...obj}` then mutating `obj.nested` still mutates both — shallow copy."
  ],
  "flashcards": [
    [
      "Object Mutability",
      "Objects are mutable unless you freeze/seal them or use immutable patterns."
    ],
    [
      "Mental model",
      "One house, many keys. Anyone with a key can move the furniture. Freeze is taping the drawers shut (shallow)."
    ],
    [
      "Common trap",
      "Spreading `{...obj}` then mutating `obj.nested` still mutates both — shallow copy."
    ],
    [
      "Mutate when you own the object and identity should stay.",
      "Copy-on-write (spread) when you must not surprise other holders."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Object Mutability and where does a beginner first see it?",
      "answerHint": "Objects are mutable unless you freeze/seal them or use immutable patterns. Adding, deleting, or changing properties is visible to every reference. Nested objects need nested copies for a true snapshot. Arrays are objects: `push` mutates the same array."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Object Mutability works and name the main pitfall.",
      "answerHint": "Mutate when you own the object and identity should stay. Copy-on-write (spread) when you must not surprise other holders. Object.freeze is shallow — nested objects still mutate. Track aliasing: who else stored this pointer? Pitfall: Spreading `{...obj}` then mutating `obj.nested` still mutates both — shallow copy."
    },
    {
      "level": "advanced",
      "question": "How would you explain Object Mutability at an interview, including engine/spec details?",
      "answerHint": "[[Set]] / [[DefineOwnProperty]] mutate the same ordinary object identity. Extensible flag + freeze change whether new properties can appear. React/Redux immutability is a convention on top of mutable objects, not a language mode."
    }
  ],
  "pitfalls": [
    "Spreading `{...obj}` then mutating `obj.nested` still mutates both — shallow copy.",
    "Track aliasing: who else stored this pointer?"
  ],
  "interview": {
    "expectations": [
      "Explain Object Mutability without mixing it up with a nearby B1.3 — Types & Values topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "[[Set]] / [[DefineOwnProperty]] mutate the same ordinary object identity."
    ],
    "commonQuestions": [
      "What is Object Mutability?",
      "Why does JavaScript object mutability behave this way?",
      "What is the classic Object Mutability interview trap?"
    ],
    "traps": [
      "Spreading `{...obj}` then mutating `obj.nested` still mutates both — shallow copy."
    ],
    "misconceptions": [
      "UI state, DOM nodes, and caches need in-place updates for performance and identity (React keys, Maps). Mutability is the default because cloning everything would be expensive."
    ],
    "strongSignals": [
      "Separates Object Mutability from lookalike APIs and can draw the mental model."
    ]
  }
})
