import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Unary Operators",
  "whatIsIt": "Unary operators take one operand: +, -, !, ~, typeof, void, delete, and prefix/postfix ++/--. Unary minus ToNumbers then negates (including -0). ~ is bitwise not after ToInt32. void expr evaluates and returns undefined. delete removes a property and returns a boolean.",
  "whyExists": "C-like languages expose these as compact expression forms. JS kept them, then added typeof/void/delete for a dynamic object model.",
  "mentalModel": "A single-argument machine: coerce, then apply one transformation. Know which coerce (ToNumber vs ToBoolean vs ToInt32).",
  "how": [
    "typeof before using a possibly-missing global.",
    "void 0 as a safe undefined.",
    "Prefer obj.prop = undefined vs delete unless you need the key gone.",
    "Do not use ~ as a clever indexOf check (`~arr.indexOf` is unreadable)."
  ],
  "callout": {
    "title": "Watch for",
    "text": "delete arrayIndex leaves a hole (sparse), it does not reindex like splice.",
    "variant": "warning"
  },
  "example": "console.log(+'3', -'3', !0, ~0);\nconsole.log(typeof null, void (1 + 2));\nconst o = { a: 1, b: 2 };\nconsole.log(delete o.a, o);\nconsole.log(void 0 === undefined);\n",
  "exampleCaption": "Unary plus/minus/not/tilde/typeof/void/delete",
  "internals": [
    "typeof does not call GetValue on an unresolvable reference.",
    "delete on an unconfigurable property returns false or throws in strict mode.",
    "~ uses ToInt32; ~n === -(n+1) for 32-bit integers."
  ],
  "takeaways": [
    "typeof before using a possibly-missing global.",
    "void 0 as a safe undefined.",
    "delete arrayIndex leaves a hole (sparse), it does not reindex like splice.",
    "typeof does not call GetValue on an unresolvable reference."
  ],
  "revision": [
    "Unary Operators: A single-argument machine: coerce, then apply one transformation. Know which coerce (ToNumber vs ToBoolean vs ToInt32).",
    "typeof before using a possibly-missing global.",
    "void 0 as a safe undefined.",
    "Prefer obj.prop = undefined vs delete unless you need the key gone.",
    "Trap: delete arrayIndex leaves a hole (sparse), it does not reindex like splice."
  ],
  "flashcards": [
    [
      "Unary Operators",
      "Unary operators take one operand: +, -, !, ~, typeof, void, delete, and prefix/postfix ++/--."
    ],
    [
      "Mental model",
      "A single-argument machine: coerce, then apply one transformation. Know which coerce (ToNumber vs ToBoolean vs ToInt32)."
    ],
    [
      "Common trap",
      "delete arrayIndex leaves a hole (sparse), it does not reindex like splice."
    ],
    [
      "typeof before using a possibly-missing global.",
      "void 0 as a safe undefined."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Unary Operators and where does a beginner first see it?",
      "answerHint": "Unary operators take one operand: +, -, !, ~, typeof, void, delete, and prefix/postfix ++/--. Unary minus ToNumbers then negates (including -0). ~ is bitwise not after ToInt32. void expr evaluates and returns undefined. delete removes a property and returns a boolean."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Unary Operators works and name the main pitfall.",
      "answerHint": "typeof before using a possibly-missing global. void 0 as a safe undefined. Prefer obj.prop = undefined vs delete unless you need the key gone. Do not use ~ as a clever indexOf check (`~arr.indexOf` is unreadable). Pitfall: delete arrayIndex leaves a hole (sparse), it does not reindex like splice."
    },
    {
      "level": "advanced",
      "question": "How would you explain Unary Operators at an interview, including engine/spec details?",
      "answerHint": "typeof does not call GetValue on an unresolvable reference. delete on an unconfigurable property returns false or throws in strict mode. ~ uses ToInt32; ~n === -(n+1) for 32-bit integers."
    }
  ],
  "pitfalls": [
    "delete arrayIndex leaves a hole (sparse), it does not reindex like splice.",
    "Do not use ~ as a clever indexOf check (`~arr.indexOf` is unreadable)."
  ],
  "interview": {
    "expectations": [
      "Explain Unary Operators without mixing it up with a nearby B1.5 — Operators & Expressions topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "typeof does not call GetValue on an unresolvable reference."
    ],
    "commonQuestions": [
      "What is Unary Operators?",
      "Why does JavaScript unary operators behave this way?",
      "What is the classic Unary Operators interview trap?"
    ],
    "traps": [
      "delete arrayIndex leaves a hole (sparse), it does not reindex like splice."
    ],
    "misconceptions": [
      "C-like languages expose these as compact expression forms. JS kept them, then added typeof/void/delete for a dynamic object model."
    ],
    "strongSignals": [
      "Separates Unary Operators from lookalike APIs and can draw the mental model."
    ]
  }
})
