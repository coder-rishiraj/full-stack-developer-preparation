import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Floating-Point and 0.1 + 0.2",
  "whatIsIt": "0.1 + 0.2 !== 0.3 because 0.1 is not a finite binary fraction, just like 1/3 is not finite in decimal. The sum rounds to a neighbor of 0.3. Equality on money-like decimals is therefore unsafe. Compare with a tolerance or work in integer cents.",
  "whyExists": "Binary floating point is hardware-fast. Decimal money is not the native representation, so the famous puzzle is inevitable.",
  "mentalModel": "You cannot store 0.1 exactly, so you store a very close double. Adding two approximations is not the decimal 0.3.",
  "how": [
    "Use Number.EPSILON-scaled compare for geometry, not for currency.",
    "Store money as integer cents or bigint.",
    "toFixed returns a string; it rounds for display, it does not fix equality of the raw doubles.",
    "Do not ‘fix’ by rounding after every add unless you define a decimal policy."
  ],
  "callout": {
    "title": "Watch for",
    "text": "toFixed(2) then === still fails if you convert back with Number and expect exact tenths.",
    "variant": "warning"
  },
  "example": "console.log(0.1 + 0.2);\nconsole.log(0.1 + 0.2 === 0.3);\nconst close = Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON * 4;\nconsole.log(close);\nconsole.log((0.1 + 0.2).toFixed(2));\nconsole.log(10 + 20 === 30);\n",
  "exampleCaption": "0.1+0.2 vs integer cents",
  "internals": [
    "0.1 in binary is a repeating fraction; rounding happens at 52 bits.",
    "Addition rounds the exact math result to the nearest representable double.",
    "SameValueZero used by Set/Map still treats 0.1+0.2 and 0.3 as different keys."
  ],
  "takeaways": [
    "Use Number.EPSILON-scaled compare for geometry, not for currency.",
    "Store money as integer cents or bigint.",
    "toFixed(2) then === still fails if you convert back with Number and expect exact tenths.",
    "0.1 in binary is a repeating fraction; rounding happens at 52 bits."
  ],
  "revision": [
    "Floating-Point and 0.1 + 0.2: You cannot store 0.1 exactly, so you store a very close double. Adding two approximations is not the decimal 0.3.",
    "Use Number.EPSILON-scaled compare for geometry, not for currency.",
    "Store money as integer cents or bigint.",
    "toFixed returns a string; it rounds for display, it does not fix equality of the raw doubles.",
    "Trap: toFixed(2) then === still fails if you convert back with Number and expect exact tenths."
  ],
  "flashcards": [
    [
      "Floating-Point and 0.1 + 0.2",
      "0.1 + 0.2 !== 0.3 because 0.1 is not a finite binary fraction, just like 1/3 is not finite in decimal."
    ],
    [
      "Mental model",
      "You cannot store 0.1 exactly, so you store a very close double. Adding two approximations is not the decimal 0.3."
    ],
    [
      "Common trap",
      "toFixed(2) then === still fails if you convert back with Number and expect exact tenths."
    ],
    [
      "Use Number.EPSILON-scaled compare for geometry, not for currency.",
      "Store money as integer cents or bigint."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Floating-Point and 0.1 + 0.2 and where does a beginner first see it?",
      "answerHint": "0.1 + 0.2 !== 0.3 because 0.1 is not a finite binary fraction, just like 1/3 is not finite in decimal. The sum rounds to a neighbor of 0.3. Equality on money-like decimals is therefore unsafe. Compare with a tolerance or work in integer cents."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Floating-Point and 0.1 + 0.2 works and name the main pitfall.",
      "answerHint": "Use Number.EPSILON-scaled compare for geometry, not for currency. Store money as integer cents or bigint. toFixed returns a string; it rounds for display, it does not fix equality of the raw doubles. Do not ‘fix’ by rounding after every add unless you define a decimal policy. Pitfall: toFixed(2) then === still fails if you convert back with Number and expect exact tenths."
    },
    {
      "level": "advanced",
      "question": "How would you explain Floating-Point and 0.1 + 0.2 at an interview, including engine/spec details?",
      "answerHint": "0.1 in binary is a repeating fraction; rounding happens at 52 bits. Addition rounds the exact math result to the nearest representable double. SameValueZero used by Set/Map still treats 0.1+0.2 and 0.3 as different keys."
    }
  ],
  "pitfalls": [
    "toFixed(2) then === still fails if you convert back with Number and expect exact tenths.",
    "Do not ‘fix’ by rounding after every add unless you define a decimal policy."
  ],
  "interview": {
    "expectations": [
      "Explain Floating-Point and 0.1 + 0.2 without mixing it up with a nearby B1.8 — Numbers & Math topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "0.1 in binary is a repeating fraction; rounding happens at 52 bits."
    ],
    "commonQuestions": [
      "What is Floating-Point and 0.1 + 0.2?",
      "Why does JavaScript floating-point and 0.1 + 0.2 behave this way?",
      "What is the classic Floating-Point and 0.1 + 0.2 interview trap?"
    ],
    "traps": [
      "toFixed(2) then === still fails if you convert back with Number and expect exact tenths."
    ],
    "misconceptions": [
      "Binary floating point is hardware-fast. Decimal money is not the native representation, so the famous puzzle is inevitable."
    ],
    "strongSignals": [
      "Separates Floating-Point and 0.1 + 0.2 from lookalike APIs and can draw the mental model."
    ]
  }
})
