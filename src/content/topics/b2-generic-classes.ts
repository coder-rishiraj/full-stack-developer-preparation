import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Generic Classes",
  "whatIsIt": "Classes can be generic: class Box<T> { constructor(public value: T) {} }. Static members cannot use class type params. Generic subclasses fix or extend type params: class StringBox extends Box<string>.",
  "whyExists": "Containers, results, and state holders reuse one class for many types.",
  "mentalModel": "Typed shipping box class — label says contents type.",
  "how": [
    "class Stack<T> { private items: T[] = []; push(x: T) { this.items.push(x); } pop(): T | undefined { return this.items.pop(); } }",
    "Implement generic interfaces on generic classes.",
    "Factory methods as static with own generics.",
    "React components: function List<T>(props: { items: T[] }).",
    "Default generic params on class: Box<T = unknown>."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Static method trying to use class T without its own type param — illegal.",
    "variant": "warning"
  },
  "example": "class Result<T, E = Error> {\n  constructor(public ok: boolean, public value?: T, public error?: E) {}\n  static success<T>(value: T) { return new Result<T>(true, value); }\n}\nconsole.log(Result.success(42).value);\n// TypeScript validates this file before emit\n// Strict mode catches misuse at compile time\n// Annotations are erased — zero runtime overhead",
  "exampleCaption": "Generic Result with static success factory",
  "internals": [
    "Class generic params scoped to instance side.",
    "Emit preserves generics erasure — runtime untyped.",
    "Specialization in extends fixes type argument."
  ],
  "takeaways": [
    "class Stack<T> { private items: T[] = []; push(x: T) { this.items.push(x); } pop(): T | undefined { return this.items.pop(); } }",
    "Implement generic interfaces on generic classes.",
    "Static method trying to use class T without its own type param — illegal.",
    "Class generic params scoped to instance side."
  ],
  "revision": [
    "Generic Classes: Typed shipping box class — label says contents type.",
    "class Stack<T> { private items: T[] = []; push(x: T) { this.items.push(x); } pop(): T | undefined { return this.items.pop(); } }",
    "Implement generic interfaces on generic classes.",
    "Factory methods as static with own generics.",
    "Trap: Static method trying to use class T without its own type param — illegal."
  ],
  "flashcards": [
    [
      "Generic Classes",
      "Classes can be generic: class Box<T> { constructor(public value: T) {} }."
    ],
    [
      "Mental model",
      "Typed shipping box class — label says contents type."
    ],
    [
      "Common trap",
      "Static method trying to use class T without its own type param — illegal."
    ],
    [
      "class Stack<T> { private items: T[] = []; push(x: T) { this.items.push(x); } pop",
      "Implement generic interfaces on generic classes."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Generic Classes in TypeScript and when do you use it?",
      "answerHint": "Classes can be generic: class Box<T> { constructor(public value: T) {} }. Static members cannot use class type params. Generic subclasses fix or extend type params: class StringBox extends Box<string>."
    },
    {
      "level": "intermediate",
      "question": "Explain Generic Classes with a code example and one pitfall.",
      "answerHint": "class Stack<T> { private items: T[] = []; push(x: T) { this.items.push(x); } pop(): T | undefined { return this.items.pop(); } } Implement generic interfaces on generic classes. Factory methods as static with own generics. React components: function List<T>(props: { items: T[] }). Default generic params on class: Box<T = unknown>. Pitfall: Static method trying to use class T without its own type param — illegal."
    },
    {
      "level": "advanced",
      "question": "How would you explain Generic Classes in a senior frontend interview?",
      "answerHint": "Class generic params scoped to instance side. Emit preserves generics erasure — runtime untyped. Specialization in extends fixes type argument. class Result<T, E = Error> {\n  constructor(public ok: boolean, public value?: T, public error?: E) {}\n  static success<T"
    }
  ],
  "pitfalls": [
    "Static method trying to use class T without its own type param — illegal."
  ],
  "interview": {
    "expectations": [
      "Explain Generic Classes with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "Class generic params scoped to instance side."
    ],
    "commonQuestions": [
      "What is Generic Classes?",
      "When would you choose Generic Classes over alternatives?",
      "What is the classic Generic Classes interview trap?"
    ],
    "traps": [
      "Static method trying to use class T without its own type param — illegal."
    ],
    "misconceptions": [
      "Containers, results, and state holders reuse one class for many types."
    ],
    "strongSignals": [
      "Uses Generic Classes to remove invalid states, not just document them."
    ]
  }
})
