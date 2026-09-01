import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Unary +",
  "whatIsIt": "Unary plus (+x) is ToNumber in operator form: +'12' is 12, +true is 1, +[] is 0, +{} is NaN, +null is 0. It is popular for coercing numeric strings quickly. Dates become milliseconds. It does not parse units like parseInt.",
  "whyExists": "A terse numeric cast matches C’s unary plus and keeps expressions compact in numeric code.",
  "mentalModel": "A pocket Number() button glued to the front of a value.",
  "how": [
    "Use +str only when you know the string is a clean number.",
    "Prefer Number() in team code if + is easy to miss next to concatenation.",
    "+new Date() is timestamp; date arithmetic often wants that.",
    "Do not use + to copy arrays or objects."
  ],
  "callout": {
    "title": "Watch for",
    "text": "+' ' is 0; empty and whitespace become 0, same as Number('').",
    "variant": "warning"
  },
  "example": "console.log(+'42', +true, +false, +null, +undefined);\nconsole.log(+[], +[1], +['2'], +{});\nconsole.log(+new Date('2020-01-01T00:00:00Z'));\nconst s = '7';\nconsole.log(+s + +s, s + s);\n",
  "exampleCaption": "Unary plus vs string concatenation",
  "internals": [
    "Unary + evaluates ToNumber(GetValue(expr)).",
    "Array ToPrimitive uses toString join; empty array → '' → 0.",
    "BigInt throws TypeError under unary +."
  ],
  "takeaways": [
    "Use +str only when you know the string is a clean number.",
    "Prefer Number() in team code if + is easy to miss next to concatenation.",
    "+' ' is 0; empty and whitespace become 0, same as Number('').",
    "Unary + evaluates ToNumber(GetValue(expr))."
  ],
  "revision": [
    "Unary +: A pocket Number() button glued to the front of a value.",
    "Use +str only when you know the string is a clean number.",
    "Prefer Number() in team code if + is easy to miss next to concatenation.",
    "+new Date() is timestamp; date arithmetic often wants that.",
    "Trap: +' ' is 0; empty and whitespace become 0, same as Number('')."
  ],
  "flashcards": [
    [
      "Unary +",
      "Unary plus (+x) is ToNumber in operator form: +'12' is 12, +true is 1, +[] is 0, +{} is NaN, +null is 0."
    ],
    [
      "Mental model",
      "A pocket Number() button glued to the front of a value."
    ],
    [
      "Common trap",
      "+' ' is 0; empty and whitespace become 0, same as Number('')."
    ],
    [
      "Use +str only when you know the string is a clean number.",
      "Prefer Number() in team code if + is easy to miss next to concatenation."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Unary + and where does a beginner first see it?",
      "answerHint": "Unary plus (+x) is ToNumber in operator form: +'12' is 12, +true is 1, +[] is 0, +{} is NaN, +null is 0. It is popular for coercing numeric strings quickly. Dates become milliseconds. It does not parse units like parseInt."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Unary + works and name the main pitfall.",
      "answerHint": "Use +str only when you know the string is a clean number. Prefer Number() in team code if + is easy to miss next to concatenation. +new Date() is timestamp; date arithmetic often wants that. Do not use + to copy arrays or objects. Pitfall: +' ' is 0; empty and whitespace become 0, same as Number('')."
    },
    {
      "level": "advanced",
      "question": "How would you explain Unary + at an interview, including engine/spec details?",
      "answerHint": "Unary + evaluates ToNumber(GetValue(expr)). Array ToPrimitive uses toString join; empty array → '' → 0. BigInt throws TypeError under unary +."
    }
  ],
  "pitfalls": [
    "+' ' is 0; empty and whitespace become 0, same as Number('').",
    "Do not use + to copy arrays or objects."
  ],
  "interview": {
    "expectations": [
      "Explain Unary + without mixing it up with a nearby B1.4 — Type Conversion & Coercion topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Unary + evaluates ToNumber(GetValue(expr))."
    ],
    "commonQuestions": [
      "What is Unary +?",
      "Why does JavaScript unary + behave this way?",
      "What is the classic Unary + interview trap?"
    ],
    "traps": [
      "+' ' is 0; empty and whitespace become 0, same as Number('')."
    ],
    "misconceptions": [
      "A terse numeric cast matches C’s unary plus and keeps expressions compact in numeric code."
    ],
    "strongSignals": [
      "Separates Unary + from lookalike APIs and can draw the mental model."
    ]
  }
})
