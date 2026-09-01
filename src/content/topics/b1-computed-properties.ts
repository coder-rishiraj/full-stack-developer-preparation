import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Computed Property Names",
  "whatIsIt": "[expr]: value in a literal evaluates expr to a property key when the object is created. The expression can be a template, a symbol, or a function call. Order is left to right; later keys overwrite earlier string keys. Computed + shorthand cannot share the same field.",
  "whyExists": "Dynamic records (actions keyed by type, CSS-in-JS) needed literals without a second assignment line.",
  "mentalModel": "Run a tiny expression, turn it into a key, then attach the value — at creation time, not later.",
  "how": [
    "Use [Symbol.iterator] for protocol hooks.",
    "Avoid side-effect-heavy key expressions.",
    "Duplicate computed keys that stringify the same overwrite.",
    "Class fields also support [expr]."
  ],
  "callout": {
    "title": "Watch for",
    "text": "[undefined] becomes the string 'undefined' as a key — usually a bug.",
    "variant": "warning"
  },
  "example": "const verb = 'get';\nconst id = Symbol('id');\nconst api = {\n  [verb + 'User']: () => 'Ada',\n  [id]: 99,\n};\nconsole.log(api.getUser(), api[id]);\nconst n = 1;\nconsole.log({ ['k' + n]: 1, ['k' + n]: 2 });\n",
  "exampleCaption": "Computed method name and symbol key",
  "internals": [
    "ToPropertyKey on the evaluated expression.",
    "PropertyDefinitionEvaluation in source order.",
    "Integer-like strings may become array indexes if the object is an array (not a plain literal usually)."
  ],
  "takeaways": [
    "Use [Symbol.iterator] for protocol hooks.",
    "Avoid side-effect-heavy key expressions.",
    "[undefined] becomes the string 'undefined' as a key — usually a bug.",
    "ToPropertyKey on the evaluated expression."
  ],
  "revision": [
    "Computed Property Names: Run a tiny expression, turn it into a key, then attach the value — at creation time, not later.",
    "Use [Symbol.iterator] for protocol hooks.",
    "Avoid side-effect-heavy key expressions.",
    "Duplicate computed keys that stringify the same overwrite.",
    "Trap: [undefined] becomes the string 'undefined' as a key — usually a bug."
  ],
  "flashcards": [
    [
      "Computed Property Names",
      "[expr]: value in a literal evaluates expr to a property key when the object is created."
    ],
    [
      "Mental model",
      "Run a tiny expression, turn it into a key, then attach the value — at creation time, not later."
    ],
    [
      "Common trap",
      "[undefined] becomes the string 'undefined' as a key — usually a bug."
    ],
    [
      "Use [Symbol.iterator] for protocol hooks.",
      "Avoid side-effect-heavy key expressions."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Computed Property Names and where does a beginner first see it?",
      "answerHint": "[expr]: value in a literal evaluates expr to a property key when the object is created. The expression can be a template, a symbol, or a function call. Order is left to right; later keys overwrite earlier string keys. Computed + shorthand cannot share the same field."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Computed Property Names works and name the main pitfall.",
      "answerHint": "Use [Symbol.iterator] for protocol hooks. Avoid side-effect-heavy key expressions. Duplicate computed keys that stringify the same overwrite. Class fields also support [expr]. Pitfall: [undefined] becomes the string 'undefined' as a key — usually a bug."
    },
    {
      "level": "advanced",
      "question": "How would you explain Computed Property Names at an interview, including engine/spec details?",
      "answerHint": "ToPropertyKey on the evaluated expression. PropertyDefinitionEvaluation in source order. Integer-like strings may become array indexes if the object is an array (not a plain literal usually)."
    }
  ],
  "pitfalls": [
    "[undefined] becomes the string 'undefined' as a key — usually a bug.",
    "Class fields also support [expr]."
  ],
  "interview": {
    "expectations": [
      "Explain Computed Property Names without mixing it up with a nearby B1.13 — Objects topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "ToPropertyKey on the evaluated expression."
    ],
    "commonQuestions": [
      "What is Computed Property Names?",
      "Why does JavaScript computed property names behave this way?",
      "What is the classic Computed Property Names interview trap?"
    ],
    "traps": [
      "[undefined] becomes the string 'undefined' as a key — usually a bug."
    ],
    "misconceptions": [
      "Dynamic records (actions keyed by type, CSS-in-JS) needed literals without a second assignment line."
    ],
    "strongSignals": [
      "Separates Computed Property Names from lookalike APIs and can draw the mental model."
    ]
  }
})
