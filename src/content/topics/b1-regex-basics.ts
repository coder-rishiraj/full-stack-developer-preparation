import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Regex Literals & Constructor",
  "whatIsIt": "A RegExp is a pattern object: /ab+c/i or new RegExp('ab+c', 'i'). Literals compile at parse; the constructor compiles at runtime (and needs extra escaping of \\\\). They are stateful with /g and lastIndex. JSON does not have regex. Use for matching/extracting, not for HTML.",
  "whyExists": "Text processing on the web (validation, parse) needed patterns. JS copied Perl-ish regex into the language.",
  "mentalModel": "A little machine that eats a string and reports matches. /g remembers where it left off on that regex object.",
  "how": [
    "Prefer literals when the pattern is static.",
    "Escape user input before interpolating into new RegExp.",
    "Do not parse HTML with regex.",
    "Reset lastIndex or avoid sharing /g regex globally."
  ],
  "callout": {
    "title": "Watch for",
    "text": "new RegExp('\\d') is /d/ — you needed '\\\\d'.",
    "variant": "warning"
  },
  "example": "const re = /\\d+/g;\nconsole.log('a12b3'.match(re));\nconst dyn = new RegExp('a+b', 'i');\nconsole.log(dyn.test('AAAB'));\nconsole.log(/a/.test('a'), /a/.source, /a/.flags);\n",
  "exampleCaption": "Literal vs constructor; match digits",
  "internals": [
    "RegExp exotic objects with [[OriginalSource]] and [[OriginalFlags]].",
    "lastIndex is a writable property used by exec with /g or /y.",
    "Species and @@match hooks let String methods call custom matchers."
  ],
  "takeaways": [
    "Prefer literals when the pattern is static.",
    "Escape user input before interpolating into new RegExp.",
    "new RegExp('\\d') is /d/ — you needed '\\\\d'.",
    "RegExp exotic objects with [[OriginalSource]] and [[OriginalFlags]]."
  ],
  "revision": [
    "Regex Literals & Constructor: A little machine that eats a string and reports matches. /g remembers where it left off on that regex object.",
    "Prefer literals when the pattern is static.",
    "Escape user input before interpolating into new RegExp.",
    "Do not parse HTML with regex.",
    "Trap: new RegExp('\\d') is /d/ — you needed '\\\\d'."
  ],
  "flashcards": [
    [
      "Regex Literals & Constructor",
      "A RegExp is a pattern object: /ab+c/i or new RegExp('ab+c', 'i')."
    ],
    [
      "Mental model",
      "A little machine that eats a string and reports matches. /g remembers where it left off on that regex object."
    ],
    [
      "Common trap",
      "new RegExp('\\d') is /d/ — you needed '\\\\d'."
    ],
    [
      "Prefer literals when the pattern is static.",
      "Escape user input before interpolating into new RegExp."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Regex Literals & Constructor and where does a beginner first see it?",
      "answerHint": "A RegExp is a pattern object: /ab+c/i or new RegExp('ab+c', 'i'). Literals compile at parse; the constructor compiles at runtime (and needs extra escaping of \\\\). They are stateful with /g and lastIndex. JSON does not have regex. Use for matching/extracting, not for HTML."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Regex Literals & Constructor works and name the main pitfall.",
      "answerHint": "Prefer literals when the pattern is static. Escape user input before interpolating into new RegExp. Do not parse HTML with regex. Reset lastIndex or avoid sharing /g regex globally. Pitfall: new RegExp('\\d') is /d/ — you needed '\\\\d'."
    },
    {
      "level": "advanced",
      "question": "How would you explain Regex Literals & Constructor at an interview, including engine/spec details?",
      "answerHint": "RegExp exotic objects with [[OriginalSource]] and [[OriginalFlags]]. lastIndex is a writable property used by exec with /g or /y. Species and @@match hooks let String methods call custom matchers."
    }
  ],
  "pitfalls": [
    "new RegExp('\\d') is /d/ — you needed '\\\\d'.",
    "Reset lastIndex or avoid sharing /g regex globally."
  ],
  "interview": {
    "expectations": [
      "Explain Regex Literals & Constructor without mixing it up with a nearby B1.37 — Regular Expressions topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "RegExp exotic objects with [[OriginalSource]] and [[OriginalFlags]]."
    ],
    "commonQuestions": [
      "What is Regex Literals & Constructor?",
      "Why does JavaScript regex literals & constructor behave this way?",
      "What is the classic Regex Literals & Constructor interview trap?"
    ],
    "traps": [
      "new RegExp('\\d') is /d/ — you needed '\\\\d'."
    ],
    "misconceptions": [
      "Text processing on the web (validation, parse) needed patterns. JS copied Perl-ish regex into the language."
    ],
    "strongSignals": [
      "Separates Regex Literals & Constructor from lookalike APIs and can draw the mental model."
    ]
  }
})
