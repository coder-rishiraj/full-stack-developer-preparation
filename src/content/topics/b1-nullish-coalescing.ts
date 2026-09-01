import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Nullish Coalescing",
  "whatIsIt": "?? returns the right operand only when the left is null or undefined. 0, '', and false stay. It does not short-circuit on those falsy values. Mixing ?? with && or || without parentheses is a SyntaxError. Often paired with ?.",
  "whyExists": "|| as a default operator could not represent legitimate 0 or empty string. ?? is the defaulting operator that respects those.",
  "mentalModel": "Replace only true emptiness (nullish), not ‘falsy’ emptiness.",
  "how": [
    "Use value ?? default for config and props.",
    "Parenthesize when combining with || or &&.",
    "Do not use ?? to treat '' as missing unless you also check length.",
    "?? = exists as ??= for assign-if-nullish."
  ],
  "callout": {
    "title": "Watch for",
    "text": "?? vs || is the interview: 0 is the example they will throw at you.",
    "variant": "warning"
  },
  "example": "const input = { count: 0, title: '', nick: null };\nconsole.log(input.count ?? 10, input.count || 10);\nconsole.log(input.title ?? 'n/a', input.title || 'n/a');\nconsole.log(input.nick ?? 'anon', input.missing ?? 'anon');\n",
  "exampleCaption": "?? keeps 0 and '' while || does not",
  "internals": [
    "Evaluation: if left is undefined or null, evaluate right; else return left.",
    "It does not ToBoolean the left.",
    "Grammar forbids unparenthesized mix with &&/|| to avoid precedence surprises."
  ],
  "takeaways": [
    "Use value ?? default for config and props.",
    "Parenthesize when combining with || or &&.",
    "?? vs || is the interview: 0 is the example they will throw at you.",
    "Evaluation: if left is undefined or null, evaluate right; else return left."
  ],
  "revision": [
    "Nullish Coalescing: Replace only true emptiness (nullish), not ‘falsy’ emptiness.",
    "Use value ?? default for config and props.",
    "Parenthesize when combining with || or &&.",
    "Do not use ?? to treat '' as missing unless you also check length.",
    "Trap: ?? vs || is the interview: 0 is the example they will throw at you."
  ],
  "flashcards": [
    [
      "Nullish Coalescing",
      "?? returns the right operand only when the left is null or undefined."
    ],
    [
      "Mental model",
      "Replace only true emptiness (nullish), not ‘falsy’ emptiness."
    ],
    [
      "Common trap",
      "?? vs || is the interview: 0 is the example they will throw at you."
    ],
    [
      "Use value ?? default for config and props.",
      "Parenthesize when combining with || or &&."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Nullish Coalescing and where does a beginner first see it?",
      "answerHint": "?? returns the right operand only when the left is null or undefined. 0, '', and false stay. It does not short-circuit on those falsy values. Mixing ?? with && or || without parentheses is a SyntaxError. Often paired with ?."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Nullish Coalescing works and name the main pitfall.",
      "answerHint": "Use value ?? default for config and props. Parenthesize when combining with || or &&. Do not use ?? to treat '' as missing unless you also check length. ?? = exists as ??= for assign-if-nullish. Pitfall: ?? vs || is the interview: 0 is the example they will throw at you."
    },
    {
      "level": "advanced",
      "question": "How would you explain Nullish Coalescing at an interview, including engine/spec details?",
      "answerHint": "Evaluation: if left is undefined or null, evaluate right; else return left. It does not ToBoolean the left. Grammar forbids unparenthesized mix with &&/|| to avoid precedence surprises."
    }
  ],
  "pitfalls": [
    "?? vs || is the interview: 0 is the example they will throw at you.",
    "?? = exists as ??= for assign-if-nullish."
  ],
  "interview": {
    "expectations": [
      "Explain Nullish Coalescing without mixing it up with a nearby B1.5 — Operators & Expressions topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Evaluation: if left is undefined or null, evaluate right; else return left."
    ],
    "commonQuestions": [
      "What is Nullish Coalescing?",
      "Why does JavaScript nullish coalescing behave this way?",
      "What is the classic Nullish Coalescing interview trap?"
    ],
    "traps": [
      "?? vs || is the interview: 0 is the example they will throw at you."
    ],
    "misconceptions": [
      "|| as a default operator could not represent legitimate 0 or empty string. ?? is the defaulting operator that respects those."
    ],
    "strongSignals": [
      "Separates Nullish Coalescing from lookalike APIs and can draw the mental model."
    ]
  }
})
