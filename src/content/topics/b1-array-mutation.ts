import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Mutating vs Non-Mutating Methods",
  "whatIsIt": "Mutating methods change the array in place: push, pop, shift, unshift, splice, sort, reverse, fill, copyWithin. Non-mutating return a new array: concat, slice, map, filter, toSorted, toReversed, toSpliced, with. Knowing which is which prevents accidental shared-state bugs.",
  "whyExists": "In-place updates are cheap. Immutable helpers were added later (2023) because React-style code needed copies.",
  "mentalModel": "Mutating: same shelf, items moved. Non-mutating: build a new shelf, leave the old one.",
  "how": [
    "sort/reverse mutate — use toSorted/toReversed if you need a copy.",
    "slice is copy; splice is surgery.",
    "push returns the new length, not the array.",
    "Prefer non-mutating in reducers."
  ],
  "callout": {
    "title": "Watch for",
    "text": "const next = arr.sort() mutates arr and next is the same reference — React state bug.",
    "variant": "warning"
  },
  "example": "const a = [3, 1, 2];\nconst b = a.sort((x, y) => x - y);\nconsole.log(a, b, a === b);\nconst c = [3, 1, 2].toSorted((x, y) => x - y);\nconsole.log(c, [3, 1, 2]);\nconst d = [1, 2];\nconsole.log(d.push(3), d);\n",
  "exampleCaption": "sort mutates; toSorted copies; push returns length",
  "internals": [
    "Mutating methods write indexes and length on the same object identity.",
    "toSorted is specified to copy then sort.",
    "Generic methods work on array-likes via this."
  ],
  "takeaways": [
    "sort/reverse mutate — use toSorted/toReversed if you need a copy.",
    "slice is copy; splice is surgery.",
    "const next = arr.sort() mutates arr and next is the same reference — React state bug.",
    "Mutating methods write indexes and length on the same object identity."
  ],
  "revision": [
    "Mutating vs Non-Mutating Methods: Mutating: same shelf, items moved. Non-mutating: build a new shelf, leave the old one.",
    "sort/reverse mutate — use toSorted/toReversed if you need a copy.",
    "slice is copy; splice is surgery.",
    "push returns the new length, not the array.",
    "Trap: const next = arr.sort() mutates arr and next is the same reference — React state bug."
  ],
  "flashcards": [
    [
      "Mutating vs Non-Mutating Methods",
      "Mutating methods change the array in place: push, pop, shift, unshift, splice, sort, reverse, fill, copyWithin."
    ],
    [
      "Mental model",
      "Mutating: same shelf, items moved. Non-mutating: build a new shelf, leave the old one."
    ],
    [
      "Common trap",
      "const next = arr.sort() mutates arr and next is the same reference — React state bug."
    ],
    [
      "sort/reverse mutate — use toSorted/toReversed if you need a copy.",
      "slice is copy; splice is surgery."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Mutating vs Non-Mutating Methods and where does a beginner first see it?",
      "answerHint": "Mutating methods change the array in place: push, pop, shift, unshift, splice, sort, reverse, fill, copyWithin. Non-mutating return a new array: concat, slice, map, filter, toSorted, toReversed, toSpliced, with. Knowing which is which prevents accidental shared-state bugs."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Mutating vs Non-Mutating Methods works and name the main pitfall.",
      "answerHint": "sort/reverse mutate — use toSorted/toReversed if you need a copy. slice is copy; splice is surgery. push returns the new length, not the array. Prefer non-mutating in reducers. Pitfall: const next = arr.sort() mutates arr and next is the same reference — React state bug."
    },
    {
      "level": "advanced",
      "question": "How would you explain Mutating vs Non-Mutating Methods at an interview, including engine/spec details?",
      "answerHint": "Mutating methods write indexes and length on the same object identity. toSorted is specified to copy then sort. Generic methods work on array-likes via this."
    }
  ],
  "pitfalls": [
    "const next = arr.sort() mutates arr and next is the same reference — React state bug.",
    "Prefer non-mutating in reducers."
  ],
  "interview": {
    "expectations": [
      "Explain Mutating vs Non-Mutating Methods without mixing it up with a nearby B1.18 — Arrays topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Mutating methods write indexes and length on the same object identity."
    ],
    "commonQuestions": [
      "What is Mutating vs Non-Mutating Methods?",
      "Why does JavaScript mutating vs non-mutating methods behave this way?",
      "What is the classic Mutating vs Non-Mutating Methods interview trap?"
    ],
    "traps": [
      "const next = arr.sort() mutates arr and next is the same reference — React state bug."
    ],
    "misconceptions": [
      "In-place updates are cheap. Immutable helpers were added later (2023) because React-style code needed copies."
    ],
    "strongSignals": [
      "Separates Mutating vs Non-Mutating Methods from lookalike APIs and can draw the mental model."
    ]
  }
})
