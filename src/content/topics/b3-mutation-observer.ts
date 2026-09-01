import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Mutation Observer",
  "whatIsIt": "MutationObserver watches a node for DOM changes: childList, attributes, characterData, subtree. The callback receives a batch of MutationRecords after mutations, asynchronously (microtask). Use for integrations with foreign widgets, not for your own React tree (you already know the updates). disconnect when done.",
  "whyExists": "Extensions and widgets needed to react to DOM they do not control, without monkey-patching Node.prototype.",
  "mentalModel": "A security camera on a branch of the tree. It does not fire inside your append() call; it reports a reel of what changed, soon after.",
  "how": [
    "new MutationObserver(cb).observe(node, { childList, subtree, attributes, attributeFilter }).",
    "Process records; avoid mutating in a way that loops forever.",
    "disconnect() / takeRecords().",
    "characterData for text node edits.",
    "Not a replacement for state management in your app."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Observing document.body with subtree: true in a busy app — performance cliff.",
    "variant": "warning"
  },
  "example": "const box = document.createElement('div');\nconst mo = new MutationObserver((recs) => {\n  console.log(recs.map((r) => r.type));\n});\nmo.observe(box, { childList: true });\nbox.append('hi');\nqueueMicrotask(() => { mo.disconnect(); });\n",
  "exampleCaption": "Observe childList; callback runs after the append",
  "internals": [
    "Records are queued and delivered in a microtask checkpoint.",
    "attributeOldValue / characterDataOldValue need extra options.",
    "Shadow DOM: observe the shadow root to see internals."
  ],
  "takeaways": [
    "new MutationObserver(cb).observe(node, { childList, subtree, attributes, attributeFilter }).",
    "Process records; avoid mutating in a way that loops forever.",
    "Observing document.body with subtree: true in a busy app — performance cliff.",
    "Records are queued and delivered in a microtask checkpoint."
  ],
  "revision": [
    "Mutation Observer: A security camera on a branch of the tree. It does not fire inside your append() call; it reports a reel of what changed, soon after.",
    "new MutationObserver(cb).observe(node, { childList, subtree, attributes, attributeFilter }).",
    "Process records; avoid mutating in a way that loops forever.",
    "disconnect() / takeRecords().",
    "Trap: Observing document.body with subtree: true in a busy app — performance cliff."
  ],
  "flashcards": [
    [
      "Mutation Observer",
      "MutationObserver watches a node for DOM changes: childList, attributes, characterData, subtree."
    ],
    [
      "Mental model",
      "A security camera on a branch of the tree. It does not fire inside your append() call; it reports a reel of what changed, soon after."
    ],
    [
      "Common trap",
      "Observing document.body with subtree: true in a busy app — performance cliff."
    ],
    [
      "new MutationObserver(cb).observe(node, { childList, subtree, attributes, attribu",
      "Process records; avoid mutating in a way that loops forever."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Mutation Observer and where does a beginner first see it?",
      "answerHint": "MutationObserver watches a node for DOM changes: childList, attributes, characterData, subtree. The callback receives a batch of MutationRecords after mutations, asynchronously (microtask). Use for integrations with foreign widgets, not for your own React tree (you already know the updates). disconnect when done."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Mutation Observer works and name the main pitfall.",
      "answerHint": "new MutationObserver(cb).observe(node, { childList, subtree, attributes, attributeFilter }). Process records; avoid mutating in a way that loops forever. disconnect() / takeRecords(). characterData for text node edits. Not a replacement for state management in your app. Pitfall: Observing document.body with subtree: true in a busy app — performance cliff."
    },
    {
      "level": "advanced",
      "question": "How would you explain Mutation Observer at an interview, including engine/spec details?",
      "answerHint": "Records are queued and delivered in a microtask checkpoint. attributeOldValue / characterDataOldValue need extra options. Shadow DOM: observe the shadow root to see internals."
    }
  ],
  "pitfalls": [
    "Observing document.body with subtree: true in a busy app — performance cliff.",
    "Not a replacement for state management in your app."
  ],
  "interview": {
    "expectations": [
      "Explain Mutation Observer without mixing it up with a nearby B3 — Browser Fundamentals topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Records are queued and delivered in a microtask checkpoint."
    ],
    "commonQuestions": [
      "What is Mutation Observer?",
      "Why does JavaScript mutation observer behave this way?",
      "What is the classic Mutation Observer interview trap?"
    ],
    "traps": [
      "Observing document.body with subtree: true in a busy app — performance cliff."
    ],
    "misconceptions": [
      "Extensions and widgets needed to react to DOM they do not control, without monkey-patching Node.prototype."
    ],
    "strongSignals": [
      "Separates Mutation Observer from lookalike APIs and can draw the mental model."
    ]
  }
})
