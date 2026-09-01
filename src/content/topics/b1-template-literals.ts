import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Template Literals",
  "whatIsIt": "Backtick strings can interpolate ${expr}, span lines, and be tagged. They still produce strings unless a tag function returns something else. ${} uses ToString (and throws on symbols). Nested templates are allowed. They are not JSON.",
  "whyExists": "Building HTML/SQL/messages with + was noisy and error-prone. Templates made interpolation a grammar feature.",
  "mentalModel": "A string with holes. Each hole is evaluated, converted to string, then glued with the cooked text.",
  "how": [
    "Use templates instead of 'a' + x + 'b'.",
    "Do not drop untrusted input into HTML/SQL templates without escaping.",
    "Multiline keeps newlines as written.",
    "Escape backticks with \\` and ${ with \\${."
  ],
  "callout": {
    "title": "Watch for",
    "text": "`${obj}` becomes '[object Object]' unless toString/toPrimitive is defined — silent useless text.",
    "variant": "warning"
  },
  "example": "const user = 'Ada';\nconst n = 3;\nconst msg = `Hello ${user}, you have ${n} items.`;\nconst box = `line1\nline2`;\nconsole.log(msg);\nconsole.log(box.split('\\n').length);\nconsole.log(`sum=${1 + 2}`);\n",
  "exampleCaption": "Interpolation and a multiline template",
  "internals": [
    "TemplateLiteral evaluation: evaluate expressions, ToString, concatenate with cooked spans.",
    "GetTemplateObject caches a frozen array of cooked/raw strings per site.",
    "Tagged templates pass that array as the first argument (see tagged topic)."
  ],
  "takeaways": [
    "Use templates instead of 'a' + x + 'b'.",
    "Do not drop untrusted input into HTML/SQL templates without escaping.",
    "`${obj}` becomes '[object Object]' unless toString/toPrimitive is defined — silent useless text.",
    "TemplateLiteral evaluation: evaluate expressions, ToString, concatenate with cooked spans."
  ],
  "revision": [
    "Template Literals: A string with holes. Each hole is evaluated, converted to string, then glued with the cooked text.",
    "Use templates instead of 'a' + x + 'b'.",
    "Do not drop untrusted input into HTML/SQL templates without escaping.",
    "Multiline keeps newlines as written.",
    "Trap: `${obj}` becomes '[object Object]' unless toString/toPrimitive is defined — silent useless text."
  ],
  "flashcards": [
    [
      "Template Literals",
      "Backtick strings can interpolate ${expr}, span lines, and be tagged."
    ],
    [
      "Mental model",
      "A string with holes. Each hole is evaluated, converted to string, then glued with the cooked text."
    ],
    [
      "Common trap",
      "`${obj}` becomes '[object Object]' unless toString/toPrimitive is defined — silent useless text."
    ],
    [
      "Use templates instead of 'a' + x + 'b'.",
      "Do not drop untrusted input into HTML/SQL templates without escaping."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Template Literals and where does a beginner first see it?",
      "answerHint": "Backtick strings can interpolate ${expr}, span lines, and be tagged. They still produce strings unless a tag function returns something else. ${} uses ToString (and throws on symbols). Nested templates are allowed. They are not JSON."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Template Literals works and name the main pitfall.",
      "answerHint": "Use templates instead of 'a' + x + 'b'. Do not drop untrusted input into HTML/SQL templates without escaping. Multiline keeps newlines as written. Escape backticks with \\` and ${ with \\${. Pitfall: `${obj}` becomes '[object Object]' unless toString/toPrimitive is defined — silent useless text."
    },
    {
      "level": "advanced",
      "question": "How would you explain Template Literals at an interview, including engine/spec details?",
      "answerHint": "TemplateLiteral evaluation: evaluate expressions, ToString, concatenate with cooked spans. GetTemplateObject caches a frozen array of cooked/raw strings per site. Tagged templates pass that array as the first argument (see tagged topic)."
    }
  ],
  "pitfalls": [
    "`${obj}` becomes '[object Object]' unless toString/toPrimitive is defined — silent useless text.",
    "Escape backticks with \\` and ${ with \\${."
  ],
  "interview": {
    "expectations": [
      "Explain Template Literals without mixing it up with a nearby B1.7 — Strings topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "TemplateLiteral evaluation: evaluate expressions, ToString, concatenate with cooked spans."
    ],
    "commonQuestions": [
      "What is Template Literals?",
      "Why does JavaScript template literals behave this way?",
      "What is the classic Template Literals interview trap?"
    ],
    "traps": [
      "`${obj}` becomes '[object Object]' unless toString/toPrimitive is defined — silent useless text."
    ],
    "misconceptions": [
      "Building HTML/SQL/messages with + was noisy and error-prone. Templates made interpolation a grammar feature."
    ],
    "strongSignals": [
      "Separates Template Literals from lookalike APIs and can draw the mental model."
    ]
  }
})
