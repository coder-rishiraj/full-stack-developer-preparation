import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "some / every",
  "whatIsIt": "some(fn) is true if at least one element is truthy for fn. every(fn) is true if all are. Empty array: some is false, every is true (vacuous truth). They short-circuit. They skip holes like forEach. Predicate return is ToBoolean.",
  "whyExists": "Boolean questions about a list without writing a for-loop. Vacuous every([]) === true surprises interviews.",
  "mentalModel": "some = OR of predicates. every = AND of predicates. Empty AND is true; empty OR is false.",
  "how": [
    "Use some for ‘exists’, every for ‘all pass’.",
    "Remember every([]) === true.",
    "Keep predicates side-effect free if you rely on short-circuit.",
    "They return booleans, not the element — use find for that."
  ],
  "callout": {
    "title": "Watch for",
    "text": "every on [] is true — a validation of ‘all emails valid’ passes if the list is empty.",
    "variant": "warning"
  },
  "example": "const a = [2, 4, 6];\nconsole.log(a.every((n) => n % 2 === 0), a.some((n) => n > 5));\nconsole.log([].every(() => false), [].some(() => true));\nconsole.log([1, 3].some((n) => n === 2));\n",
  "exampleCaption": "every/some and empty-array vacuous truth",
  "internals": [
    "If length is 0, every returns true and some false without calling fn.",
    "Holes: HasProperty check skips the callback.",
    "Return IfToBoolean of the callback result."
  ],
  "takeaways": [
    "Use some for ‘exists’, every for ‘all pass’.",
    "Remember every([]) === true.",
    "every on [] is true — a validation of ‘all emails valid’ passes if the list is empty.",
    "If length is 0, every returns true and some false without calling fn."
  ],
  "revision": [
    "some / every: some = OR of predicates. every = AND of predicates. Empty AND is true; empty OR is false.",
    "Use some for ‘exists’, every for ‘all pass’.",
    "Remember every([]) === true.",
    "Keep predicates side-effect free if you rely on short-circuit.",
    "Trap: every on [] is true — a validation of ‘all emails valid’ passes if the list is empty."
  ],
  "flashcards": [
    [
      "some / every",
      "some(fn) is true if at least one element is truthy for fn."
    ],
    [
      "Mental model",
      "some = OR of predicates. every = AND of predicates. Empty AND is true; empty OR is false."
    ],
    [
      "Common trap",
      "every on [] is true — a validation of ‘all emails valid’ passes if the list is empty."
    ],
    [
      "Use some for ‘exists’, every for ‘all pass’.",
      "Remember every([]) === true."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is some / every and where does a beginner first see it?",
      "answerHint": "some(fn) is true if at least one element is truthy for fn. every(fn) is true if all are. Empty array: some is false, every is true (vacuous truth). They short-circuit. They skip holes like forEach. Predicate return is ToBoolean."
    },
    {
      "level": "intermediate",
      "question": "Walk through how some / every works and name the main pitfall.",
      "answerHint": "Use some for ‘exists’, every for ‘all pass’. Remember every([]) === true. Keep predicates side-effect free if you rely on short-circuit. They return booleans, not the element — use find for that. Pitfall: every on [] is true — a validation of ‘all emails valid’ passes if the list is empty."
    },
    {
      "level": "advanced",
      "question": "How would you explain some / every at an interview, including engine/spec details?",
      "answerHint": "If length is 0, every returns true and some false without calling fn. Holes: HasProperty check skips the callback. Return IfToBoolean of the callback result."
    }
  ],
  "pitfalls": [
    "every on [] is true — a validation of ‘all emails valid’ passes if the list is empty.",
    "They return booleans, not the element — use find for that."
  ],
  "interview": {
    "expectations": [
      "Explain some / every without mixing it up with a nearby B1.18 — Arrays topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "If length is 0, every returns true and some false without calling fn."
    ],
    "commonQuestions": [
      "What is some / every?",
      "Why does JavaScript some / every behave this way?",
      "What is the classic some / every interview trap?"
    ],
    "traps": [
      "every on [] is true — a validation of ‘all emails valid’ passes if the list is empty."
    ],
    "misconceptions": [
      "Boolean questions about a list without writing a for-loop. Vacuous every([]) === true surprises interviews."
    ],
    "strongSignals": [
      "Separates some / every from lookalike APIs and can draw the mental model."
    ]
  }
})
