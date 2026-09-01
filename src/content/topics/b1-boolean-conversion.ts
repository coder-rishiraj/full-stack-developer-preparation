import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Boolean()",
  "whatIsIt": "Boolean(x) is ToBoolean: only false, 0, -0, 0n, '', null, undefined, and NaN become false. Boolean('false') is true. Double-bang !!x is the same conversion. It does not parse the word false.",
  "whyExists": "if/while needed a yes/no from any value. Exposing Boolean() lets you store a real boolean instead of relying on later coercion.",
  "mentalModel": "A membership test against a tiny falsy set. The word ‘false’ is just a non-empty string.",
  "how": [
    "Use Boolean(x) or !!x at API boundaries.",
    "Parse actual 'true'/'false' strings yourself.",
    "Do not Boolean(array) to mean ‘non-empty’ — use length.",
    "Avoid new Boolean; it is an object."
  ],
  "callout": {
    "title": "Watch for",
    "text": "JSON/localStorage 'false' is truthy; you must compare to the string 'true' or JSON.parse.",
    "variant": "warning"
  },
  "example": "console.log(Boolean('false'), Boolean(''), Boolean('0'));\nconsole.log(Boolean([]), Boolean({}), Boolean(new Boolean(false)));\nconst raw = 'true';\nconsole.log(raw === 'true', Boolean(raw));\nconsole.log(!!0, !!1, !!0n);\n",
  "exampleCaption": "Boolean() does not parse the word false",
  "internals": [
    "ToBoolean is a fixed table; objects are always true (except document.all).",
    "Boolean as a function vs constructor: without new it returns a primitive.",
    "Logical operators do not call Boolean() for their return value; they return operands."
  ],
  "takeaways": [
    "Use Boolean(x) or !!x at API boundaries.",
    "Parse actual 'true'/'false' strings yourself.",
    "JSON/localStorage 'false' is truthy; you must compare to the string 'true' or JSON.parse.",
    "ToBoolean is a fixed table; objects are always true (except document.all)."
  ],
  "revision": [
    "Boolean(): A membership test against a tiny falsy set. The word ‘false’ is just a non-empty string.",
    "Use Boolean(x) or !!x at API boundaries.",
    "Parse actual 'true'/'false' strings yourself.",
    "Do not Boolean(array) to mean ‘non-empty’ — use length.",
    "Trap: JSON/localStorage 'false' is truthy; you must compare to the string 'true' or JSON.parse."
  ],
  "flashcards": [
    [
      "Boolean()",
      "Boolean(x) is ToBoolean: only false, 0, -0, 0n, '', null, undefined, and NaN become false."
    ],
    [
      "Mental model",
      "A membership test against a tiny falsy set. The word ‘false’ is just a non-empty string."
    ],
    [
      "Common trap",
      "JSON/localStorage 'false' is truthy; you must compare to the string 'true' or JSON.parse."
    ],
    [
      "Use Boolean(x) or !!x at API boundaries.",
      "Parse actual 'true'/'false' strings yourself."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Boolean() and where does a beginner first see it?",
      "answerHint": "Boolean(x) is ToBoolean: only false, 0, -0, 0n, '', null, undefined, and NaN become false. Boolean('false') is true. Double-bang !!x is the same conversion. It does not parse the word false."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Boolean() works and name the main pitfall.",
      "answerHint": "Use Boolean(x) or !!x at API boundaries. Parse actual 'true'/'false' strings yourself. Do not Boolean(array) to mean ‘non-empty’ — use length. Avoid new Boolean; it is an object. Pitfall: JSON/localStorage 'false' is truthy; you must compare to the string 'true' or JSON.parse."
    },
    {
      "level": "advanced",
      "question": "How would you explain Boolean() at an interview, including engine/spec details?",
      "answerHint": "ToBoolean is a fixed table; objects are always true (except document.all). Boolean as a function vs constructor: without new it returns a primitive. Logical operators do not call Boolean() for their return value; they return operands."
    }
  ],
  "pitfalls": [
    "JSON/localStorage 'false' is truthy; you must compare to the string 'true' or JSON.parse.",
    "Avoid new Boolean; it is an object."
  ],
  "interview": {
    "expectations": [
      "Explain Boolean() without mixing it up with a nearby B1.4 — Type Conversion & Coercion topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "ToBoolean is a fixed table; objects are always true (except document.all)."
    ],
    "commonQuestions": [
      "What is Boolean()?",
      "Why does JavaScript boolean() behave this way?",
      "What is the classic Boolean() interview trap?"
    ],
    "traps": [
      "JSON/localStorage 'false' is truthy; you must compare to the string 'true' or JSON.parse."
    ],
    "misconceptions": [
      "if/while needed a yes/no from any value. Exposing Boolean() lets you store a real boolean instead of relying on later coercion."
    ],
    "strongSignals": [
      "Separates Boolean() from lookalike APIs and can draw the mental model."
    ]
  }
})
