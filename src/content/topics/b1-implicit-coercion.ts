import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Implicit Coercion",
  "whatIsIt": "Implicit coercion happens without a constructor call: if (x), x ? a : b, x && y, x == y, 1 + x, -x, x < y. You do not see ToNumber in source, but it ran. Explicit conversion is when the source shows String/Number/Boolean/parseInt.",
  "whyExists": "Shorter UI scripts. The cost is hidden control flow that interviewers love and production teams often ban.",
  "mentalModel": "An automatic translator in the operator. You did not ask for a type change; the operator did.",
  "how": [
    "Audit ==, +, and if (maybeZero) as coercion sites.",
    "Replace with === and explicit Number/String when types are mixed.",
    "Keep ToBoolean only when empty-string/null meaning ‘skip’ is intended.",
    "Unit-test boundary values: '', 0, '0', null."
  ],
  "callout": {
    "title": "Watch for",
    "text": "null >= 0 is true while null > 0 is false and null == 0 is false — relational ops ToNumber null to 0.",
    "variant": "warning"
  },
  "example": "function implicit(x) {\n  if (x) return 'truthy branch';\n  return 'falsy branch';\n}\nconsole.log(implicit('0'), implicit(0), implicit([]));\nconsole.log('5' - 1, '5' + 1, '5' * '2');\nconsole.log(null >= 0, null == 0, null > 0);\n",
  "exampleCaption": "if-coercion vs relational vs == for null",
  "internals": [
    "IfStatement uses ToBoolean on the condition.",
    "Relational comparison uses IsLessThan which ToPrimitive then ToNumber.",
    "Multiplicative * / % always ToNumber (or ToNumeric with bigint rules)."
  ],
  "takeaways": [
    "Audit ==, +, and if (maybeZero) as coercion sites.",
    "Replace with === and explicit Number/String when types are mixed.",
    "null >= 0 is true while null > 0 is false and null == 0 is false — relational ops ToNumber null to 0.",
    "IfStatement uses ToBoolean on the condition."
  ],
  "revision": [
    "Implicit Coercion: An automatic translator in the operator. You did not ask for a type change; the operator did.",
    "Audit ==, +, and if (maybeZero) as coercion sites.",
    "Replace with === and explicit Number/String when types are mixed.",
    "Keep ToBoolean only when empty-string/null meaning ‘skip’ is intended.",
    "Trap: null >= 0 is true while null > 0 is false and null == 0 is false — relational ops ToNumber null to 0."
  ],
  "flashcards": [
    [
      "Implicit Coercion",
      "Implicit coercion happens without a constructor call: if (x), x ? a : b, x && y, x == y, 1 + x, -x, x < y."
    ],
    [
      "Mental model",
      "An automatic translator in the operator. You did not ask for a type change; the operator did."
    ],
    [
      "Common trap",
      "null >= 0 is true while null > 0 is false and null == 0 is false — relational ops ToNumber null to 0."
    ],
    [
      "Audit ==, +, and if (maybeZero) as coercion sites.",
      "Replace with === and explicit Number/String when types are mixed."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Implicit Coercion and where does a beginner first see it?",
      "answerHint": "Implicit coercion happens without a constructor call: if (x), x ? a : b, x && y, x == y, 1 + x, -x, x < y. You do not see ToNumber in source, but it ran. Explicit conversion is when the source shows String/Number/Boolean/parseInt."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Implicit Coercion works and name the main pitfall.",
      "answerHint": "Audit ==, +, and if (maybeZero) as coercion sites. Replace with === and explicit Number/String when types are mixed. Keep ToBoolean only when empty-string/null meaning ‘skip’ is intended. Unit-test boundary values: '', 0, '0', null. Pitfall: null >= 0 is true while null > 0 is false and null == 0 is false — relational ops ToNumber null to 0."
    },
    {
      "level": "advanced",
      "question": "How would you explain Implicit Coercion at an interview, including engine/spec details?",
      "answerHint": "IfStatement uses ToBoolean on the condition. Relational comparison uses IsLessThan which ToPrimitive then ToNumber. Multiplicative * / % always ToNumber (or ToNumeric with bigint rules)."
    }
  ],
  "pitfalls": [
    "null >= 0 is true while null > 0 is false and null == 0 is false — relational ops ToNumber null to 0.",
    "Unit-test boundary values: '', 0, '0', null."
  ],
  "interview": {
    "expectations": [
      "Explain Implicit Coercion without mixing it up with a nearby B1.4 — Type Conversion & Coercion topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "IfStatement uses ToBoolean on the condition."
    ],
    "commonQuestions": [
      "What is Implicit Coercion?",
      "Why does JavaScript implicit coercion behave this way?",
      "What is the classic Implicit Coercion interview trap?"
    ],
    "traps": [
      "null >= 0 is true while null > 0 is false and null == 0 is false — relational ops ToNumber null to 0."
    ],
    "misconceptions": [
      "Shorter UI scripts. The cost is hidden control flow that interviewers love and production teams often ban."
    ],
    "strongSignals": [
      "Separates Implicit Coercion from lookalike APIs and can draw the mental model."
    ]
  }
})
