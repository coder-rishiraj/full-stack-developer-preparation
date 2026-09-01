import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Record",
  "whatIsIt": "Record<K, V> maps keys K to values V: Record<Status, string> for lookup tables. K extends string | number | symbol. Safer than index signature when keys are finite union.",
  "whyExists": "Variant maps and dictionaries with known key unions use Record.",
  "mentalModel": "Spreadsheet with fixed row headers → value type.",
  "how": [
    "Record<Route, ComponentType> for router map.",
    "Record<string, unknown> for JSON object.",
    "satisfies Record<Status, Handler> validates completeness.",
    "Prefer Record over enum-keyed object when using unions.",
    "Partial<Record<K,V>> for sparse maps."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Record<Status, string> missing one key — error; good for exhaustiveness.",
    "variant": "warning"
  },
  "example": "type Status = 'idle' | 'loading' | 'error';\nconst LABELS: Record<Status, string> = {\n  idle: 'Ready',\n  loading: 'Loading…',\n  error: 'Failed',\n};\nconsole.log(LABELS.loading);\n// type Status = 'idle' | 'loading' | 'error'; narrows allowed values",
  "exampleCaption": "Record requires every Status key present",
  "internals": [
    "Record keys must be assignable to K constraint.",
    "Homogeneous value type unlike arbitrary index signature.",
    "Mapped type { [P in K]: V } equivalent."
  ],
  "takeaways": [
    "Record<Route, ComponentType> for router map.",
    "Record<string, unknown> for JSON object.",
    "Record<Status, string> missing one key — error; good for exhaustiveness.",
    "Record keys must be assignable to K constraint."
  ],
  "revision": [
    "Record: Spreadsheet with fixed row headers → value type.",
    "Record<Route, ComponentType> for router map.",
    "Record<string, unknown> for JSON object.",
    "satisfies Record<Status, Handler> validates completeness.",
    "Trap: Record<Status, string> missing one key — error; good for exhaustiveness."
  ],
  "flashcards": [
    [
      "Record",
      "Record<K, V> maps keys K to values V: Record<Status, string> for lookup tables."
    ],
    [
      "Mental model",
      "Spreadsheet with fixed row headers → value type."
    ],
    [
      "Common trap",
      "Record<Status, string> missing one key — error; good for exhaustiveness."
    ],
    [
      "Record<Route, ComponentType> for router map.",
      "Record<string, unknown> for JSON object."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Record in TypeScript and when do you use it?",
      "answerHint": "Record<K, V> maps keys K to values V: Record<Status, string> for lookup tables. K extends string | number | symbol. Safer than index signature when keys are finite union."
    },
    {
      "level": "intermediate",
      "question": "Explain Record with a code example and one pitfall.",
      "answerHint": "Record<Route, ComponentType> for router map. Record<string, unknown> for JSON object. satisfies Record<Status, Handler> validates completeness. Prefer Record over enum-keyed object when using unions. Partial<Record<K,V>> for sparse maps. Pitfall: Record<Status, string> missing one key — error; good for exhaustiveness."
    },
    {
      "level": "advanced",
      "question": "How would you explain Record in a senior frontend interview?",
      "answerHint": "Record keys must be assignable to K constraint. Homogeneous value type unlike arbitrary index signature. Mapped type { [P in K]: V } equivalent. type Status = 'idle' | 'loading' | 'error';\nconst LABELS: Record<Status, string> = {\n  idle: 'Ready',\n  loading: 'Loadin"
    }
  ],
  "pitfalls": [
    "Record<Status, string> missing one key — error; good for exhaustiveness."
  ],
  "interview": {
    "expectations": [
      "Explain Record with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "Record keys must be assignable to K constraint."
    ],
    "commonQuestions": [
      "What is Record?",
      "When would you choose Record over alternatives?",
      "What is the classic Record interview trap?"
    ],
    "traps": [
      "Record<Status, string> missing one key — error; good for exhaustiveness."
    ],
    "misconceptions": [
      "Variant maps and dictionaries with known key unions use Record."
    ],
    "strongSignals": [
      "Uses Record to remove invalid states, not just document them."
    ]
  }
})
