import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Semicolons / ASI",
  "whatIsIt": "Automatic Semicolon Insertion (ASI) inserts `;` when the parser would otherwise error, at newlines in restricted productions (`return`, `throw`, `break`, `continue`, `++`/`--` postfix), and at EOF. It does not insert semicolons everywhere a newline appears. Leading `(` `[` `` ` `` `/` `+` `-` on the next line can continue the previous statement.",
  "whyExists": "Brendan Eich wanted a friendlier syntax for amateurs. The compromise was optional semicolons with a precise (and sharp) insertion algorithm.",
  "mentalModel": "Newlines are not the end of a statement unless the grammar says they are, or ASI’s three rules fire.",
  "how": [
    "Always put `;` before a line that starts with `(`, `[`, or `` ` `` if you omit semicolons style-wise.",
    "`return` then a newline then a value returns undefined.",
    "Prefix `++` on the next line can apply to the previous expression.",
    "Use a linter (semicolon or no-semicolon style, but consistent)."
  ],
  "callout": {
    "title": "Watch for",
    "text": "`return\\n{...}` returns undefined; the braces become a block, not an object.",
    "variant": "warning"
  },
  "example": "function oops() {\n  return\n  { ok: true }\n}\nfunction ok() {\n  return { ok: true }\n}\nconsole.log(oops(), ok());\nconst a = 1\nconst b = 2\nconsole.log(a + b);",
  "exampleCaption": "ASI breaks return of an object literal",
  "internals": [
    "Restricted productions forbid LineTerminator between return/throw/break/continue and their expressions.",
    "ASI is specified as a token insertion when parse fails, not a pre-pass that adds semicolons blindly.",
    "++/-- postfix cannot have a newline before the operator (restricted production)."
  ],
  "takeaways": [
    "Always put `;` before a line that starts with `(`, `[`, or `` ` `` if you omit semicolons style-wise.",
    "`return` then a newline then a value returns undefined.",
    "`return\\n{...}` returns undefined; the braces become a block, not an object.",
    "Restricted productions forbid LineTerminator between return/throw/break/continue and their expressions."
  ],
  "revision": [
    "Semicolons / ASI: Newlines are not the end of a statement unless the grammar says they are, or ASI’s three rules fire.",
    "Always put `;` before a line that starts with `(`, `[`, or `` ` `` if you omit semicolons style-wise.",
    "`return` then a newline then a value returns undefined.",
    "Prefix `++` on the next line can apply to the previous expression.",
    "Trap: `return\\n{...}` returns undefined; the braces become a block, not an object."
  ],
  "flashcards": [
    [
      "Semicolons / ASI",
      "Automatic Semicolon Insertion (ASI) inserts `;` when the parser would otherwise error, at newlines in restricted productions (`return`, `throw`, `break`, `continue`, `++`/`--` postfix), and at EOF."
    ],
    [
      "Mental model",
      "Newlines are not the end of a statement unless the grammar says they are, or ASI’s three rules fire."
    ],
    [
      "Common trap",
      "`return\\n{...}` returns undefined; the braces become a block, not an object."
    ],
    [
      "Always put `;` before a line that starts with `(`, `[`, or `` ` `` if you omit s",
      "`return` then a newline then a value returns undefined."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Semicolons / ASI and where does a beginner first see it?",
      "answerHint": "Automatic Semicolon Insertion (ASI) inserts `;` when the parser would otherwise error, at newlines in restricted productions (`return`, `throw`, `break`, `continue`, `++`/`--` postfix), and at EOF. It does not insert semicolons everywhere a newline appears. Leading `(` `[` `` ` `` `/` `+` `-` on the next line can continue the previous statement."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Semicolons / ASI works and name the main pitfall.",
      "answerHint": "Always put `;` before a line that starts with `(`, `[`, or `` ` `` if you omit semicolons style-wise. `return` then a newline then a value returns undefined. Prefix `++` on the next line can apply to the previous expression. Use a linter (semicolon or no-semicolon style, but consistent). Pitfall: `return\\n{...}` returns undefined; the braces become a block, not an object."
    },
    {
      "level": "advanced",
      "question": "How would you explain Semicolons / ASI at an interview, including engine/spec details?",
      "answerHint": "Restricted productions forbid LineTerminator between return/throw/break/continue and their expressions. ASI is specified as a token insertion when parse fails, not a pre-pass that adds semicolons blindly. ++/-- postfix cannot have a newline before the operator (restricted production)."
    }
  ],
  "pitfalls": [
    "`return\\n{...}` returns undefined; the braces become a block, not an object.",
    "Use a linter (semicolon or no-semicolon style, but consistent)."
  ],
  "interview": {
    "expectations": [
      "Explain Semicolons / ASI without mixing it up with a nearby B1.1 — JavaScript Foundations topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Restricted productions forbid LineTerminator between return/throw/break/continue and their expressions."
    ],
    "commonQuestions": [
      "What is Semicolons / ASI?",
      "Why does JavaScript semicolons / asi behave this way?",
      "What is the classic Semicolons / ASI interview trap?"
    ],
    "traps": [
      "`return\\n{...}` returns undefined; the braces become a block, not an object."
    ],
    "misconceptions": [
      "Brendan Eich wanted a friendlier syntax for amateurs. The compromise was optional semicolons with a precise (and sharp) insertion algorithm."
    ],
    "strongSignals": [
      "Separates Semicolons / ASI from lookalike APIs and can draw the mental model."
    ]
  }
})
