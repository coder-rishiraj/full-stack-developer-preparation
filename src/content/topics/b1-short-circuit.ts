import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Short-Circuit Evaluation",
  "whatIsIt": "Short-circuit means the right operand of && / || / ?? is not evaluated if the left already decides the result. That skips function calls, throws, and increments on the right. Ternaries also evaluate only one branch. This is control flow disguised as an expression.",
  "whyExists": "Cheap guards (`obj && obj.x`) avoided errors before optional chaining. It is also a micro-optimization and a source of skipped side effects.",
  "mentalModel": "Left doorperson. If they already know the answer, the right-hand guest never enters the building.",
  "how": [
    "Put cheap checks on the left.",
    "Do not hide required side effects on the right of &&/||.",
    "Optional chaining ?. is a safer property guard than &&.",
    "?? only short-circuits when left is not nullish."
  ],
  "callout": {
    "title": "Watch for",
    "text": "flag && increment() skips increment when flag is 0 — 0 is falsy, not ‘off’ vs ‘on’ if 0 is valid.",
    "variant": "warning"
  },
  "example": "let n = 0;\nfunction bump() { n += 1; return n; }\nconsole.log(true || bump(), n);\nconsole.log(false && bump(), n);\nconsole.log(null ?? bump(), n);\nconsole.log(0 ?? bump(), n);\n",
  "exampleCaption": "Which calls run under || && ??",
  "internals": [
    "The spec uses If ToBoolean then return, else evaluate the other expression.",
    "No Call is performed if the right-hand CallExpression is not evaluated.",
    "Optional chaining has its own short-circuit: nullish left skips the rest of the chain."
  ],
  "takeaways": [
    "Put cheap checks on the left.",
    "Do not hide required side effects on the right of &&/||.",
    "flag && increment() skips increment when flag is 0 — 0 is falsy, not ‘off’ vs ‘on’ if 0 is valid.",
    "The spec uses If ToBoolean then return, else evaluate the other expression."
  ],
  "revision": [
    "Short-Circuit Evaluation: Left doorperson. If they already know the answer, the right-hand guest never enters the building.",
    "Put cheap checks on the left.",
    "Do not hide required side effects on the right of &&/||.",
    "Optional chaining ?. is a safer property guard than &&.",
    "Trap: flag && increment() skips increment when flag is 0 — 0 is falsy, not ‘off’ vs ‘on’ if 0 is valid."
  ],
  "flashcards": [
    [
      "Short-Circuit Evaluation",
      "Short-circuit means the right operand of && / || / ?? is not evaluated if the left already decides the result."
    ],
    [
      "Mental model",
      "Left doorperson. If they already know the answer, the right-hand guest never enters the building."
    ],
    [
      "Common trap",
      "flag && increment() skips increment when flag is 0 — 0 is falsy, not ‘off’ vs ‘on’ if 0 is valid."
    ],
    [
      "Put cheap checks on the left.",
      "Do not hide required side effects on the right of &&/||."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Short-Circuit Evaluation and where does a beginner first see it?",
      "answerHint": "Short-circuit means the right operand of && / || / ?? is not evaluated if the left already decides the result. That skips function calls, throws, and increments on the right. Ternaries also evaluate only one branch. This is control flow disguised as an expression."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Short-Circuit Evaluation works and name the main pitfall.",
      "answerHint": "Put cheap checks on the left. Do not hide required side effects on the right of &&/||. Optional chaining ?. is a safer property guard than &&. ?? only short-circuits when left is not nullish. Pitfall: flag && increment() skips increment when flag is 0 — 0 is falsy, not ‘off’ vs ‘on’ if 0 is valid."
    },
    {
      "level": "advanced",
      "question": "How would you explain Short-Circuit Evaluation at an interview, including engine/spec details?",
      "answerHint": "The spec uses If ToBoolean then return, else evaluate the other expression. No Call is performed if the right-hand CallExpression is not evaluated. Optional chaining has its own short-circuit: nullish left skips the rest of the chain."
    }
  ],
  "pitfalls": [
    "flag && increment() skips increment when flag is 0 — 0 is falsy, not ‘off’ vs ‘on’ if 0 is valid.",
    "?? only short-circuits when left is not nullish."
  ],
  "interview": {
    "expectations": [
      "Explain Short-Circuit Evaluation without mixing it up with a nearby B1.5 — Operators & Expressions topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "The spec uses If ToBoolean then return, else evaluate the other expression."
    ],
    "commonQuestions": [
      "What is Short-Circuit Evaluation?",
      "Why does JavaScript short-circuit evaluation behave this way?",
      "What is the classic Short-Circuit Evaluation interview trap?"
    ],
    "traps": [
      "flag && increment() skips increment when flag is 0 — 0 is falsy, not ‘off’ vs ‘on’ if 0 is valid."
    ],
    "misconceptions": [
      "Cheap guards (`obj && obj.x`) avoided errors before optional chaining. It is also a micro-optimization and a source of skipped side effects."
    ],
    "strongSignals": [
      "Separates Short-Circuit Evaluation from lookalike APIs and can draw the mental model."
    ]
  }
})
