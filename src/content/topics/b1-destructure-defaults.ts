import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Defaults / Renaming / Nested",
  "whatIsIt": "Defaults apply only when the unpacked value is undefined, not null or 0. Nested defaults: { a: { b } = {} }. Renaming { old: neu }. You can default the whole pattern in params: function f({ x = 1 } = {}). Evaluation of default expressions is lazy (only if needed) and can see earlier bindings in the same pattern in arrays.",
  "whyExists": "APIs omit fields (undefined) more often than they send null. Defaults match default-parameter rules.",
  "mentalModel": "If the slot is undefined, run the default expression. null is a provided value and wins.",
  "how": [
    "Use ?? at the object level if null should also default.",
    "function({ a = 1 } = {}) for optional object params.",
    "Rename when API names are bad: { n: count }.",
    "Do not assume 0 triggers a default."
  ],
  "callout": {
    "title": "Watch for",
    "text": "{ x = 1 } = { x: null } keeps null — same as function defaults.",
    "variant": "warning"
  },
  "example": "function f({ x = 1, y: yy = 2 } = {}) {\n  return { x, yy };\n}\nconsole.log(f(), f({ x: 0 }), f({ x: undefined, y: 8 }), f({ x: null }));\nconst [a = 1, b = a + 1] = [];\nconsole.log(a, b);\n",
  "exampleCaption": "Param defaults, null vs 0 vs undefined, array default chain",
  "internals": [
    "Default evaluated when value is undefined (InitializeReferencedBinding path).",
    "Renaming is BindingProperty with Identifier as the local name.",
    "Object rest is excluded keys after matching."
  ],
  "takeaways": [
    "Use ?? at the object level if null should also default.",
    "function({ a = 1 } = {}) for optional object params.",
    "{ x = 1 } = { x: null } keeps null — same as function defaults.",
    "Default evaluated when value is undefined (InitializeReferencedBinding path)."
  ],
  "revision": [
    "Defaults / Renaming / Nested: If the slot is undefined, run the default expression. null is a provided value and wins.",
    "Use ?? at the object level if null should also default.",
    "function({ a = 1 } = {}) for optional object params.",
    "Rename when API names are bad: { n: count }.",
    "Trap: { x = 1 } = { x: null } keeps null — same as function defaults."
  ],
  "flashcards": [
    [
      "Defaults / Renaming / Nested",
      "Defaults apply only when the unpacked value is undefined, not null or 0."
    ],
    [
      "Mental model",
      "If the slot is undefined, run the default expression. null is a provided value and wins."
    ],
    [
      "Common trap",
      "{ x = 1 } = { x: null } keeps null — same as function defaults."
    ],
    [
      "Use ?? at the object level if null should also default.",
      "function({ a = 1 } = {}) for optional object params."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Defaults / Renaming / Nested and where does a beginner first see it?",
      "answerHint": "Defaults apply only when the unpacked value is undefined, not null or 0. Nested defaults: { a: { b } = {} }. Renaming { old: neu }. You can default the whole pattern in params: function f({ x = 1 } = {}). Evaluation of default expressions is lazy (only if needed) and can see earlier bindings in the same pattern in arrays."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Defaults / Renaming / Nested works and name the main pitfall.",
      "answerHint": "Use ?? at the object level if null should also default. function({ a = 1 } = {}) for optional object params. Rename when API names are bad: { n: count }. Do not assume 0 triggers a default. Pitfall: { x = 1 } = { x: null } keeps null — same as function defaults."
    },
    {
      "level": "advanced",
      "question": "How would you explain Defaults / Renaming / Nested at an interview, including engine/spec details?",
      "answerHint": "Default evaluated when value is undefined (InitializeReferencedBinding path). Renaming is BindingProperty with Identifier as the local name. Object rest is excluded keys after matching."
    }
  ],
  "pitfalls": [
    "{ x = 1 } = { x: null } keeps null — same as function defaults.",
    "Do not assume 0 triggers a default."
  ],
  "interview": {
    "expectations": [
      "Explain Defaults / Renaming / Nested without mixing it up with a nearby B1.20 — Destructuring, Spread & Modern Syntax topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Default evaluated when value is undefined (InitializeReferencedBinding path)."
    ],
    "commonQuestions": [
      "What is Defaults / Renaming / Nested?",
      "Why does JavaScript defaults / renaming / nested behave this way?",
      "What is the classic Defaults / Renaming / Nested interview trap?"
    ],
    "traps": [
      "{ x = 1 } = { x: null } keeps null — same as function defaults."
    ],
    "misconceptions": [
      "APIs omit fields (undefined) more often than they send null. Defaults match default-parameter rules."
    ],
    "strongSignals": [
      "Separates Defaults / Renaming / Nested from lookalike APIs and can draw the mental model."
    ]
  }
})
