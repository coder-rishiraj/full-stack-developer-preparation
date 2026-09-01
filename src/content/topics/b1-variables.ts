import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Variables",
  "whatIsIt": "A variable is a named binding that holds a value. In JS you declare with `var`, `let`, or `const`, which differ in scope, hoisting, and reassignment. Until you understand bindings vs values, you will confuse “changing the object” with “changing which object the name points at.”",
  "whyExists": "Programs need memory cells with names so later statements can reuse computed results.",
  "mentalModel": "A sticky note (the name) pointing at a box (the value). Reassignment moves the sticky note; mutating an object changes what’s inside the box.",
  "how": [
    "Declare before use (`let`/`const`); `var` is function-scoped and hoisted as undefined.",
    "Choose `const` by default; `let` when the binding must change; avoid `var`.",
    "The binding is not the object — two names can point at the same object.",
    "TDZ: accessing let/const before the declaration line throws."
  ],
  "callout": {
    "title": "Watch for",
    "text": "`const` does not freeze objects. `const user = {}` still allows `user.x = 1`.",
    "variant": "warning"
  },
  "example": "let count = 0;\nconst user = { name: 'Ada' };\ncount = 1;           // rebind\nuser.name = 'Grace'; // mutate\nconst also = user;\nalso.name = 'Alan';\nconsole.log(count, user.name);",
  "exampleCaption": "Rebind a let; mutate a const object",
  "internals": [
    "Environment records map names to values (or uninitialized for TDZ).",
    "Assignment is SetMutableBinding; const bindings have a strict immutable flag.",
    "var bindings are created as undefined during instantiation; let/const as uninitialized."
  ],
  "takeaways": [
    "Declare before use (`let`/`const`); `var` is function-scoped and hoisted as undefined.",
    "Choose `const` by default; `let` when the binding must change; avoid `var`.",
    "`const` does not freeze objects. `const user = {}` still allows `user.x = 1`.",
    "Environment records map names to values (or uninitialized for TDZ)."
  ],
  "revision": [
    "Variables: A sticky note (the name) pointing at a box (the value). Reassignment moves the sticky note; mutating an object changes what’s inside the box.",
    "Declare before use (`let`/`const`); `var` is function-scoped and hoisted as undefined.",
    "Choose `const` by default; `let` when the binding must change; avoid `var`.",
    "The binding is not the object — two names can point at the same object.",
    "Trap: `const` does not freeze objects. `const user = {}` still allows `user.x = 1`."
  ],
  "flashcards": [
    [
      "Variables",
      "A variable is a named binding that holds a value."
    ],
    [
      "Mental model",
      "A sticky note (the name) pointing at a box (the value). Reassignment moves the sticky note; mutating an object changes what’s inside the box."
    ],
    [
      "Common trap",
      "`const` does not freeze objects. `const user = {}` still allows `user.x = 1`."
    ],
    [
      "Declare before use (`let`/`const`); `var` is function-scoped and hoisted as unde",
      "Choose `const` by default; `let` when the binding must change; avoid `var`."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Variables and where does a beginner first see it?",
      "answerHint": "A variable is a named binding that holds a value. In JS you declare with `var`, `let`, or `const`, which differ in scope, hoisting, and reassignment. Until you understand bindings vs values, you will confuse “changing the object” with “changing which object the name points at.”"
    },
    {
      "level": "intermediate",
      "question": "Walk through how Variables works and name the main pitfall.",
      "answerHint": "Declare before use (`let`/`const`); `var` is function-scoped and hoisted as undefined. Choose `const` by default; `let` when the binding must change; avoid `var`. The binding is not the object — two names can point at the same object. TDZ: accessing let/const before the declaration line throws. Pitfall: `const` does not freeze objects. `const user = {}` still allows `user.x = 1`."
    },
    {
      "level": "advanced",
      "question": "How would you explain Variables at an interview, including engine/spec details?",
      "answerHint": "Environment records map names to values (or uninitialized for TDZ). Assignment is SetMutableBinding; const bindings have a strict immutable flag. var bindings are created as undefined during instantiation; let/const as uninitialized."
    }
  ],
  "pitfalls": [
    "`const` does not freeze objects. `const user = {}` still allows `user.x = 1`.",
    "TDZ: accessing let/const before the declaration line throws."
  ],
  "interview": {
    "expectations": [
      "Explain Variables without mixing it up with a nearby B1.2 — Variables & Declarations topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Environment records map names to values (or uninitialized for TDZ)."
    ],
    "commonQuestions": [
      "What is Variables?",
      "Why does JavaScript variables behave this way?",
      "What is the classic Variables interview trap?"
    ],
    "traps": [
      "`const` does not freeze objects. `const user = {}` still allows `user.x = 1`."
    ],
    "misconceptions": [
      "Programs need memory cells with names so later statements can reuse computed results."
    ],
    "strongSignals": [
      "Separates Variables from lookalike APIs and can draw the mental model."
    ]
  }
})
