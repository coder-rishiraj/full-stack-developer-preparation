import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Safe Integers",
  "whatIsIt": "A safe integer is one that can be represented exactly as a double and such that n+1 is also exact. Number.MAX_SAFE_INTEGER is 9007199254740991 (2^53-1). Number.isSafeInteger tests that. Database IDs and Twitter snowflakes often exceed this, so they travel as strings.",
  "whyExists": "People treated number as ‘int’ for IDs. IEEE cannot count every integer past 2^53, so the spec named the safe range.",
  "mentalModel": "A fence at 2^53. Inside, ++ hits every integer. Outside, some integers do not exist as numbers.",
  "how": [
    "Number.isSafeInteger before using as Map keys or array indexes of meaning.",
    "Keep large IDs as strings from JSON.",
    "Use bigint when you must arithmetic them.",
    "isInteger is not isSafeInteger — 3.0e20 is integer-ish but unsafe."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Array length is a uint32, so huge ‘integers’ are also invalid as lengths even when they are ‘safe’ or not.",
    "variant": "warning"
  },
  "example": "const max = Number.MAX_SAFE_INTEGER;\nconsole.log(max, Number.isSafeInteger(max), Number.isSafeInteger(max + 1));\nconsole.log(Number.isInteger(1.0), Number.isSafeInteger(1.0));\nconsole.log(Number.isInteger(2 ** 53), Number.isSafeInteger(2 ** 53));\nconsole.log(String(max + 2) === String(max + 3));\n",
  "exampleCaption": "MAX_SAFE_INTEGER and isSafeInteger",
  "internals": [
    "isSafeInteger: isInteger and abs(n) ≤ 2^53-1.",
    "2^53 is representable but 2^53+1 is not — hence MAX is 2^53-1.",
    "JSON.parse uses ToNumber on literals, which already lost bits before isSafeInteger."
  ],
  "takeaways": [
    "Number.isSafeInteger before using as Map keys or array indexes of meaning.",
    "Keep large IDs as strings from JSON.",
    "Array length is a uint32, so huge ‘integers’ are also invalid as lengths even when they are ‘safe’ or not.",
    "isSafeInteger: isInteger and abs(n) ≤ 2^53-1."
  ],
  "revision": [
    "Safe Integers: A fence at 2^53. Inside, ++ hits every integer. Outside, some integers do not exist as numbers.",
    "Number.isSafeInteger before using as Map keys or array indexes of meaning.",
    "Keep large IDs as strings from JSON.",
    "Use bigint when you must arithmetic them.",
    "Trap: Array length is a uint32, so huge ‘integers’ are also invalid as lengths even when they are ‘safe’ or not."
  ],
  "flashcards": [
    [
      "Safe Integers",
      "A safe integer is one that can be represented exactly as a double and such that n+1 is also exact."
    ],
    [
      "Mental model",
      "A fence at 2^53. Inside, ++ hits every integer. Outside, some integers do not exist as numbers."
    ],
    [
      "Common trap",
      "Array length is a uint32, so huge ‘integers’ are also invalid as lengths even when they are ‘safe’ or not."
    ],
    [
      "Number.isSafeInteger before using as Map keys or array indexes of meaning.",
      "Keep large IDs as strings from JSON."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Safe Integers and where does a beginner first see it?",
      "answerHint": "A safe integer is one that can be represented exactly as a double and such that n+1 is also exact. Number.MAX_SAFE_INTEGER is 9007199254740991 (2^53-1). Number.isSafeInteger tests that. Database IDs and Twitter snowflakes often exceed this, so they travel as strings."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Safe Integers works and name the main pitfall.",
      "answerHint": "Number.isSafeInteger before using as Map keys or array indexes of meaning. Keep large IDs as strings from JSON. Use bigint when you must arithmetic them. isInteger is not isSafeInteger — 3.0e20 is integer-ish but unsafe. Pitfall: Array length is a uint32, so huge ‘integers’ are also invalid as lengths even when they are ‘safe’ or not."
    },
    {
      "level": "advanced",
      "question": "How would you explain Safe Integers at an interview, including engine/spec details?",
      "answerHint": "isSafeInteger: isInteger and abs(n) ≤ 2^53-1. 2^53 is representable but 2^53+1 is not — hence MAX is 2^53-1. JSON.parse uses ToNumber on literals, which already lost bits before isSafeInteger."
    }
  ],
  "pitfalls": [
    "Array length is a uint32, so huge ‘integers’ are also invalid as lengths even when they are ‘safe’ or not.",
    "isInteger is not isSafeInteger — 3.0e20 is integer-ish but unsafe."
  ],
  "interview": {
    "expectations": [
      "Explain Safe Integers without mixing it up with a nearby B1.8 — Numbers & Math topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "isSafeInteger: isInteger and abs(n) ≤ 2^53-1."
    ],
    "commonQuestions": [
      "What is Safe Integers?",
      "Why does JavaScript safe integers behave this way?",
      "What is the classic Safe Integers interview trap?"
    ],
    "traps": [
      "Array length is a uint32, so huge ‘integers’ are also invalid as lengths even when they are ‘safe’ or not."
    ],
    "misconceptions": [
      "People treated number as ‘int’ for IDs. IEEE cannot count every integer past 2^53, so the spec named the safe range."
    ],
    "strongSignals": [
      "Separates Safe Integers from lookalike APIs and can draw the mental model."
    ]
  }
})
