import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "RemoteData Async State Pattern",
  "whatIsIt": "Remote data models async fetches as discriminated union: idle, loading, success with data, error with message. UI switches on status; impossible states (loading + data) are unrepresentable.",
  "whyExists": "Standard pattern in React/Redux apps — interviewers ask how you type fetch lifecycle.",
  "mentalModel": "Traffic light for network calls — only one light on.",
  "how": [
    "Define union with status literal field.",
    "Transition functions return next RemoteData state.",
    "Render with exhaustive switch or lookup table.",
    "Generic RemoteData<T> reuses for any entity.",
    "Combine with React Query types when possible."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Single object with isLoading + data + error booleans — allows contradictory state.",
    "variant": "warning"
  },
  "example": "type RemoteData<T> =\n  | { status: 'idle' }\n  | { status: 'loading' }\n  | { status: 'success'; data: T }\n  | { status: 'error'; error: string };\nfunction renderUser(r: RemoteData<{ name: string }>) {\n  if (r.status === 'success') return r.data.name;\n  if (r.status === 'error') return r.error;\n  return r.status;\n}",
  "exampleCaption": "success branch accesses data safely",
  "internals": [
    "Tagged union prevents illegal combinations at type level.",
    "Narrowing works in nested conditionals.",
    "Can extend with pagination meta per status."
  ],
  "takeaways": [
    "Define union with status literal field.",
    "Transition functions return next RemoteData state.",
    "Single object with isLoading + data + error booleans — allows contradictory state.",
    "Tagged union prevents illegal combinations at type level."
  ],
  "revision": [
    "RemoteData Async State Pattern: Traffic light for network calls — only one light on.",
    "Define union with status literal field.",
    "Transition functions return next RemoteData state.",
    "Render with exhaustive switch or lookup table.",
    "Trap: Single object with isLoading + data + error booleans — allows contradictory state."
  ],
  "flashcards": [
    [
      "RemoteData Async State Pattern",
      "Remote data models async fetches as discriminated union: idle, loading, success with data, error with message."
    ],
    [
      "Mental model",
      "Traffic light for network calls — only one light on."
    ],
    [
      "Common trap",
      "Single object with isLoading + data + error booleans — allows contradictory state."
    ],
    [
      "Define union with status literal field.",
      "Transition functions return next RemoteData state."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is RemoteData Async State Pattern in TypeScript and when do you use it?",
      "answerHint": "Remote data models async fetches as discriminated union: idle, loading, success with data, error with message. UI switches on status; impossible states (loading + data) are unrepresentable."
    },
    {
      "level": "intermediate",
      "question": "Explain RemoteData Async State Pattern with a code example and one pitfall.",
      "answerHint": "Define union with status literal field. Transition functions return next RemoteData state. Render with exhaustive switch or lookup table. Generic RemoteData<T> reuses for any entity. Combine with React Query types when possible. Pitfall: Single object with isLoading + data + error booleans — allows contradictory state."
    },
    {
      "level": "advanced",
      "question": "How would you explain RemoteData Async State Pattern in a senior frontend interview?",
      "answerHint": "Tagged union prevents illegal combinations at type level. Narrowing works in nested conditionals. Can extend with pagination meta per status. type RemoteData<T> =\n  | { status: 'idle' }\n  | { status: 'loading' }\n  | { status: 'success'; data: T }\n  | { status: '"
    }
  ],
  "pitfalls": [
    "Single object with isLoading + data + error booleans — allows contradictory state."
  ],
  "interview": {
    "expectations": [
      "Explain RemoteData Async State Pattern with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "Tagged union prevents illegal combinations at type level."
    ],
    "commonQuestions": [
      "What is RemoteData Async State Pattern?",
      "When would you choose RemoteData Async State Pattern over alternatives?",
      "What is the classic RemoteData Async State Pattern interview trap?"
    ],
    "traps": [
      "Single object with isLoading + data + error booleans — allows contradictory state."
    ],
    "misconceptions": [
      "Standard pattern in React/Redux apps — interviewers ask how you type fetch lifecycle."
    ],
    "strongSignals": [
      "Uses RemoteData Async State Pattern to remove invalid states, not just document them."
    ]
  }
})
