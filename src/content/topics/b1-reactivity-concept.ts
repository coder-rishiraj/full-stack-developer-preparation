import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Validation / Reactivity Concepts",
  "whatIsIt": "Reactivity: when a value changes, dependents update. JS implements this with getters that register the current effect, and setters that rerun those effects (Vue), or with Proxies that intercept get/set. It is a design pattern on top of the language, not a keyword. Validation is a simpler trap: set rejects bad values.",
  "whyExists": "UI state trees needed automatic dependency tracking instead of manual subscribe for every field.",
  "mentalModel": "Reading a property while an effect is running subscribes. Writing notifies. Proxy is the sensor on the object.",
  "how": [
    "Track a global currentEffect during get.",
    "Store Set of effects per key.",
    "On set, copy the set and rerun.",
    "Avoid infinite loops: do not set the same key inside its own effect without a guard."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Triggering set during get tracking can recurse forever — batch or compare old/new.",
    "variant": "warning"
  },
  "example": "let active;\nfunction effect(fn) { active = fn; fn(); active = undefined; }\nfunction reactive(obj) {\n  const deps = new Map();\n  return new Proxy(obj, {\n    get(t, k) {\n      if (active) { if (!deps.has(k)) deps.set(k, new Set()); deps.get(k).add(active); }\n      return t[k];\n    },\n    set(t, k, v) { t[k] = v; deps.get(k)?.forEach((fn) => fn()); return true; },\n  });\n}\nconst s = reactive({ n: 1 });\neffect(() => console.log('n', s.n));\ns.n = 2;\n",
  "exampleCaption": "Tiny Proxy-based reactive n",
  "internals": [
    "This is user-space; engines do not ‘do Vue’ for you.",
    "Proxy get/set are the interception points.",
    "Solid/Vue/MobX differ in granularity (property vs store)."
  ],
  "takeaways": [
    "Track a global currentEffect during get.",
    "Store Set of effects per key.",
    "Triggering set during get tracking can recurse forever — batch or compare old/new.",
    "This is user-space; engines do not ‘do Vue’ for you."
  ],
  "revision": [
    "Validation / Reactivity Concepts: Reading a property while an effect is running subscribes. Writing notifies. Proxy is the sensor on the object.",
    "Track a global currentEffect during get.",
    "Store Set of effects per key.",
    "On set, copy the set and rerun.",
    "Trap: Triggering set during get tracking can recurse forever — batch or compare old/new."
  ],
  "flashcards": [
    [
      "Validation / Reactivity Concepts",
      "Reactivity: when a value changes, dependents update."
    ],
    [
      "Mental model",
      "Reading a property while an effect is running subscribes. Writing notifies. Proxy is the sensor on the object."
    ],
    [
      "Common trap",
      "Triggering set during get tracking can recurse forever — batch or compare old/new."
    ],
    [
      "Track a global currentEffect during get.",
      "Store Set of effects per key."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Validation / Reactivity Concepts and where does a beginner first see it?",
      "answerHint": "Reactivity: when a value changes, dependents update. JS implements this with getters that register the current effect, and setters that rerun those effects (Vue), or with Proxies that intercept get/set. It is a design pattern on top of the language, not a keyword. Validation is a simpler trap: set rejects bad values."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Validation / Reactivity Concepts works and name the main pitfall.",
      "answerHint": "Track a global currentEffect during get. Store Set of effects per key. On set, copy the set and rerun. Avoid infinite loops: do not set the same key inside its own effect without a guard. Pitfall: Triggering set during get tracking can recurse forever — batch or compare old/new."
    },
    {
      "level": "advanced",
      "question": "How would you explain Validation / Reactivity Concepts at an interview, including engine/spec details?",
      "answerHint": "This is user-space; engines do not ‘do Vue’ for you. Proxy get/set are the interception points. Solid/Vue/MobX differ in granularity (property vs store)."
    }
  ],
  "pitfalls": [
    "Triggering set during get tracking can recurse forever — batch or compare old/new.",
    "Avoid infinite loops: do not set the same key inside its own effect without a guard."
  ],
  "interview": {
    "expectations": [
      "Explain Validation / Reactivity Concepts without mixing it up with a nearby B1.41 — Proxy & Reflect topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "This is user-space; engines do not ‘do Vue’ for you."
    ],
    "commonQuestions": [
      "What is Validation / Reactivity Concepts?",
      "Why does JavaScript validation / reactivity concepts behave this way?",
      "What is the classic Validation / Reactivity Concepts interview trap?"
    ],
    "traps": [
      "Triggering set during get tracking can recurse forever — batch or compare old/new."
    ],
    "misconceptions": [
      "UI state trees needed automatic dependency tracking instead of manual subscribe for every field."
    ],
    "strongSignals": [
      "Separates Validation / Reactivity Concepts from lookalike APIs and can draw the mental model."
    ]
  }
})
