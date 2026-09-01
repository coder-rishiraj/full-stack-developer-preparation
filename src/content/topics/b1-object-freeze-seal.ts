import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "freeze / seal / preventExtensions",
  "whatIsIt": "preventExtensions blocks new properties. seal = preventExtensions + make existing non-configurable. freeze = seal + make data properties non-writable. All are shallow: nested objects remain mutable. Frozen objects can still have mutable nested fields. isFrozen/isSealed/isExtensible inspect the flags.",
  "whyExists": "Libraries wanted ‘don’t touch this config’ without copying. Hardening is a shallow lock on the property table.",
  "mentalModel": "preventExtensions: no new hooks on the wall. seal: you cannot reconfigure hooks. freeze: you cannot change the pictures either (one level).",
  "how": [
    "freeze configs you pass around.",
    "Know it is shallow — freeze nested too or use a deep helper.",
    "strict mode: assignment to frozen throws; sloppy fails silently.",
    "Arrays freeze their index slots but not objects sitting in those slots."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Object.freeze(state) then mutating state.user.age still works — nested reference.",
    "variant": "warning"
  },
  "example": "const o = { n: 1, nest: { x: 2 } };\nObject.freeze(o);\ntry { o.n = 9; } catch (e) { console.log(e.name); }\no.nest.x = 8;\nconsole.log(o.n, o.nest.x, Object.isFrozen(o));\nconst a = Object.seal({ k: 1 });\na.k = 2;\ntry { delete a.k; } catch (e) { console.log('del', e.name); }\nconsole.log(a);\n",
  "exampleCaption": "freeze shallow vs seal delete",
  "internals": [
    "SetIntegrityLevel with frozen vs sealed.",
    "[[PreventExtensions]] internal method; proxies can trap it.",
    "Non-writable + non-configurable data properties reject [[Set]]."
  ],
  "takeaways": [
    "freeze configs you pass around.",
    "Know it is shallow — freeze nested too or use a deep helper.",
    "Object.freeze(state) then mutating state.user.age still works — nested reference.",
    "SetIntegrityLevel with frozen vs sealed."
  ],
  "revision": [
    "freeze / seal / preventExtensions: preventExtensions: no new hooks on the wall. seal: you cannot reconfigure hooks. freeze: you cannot change the pictures either (one level).",
    "freeze configs you pass around.",
    "Know it is shallow — freeze nested too or use a deep helper.",
    "strict mode: assignment to frozen throws; sloppy fails silently.",
    "Trap: Object.freeze(state) then mutating state.user.age still works — nested reference."
  ],
  "flashcards": [
    [
      "freeze / seal / preventExtensions",
      "preventExtensions blocks new properties."
    ],
    [
      "Mental model",
      "preventExtensions: no new hooks on the wall. seal: you cannot reconfigure hooks. freeze: you cannot change the pictures either (one level)."
    ],
    [
      "Common trap",
      "Object.freeze(state) then mutating state.user.age still works — nested reference."
    ],
    [
      "freeze configs you pass around.",
      "Know it is shallow — freeze nested too or use a deep helper."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is freeze / seal / preventExtensions and where does a beginner first see it?",
      "answerHint": "preventExtensions blocks new properties. seal = preventExtensions + make existing non-configurable. freeze = seal + make data properties non-writable. All are shallow: nested objects remain mutable. Frozen objects can still have mutable nested fields. isFrozen/isSealed/isExtensible inspect the flags."
    },
    {
      "level": "intermediate",
      "question": "Walk through how freeze / seal / preventExtensions works and name the main pitfall.",
      "answerHint": "freeze configs you pass around. Know it is shallow — freeze nested too or use a deep helper. strict mode: assignment to frozen throws; sloppy fails silently. Arrays freeze their index slots but not objects sitting in those slots. Pitfall: Object.freeze(state) then mutating state.user.age still works — nested reference."
    },
    {
      "level": "advanced",
      "question": "How would you explain freeze / seal / preventExtensions at an interview, including engine/spec details?",
      "answerHint": "SetIntegrityLevel with frozen vs sealed. [[PreventExtensions]] internal method; proxies can trap it. Non-writable + non-configurable data properties reject [[Set]]."
    }
  ],
  "pitfalls": [
    "Object.freeze(state) then mutating state.user.age still works — nested reference.",
    "Arrays freeze their index slots but not objects sitting in those slots."
  ],
  "interview": {
    "expectations": [
      "Explain freeze / seal / preventExtensions without mixing it up with a nearby B1.13 — Objects topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "SetIntegrityLevel with frozen vs sealed."
    ],
    "commonQuestions": [
      "What is freeze / seal / preventExtensions?",
      "Why does JavaScript freeze / seal / preventextensions behave this way?",
      "What is the classic freeze / seal / preventExtensions interview trap?"
    ],
    "traps": [
      "Object.freeze(state) then mutating state.user.age still works — nested reference."
    ],
    "misconceptions": [
      "Libraries wanted ‘don’t touch this config’ without copying. Hardening is a shallow lock on the property table."
    ],
    "strongSignals": [
      "Separates freeze / seal / preventExtensions from lookalike APIs and can draw the mental model."
    ]
  }
})
