import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Explicit Conversion",
  "whatIsIt": "Explicit conversion is when you call String, Number, Boolean, parseInt, BigInt, or unary plus on purpose. You control the moment and the algorithm, unlike implicit coercion in == or +. Explicit still uses the same ToString/ToNumber/ToBoolean abstract ops — it is not a different kind of math.",
  "whyExists": "Dynamic types mean values arrive as the wrong shape (form strings, JSON). Converting at the boundary keeps the rest of the program on one type.",
  "mentalModel": "A customs checkpoint: stamp the passport (type) before the value enters your logic, instead of hoping operators guess.",
  "how": [
    "Convert at I/O boundaries (query params, JSON, DOM input.value).",
    "Prefer Number() / BigInt() over parseInt when the whole string should be a number.",
    "Boolean() for real booleans; !! is the same ToBoolean.",
    "Never mix implicit == with explicit conversion in the same check without a reason."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Number(null) is 0 and Number('') is 0 — empty is not NaN, which breaks ‘did the user type a number?’ checks.",
    "variant": "warning"
  },
  "example": "const raw = '42';\nconsole.log(String(10), Number(raw), Boolean(raw));\nconsole.log(Number(''), Number('  '), Number('42px'));\nconsole.log(parseInt('42px', 10), parseFloat('3.14px'));\nconsole.log(Boolean('false'), Boolean(0));\n",
  "exampleCaption": "String/Number/Boolean vs parseInt on messy input",
  "internals": [
    "String(x) is ToString; Number(x) is ToNumber; Boolean(x) is ToBoolean.",
    "parseInt is not ToNumber: it stops at the first non-digit.",
    "valueOf/toString of objects run during ToPrimitive inside these ops."
  ],
  "takeaways": [
    "Convert at I/O boundaries (query params, JSON, DOM input.value).",
    "Prefer Number() / BigInt() over parseInt when the whole string should be a number.",
    "Number(null) is 0 and Number('') is 0 — empty is not NaN, which breaks ‘did the user type a number?’ checks.",
    "String(x) is ToString; Number(x) is ToNumber; Boolean(x) is ToBoolean."
  ],
  "revision": [
    "Explicit Conversion: A customs checkpoint: stamp the passport (type) before the value enters your logic, instead of hoping operators guess.",
    "Convert at I/O boundaries (query params, JSON, DOM input.value).",
    "Prefer Number() / BigInt() over parseInt when the whole string should be a number.",
    "Boolean() for real booleans; !! is the same ToBoolean.",
    "Trap: Number(null) is 0 and Number('') is 0 — empty is not NaN, which breaks ‘did the user type a number?’ checks."
  ],
  "flashcards": [
    [
      "Explicit Conversion",
      "Explicit conversion is when you call String, Number, Boolean, parseInt, BigInt, or unary plus on purpose."
    ],
    [
      "Mental model",
      "A customs checkpoint: stamp the passport (type) before the value enters your logic, instead of hoping operators guess."
    ],
    [
      "Common trap",
      "Number(null) is 0 and Number('') is 0 — empty is not NaN, which breaks ‘did the user type a number?’ checks."
    ],
    [
      "Convert at I/O boundaries (query params, JSON, DOM input.value).",
      "Prefer Number() / BigInt() over parseInt when the whole string should be a number."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Explicit Conversion and where does a beginner first see it?",
      "answerHint": "Explicit conversion is when you call String, Number, Boolean, parseInt, BigInt, or unary plus on purpose. You control the moment and the algorithm, unlike implicit coercion in == or +. Explicit still uses the same ToString/ToNumber/ToBoolean abstract ops — it is not a different kind of math."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Explicit Conversion works and name the main pitfall.",
      "answerHint": "Convert at I/O boundaries (query params, JSON, DOM input.value). Prefer Number() / BigInt() over parseInt when the whole string should be a number. Boolean() for real booleans; !! is the same ToBoolean. Never mix implicit == with explicit conversion in the same check without a reason. Pitfall: Number(null) is 0 and Number('') is 0 — empty is not NaN, which breaks ‘did the user type a number?’ checks."
    },
    {
      "level": "advanced",
      "question": "How would you explain Explicit Conversion at an interview, including engine/spec details?",
      "answerHint": "String(x) is ToString; Number(x) is ToNumber; Boolean(x) is ToBoolean. parseInt is not ToNumber: it stops at the first non-digit. valueOf/toString of objects run during ToPrimitive inside these ops."
    }
  ],
  "pitfalls": [
    "Number(null) is 0 and Number('') is 0 — empty is not NaN, which breaks ‘did the user type a number?’ checks.",
    "Never mix implicit == with explicit conversion in the same check without a reason."
  ],
  "interview": {
    "expectations": [
      "Explain Explicit Conversion without mixing it up with a nearby B1.4 — Type Conversion & Coercion topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "String(x) is ToString; Number(x) is ToNumber; Boolean(x) is ToBoolean."
    ],
    "commonQuestions": [
      "What is Explicit Conversion?",
      "Why does JavaScript explicit conversion behave this way?",
      "What is the classic Explicit Conversion interview trap?"
    ],
    "traps": [
      "Number(null) is 0 and Number('') is 0 — empty is not NaN, which breaks ‘did the user type a number?’ checks."
    ],
    "misconceptions": [
      "Dynamic types mean values arrive as the wrong shape (form strings, JSON). Converting at the boundary keeps the rest of the program on one type."
    ],
    "strongSignals": [
      "Separates Explicit Conversion from lookalike APIs and can draw the mental model."
    ]
  }
})
