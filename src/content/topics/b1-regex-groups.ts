import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Groups & Lookaround Basics",
  "whatIsIt": "Capturing groups () are numbered in the match array and in replace as $1. Named groups (?<name> ) appear in match.groups. Non-capturing (?: ). Lookahead (?= ) (?! ) and lookbehind (?<= ) (?<! ) assert without consuming. Nested groups number by open-paren order. Groups can be undefined if that alternative did not match.",
  "whyExists": "Extraction needed pieces, not just a boolean. Lookaround is assertion without eating characters.",
  "mentalModel": "Parentheses save a slice. Lookahead peeks forward; lookbehind peeks back. ?: means ‘group but don’t save.’",
  "how": [
    "Named groups for readable extract.",
    "Optional groups can be undefined — guard.",
    "Lookbehind is not in the oldest browsers — know your baseline.",
    "Do not over-nest; numbered groups become unreadable."
  ],
  "callout": {
    "title": "Watch for",
    "text": "m[0] is the whole match; m[1] is the first group — off-by-one when reading exec arrays.",
    "variant": "warning"
  },
  "example": "const m = /(?<y>\\d{4})-(?<mo>\\d{2})/.exec('2020-01-02');\nconsole.log(m.groups.y, m[1], m[2]);\nconsole.log(/js(?=\\!)/.exec('js!')?.[0]);\nconsole.log(/(?:ab)+/.exec('ababab')[0]);\nconsole.log(/(a)|(b)/.exec('b'));\n",
  "exampleCaption": "Named groups, lookahead, non-capturing, unused alt",
  "internals": [
    "Capture indices and named table on the result array (exotic-ish array with extra properties).",
    "d flag adds indices for group offsets.",
    "Lookaround can still cause catastrophic backtracking in poorly written patterns."
  ],
  "takeaways": [
    "Named groups for readable extract.",
    "Optional groups can be undefined — guard.",
    "m[0] is the whole match; m[1] is the first group — off-by-one when reading exec arrays.",
    "Capture indices and named table on the result array (exotic-ish array with extra properties)."
  ],
  "revision": [
    "Groups & Lookaround Basics: Parentheses save a slice. Lookahead peeks forward; lookbehind peeks back. ?: means ‘group but don’t save.’",
    "Named groups for readable extract.",
    "Optional groups can be undefined — guard.",
    "Lookbehind is not in the oldest browsers — know your baseline.",
    "Trap: m[0] is the whole match; m[1] is the first group — off-by-one when reading exec arrays."
  ],
  "flashcards": [
    [
      "Groups & Lookaround Basics",
      "Capturing groups () are numbered in the match array and in replace as $1."
    ],
    [
      "Mental model",
      "Parentheses save a slice. Lookahead peeks forward; lookbehind peeks back. ?: means ‘group but don’t save.’"
    ],
    [
      "Common trap",
      "m[0] is the whole match; m[1] is the first group — off-by-one when reading exec arrays."
    ],
    [
      "Named groups for readable extract.",
      "Optional groups can be undefined — guard."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Groups & Lookaround Basics and where does a beginner first see it?",
      "answerHint": "Capturing groups () are numbered in the match array and in replace as $1. Named groups (?<name> ) appear in match.groups. Non-capturing (?: ). Lookahead (?= ) (?! ) and lookbehind (?<= ) (?<! ) assert without consuming. Nested groups number by open-paren order. Groups can be undefined if that alternative did not match."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Groups & Lookaround Basics works and name the main pitfall.",
      "answerHint": "Named groups for readable extract. Optional groups can be undefined — guard. Lookbehind is not in the oldest browsers — know your baseline. Do not over-nest; numbered groups become unreadable. Pitfall: m[0] is the whole match; m[1] is the first group — off-by-one when reading exec arrays."
    },
    {
      "level": "advanced",
      "question": "How would you explain Groups & Lookaround Basics at an interview, including engine/spec details?",
      "answerHint": "Capture indices and named table on the result array (exotic-ish array with extra properties). d flag adds indices for group offsets. Lookaround can still cause catastrophic backtracking in poorly written patterns."
    }
  ],
  "pitfalls": [
    "m[0] is the whole match; m[1] is the first group — off-by-one when reading exec arrays.",
    "Do not over-nest; numbered groups become unreadable."
  ],
  "interview": {
    "expectations": [
      "Explain Groups & Lookaround Basics without mixing it up with a nearby B1.37 — Regular Expressions topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Capture indices and named table on the result array (exotic-ish array with extra properties)."
    ],
    "commonQuestions": [
      "What is Groups & Lookaround Basics?",
      "Why does JavaScript groups & lookaround basics behave this way?",
      "What is the classic Groups & Lookaround Basics interview trap?"
    ],
    "traps": [
      "m[0] is the whole match; m[1] is the first group — off-by-one when reading exec arrays."
    ],
    "misconceptions": [
      "Extraction needed pieces, not just a boolean. Lookaround is assertion without eating characters."
    ],
    "strongSignals": [
      "Separates Groups & Lookaround Basics from lookalike APIs and can draw the mental model."
    ]
  }
})
