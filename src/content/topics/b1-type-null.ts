import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "null",
  "whatIsIt": "null is a primitive meaning “intentional empty object reference.” typeof null is \"object\" (legacy bug). It is falsy, equal to undefined with `==` but not with `===`. JSON uses null; many APIs use null for “no resource.” It is not the same as a missing property (undefined).",
  "whyExists": "OOP languages distinguish “no object” from “uninitialized.” JS kept null for that signal, especially when talking to Java/DOM in the 1990s.",
  "mentalModel": "A parked empty pointer you chose. undefined is “nobody parked anything”; null is “I parked an empty sign.”",
  "how": [
    "Use === null when you mean the null value.",
    "Do not use null to initialize numbers/strings; use 0 or \"\".",
    "JSON.stringify omits undefined properties but keeps null.",
    "document.getElementById returns null, not undefined."
  ],
  "callout": {
    "title": "Watch for",
    "text": "`typeof x === \"object\" && x` is the old null check pattern because typeof null is object.",
    "variant": "warning"
  },
  "example": "console.log(typeof null, null == undefined, null === undefined);\nconsole.log(JSON.stringify({ a: null, b: undefined }));\nconst el = { query: () => null };\nconsole.log(el.query() ?? 'missing');",
  "exampleCaption": "null vs undefined in equality and JSON",
  "internals": [
    "Type(null) is Null, distinct from Object despite typeof.",
    "ToObject(null) throws TypeError — you cannot autobox null.",
    "== uses the spec table that equates null and undefined only to each other."
  ],
  "takeaways": [
    "Use === null when you mean the null value.",
    "Do not use null to initialize numbers/strings; use 0 or \"\".",
    "`typeof x === \"object\" && x` is the old null check pattern because typeof null is object.",
    "Type(null) is Null, distinct from Object despite typeof."
  ],
  "revision": [
    "null: A parked empty pointer you chose. undefined is “nobody parked anything”; null is “I parked an empty sign.”",
    "Use === null when you mean the null value.",
    "Do not use null to initialize numbers/strings; use 0 or \"\".",
    "JSON.stringify omits undefined properties but keeps null.",
    "Trap: `typeof x === \"object\" && x` is the old null check pattern because typeof null is object."
  ],
  "flashcards": [
    [
      "null",
      "null is a primitive meaning “intentional empty object reference.” typeof null is \"object\" (legacy bug)."
    ],
    [
      "Mental model",
      "A parked empty pointer you chose. undefined is “nobody parked anything”; null is “I parked an empty sign.”"
    ],
    [
      "Common trap",
      "`typeof x === \"object\" && x` is the old null check pattern because typeof null is object."
    ],
    [
      "Use === null when you mean the null value.",
      "Do not use null to initialize numbers/strings; use 0 or \"\"."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is null and where does a beginner first see it?",
      "answerHint": "null is a primitive meaning “intentional empty object reference.” typeof null is \"object\" (legacy bug). It is falsy, equal to undefined with `==` but not with `===`. JSON uses null; many APIs use null for “no resource.” It is not the same as a missing property (undefined)."
    },
    {
      "level": "intermediate",
      "question": "Walk through how null works and name the main pitfall.",
      "answerHint": "Use === null when you mean the null value. Do not use null to initialize numbers/strings; use 0 or \"\". JSON.stringify omits undefined properties but keeps null. document.getElementById returns null, not undefined. Pitfall: `typeof x === \"object\" && x` is the old null check pattern because typeof null is object."
    },
    {
      "level": "advanced",
      "question": "How would you explain null at an interview, including engine/spec details?",
      "answerHint": "Type(null) is Null, distinct from Object despite typeof. ToObject(null) throws TypeError — you cannot autobox null. == uses the spec table that equates null and undefined only to each other."
    }
  ],
  "pitfalls": [
    "`typeof x === \"object\" && x` is the old null check pattern because typeof null is object.",
    "document.getElementById returns null, not undefined."
  ],
  "interview": {
    "expectations": [
      "Explain null without mixing it up with a nearby B1.3 — Types & Values topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Type(null) is Null, distinct from Object despite typeof."
    ],
    "commonQuestions": [
      "What is null?",
      "Why does JavaScript null behave this way?",
      "What is the classic null interview trap?"
    ],
    "traps": [
      "`typeof x === \"object\" && x` is the old null check pattern because typeof null is object."
    ],
    "misconceptions": [
      "OOP languages distinguish “no object” from “uninitialized.” JS kept null for that signal, especially when talking to Java/DOM in the 1990s."
    ],
    "strongSignals": [
      "Separates null from lookalike APIs and can draw the mental model."
    ]
  }
})
