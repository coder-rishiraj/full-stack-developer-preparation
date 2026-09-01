import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "typeof",
  "whatIsIt": "`typeof` is a unary operator that returns a string tag: \"undefined\", \"boolean\", \"number\", \"bigint\", \"string\", \"symbol\", \"function\", or \"object\". It never throws on an undeclared name (`typeof notDefined === \"undefined\"`). It cannot distinguish arrays, null, or dates from generic objects without extra tests.",
  "whyExists": "A dynamic language needs a cheap runtime tag check for branching and feature detection.",
  "mentalModel": "A coarse luggage label, not a full passport. Functions get a special label; arrays do not.",
  "how": [
    "Use typeof for primitives and for “is there a function named fetch.”",
    "Use Array.isArray for arrays.",
    "Use === null for null.",
    "Use instanceof or brand checks for your classes, knowing realm issues."
  ],
  "callout": {
    "title": "Watch for",
    "text": "`typeof [] === \"array\"` is false — it is \"object\".",
    "variant": "warning"
  },
  "example": "console.log(typeof undefined, typeof 1, typeof 1n, typeof 'a');\nconsole.log(typeof true, typeof Symbol(), typeof function () {});\nconsole.log(typeof null, typeof [], typeof {});\nconsole.log(typeof undeclaredName);",
  "exampleCaption": "typeof table including undeclared",
  "internals": [
    "typeof uses Type() plus a special case for callable objects → \"function\".",
    "Host objects historically returned weird strings (\"unknown\" in old IE).",
    "typeof on a TDZ let throws — undeclared is the only “safe” missing name."
  ],
  "takeaways": [
    "Use typeof for primitives and for “is there a function named fetch.”",
    "Use Array.isArray for arrays.",
    "`typeof [] === \"array\"` is false — it is \"object\".",
    "typeof uses Type() plus a special case for callable objects → \"function\"."
  ],
  "revision": [
    "typeof: A coarse luggage label, not a full passport. Functions get a special label; arrays do not.",
    "Use typeof for primitives and for “is there a function named fetch.”",
    "Use Array.isArray for arrays.",
    "Use === null for null.",
    "Trap: `typeof [] === \"array\"` is false — it is \"object\"."
  ],
  "flashcards": [
    [
      "typeof",
      "`typeof` is a unary operator that returns a string tag: \"undefined\", \"boolean\", \"number\", \"bigint\", \"string\", \"symbol\", \"function\", or \"object\"."
    ],
    [
      "Mental model",
      "A coarse luggage label, not a full passport. Functions get a special label; arrays do not."
    ],
    [
      "Common trap",
      "`typeof [] === \"array\"` is false — it is \"object\"."
    ],
    [
      "Use typeof for primitives and for “is there a function named fetch.”",
      "Use Array.isArray for arrays."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is typeof and where does a beginner first see it?",
      "answerHint": "`typeof` is a unary operator that returns a string tag: \"undefined\", \"boolean\", \"number\", \"bigint\", \"string\", \"symbol\", \"function\", or \"object\". It never throws on an undeclared name (`typeof notDefined === \"undefined\"`). It cannot distinguish arrays, null, or dates from generic objects without extra tests."
    },
    {
      "level": "intermediate",
      "question": "Walk through how typeof works and name the main pitfall.",
      "answerHint": "Use typeof for primitives and for “is there a function named fetch.” Use Array.isArray for arrays. Use === null for null. Use instanceof or brand checks for your classes, knowing realm issues. Pitfall: `typeof [] === \"array\"` is false — it is \"object\"."
    },
    {
      "level": "advanced",
      "question": "How would you explain typeof at an interview, including engine/spec details?",
      "answerHint": "typeof uses Type() plus a special case for callable objects → \"function\". Host objects historically returned weird strings (\"unknown\" in old IE). typeof on a TDZ let throws — undeclared is the only “safe” missing name."
    }
  ],
  "pitfalls": [
    "`typeof [] === \"array\"` is false — it is \"object\".",
    "Use instanceof or brand checks for your classes, knowing realm issues."
  ],
  "interview": {
    "expectations": [
      "Explain typeof without mixing it up with a nearby B1.3 — Types & Values topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "typeof uses Type() plus a special case for callable objects → \"function\"."
    ],
    "commonQuestions": [
      "What is typeof?",
      "Why does JavaScript typeof behave this way?",
      "What is the classic typeof interview trap?"
    ],
    "traps": [
      "`typeof [] === \"array\"` is false — it is \"object\"."
    ],
    "misconceptions": [
      "A dynamic language needs a cheap runtime tag check for branching and feature detection."
    ],
    "strongSignals": [
      "Separates typeof from lookalike APIs and can draw the mental model."
    ]
  }
})
