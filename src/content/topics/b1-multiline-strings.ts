import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Multiline Strings",
  "whatIsIt": "Template literals keep real newlines. Classic strings need \\n or string concatenation. Leading indentation in templates is part of the string unless you trim or use a tagged unindent helper. Windows vs Unix newlines depend on the source file.",
  "whyExists": "HTML snippets and SQL in tests are painful as one long line. Backticks made multiline a literal instead of a \\n puzzle.",
  "mentalModel": "What you type between backticks is what you get, including the spaces you used to indent the code.",
  "how": [
    "Use trim() or trimStart() on multiline templates.",
    "Prefer \\n in classic strings for single-line source.",
    "Be careful shipping templates that contain extra indentation in output.",
    "split(/\\r?\\n/) if you need portable line breaks."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Copy-pasting a template into HTML injects the same indentation spaces you used in the editor.",
    "variant": "warning"
  },
  "example": "const poem = `alpha\nbeta`;\nconsole.log(poem.split('\\n'));\nconst indented = `\n  hello\n`.trim();\nconsole.log(JSON.stringify(indented));\nconst classic = 'alpha\\nbeta';\nconsole.log(classic === poem);\n",
  "exampleCaption": "Template newlines vs classic \\n",
  "internals": [
    "LineTerminator sequences in TemplateCharacters become part of cooked strings.",
    "Source text CRLF may normalize depending on the parser/host file read.",
    "classic LineContinuation (backslash + newline) is not a character in the string."
  ],
  "takeaways": [
    "Use trim() or trimStart() on multiline templates.",
    "Prefer \\n in classic strings for single-line source.",
    "Copy-pasting a template into HTML injects the same indentation spaces you used in the editor.",
    "LineTerminator sequences in TemplateCharacters become part of cooked strings."
  ],
  "revision": [
    "Multiline Strings: What you type between backticks is what you get, including the spaces you used to indent the code.",
    "Use trim() or trimStart() on multiline templates.",
    "Prefer \\n in classic strings for single-line source.",
    "Be careful shipping templates that contain extra indentation in output.",
    "Trap: Copy-pasting a template into HTML injects the same indentation spaces you used in the editor."
  ],
  "flashcards": [
    [
      "Multiline Strings",
      "Template literals keep real newlines."
    ],
    [
      "Mental model",
      "What you type between backticks is what you get, including the spaces you used to indent the code."
    ],
    [
      "Common trap",
      "Copy-pasting a template into HTML injects the same indentation spaces you used in the editor."
    ],
    [
      "Use trim() or trimStart() on multiline templates.",
      "Prefer \\n in classic strings for single-line source."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Multiline Strings and where does a beginner first see it?",
      "answerHint": "Template literals keep real newlines. Classic strings need \\n or string concatenation. Leading indentation in templates is part of the string unless you trim or use a tagged unindent helper. Windows vs Unix newlines depend on the source file."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Multiline Strings works and name the main pitfall.",
      "answerHint": "Use trim() or trimStart() on multiline templates. Prefer \\n in classic strings for single-line source. Be careful shipping templates that contain extra indentation in output. split(/\\r?\\n/) if you need portable line breaks. Pitfall: Copy-pasting a template into HTML injects the same indentation spaces you used in the editor."
    },
    {
      "level": "advanced",
      "question": "How would you explain Multiline Strings at an interview, including engine/spec details?",
      "answerHint": "LineTerminator sequences in TemplateCharacters become part of cooked strings. Source text CRLF may normalize depending on the parser/host file read. classic LineContinuation (backslash + newline) is not a character in the string."
    }
  ],
  "pitfalls": [
    "Copy-pasting a template into HTML injects the same indentation spaces you used in the editor.",
    "split(/\\r?\\n/) if you need portable line breaks."
  ],
  "interview": {
    "expectations": [
      "Explain Multiline Strings without mixing it up with a nearby B1.7 — Strings topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "LineTerminator sequences in TemplateCharacters become part of cooked strings."
    ],
    "commonQuestions": [
      "What is Multiline Strings?",
      "Why does JavaScript multiline strings behave this way?",
      "What is the classic Multiline Strings interview trap?"
    ],
    "traps": [
      "Copy-pasting a template into HTML injects the same indentation spaces you used in the editor."
    ],
    "misconceptions": [
      "HTML snippets and SQL in tests are painful as one long line. Backticks made multiline a literal instead of a \\n puzzle."
    ],
    "strongSignals": [
      "Separates Multiline Strings from lookalike APIs and can draw the mental model."
    ]
  }
})
