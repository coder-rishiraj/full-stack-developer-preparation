import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Immutability",
  "whatIsIt": "Immutability in JS is a convention: copy-on-write with spread, slice, concat, Map/Set copies, Object.freeze (shallow). The engine still uses mutable objects. Structural sharing is manual or via libraries (Immer). Const is not immutability. Frozen objects throw in strict on mutation.",
  "whyExists": "React state and undo stacks need old versions to stay valid. Mutation aliases are the bug.",
  "mentalModel": "Never edit last frame’s film. Print a new frame with the change. freeze is a lock on one frame’s surface.",
  "how": [
    "Replace arrays/objects instead of push on shared state.",
    "Nested updates copy each level: { ...s, user: { ...s.user, n } }.",
    "freeze in tests to catch accidental mutation.",
    "Immer if nested copies hurt."
  ],
  "callout": {
    "title": "Watch for",
    "text": "...state still shares nested objects you forgot to copy.",
    "variant": "warning"
  },
  "example": "const state = { n: 1, tags: ['a'] };\nconst next = { ...state, n: 2, tags: [...state.tags, 'b'] };\nconsole.log(state, next, state.tags === next.tags);\nObject.freeze(state);\ntry { state.n = 3; } catch (e) { console.log(e.name); }\n",
  "exampleCaption": "Spread copy vs freeze on the old state",
  "internals": [
    "Spread is shallow CopyDataProperties.",
    "freeze SetIntegrityLevel.",
    "Engines may COW internally; that is not a language guarantee you can observe as identity."
  ],
  "takeaways": [
    "Replace arrays/objects instead of push on shared state.",
    "Nested updates copy each level: { ...s, user: { ...s.user, n } }.",
    "...state still shares nested objects you forgot to copy.",
    "Spread is shallow CopyDataProperties."
  ],
  "revision": [
    "Immutability: Never edit last frame’s film. Print a new frame with the change. freeze is a lock on one frame’s surface.",
    "Replace arrays/objects instead of push on shared state.",
    "Nested updates copy each level: { ...s, user: { ...s.user, n } }.",
    "freeze in tests to catch accidental mutation.",
    "Trap: ...state still shares nested objects you forgot to copy."
  ],
  "flashcards": [
    [
      "Immutability",
      "Immutability in JS is a convention: copy-on-write with spread, slice, concat, Map/Set copies, Object.freeze (shallow)."
    ],
    [
      "Mental model",
      "Never edit last frame’s film. Print a new frame with the change. freeze is a lock on one frame’s surface."
    ],
    [
      "Common trap",
      "...state still shares nested objects you forgot to copy."
    ],
    [
      "Replace arrays/objects instead of push on shared state.",
      "Nested updates copy each level: { ...s, user: { ...s.user, n } }."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Immutability and where does a beginner first see it?",
      "answerHint": "Immutability in JS is a convention: copy-on-write with spread, slice, concat, Map/Set copies, Object.freeze (shallow). The engine still uses mutable objects. Structural sharing is manual or via libraries (Immer). Const is not immutability. Frozen objects throw in strict on mutation."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Immutability works and name the main pitfall.",
      "answerHint": "Replace arrays/objects instead of push on shared state. Nested updates copy each level: { ...s, user: { ...s.user, n } }. freeze in tests to catch accidental mutation. Immer if nested copies hurt. Pitfall: ...state still shares nested objects you forgot to copy."
    },
    {
      "level": "advanced",
      "question": "How would you explain Immutability at an interview, including engine/spec details?",
      "answerHint": "Spread is shallow CopyDataProperties. freeze SetIntegrityLevel. Engines may COW internally; that is not a language guarantee you can observe as identity."
    }
  ],
  "pitfalls": [
    "...state still shares nested objects you forgot to copy.",
    "Immer if nested copies hurt."
  ],
  "interview": {
    "expectations": [
      "Explain Immutability without mixing it up with a nearby B1.38 — Functional JavaScript topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Spread is shallow CopyDataProperties."
    ],
    "commonQuestions": [
      "What is Immutability?",
      "Why does JavaScript immutability behave this way?",
      "What is the classic Immutability interview trap?"
    ],
    "traps": [
      "...state still shares nested objects you forgot to copy."
    ],
    "misconceptions": [
      "React state and undo stacks need old versions to stay valid. Mutation aliases are the bug."
    ],
    "strongSignals": [
      "Separates Immutability from lookalike APIs and can draw the mental model."
    ]
  }
})
