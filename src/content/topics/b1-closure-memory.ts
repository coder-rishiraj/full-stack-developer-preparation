import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Closure Memory Implications",
  "whatIsIt": "Closures retain everything in the captured environment record that the engine cannot prove is unused. A long-lived callback that closes over a big array, a DOM node, or a whole component instance pins that memory. Detach listeners, drop maps of callbacks, and avoid capturing `this`’s large fields if a small id suffices.",
  "whyExists": "SPAs run for hours. A single leftover subscription is a leak that heap snapshots show as detached nodes plus a function.",
  "mentalModel": "The backpack can contain a bowling ball. If the function lives in a Set of listeners, the bowling ball never leaves.",
  "how": [
    "Capture primitives/ids, not whole response objects, when possible.",
    "Clear intervals and removeEventListener in dispose.",
    "WeakMap for metadata keyed by objects you do not want to pin extra.",
    "Do not put large data on module scope ‘just in case.’"
  ],
  "callout": {
    "title": "Watch for",
    "text": "Removing a listener with a different function identity (new arrow) does not remove the old one — the old closure stays.",
    "variant": "warning"
  },
  "example": "function attach(node) {\n  const onClick = () => console.log(node.id);\n  node.addEventListener('click', onClick);\n  return () => node.removeEventListener('click', onClick);\n}\nconst fake = { id: 'btn', addEventListener() {}, removeEventListener() {} };\nconst detach = attach(fake);\ndetach();\nconsole.log('released listener');\n",
  "exampleCaption": "Always return a disposer for listener closures",
  "internals": [
    "Listener lists hold strong references to callback functions.",
    "Those functions hold [[Environment]] which holds the node binding.",
    "That cycle (node → listener → env → node) is collectable if both are unreachable from roots; leftover global registries break that."
  ],
  "takeaways": [
    "Capture primitives/ids, not whole response objects, when possible.",
    "Clear intervals and removeEventListener in dispose.",
    "Removing a listener with a different function identity (new arrow) does not remove the old one — the old closure stays.",
    "Listener lists hold strong references to callback functions."
  ],
  "revision": [
    "Closure Memory Implications: The backpack can contain a bowling ball. If the function lives in a Set of listeners, the bowling ball never leaves.",
    "Capture primitives/ids, not whole response objects, when possible.",
    "Clear intervals and removeEventListener in dispose.",
    "WeakMap for metadata keyed by objects you do not want to pin extra.",
    "Trap: Removing a listener with a different function identity (new arrow) does not remove the old one — the old closure stays."
  ],
  "flashcards": [
    [
      "Closure Memory Implications",
      "Closures retain everything in the captured environment record that the engine cannot prove is unused."
    ],
    [
      "Mental model",
      "The backpack can contain a bowling ball. If the function lives in a Set of listeners, the bowling ball never leaves."
    ],
    [
      "Common trap",
      "Removing a listener with a different function identity (new arrow) does not remove the old one — the old closure stays."
    ],
    [
      "Capture primitives/ids, not whole response objects, when possible.",
      "Clear intervals and removeEventListener in dispose."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Closure Memory Implications and where does a beginner first see it?",
      "answerHint": "Closures retain everything in the captured environment record that the engine cannot prove is unused. A long-lived callback that closes over a big array, a DOM node, or a whole component instance pins that memory. Detach listeners, drop maps of callbacks, and avoid capturing `this`’s large fields if a small id suffices."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Closure Memory Implications works and name the main pitfall.",
      "answerHint": "Capture primitives/ids, not whole response objects, when possible. Clear intervals and removeEventListener in dispose. WeakMap for metadata keyed by objects you do not want to pin extra. Do not put large data on module scope ‘just in case.’ Pitfall: Removing a listener with a different function identity (new arrow) does not remove the old one — the old closure stays."
    },
    {
      "level": "advanced",
      "question": "How would you explain Closure Memory Implications at an interview, including engine/spec details?",
      "answerHint": "Listener lists hold strong references to callback functions. Those functions hold [[Environment]] which holds the node binding. That cycle (node → listener → env → node) is collectable if both are unreachable from roots; leftover global registries break that."
    }
  ],
  "pitfalls": [
    "Removing a listener with a different function identity (new arrow) does not remove the old one — the old closure stays.",
    "Do not put large data on module scope ‘just in case.’"
  ],
  "interview": {
    "expectations": [
      "Explain Closure Memory Implications without mixing it up with a nearby B1.12 — Closures topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Listener lists hold strong references to callback functions."
    ],
    "commonQuestions": [
      "What is Closure Memory Implications?",
      "Why does JavaScript closure memory implications behave this way?",
      "What is the classic Closure Memory Implications interview trap?"
    ],
    "traps": [
      "Removing a listener with a different function identity (new arrow) does not remove the old one — the old closure stays."
    ],
    "misconceptions": [
      "SPAs run for hours. A single leftover subscription is a leak that heap snapshots show as detached nodes plus a function."
    ],
    "strongSignals": [
      "Separates Closure Memory Implications from lookalike APIs and can draw the mental model."
    ]
  }
})
