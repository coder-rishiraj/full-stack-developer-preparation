import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Declarative vs Imperative Style",
  "whatIsIt": "Imperative style: for loops, mutating accumulators, step-by-step control. Declarative/functional style: map/filter/reduce, expressions that say what, not how. JS supports both. Declarative list pipelines are easier to test when pure; imperative is clearer for complex early-exit algorithms.",
  "whyExists": "JS grew array extras and closures, so a functional style became idiomatic in UI code without being a pure FP language.",
  "mentalModel": "Imperative: a recipe of mutations. Declarative: a pipeline of transforms. Same engine, different readability bets.",
  "how": [
    "Use map/filter for simple list transforms.",
    "Use for/for-of when you need break, indexes with mutation, or performance-critical inner loops.",
    "Do not nest five maps to look clever.",
    "Keep functions small and named either way."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Using map for side effects (no return) — that is forEach, and reviewers will call it out.",
    "variant": "warning"
  },
  "example": "const xs = [1, 2, 3, 4];\nlet imp = [];\nfor (const x of xs) if (x % 2 === 0) imp.push(x * 10);\nconst dec = xs.filter((x) => x % 2 === 0).map((x) => x * 10);\nconsole.log(imp, dec);\n",
  "exampleCaption": "Same transform: for-loop vs filter+map",
  "internals": [
    "map allocates a new array; a for-loop can prealloc — sometimes faster, often irrelevant.",
    "There is no purity checker in the language.",
    "Transducers and lazy iterators are library-level."
  ],
  "takeaways": [
    "Use map/filter for simple list transforms.",
    "Use for/for-of when you need break, indexes with mutation, or performance-critical inner loops.",
    "Using map for side effects (no return) — that is forEach, and reviewers will call it out.",
    "map allocates a new array; a for-loop can prealloc — sometimes faster, often irrelevant."
  ],
  "revision": [
    "Declarative vs Imperative Style: Imperative: a recipe of mutations. Declarative: a pipeline of transforms. Same engine, different readability bets.",
    "Use map/filter for simple list transforms.",
    "Use for/for-of when you need break, indexes with mutation, or performance-critical inner loops.",
    "Do not nest five maps to look clever.",
    "Trap: Using map for side effects (no return) — that is forEach, and reviewers will call it out."
  ],
  "flashcards": [
    [
      "Declarative vs Imperative Style",
      "Imperative style: for loops, mutating accumulators, step-by-step control."
    ],
    [
      "Mental model",
      "Imperative: a recipe of mutations. Declarative: a pipeline of transforms. Same engine, different readability bets."
    ],
    [
      "Common trap",
      "Using map for side effects (no return) — that is forEach, and reviewers will call it out."
    ],
    [
      "Use map/filter for simple list transforms.",
      "Use for/for-of when you need break, indexes with mutation, or performance-critical inner loops."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Declarative vs Imperative Style and where does a beginner first see it?",
      "answerHint": "Imperative style: for loops, mutating accumulators, step-by-step control. Declarative/functional style: map/filter/reduce, expressions that say what, not how. JS supports both. Declarative list pipelines are easier to test when pure; imperative is clearer for complex early-exit algorithms."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Declarative vs Imperative Style works and name the main pitfall.",
      "answerHint": "Use map/filter for simple list transforms. Use for/for-of when you need break, indexes with mutation, or performance-critical inner loops. Do not nest five maps to look clever. Keep functions small and named either way. Pitfall: Using map for side effects (no return) — that is forEach, and reviewers will call it out."
    },
    {
      "level": "advanced",
      "question": "How would you explain Declarative vs Imperative Style at an interview, including engine/spec details?",
      "answerHint": "map allocates a new array; a for-loop can prealloc — sometimes faster, often irrelevant. There is no purity checker in the language. Transducers and lazy iterators are library-level."
    }
  ],
  "pitfalls": [
    "Using map for side effects (no return) — that is forEach, and reviewers will call it out.",
    "Keep functions small and named either way."
  ],
  "interview": {
    "expectations": [
      "Explain Declarative vs Imperative Style without mixing it up with a nearby B1.38 — Functional JavaScript topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "map allocates a new array; a for-loop can prealloc — sometimes faster, often irrelevant."
    ],
    "commonQuestions": [
      "What is Declarative vs Imperative Style?",
      "Why does JavaScript declarative vs imperative style behave this way?",
      "What is the classic Declarative vs Imperative Style interview trap?"
    ],
    "traps": [
      "Using map for side effects (no return) — that is forEach, and reviewers will call it out."
    ],
    "misconceptions": [
      "JS grew array extras and closures, so a functional style became idiomatic in UI code without being a pure FP language."
    ],
    "strongSignals": [
      "Separates Declarative vs Imperative Style from lookalike APIs and can draw the mental model."
    ]
  }
})
