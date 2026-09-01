import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "in, delete, void, instanceof",
  "whatIsIt": "in tests whether a property name exists in an object or its prototype chain. delete removes an own configurable property. void evaluates and yields undefined. instanceof walks the prototype chain for a constructor. They are operators, not functions.",
  "whyExists": "A dynamic object model needed existence tests and deletion, plus a way to ignore an expression’s value (void).",
  "mentalModel": "in is ‘does this key exist anywhere up the chain?’ delete is ‘remove own key.’ void is ‘throw away the value.’",
  "how": [
    "Use Object.hasOwn for own keys; in includes inherited.",
    "delete leaves holes in arrays; use splice to reindex.",
    "void 0 is a style for undefined.",
    "Left of in is ToPropertyKey (strings/symbols)."
  ],
  "callout": {
    "title": "Watch for",
    "text": "'toString' in {} is true because it lives on Object.prototype — not an own field.",
    "variant": "warning"
  },
  "example": "const o = Object.create({ inherited: 1 });\no.own = 2;\nconsole.log('own' in o, 'inherited' in o, 'missing' in o);\nconsole.log(Object.hasOwn(o, 'inherited'));\nconsole.log(delete o.own, 'own' in o);\nconsole.log(void 0, [] instanceof Array);\n",
  "exampleCaption": "in vs hasOwn, delete, void, instanceof",
  "internals": [
    "Relational in: ToPropertyKey + HasProperty (prototype walk).",
    "delete uses [[Delete]]; unconfigurable → false or TypeError in strict.",
    "void is GetValue then return undefined."
  ],
  "takeaways": [
    "Use Object.hasOwn for own keys; in includes inherited.",
    "delete leaves holes in arrays; use splice to reindex.",
    "'toString' in {} is true because it lives on Object.prototype — not an own field.",
    "Relational in: ToPropertyKey + HasProperty (prototype walk)."
  ],
  "revision": [
    "in, delete, void, instanceof: in is ‘does this key exist anywhere up the chain?’ delete is ‘remove own key.’ void is ‘throw away the value.’",
    "Use Object.hasOwn for own keys; in includes inherited.",
    "delete leaves holes in arrays; use splice to reindex.",
    "void 0 is a style for undefined.",
    "Trap: 'toString' in {} is true because it lives on Object.prototype — not an own field."
  ],
  "flashcards": [
    [
      "in, delete, void, instanceof",
      "in tests whether a property name exists in an object or its prototype chain."
    ],
    [
      "Mental model",
      "in is ‘does this key exist anywhere up the chain?’ delete is ‘remove own key.’ void is ‘throw away the value.’"
    ],
    [
      "Common trap",
      "'toString' in {} is true because it lives on Object.prototype — not an own field."
    ],
    [
      "Use Object.hasOwn for own keys; in includes inherited.",
      "delete leaves holes in arrays; use splice to reindex."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is in, delete, void, instanceof and where does a beginner first see it?",
      "answerHint": "in tests whether a property name exists in an object or its prototype chain. delete removes an own configurable property. void evaluates and yields undefined. instanceof walks the prototype chain for a constructor. They are operators, not functions."
    },
    {
      "level": "intermediate",
      "question": "Walk through how in, delete, void, instanceof works and name the main pitfall.",
      "answerHint": "Use Object.hasOwn for own keys; in includes inherited. delete leaves holes in arrays; use splice to reindex. void 0 is a style for undefined. Left of in is ToPropertyKey (strings/symbols). Pitfall: 'toString' in {} is true because it lives on Object.prototype — not an own field."
    },
    {
      "level": "advanced",
      "question": "How would you explain in, delete, void, instanceof at an interview, including engine/spec details?",
      "answerHint": "Relational in: ToPropertyKey + HasProperty (prototype walk). delete uses [[Delete]]; unconfigurable → false or TypeError in strict. void is GetValue then return undefined."
    }
  ],
  "pitfalls": [
    "'toString' in {} is true because it lives on Object.prototype — not an own field.",
    "Left of in is ToPropertyKey (strings/symbols)."
  ],
  "interview": {
    "expectations": [
      "Explain in, delete, void, instanceof without mixing it up with a nearby B1.5 — Operators & Expressions topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Relational in: ToPropertyKey + HasProperty (prototype walk)."
    ],
    "commonQuestions": [
      "What is in, delete, void, instanceof?",
      "Why does JavaScript in, delete, void, instanceof behave this way?",
      "What is the classic in, delete, void, instanceof interview trap?"
    ],
    "traps": [
      "'toString' in {} is true because it lives on Object.prototype — not an own field."
    ],
    "misconceptions": [
      "A dynamic object model needed existence tests and deletion, plus a way to ignore an expression’s value (void)."
    ],
    "strongSignals": [
      "Separates in, delete, void, instanceof from lookalike APIs and can draw the mental model."
    ]
  }
})
