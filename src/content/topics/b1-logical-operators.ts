import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Logical Operators",
  "whatIsIt": "&& and || are short-circuiting and return an operand, not necessarily a boolean. || returns the first truthy, else the last. && returns the first falsy, else the last. ! ToBooleans and returns a boolean. ?? is not a synonym for || — it only skips null/undefined.",
  "whyExists": "JS used || for defaulting (`x = x || 10`) long before ?? existed. Returning operands enables that idiom.",
  "mentalModel": "A picker, not a boolean factory. It walks left to right and stops when the answer is known.",
  "how": [
    "Use ?? for defaults so 0 and '' can win.",
    "Use Boolean(a && b) if you truly need a boolean.",
    "Do not write a && doSideEffect() unless you like hidden control flow.",
    "! is ToBoolean then invert; !! forces a boolean."
  ],
  "callout": {
    "title": "Watch for",
    "text": "userCount || 10 replaces a legitimate 0 with 10. That is the reason ?? was added.",
    "variant": "warning"
  },
  "example": "console.log(0 || 2, '' || 'fallback', 1 && 2 && 3);\nconsole.log(0 ?? 2, '' ?? 'fallback', null ?? 2);\nconsole.log(![], !'', !!'0');\nconst x = 0;\nconsole.log(x || 5, x ?? 5);\n",
  "exampleCaption": "|| vs ?? vs && return values",
  "internals": [
    "LogicalOR: ToBoolean(lval) ? lval : rval — rval not evaluated if truthy.",
    "LogicalAND: ToBoolean(lval) ? rval : lval.",
    "Unary ! is !ToBoolean(GetValue(expr))."
  ],
  "takeaways": [
    "Use ?? for defaults so 0 and '' can win.",
    "Use Boolean(a && b) if you truly need a boolean.",
    "userCount || 10 replaces a legitimate 0 with 10. That is the reason ?? was added.",
    "LogicalOR: ToBoolean(lval) ? lval : rval — rval not evaluated if truthy."
  ],
  "revision": [
    "Logical Operators: A picker, not a boolean factory. It walks left to right and stops when the answer is known.",
    "Use ?? for defaults so 0 and '' can win.",
    "Use Boolean(a && b) if you truly need a boolean.",
    "Do not write a && doSideEffect() unless you like hidden control flow.",
    "Trap: userCount || 10 replaces a legitimate 0 with 10. That is the reason ?? was added."
  ],
  "flashcards": [
    [
      "Logical Operators",
      "&& and || are short-circuiting and return an operand, not necessarily a boolean."
    ],
    [
      "Mental model",
      "A picker, not a boolean factory. It walks left to right and stops when the answer is known."
    ],
    [
      "Common trap",
      "userCount || 10 replaces a legitimate 0 with 10. That is the reason ?? was added."
    ],
    [
      "Use ?? for defaults so 0 and '' can win.",
      "Use Boolean(a && b) if you truly need a boolean."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Logical Operators and where does a beginner first see it?",
      "answerHint": "&& and || are short-circuiting and return an operand, not necessarily a boolean. || returns the first truthy, else the last. && returns the first falsy, else the last. ! ToBooleans and returns a boolean. ?? is not a synonym for || — it only skips null/undefined."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Logical Operators works and name the main pitfall.",
      "answerHint": "Use ?? for defaults so 0 and '' can win. Use Boolean(a && b) if you truly need a boolean. Do not write a && doSideEffect() unless you like hidden control flow. ! is ToBoolean then invert; !! forces a boolean. Pitfall: userCount || 10 replaces a legitimate 0 with 10. That is the reason ?? was added."
    },
    {
      "level": "advanced",
      "question": "How would you explain Logical Operators at an interview, including engine/spec details?",
      "answerHint": "LogicalOR: ToBoolean(lval) ? lval : rval — rval not evaluated if truthy. LogicalAND: ToBoolean(lval) ? rval : lval. Unary ! is !ToBoolean(GetValue(expr))."
    }
  ],
  "pitfalls": [
    "userCount || 10 replaces a legitimate 0 with 10. That is the reason ?? was added.",
    "! is ToBoolean then invert; !! forces a boolean."
  ],
  "interview": {
    "expectations": [
      "Explain Logical Operators without mixing it up with a nearby B1.5 — Operators & Expressions topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "LogicalOR: ToBoolean(lval) ? lval : rval — rval not evaluated if truthy."
    ],
    "commonQuestions": [
      "What is Logical Operators?",
      "Why does JavaScript logical operators behave this way?",
      "What is the classic Logical Operators interview trap?"
    ],
    "traps": [
      "userCount || 10 replaces a legitimate 0 with 10. That is the reason ?? was added."
    ],
    "misconceptions": [
      "JS used || for defaulting (`x = x || 10`) long before ?? existed. Returning operands enables that idiom."
    ],
    "strongSignals": [
      "Separates Logical Operators from lookalike APIs and can draw the mental model."
    ]
  }
})
