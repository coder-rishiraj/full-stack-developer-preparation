import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "this Types",
  "whatIsIt": "this types annotate polymorphic this: method(this: this, ...) in base class for fluent APIs. this parameter is compile-time only — not runtime arg. thisType in utilities extracts this type.",
  "whyExists": "Builder pattern and ORM query APIs need this chaining typed.",
  "mentalModel": "Method returns this — type follows subclass.",
  "how": [
    "interface Builder { set(x: string): this; }",
    "this type in derived class narrows to subclass.",
    "ThisParameterType<F> extracts this from function type.",
    "Avoid binding this incorrectly in callbacks.",
    "No this param on arrow functions — lexical this."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Returning Builder instead of this — subclass chain loses subtype methods.",
    "variant": "warning"
  },
  "example": "class QueryBuilder {\n  private parts: string[] = [];\n  where(clause: string): this {\n    this.parts.push(clause);\n    return this;\n  }\n  build() { return this.parts.join(' AND '); }\nclass AdminQuery extends QueryBuilder {\n  override where(c: string): this { return super.where(`(${c})`); }\nconsole.log(new AdminQuery().where('a=1').build());",
  "exampleCaption": "where returns this for fluent chaining",
  "internals": [
    "Polymorphic this types (TS 1.4+) for inheritance-safe fluency.",
    "this in type position resolved at call site.",
    "strictThis checks this undefined in functions."
  ],
  "takeaways": [
    "interface Builder { set(x: string): this; }",
    "this type in derived class narrows to subclass.",
    "Returning Builder instead of this — subclass chain loses subtype methods.",
    "Polymorphic this types (TS 1.4+) for inheritance-safe fluency."
  ],
  "revision": [
    "this Types: Method returns this — type follows subclass.",
    "interface Builder { set(x: string): this; }",
    "this type in derived class narrows to subclass.",
    "ThisParameterType<F> extracts this from function type.",
    "Trap: Returning Builder instead of this — subclass chain loses subtype methods."
  ],
  "flashcards": [
    [
      "this Types",
      "this types annotate polymorphic this: method(this: this, ...) in base class for fluent APIs."
    ],
    [
      "Mental model",
      "Method returns this — type follows subclass."
    ],
    [
      "Common trap",
      "Returning Builder instead of this — subclass chain loses subtype methods."
    ],
    [
      "interface Builder { set(x: string): this; }",
      "this type in derived class narrows to subclass."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is this Types in TypeScript and when do you use it?",
      "answerHint": "this types annotate polymorphic this: method(this: this, ...) in base class for fluent APIs. this parameter is compile-time only — not runtime arg. thisType in utilities extracts this type."
    },
    {
      "level": "intermediate",
      "question": "Explain this Types with a code example and one pitfall.",
      "answerHint": "interface Builder { set(x: string): this; } this type in derived class narrows to subclass. ThisParameterType<F> extracts this from function type. Avoid binding this incorrectly in callbacks. No this param on arrow functions — lexical this. Pitfall: Returning Builder instead of this — subclass chain loses subtype methods."
    },
    {
      "level": "advanced",
      "question": "How would you explain this Types in a senior frontend interview?",
      "answerHint": "Polymorphic this types (TS 1.4+) for inheritance-safe fluency. this in type position resolved at call site. strictThis checks this undefined in functions. class QueryBuilder {\n  private parts: string[] = [];\n  where(clause: string): this {\n    this.parts.push(clause);\n    re"
    }
  ],
  "pitfalls": [
    "Returning Builder instead of this — subclass chain loses subtype methods."
  ],
  "interview": {
    "expectations": [
      "Explain this Types with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "Polymorphic this types (TS 1.4+) for inheritance-safe fluency."
    ],
    "commonQuestions": [
      "What is this Types?",
      "When would you choose this Types over alternatives?",
      "What is the classic this Types interview trap?"
    ],
    "traps": [
      "Returning Builder instead of this — subclass chain loses subtype methods."
    ],
    "misconceptions": [
      "Builder pattern and ORM query APIs need this chaining typed."
    ],
    "strongSignals": [
      "Uses this Types to remove invalid states, not just document them."
    ]
  }
})
