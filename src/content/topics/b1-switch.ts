import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "switch",
  "whatIsIt": "switch (x) compares x to each case with === (strict). cases fall through until break, return, or throw. default runs when nothing matches. case values are expressions, evaluated as the switch walks. One switch block means let in a case is visible in later cases.",
  "whyExists": "A jump table for many discrete values is clearer than a long else-if chain — if you remember break.",
  "mentalModel": "A strict-equality jump with optional fall-through. It is not a pattern matcher.",
  "how": [
    "Put break (or return) on every case unless fall-through is documented.",
    "Wrap case bodies in { } if they declare let/const.",
    "default can sit anywhere; it still runs only on no match.",
    "Do not expect switch(true) tricks in readable code."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Forgotten break causes fall-through — the #1 switch bug in interviews and production.",
    "variant": "warning"
  },
  "example": "function label(code) {\n  switch (code) {\n    case 200:\n    case 201:\n      return 'ok';\n    case 404:\n      return 'missing';\n    default:\n      return 'other';\n  }\n}\nconsole.log(label(200), label(201), label(500));\nswitch (1) {\n  case 1: { const x = 'one'; console.log(x); break; }\n}\n",
  "exampleCaption": "Strict cases, shared 200/201, block-scoped case",
  "internals": [
    "Case clauses use Strict Equality Comparison against the switch value.",
    "The switch has a single lexical environment for all cases.",
    "case expressions are evaluated in order until a match, then statements run."
  ],
  "takeaways": [
    "Put break (or return) on every case unless fall-through is documented.",
    "Wrap case bodies in { } if they declare let/const.",
    "Forgotten break causes fall-through — the #1 switch bug in interviews and production.",
    "Case clauses use Strict Equality Comparison against the switch value."
  ],
  "revision": [
    "switch: A strict-equality jump with optional fall-through. It is not a pattern matcher.",
    "Put break (or return) on every case unless fall-through is documented.",
    "Wrap case bodies in { } if they declare let/const.",
    "default can sit anywhere; it still runs only on no match.",
    "Trap: Forgotten break causes fall-through — the #1 switch bug in interviews and production."
  ],
  "flashcards": [
    [
      "switch",
      "switch (x) compares x to each case with === (strict)."
    ],
    [
      "Mental model",
      "A strict-equality jump with optional fall-through. It is not a pattern matcher."
    ],
    [
      "Common trap",
      "Forgotten break causes fall-through — the #1 switch bug in interviews and production."
    ],
    [
      "Put break (or return) on every case unless fall-through is documented.",
      "Wrap case bodies in { } if they declare let/const."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is switch and where does a beginner first see it?",
      "answerHint": "switch (x) compares x to each case with === (strict). cases fall through until break, return, or throw. default runs when nothing matches. case values are expressions, evaluated as the switch walks. One switch block means let in a case is visible in later cases."
    },
    {
      "level": "intermediate",
      "question": "Walk through how switch works and name the main pitfall.",
      "answerHint": "Put break (or return) on every case unless fall-through is documented. Wrap case bodies in { } if they declare let/const. default can sit anywhere; it still runs only on no match. Do not expect switch(true) tricks in readable code. Pitfall: Forgotten break causes fall-through — the #1 switch bug in interviews and production."
    },
    {
      "level": "advanced",
      "question": "How would you explain switch at an interview, including engine/spec details?",
      "answerHint": "Case clauses use Strict Equality Comparison against the switch value. The switch has a single lexical environment for all cases. case expressions are evaluated in order until a match, then statements run."
    }
  ],
  "pitfalls": [
    "Forgotten break causes fall-through — the #1 switch bug in interviews and production.",
    "Do not expect switch(true) tricks in readable code."
  ],
  "interview": {
    "expectations": [
      "Explain switch without mixing it up with a nearby B1.6 — Control Flow topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Case clauses use Strict Equality Comparison against the switch value."
    ],
    "commonQuestions": [
      "What is switch?",
      "Why does JavaScript switch behave this way?",
      "What is the classic switch interview trap?"
    ],
    "traps": [
      "Forgotten break causes fall-through — the #1 switch bug in interviews and production."
    ],
    "misconceptions": [
      "A jump table for many discrete values is clearer than a long else-if chain — if you remember break."
    ],
    "strongSignals": [
      "Separates switch from lookalike APIs and can draw the mental model."
    ]
  }
})
