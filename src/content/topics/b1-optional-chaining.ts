import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Optional Chaining",
  "whatIsIt": "?. short-circuits a property access, call, or index when the base is null or undefined, producing undefined instead of throwing. obj?.a.b still throws if a is null after a successful obj. It does not catch missing functions except with obj?.(). ?? often follows to supply a default.",
  "whyExists": "Deep optional JSON and DOM nodes made `obj && obj.a && obj.a.b` the national sport. ?. made the guard a language form.",
  "mentalModel": "If the current base is nullish, stop the rest of this chain and yield undefined. Otherwise continue as normal `.`.",
  "how": [
    "Use obj?.prop and obj?.method?.() for optional APIs.",
    "Do not write obj?.a.b unless a is guaranteed.",
    "arr?.[0] for possibly undefined arrays.",
    "delete obj?.prop is allowed and no-ops on nullish obj."
  ],
  "callout": {
    "title": "Watch for",
    "text": "obj?.a.b throws if a exists but is null — ?. protects only the one step it is written on (and the chain designed from there).",
    "variant": "warning"
  },
  "example": "const user = { profile: { city: 'Oslo' } };\nconsole.log(user.profile?.city, user.profile?.zip, user.missing?.x);\nconsole.log(user.foo?.(), undefined);\nconst n = null;\nconsole.log(n?.length);\ntry { console.log(user.profile?.city.notThere.x); } catch (e) { console.log(e.name); }\n",
  "exampleCaption": "?. stops only on nullish bases, not later missing objects",
  "internals": [
    "Optional chaining is specified with a short-circuiting reference that becomes undefined.",
    "It is not a try/catch; other exceptions still throw.",
    "Call optional: if the base is nullish skip Call; if the property is non-callable you still get TypeError."
  ],
  "takeaways": [
    "Use obj?.prop and obj?.method?.() for optional APIs.",
    "Do not write obj?.a.b unless a is guaranteed.",
    "obj?.a.b throws if a exists but is null — ?. protects only the one step it is written on (and the chain designed from there).",
    "Optional chaining is specified with a short-circuiting reference that becomes undefined."
  ],
  "revision": [
    "Optional Chaining: If the current base is nullish, stop the rest of this chain and yield undefined. Otherwise continue as normal `.`.",
    "Use obj?.prop and obj?.method?.() for optional APIs.",
    "Do not write obj?.a.b unless a is guaranteed.",
    "arr?.[0] for possibly undefined arrays.",
    "Trap: obj?.a.b throws if a exists but is null — ?. protects only the one step it is written on (and the chain designed from there)."
  ],
  "flashcards": [
    [
      "Optional Chaining",
      "?."
    ],
    [
      "Mental model",
      "If the current base is nullish, stop the rest of this chain and yield undefined. Otherwise continue as normal `.`."
    ],
    [
      "Common trap",
      "obj?.a.b throws if a exists but is null — ?. protects only the one step it is written on (and the chain designed from there)."
    ],
    [
      "Use obj?.prop and obj?.method?.() for optional APIs.",
      "Do not write obj?.a.b unless a is guaranteed."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Optional Chaining and where does a beginner first see it?",
      "answerHint": "?. short-circuits a property access, call, or index when the base is null or undefined, producing undefined instead of throwing. obj?.a.b still throws if a is null after a successful obj. It does not catch missing functions except with obj?.(). ?? often follows to supply a default."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Optional Chaining works and name the main pitfall.",
      "answerHint": "Use obj?.prop and obj?.method?.() for optional APIs. Do not write obj?.a.b unless a is guaranteed. arr?.[0] for possibly undefined arrays. delete obj?.prop is allowed and no-ops on nullish obj. Pitfall: obj?.a.b throws if a exists but is null — ?. protects only the one step it is written on (and the chain designed from there)."
    },
    {
      "level": "advanced",
      "question": "How would you explain Optional Chaining at an interview, including engine/spec details?",
      "answerHint": "Optional chaining is specified with a short-circuiting reference that becomes undefined. It is not a try/catch; other exceptions still throw. Call optional: if the base is nullish skip Call; if the property is non-callable you still get TypeError."
    }
  ],
  "pitfalls": [
    "obj?.a.b throws if a exists but is null — ?. protects only the one step it is written on (and the chain designed from there).",
    "delete obj?.prop is allowed and no-ops on nullish obj."
  ],
  "interview": {
    "expectations": [
      "Explain Optional Chaining without mixing it up with a nearby B1.5 — Operators & Expressions topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Optional chaining is specified with a short-circuiting reference that becomes undefined."
    ],
    "commonQuestions": [
      "What is Optional Chaining?",
      "Why does JavaScript optional chaining behave this way?",
      "What is the classic Optional Chaining interview trap?"
    ],
    "traps": [
      "obj?.a.b throws if a exists but is null — ?. protects only the one step it is written on (and the chain designed from there)."
    ],
    "misconceptions": [
      "Deep optional JSON and DOM nodes made `obj && obj.a && obj.a.b` the national sport. ?. made the guard a language form."
    ],
    "strongSignals": [
      "Separates Optional Chaining from lookalike APIs and can draw the mental model."
    ]
  }
})
