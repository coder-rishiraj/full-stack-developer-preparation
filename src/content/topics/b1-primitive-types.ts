import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Primitive Types",
  "whatIsIt": "JS has seven primitive types: string, number, bigint, boolean, undefined, symbol, and null (which typeof lies about). Primitives are not objects: they have no identity you can mutate. When you access a property on a primitive, the engine autoboxes a temporary wrapper. Everything else is an object (including arrays, functions, dates).",
  "whyExists": "A dynamic language still needs a small set of atomic values for numbers, text, and flags so not every value is a heap object.",
  "mentalModel": "Primitives are xeroxed copies when passed around. Objects are street addresses. The seven primitives are the copies; objects are the addresses.",
  "how": [
    "typeof null is \"object\" — memorize the bug.",
    "typeof function is \"function\"; arrays are \"object\".",
    "Use Number.isNaN, Array.isArray, and === null checks instead of typeof alone.",
    "bigint and number do not mix with + without explicit conversion."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Treating primitives as objects you can mutate: `(true).x = 1` is lost immediately (autobox throwaway).",
    "variant": "warning"
  },
  "example": "const types = [\n  typeof 'a', typeof 1, typeof 1n, typeof true,\n  typeof undefined, typeof Symbol('k'), typeof null,\n  typeof {}, typeof [], typeof (() => {}),\n];\nconsole.log(types);",
  "exampleCaption": "typeof across primitives and objects",
  "internals": [
    "Type(x) in the spec returns Null, Undefined, Boolean, String, Symbol, Number, BigInt, or Object.",
    "Primitives are compared by value; objects by reference (except with valueOf/toPrimitive in relational ops).",
    "ListFormat/engines may store small integers as immediates, still typeof \"number\"."
  ],
  "takeaways": [
    "typeof null is \"object\" — memorize the bug.",
    "typeof function is \"function\"; arrays are \"object\".",
    "Treating primitives as objects you can mutate: `(true).x = 1` is lost immediately (autobox throwaway).",
    "Type(x) in the spec returns Null, Undefined, Boolean, String, Symbol, Number, BigInt, or Object."
  ],
  "revision": [
    "Primitive Types: Primitives are xeroxed copies when passed around. Objects are street addresses. The seven primitives are the copies; objects are the addresses.",
    "typeof null is \"object\" — memorize the bug.",
    "typeof function is \"function\"; arrays are \"object\".",
    "Use Number.isNaN, Array.isArray, and === null checks instead of typeof alone.",
    "Trap: Treating primitives as objects you can mutate: `(true).x = 1` is lost immediately (autobox throwaway)."
  ],
  "flashcards": [
    [
      "Primitive Types",
      "JS has seven primitive types: string, number, bigint, boolean, undefined, symbol, and null (which typeof lies about)."
    ],
    [
      "Mental model",
      "Primitives are xeroxed copies when passed around. Objects are street addresses. The seven primitives are the copies; objects are the addresses."
    ],
    [
      "Common trap",
      "Treating primitives as objects you can mutate: `(true).x = 1` is lost immediately (autobox throwaway)."
    ],
    [
      "typeof null is \"object\" — memorize the bug.",
      "typeof function is \"function\"; arrays are \"object\"."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Primitive Types and where does a beginner first see it?",
      "answerHint": "JS has seven primitive types: string, number, bigint, boolean, undefined, symbol, and null (which typeof lies about). Primitives are not objects: they have no identity you can mutate. When you access a property on a primitive, the engine autoboxes a temporary wrapper. Everything else is an object (including arrays, functions, dates)."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Primitive Types works and name the main pitfall.",
      "answerHint": "typeof null is \"object\" — memorize the bug. typeof function is \"function\"; arrays are \"object\". Use Number.isNaN, Array.isArray, and === null checks instead of typeof alone. bigint and number do not mix with + without explicit conversion. Pitfall: Treating primitives as objects you can mutate: `(true).x = 1` is lost immediately (autobox throwaway)."
    },
    {
      "level": "advanced",
      "question": "How would you explain Primitive Types at an interview, including engine/spec details?",
      "answerHint": "Type(x) in the spec returns Null, Undefined, Boolean, String, Symbol, Number, BigInt, or Object. Primitives are compared by value; objects by reference (except with valueOf/toPrimitive in relational ops). ListFormat/engines may store small integers as immediates, still typeof \"number\"."
    }
  ],
  "pitfalls": [
    "Treating primitives as objects you can mutate: `(true).x = 1` is lost immediately (autobox throwaway).",
    "bigint and number do not mix with + without explicit conversion."
  ],
  "interview": {
    "expectations": [
      "Explain Primitive Types without mixing it up with a nearby B1.3 — Types & Values topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Type(x) in the spec returns Null, Undefined, Boolean, String, Symbol, Number, BigInt, or Object."
    ],
    "commonQuestions": [
      "What is Primitive Types?",
      "Why does JavaScript primitive types behave this way?",
      "What is the classic Primitive Types interview trap?"
    ],
    "traps": [
      "Treating primitives as objects you can mutate: `(true).x = 1` is lost immediately (autobox throwaway)."
    ],
    "misconceptions": [
      "A dynamic language still needs a small set of atomic values for numbers, text, and flags so not every value is a heap object."
    ],
    "strongSignals": [
      "Separates Primitive Types from lookalike APIs and can draw the mental model."
    ]
  }
})
