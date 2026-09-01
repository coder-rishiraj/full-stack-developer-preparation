import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Declaration Merging",
  "whatIsIt": "Interfaces with same name in same scope merge into one type. Used for extending globals and library types. Type aliases cannot merge.",
  "whyExists": "Augment Express Request or Window without forking @types.",
  "mentalModel": "Stack transparent interface sheets with same title.",
  "how": [
    "declare global { interface Window { myApp: App } }",
    "namespace + interface merge in legacy code.",
    "Prefer module augmentation over global when possible.",
    "Do not merge unrelated interfaces accidentally.",
    "Use export {} to make file module for global augmentation."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Duplicate type alias name — error, not merge.",
    "variant": "warning"
  },
  "example": "export {};\ndeclare global {\n  interface Window {\n    __APP_VERSION__?: string;\n  }\nfunction version(): string | undefined {\n  return window.__APP_VERSION__;\nconsole.log(version());",
  "exampleCaption": "Global interface merge adds __APP_VERSION__ to Window",
  "internals": [
    "Interface merging is declaration-level only.",
    "Value + namespace merging separate feature.",
    "Module augmentation targets exportable interfaces."
  ],
  "takeaways": [
    "declare global { interface Window { myApp: App } }",
    "namespace + interface merge in legacy code.",
    "Duplicate type alias name — error, not merge.",
    "Interface merging is declaration-level only."
  ],
  "revision": [
    "Declaration Merging: Stack transparent interface sheets with same title.",
    "declare global { interface Window { myApp: App } }",
    "namespace + interface merge in legacy code.",
    "Prefer module augmentation over global when possible.",
    "Trap: Duplicate type alias name — error, not merge."
  ],
  "flashcards": [
    [
      "Declaration Merging",
      "Interfaces with same name in same scope merge into one type."
    ],
    [
      "Mental model",
      "Stack transparent interface sheets with same title."
    ],
    [
      "Common trap",
      "Duplicate type alias name — error, not merge."
    ],
    [
      "declare global { interface Window { myApp: App } }",
      "namespace + interface merge in legacy code."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Declaration Merging in TypeScript and when do you use it?",
      "answerHint": "Interfaces with same name in same scope merge into one type. Used for extending globals and library types. Type aliases cannot merge."
    },
    {
      "level": "intermediate",
      "question": "Explain Declaration Merging with a code example and one pitfall.",
      "answerHint": "declare global { interface Window { myApp: App } } namespace + interface merge in legacy code. Prefer module augmentation over global when possible. Do not merge unrelated interfaces accidentally. Use export {} to make file module for global augmentation. Pitfall: Duplicate type alias name — error, not merge."
    },
    {
      "level": "advanced",
      "question": "How would you explain Declaration Merging in a senior frontend interview?",
      "answerHint": "Interface merging is declaration-level only. Value + namespace merging separate feature. Module augmentation targets exportable interfaces. export {};\ndeclare global {\n  interface Window {\n    __APP_VERSION__?: string;\n  }\nfunction version(): string | undefine"
    }
  ],
  "pitfalls": [
    "Duplicate type alias name — error, not merge."
  ],
  "interview": {
    "expectations": [
      "Explain Declaration Merging with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "Interface merging is declaration-level only."
    ],
    "commonQuestions": [
      "What is Declaration Merging?",
      "When would you choose Declaration Merging over alternatives?",
      "What is the classic Declaration Merging interview trap?"
    ],
    "traps": [
      "Duplicate type alias name — error, not merge."
    ],
    "misconceptions": [
      "Augment Express Request or Window without forking @types."
    ],
    "strongSignals": [
      "Uses Declaration Merging to remove invalid states, not just document them."
    ]
  }
})
