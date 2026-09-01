import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "if / else / else if",
  "whatIsIt": "if (cond) statement else statement branches using ToBoolean(cond). else if is just nested if in the else slot. Braces are optional for a single statement and dangerous. There is no elif keyword. Conditions are not required to be booleans.",
  "whyExists": "Every procedural language needs a binary fork. JS reused C’s if and added implicit ToBoolean so `if (node)` works.",
  "mentalModel": "Evaluate the test once, pick one path, skip the other. Falsy values take the else (or skip the then).",
  "how": [
    "Always use braces, even for one-liners.",
    "Compare explicitly when 0 or '' are valid.",
    "Prefer early return over deep else nesting.",
    "Do not assign inside if tests."
  ],
  "callout": {
    "title": "Watch for",
    "text": "if (count) skips the block when count is 0, which is often a legal count.",
    "variant": "warning"
  },
  "example": "function fee(age) {\n  if (age < 0) throw new Error('age');\n  if (age < 13) return 'child';\n  if (age < 18) return 'teen';\n  return 'adult';\n}\nconsole.log(fee(10), fee(15), fee(40));\nif (0) console.log('no'); else console.log('zero is falsy');\n",
  "exampleCaption": "if / else if via early returns and falsy 0",
  "internals": [
    "IfStatement: ToBoolean of the expression, then evaluate one Statement.",
    "No block scope unless you add { } with let/const.",
    "Dangling else binds to the nearest if — braces remove the ambiguity."
  ],
  "takeaways": [
    "Always use braces, even for one-liners.",
    "Compare explicitly when 0 or '' are valid.",
    "if (count) skips the block when count is 0, which is often a legal count.",
    "IfStatement: ToBoolean of the expression, then evaluate one Statement."
  ],
  "revision": [
    "if / else / else if: Evaluate the test once, pick one path, skip the other. Falsy values take the else (or skip the then).",
    "Always use braces, even for one-liners.",
    "Compare explicitly when 0 or '' are valid.",
    "Prefer early return over deep else nesting.",
    "Trap: if (count) skips the block when count is 0, which is often a legal count."
  ],
  "flashcards": [
    [
      "if / else / else if",
      "if (cond) statement else statement branches using ToBoolean(cond)."
    ],
    [
      "Mental model",
      "Evaluate the test once, pick one path, skip the other. Falsy values take the else (or skip the then)."
    ],
    [
      "Common trap",
      "if (count) skips the block when count is 0, which is often a legal count."
    ],
    [
      "Always use braces, even for one-liners.",
      "Compare explicitly when 0 or '' are valid."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is if / else / else if and where does a beginner first see it?",
      "answerHint": "if (cond) statement else statement branches using ToBoolean(cond). else if is just nested if in the else slot. Braces are optional for a single statement and dangerous. There is no elif keyword. Conditions are not required to be booleans."
    },
    {
      "level": "intermediate",
      "question": "Walk through how if / else / else if works and name the main pitfall.",
      "answerHint": "Always use braces, even for one-liners. Compare explicitly when 0 or '' are valid. Prefer early return over deep else nesting. Do not assign inside if tests. Pitfall: if (count) skips the block when count is 0, which is often a legal count."
    },
    {
      "level": "advanced",
      "question": "How would you explain if / else / else if at an interview, including engine/spec details?",
      "answerHint": "IfStatement: ToBoolean of the expression, then evaluate one Statement. No block scope unless you add { } with let/const. Dangling else binds to the nearest if — braces remove the ambiguity."
    }
  ],
  "pitfalls": [
    "if (count) skips the block when count is 0, which is often a legal count.",
    "Do not assign inside if tests."
  ],
  "interview": {
    "expectations": [
      "Explain if / else / else if without mixing it up with a nearby B1.6 — Control Flow topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "IfStatement: ToBoolean of the expression, then evaluate one Statement."
    ],
    "commonQuestions": [
      "What is if / else / else if?",
      "Why does JavaScript if / else / else if behave this way?",
      "What is the classic if / else / else if interview trap?"
    ],
    "traps": [
      "if (count) skips the block when count is 0, which is often a legal count."
    ],
    "misconceptions": [
      "Every procedural language needs a binary fork. JS reused C’s if and added implicit ToBoolean so `if (node)` works."
    ],
    "strongSignals": [
      "Separates if / else / else if from lookalike APIs and can draw the mental model."
    ]
  }
})
