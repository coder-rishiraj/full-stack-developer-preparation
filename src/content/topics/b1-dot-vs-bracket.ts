import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Dot vs Bracket Notation",
  "whatIsIt": "obj.prop is an identifier key. obj['prop'] or obj[expr] uses ToPropertyKey on the expression (string or symbol). Dots cannot use reserved-looking dynamic names or keys with dashes. Brackets can. Missing keys yield undefined, they do not throw (unless obj is nullish).",
  "whyExists": "Static keys needed terse syntax; dynamic keys (maps, forms) needed an expression slot.",
  "mentalModel": ". is a hardcoded label. [] is a computed label. Both end up as the same [[Get]].",
  "how": [
    "Use dot for known identifiers.",
    "Use brackets for variables, user-supplied keys, and symbols.",
    "Prefer Map if keys are unknown or not strings.",
    "obj[0] on arrays is index; obj['00'] is a different key."
  ],
  "callout": {
    "title": "Watch for",
    "text": "form[id] where id is user-controlled can read __proto__ or constructor — validate keys.",
    "variant": "warning"
  },
  "example": "const user = { name: 'Ada', 'full-name': 'Ada Lovelace' };\nconst key = 'name';\nconsole.log(user.name, user[key], user['full-name']);\nconsole.log(user.age);\nconst arr = ['a'];\nconsole.log(arr[0], arr['0'], arr['00']);\n",
  "exampleCaption": "Dot, computed key, missing prop, array index strings",
  "internals": [
    "Both MemberExpressions produce a Reference with base and referenced name.",
    "ToPropertyKey: symbols stay symbols; else ToString.",
    "Integer-index keys on arrays use special [[DefineOwnProperty]]."
  ],
  "takeaways": [
    "Use dot for known identifiers.",
    "Use brackets for variables, user-supplied keys, and symbols.",
    "form[id] where id is user-controlled can read __proto__ or constructor — validate keys.",
    "Both MemberExpressions produce a Reference with base and referenced name."
  ],
  "revision": [
    "Dot vs Bracket Notation: . is a hardcoded label. [] is a computed label. Both end up as the same [[Get]].",
    "Use dot for known identifiers.",
    "Use brackets for variables, user-supplied keys, and symbols.",
    "Prefer Map if keys are unknown or not strings.",
    "Trap: form[id] where id is user-controlled can read __proto__ or constructor — validate keys."
  ],
  "flashcards": [
    [
      "Dot vs Bracket Notation",
      "obj.prop is an identifier key."
    ],
    [
      "Mental model",
      ". is a hardcoded label. [] is a computed label. Both end up as the same [[Get]]."
    ],
    [
      "Common trap",
      "form[id] where id is user-controlled can read __proto__ or constructor — validate keys."
    ],
    [
      "Use dot for known identifiers.",
      "Use brackets for variables, user-supplied keys, and symbols."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Dot vs Bracket Notation and where does a beginner first see it?",
      "answerHint": "obj.prop is an identifier key. obj['prop'] or obj[expr] uses ToPropertyKey on the expression (string or symbol). Dots cannot use reserved-looking dynamic names or keys with dashes. Brackets can. Missing keys yield undefined, they do not throw (unless obj is nullish)."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Dot vs Bracket Notation works and name the main pitfall.",
      "answerHint": "Use dot for known identifiers. Use brackets for variables, user-supplied keys, and symbols. Prefer Map if keys are unknown or not strings. obj[0] on arrays is index; obj['00'] is a different key. Pitfall: form[id] where id is user-controlled can read __proto__ or constructor — validate keys."
    },
    {
      "level": "advanced",
      "question": "How would you explain Dot vs Bracket Notation at an interview, including engine/spec details?",
      "answerHint": "Both MemberExpressions produce a Reference with base and referenced name. ToPropertyKey: symbols stay symbols; else ToString. Integer-index keys on arrays use special [[DefineOwnProperty]]."
    }
  ],
  "pitfalls": [
    "form[id] where id is user-controlled can read __proto__ or constructor — validate keys.",
    "obj[0] on arrays is index; obj['00'] is a different key."
  ],
  "interview": {
    "expectations": [
      "Explain Dot vs Bracket Notation without mixing it up with a nearby B1.13 — Objects topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Both MemberExpressions produce a Reference with base and referenced name."
    ],
    "commonQuestions": [
      "What is Dot vs Bracket Notation?",
      "Why does JavaScript dot vs bracket notation behave this way?",
      "What is the classic Dot vs Bracket Notation interview trap?"
    ],
    "traps": [
      "form[id] where id is user-controlled can read __proto__ or constructor — validate keys."
    ],
    "misconceptions": [
      "Static keys needed terse syntax; dynamic keys (maps, forms) needed an expression slot."
    ],
    "strongSignals": [
      "Separates Dot vs Bracket Notation from lookalike APIs and can draw the mental model."
    ]
  }
})
