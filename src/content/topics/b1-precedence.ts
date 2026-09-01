import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Operator Precedence & Associativity",
  "whatIsIt": "Precedence decides which operator binds first: ** before * / %, those before + -, then comparisons, then &&, then ||, then assignments (lowest among these). Associativity decides same-level grouping: most left-to-right; ** and = are right-to-right. Parentheses beat all of it. Unary binds tighter than binary *.",
  "whyExists": "A grammar must pick one tree for `1 + 2 * 3`. Humans should not have to memorize every row — parentheses are cheap.",
  "mentalModel": "A binding-power ladder. When unsure, wrap it. Interviewers still expect * over + and && over ||.",
  "how": [
    "Parenthesize mixed && and ||.",
    "Parenthesize bit ops; they are surprisingly low vs comparisons in JS.",
    "Do not rely on ASI plus prefix operators for grouping.",
    "Read ** as right-associative: 2 ** 3 ** 2 is 2 ** (3 ** 2)."
  ],
  "callout": {
    "title": "Watch for",
    "text": "1 < 2 < 3 is true but 3 > 2 > 1 is false because (true > 1) → (1 > 1). JS has no between operator.",
    "variant": "warning"
  },
  "example": "console.log(1 + 2 * 3, (1 + 2) * 3);\nconsole.log(true || false && false);\nconsole.log(2 ** 3 ** 2, (2 ** 3) ** 2);\nconsole.log(1 < 2 < 3, 3 > 2 > 1);\nconsole.log(4 / 2 / 2);\n",
  "exampleCaption": "Precedence, associativity, and chained comparisons",
  "internals": [
    "The syntactic grammar encodes precedence via nested expression nonterminals.",
    "Bitwise & sits below equality, unlike C — a & b === c parses as a & (b === c).",
    "Comma operator has the lowest precedence of all."
  ],
  "takeaways": [
    "Parenthesize mixed && and ||.",
    "Parenthesize bit ops; they are surprisingly low vs comparisons in JS.",
    "1 < 2 < 3 is true but 3 > 2 > 1 is false because (true > 1) → (1 > 1). JS has no between operator.",
    "The syntactic grammar encodes precedence via nested expression nonterminals."
  ],
  "revision": [
    "Operator Precedence & Associativity: A binding-power ladder. When unsure, wrap it. Interviewers still expect * over + and && over ||.",
    "Parenthesize mixed && and ||.",
    "Parenthesize bit ops; they are surprisingly low vs comparisons in JS.",
    "Do not rely on ASI plus prefix operators for grouping.",
    "Trap: 1 < 2 < 3 is true but 3 > 2 > 1 is false because (true > 1) → (1 > 1). JS has no between operator."
  ],
  "flashcards": [
    [
      "Operator Precedence & Associativity",
      "Precedence decides which operator binds first: ** before * / %, those before + -, then comparisons, then &&, then ||, then assignments (lowest among these)."
    ],
    [
      "Mental model",
      "A binding-power ladder. When unsure, wrap it. Interviewers still expect * over + and && over ||."
    ],
    [
      "Common trap",
      "1 < 2 < 3 is true but 3 > 2 > 1 is false because (true > 1) → (1 > 1). JS has no between operator."
    ],
    [
      "Parenthesize mixed && and ||.",
      "Parenthesize bit ops; they are surprisingly low vs comparisons in JS."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Operator Precedence & Associativity and where does a beginner first see it?",
      "answerHint": "Precedence decides which operator binds first: ** before * / %, those before + -, then comparisons, then &&, then ||, then assignments (lowest among these). Associativity decides same-level grouping: most left-to-right; ** and = are right-to-right. Parentheses beat all of it. Unary binds tighter than binary *."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Operator Precedence & Associativity works and name the main pitfall.",
      "answerHint": "Parenthesize mixed && and ||. Parenthesize bit ops; they are surprisingly low vs comparisons in JS. Do not rely on ASI plus prefix operators for grouping. Read ** as right-associative: 2 ** 3 ** 2 is 2 ** (3 ** 2). Pitfall: 1 < 2 < 3 is true but 3 > 2 > 1 is false because (true > 1) → (1 > 1). JS has no between operator."
    },
    {
      "level": "advanced",
      "question": "How would you explain Operator Precedence & Associativity at an interview, including engine/spec details?",
      "answerHint": "The syntactic grammar encodes precedence via nested expression nonterminals. Bitwise & sits below equality, unlike C — a & b === c parses as a & (b === c). Comma operator has the lowest precedence of all."
    }
  ],
  "pitfalls": [
    "1 < 2 < 3 is true but 3 > 2 > 1 is false because (true > 1) → (1 > 1). JS has no between operator.",
    "Read ** as right-associative: 2 ** 3 ** 2 is 2 ** (3 ** 2)."
  ],
  "interview": {
    "expectations": [
      "Explain Operator Precedence & Associativity without mixing it up with a nearby B1.5 — Operators & Expressions topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "The syntactic grammar encodes precedence via nested expression nonterminals."
    ],
    "commonQuestions": [
      "What is Operator Precedence & Associativity?",
      "Why does JavaScript operator precedence & associativity behave this way?",
      "What is the classic Operator Precedence & Associativity interview trap?"
    ],
    "traps": [
      "1 < 2 < 3 is true but 3 > 2 > 1 is false because (true > 1) → (1 > 1). JS has no between operator."
    ],
    "misconceptions": [
      "A grammar must pick one tree for `1 + 2 * 3`. Humans should not have to memorize every row — parentheses are cheap."
    ],
    "strongSignals": [
      "Separates Operator Precedence & Associativity from lookalike APIs and can draw the mental model."
    ]
  }
})
