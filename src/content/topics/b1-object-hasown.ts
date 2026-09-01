import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "hasOwn / ownership",
  "whatIsIt": "Object.hasOwn(obj, key) is true if the object has an own (not inherited) property, including non-enumerable and symbols when passed. obj.hasOwnProperty is inherited and fails on Object.create(null) or if someone overwrote hasOwnProperty. in includes inherited. hasOwn is the modern default.",
  "whyExists": "for...in and mixins made ‘is this mine?’ essential. A static Object.hasOwn avoids prototype sabotage.",
  "mentalModel": "hasOwn: on this bag’s own labels. in: this bag or any parent’s labels.",
  "how": [
    "Use Object.hasOwn in new code.",
    "Do not call hasOwnProperty without Object.prototype.hasOwnProperty.call if you must support old engines and null-proto.",
    "in for ‘can I read this including inherited methods.’",
    "JSON keys are own enumerable strings."
  ],
  "callout": {
    "title": "Watch for",
    "text": "obj.hasOwnProperty('x') throws or is wrong on Object.create(null) and poisoned objects.",
    "variant": "warning"
  },
  "example": "const o = Object.create({ inherited: 1 });\no.own = 2;\nconsole.log(Object.hasOwn(o, 'own'), Object.hasOwn(o, 'inherited'));\nconsole.log('inherited' in o);\nconst dict = Object.create(null);\ndict.x = 1;\nconsole.log(Object.hasOwn(dict, 'x'));\ntry { dict.hasOwnProperty('x'); } catch (e) { console.log(e.name); }\n",
  "exampleCaption": "hasOwn vs in vs null-prototype objects",
  "internals": [
    "HasOwnProperty abstract op: [[GetOwnProperty]] is not undefined.",
    "in uses HasProperty (walks prototypes).",
    "hasOwn accepts a key converted with ToPropertyKey."
  ],
  "takeaways": [
    "Use Object.hasOwn in new code.",
    "Do not call hasOwnProperty without Object.prototype.hasOwnProperty.call if you must support old engines and null-proto.",
    "obj.hasOwnProperty('x') throws or is wrong on Object.create(null) and poisoned objects.",
    "HasOwnProperty abstract op: [[GetOwnProperty]] is not undefined."
  ],
  "revision": [
    "hasOwn / ownership: hasOwn: on this bag’s own labels. in: this bag or any parent’s labels.",
    "Use Object.hasOwn in new code.",
    "Do not call hasOwnProperty without Object.prototype.hasOwnProperty.call if you must support old engines and null-proto.",
    "in for ‘can I read this including inherited methods.’",
    "Trap: obj.hasOwnProperty('x') throws or is wrong on Object.create(null) and poisoned objects."
  ],
  "flashcards": [
    [
      "hasOwn / ownership",
      "Object.hasOwn(obj, key) is true if the object has an own (not inherited) property, including non-enumerable and symbols when passed."
    ],
    [
      "Mental model",
      "hasOwn: on this bag’s own labels. in: this bag or any parent’s labels."
    ],
    [
      "Common trap",
      "obj.hasOwnProperty('x') throws or is wrong on Object.create(null) and poisoned objects."
    ],
    [
      "Use Object.hasOwn in new code.",
      "Do not call hasOwnProperty without Object.prototype.hasOwnProperty.call if you must support old engines and null-proto."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is hasOwn / ownership and where does a beginner first see it?",
      "answerHint": "Object.hasOwn(obj, key) is true if the object has an own (not inherited) property, including non-enumerable and symbols when passed. obj.hasOwnProperty is inherited and fails on Object.create(null) or if someone overwrote hasOwnProperty. in includes inherited. hasOwn is the modern default."
    },
    {
      "level": "intermediate",
      "question": "Walk through how hasOwn / ownership works and name the main pitfall.",
      "answerHint": "Use Object.hasOwn in new code. Do not call hasOwnProperty without Object.prototype.hasOwnProperty.call if you must support old engines and null-proto. in for ‘can I read this including inherited methods.’ JSON keys are own enumerable strings. Pitfall: obj.hasOwnProperty('x') throws or is wrong on Object.create(null) and poisoned objects."
    },
    {
      "level": "advanced",
      "question": "How would you explain hasOwn / ownership at an interview, including engine/spec details?",
      "answerHint": "HasOwnProperty abstract op: [[GetOwnProperty]] is not undefined. in uses HasProperty (walks prototypes). hasOwn accepts a key converted with ToPropertyKey."
    }
  ],
  "pitfalls": [
    "obj.hasOwnProperty('x') throws or is wrong on Object.create(null) and poisoned objects.",
    "JSON keys are own enumerable strings."
  ],
  "interview": {
    "expectations": [
      "Explain hasOwn / ownership without mixing it up with a nearby B1.13 — Objects topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "HasOwnProperty abstract op: [[GetOwnProperty]] is not undefined."
    ],
    "commonQuestions": [
      "What is hasOwn / ownership?",
      "Why does JavaScript hasown / ownership behave this way?",
      "What is the classic hasOwn / ownership interview trap?"
    ],
    "traps": [
      "obj.hasOwnProperty('x') throws or is wrong on Object.create(null) and poisoned objects."
    ],
    "misconceptions": [
      "for...in and mixins made ‘is this mine?’ essential. A static Object.hasOwn avoids prototype sabotage."
    ],
    "strongSignals": [
      "Separates hasOwn / ownership from lookalike APIs and can draw the mental model."
    ]
  }
})
