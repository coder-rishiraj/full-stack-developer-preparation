import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Template Literal Types",
  "whatIsIt": "Template literal types build string types from patterns: `on${Capitalize<Event>}` for event handler names. Combine with unions — distributes over union members. Powers typed DOM/event APIs.",
  "whyExists": "Interview topic — template literal event handlers in React/design systems.",
  "mentalModel": "String types assembled like template strings at type level.",
  "how": [
    "type PropEvent<T, E> = `on${Capitalize<E & string>}`;",
    "Union of events → union of handler prop names.",
    "Intrinsic: Uppercase, Lowercase, Capitalize, Uncapitalize.",
    "Parse strings with infer in conditional types.",
    "Match CSS properties, route paths, permission strings."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Template with non-string union member — constrain E extends string.",
    "variant": "warning"
  },
  "example": "type Event = 'click' | 'focus';\ntype HandlerProp = `on${Capitalize<Event>}`; // \"onClick\" | \"onFocus\"\nconst prop: HandlerProp = 'onClick';\nconsole.log(prop);\nconst __typed: Event = {} as Event;\nconsole.log(\"void __typed;\");\nconsole.log(\"export type { Event }\");\n// type Event = 'click' | 'focus'; narrows allowed values",
  "exampleCaption": "Capitalize distributes over Event union",
  "internals": [
    "Distributive over union in template parts.",
    "Pattern parsing via infer in conditional.",
    "Used in React 18+ aria/data attribute helpers."
  ],
  "takeaways": [
    "type PropEvent<T, E> = `on${Capitalize<E & string>}`;",
    "Union of events → union of handler prop names.",
    "Template with non-string union member — constrain E extends string.",
    "Distributive over union in template parts."
  ],
  "revision": [
    "Template Literal Types: String types assembled like template strings at type level.",
    "type PropEvent<T, E> = `on${Capitalize<E & string>}`;",
    "Union of events → union of handler prop names.",
    "Intrinsic: Uppercase, Lowercase, Capitalize, Uncapitalize.",
    "Trap: Template with non-string union member — constrain E extends string."
  ],
  "flashcards": [
    [
      "Template Literal Types",
      "Template literal types build string types from patterns: `on${Capitalize<Event>}` for event handler names."
    ],
    [
      "Mental model",
      "String types assembled like template strings at type level."
    ],
    [
      "Common trap",
      "Template with non-string union member — constrain E extends string."
    ],
    [
      "type PropEvent<T, E> = `on${Capitalize<E & string>}`;",
      "Union of events → union of handler prop names."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Template Literal Types in TypeScript and when do you use it?",
      "answerHint": "Template literal types build string types from patterns: `on${Capitalize<Event>}` for event handler names. Combine with unions — distributes over union members. Powers typed DOM/event APIs."
    },
    {
      "level": "intermediate",
      "question": "Explain Template Literal Types with a code example and one pitfall.",
      "answerHint": "type PropEvent<T, E> = `on${Capitalize<E & string>}`; Union of events → union of handler prop names. Intrinsic: Uppercase, Lowercase, Capitalize, Uncapitalize. Parse strings with infer in conditional types. Match CSS properties, route paths, permission strings. Pitfall: Template with non-string union member — constrain E extends string."
    },
    {
      "level": "advanced",
      "question": "How would you explain Template Literal Types in a senior frontend interview?",
      "answerHint": "Distributive over union in template parts. Pattern parsing via infer in conditional. Used in React 18+ aria/data attribute helpers. type Event = 'click' | 'focus';\ntype HandlerProp = `on${Capitalize<Event>}`; // \"onClick\" | \"onFocus\"\nconst prop: Handle"
    }
  ],
  "pitfalls": [
    "Template with non-string union member — constrain E extends string."
  ],
  "interview": {
    "expectations": [
      "Explain Template Literal Types with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "Distributive over union in template parts."
    ],
    "commonQuestions": [
      "What is Template Literal Types?",
      "When would you choose Template Literal Types over alternatives?",
      "What is the classic Template Literal Types interview trap?"
    ],
    "traps": [
      "Template with non-string union member — constrain E extends string."
    ],
    "misconceptions": [
      "Interview topic — template literal event handlers in React/design systems."
    ],
    "strongSignals": [
      "Uses Template Literal Types to remove invalid states, not just document them."
    ]
  }
})
