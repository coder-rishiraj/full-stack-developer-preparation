import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'ES6 classes are syntactic sugar over JavaScript prototype inheritance. `class` declares a constructor function with a prototype, supports `extends` for subclassing, `super` for parent access, static/instance methods, and private fields (#).',
  whyExists:
    'Pre-ES6 constructor + prototype patterns were verbose and inconsistent. Classes provide familiar OOP syntax while preserving JS prototype model — not a separate class-based type system like Java.',
  mentalModel:
    'A class is a blueprint whose instances are objects delegating to `ClassName.prototype`. `new` creates an object, runs constructor, links `[[Prototype]]` to prototype. Inheritance = prototype chain, not copied fields.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Class body methods live on prototype; constructor runs on new.',
        'extends sets up prototype chain: subclass.prototype.__proto__ → superclass.prototype.',
        'super in constructor must run before using `this` in subclass.',
        'super.method() uses home object lookup — dynamic dispatch on prototype chain.',
        'Static methods on constructor; private #fields are truly private (not on prototype).',
      ],
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'Not hoisted like function declarations',
      text: 'Classes are in TDZ until definition — ReferenceError if used before line. Use function declarations if hoisting needed.',
    },
  ],
  architecture: {
    mermaid: `flowchart TB
  Inst[instance]
  SubProto[SubClass.prototype]
  SuperProto[SuperClass.prototype]
  ObjProto[Object.prototype]
  Inst -->|[[Prototype]]| SubProto
  SubProto -->|[[Prototype]]| SuperProto
  SuperProto -->|[[Prototype]]| ObjProto`,
    caption: 'Instance delegates to subclass prototype, then superclass prototype chain',
  },
  example: [
    {
      type: 'code',
      language: 'javascript',
      caption: 'extends, super, private fields',
      code: `class Animal {
  constructor(name) { this.name = name; }
  speak() { return \`\${this.name} makes a sound\`; }
}

class Dog extends Animal {
  #breed;
  constructor(name, breed) {
    super(name);
    this.#breed = breed;
  }
  speak() { return \`\${super.speak()} — woof (\${this.#breed})\`; }
}

const d = new Dog('Rex', 'lab');
d.speak(); // Rex makes a sound — woof (lab)`,
    },
    {
      type: 'code',
      language: 'javascript',
      caption: 'static vs instance',
      code: `class Id {
  static #next = 1;
  static generate() { return Id.#next++; }
  constructor() { this.id = Id.generate(); }
}
new Id().id; // 1
Id.generate(); // 2`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Class definitions set [[ConstructorKind]] base/derived; derived needs super call.',
        'Methods are non-enumerable by default (unlike object literal methods in old style).',
        'Fields (public instance fields) run after super returns in subclass.',
        'instanceof walks prototype chain via Symbol.hasInstance on constructor.',
        'Mixins: copy descriptors onto prototype or use class extends with intermediate.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Readable inheritance and super',
      'Private fields for encapsulation',
      'Static blocks and methods for factory patterns',
    ],
    disadvantages: [
      'Still prototype under hood — surprises for Java/C# devs',
      'this binding issues if methods passed unbound',
      'Deep hierarchies brittle vs composition',
    ],
    alternatives: ['Factory functions + closures', 'Object composition', 'TypeScript interfaces + plain objects'],
    whenToUse: ['Domain models, React class components (legacy), framework base classes'],
    whenNotToUse: ['Shallow data — plain objects; prefer functions + composition for flexibility'],
  },
  failureModes: [
    'Using this before super() in derived constructor — ReferenceError.',
    'Passing instance method without bind — lost this.',
    'Assuming class copies parent instance fields (only prototype methods inherited).',
    'Extending built-ins (Array) needs special care for species pattern.',
  ],
  production: {
    performance: ['Class overhead ≈ constructor+prototype; negligible for domain objects'],
    maintainability: ['Favor composition; keep hierarchies shallow; use private fields over _ convention'],
    reliability: ['Bind handlers once or use arrow class fields in React'],
  },
  interview: {
    expectations: [
      'Classes are prototypes sugar',
      'super rules in constructor',
      'Prototype chain diagram for extends',
    ],
    commonQuestions: ['Class vs constructor function?', 'What is super?', 'Private fields #?'],
    followUps: ['Implement inheritance without class?', 'static vs instance?'],
    misconceptions: ['Classes are copied inheritance like Java', 'Methods on instance not prototype'],
    traps: ['Hoisting class before declaration', 'Arrow as prototype method for this on instance'],
    strongSignals: ['Prototype chain, super before this, # privacy, TDZ'],
  },
  keyTakeaways: [
    'class is syntactic sugar over prototype + constructor.',
    'extends links prototype chains; super calls parent.',
    'Derived constructor must call super() before this.',
    '#fields are truly private.',
    'Methods on prototype — shared, not per-instance copies.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Are ES6 classes the same as Java classes?',
      answerHint: 'No — prototype inheritance under hood; no class copying.',
    },
    {
      level: 'intermediate',
      question: 'What happens if you use this before super() in a subclass?',
      answerHint: 'ReferenceError — derived must call super() first.',
    },
    {
      level: 'advanced',
      question: 'Where do class methods live — instance or prototype?',
      answerHint: 'On prototype object; shared via delegation.',
    },
  ],
  flashcards: [
    { front: 'class under the hood', back: 'Constructor function + prototype' },
    { front: 'super in constructor', back: 'Must call before using this in subclass' },
    { front: '#field', back: 'True private — not on prototype, not accessible outside' },
  ],
  quickRevision: [
    'class = prototype sugar',
    'new → constructor + link prototype',
    'extends chains prototypes',
    'super() before this in derived',
    'Methods on prototype shared',
    '# private fields; static on ctor',
  ],
}
