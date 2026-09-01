import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "slice vs splice",
  "whatIsIt": "slice(start, end) copies a half-open range into a new array (negatives from end). splice(start, deleteCount, ...items) mutates: removes deleteCount items at start and inserts items, returning the removed array. slice is photocopy; splice is surgery. slice() copies the whole array shallowly.",
  "whyExists": "Extraction without mutation vs in-place edit needed two APIs with sadly similar names.",
  "mentalModel": "slice = photocopy pages. splice = cut pages out and maybe paste new ones into the original book.",
  "how": [
    "Copy: arr.slice() or [...arr].",
    "Remove in place: splice(i, n).",
    "Insert in place: splice(i, 0, item).",
    "slice end is exclusive; splice’s second arg is a count."
  ],
  "callout": {
    "title": "Watch for",
    "text": "splice(1) deletes from index 1 to the end — deleteCount omitted means ‘all the rest.’",
    "variant": "warning"
  },
  "example": "const a = [0, 1, 2, 3, 4];\nconsole.log(a.slice(1, 3), a);\nconst b = [0, 1, 2, 3, 4];\nconsole.log(b.splice(1, 2, 8, 9), b);\nconst c = [1, 2, 3];\nc.splice(1, 0, 1.5);\nconsole.log(c);\n",
  "exampleCaption": "slice copy vs splice mutate/insert",
  "internals": [
    "slice uses relative indexes and copies Get values (holes become holes in the copy in some cases — actually slice copies holes as holes).",
    "splice is a complex sequence of delete/insert shifting indexes.",
    "Both are generic on array-likes."
  ],
  "takeaways": [
    "Copy: arr.slice() or [...arr].",
    "Remove in place: splice(i, n).",
    "splice(1) deletes from index 1 to the end — deleteCount omitted means ‘all the rest.’",
    "slice uses relative indexes and copies Get values (holes become holes in the copy in some cases — actually slice copies holes as holes)."
  ],
  "revision": [
    "slice vs splice: slice = photocopy pages. splice = cut pages out and maybe paste new ones into the original book.",
    "Copy: arr.slice() or [...arr].",
    "Remove in place: splice(i, n).",
    "Insert in place: splice(i, 0, item).",
    "Trap: splice(1) deletes from index 1 to the end — deleteCount omitted means ‘all the rest.’"
  ],
  "flashcards": [
    [
      "slice vs splice",
      "slice(start, end) copies a half-open range into a new array (negatives from end)."
    ],
    [
      "Mental model",
      "slice = photocopy pages. splice = cut pages out and maybe paste new ones into the original book."
    ],
    [
      "Common trap",
      "splice(1) deletes from index 1 to the end — deleteCount omitted means ‘all the rest.’"
    ],
    [
      "Copy: arr.slice() or [...arr].",
      "Remove in place: splice(i, n)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is slice vs splice and where does a beginner first see it?",
      "answerHint": "slice(start, end) copies a half-open range into a new array (negatives from end). splice(start, deleteCount, ...items) mutates: removes deleteCount items at start and inserts items, returning the removed array. slice is photocopy; splice is surgery. slice() copies the whole array shallowly."
    },
    {
      "level": "intermediate",
      "question": "Walk through how slice vs splice works and name the main pitfall.",
      "answerHint": "Copy: arr.slice() or [...arr]. Remove in place: splice(i, n). Insert in place: splice(i, 0, item). slice end is exclusive; splice’s second arg is a count. Pitfall: splice(1) deletes from index 1 to the end — deleteCount omitted means ‘all the rest.’"
    },
    {
      "level": "advanced",
      "question": "How would you explain slice vs splice at an interview, including engine/spec details?",
      "answerHint": "slice uses relative indexes and copies Get values (holes become holes in the copy in some cases — actually slice copies holes as holes). splice is a complex sequence of delete/insert shifting indexes. Both are generic on array-likes."
    }
  ],
  "pitfalls": [
    "splice(1) deletes from index 1 to the end — deleteCount omitted means ‘all the rest.’",
    "slice end is exclusive; splice’s second arg is a count."
  ],
  "interview": {
    "expectations": [
      "Explain slice vs splice without mixing it up with a nearby B1.18 — Arrays topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "slice uses relative indexes and copies Get values (holes become holes in the copy in some cases — actually slice copies holes as holes)."
    ],
    "commonQuestions": [
      "What is slice vs splice?",
      "Why does JavaScript slice vs splice behave this way?",
      "What is the classic slice vs splice interview trap?"
    ],
    "traps": [
      "splice(1) deletes from index 1 to the end — deleteCount omitted means ‘all the rest.’"
    ],
    "misconceptions": [
      "Extraction without mutation vs in-place edit needed two APIs with sadly similar names."
    ],
    "strongSignals": [
      "Separates slice vs splice from lookalike APIs and can draw the mental model."
    ]
  }
})
