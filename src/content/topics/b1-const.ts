import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "const",
  "whatIsIt": "`const` is a block-scoped binding that must be initialized and cannot be reassigned. It is not immutability of the value: objects and arrays held by const can still mutate. Prefer const for the majority of names so readers know the pointer never moves.",
  "whyExists": "Most names should not be rebound. const documents that intent and catches accidental `=`.",
  "mentalModel": "A locked pointer to a value. You can rearrange furniture in the house; you cannot point the sign at a different house.",
  "how": [
    "Default to const; switch to let only when reassignment is required.",
    "Freeze objects separately (`Object.freeze`) if you need shallow immutability.",
    "const in for-of/for-in is fine: each iteration is a new binding.",
    "Exporting const still allows mutating object properties unless frozen."
  ],
  "callout": {
    "title": "Watch for",
    "text": "`const x;` is a SyntaxError — missing initializer — people confuse it with `let x`.",
    "variant": "warning"
  },
  "example": "const PI = 3.14159;\nconst user = { role: 'guest' };\nuser.role = 'admin';\nconst nums = [1, 2];\nnums.push(3);\ntry { nums = []; } catch (e) { console.log(e.name); }\nconsole.log(PI, user.role, nums);",
  "exampleCaption": "const binding vs mutable object/array",
  "internals": [
    "ImmutableBinding in the environment record; SetMutableBinding throws.",
    "TDZ applies the same as let.",
    "for (const x of iterable) rebinds a fresh const each iteration, which is allowed."
  ],
  "takeaways": [
    "Default to const; switch to let only when reassignment is required.",
    "Freeze objects separately (`Object.freeze`) if you need shallow immutability.",
    "`const x;` is a SyntaxError — missing initializer — people confuse it with `let x`.",
    "ImmutableBinding in the environment record; SetMutableBinding throws."
  ],
  "revision": [
    "const: A locked pointer to a value. You can rearrange furniture in the house; you cannot point the sign at a different house.",
    "Default to const; switch to let only when reassignment is required.",
    "Freeze objects separately (`Object.freeze`) if you need shallow immutability.",
    "const in for-of/for-in is fine: each iteration is a new binding.",
    "Trap: `const x;` is a SyntaxError — missing initializer — people confuse it with `let x`."
  ],
  "flashcards": [
    [
      "const",
      "`const` is a block-scoped binding that must be initialized and cannot be reassigned."
    ],
    [
      "Mental model",
      "A locked pointer to a value. You can rearrange furniture in the house; you cannot point the sign at a different house."
    ],
    [
      "Common trap",
      "`const x;` is a SyntaxError — missing initializer — people confuse it with `let x`."
    ],
    [
      "Default to const; switch to let only when reassignment is required.",
      "Freeze objects separately (`Object.freeze`) if you need shallow immutability."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is const and where does a beginner first see it?",
      "answerHint": "`const` is a block-scoped binding that must be initialized and cannot be reassigned. It is not immutability of the value: objects and arrays held by const can still mutate. Prefer const for the majority of names so readers know the pointer never moves."
    },
    {
      "level": "intermediate",
      "question": "Walk through how const works and name the main pitfall.",
      "answerHint": "Default to const; switch to let only when reassignment is required. Freeze objects separately (`Object.freeze`) if you need shallow immutability. const in for-of/for-in is fine: each iteration is a new binding. Exporting const still allows mutating object properties unless frozen. Pitfall: `const x;` is a SyntaxError — missing initializer — people confuse it with `let x`."
    },
    {
      "level": "advanced",
      "question": "How would you explain const at an interview, including engine/spec details?",
      "answerHint": "ImmutableBinding in the environment record; SetMutableBinding throws. TDZ applies the same as let. for (const x of iterable) rebinds a fresh const each iteration, which is allowed."
    }
  ],
  "pitfalls": [
    "`const x;` is a SyntaxError — missing initializer — people confuse it with `let x`.",
    "Exporting const still allows mutating object properties unless frozen."
  ],
  "interview": {
    "expectations": [
      "Explain const without mixing it up with a nearby B1.2 — Variables & Declarations topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "ImmutableBinding in the environment record; SetMutableBinding throws."
    ],
    "commonQuestions": [
      "What is const?",
      "Why does JavaScript const behave this way?",
      "What is the classic const interview trap?"
    ],
    "traps": [
      "`const x;` is a SyntaxError — missing initializer — people confuse it with `let x`."
    ],
    "misconceptions": [
      "Most names should not be rebound. const documents that intent and catches accidental `=`."
    ],
    "strongSignals": [
      "Separates const from lookalike APIs and can draw the mental model."
    ]
  }
})
