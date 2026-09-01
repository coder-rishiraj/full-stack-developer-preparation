import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'JavaScript uses prototypal inheritance: objects delegate property lookup to another object via the internal [[Prototype]] link (exposed as `Object.getPrototypeOf` / `__proto__`). Constructor functions have a `.prototype` object; `new` instances link to that prototype.',
  whyExists:
    'Sharing behavior without copying methods on every instance saves memory and enables dynamic dispatch. Prototypes predate ES6 classes — classes are syntactic sugar over the same delegation mechanism.',
  mentalModel:
    'Each object has a hidden back-pointer to a parent object. Property read walks the chain until found or null. Writes always go on the object itself (shadowing), not up the chain — unless the property is a setter on a prototype.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Object.create(proto) creates object with [[Prototype]] = proto.',
        'new Fn() creates object, links [[Prototype]] to Fn.prototype, runs Fn as constructor.',
        'Lookup: own property → prototype chain → null → undefined.',
        'Fn.prototype is object; adding methods shared by instances.',
        'class extends wires subclass.prototype.__proto__ to superclass.prototype.',
      ],
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'prototype vs __proto__',
      text: 'Fn.prototype is the template object for instances. instance.__proto__ (legacy name) is [[Prototype]] — link to template. Prefer Object.getPrototypeOf.',
    },
  ],
  architecture: {
    mermaid: `flowchart TB
  Inst[instance]
  CtorProto[Constructor.prototype]
  ObjProto[Object.prototype]
  Null[null]
  Inst -->|[[Prototype]]| CtorProto
  CtorProto -->|[[Prototype]]| ObjProto
  ObjProto -->|[[Prototype]]| Null
  Ctor[Constructor fn] -.->|prototype property| CtorProto`,
    caption: 'Property lookup walks [[Prototype]] chain; constructor.prototype is the delegate target',
  },
  example: [
    {
      type: 'code',
      language: 'javascript',
      caption: 'Constructor + prototype chain',
      code: `function Person(name) {
  this.name = name;
}
Person.prototype.greet = function () {
  return \`Hi, \${this.name}\`;
};

const ada = new Person('Ada');
ada.greet(); // Hi, Ada — delegated to Person.prototype

console.log(Object.getPrototypeOf(ada) === Person.prototype); // true
console.log('toString' in ada); // true — from Object.prototype`,
    },
    {
      type: 'code',
      language: 'javascript',
      caption: 'Object.create and shadowing',
      code: `const animal = { speaks: false };
const dog = Object.create(animal);
dog.speaks = true; // own property shadows prototype

console.log(dog.speaks);        // true
console.log(animal.speaks);     // false — prototype unchanged

// Avoid mutating Object.prototype
const obj = {};
obj.customProp; // undefined — don't pollute Object.prototype`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        '[[Prototype]] null ends chain; Object.prototype common ancestor.',
        'hasOwnProperty vs in operator — own vs chain.',
        'Object.setPrototypeOf mutates link — deopts optimizations in engines.',
        'Getter/setter on prototype invoked with this = instance.',
        'Symbol.hasInstance customizes instanceof for constructors.',
      ],
    },
  ],
  implementation: [
    {
      language: 'javascript',
      caption: 'Minimal new polyfill mental model',
      code: `function myNew(Ctor, ...args) {
  const obj = Object.create(Ctor.prototype);
  const result = Ctor.apply(obj, args);
  return result instanceof Object ? result : obj;
}`,
    },
  ],
  tradeoffs: {
    advantages: [
      'Shared methods — memory efficient',
      'Dynamic extension of prototypes (monkey patching — use carefully)',
      'Flexible delegation without classes',
    ],
    disadvantages: [
      'Prototype pollution security risk if merging untrusted objects',
      'Confusing prototype vs __proto__ naming',
      'instanceof breaks across realms/iframes',
    ],
    alternatives: ['ES6 classes (same mechanism)', 'Composition over inheritance', 'Object.assign for mixins'],
    whenToUse: ['Understanding classes, instanceof, hasOwnProperty debugging'],
    whenNotToUse: ['Deep inheritance hierarchies — favor composition'],
  },
  failureModes: [
    'Mutating Object.prototype affects all objects.',
    'Prototype pollution via __proto__ in JSON parse (use Object.create(null) maps).',
    'Wrong this when extracting prototype method.',
    'Replacing constructor.prototype breaks instanceof for old instances.',
  ],
  production: {
    performance: ['Avoid setPrototypeOf in hot paths', 'Shared prototype methods are cache-friendly'],
    security: ['Freeze Object.prototype; validate keys when merging user JSON', 'Map over object for untrusted keys'],
    maintainability: ['Prefer classes for team readability; document any prototype patches'],
  },
  interview: {
    expectations: [
      'Draw prototype chain for new',
      'Difference prototype property vs [[Prototype]]',
      'Object.create vs {}',
    ],
    commonQuestions: ['How does new work?', 'What is __proto__?', 'Implement Object.create?'],
    followUps: ['class extends prototype wiring?', 'Prototype pollution?'],
    misconceptions: ['Methods copied onto each instance', 'prototype is same as constructor'],
    traps: ['Changing Fn.prototype after some instances created'],
    strongSignals: ['Delegation chain, shared Fn.prototype, shadowing, Object.getPrototypeOf'],
  },
  keyTakeaways: [
    'Objects delegate via [[Prototype]] — not class copying.',
    'Constructor.prototype is shared method object for instances.',
    'new links instance to Constructor.prototype.',
    'Property write shadows; read walks chain.',
    'Classes are prototype sugar — same underlying model.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What is the prototype chain?',
      answerHint: 'Linked [[Prototype]] objects consulted for property lookup until null.',
    },
    {
      level: 'intermediate',
      question: 'What does new Person() do regarding prototypes?',
      answerHint: 'Creates object, sets [[Prototype]] to Person.prototype, runs Person with this.',
    },
    {
      level: 'advanced',
      question: 'What is prototype pollution?',
      answerHint: 'Injecting properties onto Object.prototype via __proto__/constructor.prototype merge attacks.',
    },
  ],
  flashcards: [
    { front: 'Fn.prototype vs instance [[Prototype]]', back: 'Template object vs instance delegate link' },
    { front: 'Property lookup', back: 'Own → chain → null' },
    { front: 'Object.create(p)', back: 'New object with [[Prototype]] = p' },
  ],
  quickRevision: [
    'Delegation not copy',
    'new → link to .prototype',
    'Lookup walks chain',
    'Write shadows on own',
    'class = prototype sugar',
    'Never pollute Object.prototype',
  ],
}
