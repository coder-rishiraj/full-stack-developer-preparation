import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Comments",
  "whatIsIt": "Comments are source text the parser ignores: `//` to end of line and `/* */` blocks that can span lines. They do not create a token the runtime sees, except that they still occupy lines for stack traces and source maps. HTML-style `<!--` comments exist as a web-legacy quirk in scripts, not something you should write.",
  "whyExists": "Humans need to leave intent next to code without changing behavior. Debuggers and licenses also need a place to live in the file.",
  "mentalModel": "The lexer eats comments like whitespace: they separate tokens but never become values.",
  "how": [
    "Use `//` for short notes; `/* */` for banners or temporarily wrapping code.",
    "Do not nest block comments — the first `*/` ends the comment.",
    "JSDoc `/** */` is still a comment; tools parse it, the engine does not.",
    "Never hide secrets in comments; they ship to the browser."
  ],
  "callout": {
    "title": "Watch for",
    "text": "A `*/` inside a URL or glob inside a block comment ends the comment early and causes bizarre SyntaxErrors.",
    "variant": "warning"
  },
  "example": "const tax = 0.2; // rate applied at checkout\n/* Multi-line\n   note about rounding */\nconst price = 100;\nconsole.log(price * (1 + tax));\n// const old = 0.15;",
  "exampleCaption": "Line and block comments around real code",
  "internals": [
    "Comments are skipped in the lexical grammar as InputElement whitespace-like productions.",
    "Source maps map generated lines back; stripped comments can confuse that mapping if not handled.",
    "Annex B allows HTML comments in non-module scripts for ancient pages."
  ],
  "takeaways": [
    "Use `//` for short notes; `/* */` for banners or temporarily wrapping code.",
    "Do not nest block comments — the first `*/` ends the comment.",
    "A `*/` inside a URL or glob inside a block comment ends the comment early and causes bizarre SyntaxErrors.",
    "Comments are skipped in the lexical grammar as InputElement whitespace-like productions."
  ],
  "revision": [
    "Comments: The lexer eats comments like whitespace: they separate tokens but never become values.",
    "Use `//` for short notes; `/* */` for banners or temporarily wrapping code.",
    "Do not nest block comments — the first `*/` ends the comment.",
    "JSDoc `/** */` is still a comment; tools parse it, the engine does not.",
    "Trap: A `*/` inside a URL or glob inside a block comment ends the comment early and causes bizarre SyntaxErrors."
  ],
  "flashcards": [
    [
      "Comments",
      "Comments are source text the parser ignores: `//` to end of line and `/* */` blocks that can span lines."
    ],
    [
      "Mental model",
      "The lexer eats comments like whitespace: they separate tokens but never become values."
    ],
    [
      "Common trap",
      "A `*/` inside a URL or glob inside a block comment ends the comment early and causes bizarre SyntaxErrors."
    ],
    [
      "Use `//` for short notes; `/* */` for banners or temporarily wrapping code.",
      "Do not nest block comments — the first `*/` ends the comment."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Comments and where does a beginner first see it?",
      "answerHint": "Comments are source text the parser ignores: `//` to end of line and `/* */` blocks that can span lines. They do not create a token the runtime sees, except that they still occupy lines for stack traces and source maps. HTML-style `<!--` comments exist as a web-legacy quirk in scripts, not something you should write."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Comments works and name the main pitfall.",
      "answerHint": "Use `//` for short notes; `/* */` for banners or temporarily wrapping code. Do not nest block comments — the first `*/` ends the comment. JSDoc `/** */` is still a comment; tools parse it, the engine does not. Never hide secrets in comments; they ship to the browser. Pitfall: A `*/` inside a URL or glob inside a block comment ends the comment early and causes bizarre SyntaxErrors."
    },
    {
      "level": "advanced",
      "question": "How would you explain Comments at an interview, including engine/spec details?",
      "answerHint": "Comments are skipped in the lexical grammar as InputElement whitespace-like productions. Source maps map generated lines back; stripped comments can confuse that mapping if not handled. Annex B allows HTML comments in non-module scripts for ancient pages."
    }
  ],
  "pitfalls": [
    "A `*/` inside a URL or glob inside a block comment ends the comment early and causes bizarre SyntaxErrors.",
    "Never hide secrets in comments; they ship to the browser."
  ],
  "interview": {
    "expectations": [
      "Explain Comments without mixing it up with a nearby B1.1 — JavaScript Foundations topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Comments are skipped in the lexical grammar as InputElement whitespace-like productions."
    ],
    "commonQuestions": [
      "What is Comments?",
      "Why does JavaScript comments behave this way?",
      "What is the classic Comments interview trap?"
    ],
    "traps": [
      "A `*/` inside a URL or glob inside a block comment ends the comment early and causes bizarre SyntaxErrors."
    ],
    "misconceptions": [
      "Humans need to leave intent next to code without changing behavior. Debuggers and licenses also need a place to live in the file."
    ],
    "strongSignals": [
      "Separates Comments from lookalike APIs and can draw the mental model."
    ]
  }
})
