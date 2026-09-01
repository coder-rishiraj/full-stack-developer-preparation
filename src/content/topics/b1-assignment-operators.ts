import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Assignment Operators",
  "whatIsIt": "= assigns. Compound operators (+= -= *= /= %= **= <<= >>= &= |= ^=) read the left, compute, write back. Logical assignment (&&= ||= ??=) short-circuits and may skip the write. Assignment is an expression returning the written value. Destructuring assignment unpacks on the left.",
  "whyExists": "Updating stored values is the write half of variables. Compound forms avoid repeating a long left-hand side.",
  "mentalModel": "Compute a new primitive/object pointer, then PutValue into the reference on the left.",
  "how": [
    "x += 1 is not always identical to x = x + 1 when getters have side effects (x is evaluated once in compound).",
    "const forbids = and compound assignment on the binding.",
    "obj.prop += 1 can invoke getters/setters.",
    "Do not confuse = with === in conditions."
  ],
  "callout": {
    "title": "Watch for",
    "text": "if (x = 1) assigns and is always truthy for 1 — a classic bug vs ===.",
    "variant": "warning"
  },
  "example": "let n = 10;\nn += 5;\nn *= 2;\nlet s = 'a';\ns += 'b';\nconst o = { x: 1 };\no.x += 3;\nconsole.log(n, s, o.x, (n = 4));\n",
  "exampleCaption": "Compound assignment on numbers, strings, properties",
  "internals": [
    "AssignmentExpression uses LeftHandSide and PutValue.",
    "Compound: lref, lval = GetValue, r, then apply op, PutValue.",
    "Logical assignment uses Boolean tests and may not call setters if short-circuit skips."
  ],
  "takeaways": [
    "x += 1 is not always identical to x = x + 1 when getters have side effects (x is evaluated once in compound).",
    "const forbids = and compound assignment on the binding.",
    "if (x = 1) assigns and is always truthy for 1 — a classic bug vs ===.",
    "AssignmentExpression uses LeftHandSide and PutValue."
  ],
  "revision": [
    "Assignment Operators: Compute a new primitive/object pointer, then PutValue into the reference on the left.",
    "x += 1 is not always identical to x = x + 1 when getters have side effects (x is evaluated once in compound).",
    "const forbids = and compound assignment on the binding.",
    "obj.prop += 1 can invoke getters/setters.",
    "Trap: if (x = 1) assigns and is always truthy for 1 — a classic bug vs ===."
  ],
  "flashcards": [
    [
      "Assignment Operators",
      "= assigns."
    ],
    [
      "Mental model",
      "Compute a new primitive/object pointer, then PutValue into the reference on the left."
    ],
    [
      "Common trap",
      "if (x = 1) assigns and is always truthy for 1 — a classic bug vs ===."
    ],
    [
      "x += 1 is not always identical to x = x + 1 when getters have side effects (x is",
      "const forbids = and compound assignment on the binding."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Assignment Operators and where does a beginner first see it?",
      "answerHint": "= assigns. Compound operators (+= -= *= /= %= **= <<= >>= &= |= ^=) read the left, compute, write back. Logical assignment (&&= ||= ??=) short-circuits and may skip the write. Assignment is an expression returning the written value. Destructuring assignment unpacks on the left."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Assignment Operators works and name the main pitfall.",
      "answerHint": "x += 1 is not always identical to x = x + 1 when getters have side effects (x is evaluated once in compound). const forbids = and compound assignment on the binding. obj.prop += 1 can invoke getters/setters. Do not confuse = with === in conditions. Pitfall: if (x = 1) assigns and is always truthy for 1 — a classic bug vs ===."
    },
    {
      "level": "advanced",
      "question": "How would you explain Assignment Operators at an interview, including engine/spec details?",
      "answerHint": "AssignmentExpression uses LeftHandSide and PutValue. Compound: lref, lval = GetValue, r, then apply op, PutValue. Logical assignment uses Boolean tests and may not call setters if short-circuit skips."
    }
  ],
  "pitfalls": [
    "if (x = 1) assigns and is always truthy for 1 — a classic bug vs ===.",
    "Do not confuse = with === in conditions."
  ],
  "interview": {
    "expectations": [
      "Explain Assignment Operators without mixing it up with a nearby B1.5 — Operators & Expressions topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "AssignmentExpression uses LeftHandSide and PutValue."
    ],
    "commonQuestions": [
      "What is Assignment Operators?",
      "Why does JavaScript assignment operators behave this way?",
      "What is the classic Assignment Operators interview trap?"
    ],
    "traps": [
      "if (x = 1) assigns and is always truthy for 1 — a classic bug vs ===."
    ],
    "misconceptions": [
      "Updating stored values is the write half of variables. Compound forms avoid repeating a long left-hand side."
    ],
    "strongSignals": [
      "Separates Assignment Operators from lookalike APIs and can draw the mental model."
    ]
  }
})
