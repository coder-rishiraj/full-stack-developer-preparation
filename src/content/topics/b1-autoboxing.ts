import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Wrapper Objects / Autoboxing",
  "whatIsIt": "Autoboxing (ToObject on primitives) wraps a string/number/boolean in a temporary String/Number/Boolean object so `\"hi\".toUpperCase()` works. The wrapper is thrown away after the statement. Assigning properties to primitives is silently ignored in sloppy mode or throws in strict. You should almost never write `new String()`.",
  "whyExists": "Primitives needed methods without making every number a heap object. Temporary wrappers reuse Object.prototype method dispatch.",
  "mentalModel": "A costume the primitive wears for one property access, then takes off. Anything you pin on the costume vanishes.",
  "how": [
    "Call methods on primitives freely: they work via autoboxing.",
    "Never `new Boolean`/`new Number`/`new String` — they are truthy objects.",
    "typeof new String(\"a\") is \"object\".",
    "Strict mode: assigning `\"a\".x = 1` throws TypeError."
  ],
  "callout": {
    "title": "Watch for",
    "text": "`new Boolean(false)` is truthy; `new String(\"\")` is truthy — wrappers break conditionals.",
    "variant": "warning"
  },
  "example": "'use strict';\nconsole.log('hi'.toUpperCase());\ntry { 'hi'.oops = 1; } catch (e) { console.log(e.name); }\nconsole.log(typeof new String('hi'), Boolean(new String('')));",
  "exampleCaption": "Method call vs leftover wrapper objects",
  "internals": [
    "GetValue of a property on a primitive: ToObject, [[Get]], discard wrapper.",
    "String objects are exotic with integer indexed characters.",
    "Boxed primitives compare by identity, not by wrapped value, with ===."
  ],
  "takeaways": [
    "Call methods on primitives freely: they work via autoboxing.",
    "Never `new Boolean`/`new Number`/`new String` — they are truthy objects.",
    "`new Boolean(false)` is truthy; `new String(\"\")` is truthy — wrappers break conditionals.",
    "GetValue of a property on a primitive: ToObject, [[Get]], discard wrapper."
  ],
  "revision": [
    "Wrapper Objects / Autoboxing: A costume the primitive wears for one property access, then takes off. Anything you pin on the costume vanishes.",
    "Call methods on primitives freely: they work via autoboxing.",
    "Never `new Boolean`/`new Number`/`new String` — they are truthy objects.",
    "typeof new String(\"a\") is \"object\".",
    "Trap: `new Boolean(false)` is truthy; `new String(\"\")` is truthy — wrappers break conditionals."
  ],
  "flashcards": [
    [
      "Wrapper Objects / Autoboxing",
      "Autoboxing (ToObject on primitives) wraps a string/number/boolean in a temporary String/Number/Boolean object so `\"hi\".toUpperCase()` works."
    ],
    [
      "Mental model",
      "A costume the primitive wears for one property access, then takes off. Anything you pin on the costume vanishes."
    ],
    [
      "Common trap",
      "`new Boolean(false)` is truthy; `new String(\"\")` is truthy — wrappers break conditionals."
    ],
    [
      "Call methods on primitives freely: they work via autoboxing.",
      "Never `new Boolean`/`new Number`/`new String` — they are truthy objects."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Wrapper Objects / Autoboxing and where does a beginner first see it?",
      "answerHint": "Autoboxing (ToObject on primitives) wraps a string/number/boolean in a temporary String/Number/Boolean object so `\"hi\".toUpperCase()` works. The wrapper is thrown away after the statement. Assigning properties to primitives is silently ignored in sloppy mode or throws in strict. You should almost never write `new String()`."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Wrapper Objects / Autoboxing works and name the main pitfall.",
      "answerHint": "Call methods on primitives freely: they work via autoboxing. Never `new Boolean`/`new Number`/`new String` — they are truthy objects. typeof new String(\"a\") is \"object\". Strict mode: assigning `\"a\".x = 1` throws TypeError. Pitfall: `new Boolean(false)` is truthy; `new String(\"\")` is truthy — wrappers break conditionals."
    },
    {
      "level": "advanced",
      "question": "How would you explain Wrapper Objects / Autoboxing at an interview, including engine/spec details?",
      "answerHint": "GetValue of a property on a primitive: ToObject, [[Get]], discard wrapper. String objects are exotic with integer indexed characters. Boxed primitives compare by identity, not by wrapped value, with ===."
    }
  ],
  "pitfalls": [
    "`new Boolean(false)` is truthy; `new String(\"\")` is truthy — wrappers break conditionals.",
    "Strict mode: assigning `\"a\".x = 1` throws TypeError."
  ],
  "interview": {
    "expectations": [
      "Explain Wrapper Objects / Autoboxing without mixing it up with a nearby B1.3 — Types & Values topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "GetValue of a property on a primitive: ToObject, [[Get]], discard wrapper."
    ],
    "commonQuestions": [
      "What is Wrapper Objects / Autoboxing?",
      "Why does JavaScript wrapper objects / autoboxing behave this way?",
      "What is the classic Wrapper Objects / Autoboxing interview trap?"
    ],
    "traps": [
      "`new Boolean(false)` is truthy; `new String(\"\")` is truthy — wrappers break conditionals."
    ],
    "misconceptions": [
      "Primitives needed methods without making every number a heap object. Temporary wrappers reuse Object.prototype method dispatch."
    ],
    "strongSignals": [
      "Separates Wrapper Objects / Autoboxing from lookalike APIs and can draw the mental model."
    ]
  }
})
