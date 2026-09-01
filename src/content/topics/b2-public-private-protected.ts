import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "public / private / protected",
  "whatIsIt": "Access modifiers control visibility: public (default), private (class body only), protected (class + subclasses). They are compile-time only in TS — erased in emit unless using native private # fields.",
  "whyExists": "Encapsulation documents intent and prevents cross-module access mistakes.",
  "mentalModel": "Door locks on class rooms — private vs protected guest list.",
  "how": [
    "private fields not accessible outside class in TS checker.",
    "protected for template method pattern hooks.",
    "Parameter properties: constructor(private repo: Repo).",
    "Use #field for runtime private when needed.",
    "Interface members implicitly public."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Thinking private survives at runtime in TS — plain JS can still access unless # used.",
    "variant": "warning"
  },
  "example": "class Account {\n  public readonly id: string;\n  protected balance = 0;\n  private pin: string;\n  constructor(id: string, pin: string) { this.id = id; this.pin = pin; }\n  deposit(amount: number) { this.balance += amount; }\n}\nconst a = new Account('1', '0000');\nconsole.log(a.id, a.deposit(10));",
  "exampleCaption": "public id; protected balance; private pin",
  "internals": [
    "Private modifier is structural only in emitted JS.",
    "Protected accessible in subclass methods only.",
    "ECMAScript private # interoperates with TS 4.3+."
  ],
  "takeaways": [
    "private fields not accessible outside class in TS checker.",
    "protected for template method pattern hooks.",
    "Thinking private survives at runtime in TS — plain JS can still access unless # used.",
    "Private modifier is structural only in emitted JS."
  ],
  "revision": [
    "public / private / protected: Door locks on class rooms — private vs protected guest list.",
    "private fields not accessible outside class in TS checker.",
    "protected for template method pattern hooks.",
    "Parameter properties: constructor(private repo: Repo).",
    "Trap: Thinking private survives at runtime in TS — plain JS can still access unless # used."
  ],
  "flashcards": [
    [
      "public / private / protected",
      "Access modifiers control visibility: public (default), private (class body only), protected (class + subclasses)."
    ],
    [
      "Mental model",
      "Door locks on class rooms — private vs protected guest list."
    ],
    [
      "Common trap",
      "Thinking private survives at runtime in TS — plain JS can still access unless # used."
    ],
    [
      "private fields not accessible outside class in TS checker.",
      "protected for template method pattern hooks."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is public / private / protected in TypeScript and when do you use it?",
      "answerHint": "Access modifiers control visibility: public (default), private (class body only), protected (class + subclasses). They are compile-time only in TS — erased in emit unless using native private # fields."
    },
    {
      "level": "intermediate",
      "question": "Explain public / private / protected with a code example and one pitfall.",
      "answerHint": "private fields not accessible outside class in TS checker. protected for template method pattern hooks. Parameter properties: constructor(private repo: Repo). Use #field for runtime private when needed. Interface members implicitly public. Pitfall: Thinking private survives at runtime in TS — plain JS can still access unless # used."
    },
    {
      "level": "advanced",
      "question": "How would you explain public / private / protected in a senior frontend interview?",
      "answerHint": "Private modifier is structural only in emitted JS. Protected accessible in subclass methods only. ECMAScript private # interoperates with TS 4.3+. class Account {\n  public readonly id: string;\n  protected balance = 0;\n  private pin: string;\n  constructor(id: string, "
    }
  ],
  "pitfalls": [
    "Thinking private survives at runtime in TS — plain JS can still access unless # used."
  ],
  "interview": {
    "expectations": [
      "Explain public / private / protected with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "Private modifier is structural only in emitted JS."
    ],
    "commonQuestions": [
      "What is public / private / protected?",
      "When would you choose public / private / protected over alternatives?",
      "What is the classic public / private / protected interview trap?"
    ],
    "traps": [
      "Thinking private survives at runtime in TS — plain JS can still access unless # used."
    ],
    "misconceptions": [
      "Encapsulation documents intent and prevents cross-module access mistakes."
    ],
    "strongSignals": [
      "Uses public / private / protected to remove invalid states, not just document them."
    ]
  }
})
