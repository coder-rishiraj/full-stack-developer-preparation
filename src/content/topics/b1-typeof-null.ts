import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "typeof null",
  "whatIsIt": "`typeof null` is `\"object\"` because of an early implementation bug (null’s type tag was 0, same as object) that was then frozen for compatibility. null is not an object: you cannot set properties on it, and ToObject(null) throws. Always test null with `=== null`.",
  "whyExists": "Fixing typeof would have broken the web’s existing checks. The spec documented the lie instead of correcting it.",
  "mentalModel": "A forged passport that says “object.” Border control (=== null) is the real ID check.",
  "how": [
    "Never use typeof alone to mean “is object.”",
    "Pattern: `val !== null && typeof val === \"object\"`.",
    "Remember functions are objects too if you want “non-null object including arrays.”",
    "Quiz answer: it is a legacy bug, not a deep philosophy."
  ],
  "callout": {
    "title": "Watch for",
    "text": "`if (typeof x === \"object\") x.y` crashes when x is null.",
    "variant": "warning"
  },
  "example": "function isNonNullObject(v) {\n  return v !== null && (typeof v === 'object' || typeof v === 'function');\n}\nconsole.log(typeof null);\nconsole.log(isNonNullObject(null), isNonNullObject([]), isNonNullObject(() => {}));",
  "exampleCaption": "Correct non-null object check",
  "internals": [
    "The spec’s Type(null) is Null; typeof’s extra table maps Null → \"object\".",
    "typeof is not Object.prototype.toString; the latter yields \"[object Null]\".",
    "Document.all in browsers is a further typeof quirk (undefined-like object)."
  ],
  "takeaways": [
    "Never use typeof alone to mean “is object.”",
    "Pattern: `val !== null && typeof val === \"object\"`.",
    "`if (typeof x === \"object\") x.y` crashes when x is null.",
    "The spec’s Type(null) is Null; typeof’s extra table maps Null → \"object\"."
  ],
  "revision": [
    "typeof null: A forged passport that says “object.” Border control (=== null) is the real ID check.",
    "Never use typeof alone to mean “is object.”",
    "Pattern: `val !== null && typeof val === \"object\"`.",
    "Remember functions are objects too if you want “non-null object including arrays.”",
    "Trap: `if (typeof x === \"object\") x.y` crashes when x is null."
  ],
  "flashcards": [
    [
      "typeof null",
      "`typeof null` is `\"object\"` because of an early implementation bug (null’s type tag was 0, same as object) that was then frozen for compatibility."
    ],
    [
      "Mental model",
      "A forged passport that says “object.” Border control (=== null) is the real ID check."
    ],
    [
      "Common trap",
      "`if (typeof x === \"object\") x.y` crashes when x is null."
    ],
    [
      "Never use typeof alone to mean “is object.”",
      "Pattern: `val !== null && typeof val === \"object\"`."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is typeof null and where does a beginner first see it?",
      "answerHint": "`typeof null` is `\"object\"` because of an early implementation bug (null’s type tag was 0, same as object) that was then frozen for compatibility. null is not an object: you cannot set properties on it, and ToObject(null) throws. Always test null with `=== null`."
    },
    {
      "level": "intermediate",
      "question": "Walk through how typeof null works and name the main pitfall.",
      "answerHint": "Never use typeof alone to mean “is object.” Pattern: `val !== null && typeof val === \"object\"`. Remember functions are objects too if you want “non-null object including arrays.” Quiz answer: it is a legacy bug, not a deep philosophy. Pitfall: `if (typeof x === \"object\") x.y` crashes when x is null."
    },
    {
      "level": "advanced",
      "question": "How would you explain typeof null at an interview, including engine/spec details?",
      "answerHint": "The spec’s Type(null) is Null; typeof’s extra table maps Null → \"object\". typeof is not Object.prototype.toString; the latter yields \"[object Null]\". Document.all in browsers is a further typeof quirk (undefined-like object)."
    }
  ],
  "pitfalls": [
    "`if (typeof x === \"object\") x.y` crashes when x is null.",
    "Quiz answer: it is a legacy bug, not a deep philosophy."
  ],
  "interview": {
    "expectations": [
      "Explain typeof null without mixing it up with a nearby B1.3 — Types & Values topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "The spec’s Type(null) is Null; typeof’s extra table maps Null → \"object\"."
    ],
    "commonQuestions": [
      "What is typeof null?",
      "Why does JavaScript typeof null behave this way?",
      "What is the classic typeof null interview trap?"
    ],
    "traps": [
      "`if (typeof x === \"object\") x.y` crashes when x is null."
    ],
    "misconceptions": [
      "Fixing typeof would have broken the web’s existing checks. The spec documented the lie instead of correcting it."
    ],
    "strongSignals": [
      "Separates typeof null from lookalike APIs and can draw the mental model."
    ]
  }
})
