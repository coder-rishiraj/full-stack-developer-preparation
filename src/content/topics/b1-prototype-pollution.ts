import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Prototype Pollution (Concept)",
  "whatIsIt": "Prototype pollution is when untrusted keys like __proto__ or constructor.prototype get merged into objects, changing Object.prototype for everyone. A payload { \"__proto__\": { \"isAdmin\": true } } with naive recursive merge can make every object inherit isAdmin. It is a security bug, not a language feature you ‘use.’",
  "whyExists": "Recursive merge utilities and query parsers wrote obj[key] = value without blocking proto keys. Shared prototypes then became an attack surface.",
  "mentalModel": "Poisoning the school handbook so every student suddenly has a new page. One merge, global effect.",
  "how": [
    "Block keys __proto__, constructor, prototype on merges.",
    "Use Object.create(null) or Map for dictionaries.",
    "Prefer Object.hasOwn and Object.assign from known keys.",
    "Freeze Object.prototype in extreme lockdown (can break libs)."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Object.entries skips __proto__ on a parsed object that already polluted during JSON.parse in some engines? JSON.parse('{\"__proto__\":{}}') typically creates an own property named [[Prototype]] via special handling — actually JSON.parse does NOT pollute; it creates a property named '__proto__' as own key on some engines vs prototype set. In modern JSON.parse, __proto__ is a normal own property. The merge obj[key]= when key is __proto__ may set prototype via assignment in some paths. The assignment target['__proto__'] = can invoke the setter on Object.prototype.",
    "variant": "warning"
  },
  "example": "const protoBefore = Object.prototype.isAdmin;\nconst payload = JSON.parse('{\"__proto__\":{\"polluted\":true}}');\nconst target = {};\nfor (const [k, v] of Object.entries(payload)) {\n  if (k === '__proto__' || k === 'constructor') continue;\n  target[k] = v;\n}\nconsole.log(target.polluted, ({}).polluted);\nconsole.log('isAdmin was', protoBefore);\n",
  "exampleCaption": "Rejecting __proto__ keys in a merge",
  "internals": [
    "obj['__proto__'] = x may call the inherited setter and change [[Prototype]].",
    "Object.defineProperty and Map avoid that setter.",
    "CVE class: lodash merge historically, qs parsers, etc."
  ],
  "takeaways": [
    "Block keys __proto__, constructor, prototype on merges.",
    "Use Object.create(null) or Map for dictionaries.",
    "Object.entries skips __proto__ on a parsed object that already polluted during JSON.parse in some engines? JSON.parse('{\"__proto__\":{}}') typically creates an own property named [[Prototype]] via special handling — actually JSON.parse does NOT pollute; it creates a property named '__proto__' as own key on some engines vs prototype set. In modern JSON.parse, __proto__ is a normal own property. The merge obj[key]= when key is __proto__ may set prototype via assignment in some paths. The assignment target['__proto__'] = can invoke the setter on Object.prototype.",
    "obj['__proto__'] = x may call the inherited setter and change [[Prototype]]."
  ],
  "revision": [
    "Prototype Pollution (Concept): Poisoning the school handbook so every student suddenly has a new page. One merge, global effect.",
    "Block keys __proto__, constructor, prototype on merges.",
    "Use Object.create(null) or Map for dictionaries.",
    "Prefer Object.hasOwn and Object.assign from known keys.",
    "Trap: Object.entries skips __proto__ on a parsed object that already polluted during JSON.parse in some engines? JSON.parse('{\"__proto__\":{}}') typically creates an own property named [[Prototype]] via special handling — actually JSON.parse does NOT pollute; it creates a property named '__proto__' as own key on some engines vs prototype set. In modern JSON.parse, __proto__ is a normal own property. The merge obj[key]= when key is __proto__ may set prototype via assignment in some paths. The assignment target['__proto__'] = can invoke the setter on Object.prototype."
  ],
  "flashcards": [
    [
      "Prototype Pollution (Concept)",
      "Prototype pollution is when untrusted keys like __proto__ or constructor.prototype get merged into objects, changing Object.prototype for everyone."
    ],
    [
      "Mental model",
      "Poisoning the school handbook so every student suddenly has a new page. One merge, global effect."
    ],
    [
      "Common trap",
      "Object.entries skips __proto__ on a parsed object that already polluted during JSON.parse in some engines? JSON.parse('{\"__proto__\":{}}') typically creates an own property named [[Prototype]] via special handling — actually JSON.parse does NOT pollute; it creates a property named '__proto__' as own key on some engines vs prototype set. In modern JSON.parse, __proto__ is a normal own property. The merge obj[key]= when key is __proto__ may set prototype via assignment in some paths. The assignment target['__proto__'] = can invoke the setter on Object.prototype."
    ],
    [
      "Block keys __proto__, constructor, prototype on merges.",
      "Use Object.create(null) or Map for dictionaries."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Prototype Pollution (Concept) and where does a beginner first see it?",
      "answerHint": "Prototype pollution is when untrusted keys like __proto__ or constructor.prototype get merged into objects, changing Object.prototype for everyone. A payload { \"__proto__\": { \"isAdmin\": true } } with naive recursive merge can make every object inherit isAdmin. It is a security bug, not a language feature you ‘use.’"
    },
    {
      "level": "intermediate",
      "question": "Walk through how Prototype Pollution (Concept) works and name the main pitfall.",
      "answerHint": "Block keys __proto__, constructor, prototype on merges. Use Object.create(null) or Map for dictionaries. Prefer Object.hasOwn and Object.assign from known keys. Freeze Object.prototype in extreme lockdown (can break libs). Pitfall: Object.entries skips __proto__ on a parsed object that already polluted during JSON.parse in some engines? JSON.parse('{\"__proto__\":{}}') typically creates an own property named [[Prototype]] via special handling — actually JSON.parse does NOT pollute; it creates a property named '__proto__' as own key on some engines vs prototype set. In modern JSON.parse, __proto__ is a normal own property. The merge obj[key]= when key is __proto__ may set prototype via assignment in some paths. The assignment target['__proto__'] = can invoke the setter on Object.prototype."
    },
    {
      "level": "advanced",
      "question": "How would you explain Prototype Pollution (Concept) at an interview, including engine/spec details?",
      "answerHint": "obj['__proto__'] = x may call the inherited setter and change [[Prototype]]. Object.defineProperty and Map avoid that setter. CVE class: lodash merge historically, qs parsers, etc."
    }
  ],
  "pitfalls": [
    "Object.entries skips __proto__ on a parsed object that already polluted during JSON.parse in some engines? JSON.parse('{\"__proto__\":{}}') typically creates an own property named [[Prototype]] via special handling — actually JSON.parse does NOT pollute; it creates a property named '__proto__' as own key on some engines vs prototype set. In modern JSON.parse, __proto__ is a normal own property. The merge obj[key]= when key is __proto__ may set prototype via assignment in some paths. The assignment target['__proto__'] = can invoke the setter on Object.prototype.",
    "Freeze Object.prototype in extreme lockdown (can break libs)."
  ],
  "interview": {
    "expectations": [
      "Explain Prototype Pollution (Concept) without mixing it up with a nearby B1.16 — Prototypes & Prototype Chain topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "obj['__proto__'] = x may call the inherited setter and change [[Prototype]]."
    ],
    "commonQuestions": [
      "What is Prototype Pollution (Concept)?",
      "Why does JavaScript prototype pollution (concept) behave this way?",
      "What is the classic Prototype Pollution (Concept) interview trap?"
    ],
    "traps": [
      "Object.entries skips __proto__ on a parsed object that already polluted during JSON.parse in some engines? JSON.parse('{\"__proto__\":{}}') typically creates an own property named [[Prototype]] via special handling — actually JSON.parse does NOT pollute; it creates a property named '__proto__' as own key on some engines vs prototype set. In modern JSON.parse, __proto__ is a normal own property. The merge obj[key]= when key is __proto__ may set prototype via assignment in some paths. The assignment target['__proto__'] = can invoke the setter on Object.prototype."
    ],
    "misconceptions": [
      "Recursive merge utilities and query parsers wrote obj[key] = value without blocking proto keys. Shared prototypes then became an attack surface."
    ],
    "strongSignals": [
      "Separates Prototype Pollution (Concept) from lookalike APIs and can draw the mental model."
    ]
  }
})
