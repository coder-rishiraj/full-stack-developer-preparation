import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Classes, Quantifiers, Anchors, Flags",
  "whatIsIt": "Character classes [abc], [^a], \\d\\w\\s, . (not always newline unless /s). Quantifiers * + ? {n,m} are greedy; add ? for lazy. Anchors ^ $ \\b. Flags: g i m s u y d. u/v enable Unicode modes. . does not match \\n without s. ^/$ are line-based with m.",
  "whyExists": "A small pattern language packs a parser into a string. Flags change the machine’s dialect.",
  "mentalModel": "Classes pick a character; quantifiers repeat; anchors pin position; flags flip switches on the engine.",
  "how": [
    "Use \\\\b for word edges, not spaces only.",
    "/u for Unicode property \\p{L} (in supporting engines).",
    "Greedy vs lazy: .* vs .*? matters for HTML-like text.",
    "y (sticky) matches only at lastIndex."
  ],
  "callout": {
    "title": "Watch for",
    "text": "/./ matches any character except line terminators unless the s flag is set.",
    "variant": "warning"
  },
  "example": "console.log(/a+/.exec('xaaay'));\nconsole.log(/a+?/.exec('xaaay'));\nconsole.log(/^\\d+$/.test('12'), /^\\d+$/.test('12\\n3'));\nconsole.log(/foo.bar/s.test('foo\\nbar'));\nconsole.log(/\\bjs\\b/i.test('JS rocks'));\n",
  "exampleCaption": "Greedy vs lazy, anchors, dotAll, word boundary",
  "internals": [
    "RegExp matcher is specified with NFA-like semantics (backtracking).",
    "Unicode sets with /v are a newer grammar.",
    "m flag makes ^/$ match at LineTerminator boundaries."
  ],
  "takeaways": [
    "Use \\\\b for word edges, not spaces only.",
    "/u for Unicode property \\p{L} (in supporting engines).",
    "/./ matches any character except line terminators unless the s flag is set.",
    "RegExp matcher is specified with NFA-like semantics (backtracking)."
  ],
  "revision": [
    "Classes, Quantifiers, Anchors, Flags: Classes pick a character; quantifiers repeat; anchors pin position; flags flip switches on the engine.",
    "Use \\\\b for word edges, not spaces only.",
    "/u for Unicode property \\p{L} (in supporting engines).",
    "Greedy vs lazy: .* vs .*? matters for HTML-like text.",
    "Trap: /./ matches any character except line terminators unless the s flag is set."
  ],
  "flashcards": [
    [
      "Classes, Quantifiers, Anchors, Flags",
      "Character classes [abc], [^a], \\d\\w\\s, ."
    ],
    [
      "Mental model",
      "Classes pick a character; quantifiers repeat; anchors pin position; flags flip switches on the engine."
    ],
    [
      "Common trap",
      "/./ matches any character except line terminators unless the s flag is set."
    ],
    [
      "Use \\\\b for word edges, not spaces only.",
      "/u for Unicode property \\p{L} (in supporting engines)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Classes, Quantifiers, Anchors, Flags and where does a beginner first see it?",
      "answerHint": "Character classes [abc], [^a], \\d\\w\\s, . (not always newline unless /s). Quantifiers * + ? {n,m} are greedy; add ? for lazy. Anchors ^ $ \\b. Flags: g i m s u y d. u/v enable Unicode modes. . does not match \\n without s. ^/$ are line-based with m."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Classes, Quantifiers, Anchors, Flags works and name the main pitfall.",
      "answerHint": "Use \\\\b for word edges, not spaces only. /u for Unicode property \\p{L} (in supporting engines). Greedy vs lazy: .* vs .*? matters for HTML-like text. y (sticky) matches only at lastIndex. Pitfall: /./ matches any character except line terminators unless the s flag is set."
    },
    {
      "level": "advanced",
      "question": "How would you explain Classes, Quantifiers, Anchors, Flags at an interview, including engine/spec details?",
      "answerHint": "RegExp matcher is specified with NFA-like semantics (backtracking). Unicode sets with /v are a newer grammar. m flag makes ^/$ match at LineTerminator boundaries."
    }
  ],
  "pitfalls": [
    "/./ matches any character except line terminators unless the s flag is set.",
    "y (sticky) matches only at lastIndex."
  ],
  "interview": {
    "expectations": [
      "Explain Classes, Quantifiers, Anchors, Flags without mixing it up with a nearby B1.37 — Regular Expressions topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "RegExp matcher is specified with NFA-like semantics (backtracking)."
    ],
    "commonQuestions": [
      "What is Classes, Quantifiers, Anchors, Flags?",
      "Why does JavaScript classes, quantifiers, anchors, flags behave this way?",
      "What is the classic Classes, Quantifiers, Anchors, Flags interview trap?"
    ],
    "traps": [
      "/./ matches any character except line terminators unless the s flag is set."
    ],
    "misconceptions": [
      "A small pattern language packs a parser into a string. Flags change the machine’s dialect."
    ],
    "strongSignals": [
      "Separates Classes, Quantifiers, Anchors, Flags from lookalike APIs and can draw the mental model."
    ]
  }
})
