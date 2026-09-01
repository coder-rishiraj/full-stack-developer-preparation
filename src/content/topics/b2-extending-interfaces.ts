import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Extending Interfaces",
  "whatIsIt": "interface B extends A adds A's members to B. Multiple extends merge shapes. extends is compile-time only — no prototype chain. Use for layering optional fields and role-specific views of entities.",
  "whyExists": "Composition of types mirrors domain specialization without class inheritance.",
  "mentalModel": "Stack transparent sheets — each adds fields to the same form.",
  "how": [
    "Base interface with shared fields.",
    "Specialized interfaces extend base.",
    "Intersection type A & B alternative when not re-opening.",
    "Generic interfaces extend generic bases: interface Page<T> extends Node.",
    "Document extension chains for API consumers."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Diamond-shaped extensions with conflicting property types — compiler errors on incompatible types.",
    "variant": "warning"
  },
  "example": "interface Entity { id: string; createdAt: Date }\ninterface Post extends Entity { title: string; body: string }\nfunction summarize(p: Post): string {\n  return `[${p.id}] ${p.title}`;\n}\nconsole.log(summarize({ id: '1', createdAt: new Date(), title: 'Hi', body: '' }));\nconst __typed: Entity = {} as Entity;\nconsole.log(summarize('demo'));",
  "exampleCaption": "Post extends Entity with title and body",
  "internals": [
    "extends resolves to flattened member set.",
    "Generic constraints often use extends on type params.",
    "Interface extends is checked for assignability."
  ],
  "takeaways": [
    "Base interface with shared fields.",
    "Specialized interfaces extend base.",
    "Diamond-shaped extensions with conflicting property types — compiler errors on incompatible types.",
    "extends resolves to flattened member set."
  ],
  "revision": [
    "Extending Interfaces: Stack transparent sheets — each adds fields to the same form.",
    "Base interface with shared fields.",
    "Specialized interfaces extend base.",
    "Intersection type A & B alternative when not re-opening.",
    "Trap: Diamond-shaped extensions with conflicting property types — compiler errors on incompatible types."
  ],
  "flashcards": [
    [
      "Extending Interfaces",
      "interface B extends A adds A's members to B."
    ],
    [
      "Mental model",
      "Stack transparent sheets — each adds fields to the same form."
    ],
    [
      "Common trap",
      "Diamond-shaped extensions with conflicting property types — compiler errors on incompatible types."
    ],
    [
      "Base interface with shared fields.",
      "Specialized interfaces extend base."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Extending Interfaces in TypeScript and when do you use it?",
      "answerHint": "interface B extends A adds A's members to B. Multiple extends merge shapes. extends is compile-time only — no prototype chain. Use for layering optional fields and role-specific views of entities."
    },
    {
      "level": "intermediate",
      "question": "Explain Extending Interfaces with a code example and one pitfall.",
      "answerHint": "Base interface with shared fields. Specialized interfaces extend base. Intersection type A & B alternative when not re-opening. Generic interfaces extend generic bases: interface Page<T> extends Node. Document extension chains for API consumers. Pitfall: Diamond-shaped extensions with conflicting property types — compiler errors on incompatible types."
    },
    {
      "level": "advanced",
      "question": "How would you explain Extending Interfaces in a senior frontend interview?",
      "answerHint": "extends resolves to flattened member set. Generic constraints often use extends on type params. Interface extends is checked for assignability. interface Entity { id: string; createdAt: Date }\ninterface Post extends Entity { title: string; body: string }\nfunction "
    }
  ],
  "pitfalls": [
    "Diamond-shaped extensions with conflicting property types — compiler errors on incompatible types."
  ],
  "interview": {
    "expectations": [
      "Explain Extending Interfaces with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "extends resolves to flattened member set."
    ],
    "commonQuestions": [
      "What is Extending Interfaces?",
      "When would you choose Extending Interfaces over alternatives?",
      "What is the classic Extending Interfaces interview trap?"
    ],
    "traps": [
      "Diamond-shaped extensions with conflicting property types — compiler errors on incompatible types."
    ],
    "misconceptions": [
      "Composition of types mirrors domain specialization without class inheritance."
    ],
    "strongSignals": [
      "Uses Extending Interfaces to remove invalid states, not just document them."
    ]
  }
})
