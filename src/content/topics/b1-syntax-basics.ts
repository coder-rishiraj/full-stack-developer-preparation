import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Syntax Basics",
  "whatIsIt": "JavaScript programs are Unicode text: tokens (identifiers, keywords, literals, punctuators) grouped into statements and modules. Braces create blocks; parentheses group expressions and call lists. The language is case-sensitive and mostly free-form whitespace, with ASI inserting semicolons in specific places.",
  "whyExists": "A text language needs a small set of tokens so humans and parsers agree. JS borrowed C-like punctuation to feel familiar to web authors in the 1990s.",
  "mentalModel": "Source is a stream of tokens. The parser builds a tree; illegal token sequences throw SyntaxError before any runtime code runs.",
  "how": [
    "Identifiers: Unicode letters, $, _, then digits; no hyphens.",
    "Keywords cannot be binding names (`let let = 1` is invalid).",
    "Blocks `{ }` scope let/const and group statements.",
    "Use a formatter; rely on ASI only where you understand the rules."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Starting a line with `(` after a return-less expression can glue to the previous line via ASI and call a value as a function.",
    "variant": "warning"
  },
  "example": "const userName = 'Ada';\nfunction greet(name) {\n  return 'hi ' + name;\n}\nconsole.log(greet(userName));\n{ const inner = 1; console.log(inner); }",
  "exampleCaption": "Identifiers, blocks, and a function",
  "internals": [
    "Lexer: InputElementDiv vs InputElementRegExp — `/` can be division or a regex.",
    "Early errors (syntax, strict reserved words) fail before evaluation.",
    "Hashbang `#!` is allowed only as the first line of a script/module for CLIs."
  ],
  "takeaways": [
    "Identifiers: Unicode letters, $, _, then digits; no hyphens.",
    "Keywords cannot be binding names (`let let = 1` is invalid).",
    "Starting a line with `(` after a return-less expression can glue to the previous line via ASI and call a value as a function.",
    "Lexer: InputElementDiv vs InputElementRegExp — `/` can be division or a regex."
  ],
  "revision": [
    "Syntax Basics: Source is a stream of tokens. The parser builds a tree; illegal token sequences throw SyntaxError before any runtime code runs.",
    "Identifiers: Unicode letters, $, _, then digits; no hyphens.",
    "Keywords cannot be binding names (`let let = 1` is invalid).",
    "Blocks `{ }` scope let/const and group statements.",
    "Trap: Starting a line with `(` after a return-less expression can glue to the previous line via ASI and call a value as a function."
  ],
  "flashcards": [
    [
      "Syntax Basics",
      "JavaScript programs are Unicode text: tokens (identifiers, keywords, literals, punctuators) grouped into statements and modules."
    ],
    [
      "Mental model",
      "Source is a stream of tokens. The parser builds a tree; illegal token sequences throw SyntaxError before any runtime code runs."
    ],
    [
      "Common trap",
      "Starting a line with `(` after a return-less expression can glue to the previous line via ASI and call a value as a function."
    ],
    [
      "Identifiers: Unicode letters, $, _, then digits; no hyphens.",
      "Keywords cannot be binding names (`let let = 1` is invalid)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Syntax Basics and where does a beginner first see it?",
      "answerHint": "JavaScript programs are Unicode text: tokens (identifiers, keywords, literals, punctuators) grouped into statements and modules. Braces create blocks; parentheses group expressions and call lists. The language is case-sensitive and mostly free-form whitespace, with ASI inserting semicolons in specific places."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Syntax Basics works and name the main pitfall.",
      "answerHint": "Identifiers: Unicode letters, $, _, then digits; no hyphens. Keywords cannot be binding names (`let let = 1` is invalid). Blocks `{ }` scope let/const and group statements. Use a formatter; rely on ASI only where you understand the rules. Pitfall: Starting a line with `(` after a return-less expression can glue to the previous line via ASI and call a value as a function."
    },
    {
      "level": "advanced",
      "question": "How would you explain Syntax Basics at an interview, including engine/spec details?",
      "answerHint": "Lexer: InputElementDiv vs InputElementRegExp — `/` can be division or a regex. Early errors (syntax, strict reserved words) fail before evaluation. Hashbang `#!` is allowed only as the first line of a script/module for CLIs."
    }
  ],
  "pitfalls": [
    "Starting a line with `(` after a return-less expression can glue to the previous line via ASI and call a value as a function.",
    "Use a formatter; rely on ASI only where you understand the rules."
  ],
  "interview": {
    "expectations": [
      "Explain Syntax Basics without mixing it up with a nearby B1.1 — JavaScript Foundations topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Lexer: InputElementDiv vs InputElementRegExp — `/` can be division or a regex."
    ],
    "commonQuestions": [
      "What is Syntax Basics?",
      "Why does JavaScript syntax basics behave this way?",
      "What is the classic Syntax Basics interview trap?"
    ],
    "traps": [
      "Starting a line with `(` after a return-less expression can glue to the previous line via ASI and call a value as a function."
    ],
    "misconceptions": [
      "A text language needs a small set of tokens so humans and parsers agree. JS borrowed C-like punctuation to feel familiar to web authors in the 1990s."
    ],
    "strongSignals": [
      "Separates Syntax Basics from lookalike APIs and can draw the mental model."
    ]
  }
})
