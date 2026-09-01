import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Escape Sequences",
  "whatIsIt": "In strings, \\n \\t \\\\ \\' \\\" \\uXXXX \\u{...} \\xHH insert special characters. Templates also use \\` and \\${. A trailing \\ before a real newline continues a classic string. Invalid \\u in strict mode is a SyntaxError. /regex/ has its own escapes.",
  "whyExists": "Text literals must represent quotes, backslashes, and non-typable code points inside ASCII-friendly source.",
  "mentalModel": "Backslash is a shift key for the next character(s). If you need a real backslash, write two.",
  "how": [
    "Use \\u{1F642} for code points above FFFF in modern engines.",
    "JSON only allows a subset of JS escapes — JSON.parse('\\\\') rules differ.",
    "Prefer templates over messy quote escaping when possible.",
    "Remember Windows paths: 'C:\\\\Users' or String.raw."
  ],
  "callout": {
    "title": "Watch for",
    "text": "JSON.stringify already adds quotes and escapes; wrapping it in another template can double-escape.",
    "variant": "warning"
  },
  "example": "console.log('line\\nnext');\nconsole.log('quote\\'s');\nconsole.log('\\u0041', '\\u{1F642}');\nconsole.log('C:\\\\temp');\nconsole.log(String.raw`C:\\temp`);\n",
  "exampleCaption": "Common escapes vs String.raw",
  "internals": [
    "EscapeSequence productions differ in StringLiteral vs Template vs Regex.",
    "String.raw uses the raw template array, skipping cooked escape processing.",
    "Legacy octal escapes are banned in strict mode / templates."
  ],
  "takeaways": [
    "Use \\u{1F642} for code points above FFFF in modern engines.",
    "JSON only allows a subset of JS escapes — JSON.parse('\\\\') rules differ.",
    "JSON.stringify already adds quotes and escapes; wrapping it in another template can double-escape.",
    "EscapeSequence productions differ in StringLiteral vs Template vs Regex."
  ],
  "revision": [
    "Escape Sequences: Backslash is a shift key for the next character(s). If you need a real backslash, write two.",
    "Use \\u{1F642} for code points above FFFF in modern engines.",
    "JSON only allows a subset of JS escapes — JSON.parse('\\\\') rules differ.",
    "Prefer templates over messy quote escaping when possible.",
    "Trap: JSON.stringify already adds quotes and escapes; wrapping it in another template can double-escape."
  ],
  "flashcards": [
    [
      "Escape Sequences",
      "In strings, \\n \\t \\\\ \\' \\\" \\uXXXX \\u{...} \\xHH insert special characters."
    ],
    [
      "Mental model",
      "Backslash is a shift key for the next character(s). If you need a real backslash, write two."
    ],
    [
      "Common trap",
      "JSON.stringify already adds quotes and escapes; wrapping it in another template can double-escape."
    ],
    [
      "Use \\u{1F642} for code points above FFFF in modern engines.",
      "JSON only allows a subset of JS escapes — JSON.parse('\\\\') rules differ."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Escape Sequences and where does a beginner first see it?",
      "answerHint": "In strings, \\n \\t \\\\ \\' \\\" \\uXXXX \\u{...} \\xHH insert special characters. Templates also use \\` and \\${. A trailing \\ before a real newline continues a classic string. Invalid \\u in strict mode is a SyntaxError. /regex/ has its own escapes."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Escape Sequences works and name the main pitfall.",
      "answerHint": "Use \\u{1F642} for code points above FFFF in modern engines. JSON only allows a subset of JS escapes — JSON.parse('\\\\') rules differ. Prefer templates over messy quote escaping when possible. Remember Windows paths: 'C:\\\\Users' or String.raw. Pitfall: JSON.stringify already adds quotes and escapes; wrapping it in another template can double-escape."
    },
    {
      "level": "advanced",
      "question": "How would you explain Escape Sequences at an interview, including engine/spec details?",
      "answerHint": "EscapeSequence productions differ in StringLiteral vs Template vs Regex. String.raw uses the raw template array, skipping cooked escape processing. Legacy octal escapes are banned in strict mode / templates."
    }
  ],
  "pitfalls": [
    "JSON.stringify already adds quotes and escapes; wrapping it in another template can double-escape.",
    "Remember Windows paths: 'C:\\\\Users' or String.raw."
  ],
  "interview": {
    "expectations": [
      "Explain Escape Sequences without mixing it up with a nearby B1.7 — Strings topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "EscapeSequence productions differ in StringLiteral vs Template vs Regex."
    ],
    "commonQuestions": [
      "What is Escape Sequences?",
      "Why does JavaScript escape sequences behave this way?",
      "What is the classic Escape Sequences interview trap?"
    ],
    "traps": [
      "JSON.stringify already adds quotes and escapes; wrapping it in another template can double-escape."
    ],
    "misconceptions": [
      "Text literals must represent quotes, backslashes, and non-typable code points inside ASCII-friendly source."
    ],
    "strongSignals": [
      "Separates Escape Sequences from lookalike APIs and can draw the mental model."
    ]
  }
})
