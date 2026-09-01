import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "instanceof",
  "whatIsIt": "instanceof tests whether an object’s prototype chain contains the prototype property of a constructor. Left operand should be an object; primitives return false (except boxed wrappers). Cross-realm objects (iframe, vm) fail instanceof because each realm has its own Array/Object constructors.",
  "whyExists": "OOP code needed a runtime ‘is-a’ check that follows the same chain property lookup uses, without a separate type tag for every class.",
  "mentalModel": "Walk up [[Prototype]] looking for C.prototype. If you never find it, the answer is false — even if the object ‘looks like’ an array.",
  "how": [
    "Use Array.isArray for arrays; it is realm-safe.",
    "Use instanceof for your own classes in the same realm.",
    "null/undefined throw; other primitives return false.",
    "Symbol.hasInstance lets a constructor customize the check."
  ],
  "callout": {
    "title": "Watch for",
    "text": "[] instanceof Array is false across iframes; Array.isArray stays true.",
    "variant": "warning"
  },
  "example": "class Animal {}\nclass Dog extends Animal {}\nconst d = new Dog();\nconsole.log(d instanceof Dog, d instanceof Animal, d instanceof Object);\nconsole.log([] instanceof Array, [] instanceof Object);\nconsole.log('hi' instanceof String, new String('hi') instanceof String);\ntry { null instanceof Object; } catch (e) { console.log(e.name); }\n",
  "exampleCaption": "instanceof along a class chain vs primitives",
  "internals": [
    "OrdinaryHasInstance walks [[Prototype]] until null or a match on C.prototype.",
    "If C has @@hasInstance, that function is called instead.",
    "Bound functions use the target’s prototype for instanceof."
  ],
  "takeaways": [
    "Use Array.isArray for arrays; it is realm-safe.",
    "Use instanceof for your own classes in the same realm.",
    "[] instanceof Array is false across iframes; Array.isArray stays true.",
    "OrdinaryHasInstance walks [[Prototype]] until null or a match on C.prototype."
  ],
  "revision": [
    "instanceof: Walk up [[Prototype]] looking for C.prototype. If you never find it, the answer is false — even if the object ‘looks like’ an array.",
    "Use Array.isArray for arrays; it is realm-safe.",
    "Use instanceof for your own classes in the same realm.",
    "null/undefined throw; other primitives return false.",
    "Trap: [] instanceof Array is false across iframes; Array.isArray stays true."
  ],
  "flashcards": [
    [
      "instanceof",
      "instanceof tests whether an object’s prototype chain contains the prototype property of a constructor."
    ],
    [
      "Mental model",
      "Walk up [[Prototype]] looking for C.prototype. If you never find it, the answer is false — even if the object ‘looks like’ an array."
    ],
    [
      "Common trap",
      "[] instanceof Array is false across iframes; Array.isArray stays true."
    ],
    [
      "Use Array.isArray for arrays; it is realm-safe.",
      "Use instanceof for your own classes in the same realm."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is instanceof and where does a beginner first see it?",
      "answerHint": "instanceof tests whether an object’s prototype chain contains the prototype property of a constructor. Left operand should be an object; primitives return false (except boxed wrappers). Cross-realm objects (iframe, vm) fail instanceof because each realm has its own Array/Object constructors."
    },
    {
      "level": "intermediate",
      "question": "Walk through how instanceof works and name the main pitfall.",
      "answerHint": "Use Array.isArray for arrays; it is realm-safe. Use instanceof for your own classes in the same realm. null/undefined throw; other primitives return false. Symbol.hasInstance lets a constructor customize the check. Pitfall: [] instanceof Array is false across iframes; Array.isArray stays true."
    },
    {
      "level": "advanced",
      "question": "How would you explain instanceof at an interview, including engine/spec details?",
      "answerHint": "OrdinaryHasInstance walks [[Prototype]] until null or a match on C.prototype. If C has @@hasInstance, that function is called instead. Bound functions use the target’s prototype for instanceof."
    }
  ],
  "pitfalls": [
    "[] instanceof Array is false across iframes; Array.isArray stays true.",
    "Symbol.hasInstance lets a constructor customize the check."
  ],
  "interview": {
    "expectations": [
      "Explain instanceof without mixing it up with a nearby B1.3 — Types & Values topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "OrdinaryHasInstance walks [[Prototype]] until null or a match on C.prototype."
    ],
    "commonQuestions": [
      "What is instanceof?",
      "Why does JavaScript instanceof behave this way?",
      "What is the classic instanceof interview trap?"
    ],
    "traps": [
      "[] instanceof Array is false across iframes; Array.isArray stays true."
    ],
    "misconceptions": [
      "OOP code needed a runtime ‘is-a’ check that follows the same chain property lookup uses, without a separate type tag for every class."
    ],
    "strongSignals": [
      "Separates instanceof from lookalike APIs and can draw the mental model."
    ]
  }
})
