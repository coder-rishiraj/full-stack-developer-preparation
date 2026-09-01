import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "!= and !==",
  "whatIsIt": "!= is the negation of == (abstract). !== is the negation of === (strict). They do not invert each operand; they invert the comparison result. Prefer !==. x != null is a common idiom meaning ‘neither null nor undefined.’",
  "whyExists": "If equality is overloaded, inequality must follow the same tables so `!(a == b)` matches `a != b`.",
  "mentalModel": "Put a NOT in front of the whole equality test, not inside the values.",
  "how": [
    "Use !== unless you intentionally want ==’s coercions.",
    "x != null is the allowed loose exception in many codebases.",
    "Do not mix != 0 with missing-value checks.",
    "Remember NaN !== NaN is true."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Writing x != NaN to detect NaN — it is always true because NaN != everything, including NaN.",
    "variant": "warning"
  },
  "example": "console.log(1 != '1', 1 !== '1');\nconsole.log(null != undefined, null !== undefined);\nconst x = 0;\nconsole.log(x != null, x !== null, x != 0);\nconsole.log(NaN != NaN, NaN !== NaN);\n",
  "exampleCaption": "!= follows ==; !== follows ===",
  "internals": [
    "a != b is specified as !(a == b), sharing Abstract Equality.",
    "a !== b is !(a === b).",
    "No extra ToBoolean is applied to the operands of !=."
  ],
  "takeaways": [
    "Use !== unless you intentionally want ==’s coercions.",
    "x != null is the allowed loose exception in many codebases.",
    "Writing x != NaN to detect NaN — it is always true because NaN != everything, including NaN.",
    "a != b is specified as !(a == b), sharing Abstract Equality."
  ],
  "revision": [
    "!= and !==: Put a NOT in front of the whole equality test, not inside the values.",
    "Use !== unless you intentionally want ==’s coercions.",
    "x != null is the allowed loose exception in many codebases.",
    "Do not mix != 0 with missing-value checks.",
    "Trap: Writing x != NaN to detect NaN — it is always true because NaN != everything, including NaN."
  ],
  "flashcards": [
    [
      "!= and !==",
      "!= is the negation of == (abstract)."
    ],
    [
      "Mental model",
      "Put a NOT in front of the whole equality test, not inside the values."
    ],
    [
      "Common trap",
      "Writing x != NaN to detect NaN — it is always true because NaN != everything, including NaN."
    ],
    [
      "Use !== unless you intentionally want ==’s coercions.",
      "x != null is the allowed loose exception in many codebases."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is != and !== and where does a beginner first see it?",
      "answerHint": "!= is the negation of == (abstract). !== is the negation of === (strict). They do not invert each operand; they invert the comparison result. Prefer !==. x != null is a common idiom meaning ‘neither null nor undefined.’"
    },
    {
      "level": "intermediate",
      "question": "Walk through how != and !== works and name the main pitfall.",
      "answerHint": "Use !== unless you intentionally want ==’s coercions. x != null is the allowed loose exception in many codebases. Do not mix != 0 with missing-value checks. Remember NaN !== NaN is true. Pitfall: Writing x != NaN to detect NaN — it is always true because NaN != everything, including NaN."
    },
    {
      "level": "advanced",
      "question": "How would you explain != and !== at an interview, including engine/spec details?",
      "answerHint": "a != b is specified as !(a == b), sharing Abstract Equality. a !== b is !(a === b). No extra ToBoolean is applied to the operands of !=."
    }
  ],
  "pitfalls": [
    "Writing x != NaN to detect NaN — it is always true because NaN != everything, including NaN.",
    "Remember NaN !== NaN is true."
  ],
  "interview": {
    "expectations": [
      "Explain != and !== without mixing it up with a nearby B1.4 — Type Conversion & Coercion topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "a != b is specified as !(a == b), sharing Abstract Equality."
    ],
    "commonQuestions": [
      "What is != and !==?",
      "Why does JavaScript != and !== behave this way?",
      "What is the classic != and !== interview trap?"
    ],
    "traps": [
      "Writing x != NaN to detect NaN — it is always true because NaN != everything, including NaN."
    ],
    "misconceptions": [
      "If equality is overloaded, inequality must follow the same tables so `!(a == b)` matches `a != b`."
    ],
    "strongSignals": [
      "Separates != and !== from lookalike APIs and can draw the mental model."
    ]
  }
})
