import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Variable Naming / Best Practices",
  "whatIsIt": "Names should say what the value means: `userCount` not `n2`, booleans as `isReady`/`hasError`, functions as verbs. JS convention is camelCase for values, PascalCase for constructors/types, SCREAMING_SNAKE for true constants. Avoid 1-letter names except short loops. Collisions with DOM ids (global `window` properties in browsers) still bite old scripts.",
  "whyExists": "Readers spend more time reading than writing. Consistent names let grep and code review work. Minifiers will shorten names in bundles anyway.",
  "mentalModel": "A name is an API. If you have to decode it, the name failed — even if the algorithm is correct.",
  "how": [
    "camelCase bindings; PascalCase classes.",
    "Booleans read as questions: `isEmpty`, `canSubmit`.",
    "Do not shadow `Map`, `Error`, `document`.",
    "Keep names stable across refactors; rename with tooling, not half-file search."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Naming a variable `name` at global classic-script scope overwrites `window.name` (string) and breaks comparisons.",
    "variant": "warning"
  },
  "example": "function toUserDto(row) {\n  const isActive = row.status === 'active';\n  const displayName = row.name.trim();\n  return { displayName, isActive };\n}\nconsole.log(toUserDto({ name: ' Ada ', status: 'active' }));",
  "exampleCaption": "Verb function + boolean + domain names",
  "internals": [
    "Unicode identifiers allow homograph attacks in published packages — stick to ASCII in libraries.",
    "Reserved words force awkward names (`clazz`, `klass`) or property quotes.",
    "Source maps preserve original names for debugging after minify."
  ],
  "takeaways": [
    "camelCase bindings; PascalCase classes.",
    "Booleans read as questions: `isEmpty`, `canSubmit`.",
    "Naming a variable `name` at global classic-script scope overwrites `window.name` (string) and breaks comparisons.",
    "Unicode identifiers allow homograph attacks in published packages — stick to ASCII in libraries."
  ],
  "revision": [
    "Variable Naming / Best Practices: A name is an API. If you have to decode it, the name failed — even if the algorithm is correct.",
    "camelCase bindings; PascalCase classes.",
    "Booleans read as questions: `isEmpty`, `canSubmit`.",
    "Do not shadow `Map`, `Error`, `document`.",
    "Trap: Naming a variable `name` at global classic-script scope overwrites `window.name` (string) and breaks comparisons."
  ],
  "flashcards": [
    [
      "Variable Naming / Best Practices",
      "Names should say what the value means: `userCount` not `n2`, booleans as `isReady`/`hasError`, functions as verbs."
    ],
    [
      "Mental model",
      "A name is an API. If you have to decode it, the name failed — even if the algorithm is correct."
    ],
    [
      "Common trap",
      "Naming a variable `name` at global classic-script scope overwrites `window.name` (string) and breaks comparisons."
    ],
    [
      "camelCase bindings; PascalCase classes.",
      "Booleans read as questions: `isEmpty`, `canSubmit`."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Variable Naming / Best Practices and where does a beginner first see it?",
      "answerHint": "Names should say what the value means: `userCount` not `n2`, booleans as `isReady`/`hasError`, functions as verbs. JS convention is camelCase for values, PascalCase for constructors/types, SCREAMING_SNAKE for true constants. Avoid 1-letter names except short loops. Collisions with DOM ids (global `window` properties in browsers) still bite old scripts."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Variable Naming / Best Practices works and name the main pitfall.",
      "answerHint": "camelCase bindings; PascalCase classes. Booleans read as questions: `isEmpty`, `canSubmit`. Do not shadow `Map`, `Error`, `document`. Keep names stable across refactors; rename with tooling, not half-file search. Pitfall: Naming a variable `name` at global classic-script scope overwrites `window.name` (string) and breaks comparisons."
    },
    {
      "level": "advanced",
      "question": "How would you explain Variable Naming / Best Practices at an interview, including engine/spec details?",
      "answerHint": "Unicode identifiers allow homograph attacks in published packages — stick to ASCII in libraries. Reserved words force awkward names (`clazz`, `klass`) or property quotes. Source maps preserve original names for debugging after minify."
    }
  ],
  "pitfalls": [
    "Naming a variable `name` at global classic-script scope overwrites `window.name` (string) and breaks comparisons.",
    "Keep names stable across refactors; rename with tooling, not half-file search."
  ],
  "interview": {
    "expectations": [
      "Explain Variable Naming / Best Practices without mixing it up with a nearby B1.2 — Variables & Declarations topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Unicode identifiers allow homograph attacks in published packages — stick to ASCII in libraries."
    ],
    "commonQuestions": [
      "What is Variable Naming / Best Practices?",
      "Why does JavaScript variable naming / best practices behave this way?",
      "What is the classic Variable Naming / Best Practices interview trap?"
    ],
    "traps": [
      "Naming a variable `name` at global classic-script scope overwrites `window.name` (string) and breaks comparisons."
    ],
    "misconceptions": [
      "Readers spend more time reading than writing. Consistent names let grep and code review work. Minifiers will shorten names in bundles anyway."
    ],
    "strongSignals": [
      "Separates Variable Naming / Best Practices from lookalike APIs and can draw the mental model."
    ]
  }
})
