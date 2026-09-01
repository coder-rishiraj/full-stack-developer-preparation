import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Comparison Operators",
  "whatIsIt": "< > <= >= use IsLessThan after ToPrimitive. If both strings, they compare UTF-16 code units lexicographically ('10' < '2'). Otherwise ToNumber (or numeric bigint rules). NaN makes every relational false, including x < x. null becomes 0 in numeric relational tests.",
  "whyExists": "Sorting and branching need order. String order was defined as code units, which is fast but not dictionary language order.",
  "mentalModel": "If both sides look like strings, dictionary of 16-bit units. Else convert to numbers and compare. NaN poisons the test to false.",
  "how": [
    "Do not sort numeric strings with > without Number().",
    "Use localeCompare for human-language order.",
    "Check Number.isNaN before trusting <= chains.",
    "null >= 0 is true — do not use relational ops as null checks."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Array.prototype.sort without a comparator uses string compare, so [10, 2] becomes [10, 2] as strings '10','2'.",
    "variant": "warning"
  },
  "example": "console.log('10' < '2', 10 < 2, '10' < 2);\nconsole.log(null > 0, null >= 0, null == 0);\nconsole.log(NaN > 1, NaN < 1, NaN >= NaN);\nconsole.log('A' < 'a', 'é' < 'f');\n",
  "exampleCaption": "String vs numeric compare; null and NaN",
  "internals": [
    "IsLessThan: ToPrimitive both; if both String, compare sequences; else ToNumeric.",
    "<= is !(greater than), so NaN <= NaN is false.",
    "BigInt vs Number comparison uses a mathematical compare without converting to IEEE in some cases."
  ],
  "takeaways": [
    "Do not sort numeric strings with > without Number().",
    "Use localeCompare for human-language order.",
    "Array.prototype.sort without a comparator uses string compare, so [10, 2] becomes [10, 2] as strings '10','2'.",
    "IsLessThan: ToPrimitive both; if both String, compare sequences; else ToNumeric."
  ],
  "revision": [
    "Comparison Operators: If both sides look like strings, dictionary of 16-bit units. Else convert to numbers and compare. NaN poisons the test to false.",
    "Do not sort numeric strings with > without Number().",
    "Use localeCompare for human-language order.",
    "Check Number.isNaN before trusting <= chains.",
    "Trap: Array.prototype.sort without a comparator uses string compare, so [10, 2] becomes [10, 2] as strings '10','2'."
  ],
  "flashcards": [
    [
      "Comparison Operators",
      "< > <= >= use IsLessThan after ToPrimitive."
    ],
    [
      "Mental model",
      "If both sides look like strings, dictionary of 16-bit units. Else convert to numbers and compare. NaN poisons the test to false."
    ],
    [
      "Common trap",
      "Array.prototype.sort without a comparator uses string compare, so [10, 2] becomes [10, 2] as strings '10','2'."
    ],
    [
      "Do not sort numeric strings with > without Number().",
      "Use localeCompare for human-language order."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Comparison Operators and where does a beginner first see it?",
      "answerHint": "< > <= >= use IsLessThan after ToPrimitive. If both strings, they compare UTF-16 code units lexicographically ('10' < '2'). Otherwise ToNumber (or numeric bigint rules). NaN makes every relational false, including x < x. null becomes 0 in numeric relational tests."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Comparison Operators works and name the main pitfall.",
      "answerHint": "Do not sort numeric strings with > without Number(). Use localeCompare for human-language order. Check Number.isNaN before trusting <= chains. null >= 0 is true — do not use relational ops as null checks. Pitfall: Array.prototype.sort without a comparator uses string compare, so [10, 2] becomes [10, 2] as strings '10','2'."
    },
    {
      "level": "advanced",
      "question": "How would you explain Comparison Operators at an interview, including engine/spec details?",
      "answerHint": "IsLessThan: ToPrimitive both; if both String, compare sequences; else ToNumeric. <= is !(greater than), so NaN <= NaN is false. BigInt vs Number comparison uses a mathematical compare without converting to IEEE in some cases."
    }
  ],
  "pitfalls": [
    "Array.prototype.sort without a comparator uses string compare, so [10, 2] becomes [10, 2] as strings '10','2'.",
    "null >= 0 is true — do not use relational ops as null checks."
  ],
  "interview": {
    "expectations": [
      "Explain Comparison Operators without mixing it up with a nearby B1.5 — Operators & Expressions topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "IsLessThan: ToPrimitive both; if both String, compare sequences; else ToNumeric."
    ],
    "commonQuestions": [
      "What is Comparison Operators?",
      "Why does JavaScript comparison operators behave this way?",
      "What is the classic Comparison Operators interview trap?"
    ],
    "traps": [
      "Array.prototype.sort without a comparator uses string compare, so [10, 2] becomes [10, 2] as strings '10','2'."
    ],
    "misconceptions": [
      "Sorting and branching need order. String order was defined as code units, which is fast but not dictionary language order."
    ],
    "strongSignals": [
      "Separates Comparison Operators from lookalike APIs and can draw the mental model."
    ]
  }
})
