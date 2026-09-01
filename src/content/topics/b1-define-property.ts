import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Object.defineProperty",
  "whatIsIt": "Object.defineProperty(obj, key, desc) adds or changes a property using a descriptor. It can fail (TypeError) if the property is non-configurable or the object is non-extensible. defineProperties does many keys. This is how libraries hide fields and how the engine implements much of class fields internally.",
  "whyExists": "Assignment (obj.x =) always makes a writable enumerable data property (normally). defineProperty is the precise tool.",
  "mentalModel": "Fill out a form for the property instead of shoving a value onto the object.",
  "how": [
    "Use for read-only APIs and hidden metadata.",
    "Check getOwnPropertyDescriptor before assuming you can redefine.",
    "On arrays, defining length has special rules.",
    "Prefer public class fields when you just need instance data."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Partial updates: defineProperty with only { enumerable: true } on an existing property can mean different things than you think — unspecified fields are copied from the existing descriptor in updates.",
    "variant": "warning"
  },
  "example": "const o = {};\nObject.defineProperty(o, 'id', {\n  value: 7,\n  writable: false,\n  enumerable: true,\n  configurable: false,\n});\nconsole.log(o.id);\ntry { o.id = 8; } catch (e) { console.log(e.name); }\ntry { Object.defineProperty(o, 'id', { value: 9 }); } catch (e) { console.log(e.name); }\n",
  "exampleCaption": "Locked id cannot be assigned or redefined",
  "internals": [
    "[[DefineOwnProperty]] internal method.",
    "For updates, omitted fields default to the current descriptor, not to false.",
    "That update vs create default difference is a frequent interview point."
  ],
  "takeaways": [
    "Use for read-only APIs and hidden metadata.",
    "Check getOwnPropertyDescriptor before assuming you can redefine.",
    "Partial updates: defineProperty with only { enumerable: true } on an existing property can mean different things than you think — unspecified fields are copied from the existing descriptor in updates.",
    "[[DefineOwnProperty]] internal method."
  ],
  "revision": [
    "Object.defineProperty: Fill out a form for the property instead of shoving a value onto the object.",
    "Use for read-only APIs and hidden metadata.",
    "Check getOwnPropertyDescriptor before assuming you can redefine.",
    "On arrays, defining length has special rules.",
    "Trap: Partial updates: defineProperty with only { enumerable: true } on an existing property can mean different things than you think — unspecified fields are copied from the existing descriptor in updates."
  ],
  "flashcards": [
    [
      "Object.defineProperty",
      "Object.defineProperty(obj, key, desc) adds or changes a property using a descriptor."
    ],
    [
      "Mental model",
      "Fill out a form for the property instead of shoving a value onto the object."
    ],
    [
      "Common trap",
      "Partial updates: defineProperty with only { enumerable: true } on an existing property can mean different things than you think — unspecified fields are copied from the existing descriptor in updates."
    ],
    [
      "Use for read-only APIs and hidden metadata.",
      "Check getOwnPropertyDescriptor before assuming you can redefine."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Object.defineProperty and where does a beginner first see it?",
      "answerHint": "Object.defineProperty(obj, key, desc) adds or changes a property using a descriptor. It can fail (TypeError) if the property is non-configurable or the object is non-extensible. defineProperties does many keys. This is how libraries hide fields and how the engine implements much of class fields internally."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Object.defineProperty works and name the main pitfall.",
      "answerHint": "Use for read-only APIs and hidden metadata. Check getOwnPropertyDescriptor before assuming you can redefine. On arrays, defining length has special rules. Prefer public class fields when you just need instance data. Pitfall: Partial updates: defineProperty with only { enumerable: true } on an existing property can mean different things than you think — unspecified fields are copied from the existing descriptor in updates."
    },
    {
      "level": "advanced",
      "question": "How would you explain Object.defineProperty at an interview, including engine/spec details?",
      "answerHint": "[[DefineOwnProperty]] internal method. For updates, omitted fields default to the current descriptor, not to false. That update vs create default difference is a frequent interview point."
    }
  ],
  "pitfalls": [
    "Partial updates: defineProperty with only { enumerable: true } on an existing property can mean different things than you think — unspecified fields are copied from the existing descriptor in updates.",
    "Prefer public class fields when you just need instance data."
  ],
  "interview": {
    "expectations": [
      "Explain Object.defineProperty without mixing it up with a nearby B1.14 — Object Property Model topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "[[DefineOwnProperty]] internal method."
    ],
    "commonQuestions": [
      "What is Object.defineProperty?",
      "Why does JavaScript object.defineproperty behave this way?",
      "What is the classic Object.defineProperty interview trap?"
    ],
    "traps": [
      "Partial updates: defineProperty with only { enumerable: true } on an existing property can mean different things than you think — unspecified fields are copied from the existing descriptor in updates."
    ],
    "misconceptions": [
      "Assignment (obj.x =) always makes a writable enumerable data property (normally). defineProperty is the precise tool."
    ],
    "strongSignals": [
      "Separates Object.defineProperty from lookalike APIs and can draw the mental model."
    ]
  }
})
